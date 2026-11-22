import React from 'react';
import { FadeIn } from '../components/FadeIn';
import { ContactButton } from '../components/ContactButton';
import { LivingPortrait } from '../components/LivingPortrait';

interface HeroSectionProps {
  onOpenContact: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onOpenContact }) => {
  return (
    <section
      className="relative flex h-screen min-h-[100svh] w-full flex-col justify-between bg-[#0C0C0C]"
      style={{ overflowX: 'clip' }}
    >
      {/* Subtle studio ambient glow behind portrait */}
      <div
        aria-hidden="true"
        className="hero-ambient-glow pointer-events-none absolute inset-0 z-0"
      />
      {/* Top Navbar + Massive Heading */}
      <div className="relative z-20 flex flex-col">
        <FadeIn
          as="nav"
          aria-label="Main navigation"
          delay={0}
          y={-20}
          className="mx-auto w-full max-w-6xl px-6 pt-5 md:px-10 md:pt-7"
        >
          <div className="flex w-full items-center justify-between text-[#D7E2EA] font-medium uppercase tracking-widest text-xs sm:text-sm md:text-[15px]">
            <a
              href="#about"
              className="transition-opacity duration-200 hover:opacity-70"
            >
              About
            </a>
            <a
              href="#services"
              className="transition-opacity duration-200 hover:opacity-70"
            >
              Services
            </a>
            <a
              href="#projects"
              className="transition-opacity duration-200 hover:opacity-70"
            >
              Projects
            </a>
            <button
              type="button"
              onClick={onOpenContact}
              className="uppercase tracking-widest transition-opacity duration-200 hover:opacity-70"
            >
              Contact
            </button>
          </div>
        </FadeIn>

        <div className="w-full overflow-hidden px-4 sm:px-6">
          <FadeIn as="div" delay={0.15} y={32}>
            <h1
              id="hero-heading"
              className="hero-heading mt-8 sm:mt-6 md:mt-5 w-full select-none whitespace-nowrap text-center text-[clamp(2.65rem,9.8vw,8.25rem)] font-black leading-none tracking-tight"
            >
              Hi, I&rsquo;m <span className="uppercase">JAYED</span>
            </h1>
          </FadeIn>
        </div>
      </div>

      {/* Centered Living Portrait */}
      <LivingPortrait />

      {/* Bottom Bar */}
      <div className="relative z-20 mx-auto flex w-full max-w-6xl flex-col items-start gap-4 px-6 pb-6 sm:flex-row sm:items-end sm:justify-between sm:gap-0 sm:pb-8 md:px-10 md:pb-9">
        <FadeIn delay={0.35} y={20}>
          <p
            className="max-w-[200px] sm:max-w-[240px] md:max-w-[270px] font-light uppercase leading-snug tracking-wide text-[#D7E2EA]/90"
            style={{ fontSize: 'clamp(0.72rem, 1.05vw, 0.98rem)' }}
          >
            a wordpress developer &amp; ai specialist crafting striking digital
            experiences
          </p>
        </FadeIn>

        <FadeIn delay={0.5} y={20}>
          <ContactButton onClick={onOpenContact} />
        </FadeIn>
      </div>
    </section>
  );
};
