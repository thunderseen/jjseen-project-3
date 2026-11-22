import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Lock,
  LogOut,
  Plus,
  Trash2,
  Edit3,
  Globe,
  Image as ImageIcon,
  ArrowUp,
  ArrowDown,
  Upload,
  FileText,
  Download,
  Shield,
  Check,
  Sparkles,
  ExternalLink,
  Cloud,
} from 'lucide-react';
import {
  PortfolioStore,
  ProjectItem,
  ShowcaseItem,
  clearSavedAdminToken,
  compressImageFile,
  getSavedAdminToken,
  loginCloudAdmin,
  normalizeUrl,
  saveCloudPortfolio,
  updateCloudAdminPassword,
} from '../types/portfolio';

interface AdminPanelProps {
  open: boolean;
  onClose: () => void;
  store: PortfolioStore;
  onUpdateStore: (next: PortfolioStore) => void;
}

type AdminTab = 'showcase' | 'projects' | 'cv' | 'security';

const EMPTY_FORM: Omit<ProjectItem, 'id'> = {
  name: '',
  category: 'WordPress • Live',
  description: '',
  href: '',
  useLivePreview: true,
  col1Img1: '',
  col1Img2: '',
  col2Img: '',
  tags: [],
};

export const AdminPanel: React.FC<AdminPanelProps> = ({
  open,
  onClose,
  store,
  onUpdateStore,
}) => {
  const [authed, setAuthed] = useState<boolean>(() => Boolean(getSavedAdminToken()));
  const [loginPass, setLoginPass] = useState('');
  const [loginError, setLoginError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [syncing, setSyncing] = useState(false);

  const [tab, setTab] = useState<AdminTab>('showcase');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<Omit<ProjectItem, 'id'>>(EMPTY_FORM);
  const [showcaseForm, setShowcaseForm] = useState<{
    title: string;
    imageUrl: string;
    linkUrl: string;
    row: 1 | 2;
  }>({ title: '', imageUrl: '', linkUrl: '', row: 1 });
  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  // Security update fields
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const importInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!statusMsg) return;
    const t = setTimeout(() => setStatusMsg(null), 3200);
    return () => clearTimeout(t);
  }, [statusMsg]);

  const notify = (msg: string) => setStatusMsg(msg);

  const persistToCloud = async (next: PortfolioStore, successMsg: string) => {
    onUpdateStore(next);
    setSyncing(true);
    const res = await saveCloudPortfolio(next);
    setSyncing(false);
    if (res.unauthorized) {
      setAuthed(false);
      setLoginError('Session expired. Please sign in again.');
      return;
    }
    if (!res.ok) {
      notify(`Saved locally, but cloud sync failed: ${res.error}`);
      return;
    }
    notify(`${successMsg} (Synced to Cloud DB ✓)`);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginPass) return;
    setAuthLoading(true);
    setLoginError('');
    const res = await loginCloudAdmin(loginPass);
    setAuthLoading(false);
    if (res.ok) {
      setAuthed(true);
      setLoginPass('');
    } else {
      setLoginError(res.error || 'Incorrect password. Access denied.');
    }
  };

  const handleLogout = () => {
    setAuthed(false);
    setLoginPass('');
    clearSavedAdminToken();
  };

  const startEdit = (p: ProjectItem) => {
    setEditingId(p.id);
    setForm({
      name: p.name,
      category: p.category,
      description: p.description || '',
      href: p.href,
      useLivePreview: p.useLivePreview,
      col1Img1: p.col1Img1,
      col1Img2: p.col1Img2,
      col2Img: p.col2Img,
      tags: p.tags || [],
    });
  };

  const resetForm = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
  };

  const handleSaveProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) {
      notify('Please enter a project title.');
      return;
    }

    const cleaned: ProjectItem = {
      id: editingId || `proj-${Date.now()}`,
      name: form.name.trim(),
      category: form.category.trim() || 'Featured Project',
      description: form.description?.trim() || '',
      href: normalizeUrl(form.href),
      useLivePreview: form.useLivePreview,
      col1Img1: form.col1Img1.trim(),
      col1Img2: form.col1Img2.trim(),
      col2Img: form.col2Img.trim(),
    };

    const nextProjects = editingId
      ? store.projects.map((p) => (p.id === editingId ? cleaned : p))
      : [...store.projects, cleaned];

    void persistToCloud(
      { ...store, projects: nextProjects },
      editingId ? 'Project updated live' : 'New project published live'
    );
    resetForm();
  };

  const handleDeleteProject = (id: string) => {
    void persistToCloud(
      {
        ...store,
        projects: store.projects.filter((p) => p.id !== id),
      },
      'Project removed'
    );
    if (editingId === id) resetForm();
  };

  const handleMoveProject = (index: number, delta: -1 | 1) => {
    const target = index + delta;
    if (target < 0 || target >= store.projects.length) return;
    const copy = [...store.projects];
    const [moved] = copy.splice(index, 1);
    copy.splice(target, 0, moved);
    void persistToCloud({ ...store, projects: copy }, 'Project order updated');
  };

  const handleImageUpload = async (
    field: 'col1Img1' | 'col1Img2' | 'col2Img',
    file?: File
  ) => {
    if (!file) return;
    try {
      const dataUrl = await compressImageFile(file, 1000, 0.78);
      setForm((prev) => ({ ...prev, [field]: dataUrl, useLivePreview: false }));
      notify('Image uploaded & optimized.');
    } catch {
      notify('Could not process that image.');
    }
  };

  const handleCvUpload = (file?: File) => {
    if (!file) return;
    if (file.size > 3.5 * 1024 * 1024) {
      notify('Please upload a PDF smaller than 3.5 MB.');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      void persistToCloud(
        {
          ...store,
          cvPdfDataUrl: reader.result as string,
          cvPdfName: file.name,
        },
        `Uploaded ${file.name}`
      );
    };
    reader.readAsDataURL(file);
  };

  const handleExportJson = () => {
    const blob = new Blob([JSON.stringify(store, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'jayed-portfolio-backup.json';
    a.click();
    URL.revokeObjectURL(url);
    notify('Portfolio backup JSON downloaded.');
  };

  const handleShowcaseImageUpload = async (file?: File) => {
    if (!file) return;
    try {
      const dataUrl = await compressImageFile(file, 900, 0.78);
      setShowcaseForm((prev) => ({ ...prev, imageUrl: dataUrl }));
      notify('Showcase image uploaded & optimized.');
    } catch {
      notify('Could not process that image.');
    }
  };

  const handleAddShowcase = (e: React.FormEvent) => {
    e.preventDefault();
    if (!showcaseForm.imageUrl.trim()) {
      notify('Please upload an image or paste an image/GIF URL.');
      return;
    }
    const nextItem: ShowcaseItem = {
      id: `sc-${Date.now()}`,
      title: showcaseForm.title.trim() || undefined,
      imageUrl: showcaseForm.imageUrl.trim(),
      linkUrl: showcaseForm.linkUrl.trim() ? normalizeUrl(showcaseForm.linkUrl) : undefined,
      row: showcaseForm.row,
    };
    void persistToCloud(
      {
        ...store,
        showcaseItems: [...store.showcaseItems, nextItem],
      },
      'Added to Hero Showcase Strip'
    );
    setShowcaseForm({
      title: '',
      imageUrl: '',
      linkUrl: '',
      row: showcaseForm.row === 1 ? 2 : 1,
    });
  };

  const handleDeleteShowcase = (id: string) => {
    void persistToCloud(
      {
        ...store,
        showcaseItems: store.showcaseItems.filter((item) => item.id !== id),
      },
      'Removed from Showcase Strip'
    );
  };

  const handleImportJson = (file?: File) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(reader.result as string) as Partial<PortfolioStore>;
        if (!Array.isArray(parsed.projects)) throw new Error('Invalid');
        void persistToCloud(
          {
            projects: parsed.projects,
            showcaseItems: Array.isArray(parsed.showcaseItems)
              ? parsed.showcaseItems
              : store.showcaseItems,
            cvPdfDataUrl: parsed.cvPdfDataUrl ?? store.cvPdfDataUrl,
            cvPdfName: parsed.cvPdfName ?? store.cvPdfName,
          },
          'Backup imported'
        );
      } catch {
        notify('Invalid backup JSON file.');
      }
    };
    reader.readAsText(file);
  };

  const handleSaveCredentials = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 4) {
      notify('New password must be at least 4 characters.');
      return;
    }
    setSyncing(true);
    const res = await updateCloudAdminPassword(currentPassword, newPassword);
    setSyncing(false);
    if (res.unauthorized) {
      setAuthed(false);
      setLoginError('Session expired. Please sign in again.');
      return;
    }
    if (!res.ok) {
      notify(res.error || 'Could not update password.');
      return;
    }
    setCurrentPassword('');
    setNewPassword('');
    notify('Admin password updated across all devices! ✓');
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="no-print fixed inset-0 z-[60] flex items-center justify-center bg-black/90 backdrop-blur-md p-3 sm:p-6 overflow-y-auto"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 18 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 18 }}
            transition={{ duration: 0.24, ease: [0.25, 0.1, 0.25, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="relative my-auto w-full max-w-5xl max-h-[92vh] overflow-y-auto rounded-[32px] border border-[#D7E2EA]/25 bg-[#0E1016] text-[#D7E2EA] shadow-2xl"
          >
            {/* Top Bar */}
            <div className="sticky top-0 z-20 flex items-center justify-between border-b border-white/10 bg-[#0E1016]/95 px-6 py-4 backdrop-blur-md">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#8B7CFF]/15 text-[#A594FF]">
                  <Lock className="h-4 w-4" />
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-bold uppercase tracking-wider text-white">
                    Jayed Portfolio Admin
                  </h2>
                  <p className="flex items-center gap-1.5 text-[11px] uppercase tracking-widest text-[#D7E2EA]/55">
                    <Cloud className="h-3 w-3 text-emerald-400" />
                    {syncing
                      ? 'Syncing to Cloudflare D1...'
                      : authed
                      ? 'Cloud Synced • All Devices'
                      : 'Protected Cloud Login'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {authed && (
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="inline-flex items-center gap-1.5 rounded-full border border-white/15 px-3.5 py-1.5 text-xs uppercase tracking-wider text-[#D7E2EA]/80 hover:bg-white/10 transition-colors"
                  >
                    <LogOut className="h-3.5 w-3.5" />
                    Logout
                  </button>
                )}
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close Admin Panel"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-[#D7E2EA] hover:bg-white/10 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Toast Status */}
            <AnimatePresence>
              {statusMsg && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mx-6 mt-4 flex items-center gap-2 rounded-2xl border border-emerald-400/30 bg-emerald-400/10 px-4 py-2.5 text-xs sm:text-sm text-emerald-200"
                >
                  <Check className="h-4 w-4 shrink-0" />
                  <span>{statusMsg}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {!authed ? (
              /* Password-Only Private Login Gate */
              <form
                onSubmit={handleLogin}
                className="mx-auto flex max-w-md flex-col gap-4 px-6 py-12"
              >
                <div className="text-center">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-[#8B7CFF]/35 bg-[#8B7CFF]/10 px-3 py-1 text-[11px] uppercase tracking-widest text-[#C4B5FD]">
                    <Shield className="h-3.5 w-3.5" />
                    Private Access
                  </span>
                  <h3 className="mt-3 text-2xl font-bold text-white">
                    Enter Admin Password
                  </h3>
                  <p className="mt-1 text-xs text-[#D7E2EA]/55">
                    Restricted owner panel for managing projects and CV.
                  </p>
                </div>

                <div>
                  <label className="mb-1.5 block text-xs uppercase tracking-wider text-[#D7E2EA]/70">
                    Password
                  </label>
                  <input
                    type="password"
                    value={loginPass}
                    onChange={(e) => setLoginPass(e.target.value)}
                    placeholder="Enter your private password"
                    autoFocus
                    className="w-full rounded-xl border border-white/15 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none focus:border-[#8B7CFF]"
                  />
                </div>

                {loginError && (
                  <p className="text-xs text-rose-400">{loginError}</p>
                )}

                <button
                  type="submit"
                  disabled={authLoading}
                  className="mt-2 w-full rounded-full py-3 text-sm font-semibold uppercase tracking-widest text-white transition-all hover:brightness-110 disabled:opacity-60"
                  style={{
                    background:
                      'linear-gradient(123deg, #5B5FE8 0%, #8B7CFF 50%, #67C5FF 100%)',
                  }}
                >
                  {authLoading ? 'Verifying...' : 'Unlock Panel'}
                </button>
              </form>
            ) : (
              /* Authenticated Dashboard */
              <div className="p-6">
                {/* Tabs */}
                <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex flex-wrap gap-2">
                    {(
                      [
                        {
                          id: 'showcase',
                          label: `Showcase Strip (${store.showcaseItems.length})`,
                          icon: ImageIcon,
                        },
                        { id: 'projects', label: `Projects (${store.projects.length})`, icon: Sparkles },
                        { id: 'cv', label: 'CV / PDF Upload', icon: FileText },
                        { id: 'security', label: 'Security & Backup', icon: Shield },
                      ] as const
                    ).map((item) => {
                      const Icon = item.icon;
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setTab(item.id)}
                          className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-medium uppercase tracking-wider transition-all ${
                            tab === item.id
                              ? 'bg-[#D7E2EA] text-[#0C0C0C]'
                              : 'border border-white/15 bg-white/[0.03] text-[#D7E2EA]/75 hover:bg-white/10'
                          }`}
                        >
                          <Icon className="h-3.5 w-3.5" />
                          {item.label}
                        </button>
                      );
                    })}
                  </div>

                  {tab === 'showcase' && store.showcaseItems.length > 0 && (
                    <button
                      type="button"
                      onClick={() => {
                        void persistToCloud(
                          { ...store, showcaseItems: [] },
                          'Showcase Strip cleared'
                        );
                      }}
                      className="inline-flex items-center gap-1.5 rounded-full border border-rose-400/30 bg-rose-500/10 px-3.5 py-1.5 text-xs uppercase tracking-wider text-rose-300 hover:bg-rose-500/20"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      Clear Showcase Strip
                    </button>
                  )}

                  {tab === 'projects' && store.projects.length > 0 && (
                    <button
                      type="button"
                      onClick={() => {
                        void persistToCloud(
                          { ...store, projects: [] },
                          'All project slots cleared'
                        );
                        resetForm();
                      }}
                      className="inline-flex items-center gap-1.5 rounded-full border border-rose-400/30 bg-rose-500/10 px-3.5 py-1.5 text-xs uppercase tracking-wider text-rose-300 hover:bg-rose-500/20"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      Clear All Slots
                    </button>
                  )}
                </div>

                {tab === 'showcase' && (
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    <form
                      onSubmit={handleAddShowcase}
                      className="lg:col-span-6 space-y-4 rounded-3xl border border-white/10 bg-white/[0.025] p-5"
                    >
                      <div>
                        <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
                          Add to Hero Showcase Strip
                        </h3>
                        <p className="mt-1 text-xs text-[#D7E2EA]/60">
                          Upload your own project screenshots/GIFs to fill the two scrolling rows right below the Hero section. Until added, those slots stay cleanly blank.
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="mb-1 block text-[11px] uppercase tracking-wider text-[#D7E2EA]/65">
                            Label (Optional)
                          </label>
                          <input
                            type="text"
                            value={showcaseForm.title}
                            onChange={(e) =>
                              setShowcaseForm({ ...showcaseForm, title: e.target.value })
                            }
                            placeholder="e.g. WooCommerce Build"
                            className="w-full rounded-xl border border-white/15 bg-black/35 px-3.5 py-2.5 text-sm text-white outline-none focus:border-[#8B7CFF]"
                          />
                        </div>
                        <div>
                          <label className="mb-1 block text-[11px] uppercase tracking-wider text-[#D7E2EA]/65">
                            Marquee Row
                          </label>
                          <select
                            value={showcaseForm.row}
                            onChange={(e) =>
                              setShowcaseForm({
                                ...showcaseForm,
                                row: Number(e.target.value) as 1 | 2,
                              })
                            }
                            className="w-full rounded-xl border border-white/15 bg-[#12141C] px-3.5 py-2.5 text-sm text-white outline-none focus:border-[#8B7CFF]"
                          >
                            <option value={1}>Row 1 (Scrolls Right)</option>
                            <option value={2}>Row 2 (Scrolls Left)</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="mb-1 block text-[11px] uppercase tracking-wider text-[#D7E2EA]/65">
                          Project Image / GIF *
                        </label>
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={showcaseForm.imageUrl}
                            onChange={(e) =>
                              setShowcaseForm({ ...showcaseForm, imageUrl: e.target.value })
                            }
                            placeholder="Paste image/GIF URL or upload →"
                            className="min-w-0 flex-1 rounded-xl border border-white/15 bg-black/35 px-3.5 py-2.5 text-xs text-white outline-none focus:border-[#8B7CFF]"
                          />
                          <label className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl border border-white/15 bg-white/[0.06] px-3.5 py-2.5 text-xs text-white hover:bg-white/15 transition-colors">
                            <Upload className="h-3.5 w-3.5" />
                            Upload
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) =>
                                handleShowcaseImageUpload(e.target.files?.[0])
                              }
                            />
                          </label>
                        </div>
                      </div>

                      <div>
                        <label className="mb-1 block text-[11px] uppercase tracking-wider text-[#D7E2EA]/65">
                          Live Project Link (Optional — makes tile clickable)
                        </label>
                        <input
                          type="text"
                          value={showcaseForm.linkUrl}
                          onChange={(e) =>
                            setShowcaseForm({ ...showcaseForm, linkUrl: e.target.value })
                          }
                          placeholder="https://your-live-site.com"
                          className="w-full rounded-xl border border-white/15 bg-black/35 px-3.5 py-2.5 text-sm text-white outline-none focus:border-[#8B7CFF]"
                        />
                      </div>

                      <button
                        type="submit"
                        className="inline-flex w-full items-center justify-center gap-2 rounded-full py-3 text-xs sm:text-sm font-semibold uppercase tracking-widest text-white transition-all hover:brightness-110"
                        style={{
                          background:
                            'linear-gradient(123deg, #5B5FE8 0%, #8B7CFF 50%, #67C5FF 100%)',
                        }}
                      >
                        <Plus className="h-4 w-4" />
                        Add Showcase Tile
                      </button>
                    </form>

                    <div className="lg:col-span-6 space-y-3">
                      <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
                        Active Showcase Tiles ({store.showcaseItems.length})
                      </h3>
                      {store.showcaseItems.length === 0 ? (
                        <div className="rounded-3xl border border-dashed border-white/15 bg-white/[0.02] p-8 text-center text-xs text-[#D7E2EA]/55">
                          Showcase strip is currently clean &amp; blank. Upload your own screenshots or GIFs on the left whenever you&apos;re ready.
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {store.showcaseItems.map((item) => (
                            <div
                              key={item.id}
                              className="overflow-hidden rounded-2xl border border-white/12 bg-white/[0.03]"
                            >
                              <img
                                src={item.imageUrl}
                                alt={item.title || 'Showcase tile'}
                                className="h-28 w-full object-cover bg-black/40"
                              />
                              <div className="flex items-center justify-between gap-2 px-3 py-2">
                                <div className="min-w-0">
                                  <span className="block text-[10px] uppercase tracking-widest text-[#8B7CFF]">
                                    Row {item.row}
                                  </span>
                                  <span className="block truncate text-xs text-white">
                                    {item.title || 'Untitled Showcase'}
                                  </span>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteShowcase(item.id)}
                                  className="rounded-lg p-1.5 text-rose-300 hover:bg-rose-500/15"
                                  title="Delete tile"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {tab === 'projects' && (
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* Left: Publish / Edit Form */}
                    <form
                      onSubmit={handleSaveProject}
                      className="lg:col-span-7 space-y-4 rounded-3xl border border-white/10 bg-white/[0.025] p-5"
                    >
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
                          {editingId ? 'Edit Project' : 'Publish New Project'}
                        </h3>
                        {editingId && (
                          <button
                            type="button"
                            onClick={resetForm}
                            className="text-xs text-[#8B7CFF] hover:underline"
                          >
                            + Create New Instead
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="mb-1 block text-[11px] uppercase tracking-wider text-[#D7E2EA]/65">
                            Project Name *
                          </label>
                          <input
                            type="text"
                            required
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                            placeholder="e.g. Student ID Portal"
                            className="w-full rounded-xl border border-white/15 bg-black/35 px-3.5 py-2.5 text-sm text-white outline-none focus:border-[#8B7CFF]"
                          />
                        </div>
                        <div>
                          <label className="mb-1 block text-[11px] uppercase tracking-wider text-[#D7E2EA]/65">
                            Category / Tag
                          </label>
                          <input
                            type="text"
                            value={form.category}
                            onChange={(e) => setForm({ ...form, category: e.target.value })}
                            placeholder="e.g. WordPress • WooCommerce"
                            className="w-full rounded-xl border border-white/15 bg-black/35 px-3.5 py-2.5 text-sm text-white outline-none focus:border-[#8B7CFF]"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="mb-1 block text-[11px] uppercase tracking-wider text-[#D7E2EA]/65">
                          Live Website URL (Direct Link)
                        </label>
                        <div className="relative">
                          <Globe className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#67C5FF]" />
                          <input
                            type="text"
                            value={form.href}
                            onChange={(e) => setForm({ ...form, href: e.target.value })}
                            placeholder="https://your-live-project.com"
                            className="w-full rounded-xl border border-white/15 bg-black/35 pl-10 pr-3.5 py-2.5 text-sm text-white outline-none focus:border-[#8B7CFF]"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="mb-1 block text-[11px] uppercase tracking-wider text-[#D7E2EA]/65">
                          Short Description (Optional)
                        </label>
                        <textarea
                          rows={2}
                          value={form.description}
                          onChange={(e) =>
                            setForm({ ...form, description: e.target.value })
                          }
                          placeholder="Brief overview of what you built..."
                          className="w-full rounded-xl border border-white/15 bg-black/35 px-3.5 py-2 text-sm text-white outline-none focus:border-[#8B7CFF]"
                        />
                      </div>

                      {/* Display Mode Toggle */}
                      <div className="flex items-center justify-between rounded-2xl border border-[#8B7CFF]/25 bg-[#8B7CFF]/10 px-4 py-3">
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wider text-white">
                            Live Interactive Website Embed
                          </p>
                          <p className="text-[11px] text-[#D7E2EA]/70">
                            Shows your live URL directly inside the project card — no screenshots required!
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() =>
                            setForm((prev) => ({
                              ...prev,
                              useLivePreview: !prev.useLivePreview,
                            }))
                          }
                          className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${
                            form.useLivePreview ? 'bg-[#8B7CFF]' : 'bg-white/20'
                          }`}
                        >
                          <span
                            className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white transition-transform ${
                              form.useLivePreview ? 'translate-x-5' : 'translate-x-0'
                            }`}
                          />
                        </button>
                      </div>

                      {/* Optional Custom Images */}
                      <div className="space-y-2.5 pt-1">
                        <div className="flex items-center justify-between">
                          <span className="inline-flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wider text-[#D7E2EA]/70">
                            <ImageIcon className="h-3.5 w-3.5" />
                            Custom Screenshots (Optional — overrides live embed when off)
                          </span>
                        </div>

                        {(
                          [
                            { key: 'col2Img', label: 'Main Feature Image' },
                            { key: 'col1Img1', label: 'Secondary Image 1' },
                            { key: 'col1Img2', label: 'Secondary Image 2' },
                          ] as const
                        ).map((slot) => (
                          <div key={slot.key} className="flex items-center gap-2">
                            <input
                              type="text"
                              value={form[slot.key]}
                              onChange={(e) =>
                                setForm({ ...form, [slot.key]: e.target.value })
                              }
                              placeholder={`${slot.label} URL or upload →`}
                              className="min-w-0 flex-1 rounded-xl border border-white/15 bg-black/35 px-3 py-2 text-xs text-white outline-none focus:border-[#8B7CFF]"
                            />
                            <label className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl border border-white/15 bg-white/[0.06] px-3 py-2 text-xs text-white hover:bg-white/15 transition-colors">
                              <Upload className="h-3.5 w-3.5" />
                              Upload
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) =>
                                  handleImageUpload(slot.key, e.target.files?.[0])
                                }
                              />
                            </label>
                            {form[slot.key] && (
                              <button
                                type="button"
                                onClick={() => setForm({ ...form, [slot.key]: '' })}
                                className="rounded-lg p-2 text-rose-300 hover:bg-rose-500/15"
                                title="Clear image"
                              >
                                <X className="h-3.5 w-3.5" />
                              </button>
                            )}
                          </div>
                        ))}
                      </div>

                      <div className="flex items-center gap-3 pt-2">
                        <button
                          type="submit"
                          className="inline-flex flex-1 items-center justify-center gap-2 rounded-full py-3 text-xs sm:text-sm font-semibold uppercase tracking-widest text-white transition-all hover:brightness-110"
                          style={{
                            background:
                              'linear-gradient(123deg, #5B5FE8 0%, #8B7CFF 50%, #67C5FF 100%)',
                          }}
                        >
                          <Plus className="h-4 w-4" />
                          {editingId ? 'Save Changes' : 'Publish Project'}
                        </button>
                        {editingId && (
                          <button
                            type="button"
                            onClick={resetForm}
                            className="rounded-full border border-white/20 px-5 py-3 text-xs uppercase tracking-widest hover:bg-white/10"
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    </form>

                    {/* Right: Published Projects List */}
                    <div className="lg:col-span-5 space-y-3">
                      <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
                        Published on Portfolio ({store.projects.length})
                      </h3>

                      {store.projects.length === 0 ? (
                        <div className="rounded-3xl border border-dashed border-white/15 bg-white/[0.02] p-8 text-center text-xs text-[#D7E2EA]/55">
                          No projects posted yet. Add your first live URL or project screenshot on the left!
                        </div>
                      ) : (
                        store.projects.map((p, idx) => (
                          <div
                            key={p.id}
                            className="flex flex-col gap-3 rounded-2xl border border-white/12 bg-white/[0.03] p-4"
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div className="min-w-0">
                                <span className="text-[10px] uppercase tracking-widest text-[#8B7CFF]">
                                  #{String(idx + 1).padStart(2, '0')} • {p.category}
                                </span>
                                <h4 className="truncate text-base font-semibold text-white">
                                  {p.name}
                                </h4>
                                {p.href && (
                                  <a
                                    href={normalizeUrl(p.href)}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="mt-0.5 inline-flex items-center gap-1 text-xs text-[#67C5FF] hover:underline"
                                  >
                                    <ExternalLink className="h-3 w-3" />
                                    <span className="truncate max-w-[210px]">
                                      {p.href.replace(/^https?:\/\//, '')}
                                    </span>
                                  </a>
                                )}
                              </div>
                              <span className="shrink-0 rounded-full bg-white/10 px-2.5 py-1 text-[10px] uppercase tracking-wider text-[#D7E2EA]/80">
                                {p.useLivePreview ? 'Live Embed' : 'Images'}
                              </span>
                            </div>

                            <div className="flex items-center justify-between border-t border-white/10 pt-2.5">
                              <div className="flex items-center gap-1">
                                <button
                                  type="button"
                                  disabled={idx === 0}
                                  onClick={() => handleMoveProject(idx, -1)}
                                  className="rounded-lg p-1.5 text-[#D7E2EA]/70 hover:bg-white/10 disabled:opacity-30"
                                  title="Move up"
                                >
                                  <ArrowUp className="h-3.5 w-3.5" />
                                </button>
                                <button
                                  type="button"
                                  disabled={idx === store.projects.length - 1}
                                  onClick={() => handleMoveProject(idx, 1)}
                                  className="rounded-lg p-1.5 text-[#D7E2EA]/70 hover:bg-white/10 disabled:opacity-30"
                                  title="Move down"
                                >
                                  <ArrowDown className="h-3.5 w-3.5" />
                                </button>
                              </div>

                              <div className="flex items-center gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => startEdit(p)}
                                  className="inline-flex items-center gap-1 rounded-full border border-white/15 px-3 py-1 text-xs hover:bg-white/10"
                                >
                                  <Edit3 className="h-3 w-3" />
                                  Edit
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteProject(p.id)}
                                  className="inline-flex items-center gap-1 rounded-full border border-rose-400/30 px-3 py-1 text-xs text-rose-300 hover:bg-rose-500/15"
                                >
                                  <Trash2 className="h-3 w-3" />
                                  Delete
                                </button>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}

                {tab === 'cv' && (
                  <div className="max-w-2xl space-y-5 rounded-3xl border border-white/10 bg-white/[0.025] p-6">
                    <div>
                      <h3 className="text-base font-semibold text-white">
                        Custom PDF CV Attachment
                      </h3>
                      <p className="mt-1 text-xs text-[#D7E2EA]/65">
                        Your portfolio already includes a built-in interactive &amp; printable CV generated from your resume. If you want visitors to download your exact designed PDF file instead, upload it below.
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                      <label className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-[#8B7CFF] px-5 py-2.5 text-xs font-semibold uppercase tracking-widest text-white hover:brightness-110">
                        <Upload className="h-4 w-4" />
                        Upload PDF CV (Max 4 MB)
                        <input
                          type="file"
                          accept="application/pdf"
                          className="hidden"
                          onChange={(e) => handleCvUpload(e.target.files?.[0])}
                        />
                      </label>

                      {store.cvPdfDataUrl && (
                        <button
                          type="button"
                          onClick={() => {
                            void persistToCloud(
                              {
                                ...store,
                                cvPdfDataUrl: null,
                                cvPdfName: null,
                              },
                              'Reverted to built-in printable CV'
                            );
                          }}
                          className="rounded-full border border-rose-400/35 px-4 py-2.5 text-xs uppercase tracking-widest text-rose-300 hover:bg-rose-500/15"
                        >
                          Remove Custom PDF
                        </button>
                      )}
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-xs text-[#D7E2EA]/75">
                      Current Download Source:{' '}
                      <strong className="text-white">
                        {store.cvPdfName || 'Built-in Formatted Printable CV'}
                      </strong>
                    </div>
                  </div>
                )}

                {tab === 'security' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <form
                      onSubmit={handleSaveCredentials}
                      className="space-y-4 rounded-3xl border border-white/10 bg-white/[0.025] p-6"
                    >
                      <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
                        Change Admin Password
                      </h3>
                      <div>
                        <label className="mb-1 block text-xs text-[#D7E2EA]/65">
                          Current Password
                        </label>
                        <input
                          type="password"
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                          placeholder="Enter current password"
                          className="w-full rounded-xl border border-white/15 bg-black/35 px-3.5 py-2.5 text-sm text-white outline-none focus:border-[#8B7CFF]"
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-xs text-[#D7E2EA]/65">
                          New Password
                        </label>
                        <input
                          type="password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder="Minimum 4 characters"
                          className="w-full rounded-xl border border-white/15 bg-black/35 px-3.5 py-2.5 text-sm text-white outline-none focus:border-[#8B7CFF]"
                        />
                      </div>
                      <button
                        type="submit"
                        className="rounded-full bg-[#D7E2EA] px-5 py-2.5 text-xs font-semibold uppercase tracking-widest text-[#0C0C0C] hover:bg-white"
                      >
                        Update Password
                      </button>
                    </form>

                    <div className="space-y-4 rounded-3xl border border-white/10 bg-white/[0.025] p-6">
                      <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
                        Backup &amp; Portable Sync
                      </h3>
                      <p className="text-xs leading-relaxed text-[#D7E2EA]/65">
                        Every update automatically syncs to your Cloudflare D1 Cloud Database so visitors on any device see changes immediately. You can also export or import JSON backups anytime.
                      </p>
                      <div className="flex flex-wrap gap-3">
                        <button
                          type="button"
                          onClick={handleExportJson}
                          className="inline-flex items-center gap-2 rounded-full border border-white/20 px-4 py-2.5 text-xs uppercase tracking-widest text-white hover:bg-white/10"
                        >
                          <Download className="h-3.5 w-3.5" />
                          Export JSON
                        </button>
                        <button
                          type="button"
                          onClick={() => importInputRef.current?.click()}
                          className="inline-flex items-center gap-2 rounded-full border border-white/20 px-4 py-2.5 text-xs uppercase tracking-widest text-white hover:bg-white/10"
                        >
                          <Upload className="h-3.5 w-3.5" />
                          Import JSON
                        </button>
                        <input
                          ref={importInputRef}
                          type="file"
                          accept="application/json"
                          className="hidden"
                          onChange={(e) => handleImportJson(e.target.files?.[0])}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
