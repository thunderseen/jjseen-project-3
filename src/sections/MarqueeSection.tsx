import React, { useRef } from 'react';
import { motion, useScroll, useSpring, useTransform } from 'framer-motion';
import { ShowcaseItem, normalizeUrl } from '../types/portfolio';

interface MarqueeSectionProps {
  items: ShowcaseItem[];
}

function repeatToFill<T>(arr: T[], minCount: number): T[] {
  if (arr.length === 0) return [];
  const out: T[] = [];
  while (out.length < minCount) {
    out.push(...arr);
  }
  return out;
}

export const MarqueeSection: React.FC<MarqueeSectionProps> = ({ items }) => {
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

  if (items.length === 0) return null;

  return (
    <section
      ref={sectionRef}
      className="w-full overflow-hidden bg-[#0C0C0C] pt-24 sm:pt-32 md:pt-40 pb-10"
    >
      <div className="flex flex-col gap-3">
        {/* Row 1: moves RIGHT on scroll */}
        {row1Items.length > 0 && (
          <motion.div
            className="flex gap-3 -ml-[900px]"
            style={{ x: row1X, willChange: 'transform' }}
          >
            {row1Items.map((item, idx) => renderTile(item, `r1-${item.id}-${idx}`))}
          </motion.div>
        )}

        {/* Row 2: moves LEFT on scroll */}
        {row2Items.length > 0 && (
          <motion.div
            className="flex gap-3 -ml-[500px]"
            style={{ x: row2X, willChange: 'transform' }}
          >
            {row2Items.map((item, idx) => renderTile(item, `r2-${item.id}-${idx}`))}
          </motion.div>
        )}
      </div>
    </section>
  );
};
