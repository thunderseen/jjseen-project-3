import React, { useRef } from 'react';
import { motion, useScroll, useSpring, useTransform, MotionValue } from 'framer-motion';

interface AnimatedCharProps {
  char: string;
  progress: MotionValue<number>;
  range: [number, number];
}

const AnimatedChar: React.FC<AnimatedCharProps> = ({ char, progress, range }) => {
  const opacity = useTransform(progress, range, [0.2, 1]);

  return (
    <span className="relative inline-block">
      <span className="opacity-20 select-none" aria-hidden="true">
        {char}
      </span>
      <motion.span style={{ opacity }} className="absolute inset-0">
        {char}
      </motion.span>
    </span>
  );
};

interface AnimatedTextProps {
  text: string;
  className?: string;
  style?: React.CSSProperties;
}

export const AnimatedText: React.FC<AnimatedTextProps> = ({
  text,
  className = '',
  style,
}) => {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 0.8', 'end 0.2'],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 110,
    damping: 26,
    mass: 0.25,
  });

  const words = text.split(' ');
  const totalChars = text.length;
  let charIndex = 0;

  return (
    <p ref={ref} className={className} style={style}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {words.map((word, wIdx) => {
          const wordStart = charIndex;
          const chars = word.split('');
          charIndex += chars.length + 1;

          return (
            <span key={wIdx} className="inline-block whitespace-nowrap">
              {chars.map((char, cIdx) => {
                const globalIdx = wordStart + cIdx;
                const start = globalIdx / totalChars;
                const end = Math.min(1, (globalIdx + 1) / totalChars);
                return (
                  <AnimatedChar
                    key={`${wIdx}-${cIdx}`}
                    char={char}
                    progress={smoothProgress}
                    range={[start, end]}
                  />
                );
              })}
              {wIdx < words.length - 1 ? '\u00A0' : ''}
            </span>
          );
        })}
      </span>
    </p>
  );
};
