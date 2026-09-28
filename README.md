# PATRICIAN HACKATHON 2026 — AI FAQ Assistant

A full-stack hackathon registration website with an integrated **AI FAQ Assistant** powered by Retrieval-Augmented Generation (RAG).

## 🚀 Tech Stack

- **Frontend:** React 18, Vite, TypeScript, Tailwind CSS, Lucide Icons
- **Backend:** Node.js, Express 4.x, Mongoose (MongoDB)
- **AI Engine:** Google Gemini 1.5 Flash (with offline RAG Semantic Mock fallback)

## ✨ Features

- 🤖 Floating AI FAQ Chatbot (bottom-right) with grounded, hallucination-free answers
- 🧠 Retrieval-Augmented Generation (RAG) with semantic similarity scoring
- 🔒 Admin-protected FAQ Knowledge Base CRUD (create, edit, delete FAQs)
- 📧 Email confirmation dispatch via Nodemailer
- 🗃️ MongoDB + local JSON hybrid persistence
- 🎨 Cyberpunk dark UI theme (neon cyan/purple)

## 📁 Project Structure

```
├── src/                        # React frontend
│   ├── components/
│   │   ├── chat/AIChatbot.tsx  # Floating AI chatbot widget
│   │   ├── admin/              # Admin dashboard & FAQ management
│   │   └── sections/FAQ.tsx    # Live FAQ section
│   ├── services/
│   │   └── faqChatService.ts   # Frontend API client
│   └── pages/                  # Home, Register, Problems, Admin
├── server/                     # Express backend
│   ├── models/FAQ.js           # Mongoose FAQ schema
│   ├── services/
│   │   ├── aiService.js        # RAG + Gemini LLM engine
│   │   └── faqStore.js         # Hybrid MongoDB/JSON storage
│   ├── routes/faqRoutes.js     # REST API endpoints
│   ├── middleware/security.js  # Rate limiting & admin auth
│   └── server.js               # Express entry point
```

## 🔌 API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/health` | Public | Health check with AI status |
| POST | `/api/chat` | Public | AI natural language Q&A |
| GET | `/api/faqs` | Public | List all FAQs |
| GET | `/api/faqs/:id` | Public | Get single FAQ |
| POST | `/api/faqs` | Admin | Create new FAQ |
| PUT | `/api/faqs/:id` | Admin | Update FAQ |
| DELETE | `/api/faqs/:id` | Admin | Delete FAQ |

## ⚙️ Environment Variables

Copy `server/.env.example` to `server/.env` and fill in:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/patrician_hackathon
ADMIN_SECRET_TOKEN=Pcas@2026
GEMINI_API_KEY=your_gemini_api_key_here   # optional
```

> Without `GEMINI_API_KEY`, the assistant runs in offline Grounded RAG Mock mode (no hallucinations).

## 🏃 Running Locally

### 1. Install dependencies

```bash
# Frontend
npm install

# Backend
cd server && npm install
```

### 2. Start the Backend
```bash
cd server
npm start
# Server: http://localhost:5000
```

### 3. Start the Frontend
```bash
npm run dev
# App: http://localhost:3000
```

### 4. Admin Panel
Navigate to `http://localhost:3000/admin`  
Username: `Pcas` | Password: `Pcas@2026`

## 🧪 Running Tests

```bash
cd server
node test/e2e-test.js
# 30 PASSED, 0 FAILED
```

## 📄 License

MIT
