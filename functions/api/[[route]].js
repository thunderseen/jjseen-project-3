// Jayed Jaman Seen Portfolio — Cloudflare Pages Functions + D1 Cloud Backend
// Endpoints:
//   GET  /api/health
//   GET  /api/portfolio
//   POST /api/admin/login
//   POST /api/admin/save
//   POST /api/admin/password

const ALLOWED_ORIGINS = new Set([
  'https://jayed-portfolio.pages.dev',
  'https://thunderseen.github.io',
]);

const DEFAULT_PROJECTS = [
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

function corsHeaders(request) {
  const origin = request.headers.get('Origin') || '';
  const allowOrigin =
    ALLOWED_ORIGINS.has(origin) ||
    origin.endsWith('.jayed-portfolio.pages.dev') ||
    /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/i.test(origin)
      ? origin
      : 'https://jayed-portfolio.pages.dev';

  return {
    'Access-Control-Allow-Origin': allowOrigin,
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Max-Age': '86400',
    Vary: 'Origin',
  };
}

function jsonResponse(request, data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
      ...corsHeaders(request),
    },
  });
}

async function sha256Hex(text) {
  const bytes = new TextEncoder().encode(`jjs-portfolio-salt::${text}`);
  const hashBuf = await crypto.subtle.digest('SHA-256', bytes);
  return Array.from(new Uint8Array(hashBuf))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

async function signToken(payloadStr, secretKey) {
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secretKey),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(payloadStr));
  const sigHex = Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
  return `${btoa(payloadStr)}.${sigHex}`;
}

async function verifyToken(token, secretKey) {
  if (!token || !token.includes('.')) return false;
  const [b64, sigHex] = token.split('.');
  if (!b64 || !sigHex) return false;
  try {
    const payloadStr = atob(b64);
    const payload = JSON.parse(payloadStr);
    if (!payload.exp || Date.now() > payload.exp) return false;
    const expected = await signToken(payloadStr, secretKey);
    return expected === token;
  } catch {
    return false;
  }
}

async function ensureSchema(db) {
  await db
    .prepare(
      `CREATE TABLE IF NOT EXISTS portfolio_state (
        key TEXT PRIMARY KEY,
        value TEXT NOT NULL,
        updated_at TEXT NOT NULL
      )`
    )
    .run();

  await db
    .prepare(
      `CREATE TABLE IF NOT EXISTS admin_auth (
        id INTEGER PRIMARY KEY CHECK (id = 1),
        pass_hash TEXT NOT NULL,
        updated_at TEXT NOT NULL
      )`
    )
    .run();

  // Seed default password hash if missing
  const authRow = await db.prepare('SELECT pass_hash FROM admin_auth WHERE id = 1').first();
  if (!authRow) {
    const initialHash = await sha256Hex('sabasagol');
    await db
      .prepare('INSERT INTO admin_auth (id, pass_hash, updated_at) VALUES (1, ?, ?)')
      .bind(initialHash, new Date().toISOString())
      .run();
  }

  // Seed default projects if missing
  const projRow = await db
    .prepare("SELECT value FROM portfolio_state WHERE key = 'projects'")
    .first();
  if (!projRow) {
    const now = new Date().toISOString();
    await db
      .prepare('INSERT INTO portfolio_state (key, value, updated_at) VALUES (?, ?, ?)')
      .bind('projects', JSON.stringify(DEFAULT_PROJECTS), now)
      .run();
  }
}

async function getAdminHash(db) {
  const row = await db.prepare('SELECT pass_hash FROM admin_auth WHERE id = 1').first();
  return row?.pass_hash || (await sha256Hex('sabasagol'));
}

async function readPortfolio(db) {
  const { results } = await db
    .prepare('SELECT key, value, updated_at FROM portfolio_state')
    .all();

  const map = new Map();
  let lastUpdated = null;
  for (const row of results || []) {
    map.set(row.key, row.value);
    if (!lastUpdated || row.updated_at > lastUpdated) {
      lastUpdated = row.updated_at;
    }
  }

  let projects = DEFAULT_PROJECTS;
  let showcaseItems = [];
  let cvPdfDataUrl = null;
  let cvPdfName = null;

  try {
    if (map.has('projects')) projects = JSON.parse(map.get('projects'));
  } catch {
    projects = DEFAULT_PROJECTS;
  }
  try {
    if (map.has('showcaseItems')) showcaseItems = JSON.parse(map.get('showcaseItems'));
  } catch {
    showcaseItems = [];
  }
  if (map.has('cvPdfDataUrl')) {
    const val = map.get('cvPdfDataUrl');
    cvPdfDataUrl = val ? val : null;
  }
  if (map.has('cvPdfName')) {
    const val = map.get('cvPdfName');
    cvPdfName = val ? val : null;
  }

  return {
    projects,
    showcaseItems,
    cvPdfDataUrl,
    cvPdfName,
    updatedAt: lastUpdated,
    synced: true,
  };
}

export async function onRequest(context) {
  const { request, env } = context;

  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders(request) });
  }

  const url = new URL(request.url);
  const path = url.pathname.replace(/^\/api\/?/, '').replace(/\/+$/, '');

  const db = env.DB;
  if (!db) {
    return jsonResponse(request, { ok: false, error: 'D1 database binding missing' }, 500);
  }

  try {
    await ensureSchema(db);

    if (request.method === 'GET' && path === 'health') {
      return jsonResponse(request, {
        ok: true,
        service: 'jayed-portfolio-api',
        database: 'cloudflare-d1',
        timestamp: new Date().toISOString(),
      });
    }

    if (request.method === 'GET' && path === 'portfolio') {
      const data = await readPortfolio(db);
      return jsonResponse(request, data, 200);
    }

    if (request.method === 'POST' && path === 'admin/login') {
      const body = await request.json().catch(() => ({}));
      const password = typeof body.password === 'string' ? body.password : '';
      const storedHash = await getAdminHash(db);
      const inputHash = await sha256Hex(password);

      if (inputHash !== storedHash) {
        return jsonResponse(request, { ok: false, error: 'Incorrect password.' }, 401);
      }

      const payload = JSON.stringify({
        sub: 'owner',
        exp: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7-day session
      });
      const token = await signToken(payload, storedHash);
      return jsonResponse(request, { ok: true, token }, 200);
    }

    // Protected routes require Bearer token
    const authHeader = request.headers.get('Authorization') || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7).trim() : '';
    const storedHash = await getAdminHash(db);
    const valid = await verifyToken(token, storedHash);
    if (!valid) {
      return jsonResponse(request, { ok: false, error: 'Unauthorized. Please sign in again.' }, 401);
    }

    if (request.method === 'POST' && path === 'admin/save') {
      const body = await request.json().catch(() => ({}));
      const now = new Date().toISOString();

      const projects = Array.isArray(body.projects) ? body.projects : [];
      const showcaseItems = Array.isArray(body.showcaseItems) ? body.showcaseItems : [];
      const cvPdfDataUrl = typeof body.cvPdfDataUrl === 'string' ? body.cvPdfDataUrl : '';
      const cvPdfName = typeof body.cvPdfName === 'string' ? body.cvPdfName : '';

      // Basic sanity guard against extreme payloads (D1 row limit)
      if (cvPdfDataUrl.length > 5_500_000) {
        return jsonResponse(
          request,
          { ok: false, error: 'PDF file is too large for cloud sync (max ~3.5 MB).' },
          413
        );
      }

      const upsert = db.prepare(
        `INSERT INTO portfolio_state (key, value, updated_at)
         VALUES (?, ?, ?)
         ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at`
      );

      await db.batch([
        upsert.bind('projects', JSON.stringify(projects), now),
        upsert.bind('showcaseItems', JSON.stringify(showcaseItems), now),
        upsert.bind('cvPdfDataUrl', cvPdfDataUrl, now),
        upsert.bind('cvPdfName', cvPdfName, now),
      ]);

      return jsonResponse(request, { ok: true, updatedAt: now }, 200);
    }

    if (request.method === 'POST' && path === 'admin/password') {
      const body = await request.json().catch(() => ({}));
      const currentPassword =
        typeof body.currentPassword === 'string' ? body.currentPassword : '';
      const newPassword = typeof body.newPassword === 'string' ? body.newPassword : '';

      if ((await sha256Hex(currentPassword)) !== storedHash) {
        return jsonResponse(request, { ok: false, error: 'Current password is incorrect.' }, 400);
      }
      if (newPassword.length < 4) {
        return jsonResponse(
          request,
          { ok: false, error: 'New password must be at least 4 characters.' },
          400
        );
      }

      const nextHash = await sha256Hex(newPassword);
      const now = new Date().toISOString();
      await db
        .prepare('UPDATE admin_auth SET pass_hash = ?, updated_at = ? WHERE id = 1')
        .bind(nextHash, now)
        .run();

      const payload = JSON.stringify({
        sub: 'owner',
        exp: Date.now() + 7 * 24 * 60 * 60 * 1000,
      });
      const newToken = await signToken(payload, nextHash);
      return jsonResponse(request, { ok: true, token: newToken }, 200);
    }

    return jsonResponse(request, { ok: false, error: 'Not found' }, 404);
  } catch (err) {
    return jsonResponse(
      request,
      { ok: false, error: err?.message || 'Internal server error' },
      500
    );
  }
}
