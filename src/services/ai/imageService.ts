export interface ImageGenerationSettings {
  aspectRatio: '1:1' | '16:9' | '9:16' | '4:3';
  style: 'Realistic' | 'Cinematic' | 'Anime' | '3D' | 'Illustration' | 'Product Photography';
  quality: 'Standard' | 'HD';
}

export interface GeneratedImageResult {
  imageUrl: string;
  prompt: string;
  settings: ImageGenerationSettings;
  seed: number;
  width: number;
  height: number;
  creditsCost: number;
}

// Curated high-aesthetic AI artwork repository mapped to styles
const STYLE_PRESETS: Record<string, string[]> = {
  Realistic: [
    'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
  ],
  Cinematic: [
    'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1542051841857-5f90071e7989?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1200&q=80',
  ],
  Anime: [
    'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=1200&q=80',
  ],
  '3D': [
    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=1200&q=80',
  ],
  Illustration: [
    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=1200&q=80',
  ],
  'Product Photography': [
    'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1200&q=80',
  ],
};

export async function generateImage(
  prompt: string,
  settings: ImageGenerationSettings,
  onProgress?: (progress: number, stage: string) => void
): Promise<GeneratedImageResult> {
  // Provider abstraction: can hook up Imagen 3, Stable Diffusion, or Midjourney API here.
  // In demo mode, simulates real model execution steps with progress callback
  const stages = [
    { pct: 20, stage: 'Analyzing prompt semantic tokens...' },
    { pct: 45, stage: 'Synthesizing diffusion latent space...' },
    { pct: 75, stage: 'Upscaling details & color grading...' },
    { pct: 100, stage: 'Finalizing render...' },
  ];

  for (const s of stages) {
    if (onProgress) onProgress(s.pct, s.stage);
    await new Promise((r) => setTimeout(r, 450));
  }

  const pool = STYLE_PRESETS[settings.style] || STYLE_PRESETS['Cinematic'];
  const randomIndex = Math.floor(Math.random() * pool.length);
  const chosenUrl = pool[randomIndex];

  const dimensionsMap: Record<string, { width: number; height: number }> = {
    '1:1': { width: 1024, height: 1024 },
    '16:9': { width: 1280, height: 720 },
    '9:16': { width: 720, height: 1280 },
    '4:3': { width: 1024, height: 768 },
  };

  const dims = dimensionsMap[settings.aspectRatio] || { width: 1024, height: 1024 };

  return {
    imageUrl: chosenUrl,
    prompt,
    settings,
    seed: Math.floor(Math.random() * 9999999),
    width: dims.width,
    height: dims.height,
    creditsCost: settings.quality === 'HD' ? 10 : 5,
  };
}
