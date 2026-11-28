import React, { useMemo } from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';

type TagName = 'div' | 'nav' | 'section' | 'header' | 'article' | 'span' | 'p' | 'h1' | 'h2' | 'h3';

interface FadeInProps {
  children: React.ReactNode;
  as?: TagName;
  delay?: number;
  duration?: number;
  x?: number;
  y?: number;
  className?: string;
  style?: React.CSSProperties;
  'aria-label'?: string;
}

type DynamicMotionComponent = React.ComponentType<
  HTMLMotionProps<'div'> & { children?: React.ReactNode }
>;

const motionComponentCache = new Map<TagName, DynamicMotionComponent>();

function getMotionComponent(tag: TagName): DynamicMotionComponent {
  let comp = motionComponentCache.get(tag);
  if (!comp) {
    comp = motion.create(tag) as unknown as DynamicMotionComponent;
    motionComponentCache.set(tag, comp);
  }
  return comp;
}

export const FadeIn: React.FC<FadeInProps> = ({
  children,
  as = 'div',
  delay = 0,
  duration = 0.4,
  x = 0,
  y = 16,
  className,
  style,
  'aria-label': ariaLabel,
}) => {
  const Component = useMemo(() => getMotionComponent(as), [as]);

  return (
    <Component
      initial={{ opacity: 0, x, y }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: '80px', amount: 0 }}
      transition={{
        duration,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={className}
      style={style}
      aria-label={ariaLabel}
    >
      {children}
    </Component>
  );
};
