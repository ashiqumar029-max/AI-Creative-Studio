import { getPortfolioItems, createPortfolioItem } from './portfolioService';
import type { PortfolioItem } from '../../types';

export const INITIAL_PORTFOLIO_ITEMS: Omit<PortfolioItem, 'id' | 'createdAt'>[] = [
  {
    title: 'Cyberpunk Tokyo 2099',
    description: 'Cinematic 4K AI video generated with atmospheric rain, volumetric neon lighting, and custom electronic score.',
    category: 'videos',
    mediaUrl: 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?auto=format&fit=crop&w=1200&q=80',
    mediaType: 'image',
    featured: true,
    tags: ['Sci-Fi', 'Cinematic', 'Neon', '4K'],
  },
  {
    title: 'Hyper-Converting YouTube Thumbnail',
    description: 'CTR-optimized thumbnail with 3D facial expressions, hyper-saturated contrast, and bold typography overlay.',
    category: 'thumbnails',
    mediaUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
    mediaType: 'image',
    featured: true,
    tags: ['YouTube', 'CTR Boost', '3D Badge'],
  },
  {
    title: 'Minimalist Lumina Architecture',
    description: 'Photorealistic architectural render of a sustainable glass pavilion bathed in Scandinavian golden hour sunlight.',
    category: 'images',
    mediaUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    mediaType: 'image',
    featured: true,
    tags: ['Architecture', 'Photorealism', 'Lighting'],
  },
  {
    title: 'Aura Sound Dynamic Campaign',
    description: 'High-impact TikTok & Instagram Reels commercial featuring kinetic script hooks and rhythmic audio transitions.',
    category: 'advertisements',
    mediaUrl: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=1200&q=80',
    mediaType: 'image',
    featured: true,
    tags: ['SaaS Ad', 'TikTok', 'Viral Hook'],
  },
  {
    title: 'Viral Carousel & Short-form Pack',
    description: 'Multi-slide educational tech carousel design with 8.4x engagement multiplier across LinkedIn and Instagram.',
    category: 'social_media',
    mediaUrl: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&w=1200&q=80',
    mediaType: 'image',
    featured: false,
    tags: ['Carousel', 'Instagram', 'Engagement'],
  },
  {
    title: 'Nexus Quantum Identity System',
    description: 'Comprehensive brand identity: generative vector logomarks, typography system, and iridescent gradient stationery.',
    category: 'branding',
    mediaUrl: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=1200&q=80',
    mediaType: 'image',
    featured: true,
    tags: ['Branding', 'Vector', 'Identity', 'Design'],
  },
  {
    title: 'Deep Space Orbital Sequence',
    description: 'Zero-G cinematography sequence generated with realistic gravitational lensing and solar reflection physics.',
    category: 'videos',
    mediaUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80',
    mediaType: 'image',
    featured: false,
    tags: ['Space', 'VFX', 'Cinematic'],
  },
  {
    title: 'Eco-Luxury Cosmetic Packaging',
    description: 'High-end studio product photography with macro water droplets, matte ceramic finishes, and clean typography.',
    category: 'images',
    mediaUrl: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1200&q=80',
    mediaType: 'image',
    featured: false,
    tags: ['E-Commerce', 'Product Studio', 'Luxury'],
  }
];

export async function adminSeedPortfolio(): Promise<number> {
  let count = 0;
  try {
    const existing = await getPortfolioItems();
    if (!existing || existing.length === 0) {
      for (const item of INITIAL_PORTFOLIO_ITEMS) {
        await createPortfolioItem(item);
        count++;
      }
    }
  } catch (err) {
    console.error('Failed to seed portfolio items:', err);
    throw err;
  }
  return count;
}
