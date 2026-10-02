import React, { useState, useEffect } from 'react';
import {
  History,
  Trash2,
  Download,
  Eye,
  X,
  Filter,
  Wand2,
  Image as ImageIcon,
  Video,
  FileText,
  Mic,
  Sparkles,
  Megaphone,
  Share2,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { getUserGenerations, deleteGeneration } from '../../services/db/generationService';
import type { Generation, ToolType } from '../../types';

export const HistoryPage: React.FC = () => {
  const { userProfile } = useAuth();
  const { toast } = useToast();
  const [generations, setGenerations] = useState<Generation[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState<ToolType | 'all'>('all');
  const [activeItem, setActiveItem] = useState<Generation | null>(null);

  useEffect(() => {
    loadHistory();
  }, [userProfile, selectedFilter]);

  const loadHistory = async () => {
    if (!userProfile) return;
    setLoading(true);
    try {
      const list = await getUserGenerations(userProfile.userId, selectedFilter);
      setGenerations(list || []);
    } catch (err) {
      console.error('Failed to load history:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('Are you sure you want to delete this generation record?')) return;
    try {
      await deleteGeneration(id);
      setGenerations((prev) => prev.filter((g) => g.id !== id));
      if (activeItem?.id === id) setActiveItem(null);
      toast.info('Item Removed', 'Generation record deleted from history.');
    } catch (err) {
      console.error('Failed to delete item:', err);
      toast.error('Deletion Failed', 'Unable to delete generation record.');
    }
  };

  const handleDownload = (item: Generation, e: React.MouseEvent) => {
    e.stopPropagation();
    const url = item.result?.imageUrl || item.result?.thumbnailUrl || item.result?.videoUrl;
    if (url) {
      const a = document.createElement('a');
      a.href = url;
      a.download = `ai_creative_${item.toolType}_${item.id.slice(-6)}`;
      a.target = '_blank';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      toast.success('Download Dispatched', `Saved ${item.toolType} deliverable.`);
    } else if (item.result?.fullMarkdown || item.result?.script) {
      const text = item.result.fullMarkdown || item.result.script;
      const blob = new Blob([text], { type: 'text/markdown' });
      const dlUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = dlUrl;
      a.download = `script_${item.id.slice(-6)}.md`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      toast.success('Script Exported', 'Downloaded Markdown script file.');
    }
  };

  const filterTabs: { id: ToolType | 'all'; label: string }[] = [
    { id: 'all', label: 'All Creatives' },
    { id: 'image', label: 'Images' },
    { id: 'video', label: 'Videos' },
    { id: 'script', label: 'Scripts' },
    { id: 'voice', label: 'Voiceovers' },
    { id: 'thumbnail', label: 'Thumbnails' },
    { id: 'ad', label: 'Advertisements' },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-in fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
          Generation History
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Review, preview, and download your previous generative assets
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 flex-wrap border-b border-white/10 pb-3">
        {filterTabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setSelectedFilter(t.id)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              selectedFilter === t.id
                ? 'bg-purple-600 text-white shadow-md'
                : 'bg-white/5 text-slate-400 hover:text-white'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* History Table / Grid */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-20 rounded-xl bg-white/5 animate-pulse" />
          ))}
        </div>
      ) : generations.length === 0 ? (
        <div className="py-20 text-center rounded-2xl bg-[#0C0E17] border border-white/10 space-y-3">
          <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center mx-auto">
            <History className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-white">No generations found</h3>
          <p className="text-xs text-slate-400 max-w-xs mx-auto">
            Assets generated using the AI Studio tools will automatically appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {generations.map((item) => (
            <div
              key={item.id}
              onClick={() => setActiveItem(item)}
              className="cursor-pointer p-4 rounded-xl bg-[#0C0E17] border border-white/10 hover:border-purple-500/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all hover:bg-white/[0.02]"
            >
              <div className="flex items-center gap-3 min-w-0">
                {/* Thumbnail Preview */}
                <div className="w-12 h-12 rounded-lg bg-black/40 overflow-hidden shrink-0 border border-white/10 flex items-center justify-center">
                  {item.result?.imageUrl || item.result?.thumbnailUrl ? (
                    <img
                      src={item.result.imageUrl || item.result.thumbnailUrl}
                      alt="thumb"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Wand2 className="w-5 h-5 text-purple-400" />
                  )}
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] uppercase font-mono font-bold text-purple-400 px-2 py-0.5 rounded bg-purple-500/10">
                      {item.toolType}
                    </span>
                    <span className="text-xs text-slate-500">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </span>
                    <span className="text-[10px] text-emerald-400 bg-emerald-500/15 px-2 py-0.5 rounded uppercase font-semibold">
                      {item.status}
                    </span>
                  </div>
                  <p className="text-xs font-medium text-white truncate max-w-lg mt-1">
                    "{item.prompt}"
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 self-end sm:self-auto">
                <button
                  onClick={() => setActiveItem(item)}
                  className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs text-slate-300 font-semibold flex items-center gap-1.5"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>View</span>
                </button>
                <button
                  onClick={(e) => handleDownload(item, e)}
                  className="px-3 py-1.5 rounded-lg bg-purple-600/30 hover:bg-purple-600/50 text-xs text-purple-200 border border-purple-500/30 flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download</span>
                </button>
                <button
                  onClick={(e) => handleDelete(item.id, e)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Details Lightbox Modal */}
      {activeItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-2xl rounded-2xl bg-[#0F111B] border border-white/10 shadow-2xl p-6 sm:p-8 space-y-4 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setActiveItem(null)}
              className="absolute top-5 right-5 p-2 rounded-lg text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-mono font-bold text-purple-400 px-2 py-0.5 rounded bg-purple-500/10">
                {activeItem.toolType}
              </span>
              <span className="text-xs text-slate-400">
                {new Date(activeItem.createdAt).toLocaleString()}
              </span>
            </div>

            <h3 className="text-base font-bold text-white">Prompt:</h3>
            <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-xs text-slate-200">
              "{activeItem.prompt}"
            </div>

            {/* Media preview */}
            {activeItem.result?.imageUrl || activeItem.result?.thumbnailUrl ? (
              <div className="rounded-xl overflow-hidden aspect-video bg-black/60 border border-white/10">
                <img
                  src={activeItem.result.imageUrl || activeItem.result.thumbnailUrl}
                  alt="preview"
                  className="w-full h-full object-cover"
                />
              </div>
            ) : null}

            {activeItem.result?.fullMarkdown ? (
              <div className="p-4 rounded-xl bg-black/40 border border-white/5 text-xs text-slate-200 whitespace-pre-wrap max-h-60 overflow-y-auto">
                {activeItem.result.fullMarkdown}
              </div>
            ) : null}

            {activeItem.result?.script ? (
              <div className="p-4 rounded-xl bg-black/40 border border-white/5 text-xs text-slate-200 whitespace-pre-wrap max-h-60 overflow-y-auto">
                {activeItem.result.script}
              </div>
            ) : null}

            {activeItem.result?.content ? (
              <div className="p-4 rounded-xl bg-black/40 border border-white/5 text-xs text-slate-200 whitespace-pre-wrap max-h-60 overflow-y-auto">
                {activeItem.result.content}
              </div>
            ) : null}

            <div className="pt-4 flex items-center justify-end gap-3 border-t border-white/10">
              <button
                onClick={(e) => handleDownload(activeItem, e)}
                className="px-4 py-2 rounded-xl bg-purple-600 text-white text-xs font-semibold flex items-center gap-1.5 shadow"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Deliverable</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
