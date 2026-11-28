import React, { useRef, useState } from 'react';
import { motion, useScroll, useTransform, MotionValue } from 'framer-motion';
import { ExternalLink, Globe, Play, RefreshCw, X } from 'lucide-react';
import { FadeIn } from '../components/FadeIn';
import { LiveProjectButton } from '../components/LiveProjectButton';
import { ProjectItem, normalizeUrl } from '../types/portfolio';

function getPreviewSandbox(url: string): string {
  try {
    if (new URL(url, window.location.href).origin === window.location.origin) {
      return 'allow-scripts allow-forms allow-popups';
    }
  } catch {
    return 'allow-scripts allow-forms allow-popups';
  }
  return 'allow-scripts allow-same-origin allow-forms allow-popups';
}

const ACCENT_GRADIENTS = [
  'from-[#5B5FE8]/20 via-[#151828] to-[#0E1017]',
  'from-emerald-500/18 via-[#111C1A] to-[#0E1017]',
  'from-amber-500/18 via-[#1E1712] to-[#0E1017]',
  'from-sky-500/20 via-[#111A26] to-[#0E1017]',
  'from-fuchsia-500/18 via-[#1D1326] to-[#0E1017]',
  'from-cyan-500/18 via-[#101C22] to-[#0E1017]',
];

interface StickyCardProps {
  project: ProjectItem;
  index: number;
  totalCards: number;
  progress: MotionValue<number>;
}

const StickyProjectCard: React.FC<StickyCardProps> = ({
  project,
  index,
  totalCards,
  progress,
}) => {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [reloadTick, setReloadTick] = useState(0);
  const [iframeLoaded, setIframeLoaded] = useState(false);

  const depth = Math.min(totalCards - 1 - index, 5);
  const targetScale = 1 - depth * 0.022;
  const rangeStart = totalCards > 1 ? index / totalCards : 0;
  const scale = useTransform(progress, [rangeStart, 1], [1, targetScale]);

  const displayNumber = String(index + 1).padStart(2, '0');
  const liveUrl = normalizeUrl(project.href);
  const cleanHost = liveUrl.replace(/^https?:\/\//, '').replace(/\/$/, '');
  const previewSandbox = getPreviewSandbox(liveUrl);
  const customImages = [project.col1Img1, project.col1Img2, project.col2Img].filter(Boolean);
  const accent = ACCENT_GRADIENTS[index % ACCENT_GRADIENTS.length];
  const stackOffset = Math.min(index, 8) * 9;

  return (
    <div
      className={
        totalCards > 1
          ? 'sticky top-12 sm:top-14 md:top-16 mb-6 flex items-start justify-center'
          : 'mb-6 flex items-start justify-center'
      }
    >
      <motion.article
        style={{
          scale: totalCards > 1 ? scale : 1,
          top: totalCards > 1 ? `${stackOffset}px` : undefined,
          transformOrigin: 'top center',
          willChange: 'transform',
        }}
        className="relative w-full max-w-4xl rounded-[22px] sm:rounded-[28px] border border-[#D7E2EA]/30 bg-[#0F1117] p-3.5 sm:p-5 shadow-[0_-10px_36px_rgba(0,0,0,0.75)]"
      >
        {/* Compact Card Header */}
        <div className="mb-3 flex flex-wrap items-center justify-between gap-3 px-1">
          <div className="flex items-center gap-3 sm:gap-4 min-w-0">
            <span
              className="shrink-0 font-black leading-none tracking-tight text-[#D7E2EA]/85"
              style={{ fontSize: 'clamp(1.5rem, 3.2vw, 38px)' }}
            >
              {displayNumber}
            </span>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                {liveUrl && (
                  <span className="inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.85)]" />
                )}
                <span className="truncate text-[10px] sm:text-[11px] font-medium uppercase tracking-[0.16em] text-[#BBCCD7]/70">
                  {project.category || 'Featured Website'}
                </span>
              </div>
              <h3 className="truncate text-base sm:text-lg md:text-xl font-semibold uppercase leading-tight tracking-wide text-white">
                {project.name}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {liveUrl && !customImages.length && (
              <button
                type="button"
                onClick={() => {
                  if (previewOpen) {
                    setPreviewOpen(false);
                  } else {
                    setIframeLoaded(false);
                    setPreviewOpen(true);
                  }
                }}
                className={`inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-[11px] sm:text-xs font-medium uppercase tracking-wider transition-colors ${
                  previewOpen
                    ? 'border-rose-400/50 bg-rose-500/15 text-rose-200 hover:bg-rose-500/25'
                    : 'border-[#8B7CFF]/55 bg-[#8B7CFF]/15 text-[#D5CCFF] hover:bg-[#8B7CFF]/25'
                }`}
              >
                {previewOpen ? (
                  <>
                    <X className="h-3.5 w-3.5" />
                    Close Preview
                  </>
                ) : (
                  <>
                    <Play className="h-3 w-3 fill-current" />
                    Live Preview
                  </>
                )}
              </button>
            )}
            {liveUrl && (
              <LiveProjectButton
                href={liveUrl}
                label="Visit Site"
                className="!px-4 !py-1.5 !text-[11px] sm:!text-xs"
              />
            )}
          </div>
        </div>

        {/* Visual Area: Custom Screenshots OR Fast Instant Preview Card (with On-Demand Live Iframe) */}
        {customImages.length > 0 ? (
          customImages.length === 1 ? (
            <div className="overflow-hidden rounded-[16px] sm:rounded-[20px]">
              <img
                src={customImages[0]}
                alt={`${project.name} showcase`}
                loading="lazy"
                decoding="async"
                className="h-[220px] sm:h-[260px] md:h-[300px] w-full object-cover bg-[#161616]"
              />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {customImages.slice(0, 2).map((src, idx) => (
                <img
                  key={idx}
                  src={src}
                  alt={`${project.name} preview ${idx + 1}`}
                  loading="lazy"
                  decoding="async"
                  className="h-[200px] sm:h-[240px] w-full rounded-[16px] object-cover bg-[#161616]"
                />
              ))}
            </div>
          )
        ) : (
          <div className="overflow-hidden rounded-[16px] sm:rounded-[20px] border border-[#D7E2EA]/15 bg-[#12141C]">
            {/* Compact Browser Bar */}
            <div className="flex items-center justify-between gap-2 border-b border-white/10 bg-[#171A23] px-3 py-1.5 text-[11px] text-[#D7E2EA]/75">
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-rose-400/80" />
                <span className="h-2 w-2 rounded-full bg-amber-300/80" />
                <span className="h-2 w-2 rounded-full bg-emerald-400/80" />
              </div>

              <div className="flex min-w-0 flex-1 items-center justify-center gap-1.5 rounded-full bg-black/35 px-2.5 py-0.5 text-[10px] sm:text-[11px] text-[#BBCCD7] max-w-sm">
                <Globe className="h-3 w-3 shrink-0 text-emerald-400" />
                <span className="truncate">{cleanHost}</span>
              </div>

              <div className="flex items-center gap-1">
                {previewOpen && (
                  <button
                    type="button"
                    aria-label={`Reload ${project.name} preview`}
                    onClick={() => {
                      setIframeLoaded(false);
                      setReloadTick((t) => t + 1);
                    }}
                    className="rounded-full p-1 text-[#D7E2EA]/70 hover:bg-white/10 hover:text-white"
                  >
                    <RefreshCw className="h-3 w-3" />
                  </button>
                )}
                {liveUrl && (
                  <a
                    href={liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Open ${project.name}`}
                    className="rounded-full p-1 text-[#D7E2EA]/70 hover:bg-white/10 hover:text-white"
                  >
                    <ExternalLink className="h-3 w-3" />
                  </a>
                )}
              </div>
            </div>

            {previewOpen && liveUrl ? (
              <div className="relative h-[260px] sm:h-[310px] md:h-[340px] w-full bg-[#0B0C10]">
                {!iframeLoaded && (
                  <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-2 bg-[#0E1016]/95 px-4 text-center">
                    <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#8B7CFF] border-t-transparent" />
                    <p className="text-[11px] uppercase tracking-widest text-[#BBCCD7]">
                      Loading live site...
                    </p>
                  </div>
                )}
                <iframe
                  key={`${project.id}-${reloadTick}`}
                  src={liveUrl}
                  title={`${project.name} live preview`}
                  onLoad={() => setIframeLoaded(true)}
                  className="h-full w-full border-0 bg-white"
                  sandbox={previewSandbox}
                />
              </div>
            ) : (
              /* Zero-lag Instant Native Preview Surface (keeps scrolling 120fps) */
              <div
                className={`relative flex min-h-[175px] sm:min-h-[195px] flex-col justify-between bg-gradient-to-br ${accent} p-4 sm:p-6`}
              >
                <div className="flex flex-col gap-2">
                  {project.description && (
                    <p className="max-w-2xl text-xs sm:text-sm font-light leading-relaxed text-[#D7E2EA]/85">
                      {project.description}
                    </p>
                  )}
                  {project.tags && project.tags.length > 0 && (
                    <div className="mt-1 flex flex-wrap gap-1.5">
                      {project.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full border border-white/15 bg-black/25 px-2.5 py-0.5 text-[10px] uppercase tracking-wider text-[#D7E2EA]/80"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-3">
                  <span className="text-[11px] font-light text-[#BBCCD7]/70">
                    Click <strong className="font-medium text-white">Live Preview</strong> to test interactively right here without slowing scroll
                  </span>
                  {liveUrl && (
                    <a
                      href={liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-medium uppercase tracking-widest text-[#67C5FF] hover:text-white transition-colors"
                    >
                      Launch Fullscreen
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </motion.article>
    </div>
  );
};

interface ProjectsSectionProps {
  projects: ProjectItem[];
}

export const ProjectsSection: React.FC<ProjectsSectionProps> = ({ projects }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  return (
    <section
      id="projects"
      className="relative z-10 -mt-8 sm:-mt-10 md:-mt-12 w-full rounded-t-[28px] sm:rounded-t-[36px] md:rounded-t-[44px] bg-[#0C0C0C] px-4 sm:px-8 md:px-10 pt-14 sm:pt-18 md:pt-20 pb-14"
    >
      <div className="mx-auto max-w-5xl">
        <FadeIn delay={0} y={24}>
          <div className="mb-8 sm:mb-10 flex flex-col items-center text-center">
            <h2
              className="hero-heading font-black uppercase leading-none tracking-tight"
              style={{ fontSize: 'clamp(2.2rem, 6.2vw, 84px)' }}
            >
              Projects
            </h2>
            <p className="mt-2.5 text-xs sm:text-sm font-light uppercase tracking-[0.2em] text-[#D7E2EA]/55">
              All {projects.length} Live Websites &amp; Cloud Apps • Compact Interactive Deck
            </p>
          </div>
        </FadeIn>

        <div ref={containerRef} className="relative mx-auto w-full pb-6">
          {projects.length > 0 ? (
            projects.map((project, index) => (
              <StickyProjectCard
                key={project.id}
                project={project}
                index={index}
                totalCards={projects.length}
                progress={scrollYProgress}
              />
            ))
          ) : (
            <FadeIn delay={0.05} y={16}>
              <div className="mx-auto flex max-w-3xl flex-col items-center justify-center rounded-[28px] border border-dashed border-[#D7E2EA]/20 bg-white/[0.02] px-6 py-16 text-center">
                <Globe className="h-7 w-7 text-[#BBCCD7]/60" />
                <h3 className="mt-4 text-lg font-semibold uppercase tracking-wider text-[#D7E2EA]">
                  Featured Projects Coming Soon
                </h3>
              </div>
            </FadeIn>
          )}
        </div>
      </div>
    </section>
  );
};
