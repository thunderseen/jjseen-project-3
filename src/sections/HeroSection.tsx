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
          className="w-full px-6 pt-6 md:px-10 md:pt-8"
        >
          <div className="flex w-full items-center justify-between text-[#D7E2EA] font-medium uppercase tracking-wider text-sm md:text-lg lg:text-[1.4rem]">
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
              className="uppercase tracking-wider transition-opacity duration-200 hover:opacity-70"
            >
              Contact
            </button>
          </div>
        </FadeIn>

        <div className="w-full overflow-hidden px-2 sm:px-4">
          <FadeIn as="div" delay={0.15} y={40}>
            <h1
              id="hero-heading"
              className="hero-heading mt-6 w-full select-none whitespace-nowrap text-center text-[13vw] font-black uppercase leading-none tracking-tight sm:mt-4 sm:text-[14vw] md:-mt-5 md:text-[15vw] lg:text-[16.2vw]"
            >
              Hi, I&rsquo;m Jayed
            </h1>
          </FadeIn>
        </div>
      </div>

      {/* Centered Living Portrait */}
      <LivingPortrait />

      {/* Bottom Bar */}
      <div className="relative z-20 flex w-full items-end justify-between px-6 md:px-10 pb-7 sm:pb-8 md:pb-10">
        <FadeIn delay={0.35} y={20}>
          <p
            className="max-w-[160px] sm:max-w-[220px] md:max-w-[270px] font-light uppercase leading-snug tracking-wide text-[#D7E2EA]"
            style={{ fontSize: 'clamp(0.75rem, 1.4vw, 1.5rem)' }}
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
