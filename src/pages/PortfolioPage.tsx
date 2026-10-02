import React, { useState, useEffect, useMemo } from 'react';
import { Sparkles, Play, X, ExternalLink, Filter, Eye } from 'lucide-react';
import { getPortfolioItems } from '../services/db/portfolioService';
import { INITIAL_PORTFOLIO_ITEMS } from '../services/db/seedService';
import type { PortfolioItem, PortfolioCategory } from '../types';

export const PortfolioPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<PortfolioCategory>('all');
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeItem, setActiveItem] = useState<PortfolioItem | null>(null);

  const categories: { id: PortfolioCategory; label: string }[] = [
    { id: 'all', label: 'All Creatives' },
    { id: 'videos', label: 'Videos' },
    { id: 'thumbnails', label: 'Thumbnails' },
    { id: 'images', label: 'Images' },
    { id: 'advertisements', label: 'Advertisements' },
    { id: 'social_media', label: 'Social Media' },
    { id: 'branding', label: 'Branding' },
  ];

  useEffect(() => {
    async function load() {
      try {
        const fetched = await getPortfolioItems();
        if (fetched && fetched.length > 0) {
          setItems(fetched);
        } else {
          // Fallback to static seeds
          const mappedSeeds: PortfolioItem[] = INITIAL_PORTFOLIO_ITEMS.map((item, idx) => ({
            ...item,
            id: `seed_${idx}`,
            createdAt: new Date().toISOString(),
          }));
          setItems(mappedSeeds);
        }
      } catch (e) {
        const mappedSeeds: PortfolioItem[] = INITIAL_PORTFOLIO_ITEMS.map((item, idx) => ({
          ...item,
          id: `seed_${idx}`,
          createdAt: new Date().toISOString(),
        }));
        setItems(mappedSeeds);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      if (selectedCategory === 'all') return true;
      return item.category === selectedCategory;
    });
  }, [items, selectedCategory]);

  return (
    <div className="min-h-screen bg-[#090A0F] text-slate-100 py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4 mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/25 text-purple-300 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Curated Generative Showcase</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
          Client Work & Neural Showcase
        </h1>
        <p className="text-base sm:text-lg text-slate-400">
          Discover broadcast-ready videos, high-CTR YouTube thumbnails, and high-impact visual campaigns built with AI Creative Studio.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-center gap-1.5 flex-wrap mb-12">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              selectedCategory === cat.id
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30 ring-1 ring-purple-400'
                : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 border border-white/5'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Portfolio Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-80 rounded-2xl bg-white/5 animate-pulse border border-white/5"
            />
          ))}
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="text-center py-16 text-slate-400 text-sm">
          No portfolio projects found in this category.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="group rounded-2xl overflow-hidden border border-white/10 bg-[#0C0E17] hover:border-purple-500/50 transition-all duration-300 flex flex-col justify-between hover:shadow-xl hover:shadow-purple-950/30"
            >
              <div className="relative aspect-video overflow-hidden bg-black/40">
                <img
                  src={item.mediaUrl}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 flex items-center gap-2">
                  <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-black/70 backdrop-blur-md text-purple-300 border border-purple-500/30">
                    {item.category}
                  </span>
                  {item.featured && (
                    <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-amber-500/80 text-black">
                      Featured
                    </span>
                  )}
                </div>

                {/* Hover overlay with View action */}
                <div
                  onClick={() => setActiveItem(item)}
                  className="cursor-pointer absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 backdrop-blur-[2px] transition-opacity duration-300 flex items-center justify-center"
                >
                  <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-600 text-white text-xs font-semibold shadow-lg">
                    <Eye className="w-4 h-4" />
                    <span>View Project</span>
                  </button>
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <h3 className="font-bold text-white text-lg group-hover:text-purple-300 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1.5 line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {item.tags?.slice(0, 3).map((t, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] text-slate-400 bg-white/5 px-2 py-0.5 rounded"
                      >
                        #{t}
                      </span>
                    ))}
                  </div>

                  <button
                    onClick={() => setActiveItem(item)}
                    className="text-xs font-semibold text-purple-400 hover:text-purple-300 transition-colors"
                  >
                    View details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Lightbox Modal */}
      {activeItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-2xl rounded-2xl bg-[#0F111B] border border-white/15 shadow-2xl overflow-hidden p-6">
            <button
              onClick={() => setActiveItem(null)}
              className="absolute top-4 right-4 p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/10"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="rounded-xl overflow-hidden aspect-video bg-black/60 border border-white/10 mb-4">
              <img
                src={activeItem.mediaUrl}
                alt={activeItem.title}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  {activeItem.category}
                </span>
                <span className="text-xs text-slate-500 font-mono">
                  Created: {new Date(activeItem.createdAt).toLocaleDateString()}
                </span>
              </div>

              <h2 className="text-xl font-bold text-white">{activeItem.title}</h2>
              <p className="text-sm text-slate-300 leading-relaxed">{activeItem.description}</p>

              {activeItem.tags && activeItem.tags.length > 0 && (
                <div className="flex items-center gap-2 pt-2 flex-wrap">
                  {activeItem.tags.map((tg, i) => (
                    <span key={i} className="text-xs px-2.5 py-1 rounded-md bg-white/5 text-slate-300">
                      #{tg}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
