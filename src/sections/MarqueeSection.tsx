import React, { useRef } from 'react';
import { motion, useScroll, useSpring, useTransform } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { ProjectItem, ShowcaseItem, normalizeUrl } from '../types/portfolio';

interface MarqueeSectionProps {
  items: ShowcaseItem[];
  projects: ProjectItem[];
}

function repeatToFill<T>(arr: T[], minCount: number): T[] {
  if (arr.length === 0) return [];
  const out: T[] = [];
  while (out.length < minCount) {
    out.push(...arr);
  }
  return out;
}

export const MarqueeSection: React.FC<MarqueeSectionProps> = ({ items, projects }) => {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  // Spring-damped scroll progress for buttery inertia with zero React re-renders
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 75,
    damping: 22,
    mass: 0.35,
  });

  const row1X = useTransform(smoothProgress, [0, 1], [-220, 460]);
  const row2X = useTransform(smoothProgress, [0, 1], [220, -460]);

  const row1Source = items.filter((item) => item.row === 1);
  const row2Source = items.filter((item) => item.row === 2);

  // If user added items only to one row, keep the other row cleanly empty until populated
  const row1Items = repeatToFill(row1Source, 18);
  const row2Items = repeatToFill(row2Source, 18);
  const featuredProjects = projects.filter((project) => Boolean(normalizeUrl(project.href)));

  const renderTile = (item: ShowcaseItem, key: string) => {
    const link = item.linkUrl ? normalizeUrl(item.linkUrl) : '';
    const img = (
      <img
        src={item.imageUrl}
        alt={item.title || 'Project showcase'}
        loading="lazy"
        decoding="async"
        className="h-full w-full object-cover"
      />
    );

    return (
      <div
        key={key}
        className="relative h-[270px] w-[420px] shrink-0 overflow-hidden rounded-2xl border border-[#D7E2EA]/12 bg-[#121318]"
      >
        {link ? (
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="block h-full w-full transition-transform duration-300 hover:scale-[1.03]"
          >
            {img}
          </a>
        ) : (
          img
        )}
        {item.title && (
          <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 via-black/30 to-transparent px-4 py-3">
            <span className="text-xs font-medium uppercase tracking-widest text-[#D7E2EA]">
              {item.title}
            </span>
          </div>
        )}
      </div>
    );
  };

  if (items.length === 0 && featuredProjects.length === 0) return null;

  return (
    <section
      ref={sectionRef}
      aria-labelledby={items.length === 0 ? 'featured-work-title' : undefined}
      className={`w-full overflow-hidden bg-[#0C0C0C] ${
        items.length === 0 ? 'px-4 pb-14 pt-14 sm:px-8 sm:pt-16 md:px-10 md:pb-20' : 'pb-10 pt-24 sm:pt-32 md:pt-40'
      }`}
    >
      {items.length === 0 ? (
        <div className="mx-auto max-w-5xl">
          <div className="mb-6 flex flex-col gap-1.5 sm:mb-8 sm:flex-row sm:items-end sm:justify-between">
            <h2
              id="featured-work-title"
              className="hero-heading text-3xl font-black uppercase leading-none tracking-tight sm:text-4xl md:text-5xl"
            >
              Selected Work
            </h2>
            <p className="text-[11px] font-light uppercase tracking-[0.18em] text-[#D7E2EA]/55 sm:text-xs">
              Live work &amp; interactive website concepts
            </p>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {featuredProjects.map((project, index) => {
              const href = normalizeUrl(project.href);
              return (
                <a
                  key={project.id}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`View ${project.name}`}
                  className="group flex min-h-40 flex-col justify-between rounded-2xl border border-[#D7E2EA]/12 bg-gradient-to-br from-[#171A27] to-[#0E1016] p-4 transition-all duration-300 hover:-translate-y-1 hover:border-[#8B7CFF]/60 hover:shadow-[0_12px_30px_rgba(139,124,255,0.14)] focus-visible:border-[#8B7CFF] sm:p-5"
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-sm font-black leading-none text-[#D7E2EA]/35">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-right text-[10px] font-medium uppercase tracking-[0.1em] text-[#BBCCD7]/70">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                      {project.category.split('•')[0].trim()}
                    </span>
                  </div>
                  <div className="mt-6 flex items-end justify-between gap-2">
                    <h3 className="text-base font-semibold uppercase leading-snug tracking-wide text-[#D7E2EA] sm:text-[17px]">
                      {project.name}
                    </h3>
                    <ArrowUpRight
                      aria-hidden="true"
                      className="mb-0.5 h-4 w-4 shrink-0 text-[#8B7CFF] transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    />
                  </div>
                  <span className="mt-3 text-[10px] font-medium uppercase tracking-[0.16em] text-[#D7E2EA]/45 group-hover:text-[#C4B5FD] transition-colors">
                    Open live preview
                  </span>
                </a>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {row1Items.length > 0 && (
            <motion.div
              className="flex gap-3 -ml-[900px]"
              style={{ x: row1X, willChange: 'transform' }}
            >
              {row1Items.map((item, idx) => renderTile(item, `r1-${item.id}-${idx}`))}
            </motion.div>
          )}
          {row2Items.length > 0 && (
            <motion.div
              className="flex gap-3 -ml-[500px]"
              style={{ x: row2X, willChange: 'transform' }}
            >
              {row2Items.map((item, idx) => renderTile(item, `r2-${item.id}-${idx}`))}
            </motion.div>
          )}
        </div>
      )}
    </section>
  );
};
