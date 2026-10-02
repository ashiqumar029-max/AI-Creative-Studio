export interface SocialInput {
  platform: 'TikTok' | 'Instagram' | 'YouTube Shorts' | 'LinkedIn' | 'X/Twitter' | 'Facebook';
  goal: 'Engagement' | 'Lead Generation' | 'Viral Growth' | 'Brand Awareness';
  topic: string;
  tone: 'Punchy' | 'Inspirational' | 'Controversial' | 'Educational' | 'Relatable';
  format: 'Shorts/Reel Script' | 'Carousel Slides' | 'Long-Form Post' | 'Thread';
}

export interface GeneratedSocialResult {
  headline: string;
  hook: string;
  content: string;
  visualSuggestions: string[];
  cta: string;
  hashtags: string[];
  bestPostingTime: string;
  settings: SocialInput;
}

export async function generateSocialContent(
  params: SocialInput,
  onProgress?: (progress: number, stage: string) => void
): Promise<GeneratedSocialResult> {
  const steps = [
    { pct: 30, stage: `Analyzing ${params.platform} algorithm trends...` },
    { pct: 60, stage: 'Synthesizing viral engagement loop...' },
    { pct: 90, stage: 'Formatting carousels & hashtag clusters...' },
    { pct: 100, stage: 'Finalizing social media blueprint...' },
  ];

  for (const s of steps) {
    if (onProgress) onProgress(s.pct, s.stage);
    await new Promise((r) => setTimeout(r, 350));
  }

  const hook = `Most people get ${params.topic} completely backwards. Here is what actually moves the needle in 2026:`;

  let formattedContent = '';
  if (params.format === 'Carousel Slides') {
    formattedContent = `Slide 1: ${hook}\n\nSlide 2: 🛑 The Costly Mistake: Spending 80% of your energy on details that customers never notice.\n\nSlide 3: 💡 The Shift: Focus on 1 high-leverage constraint.\n\nSlide 4: 🛠️ The 3-Step Execution Checklist: Actionable, repeatable, and scalable.\n\nSlide 5: 🚀 The Transformation: Real metrics from real deployment.\n\nSlide 6: Bookmark this carousel and drop a "BLUEPRINT" in the comments for the raw template.`;
  } else if (params.format === 'Shorts/Reel Script') {
    formattedContent = `[0:00 - 0:02]: ${hook}\n[0:02 - 0:15]: When I stopped following the crowd and tested this framework, my output increased by 400% without burnout.\n[0:15 - 0:30]: Three quick steps: First, audit your friction. Second, deploy AI automation. Third, double down on human storytelling.\n[0:30 - 0:40]: Tap save so you don't lose this when planning your next release!`;
  } else {
    formattedContent = `${hook}\n\n1. Simplicity scales, complexity fails.\n2. Leverage AI for speed, but inject your raw human perspective.\n3. Consistency beats intermittent perfection every single time.\n\nWhat is your biggest takeaway from this? Drop your thoughts below 👇`;
  }

  return {
    headline: `Mastering ${params.topic} on ${params.platform}`,
    hook,
    content: formattedContent,
    visualSuggestions: [
      'High-contrast B-roll with kinetic font overlays',
      'Split-screen reaction with aesthetic studio lighting',
      'Dynamic timeline zoom on key statistics',
    ],
    cta: 'Save this post and follow for daily actionable creator breakdowns.',
    hashtags: [
      `#${params.topic.replace(/\s+/g, '')}`,
      '#ContentStrategy',
      `#${params.platform.replace(/\s+/g, '')}Growth`,
      '#ViralContent',
      '#CreatorEconomy',
    ],
    bestPostingTime: 'Tuesday & Thursday at 11:30 AM or 6:45 PM EST',
    settings: params,
  };
}
