import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
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

  // Direct hardware-accelerated scroll mapping (instant 1:1 smoothness, zero lag)
  const row1X = useTransform(scrollYProgress, [0, 1], [-180, 340]);
  const row2X = useTransform(scrollYProgress, [0, 1], [180, -340]);

  const row1Source = items.filter((item) => item.row === 1);
  const row2Source = items.filter((item) => item.row === 2);

  const row1Items = repeatToFill(row1Source, 16);
  const row2Items = repeatToFill(row2Source, 16);
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
        className="relative h-[220px] w-[350px] shrink-0 overflow-hidden rounded-2xl border border-[#D7E2EA]/12 bg-[#121318]"
      >
        {link ? (
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="block h-full w-full transition-transform duration-200 hover:scale-[1.03]"
          >
            {img}
          </a>
        ) : (
          img
        )}
        {item.title && (
          <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 via-black/30 to-transparent px-4 py-2.5">
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
        items.length === 0
          ? 'px-4 pb-12 pt-10 sm:px-8 sm:pt-12 md:px-10 md:pb-16'
          : 'pb-10 pt-16 sm:pt-24'
      }`}
    >
      {items.length === 0 ? (
        <div className="mx-auto max-w-5xl">
          <div className="mb-5 flex flex-col gap-1 sm:mb-6 sm:flex-row sm:items-end sm:justify-between">
            <h2
              id="featured-work-title"
              className="hero-heading text-2xl font-black uppercase leading-none tracking-tight sm:text-3xl md:text-4xl"
            >
              Live Websites ({featuredProjects.length})
            </h2>
            <a
              href="#projects"
              className="text-[11px] font-medium uppercase tracking-[0.18em] text-[#8B7CFF] hover:text-white transition-colors"
            >
              Interactive Deck Below ↓
            </a>
          </div>
          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {featuredProjects.map((project, index) => {
              const href = normalizeUrl(project.href);
              return (
                <a
                  key={project.id}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`View ${project.name}`}
                  className="group flex min-h-[112px] flex-col justify-between rounded-2xl border border-[#D7E2EA]/12 bg-gradient-to-br from-[#161925] to-[#0E1016] p-3.5 transition-all duration-200 hover:-translate-y-0.5 hover:border-[#8B7CFF]/60 hover:shadow-[0_8px_22px_rgba(139,124,255,0.14)]"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-black leading-none text-[#D7E2EA]/35">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-[0.08em] text-[#BBCCD7]/70 truncate">
                      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400" />
                      {project.category.split('•')[0].trim()}
                    </span>
                  </div>
                  <div className="mt-4 flex items-end justify-between gap-2">
                    <h3 className="text-sm font-semibold uppercase leading-snug tracking-wide text-[#D7E2EA] group-hover:text-white transition-colors">
                      {project.name}
                    </h3>
                    <ArrowUpRight
                      aria-hidden="true"
                      className="h-4 w-4 shrink-0 text-[#8B7CFF] transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    />
                  </div>
                </a>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {row1Items.length > 0 && (
            <motion.div
              className="flex gap-3 -ml-[700px]"
              style={{ x: row1X, willChange: 'transform' }}
            >
              {row1Items.map((item, idx) => renderTile(item, `r1-${item.id}-${idx}`))}
            </motion.div>
          )}
          {row2Items.length > 0 && (
            <motion.div
              className="flex gap-3 -ml-[400px]"
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
