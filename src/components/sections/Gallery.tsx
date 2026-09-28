import React, { useState } from 'react';
import { initialGallery } from '../../data/gallery';
import { SectionHeader } from '../common/SectionHeader';
import { GlassCard } from '../common/GlassCard';
import { Eye, X } from 'lucide-react';
import { GalleryItem } from '../../types';
import { useCyberTheme } from '../../context/ThemeContext';

export const Gallery: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [activeImage, setActiveImage] = useState<GalleryItem | null>(null);
  const { theme } = useCyberTheme();

  const categories = ['ALL', 'HACKATHONS', 'CAMPUS', 'EVENTS', 'WORKSHOPS'];

  const filteredItems =
    selectedCategory === 'ALL'
      ? initialGallery
      : initialGallery.filter((item) => item.category === selectedCategory);

  return (
    <section id="gallery" className="relative py-24 px-4 sm:px-6 lg:px-8 z-10 bg-slate-950/40">
      <div className="max-w-7xl mx-auto">
        <SectionHeader
          badge="// VISUAL ARCHIVE"
          title="CAMPUS, EVENTS & HACKATHON GALLERY"
          subtitle="Explore authentic highlights from national hackathons, campus infrastructure, academic workshops, and college celebrations at Patrician College."
        />

        {/* Category Filters */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-mono font-bold tracking-wider uppercase transition-all duration-300 ${
                  isSelected
                    ? 'text-slate-950 font-black shadow-lg scale-105'
                    : 'bg-slate-900/80 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
                }`}
                style={
                  isSelected
                    ? {
                        backgroundColor: theme.primary,
                        boxShadow: `0 0 20px ${theme.glow}`,
                      }
                    : {}
                }
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <GlassCard
              key={item.id}
              glow="cyan"
              className="overflow-hidden group cursor-pointer border-slate-800/80 hover:border-cyan-500/40"
              onClick={() => setActiveImage(item)}
            >
              <div className="relative aspect-video overflow-hidden bg-slate-900">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#030712] via-transparent to-transparent opacity-80" />

                {/* Hover overlay indicator */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 backdrop-blur-xs">
                  <div
                    className="p-3 rounded-full text-slate-950 shadow-lg"
                    style={{
                      backgroundColor: theme.primary,
                      boxShadow: `0 0 20px ${theme.primary}`,
                    }}
                  >
                    <Eye className="w-5 h-5" />
                  </div>
                </div>

                <span
                  className="absolute top-3 left-3 px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-slate-950/85 border shadow-sm"
                  style={{
                    color: theme.primary,
                    borderColor: `${theme.primary}60`,
                  }}
                >
                  {item.category}
                </span>
              </div>

              <div className="p-5">
                <h4 className="text-base font-display font-bold text-white uppercase group-hover:text-cyan-300 transition-colors">
                  {item.title}
                </h4>
                <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                  {item.caption}
                </p>
              </div>
            </GlassCard>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      {activeImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-200">
          <div
            className="relative max-w-4xl w-full rounded-2xl bg-slate-950 border p-4 sm:p-6 shadow-2xl"
            style={{
              borderColor: `${theme.primary}80`,
              boxShadow: `0 0 50px ${theme.glow}`,
            }}
          >
            <button
              onClick={() => setActiveImage(null)}
              className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-white bg-slate-900 border border-slate-800 transition-colors z-10 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="rounded-xl overflow-hidden mb-4 max-h-[70vh] flex items-center justify-center bg-black">
              <img
                src={activeImage.imageUrl}
                alt={activeImage.title}
                className="max-h-[65vh] w-auto object-contain"
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <span
                  className="text-[10px] font-mono uppercase font-bold tracking-wider"
                  style={{ color: theme.primary }}
                >
                  {activeImage.category}
                </span>
                <h3 className="text-xl font-display font-bold text-white uppercase mt-0.5">
                  {activeImage.title}
                </h3>
                <p className="text-xs text-slate-400 mt-1">{activeImage.caption}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
