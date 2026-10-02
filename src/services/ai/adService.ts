export interface AdInput {
  productName: string;
  productDescription: string;
  targetAudience: string;
  platform: 'YouTube' | 'TikTok' | 'Instagram' | 'Facebook';
  adDuration: '15s' | '30s' | '60s';
  tone: 'Energetic' | 'Professional' | 'Humorous' | 'Urgent' | 'Story-driven';
}

export interface AdSceneIdea {
  timecode: string;
  visual: string;
  audio: string;
  onScreenText: string;
}

export interface GeneratedAdResult {
  productName: string;
  platform: string;
  hook: string;
  script: string;
  scenes: AdSceneIdea[];
  cta: string;
  caption: string;
  hashtags: string[];
  settings: AdInput;
}

export async function generateAdvertisement(
  params: AdInput,
  onProgress?: (progress: number, stage: string) => void
): Promise<GeneratedAdResult> {
  const steps = [
    { pct: 25, stage: `Analyzing high-converting ${params.platform} ad formulas...` },
    { pct: 50, stage: 'Crafting 3-second psychological hook...' },
    { pct: 75, stage: 'Generating kinetic scene breakdown and copy...' },
    { pct: 100, stage: 'Finalizing captions and call-to-action...' },
  ];

  for (const s of steps) {
    if (onProgress) onProgress(s.pct, s.stage);
    await new Promise((r) => setTimeout(r, 380));
  }

  const hook = `Stop scrolling if you are tired of wasting hours on ${params.productName.toLowerCase()} bottlenecks.`;

  const scenes: AdSceneIdea[] = [
    {
      timecode: '0:00 - 0:03',
      visual: 'Close-up face of user looking exhausted at laptop screen, sudden dramatic record scratch.',
      audio: hook,
      onScreenText: `❌ STILL DOING THIS MANUALLY?`,
    },
    {
      timecode: '0:03 - 0:10',
      visual: `Sleek rapid demonstration of ${params.productName} in action with smooth cursor glide and satisfying click sound effect.`,
      audio: `Meet ${params.productName}. It automates ${params.productDescription.slice(0, 80)} with a single click.`,
      onScreenText: `⚡ 10X FASTER WORKFLOW`,
    },
    {
      timecode: '0:10 - 0:20',
      visual: 'Side-by-side comparison with customer review star rating popping on screen with glow particles.',
      audio: `Built specifically for ${params.targetAudience}, giving you back 15+ hours every single week.`,
      onScreenText: `⭐ RATED 4.9/5 BY CREATORS`,
    },
    {
      timecode: '0:20 - 0:30',
      visual: 'Finger tapping glowing CTA button on smartphone, followed by animated confetti explosion.',
      audio: `Try it completely free today. Hit the link below and claim your complimentary access before spots fill up!`,
      onScreenText: `👉 TAP TO CLAIM YOUR FREE ACCESS`,
    },
  ];

  const fullScript = `[HOOK]: ${hook}\n\n[BODY]: If you're in ${params.targetAudience}, you know the old way is broken. ${params.productName} transforms how you work. No steep learning curves, just instant high-impact results.\n\n[CTA]: Click the link below to get started for free!`;

  return {
    productName: params.productName,
    platform: params.platform,
    hook,
    script: fullScript,
    scenes,
    cta: `Claim Your Free 14-Day Trial of ${params.productName}`,
    caption: `Say goodbye to repetitive busywork 👋 Meet ${params.productName} — engineered for ${params.targetAudience} who value speed, quality, and results. Tap the link in bio to start creating today! 🚀`,
    hashtags: [
      `#${params.productName.replace(/\s+/g, '')}`,
      '#ProductivityHack',
      '#CreatorTools',
      `#${params.platform}Ads`,
      '#AITools',
      '#GrowthStrategy',
    ],
    settings: params,
  };
}
