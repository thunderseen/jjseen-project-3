import React, { useRef, useState } from 'react';
import { motion, useScroll, useSpring, useTransform, MotionValue } from 'framer-motion';
import { ExternalLink, Globe, RefreshCw } from 'lucide-react';
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
  const [reloadTick, setReloadTick] = useState(0);
  const [iframeLoaded, setIframeLoaded] = useState(false);

  const targetScale = 1 - (totalCards - 1 - index) * 0.03;
  const rangeStart = totalCards > 1 ? index / totalCards : 0;
  const scale = useTransform(progress, [rangeStart, 1], [1, targetScale]);

  const displayNumber = String(index + 1).padStart(2, '0');
  const liveUrl = normalizeUrl(project.href);
  const previewSandbox = getPreviewSandbox(liveUrl);
  const customImages = [project.col1Img1, project.col1Img2, project.col2Img].filter(Boolean);
  const showLiveEmbed = Boolean(liveUrl) && (project.useLivePreview || customImages.length === 0);

  return (
    <div
      className={
        totalCards > 1
          ? 'sticky top-20 md:top-28 flex min-h-[82vh] items-start justify-center pb-10'
          : 'flex items-start justify-center pb-6'
      }
    >
      <motion.article
        style={{
          scale: totalCards > 1 ? scale : 1,
          top: totalCards > 1 ? `${index * 28}px` : undefined,
          transformOrigin: 'top center',
          willChange: 'transform',
        }}
        className="relative w-full max-w-6xl rounded-[36px] sm:rounded-[48px] md:rounded-[56px] border-2 border-[#D7E2EA]/85 bg-[#0F1014] p-4 sm:p-6 md:p-8 shadow-[0_-14px_48px_rgba(0,0,0,0.7)]"
      >
        {/* Top Row */}
        <div className="mb-4 sm:mb-6 flex flex-wrap items-center justify-between gap-4 px-2">
          <div className="flex items-center gap-4 sm:gap-6 md:gap-8">
            <span
              className="font-black leading-none tracking-tight text-[#D7E2EA]"
              style={{ fontSize: 'clamp(2.75rem, 8vw, 100px)' }}
            >
              {displayNumber}
            </span>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                {liveUrl && (
                  <span className="inline-block h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
                )}
                <span className="text-xs sm:text-sm font-light uppercase tracking-widest text-[#D7E2EA]/65">
                  {project.category || 'Featured Project'}
                </span>
              </div>
              <h3
                className="font-semibold uppercase leading-tight tracking-wide text-[#D7E2EA]"
                style={{ fontSize: 'clamp(1.1rem, 2.5vw, 2.2rem)' }}
              >
                {project.name}
              </h3>
              {project.description && (
                <p className="mt-1 max-w-xl text-xs sm:text-sm font-light text-[#D7E2EA]/65 line-clamp-2">
                  {project.description}
                </p>
              )}
            </div>
          </div>

          {liveUrl && <LiveProjectButton href={liveUrl} />}
        </div>

        {/* Bottom Visual Area: Live Interactive Website Embed OR Custom Uploaded Image Gallery */}
        {showLiveEmbed ? (
          <div className="overflow-hidden rounded-[28px] sm:rounded-[38px] md:rounded-[44px] border border-[#D7E2EA]/20 bg-[#14161D]">
            {/* Browser Top Chrome */}
            <div className="flex items-center justify-between gap-3 border-b border-white/10 bg-[#181B24] px-4 py-2.5 text-xs text-[#D7E2EA]/75">
              <div className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-rose-400/80" />
                <span className="h-2.5 w-2.5 rounded-full bg-amber-300/80" />
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/80" />
              </div>

              <div className="flex min-w-0 flex-1 items-center justify-center gap-1.5 rounded-full bg-black/35 px-3 py-1 text-[11px] sm:text-xs text-[#BBCCD7] max-w-md">
                <Globe className="h-3.5 w-3.5 shrink-0 text-emerald-400" />
                <span className="truncate">{liveUrl.replace(/^https?:\/\//, '')}</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  aria-label={`Reload ${project.name} live preview`}
                  onClick={() => {
                    setIframeLoaded(false);
                    setReloadTick((t) => t + 1);
                  }}
                  title="Reload live preview"
                  className="rounded-full p-1.5 text-[#D7E2EA]/70 hover:bg-white/10 hover:text-white transition-colors"
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                </button>
                <a
                  href={liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Open ${project.name} in a new tab`}
                  title="Open in new tab"
                  className="rounded-full p-1.5 text-[#D7E2EA]/70 hover:bg-white/10 hover:text-white transition-colors"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>

            {/* Live Embedded Viewport */}
            <div className="relative w-full h-[360px] sm:h-[440px] md:h-[520px] bg-[#0B0C10]">
              {!iframeLoaded && (
                <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 bg-[#0E1016]/90 text-center px-6">
                  <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#8B7CFF] border-t-transparent" />
                  <p className="text-xs sm:text-sm font-light uppercase tracking-widest text-[#BBCCD7]">
                    Connecting to Live Project Preview...
                  </p>
                  <p className="max-w-sm text-xs text-[#D7E2EA]/50">
                    Free hosted apps (like Render) can take a few seconds to wake up. You can also open it directly anytime.
                  </p>
                </div>
              )}
              <iframe
                key={`${project.id}-${reloadTick}`}
                src={liveUrl}
                title={`${project.name} live preview`}
                loading="lazy"
                onLoad={() => setIframeLoaded(true)}
                className="h-full w-full border-0 bg-white"
                sandbox={previewSandbox}
              />
            </div>
          </div>
        ) : customImages.length === 1 ? (
          <div className="overflow-hidden rounded-[32px] sm:rounded-[42px] md:rounded-[50px]">
            <img
              src={customImages[0]}
              alt={`${project.name} showcase`}
              loading="lazy"
              className="w-full h-[320px] sm:h-[420px] md:h-[520px] object-cover bg-[#161616]"
            />
          </div>
        ) : customImages.length === 2 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 md:gap-5">
            {customImages.map((src, idx) => (
              <img
                key={idx}
                src={src}
                alt={`${project.name} preview ${idx + 1}`}
                loading="lazy"
                className="w-full h-[260px] sm:h-[360px] md:h-[440px] rounded-[32px] sm:rounded-[42px] md:rounded-[50px] object-cover bg-[#161616]"
              />
            ))}
          </div>
        ) : customImages.length >= 3 ? (
          <div className="grid grid-cols-1 md:grid-cols-10 gap-3 sm:gap-4 md:gap-5">
            <div className="md:col-span-4 flex flex-col gap-3 sm:gap-4 md:gap-5">
              <img
                src={project.col1Img1}
                alt={`${project.name} preview 1`}
                loading="lazy"
                className="w-full rounded-[32px] sm:rounded-[42px] md:rounded-[50px] object-cover bg-[#161616]"
                style={{ height: 'clamp(130px, 16vw, 230px)' }}
              />
              <img
                src={project.col1Img2}
                alt={`${project.name} preview 2`}
                loading="lazy"
                className="w-full rounded-[32px] sm:rounded-[42px] md:rounded-[50px] object-cover bg-[#161616]"
                style={{ height: 'clamp(160px, 22vw, 340px)' }}
              />
            </div>
            <div className="md:col-span-6">
              <img
                src={project.col2Img}
                alt={`${project.name} main visual`}
                loading="lazy"
                className="h-full min-h-[240px] w-full rounded-[32px] sm:rounded-[42px] md:rounded-[50px] object-cover bg-[#161616]"
                style={{
                  maxHeight:
                    'calc(clamp(130px, 16vw, 230px) + clamp(160px, 22vw, 340px) + 1.25rem)',
                }}
              />
            </div>
          </div>
        ) : (
          <div className="flex h-[260px] sm:h-[320px] flex-col items-center justify-center rounded-[32px] border border-dashed border-[#D7E2EA]/25 bg-white/[0.02] text-center px-6">
            <Globe className="h-8 w-8 text-[#BBCCD7]/50" />
            <p className="mt-3 text-sm uppercase tracking-widest text-[#D7E2EA]/70">
              Ready for Project Visuals or Live URL
            </p>
            <p className="mt-1 text-xs text-[#D7E2EA]/45">
              Upload screenshots or paste a live website link from the Admin Panel.
            </p>
          </div>
        )}
      </motion.article>
    </div>
  );
};

interface ProjectsSectionProps {
  projects: ProjectItem[];
}

export const ProjectsSection: React.FC<ProjectsSectionProps> = ({
  projects,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 110,
    damping: 26,
    mass: 0.25,
  });

  return (
    <section
      id="projects"
      className="relative z-10 -mt-10 sm:-mt-12 md:-mt-14 w-full rounded-t-[40px] sm:rounded-t-[50px] md:rounded-t-[60px] bg-[#0C0C0C] px-4 sm:px-8 md:px-10 pt-20 sm:pt-24 md:pt-32 pb-16"
    >
      <div className="mx-auto max-w-6xl">
        <FadeIn delay={0} y={40}>
          <div className="mb-12 sm:mb-16 flex flex-col items-center text-center">
            <h2
              className="hero-heading font-black uppercase leading-none tracking-tight"
              style={{ fontSize: 'clamp(3rem, 12vw, 160px)' }}
            >
              Project
            </h2>
          </div>
        </FadeIn>

        <div ref={containerRef} className="relative mx-auto w-full">
          {projects.length > 0 ? (
            projects.map((project, index) => (
              <StickyProjectCard
                key={project.id}
                project={project}
                index={index}
                totalCards={projects.length}
                progress={smoothProgress}
              />
            ))
          ) : (
            <FadeIn delay={0.1} y={24}>
              <div className="mx-auto flex max-w-4xl flex-col items-center justify-center rounded-[40px] border-2 border-dashed border-[#D7E2EA]/20 bg-white/[0.02] px-6 py-20 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-full border border-[#D7E2EA]/20 bg-white/[0.04] text-[#BBCCD7]">
                  <Globe className="h-6 w-6" />
                </div>
                <h3 className="mt-5 text-xl sm:text-2xl font-semibold uppercase tracking-wider text-[#D7E2EA]">
                  Featured Projects Coming Soon
                </h3>
                <p className="mt-2 max-w-md text-sm font-light text-[#D7E2EA]/55">
                  New live WordPress, WooCommerce, and AI-powered web builds are being added shortly.
                </p>
              </div>
            </FadeIn>
          )}
        </div>
      </div>
    </section>
  );
};
