import React, { useState, useEffect, useMemo } from 'react';
import { 
  HelpCircle, 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  Save, 
  X, 
  RefreshCw, 
  AlertCircle, 
  CheckCircle2, 
  Bot, 
  Sparkles,
  Tag,
  BookOpen,
  Filter
} from 'lucide-react';
import { CyberButton } from '../common/CyberButton';
import { GlassCard } from '../common/GlassCard';
import { 
  fetchFaqs, 
  createFaq, 
  updateFaq, 
  deleteFaq, 
  FAQItemData 
} from '../../services/faqChatService';

const PRESET_CATEGORIES = [
  'Eligibility',
  'Team & Registration',
  'Payment & Fees',
  'Technical & Rules',
  'Event Format & Venue',
  'Submission',
  'Certificates & Swag',
  'Judging',
  'Prizes & Awards',
  'General'
];

export const FaqManagementTab: React.FC = () => {
  const [faqs, setFaqs] = useState<FAQItemData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [notification, setNotification] = useState<{ message: string; isError?: boolean } | null>(null);

  // Modal / Form state for Add/Edit
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingFaq, setEditingFaq] = useState<FAQItemData | null>(null);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  const [formData, setFormData] = useState<{
    question: string;
    answer: string;
    category: string;
    source: string;
    keywords: string;
  }>({
    question: '',
    answer: '',
    category: 'General',
    source: 'Patrician Hackathon 2026 Official Guide',
    keywords: ''
  });

  const showNotification = (message: string, isError = false) => {
    setNotification({ message, isError });
    setTimeout(() => setNotification(null), 4000);
  };

  const loadFaqs = async () => {
    setIsLoading(true);
    try {
      const data = await fetchFaqs();
      setFaqs(data);
    } catch (err: any) {
      showNotification('Failed to load FAQs: ' + err.message, true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadFaqs();
  }, []);

  const openAddModal = () => {
    setEditingFaq(null);
    setFormData({
      question: '',
      answer: '',
      category: 'General',
      source: 'Patrician Hackathon 2026 Official Guide',
      keywords: ''
    });
    setIsModalOpen(true);
  };

  const openEditModal = (faq: FAQItemData) => {
    setEditingFaq(faq);
    setFormData({
      question: faq.question,
      answer: faq.answer,
      category: faq.category || 'General',
      source: faq.source || 'Patrician Hackathon 2026 Official Guide',
      keywords: Array.isArray(faq.keywords) ? faq.keywords.join(', ') : ''
    });
    setIsModalOpen(true);
  };

  const handleSaveFaq = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.question.trim() || !formData.answer.trim()) {
      showNotification('Question and Answer are required fields.', true);
      return;
    }

    setIsSaving(true);
    const keywordsArray = formData.keywords
      .split(',')
      .map(k => k.trim())
      .filter(Boolean);

    try {
      if (editingFaq) {
        // Update existing FAQ
        const updated = await updateFaq(editingFaq.id, {
          question: formData.question.trim(),
          answer: formData.answer.trim(),
          category: formData.category,
          source: formData.source.trim(),
          keywords: keywordsArray
        });
        setFaqs(prev => prev.map(f => f.id === editingFaq.id ? updated : f));
        showNotification(`FAQ "${updated.id}" updated successfully!`);
      } else {
        // Create new FAQ
        const created = await createFaq({
          question: formData.question.trim(),
          answer: formData.answer.trim(),
          category: formData.category,
          source: formData.source.trim(),
          keywords: keywordsArray
        });
        setFaqs(prev => [created, ...prev]);
        showNotification(`New FAQ added to knowledge base!`);
      }
      setIsModalOpen(false);
    } catch (err: any) {
      showNotification(err.message || 'Operation failed', true);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteFaq = async (id: string, question: string) => {
    if (!window.confirm(`Are you sure you want to delete this FAQ?\n\n"${question}"`)) {
      return;
    }

    try {
      await deleteFaq(id);
      setFaqs(prev => prev.filter(f => f.id !== id));
      showNotification(`FAQ "${id}" deleted.`);
    } catch (err: any) {
      showNotification(err.message || 'Failed to delete FAQ', true);
    }
  };

  // Filtered FAQs
  const filteredFaqs = useMemo(() => {
    return faqs.filter(faq => {
      const matchesCategory = selectedCategory === 'ALL' || faq.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q || 
        faq.question.toLowerCase().includes(q) || 
        faq.answer.toLowerCase().includes(q) ||
        (faq.keywords && faq.keywords.some(k => k.toLowerCase().includes(q)));

      return matchesCategory && matchesSearch;
    });
  }, [faqs, selectedCategory, searchQuery]);

  // Categories present in data
  const availableCategories = useMemo(() => {
    const cats = new Set<string>();
    faqs.forEach(f => {
      if (f.category) cats.add(f.category);
    });
    PRESET_CATEGORIES.forEach(c => cats.add(c));
    return ['ALL', ...Array.from(cats)];
  }, [faqs]);

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {notification && (
        <div
          className={`p-4 rounded-xl flex items-center justify-between gap-3 text-sm font-mono border animate-in fade-in duration-200 ${
            notification.isError
              ? 'bg-red-950/80 border-red-500/50 text-red-200'
              : 'bg-cyan-950/80 border-cyan-500/50 text-cyan-200'
          }`}
        >
          <div className="flex items-center gap-2">
            {notification.isError ? (
              <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
            ) : (
              <CheckCircle2 className="w-5 h-5 text-cyan-400 shrink-0" />
            )}
            <span>{notification.message}</span>
          </div>
          <button onClick={() => setNotification(null)} className="text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Top Header Card */}
      <GlassCard glow="cyan" className="p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Bot className="w-6 h-6 text-cyan-400" />
              <h2 className="text-xl font-display font-bold text-white uppercase tracking-wider">
                AI FAQ & Knowledge Base Management
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-400">
              Manage the authoritative questions and answers that ground the live AI Assistant chatbot.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <CyberButton
              variant="secondary"
              size="sm"
              onClick={loadFaqs}
              isLoading={isLoading}
              leftIcon={<RefreshCw className="w-4 h-4" />}
            >
              Refresh
            </CyberButton>

            <CyberButton
              variant="primary"
              size="sm"
              onClick={openAddModal}
              leftIcon={<Plus className="w-4 h-4" />}
            >
              Add New FAQ
            </CyberButton>
          </div>
        </div>

        {/* Quick Stats Pill Strip */}
        <div className="mt-6 pt-4 border-t border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
            <div className="text-xl font-display font-bold text-cyan-400">{faqs.length}</div>
            <div className="text-[11px] font-mono text-slate-400 uppercase">Total FAQs</div>
          </div>
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
            <div className="text-xl font-display font-bold text-emerald-400">{availableCategories.length - 1}</div>
            <div className="text-[11px] font-mono text-slate-400 uppercase">Categories</div>
          </div>
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
            <div className="text-xl font-display font-bold text-purple-400">RAG Grounded</div>
            <div className="text-[11px] font-mono text-slate-400 uppercase">AI Knowledge Sync</div>
          </div>
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
            <div className="text-xl font-display font-bold text-cyan-300">Active</div>
            <div className="text-[11px] font-mono text-slate-400 uppercase">Live Floating Bot</div>
          </div>
        </div>
      </GlassCard>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search FAQs by question, answer, or keywords..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-900/80 border border-slate-800 focus:border-cyan-500/60 rounded-xl text-sm text-white placeholder-slate-500 outline-none transition-all font-mono"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 custom-scrollbar">
          <Filter className="w-4 h-4 text-cyan-400 shrink-0 hidden sm:block" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-slate-900/90 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-cyan-300 focus:border-cyan-500/60 outline-none"
          >
            {availableCategories.map(cat => (
              <option key={cat} value={cat} className="bg-slate-950 text-white">
                {cat === 'ALL' ? 'All Categories' : cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* FAQs List */}
      {isLoading ? (
        <div className="p-12 text-center text-slate-400 font-mono text-sm animate-pulse">
          Loading FAQ knowledge base from backend...
        </div>
      ) : filteredFaqs.length === 0 ? (
        <GlassCard glow="none" className="p-12 text-center">
          <HelpCircle className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-display font-bold text-slate-300 uppercase">No FAQs Found</h3>
          <p className="text-xs font-mono text-slate-500 mt-1">
            Try adjusting your search criteria or add a new FAQ to the knowledge base.
          </p>
        </GlassCard>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredFaqs.map((faq) => (
            <GlassCard
              key={faq.id}
              glow="none"
              className="p-5 hover:border-cyan-500/40 transition-all duration-200"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                      {faq.category || 'General'}
                    </span>
                    <span className="text-[11px] font-mono text-slate-500">
                      ID: {faq.id}
                    </span>
                  </div>

                  <h3 className="text-base font-display font-bold text-white tracking-wide">
                    {faq.question}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed whitespace-pre-wrap">
                    {faq.answer}
                  </p>

                  <div className="pt-2 flex flex-wrap items-center gap-3 text-[11px] font-mono text-slate-400">
                    {faq.source && (
                      <span className="flex items-center gap-1 text-slate-500">
                        <BookOpen className="w-3 h-3 text-cyan-400" />
                        {faq.source}
                      </span>
                    )}

                    {faq.keywords && faq.keywords.length > 0 && (
                      <div className="flex items-center gap-1 flex-wrap">
                        <Tag className="w-3 h-3 text-slate-500" />
                        {faq.keywords.map((kw, i) => (
                          <span key={i} className="px-1.5 py-0.2 rounded bg-slate-800 text-[10px] text-slate-400">
                            #{kw}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex sm:flex-col items-center gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-800">
                  <button
                    onClick={() => openEditModal(faq)}
                    className="p-2 rounded-lg bg-slate-800/80 hover:bg-cyan-950 hover:text-cyan-300 text-slate-300 border border-slate-700/60 hover:border-cyan-500/50 transition-colors cursor-pointer"
                    title="Edit FAQ"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteFaq(faq.id, faq.question)}
                    className="p-2 rounded-lg bg-slate-800/80 hover:bg-red-950/80 hover:text-red-400 text-slate-300 border border-slate-700/60 hover:border-red-500/50 transition-colors cursor-pointer"
                    title="Delete FAQ"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      )}

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
          <GlassCard glow="cyan" className="w-full max-w-xl max-h-[90vh] overflow-y-auto p-6 bg-slate-950 border-cyan-500/50 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-5">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-cyan-400" />
                <h3 className="text-base font-display font-bold text-white uppercase tracking-wider">
                  {editingFaq ? 'Edit FAQ Entry' : 'Create New Grounded FAQ'}
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveFaq} className="space-y-4">
              <div>
                <label className="block text-xs font-mono uppercase text-slate-400 mb-1.5">
                  Question *
                </label>
                <input
                  type="text"
                  required
                  value={formData.question}
                  onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                  placeholder="e.g. Is there food provided during the offline sprint?"
                  className="w-full bg-slate-900 border border-slate-800 focus:border-cyan-500/60 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-slate-400 mb-1.5">
                  Category *
                </label>
                <div className="flex gap-2">
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="flex-1 bg-slate-900 border border-slate-800 focus:border-cyan-500/60 rounded-xl px-3.5 py-2.5 text-sm text-cyan-300 outline-none"
                  >
                    {PRESET_CATEGORIES.map(cat => (
                      <option key={cat} value={cat} className="bg-slate-950 text-white">
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-slate-400 mb-1.5">
                  Answer *
                </label>
                <textarea
                  required
                  rows={4}
                  value={formData.answer}
                  onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                  placeholder="Provide an accurate, grounded answer. You can use markdown like **bold** or bullet points."
                  className="w-full bg-slate-900 border border-slate-800 focus:border-cyan-500/60 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 outline-none transition-all leading-relaxed"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-slate-400 mb-1.5">
                  Source Reference Document
                </label>
                <input
                  type="text"
                  value={formData.source}
                  onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                  placeholder="e.g. Patrician Hackathon 2026 Rulebook Sec 3.2"
                  className="w-full bg-slate-900 border border-slate-800 focus:border-cyan-500/60 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-slate-400 mb-1.5">
                  Search Keywords (comma-separated for AI indexing)
                </label>
                <input
                  type="text"
                  value={formData.keywords}
                  onChange={(e) => setFormData({ ...formData, keywords: e.target.value })}
                  placeholder="e.g. food, meals, catering, snack, refreshments"
                  className="w-full bg-slate-900 border border-slate-800 focus:border-cyan-500/60 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 outline-none transition-all"
                />
              </div>

              <div className="pt-4 border-t border-slate-800 flex justify-end gap-3">
                <CyberButton
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </CyberButton>

                <CyberButton
                  type="submit"
                  variant="primary"
                  size="sm"
                  isLoading={isSaving}
                  leftIcon={<Save className="w-4 h-4" />}
                >
                  {editingFaq ? 'Save Changes' : 'Create FAQ'}
                </CyberButton>
              </div>
            </form>
          </GlassCard>
        </div>
      )}
    </div>
  );
};
