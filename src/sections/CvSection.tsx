import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText,
  Download,
  Eye,
  Briefcase,
  Cpu,
  GraduationCap,
  Award,
  Mail,
  Phone,
  MapPin,
  Linkedin,
  Github,
  Globe,
  X,
  Printer,
  CheckCircle2,
} from 'lucide-react';
import { FadeIn } from '../components/FadeIn';

type CvTab = 'experience' | 'skills' | 'education' | 'leadership';

interface CvSectionProps {
  cvPdfDataUrl: string | null;
  cvPdfName: string | null;
  onOpenContact: () => void;
}

const SKILL_GROUPS = [
  {
    title: 'WordPress Web Development',
    items: [
      'WordPress Install & Config',
      'Elementor & Gutenberg',
      'Theme & Child Theme Customization',
      'CPT & ACF',
      'WooCommerce Stores',
      'Speed Optimization',
      'Multilingual & Membership Sites',
    ],
  },
  {
    title: 'AI & Automation Workflows',
    items: [
      'Prompt Engineering',
      'ChatGPT & Claude',
      'Google Gemini & Codex',
      'GitHub Copilot',
      'AI Content, Image & Video',
      'AI Branding & Productivity',
    ],
  },
  {
    title: 'SEO & Lead Generation',
    items: [
      'Keyword & Search-Intent Research',
      'Competitor & Site Audits',
      'On-Page, Technical & Local SEO',
      'Ahrefs, SEMrush, Ubersuggest',
      'GSC, GA4 & Rank Math',
      'B2B/B2C Prospect Outreach',
    ],
  },
  {
    title: 'Digital Marketing & Media',
    items: [
      'Meta Business Suite & Ads Manager',
      'Mailchimp, Klaviyo & Brevo',
      'Photoshop, Illustrator & Canva',
      'CapCut, Premiere Pro & Filmora',
      'Commercial Photo & Video',
      'Excel (Pivot, VLOOKUP, Goal Seek)',
    ],
  },
];

export const CvSection: React.FC<CvSectionProps> = ({
  cvPdfDataUrl,
  cvPdfName,
  onOpenContact,
}) => {
  const [activeTab, setActiveTab] = useState<CvTab>('experience');
  const [previewOpen, setPreviewOpen] = useState(false);

  const handleDownloadCv = () => {
    if (cvPdfDataUrl) {
      const a = document.createElement('a');
      a.href = cvPdfDataUrl;
      a.download = cvPdfName || 'Jayed-Jaman-Seen-CV.pdf';
      a.click();
      return;
    }
    setPreviewOpen(true);
    setTimeout(() => window.print(), 250);
  };

  return (
    <section
      id="cv"
      className="relative z-10 w-full bg-[#0C0C0C] px-4 sm:px-8 md:px-10 pt-10 pb-20 text-[#D7E2EA]"
    >
      <div className="mx-auto max-w-6xl">
        {/* Dedicated Interactive CV Box */}
        <FadeIn delay={0.05} y={32}>
          <div className="overflow-hidden rounded-[36px] sm:rounded-[48px] border border-[#D7E2EA]/20 bg-gradient-to-br from-[#14161F] via-[#101118] to-[#0C0C0C] p-6 sm:p-8 md:p-10 shadow-[0_24px_80px_rgba(0,0,0,0.6)]">
            {/* Header Strip */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-[#D7E2EA]/12 pb-7">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-[#8B7CFF]/35 bg-[#8B7CFF]/10 px-3.5 py-1 text-[11px] font-medium uppercase tracking-[0.2em] text-[#C4B5FD]">
                  <FileText className="h-3.5 w-3.5" />
                  Curriculum Vitae
                </div>
                <h2 className="hero-heading mt-3 text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight leading-none">
                  Jayed Jaman Seen
                </h2>
                <p className="mt-2 text-sm sm:text-base font-light text-[#D7E2EA]/75">
                  WordPress Web Development &amp; AI Tools Specialist • Barishal, Bangladesh
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => setPreviewOpen(true)}
                  className="inline-flex items-center gap-2 rounded-full border-2 border-[#D7E2EA]/50 px-5 py-3 text-xs sm:text-sm font-medium uppercase tracking-widest text-[#D7E2EA] hover:bg-[#D7E2EA]/10 transition-colors"
                >
                  <Eye className="h-4 w-4" />
                  View Full CV
                </button>
                <button
                  type="button"
                  onClick={handleDownloadCv}
                  className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-xs sm:text-sm font-medium uppercase tracking-widest text-white transition-all hover:brightness-110 active:scale-[0.98]"
                  style={{
                    background:
                      'linear-gradient(123deg, #5B5FE8 0%, #8B7CFF 48%, #67C5FF 100%)',
                    boxShadow: '0 6px 20px rgba(139, 124, 255, 0.3)',
                  }}
                >
                  <Download className="h-4 w-4" />
                  {cvPdfDataUrl ? 'Download PDF CV' : 'Save / Print PDF'}
                </button>
              </div>
            </div>

            {/* Quick Credential Metrics */}
            <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { label: 'Experience', value: '5+ Years', sub: 'Digital & Brand' },
                { label: 'Gov. AI Cert', value: 'BCC Certified', sub: 'AI for Professionals' },
                { label: 'ICT Training', value: '600 Hours', sub: 'DYD 8th Batch CR' },
                { label: 'English', value: 'IELTS 6.5', sub: 'CEFR B2 • DET 90' },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-2xl border border-[#D7E2EA]/10 bg-white/[0.025] px-4 py-3.5"
                >
                  <p className="text-[11px] uppercase tracking-widest text-[#D7E2EA]/50">
                    {stat.label}
                  </p>
                  <p className="mt-1 text-base sm:text-lg font-bold text-white">
                    {stat.value}
                  </p>
                  <p className="text-xs font-light text-[#BBCCD7]/70">{stat.sub}</p>
                </div>
              ))}
            </div>

            {/* Interactive Tab Selector */}
            <div className="mt-7 flex flex-wrap gap-2">
              {(
                [
                  { id: 'experience', label: 'Experience', icon: Briefcase },
                  { id: 'skills', label: 'Technical Skills', icon: Cpu },
                  { id: 'education', label: 'Education & Certs', icon: GraduationCap },
                  { id: 'leadership', label: 'Leadership & English', icon: Award },
                ] as const
              ).map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs sm:text-sm font-medium uppercase tracking-wider transition-all ${
                      isActive
                        ? 'bg-[#D7E2EA] text-[#0C0C0C]'
                        : 'border border-[#D7E2EA]/20 bg-white/[0.02] text-[#D7E2EA]/75 hover:bg-white/[0.07]'
                    }`}
                  >
                    <Icon className="h-3.5 w-3.5" />
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* Tab Content */}
            <div className="mt-6 min-h-[220px]">
              <AnimatePresence mode="wait">
                {activeTab === 'experience' && (
                  <motion.div
                    key="experience"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="grid grid-cols-1 md:grid-cols-2 gap-4"
                  >
                    <div className="rounded-3xl border border-[#D7E2EA]/12 bg-white/[0.025] p-5">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs uppercase tracking-widest text-[#8B7CFF]">
                          2025 – Present
                        </span>
                        <span className="rounded-full bg-emerald-400/10 px-2.5 py-0.5 text-[11px] text-emerald-300">
                          Remote / Freelance
                        </span>
                      </div>
                      <h3 className="mt-2 text-lg font-semibold text-white">
                        WordPress Web Developer &amp; AI Tools Specialist
                      </h3>
                      <ul className="mt-3 space-y-2 text-sm font-light text-[#D7E2EA]/75">
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#8B7CFF]" />
                          Build responsive Elementor, Gutenberg &amp; WooCommerce sites.
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#8B7CFF]" />
                          Apply keyword research, competitor analysis &amp; on-page SEO.
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#8B7CFF]" />
                          Built &amp; deployed live Student ID Card Portal on Render.
                        </li>
                      </ul>
                    </div>

                    <div className="rounded-3xl border border-[#D7E2EA]/12 bg-white/[0.025] p-5">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs uppercase tracking-widest text-[#67C5FF]">
                          May 2021 – Present
                        </span>
                        <span className="rounded-full bg-white/10 px-2.5 py-0.5 text-[11px] text-[#D7E2EA]/80">
                          Barishal, BD
                        </span>
                      </div>
                      <h3 className="mt-2 text-lg font-semibold text-white">
                        Social Media &amp; Digital Marketing Specialist
                      </h3>
                      <p className="text-xs text-[#BBCCD7]/75">
                        M/S Munni Trading &amp; Co. / The Chanachur Factory
                      </p>
                      <ul className="mt-3 space-y-2 text-sm font-light text-[#D7E2EA]/75">
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#67C5FF]" />
                          End-to-end social media presence &amp; digital brand strategy.
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#67C5FF]" />
                          Commercial photography, videography &amp; promotional graphics.
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#67C5FF]" />
                          Content calendars and digital lead-generation campaigns.
                        </li>
                      </ul>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'skills' && (
                  <motion.div
                    key="skills"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="grid grid-cols-1 md:grid-cols-2 gap-4"
                  >
                    {SKILL_GROUPS.map((group) => (
                      <div
                        key={group.title}
                        className="rounded-3xl border border-[#D7E2EA]/12 bg-white/[0.025] p-5"
                      >
                        <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
                          {group.title}
                        </h3>
                        <div className="mt-3 flex flex-wrap gap-2">
                          {group.items.map((item) => (
                            <span
                              key={item}
                              className="rounded-full border border-[#D7E2EA]/15 bg-white/[0.04] px-3 py-1 text-xs font-light text-[#D7E2EA]/85"
                            >
                              {item}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </motion.div>
                )}

                {activeTab === 'education' && (
                  <motion.div
                    key="education"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="grid grid-cols-1 md:grid-cols-2 gap-4"
                  >
                    <div className="rounded-3xl border border-[#D7E2EA]/12 bg-white/[0.025] p-5 space-y-3.5">
                      <h3 className="text-sm font-semibold uppercase tracking-wider text-[#8B7CFF]">
                        Education
                      </h3>
                      <div>
                        <p className="font-medium text-white">
                          B.Sc. in Computer Science &amp; Engineering
                        </p>
                        <p className="text-xs text-[#D7E2EA]/65">
                          Trust University, Barishal • In Progress
                        </p>
                      </div>
                      <div>
                        <p className="font-medium text-white">
                          HSC (Science) — GPA 5.00 / 5.00
                        </p>
                        <p className="text-xs text-[#D7E2EA]/65">
                          Government Syed Hatem Ali College, Barishal • 2020
                        </p>
                      </div>
                      <div>
                        <p className="font-medium text-white">
                          SSC (Science) — GPA 4.61 / 5.00
                        </p>
                        <p className="text-xs text-[#D7E2EA]/65">
                          Shahid Abdur Rab Serniyabad Govt. Secondary School • 2018
                        </p>
                      </div>
                    </div>

                    <div className="rounded-3xl border border-[#D7E2EA]/12 bg-white/[0.025] p-5 space-y-3.5">
                      <h3 className="text-sm font-semibold uppercase tracking-wider text-[#67C5FF]">
                        Certifications &amp; Training
                      </h3>
                      <div>
                        <p className="font-medium text-white">
                          Artificial Intelligence for Professionals (2026)
                        </p>
                        <p className="text-xs text-[#D7E2EA]/65">
                          Bangladesh Computer Council (BCC), ICT Division • Completed
                        </p>
                      </div>
                      <div>
                        <p className="font-medium text-white">
                          Freelancing &amp; ICT Skills Development (600 Hours)
                        </p>
                        <p className="text-xs text-[#D7E2EA]/65">
                          DYD Barishal (8th Batch) • First-Month Class Representative
                        </p>
                      </div>
                      <div>
                        <p className="font-medium text-white">
                          Additional Workshops
                        </p>
                        <p className="text-xs text-[#D7E2EA]/65">
                          Generative AI (GrowthSchool 2026) • Claude 101 (Anthropic 2026) • BCIT ISEP English TAE 3 (2023)
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'leadership' && (
                  <motion.div
                    key="leadership"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="grid grid-cols-1 md:grid-cols-2 gap-4"
                  >
                    <div className="rounded-3xl border border-[#D7E2EA]/12 bg-white/[0.025] p-5 space-y-2.5 text-sm font-light text-[#D7E2EA]/80">
                      <h3 className="text-sm font-semibold uppercase tracking-wider text-[#8B7CFF]">
                        Leadership &amp; Achievements
                      </h3>
                      <p>• Elected Class Representative — DYD ICT Training, 8th Batch (2026)</p>
                      <p>• Best Volunteer Award — Lal Sabuj Society, Barishal District (2016–2019)</p>
                      <p>• National Archery Competitor — Bangladesh U-16 Championship (2016)</p>
                      <p>• Elected Student Cabinet Member — School Student Parliament</p>
                    </div>
                    <div className="rounded-3xl border border-[#D7E2EA]/12 bg-white/[0.025] p-5 space-y-2.5 text-sm font-light text-[#D7E2EA]/80">
                      <h3 className="text-sm font-semibold uppercase tracking-wider text-[#67C5FF]">
                        Languages &amp; Communication
                      </h3>
                      <p>• IELTS Academic: Band 6.5 (CEFR B2)</p>
                      <p>• Duolingo English Test: 90 / 160</p>
                      <p>• Strong client communication, team coordination &amp; remote collaboration</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </FadeIn>

        {/* Clean Footer */}
        <footer
          id="contact"
          className="mt-14 border-t border-[#D7E2EA]/15 pt-10 text-[#D7E2EA]"
        >
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-[#D7E2EA]/50">
                Jayed Jaman Seen • WordPress &amp; AI Specialist
              </p>
              <div className="mt-3 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-[#D7E2EA]/80">
                <a
                  href="mailto:thunderseen@gmail.com"
                  className="inline-flex items-center gap-2 hover:text-white transition-colors"
                >
                  <Mail className="h-4 w-4 text-[#BBCCD7]" />
                  thunderseen@gmail.com
                </a>
                <a
                  href="https://wa.me/8801307758119"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 hover:text-white transition-colors"
                >
                  <Phone className="h-4 w-4 text-[#BBCCD7]" />
                  +880 1307-758119
                </a>
                <span className="inline-flex items-center gap-2 text-[#D7E2EA]/65">
                  <MapPin className="h-4 w-4 text-[#BBCCD7]" />
                  Barishal, Bangladesh
                </span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <a
                href="https://www.fiverr.com/jayedjaman_seen?public_mode=true"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-emerald-400/35 bg-emerald-400/10 px-4 py-2 text-xs font-medium uppercase tracking-widest text-emerald-200 hover:bg-emerald-400/20 hover:text-white transition-colors"
              >
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                Fiverr
              </a>
              <a
                href="https://www.freelancer.com.bd/u/jayedjamans"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-sky-400/35 bg-sky-400/10 px-4 py-2 text-xs font-medium uppercase tracking-widest text-sky-200 hover:bg-sky-400/20 hover:text-white transition-colors"
              >
                <Briefcase className="h-3.5 w-3.5 text-sky-300" />
                Freelancer
              </a>
              <a
                href="https://x.com/JayedJamanSeen"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-[#D7E2EA]/25 px-4 py-2 text-xs uppercase tracking-widest hover:bg-[#D7E2EA]/10 hover:text-white transition-colors"
              >
                <svg
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                  className="h-3.5 w-3.5 fill-current"
                >
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
                X
              </a>
              <a
                href="https://www.linkedin.com/in/jayed-jaman-seen-b540b8334/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-[#D7E2EA]/25 px-4 py-2 text-xs uppercase tracking-widest hover:bg-[#D7E2EA]/10 transition-colors"
              >
                <Linkedin className="h-3.5 w-3.5" />
                LinkedIn
              </a>
              <a
                href="https://github.com/JJSEEN"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-[#D7E2EA]/25 px-4 py-2 text-xs uppercase tracking-widest hover:bg-[#D7E2EA]/10 transition-colors"
              >
                <Github className="h-3.5 w-3.5" />
                GitHub
              </a>
              <a
                href="https://student-id-portal-1.onrender.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-[#D7E2EA]/25 px-4 py-2 text-xs uppercase tracking-widest hover:bg-[#D7E2EA]/10 transition-colors"
              >
                <Globe className="h-3.5 w-3.5" />
                Live Portal
              </a>
              <button
                type="button"
                onClick={onOpenContact}
                className="inline-flex items-center gap-2 rounded-full border border-[#D7E2EA]/35 px-4 py-2 text-xs uppercase tracking-widest hover:bg-[#D7E2EA]/10 transition-colors"
              >
                Quick Contact
              </button>
            </div>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs text-[#D7E2EA]/45">
            <span>
              B.Sc. CSE (Trust University) • BCC AI Certified • DYD 600h ICT (8th Batch CR) • IELTS 6.5
            </span>
            <span>
              &copy; {new Date().getFullYear()} Jayed Jaman Seen
            </span>
          </div>
        </footer>
      </div>

      {/* Full Printable / ATS CV Preview Modal */}
      <AnimatePresence>
        {previewOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setPreviewOpen(false)}
            className="cv-print-overlay fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-3 sm:p-6 overflow-y-auto"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 16 }}
              onClick={(e) => e.stopPropagation()}
              className="cv-print-sheet relative my-auto w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white p-6 sm:p-10 text-[#111111] shadow-2xl"
            >
              {/* Modal Controls (hidden in print) */}
              <div className="no-print mb-6 flex items-center justify-between border-b border-black/10 pb-4">
                <span className="text-xs font-semibold uppercase tracking-widest text-neutral-500">
                  Formatted Curriculum Vitae
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="inline-flex items-center gap-1.5 rounded-full bg-[#111111] px-4 py-2 text-xs font-medium uppercase tracking-wider text-white hover:bg-neutral-800"
                  >
                    <Printer className="h-3.5 w-3.5" />
                    Print / Save PDF
                  </button>
                  <button
                    type="button"
                    onClick={() => setPreviewOpen(false)}
                    aria-label="Close CV preview"
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-black/15 text-neutral-700 hover:bg-neutral-100"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Clean ATS-friendly CV Sheet */}
              <div className="space-y-5 font-sans text-sm leading-relaxed text-neutral-800">
                <header className="border-b border-neutral-300 pb-4">
                  <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-neutral-950">
                    JAYED JAMAN SEEN
                  </h1>
                  <p className="text-sm font-semibold text-indigo-700">
                    WordPress Web Development &amp; AI Tools Specialist
                  </p>
                  <p className="mt-1.5 text-xs text-neutral-600">
                    Barishal, Bangladesh | +880 1307-758119 (Phone/WhatsApp) | thunderseen@gmail.com
                    <br />
                    fiverr.com/jayedjaman_seen | freelancer.com.bd/u/jayedjamans | x.com/JayedJamanSeen
                    <br />
                    linkedin.com/in/jayed-jaman-seen-b540b8334 | github.com/JJSEEN | student-id-portal-1.onrender.com
                  </p>
                </header>

                <section>
                  <h2 className="text-xs font-bold uppercase tracking-widest text-neutral-900 border-b border-neutral-200 pb-1">
                    Professional Summary
                  </h2>
                  <p className="mt-2 text-xs sm:text-sm text-neutral-700">
                    Computer Science &amp; Engineering undergraduate and WordPress web developer combining hands-on Elementor, Gutenberg, and WooCommerce site-building skills with AI-assisted workflows, SEO fundamentals, and 5+ years of digital marketing &amp; brand management experience. BCC-certified in Artificial Intelligence for Professionals and elected Class Representative in the 600-hour DYD Freelancing &amp; ICT Skills Development program (8th Batch).
                  </p>
                </section>

                <section>
                  <h2 className="text-xs font-bold uppercase tracking-widest text-neutral-900 border-b border-neutral-200 pb-1">
                    Experience
                  </h2>
                  <div className="mt-2 space-y-3 text-xs sm:text-sm">
                    <div>
                      <div className="flex justify-between font-semibold text-neutral-900">
                        <span>WordPress Web Developer &amp; AI Tools Specialist (Freelance)</span>
                        <span>2025 – Present</span>
                      </div>
                      <ul className="mt-1 list-disc pl-5 text-neutral-700 space-y-0.5">
                        <li>Design, build, and customize responsive WordPress &amp; WooCommerce sites using Elementor, Gutenberg, ACF, and CPT.</li>
                        <li>Apply keyword research, competitor analysis, and SEO fundamentals to improve visibility and conversions.</li>
                        <li>Independently built and deployed a live Student ID Card web application on Render (student-id-portal-1.onrender.com).</li>
                      </ul>
                    </div>
                    <div>
                      <div className="flex justify-between font-semibold text-neutral-900">
                        <span>Social Media &amp; Digital Marketing Specialist — M/S Munni Trading &amp; Co. / The Chanachur Factory</span>
                        <span>May 2021 – Present</span>
                      </div>
                      <ul className="mt-1 list-disc pl-5 text-neutral-700 space-y-0.5">
                        <li>Manage end-to-end social media presence, brand communication, and promotional content calendars.</li>
                        <li>Produce commercial photography, videography, promotional graphics, and digital lead-generation campaigns.</li>
                      </ul>
                    </div>
                  </div>
                </section>

                <section>
                  <h2 className="text-xs font-bold uppercase tracking-widest text-neutral-900 border-b border-neutral-200 pb-1">
                    Certifications &amp; Education
                  </h2>
                  <div className="mt-2 space-y-1.5 text-xs sm:text-sm text-neutral-700">
                    <p><strong>B.Sc. in Computer Science &amp; Engineering</strong> — Trust University, Barishal (In Progress)</p>
                    <p><strong>Artificial Intelligence for Professionals (2026)</strong> — Bangladesh Computer Council (BCC), ICT Division</p>
                    <p><strong>Freelancing &amp; ICT Skills Development (600 Hours, 8th Batch)</strong> — DYD Barishal (Class Representative)</p>
                    <p><strong>HSC (Science):</strong> GPA 5.00/5.00 (2020) • <strong>SSC (Science):</strong> GPA 4.61/5.00 (2018)</p>
                    <p><strong>English Proficiency:</strong> IELTS Academic 6.5 (CEFR B2) • Duolingo English Test 90/160</p>
                  </div>
                </section>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
