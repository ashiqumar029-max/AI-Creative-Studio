import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Sparkles,
  ArrowRight,
  Play,
  Video,
  Image as ImageIcon,
  Sparkle,
  Mic,
  FileText,
  Share2,
  Megaphone,
  Palette,
  CheckCircle2,
  Zap,
  Layers,
  Download,
  FolderKanban,
  Star,
  ShieldCheck,
  ChevronRight,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { INITIAL_PORTFOLIO_ITEMS } from '../services/db/seedService';

export const HomePage: React.FC = () => {
  const { userProfile } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'video' | 'image' | 'script' | 'thumbnail'>('video');

  const creationCategories = [
    {
      title: 'AI Videos',
      icon: Video,
      color: 'from-purple-500 to-indigo-500',
      description: 'Cinematic shorts, YouTube videos, TikToks, Reels, and high-impact commercial trailers in 4K.',
    },
    {
      title: 'AI Images',
      icon: ImageIcon,
      color: 'from-pink-500 to-rose-500',
      description: 'Photorealistic digital photography, 3D character assets, cinematic environments, and artwork.',
    },
    {
      title: 'YouTube Thumbnails',
      icon: Sparkles,
      color: 'from-amber-500 to-orange-500',
      description: 'High-CTR visual compositions with 3D eye-tracking badges, viral color saturation, and typography.',
    },
    {
      title: 'AI Voiceovers',
      icon: Mic,
      color: 'from-emerald-500 to-teal-500',
      description: 'Human-grade neural speech narration, expressive voice acting, and multi-language prosody.',
    },
    {
      title: 'Scripts & Stories',
      icon: FileText,
      color: 'from-cyan-500 to-blue-500',
      description: 'High-retention video hooks, three-act story arcs, educational breakdowns, and commercial copy.',
    },
    {
      title: 'Social Media Content',
      icon: Share2,
      color: 'from-violet-500 to-purple-500',
      description: 'Multi-slide carousels, viral threads, caption bundles, and platform-optimized content calendars.',
    },
    {
      title: 'Advertisement Creatives',
      icon: Megaphone,
      color: 'from-red-500 to-pink-500',
      description: 'Conversion-engineered hooks, psychological scene breakdowns, visual notes, and call-to-actions.',
    },
    {
      title: 'Branding Materials',
      icon: Palette,
      color: 'from-yellow-500 to-amber-500',
      description: 'Generative vector logomarks, color palettes, visual guidelines, stationery, and promo assets.',
    },
  ];

  const steps = [
    {
      step: '01',
      title: 'Choose a Tool',
      desc: 'Select from 8 specialized AI generative engines built for video, imagery, voice, copy, and thumbnails.',
      icon: Layers,
    },
    {
      step: '02',
      title: 'Describe Your Idea',
      desc: 'Input your raw prompt, select target aspect ratio, tone, style preset, or audience parameters.',
      icon: Sparkles,
    },
    {
      step: '03',
      title: 'Generate Content',
      desc: 'Our neural multi-model pipeline synthesizes broadcast-quality creative assets in seconds.',
      icon: Zap,
    },
    {
      step: '04',
      title: 'Download & Organize',
      desc: 'Export high-resolution deliverables, save to structured project workspaces, or iterate instantly.',
      icon: Download,
    },
  ];

  const valueProps = [
    {
      title: 'Fast Creation',
      desc: 'Cut production timelines from days to minutes with zero rendering friction.',
      icon: Zap,
    },
    {
      title: 'AI-Powered Workflows',
      desc: 'Integrated pipelines that connect script generation directly into voice and video renders.',
      icon: Sparkles,
    },
    {
      title: 'Professional Results',
      desc: 'Studio-grade dynamic range, 4K upscaling, and broadcast-compliant sound mastering.',
      icon: Star,
    },
    {
      title: 'Multiple Creative Tools',
      desc: 'All your creative instruments in one unified, cohesive SaaS dashboard.',
      icon: Layers,
    },
    {
      title: 'Project Management',
      desc: 'Categorize, tag, search, and duplicate projects with persistent cloud storage.',
      icon: FolderKanban,
    },
    {
      title: 'Easy Downloads',
      desc: 'Direct PNG, MP4, Markdown, and WAV exports with complete commercial ownership.',
      icon: Download,
    },
  ];

  return (
    <div className="min-h-screen bg-[#090A0F] text-slate-100 overflow-hidden">
      {/* Background Glow effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[650px] pointer-events-none overflow-hidden">
        <div className="absolute top-[-20%] left-[20%] w-[550px] h-[550px] rounded-full bg-purple-600/15 blur-[120px]" />
        <div className="absolute top-[-10%] right-[15%] w-[450px] h-[450px] rounded-full bg-indigo-600/15 blur-[130px]" />
        <div className="absolute top-[25%] left-[45%] w-[350px] h-[350px] rounded-full bg-cyan-500/10 blur-[100px]" />
      </div>

      {/* Hero Section */}
      <section className="relative pt-16 pb-20 lg:pt-24 lg:pb-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-4xl mx-auto space-y-6">
          {/* Subtle Announcement Pill */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/25 text-purple-300 text-xs font-semibold backdrop-blur-md animate-in fade-in">
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            <span>Next-Generation Generative Creative Suite 2.0</span>
            <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
            <span className="text-purple-200">100 Free Credits on Signup</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.1] text-balance">
            Turn Your Ideas Into <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-indigo-300 to-cyan-300">
              Powerful Digital Content
            </span>{' '}
            With AI.
          </h1>

          {/* Subheadline */}
          <p className="text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed text-balance">
            Create stunning videos, thumbnails, images, scripts, voiceovers and marketing content with the power of AI.
          </p>

          {/* Hero Action Buttons */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to={userProfile ? '/dashboard' : '/signup'}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white font-bold text-base shadow-xl shadow-purple-600/30 hover:shadow-purple-600/50 hover:scale-[1.02] transition-all duration-300"
            >
              <span>Start Creating</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              to="/services"
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-white/5 hover:bg-white/10 text-white font-semibold text-base border border-white/15 transition-all"
            >
              <span>Explore Services</span>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </Link>
          </div>

          <div className="pt-4 flex items-center justify-center gap-6 text-xs text-slate-400">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> No Credit Card Required
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Instant 100 Credits
            </span>
            <span className="flex items-center gap-1.5 hidden sm:flex">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Commercial Usage Rights
            </span>
          </div>
        </div>

        {/* HERO VISUAL: Futuristic Creative Workspace Mockup */}
        <div className="mt-14 relative max-w-5xl mx-auto">
          <div className="rounded-2xl border border-white/15 bg-[#0C0E17]/90 shadow-2xl shadow-purple-950/40 overflow-hidden backdrop-blur-xl">
            {/* Top Workspace Tab Bar */}
            <div className="h-12 border-b border-white/10 bg-[#0A0B12] px-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                <span className="ml-3 text-xs text-slate-400 font-mono hidden sm:inline">
                  ai-creative-studio // workspace_v2.0
                </span>
              </div>

              {/* Mode switch tabs */}
              <div className="flex items-center gap-1 bg-white/5 p-1 rounded-lg border border-white/10">
                <button
                  onClick={() => setActiveTab('video')}
                  className={`px-3 py-1 rounded text-xs font-semibold transition-all ${
                    activeTab === 'video'
                      ? 'bg-purple-600 text-white'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Video Studio
                </button>
                <button
                  onClick={() => setActiveTab('image')}
                  className={`px-3 py-1 rounded text-xs font-semibold transition-all ${
                    activeTab === 'image'
                      ? 'bg-purple-600 text-white'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Neural Visuals
                </button>
                <button
                  onClick={() => setActiveTab('script')}
                  className={`px-3 py-1 rounded text-xs font-semibold transition-all ${
                    activeTab === 'script'
                      ? 'bg-purple-600 text-white'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Script Arc
                </button>
                <button
                  onClick={() => setActiveTab('thumbnail')}
                  className={`px-3 py-1 rounded text-xs font-semibold transition-all ${
                    activeTab === 'thumbnail'
                      ? 'bg-purple-600 text-white'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Thumbnail
                </button>
              </div>
            </div>

            {/* Interactive Workspace Stage */}
            <div className="p-4 sm:p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              {/* Left Stage View */}
              <div className="lg:col-span-7 space-y-4">
                <div className="relative aspect-video rounded-xl overflow-hidden border border-white/15 bg-black/60 shadow-inner group">
                  <img
                    src={
                      activeTab === 'video'
                        ? 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?auto=format&fit=crop&w=1200&q=80'
                        : activeTab === 'image'
                        ? 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80'
                        : activeTab === 'script'
                        ? 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80'
                        : 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80'
                    }
                    alt="AI Generated Showcase Preview"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-between p-4">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-1 rounded bg-black/60 backdrop-blur-md text-[11px] font-mono text-purple-300 border border-purple-500/30">
                        {activeTab === 'video'
                          ? '● 4K 60FPS VIDEO GENERATED'
                          : activeTab === 'image'
                          ? '● 4K PHOTOREALISTIC RENDER'
                          : activeTab === 'script'
                          ? '● PRODUCTION SCRIPT ARC'
                          : '● CTR VIRAL THUMBNAIL READY'}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-semibold">
                        READY
                      </span>
                    </div>

                    <div>
                      <p className="text-white text-sm font-bold truncate">
                        {activeTab === 'video'
                          ? '"Cyberpunk Tokyo 2099 - Neon Rain & Kinetic Reflections"'
                          : activeTab === 'image'
                          ? '"Minimalist Lumina Pavilion - Golden Hour Volumetric Rays"'
                          : activeTab === 'script'
                          ? '"How to Build an AI Content Studio in 2026"'
                          : '"I Tested 100 AI Tools (Here is What Happened)"'}
                      </p>
                      <p className="text-xs text-slate-300">
                        {activeTab === 'video'
                          ? 'Style: Cinematic Film • Camera: Dolly In • Format: 16:9 4K'
                          : activeTab === 'image'
                          ? 'Style: Photorealism • Lighting: Macro Studio • Aspect: 16:9'
                          : activeTab === 'script'
                          ? 'Tone: Cinematic • Language: English • Pacing: 3-5 min'
                          : 'Style: Clickbait Neon • Mood: Shocking • Score: 96% CTR'}
                      </p>
                    </div>
                  </div>

                  {activeTab === 'video' && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-14 h-14 rounded-full bg-purple-600/90 text-white flex items-center justify-center shadow-lg shadow-purple-600/50 backdrop-blur-md group-hover:scale-110 transition-transform">
                        <Play className="w-6 h-6 fill-white ml-1" />
                      </div>
                    </div>
                  )}
                </div>

                {/* Bottom Stage Details */}
                <div className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-2">
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span className="font-mono">
                      {activeTab === 'video'
                        ? 'TIMELINE: 00:08 / 00:30'
                        : activeTab === 'script'
                        ? 'PACING: 420 WORDS (~3:00 MIN READ)'
                        : activeTab === 'thumbnail'
                        ? 'CANVAS: 1280x720 16:9 ULTRA-SATURATED'
                        : 'ENGINE: DIFFUSION LATENT SPACE 1024x1024'}
                    </span>
                    <span className="text-purple-300 font-semibold font-mono">
                      {activeTab === 'video'
                        ? 'AUDIO: Lo-Fi Synth'
                        : activeTab === 'script'
                        ? '3-ACT STORYTELLING'
                        : activeTab === 'thumbnail'
                        ? 'CTR PREDICTED: 96.4%'
                        : 'HDR COLOR PASS'}
                    </span>
                  </div>
                  {/* Waveform / Meter track */}
                  <div className="flex items-center gap-1 h-7 px-1">
                    {Array.from({ length: 36 }).map((_, i) => (
                      <div
                        key={i}
                        className={`flex-1 rounded-full transition-all ${
                          i < 16
                            ? 'bg-purple-500'
                            : i < 26
                            ? 'bg-cyan-400'
                            : 'bg-white/20'
                        }`}
                        style={{
                          height: `${Math.max(20, Math.sin(i * 0.45) * 100 * (i % 2 === 0 ? 0.9 : 0.45))}%`,
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Stage Controls Mock */}
              <div className="lg:col-span-5 space-y-3.5">
                {/* Active Tool Card */}
                <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs uppercase font-bold text-slate-300 tracking-wider">
                      {activeTab === 'video'
                        ? 'Cinematic Video Pipeline'
                        : activeTab === 'image'
                        ? 'Neural Image Synthesis'
                        : activeTab === 'script'
                        ? 'Scriptwriting Studio'
                        : 'Thumbnail CTR Optimizer'}
                    </span>
                    <span className="text-xs text-purple-400 font-mono">
                      {activeTab === 'video' ? '15 Credits' : activeTab === 'thumbnail' ? '8 Credits' : '5 Credits'}
                    </span>
                  </div>
                  <div className="p-3 rounded-lg bg-black/40 border border-white/10 text-xs text-slate-300 font-mono">
                    {activeTab === 'video'
                      ? '"Zero-gravity orbital camera orbiting neon satellite, cinematic film 4K 60fps"'
                      : activeTab === 'image'
                      ? '"Sustainable glass architecture pavilion bathed in Scandinavian golden hour sun, 8k"'
                      : activeTab === 'script'
                      ? '"How 99% of people miss this single secret about scaling AI content production"'
                      : '"100 AI TOOLS TESTED - Shocking results and viral case study reveal"'}
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-2 rounded-lg bg-white/5 border border-white/5 text-slate-300">
                      <span className="text-slate-500 block text-[10px]">ASPECT RATIO</span>
                      16:9 Broadcast
                    </div>
                    <div className="p-2 rounded-lg bg-white/5 border border-white/5 text-slate-300">
                      <span className="text-slate-500 block text-[10px]">ENGINE</span>
                      StudioGen Ultra
                    </div>
                  </div>
                </div>

                {/* CTR / Quality Score Card */}
                <div className="p-3.5 rounded-xl bg-purple-950/20 border border-purple-500/20 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-amber-500/20 border border-amber-500/30 flex items-center justify-center">
                      <Sparkles className="w-5 h-5 text-amber-400" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white">Quality Calibrated</p>
                      <p className="text-[11px] text-emerald-400 font-semibold">Broadcast Grade (100% Ready)</p>
                    </div>
                  </div>
                  <Link
                    to="/dashboard/tools"
                    className="text-xs px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-medium transition-colors"
                  >
                    Open Tool
                  </Link>
                </div>

                {/* Subtitle / Script snippet */}
                <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-300">
                      {activeTab === 'script' ? 'Hook Breakdown' : 'Aesthetic Calibration'}
                    </span>
                    <span className="text-[10px] text-cyan-400 font-mono">BROADCAST 2026</span>
                  </div>
                  <p className="text-xs text-slate-400 italic">
                    {activeTab === 'script'
                      ? '"Did you know that 99% of creators make this mistake in the first 3 seconds?"'
                      : '"Zero noise artifacts, accurate HDR tone mapping, and prompt token fidelity."'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION: What We Create */}
      <section className="py-20 border-t border-white/10 bg-[#0B0D15]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-14">
            <span className="text-xs uppercase font-bold tracking-widest text-purple-400">
              Complete Creative Arsenal
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              What We Create
            </h2>
            <p className="text-sm sm:text-base text-slate-400">
              Eight hyper-tuned generative AI instruments engineered to produce agency-grade digital media.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {creationCategories.map((item, idx) => (
              <div
                key={idx}
                className="group relative rounded-2xl p-6 bg-white/[0.03] hover:bg-white/[0.06] border border-white/10 hover:border-purple-500/40 transition-all duration-300 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div
                    className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${item.color} p-[1px] shadow-lg`}
                  >
                    <div className="w-full h-full bg-[#0C0E17] rounded-[11px] flex items-center justify-center">
                      <item.icon className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-white group-hover:text-purple-300 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{item.description}</p>
                </div>

                <div className="pt-6">
                  <Link
                    to="/dashboard/tools"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-purple-400 hover:text-purple-300 transition-colors"
                  >
                    <span>Launch Engine</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION: How It Works */}
      <section className="py-24 border-t border-white/10 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
            <span className="text-xs uppercase font-bold tracking-widest text-cyan-400">
              Seamless Workflow
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              How It Works
            </h2>
            <p className="text-sm sm:text-base text-slate-400">
              Transform conceptual sketches into finalized commercial assets in four effortless stages.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((st, i) => (
              <div
                key={i}
                className="relative rounded-2xl p-6 bg-white/[0.02] border border-white/10 space-y-4"
              >
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center">
                    <st.icon className="w-5 h-5 text-purple-400" />
                  </div>
                  <span className="text-2xl font-black font-mono text-white/20">{st.step}</span>
                </div>
                <h3 className="text-lg font-bold text-white">{st.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{st.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION: Featured Work (Portfolio Preview) */}
      <section className="py-24 border-t border-white/10 bg-[#0B0D15]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <span className="text-xs uppercase font-bold tracking-widest text-purple-400">
                Studio Quality
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mt-1">
                Featured Work
              </h2>
              <p className="text-sm text-slate-400 mt-2">
                A selection of high-retention video assets, photorealistic visuals, and viral campaigns generated on our platform.
              </p>
            </div>
            <Link
              to="/portfolio"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white text-xs font-semibold border border-white/10 self-start md:self-auto"
            >
              <span>View Full Portfolio</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {INITIAL_PORTFOLIO_ITEMS.slice(0, 6).map((item, idx) => (
              <div
                key={idx}
                className="group rounded-2xl overflow-hidden border border-white/10 bg-[#0C0E17] hover:border-purple-500/40 transition-all duration-300 flex flex-col"
              >
                <div className="relative aspect-video overflow-hidden">
                  <img
                    src={item.mediaUrl}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-black/70 backdrop-blur-md text-purple-300 border border-purple-500/30">
                      {item.category}
                    </span>
                  </div>
                </div>
                <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <h3 className="font-bold text-white text-base group-hover:text-purple-300 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1.5 line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t border-white/5 text-xs text-slate-400">
                    <div className="flex gap-1.5 flex-wrap">
                      {item.tags?.slice(0, 2).map((t, ti) => (
                        <span key={ti} className="text-[10px] text-slate-400 bg-white/5 px-2 py-0.5 rounded">
                          #{t}
                        </span>
                      ))}
                    </div>
                    <Link
                      to="/portfolio"
                      className="text-purple-400 hover:text-purple-300 font-semibold flex items-center gap-1"
                    >
                      <span>Explore</span>
                      <ChevronRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION: Why AI Creative Studio */}
      <section className="py-24 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
            <span className="text-xs uppercase font-bold tracking-widest text-amber-400">
              The Studio Advantage
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Why AI Creative Studio
            </h2>
            <p className="text-sm sm:text-base text-slate-400">
              Built from the ground up for modern creators, agencies, and businesses demanding broadcast quality.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {valueProps.map((vp, i) => (
              <div
                key={i}
                className="p-6 rounded-2xl bg-white/[0.02] border border-white/10 hover:border-purple-500/30 transition-all space-y-3"
              >
                <div className="w-10 h-10 rounded-xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center">
                  <vp.icon className="w-5 h-5 text-purple-400" />
                </div>
                <h3 className="text-base font-bold text-white">{vp.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{vp.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION: CTA */}
      <section className="py-24 border-t border-white/10 bg-gradient-to-b from-[#090A0F] to-[#120F24]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-purple-600 to-cyan-400 p-[1px] mx-auto shadow-xl shadow-purple-600/30">
            <div className="w-full h-full bg-[#090A0F] rounded-[15px] flex items-center justify-center">
              <Sparkles className="w-7 h-7 text-purple-400" />
            </div>
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Ready To Turn Your Ideas Into Reality?
          </h2>

          <p className="text-base sm:text-lg text-slate-300 max-w-xl mx-auto leading-relaxed">
            Join thousands of creators, brands, and agencies generating breakthrough digital media every single day.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to={userProfile ? '/dashboard' : '/signup'}
              className="w-full sm:w-auto px-9 py-4 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white font-bold text-base shadow-xl shadow-purple-600/40 hover:scale-105 transition-all duration-300"
            >
              Start Creating
            </Link>
            <Link
              to="/pricing"
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-white/5 hover:bg-white/10 text-white font-semibold text-base border border-white/15 transition-all"
            >
              View Pricing & Plans
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
