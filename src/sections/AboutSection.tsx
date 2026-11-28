import React from 'react';
import { FadeIn } from '../components/FadeIn';
import { AnimatedText } from '../components/AnimatedText';
import { ContactButton } from '../components/ContactButton';

interface AboutSectionProps {
  onOpenContact: () => void;
}

const ABOUT_TEXT =
  "With more than five years of experience in digital marketing, brand communication, and WordPress development, I focus on Elementor, WooCommerce, SEO, and AI-assisted workflows that help businesses stand out and convert. Let's build something incredible together!";

export const AboutSection: React.FC<AboutSectionProps> = ({ onOpenContact }) => {
  return (
    <section
      id="about"
      className="relative flex min-h-[78vh] w-full flex-col items-center justify-center overflow-hidden bg-[#0C0C0C] px-5 sm:px-8 md:px-10 py-16 md:py-24"
    >
      {/* Top-left decorative 3D Moon */}
      <FadeIn
        delay={0.1}
        x={-60}
        y={0}
        duration={0.85}
        className="pointer-events-none absolute top-[6%] left-[2%] sm:left-[4%] md:left-[6%] w-[82px] sm:w-[110px] md:w-[142px] select-none opacity-90"
      >
        <img
          src={`${import.meta.env.BASE_URL}moon-icon.webp`}
          alt=""
          aria-hidden="true"
          loading="lazy"
          decoding="async"
          className="h-auto w-full object-contain"
        />
      </FadeIn>

      {/* Bottom-left decorative 3D object */}
      <FadeIn
        delay={0.18}
        x={-40}
        y={0}
        duration={0.5}
        className="pointer-events-none absolute bottom-[8%] left-[4%] sm:left-[7%] md:left-[11%] w-[72px] sm:w-[96px] md:w-[126px] select-none opacity-90"
      >
        <img
          src={`${import.meta.env.BASE_URL}about-object.webp`}
          alt=""
          aria-hidden="true"
          loading="lazy"
          decoding="async"
          className="h-auto w-full object-contain"
        />
      </FadeIn>

      {/* Top-right decorative 3D Lego */}
      <FadeIn
        delay={0.12}
        x={40}
        y={0}
        duration={0.5}
        className="pointer-events-none absolute top-[6%] right-[2%] sm:right-[4%] md:right-[6%] w-[82px] sm:w-[110px] md:w-[142px] select-none opacity-90"
      >
        <img
          src={`${import.meta.env.BASE_URL}lego-icon.webp`}
          alt=""
          aria-hidden="true"
          loading="lazy"
          decoding="async"
          className="h-auto w-full object-contain"
        />
      </FadeIn>

      {/* Bottom-right decorative 3D group */}
      <FadeIn
        delay={0.22}
        x={40}
        y={0}
        duration={0.5}
        className="pointer-events-none absolute bottom-[8%] right-[4%] sm:right-[7%] md:right-[11%] w-[88px] sm:w-[116px] md:w-[148px] select-none opacity-90"
      >
        <img
          src={`${import.meta.env.BASE_URL}about-group.webp`}
          alt=""
          aria-hidden="true"
          loading="lazy"
          decoding="async"
          className="h-auto w-full object-contain"
        />
      </FadeIn>

      {/* Center Content */}
      <div className="relative z-10 flex flex-col items-center gap-10 sm:gap-12 md:gap-14">
        <div className="flex flex-col items-center gap-6 sm:gap-8 md:gap-10">
          <FadeIn delay={0} y={32}>
            <h2
              className="hero-heading text-center font-black uppercase leading-none tracking-tight"
              style={{ fontSize: 'clamp(2.4rem, 7vw, 96px)' }}
            >
              About me
            </h2>
          </FadeIn>

          <AnimatedText
            text={ABOUT_TEXT}
            className="max-w-[540px] text-center font-medium leading-relaxed text-[#D7E2EA]"
            style={{ fontSize: 'clamp(0.95rem, 1.45vw, 1.2rem)' }}
          />
        </div>

        <FadeIn delay={0.15} y={20}>
          <ContactButton onClick={onOpenContact} />
        </FadeIn>
      </div>
    </section>
  );
};
