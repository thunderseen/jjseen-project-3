import React from 'react';

interface LiveProjectButtonProps {
  href?: string;
  onClick?: () => void;
  label?: string;
  className?: string;
}

export const LiveProjectButton: React.FC<LiveProjectButtonProps> = ({
  href,
  onClick,
  label = 'Live Project',
  className = '',
}) => {
  const classes = `inline-flex items-center justify-center rounded-full border border-[#D7E2EA]/75 text-[#D7E2EA] font-medium uppercase tracking-widest px-5 py-2 sm:px-6 sm:py-2.5 text-xs sm:text-sm transition-colors duration-200 hover:bg-[#D7E2EA]/10 hover:border-[#D7E2EA] whitespace-nowrap ${className}`;

  if (href) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        onClick={onClick}
        className={classes}
      >
        {label}
      </a>
    );
  }

  return (
    <button type="button" onClick={onClick} className={classes}>
      {label}
    </button>
  );
};
