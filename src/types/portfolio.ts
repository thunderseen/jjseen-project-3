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
export const ADMIN_PASS_KEY = 'jayed_portfolio_admin_pass_v2';
export const ADMIN_SESSION_KEY = 'jayed_portfolio_admin_session_v2';

// Lightweight deterministic hash so the passcode is not stored in plaintext in localStorage
export function hashPasscode(input: string): string {
  const salted = `jjs::v2::${input}`;
  let h1 = 0xdeadbeef ^ salted.length;
  let h2 = 0x41c6ce57 ^ salted.length;
  for (let i = 0; i < salted.length; i++) {
    const ch = salted.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  return (4294967296 * (2097151 & h2) + (h1 >>> 0)).toString(36);
}

export function verifyPasscode(candidate: string): boolean {
  const stored = getStoredPasscodeHash();
  return hashPasscode(candidate) === stored;
}

export function getStoredPasscodeHash(): string {
  try {
    return localStorage.getItem(ADMIN_PASS_KEY) || hashPasscode('sabasagol');
  } catch {
    return hashPasscode('sabasagol');
  }
}

export function updateStoredPasscode(newPasscode: string): void {
  try {
    localStorage.setItem(ADMIN_PASS_KEY, hashPasscode(newPasscode));
  } catch {
    // ignore storage quota errors
  }
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

export function normalizeUrl(url: string): string {
  const trimmed = url.trim();
  if (!trimmed) return '';
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
}

export function compressImageFile(file: File, maxDim = 1200, quality = 0.82): Promise<string> {
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
