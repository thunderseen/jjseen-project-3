export interface ProjectItem {
  id: string;
  category: string;
  name: string;
  description?: string;
  href: string;
  useLivePreview: boolean;
  col1Img1: string;
  col1Img2: string;
  col2Img: string;
  tags?: string[];
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
    id: 'student-id-portal',
    category: 'Web App • Live',
    name: 'Student ID Portal',
    description:
      'Independently designed, built, and deployed student ID card web application hosted live on Render.',
    href: 'https://student-id-portal-1.onrender.com',
    useLivePreview: true,
    col1Img1: '',
    col1Img2: '',
    col2Img: '',
    tags: ['Web App', 'Render', 'Live Deployment'],
  },
  {
    id: 'apex-architecture-demo',
    category: 'Concept • GitHub Pages Demo',
    name: 'Apex Architecture & Build',
    description:
      'A business website concept for an architecture and construction brand, published as an interactive GitHub Pages demo.',
    href: 'https://thunderseen.github.io/jjs-project-2/demos/apex-agency.html',
    useLivePreview: true,
    col1Img1: '',
    col1Img2: '',
    col2Img: '',
    tags: ['Business Website', 'Website Concept', 'GitHub Pages'],
  },
  {
    id: 'velora-storefront-demo',
    category: 'Concept • GitHub Pages Demo',
    name: 'Velora Roasters',
    description:
      'A coffee storefront concept with a conversion-focused shopping experience, published as a GitHub Pages demo.',
    href: 'https://thunderseen.github.io/jjs-project-2/demos/velora-store.html',
    useLivePreview: true,
    col1Img1: '',
    col1Img2: '',
    col2Img: '',
    tags: ['Storefront', 'Website Concept', 'GitHub Pages'],
  },
  {
    id: 'pulserank-seo-demo',
    category: 'Concept • GitHub Pages Demo',
    name: 'PulseRank AI',
    description:
      'An SEO audit and lead-generation showcase for keyword discovery and prospect intelligence.',
    href: 'https://thunderseen.github.io/jjs-project-2/demos/pulse-ai-seo.html',
    useLivePreview: true,
    col1Img1: '',
    col1Img2: '',
    col2Img: '',
    tags: ['SEO', 'Lead Generation', 'GitHub Pages'],
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
