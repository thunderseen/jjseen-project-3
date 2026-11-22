import React from 'react';
import { Magnet } from './Magnet';

interface ContactButtonProps {
  onClick?: () => void;
  href?: string;
  label?: string;
  className?: string;
}

export const ContactButton: React.FC<ContactButtonProps> = ({
  onClick,
  href,
  label = 'Contact Me',
  className = '',
}) => {
  const baseStyle: React.CSSProperties = {
    background:
      'linear-gradient(123deg, #5B5FE8 0%, #8B7CFF 42%, #C084FC 74%, #67C5FF 100%)',
    boxShadow:
      '0px 6px 22px rgba(139, 124, 255, 0.32), 0px 2px 12px rgba(255, 255, 255, 0.28) inset',
    outline: '2px solid rgba(255, 255, 255, 0.92)',
    outlineOffset: '-3px',
  };

  const classes = `contact-btn inline-flex items-center justify-center rounded-full text-white font-medium uppercase tracking-widest px-6 py-2.5 sm:px-8 sm:py-3 md:px-9 md:py-3.5 text-xs sm:text-[13px] md:text-sm transition-all duration-200 hover:brightness-110 hover:scale-[1.03] active:scale-[0.98] cursor-pointer select-none ${className}`;

  const inner = href ? (
    <a href={href} onClick={onClick} className={classes} style={baseStyle}>
      {label}
    </a>
  ) : (
    <button type="button" onClick={onClick} className={classes} style={baseStyle}>
      {label}
    </button>
  );

  return (
    <Magnet padding={40} strength={5}>
      {inner}
    </Magnet>
  );
};
