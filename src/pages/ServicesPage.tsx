import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Video,
  Image as ImageIcon,
  Sparkles,
  Mic,
  FileText,
  Share2,
  Megaphone,
  Palette,
  CheckCircle2,
  ArrowRight,
  Zap,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const ServicesPage: React.FC = () => {
  const { userProfile } = useAuth();
  const navigate = useNavigate();

  const services = [
    {
      id: 'video',
      title: 'AI Video Creation',
      icon: Video,
      gradient: 'from-purple-600 to-indigo-600',
      description: 'Create cinematic videos, YouTube videos, Shorts, Reels and advertisements.',
      features: [
        'Cinematic 4K 60FPS motion synthesis',
        'Camera motions: Dolly, Pan, Aerial Drone, Orbital 360',
        'Aspect ratios for Shorts (9:16), YouTube (16:9), and Feed (1:1)',
        'Synchronized ambient score & sound design cues',
      ],
      sampleOutput: '4K MP4 with variable framerate support',
      toolTab: 'video',
    },
    {
      id: 'image',
      title: 'AI Image Generation',
      icon: ImageIcon,
      gradient: 'from-pink-600 to-rose-600',
      description: 'Create social media graphics, product visuals, cinematic scenes and creative artwork.',
      features: [
        'Photorealistic macro studio lighting',
        'Styles: Realistic, Cinematic, Anime, 3D, Illustration, Product',
        'Lossless HD upscaling and raw resolution exports',
        'Zero-artifact edge rendering and color grading',
      ],
      sampleOutput: 'Lossless PNG / WebP 1024px to 4K',
      toolTab: 'image',
    },
    {
      id: 'thumbnail',
      title: 'YouTube Thumbnail Design',
      icon: Sparkles,
      gradient: 'from-amber-500 to-orange-600',
      description: 'Create high-click visual thumbnails.',
      features: [
        'CTR-optimized color contrasts and lighting halos',
        'Eye-tracking focal points with 3D text overlays',
        'Automated A/B title variation generator',
        'Predictive viral rating engine (85%+ accuracy)',
      ],
      sampleOutput: '1280x720 16:9 Ultra-contrast JPEG/PNG',
      toolTab: 'thumbnail',
    },
    {
      id: 'voice',
      title: 'AI Voiceover',
      icon: Mic,
      gradient: 'from-emerald-600 to-teal-600',
      description: 'Generate narration and voice content.',
      features: [
        'Multi-speaker neural voice model lineup',
        'Expressive prosody, cadence, and breath modulation',
        'Multi-language capabilities: English, Japanese, Urdu, Hindi, etc.',
        'Speed pitch control and studio-grade loudness mastering',
      ],
      sampleOutput: 'Studio Master WAV / 320kbps MP3',
      toolTab: 'voice',
    },
    {
      id: 'script',
      title: 'Script Writing',
      icon: FileText,
      gradient: 'from-cyan-600 to-blue-600',
      description: 'Generate YouTube scripts, stories, advertisements and social content.',
      features: [
        'High-retention 3-second hook frameworks',
        'Three-act story arcs with scene-by-scene visual cues',
        'Tones: Cinematic, Dramatic, Educational, Funny, Documentary',
        'Timestamped pacing and word count pacing metrics',
      ],
      sampleOutput: 'Markdown formatted Production Bible',
      toolTab: 'script',
    },
    {
      id: 'social',
      title: 'Social Media Content',
      icon: Share2,
      gradient: 'from-violet-600 to-purple-600',
      description: 'Create content for TikTok, Instagram, YouTube and Facebook.',
      features: [
        'Multi-slide carousel blueprints with viral loops',
        'Platform-tuned character limits and hashtag clusters',
        'Algorithm-timed posting schedule recommendations',
        'Cross-channel repurposing with single-click adaptors',
      ],
      sampleOutput: 'Carousel Outlines & Scheduled Copy',
      toolTab: 'social_media',
    },
    {
      id: 'ad',
      title: 'AI Advertisement Creation',
      icon: Megaphone,
      gradient: 'from-red-600 to-pink-600',
      description: 'Create scripts, visuals, voiceovers and complete ad concepts.',
      features: [
        'Psychological pattern-interrupt hooks',
        'Timeline scene breakdowns with on-screen text overlays',
        'High-converting CTAs engineered for immediate action',
        'Pre-formatted for Meta Ads and TikTok Spark Ads',
      ],
      sampleOutput: 'Complete Campaign Media Kit',
      toolTab: 'ad',
    },
    {
      id: 'branding',
      title: 'Branding Design',
      icon: Palette,
      gradient: 'from-yellow-500 to-amber-600',
      description: 'Create logos, banners, social media graphics and promotional materials.',
      features: [
        'Scalable generative vector mark concepts',
        'Harmonized color palettes and typographic pairings',
        'Stationery, business cards, and social headers',
        'Full brand guideline sheet with CSS color codes',
      ],
      sampleOutput: 'Vector SVG & Brand Style Guide',
      toolTab: 'image',
    },
  ];

  const handleTryNow = (toolTab: string) => {
    if (!userProfile) {
      navigate('/signup');
    } else {
      navigate(`/dashboard/tools?tool=${toolTab}`);
    }
  };

  return (
    <div className="min-h-screen bg-[#090A0F] text-slate-100 py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/25 text-purple-300 text-xs font-semibold">
          <Zap className="w-3.5 h-3.5" />
          <span>Generative Creative Services</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
          Every Creative Tool Your Brand Needs
        </h1>
        <p className="text-base sm:text-lg text-slate-400">
          From viral YouTube hooks to 4K cinematic video reels, discover our comprehensive generative intelligence capabilities.
        </p>
      </div>

      {/* Grid of detailed service cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {services.map((svc) => (
          <div
            key={svc.id}
            className="rounded-2xl border border-white/10 bg-[#0C0E17] hover:border-purple-500/40 p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 hover:shadow-2xl hover:shadow-purple-950/30 group"
          >
            <div className="space-y-6">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${svc.gradient} p-[1px] shadow-lg`}
                >
                  <div className="w-full h-full bg-[#0A0B12] rounded-[11px] flex items-center justify-center">
                    <svc.icon className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
                  </div>
                </div>
                <span className="text-[11px] font-mono text-purple-400 bg-purple-500/10 border border-purple-500/20 px-2.5 py-1 rounded-lg">
                  {svc.sampleOutput}
                </span>
              </div>

              <div>
                <h3 className="text-2xl font-bold text-white group-hover:text-purple-300 transition-colors">
                  {svc.title}
                </h3>
                <p className="text-sm text-slate-300 mt-2 leading-relaxed">{svc.description}</p>
              </div>

              {/* Features list */}
              <div className="space-y-2.5 pt-2 border-t border-white/5">
                <p className="text-xs uppercase font-bold tracking-wider text-slate-400">
                  Capabilities & Features:
                </p>
                <ul className="space-y-2">
                  {svc.features.map((feat, fi) => (
                    <li key={fi} className="flex items-start gap-2.5 text-xs text-slate-300">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Try Now Button */}
            <div className="pt-8 mt-6 border-t border-white/10 flex items-center justify-between">
              <span className="text-xs text-slate-400">Included in Free & Pro plans</span>
              <button
                onClick={() => handleTryNow(svc.toolTab)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-semibold shadow-md shadow-purple-600/30 transition-all group-hover:scale-105"
              >
                <span>Try Now</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
