export interface ProjectItem {
  id: string;
  category: string;
  name: string;
  description?: string;
  href: string;
  previewImage?: string;
  useLivePreview: boolean;
  col1Img1: string;
  col1Img2: string;
  col2Img: string;
  tags?: string[];
}

export function resolveAssetUrl(src?: string): string {
  if (!src) return '';
  if (/^(https?:|data:|blob:|\/)/i.test(src)) return src;
  return `${import.meta.env.BASE_URL}${src.replace(/^\.\//, '')}`;
}

export interface ShowcaseItem {
  id: string;
  title?: string;
  imageUrl: string;
  linkUrl?: string;
  row: 1 | 2;
}

export interface PortfolioStore {
  projects: ProjectItem[];
  showcaseItems: ShowcaseItem[];
  cvPdfDataUrl: string | null;
  cvPdfName: string | null;
}

export const STORAGE_KEY = 'jayed_portfolio_store_v1';
export const ADMIN_TOKEN_KEY = 'jayed_portfolio_admin_token_v3';

export const CLOUD_API_ORIGIN = 'https://jayed-portfolio.pages.dev';

export function getApiBase(): string {
  if (typeof window !== 'undefined') {
    const host = window.location.hostname;
    if (host === 'jayed-portfolio.pages.dev' || host.endsWith('.jayed-portfolio.pages.dev')) {
      return '/api';
    }
  }
  return `${CLOUD_API_ORIGIN}/api`;
}

export const DEFAULT_PROJECTS: ProjectItem[] = [
  {
    id: 'seen-studio-store',
    category: 'E-Commerce • Cloudflare D1',
    name: 'SEEN Studio Store',
    description:
      'Luxury spatial virtual T-shirt storefront with sculptural mannequins, real-time try-on, bKash/Nagad/COD checkout, and Cloudflare D1 backend.',
    href: 'https://seen-studio-store.pages.dev/',
    previewImage: 'previews/seen-studio-store.webp',
    useLivePreview: true,
    col1Img1: '',
    col1Img2: '',
    col2Img: '',
    tags: ['E-Commerce', 'Cloudflare D1', 'bKash & Nagad'],
  },
  {
    id: 'seen-bazar',
    category: 'Organic Store • Live',
    name: 'SEEN Bazar',
    description:
      'Pure organic foods, safe groceries, and daily wellness online storefront engineered for fast mobile shopping across Bangladesh.',
    href: 'https://seen-bazar.pages.dev/',
    previewImage: 'previews/seen-bazar.webp',
    useLivePreview: true,
    col1Img1: '',
    col1Img2: '',
    col2Img: '',
    tags: ['Organic Store', 'Mobile UX', 'Cloudflare Pages'],
  },
  {
    id: 'seen-bites',
    category: 'Food Ordering • Live',
    name: 'SEEN Bites',
    description:
      'Interactive fast-food & combo ordering platform featuring burgers, golden fries, cheesy pizzas, rice bowls, oven pasta, momos, and waffles.',
    href: 'https://seen-bites.pages.dev/',
    previewImage: 'previews/seen-bites.webp',
    useLivePreview: true,
    col1Img1: '',
    col1Img2: '',
    col2Img: '',
    tags: ['Food App', 'Combo Menu', 'Cloudflare Pages'],
  },
  {
    id: 'seen-services',
    category: 'Agency & Pricing • Live',
    name: 'SEEN Digital Agency',
    description:
      'All-in-one digital advertising agency site with Meta, Google, YouTube, TikTok & LinkedIn Ads pricing and an interactive budget calculator.',
    href: 'https://seen-services.pages.dev/',
    previewImage: 'previews/seen-services.webp',
    useLivePreview: true,
    col1Img1: '',
    col1Img2: '',
    col2Img: '',
    tags: ['Digital Ads', 'Calculator', 'Agency'],
  },
  {
    id: 'seen-studio-hub',
    category: 'Studio & AI • Live',
    name: 'SEEN Studio Hub',
    description:
      'Full-stack web, WooCommerce, cloud app, technical SEO, and AI workflow studio featuring a 60-second site audit and project estimator.',
    href: 'https://seen-studio.pages.dev/',
    previewImage: 'previews/seen-studio-hub.webp',
    useLivePreview: true,
    col1Img1: '',
    col1Img2: '',
    col2Img: '',
    tags: ['AI Workflows', 'Site Audit', 'Estimator'],
  },
  {
    id: 'seen-showcase',
    category: 'Showcase Studio • Live',
    name: 'SEEN Live Showcase',
    description:
      'Interactive multi-site live website preview and client order studio showcasing published web apps and e-commerce builds.',
    href: 'https://seen-showcase.pages.dev/',
    previewImage: 'previews/seen-showcase.webp',
    useLivePreview: true,
    col1Img1: '',
    col1Img2: '',
    col2Img: '',
    tags: ['Live Showcase', 'Order Studio', 'Cloudflare'],
  },
  {
    id: 'student-id-portal',
    category: 'Cloud Web App • Live',
    name: 'Student ID Card Portal',
    description:
      'Official bilingual (Bangla & English) Trainee ID Card Registration Portal & CR80 Print Studio built for DYD & e-Learning & Earning Ltd.',
    href: 'https://student-id-portal.pages.dev/',
    previewImage: 'previews/student-id-portal.webp',
    useLivePreview: true,
    col1Img1: '',
    col1Img2: '',
    col2Img: '',
    tags: ['Bilingual App', 'CR80 Print PDF', 'Cloudflare D1'],
  },
  {
    id: 'jayed-3d-portfolio',
    category: '3D Portfolio • Live',
    name: 'Interactive 3D Portfolio',
    description:
      'Spatial 3D web designer and WordPress developer portfolio featuring interactive demos and real-time motion styling.',
    href: 'https://jayed-jaman-seen.pages.dev/',
    previewImage: 'previews/jayed-3d-portfolio.webp',
    useLivePreview: true,
    col1Img1: '',
    col1Img2: '',
    col2Img: '',
    tags: ['3D UI', 'WordPress', 'Portfolio'],
  },
  {
    id: 'seenvault-banking',
    category: 'Fintech Web App • Live',
    name: 'TakaVault / SeenVault',
    description:
      'Modern digital banking and personal finance vault web application deployed live on Vercel.',
    href: 'https://seenvault.vercel.app/',
    previewImage: 'previews/seenvault-banking.webp',
    useLivePreview: true,
    col1Img1: '',
    col1Img2: '',
    col2Img: '',
    tags: ['Fintech', 'Vercel', 'Web App'],
  },
  {
    id: 'apex-architecture-demo',
    category: 'Concept Demo • Live',
    name: 'Apex Architecture & Build',
    description:
      'High-speed corporate website concept for an architecture and construction brand with Rank Math SEO structure.',
    href: 'https://jjseen.pages.dev/demos/apex-agency.html',
    previewImage: 'previews/apex-architecture-demo.webp',
    useLivePreview: true,
    col1Img1: '',
    col1Img2: '',
    col2Img: '',
    tags: ['Business Site', 'Elementor Style', 'Fast UI'],
  },
  {
    id: 'velora-storefront-demo',
    category: 'Storefront Demo • Live',
    name: 'Velora Coffee Roasters',
    description:
      'Conversion-focused specialty coffee storefront concept with filterable catalog and interactive slide-out cart UX.',
    href: 'https://jjseen.pages.dev/demos/velora-store.html',
    previewImage: 'previews/velora-storefront-demo.webp',
    useLivePreview: true,
    col1Img1: '',
    col1Img2: '',
    col2Img: '',
    tags: ['WooCommerce UX', 'Cart Drawer', 'Storefront'],
  },
  {
    id: 'pulserank-seo-demo',
    category: 'SEO & Lead Demo • Live',
    name: 'PulseRank AI',
    description:
      'Interactive SEO audit and B2B/B2C lead-generation dashboard for keyword discovery and prospect intelligence.',
    href: 'https://jjseen.pages.dev/demos/pulse-ai-seo.html',
    previewImage: 'previews/pulserank-seo-demo.webp',
    useLivePreview: true,
    col1Img1: '',
    col1Img2: '',
    col2Img: '',
    tags: ['SEO Audit', 'Lead Gen', 'AI Dashboard'],
  },
];

export const DEFAULT_STORE: PortfolioStore = {
  projects: DEFAULT_PROJECTS,
  showcaseItems: [],
  cvPdfDataUrl: null,
  cvPdfName: null,
};

export function loadStore(): PortfolioStore {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_STORE;
    const parsed = JSON.parse(raw) as Partial<PortfolioStore>;
    return {
      projects: Array.isArray(parsed.projects) ? parsed.projects : DEFAULT_PROJECTS,
      showcaseItems: Array.isArray(parsed.showcaseItems) ? parsed.showcaseItems : [],
      cvPdfDataUrl: typeof parsed.cvPdfDataUrl === 'string' ? parsed.cvPdfDataUrl : null,
      cvPdfName: typeof parsed.cvPdfName === 'string' ? parsed.cvPdfName : null,
    };
  } catch {
    return DEFAULT_STORE;
  }
}

export function saveStore(store: PortfolioStore): boolean {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
    return true;
  } catch {
    return false;
  }
}

export async function fetchCloudPortfolio(): Promise<PortfolioStore | null> {
  try {
    const res = await fetch(`${getApiBase()}/portfolio`, { cache: 'no-store' });
    if (!res.ok) return null;
    const data = (await res.json()) as Partial<PortfolioStore>;
    const normalized: PortfolioStore = {
      projects: Array.isArray(data.projects) ? data.projects : DEFAULT_PROJECTS,
      showcaseItems: Array.isArray(data.showcaseItems) ? data.showcaseItems : [],
      cvPdfDataUrl: typeof data.cvPdfDataUrl === 'string' && data.cvPdfDataUrl ? data.cvPdfDataUrl : null,
      cvPdfName: typeof data.cvPdfName === 'string' && data.cvPdfName ? data.cvPdfName : null,
    };
    saveStore(normalized);
    return normalized;
  } catch {
    return null;
  }
}

export async function loginCloudAdmin(
  password: string
): Promise<{ ok: boolean; token?: string; error?: string }> {
  try {
    const res = await fetch(`${getApiBase()}/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok || !data.ok || !data.token) {
      return { ok: false, error: data.error || 'Incorrect password.' };
    }
    try {
      sessionStorage.setItem(ADMIN_TOKEN_KEY, data.token);
    } catch {
      // ignore storage errors
    }
    return { ok: true, token: data.token };
  } catch {
    return { ok: false, error: 'Could not connect to cloud server. Check your internet connection.' };
  }
}

export function getSavedAdminToken(): string | null {
  try {
    return sessionStorage.getItem(ADMIN_TOKEN_KEY);
  } catch {
    return null;
  }
}

export function clearSavedAdminToken(): void {
  try {
    sessionStorage.removeItem(ADMIN_TOKEN_KEY);
  } catch {
    // ignore
  }
}

export async function saveCloudPortfolio(
  store: PortfolioStore
): Promise<{ ok: boolean; error?: string; unauthorized?: boolean }> {
  const token = getSavedAdminToken();
  if (!token) {
    return { ok: false, unauthorized: true, error: 'Please sign in again.' };
  }
  try {
    const res = await fetch(`${getApiBase()}/admin/save`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(store),
    });
    const data = await res.json().catch(() => ({}));
    if (res.status === 401) {
      clearSavedAdminToken();
      return { ok: false, unauthorized: true, error: data.error || 'Session expired.' };
    }
    if (!res.ok || !data.ok) {
      return { ok: false, error: data.error || 'Cloud save failed.' };
    }
    saveStore(store);
    return { ok: true };
  } catch {
    return { ok: false, error: 'Network error while saving to cloud.' };
  }
}

export async function updateCloudAdminPassword(
  currentPassword: string,
  newPassword: string
): Promise<{ ok: boolean; error?: string; unauthorized?: boolean }> {
  const token = getSavedAdminToken();
  if (!token) {
    return { ok: false, unauthorized: true, error: 'Please sign in again.' };
  }
  try {
    const res = await fetch(`${getApiBase()}/admin/password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ currentPassword, newPassword }),
    });
    const data = await res.json().catch(() => ({}));
    if (res.status === 401) {
      clearSavedAdminToken();
      return { ok: false, unauthorized: true, error: data.error || 'Session expired.' };
    }
    if (!res.ok || !data.ok) {
      return { ok: false, error: data.error || 'Could not update password.' };
    }
    if (data.token) {
      try {
        sessionStorage.setItem(ADMIN_TOKEN_KEY, data.token);
      } catch {
        // ignore
      }
    }
    return { ok: true };
  } catch {
    return { ok: false, error: 'Network error while updating password.' };
  }
}

export function normalizeUrl(url: string): string {
  const trimmed = url.trim();
  if (!trimmed) return '';
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
}

export function compressImageFile(file: File, maxDim = 1000, quality = 0.78): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Failed to read image file'));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error('Invalid image file'));
      img.onload = () => {
        let { width, height } = img;
        if (width > maxDim || height > maxDim) {
          const scale = maxDim / Math.max(width, height);
          width = Math.round(width * scale);
          height = Math.round(height * scale);
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(reader.result as string);
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/webp', quality));
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  });
}
