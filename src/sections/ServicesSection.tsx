import React from 'react';
import { FadeIn } from '../components/FadeIn';

const SERVICES = [
  {
    number: '01',
    name: 'WordPress Development',
    description:
      'Responsive WordPress websites built with Elementor, Gutenberg, custom child themes, ACF, and Custom Post Types -- tailored for speed, clarity, and effortless management.',
  },
  {
    number: '02',
    name: 'WooCommerce Stores',
    description:
      'Complete e-commerce store setup and customization with streamlined checkout flows, site-speed optimization, multilingual builds, and membership functionality.',
  },
  {
    number: '03',
    name: 'AI & Automation',
    description:
      'Prompt engineering and AI-assisted development, branding, and content workflows using ChatGPT, Claude, Google Gemini, and modern generative tools to accelerate growth.',
  },
  {
    number: '04',
    name: 'SEO & Lead Generation',
    description:
      'Keyword research, search-intent and competitor analysis, technical on-page SEO with Rank Math and GA4, plus targeted B2B and B2C prospect outreach.',
  },
  {
    number: '05',
    name: 'Digital Marketing & Media',
    description:
      'End-to-end social media strategy, Meta Ads Manager campaigns, Klaviyo and Mailchimp email marketing, commercial photography, graphic design, and video editing.',
  },
];

export const ServicesSection: React.FC = () => {
  return (
    <section
      id="services"
      className="w-full rounded-t-[28px] sm:rounded-t-[36px] md:rounded-t-[44px] bg-[#FFFFFF] px-5 sm:px-8 md:px-10 py-14 sm:py-18 md:py-24 text-[#0C0C0C]"
    >
      <FadeIn delay={0} y={32}>
        <h2
          className="mb-10 sm:mb-14 md:mb-16 text-center font-black uppercase leading-none tracking-tight text-[#0C0C0C]"
          style={{ fontSize: 'clamp(2.4rem, 7vw, 96px)' }}
        >
          Services
        </h2>
      </FadeIn>

      <div className="mx-auto flex max-w-5xl flex-col">
        {SERVICES.map((service, i) => (
          <FadeIn
            key={service.number}
            delay={i * 0.08}
            y={24}
            className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-8 md:gap-12 py-5 sm:py-6 md:py-7"
            style={{
              borderTop: '1px solid rgba(12, 12, 12, 0.14)',
              borderBottom:
                i === SERVICES.length - 1
                  ? '1px solid rgba(12, 12, 12, 0.14)'
                  : undefined,
            }}
          >
            <span
              className="shrink-0 font-black leading-none tracking-tight text-[#0C0C0C]/90 sm:w-24 md:w-28"
              style={{ fontSize: 'clamp(2rem, 5vw, 68px)' }}
            >
              {service.number}
            </span>

            <div className="flex flex-col gap-1.5 sm:gap-2">
              <h3
                className="font-semibold uppercase leading-tight tracking-wide text-[#0C0C0C]"
                style={{ fontSize: 'clamp(1.05rem, 1.8vw, 1.5rem)' }}
              >
                {service.name}
              </h3>
              <p
                className="max-w-2xl font-light leading-relaxed text-[#0C0C0C]/65"
                style={{ fontSize: 'clamp(0.85rem, 1.15vw, 1rem)' }}
              >
                {service.description}
              </p>
            </div>
          </FadeIn>
        ))}
      </div>
    </section>
  );
};
