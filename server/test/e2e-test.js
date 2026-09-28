import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const SERVER_DIR = path.join(__dirname, '..');

const BASE_URL = 'http://localhost:5000/api';
const ADMIN_TOKEN = 'Pcas@2026';

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function runTestSuite() {
  console.log('=====================================================');
  console.log('   PATRICIAN HACKATHON 2026: AI FAQ ASSISTANT TESTS  ');
  console.log('=====================================================\n');

  // Start server as child process
  console.log('1. Starting Backend Server...');
  const serverProcess = spawn('node', ['server.js'], {
    cwd: SERVER_DIR,
    env: { ...process.env, PORT: '5000' },
    stdio: ['ignore', 'pipe', 'pipe']
  });

  let serverStarted = false;
  serverProcess.stdout.on('data', (data) => {
    const str = data.toString();
    if (str.includes('running on port 5000')) {
      serverStarted = true;
    }
  });

  serverProcess.stderr.on('data', (data) => {
    const errStr = data.toString();
    if (!errStr.includes('ECONNREFUSED')) {
      console.error('[Server Error Output]:', errStr);
    }
  });

  // Wait for server to boot
  let attempts = 0;
  while (!serverStarted && attempts < 30) {
    await sleep(200);
    attempts++;
  }

  if (!serverStarted) {
    console.error('Server failed to start in time. Aborting tests.');
    serverProcess.kill();
    process.exit(1);
  }

  console.log('Backend Server is ONLINE on port 5000.\n');

  let passed = 0;
  let failed = 0;

  function assert(condition, testName, details = '') {
    if (condition) {
      console.log(`  [PASS] ${testName}`);
      passed++;
    } else {
      console.error(`  [FAIL] ${testName}: ${details}`);
      failed++;
    }
  }

  try {
    // TEST 1: Health Check Endpoint
    console.log('--- Suite 1: Health Check & System Status ---');
    const healthRes = await fetch(`${BASE_URL}/health`);
    const healthData = await healthRes.json();
    assert(healthRes.status === 200, 'GET /api/health returns HTTP 200');
    assert(healthData.status === 'OK', 'Health status is "OK"');
    assert(healthData.aiAssistant && healthData.aiAssistant.status === 'Active', 'AI Assistant is reported Active');
    assert(healthData.aiAssistant.faqKnowledgeBaseCount >= 10, `Knowledge base count >= 10 (actual: ${healthData.aiAssistant.faqKnowledgeBaseCount})`);

    // TEST 2: Retrieve FAQs
    console.log('\n--- Suite 2: FAQ Knowledge Base Retrieval ---');
    const faqsRes = await fetch(`${BASE_URL}/faqs`);
    const faqsData = await faqsRes.json();
    assert(faqsRes.status === 200, 'GET /api/faqs returns HTTP 200');
    assert(Array.isArray(faqsData.faqs) && faqsData.faqs.length >= 10, 'Returned list contains seeded FAQs');

    // Filter by Category
    const filteredRes = await fetch(`${BASE_URL}/faqs?category=Eligibility`);
    const filteredData = await filteredRes.json();
    assert(filteredData.faqs.every(f => f.category.toLowerCase() === 'eligibility'), 'Filter by category "Eligibility" works accurately');

    // Retrieve Single FAQ by ID
    const singleFaqRes = await fetch(`${BASE_URL}/faqs/faq-3`);
    const singleFaqData = await singleFaqRes.json();
    assert(singleFaqRes.status === 200 && singleFaqData.faq.id === 'faq-3', 'GET /api/faqs/faq-3 retrieves exact item');

    // TEST 3: AI Natural Language Chat & Grounded RAG
    console.log('\n--- Suite 3: AI Chat & Semantic Grounding ---');
    
    // 3a. Greeting Handling
    const greetingRes = await fetch(`${BASE_URL}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: 'Hello! Who are you?' })
    });
    const greetingData = await greetingRes.json();
    assert(greetingRes.status === 200, 'POST /api/chat with greeting returns HTTP 200');
    assert(greetingData.mode === 'greeting', 'Greeting handled via greeting mode');
    assert(greetingData.reply.includes('Patrician Hackathon 2026 AI Assistant'), 'Greeting reply introduces the assistant');

    // 3b. Grounded Query: Registration Fee
    const feeRes = await fetch(`${BASE_URL}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: 'How much does it cost per person to join?' })
    });
    const feeData = await feeRes.json();
    assert(feeData.success === true, 'Fee query succeeded');
    assert(feeData.reply.includes('₹100'), 'AI response correctly cites ₹100 registration fee');
    assert(feeData.sources && feeData.sources.some(s => s.id === 'faq-3'), 'Grounding cited source faq-3');

    // 3c. Rephrased Query: Prize Distribution
    const prizeRes = await fetch(`${BASE_URL}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: 'What is the cash reward if we win first prize?' })
    });
    const prizeData = await prizeRes.json();
    assert(prizeData.success === true, 'Prize query succeeded');
    assert(prizeData.reply.includes('50,000') || prizeData.reply.includes('1,00,000'), 'AI response correctly mentions prize amounts (₹50,000 / ₹1,00,000+)');

    // 3d. Rephrased Query: Tech Stack Liberty
    const techRes = await fetch(`${BASE_URL}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: 'Can we build using Python and Flutter?' })
    });
    const techData = await techRes.json();
    assert(techData.reply.toLowerCase().includes('python') || techData.reply.toLowerCase().includes('react'), 'AI response correctly cites allowed tech stacks');

    // 3e. Out-of-Domain Question -> Grounded Fallback
    const fallbackRes = await fetch(`${BASE_URL}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: 'What is the recipe for chocolate brownies?' })
    });
    const fallbackData = await fallbackRes.json();
    assert(fallbackData.mode === 'fallback', 'Out-of-domain query triggers safe fallback mode');
    assert(fallbackData.reply.includes('could not find specific information'), 'Fallback safely states information could not be found');
    assert(fallbackData.reply.includes('contact@patriciancollege.ac.in'), 'Fallback provides organizer contact email');

    // 3f. Input Validation: Empty / whitespace query
    const emptyRes = await fetch(`${BASE_URL}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: '   ' })
    });
    assert(emptyRes.status === 400, 'Empty message rejected with HTTP 400 Bad Request');

    // TEST 4: Security & Admin FAQ Management
    console.log('\n--- Suite 4: Security & Admin CRUD Operations ---');

    // 4a. Unauthorized creation attempt
    const unauthPost = await fetch(`${BASE_URL}/faqs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question: 'Test?', answer: 'Test!' })
    });
    assert(unauthPost.status === 401, 'POST /api/faqs without token rejected with HTTP 401 Unauthorized');

    // 4b. Invalid token creation attempt
    const invalidTokenPost = await fetch(`${BASE_URL}/faqs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-admin-token': 'wrong-password' },
      body: JSON.stringify({ question: 'Test?', answer: 'Test!' })
    });
    assert(invalidTokenPost.status === 403, 'POST /api/faqs with invalid token rejected with HTTP 403 Forbidden');

    // 4c. Authorized creation
    const authPost = await fetch(`${BASE_URL}/faqs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-admin-token': ADMIN_TOKEN },
      body: JSON.stringify({
        question: 'Will high-speed Wi-Fi and power strips be provided at each squad workstation?',
        answer: 'Yes! Dedicated gigabit Wi-Fi networks and multi-plug extension boards will be allocated to every team workstation throughout the 24-hour sprint.',
        category: 'Venue & Logistics',
        source: 'Facility Guidelines',
        keywords: ['wifi', 'internet', 'power', 'chargers', 'workstation']
      })
    });
    const authPostData = await authPost.json();
    assert(authPost.status === 201, 'POST /api/faqs with valid admin token creates FAQ (HTTP 201)');
    const createdId = authPostData.faq?.id;
    assert(Boolean(createdId), `Created FAQ has assigned ID: ${createdId}`);

    // 4d. Verify AI immediately grounds on newly created FAQ!
    const newFaqQuery = await fetch(`${BASE_URL}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: 'Is there fast wifi and power chargers at the tables?' })
    });
    const newFaqQueryData = await newFaqQuery.json();
    assert(newFaqQueryData.reply.toLowerCase().includes('wi-fi') || newFaqQueryData.reply.toLowerCase().includes('power'), 'AI answers immediately using newly created admin FAQ!');

    // 4e. Authorized update
    const updateRes = await fetch(`${BASE_URL}/faqs/${createdId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'x-admin-token': ADMIN_TOKEN },
      body: JSON.stringify({
        answer: 'Updated: Yes, ultra-fast 10Gbps Wi-Fi and surge protectors are provided at each squad desk.'
      })
    });
    const updateData = await updateRes.json();
    assert(updateRes.status === 200, 'PUT /api/faqs/:id updates FAQ (HTTP 200)');
    assert(updateData.faq.answer.includes('10Gbps'), 'Updated content persisted');

    // 4f. Authorized delete
    const deleteRes = await fetch(`${BASE_URL}/faqs/${createdId}`, {
      method: 'DELETE',
      headers: { 'x-admin-token': ADMIN_TOKEN }
    });
    assert(deleteRes.status === 200, 'DELETE /api/faqs/:id deletes FAQ (HTTP 200)');

    // Verify deletion
    const verifyDelRes = await fetch(`${BASE_URL}/faqs/${createdId}`);
    assert(verifyDelRes.status === 404, 'Deleted FAQ returns HTTP 404');

  } catch (err) {
    console.error('Unhandled test suite error:', err);
    failed++;
  } finally {
    // Terminate server process cleanly
    serverProcess.kill();
    console.log('\n=====================================================');
    console.log(`TEST SUMMARY: ${passed} PASSED, ${failed} FAILED`);
    console.log('=====================================================\n');
    process.exit(failed === 0 ? 0 : 1);
  }
}

runTestSuite();
