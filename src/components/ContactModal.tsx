import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Mail,
  Phone,
  MapPin,
  Linkedin,
  Github,
  Globe,
  Copy,
  Check,
  Award,
  Briefcase,
} from 'lucide-react';

interface ContactModalProps {
  open: boolean;
  onClose: () => void;
}

export const ContactModal: React.FC<ContactModalProps> = ({ open, onClose }) => {
  const [copied, setCopied] = useState<string | null>(null);
  const [copyError, setCopyError] = useState<string | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const onCloseRef = useRef(onClose);
  const copyTimerRef = useRef<number | null>(null);

  onCloseRef.current = onClose;

  useEffect(() => {
    if (!open) return;

    const previousFocus = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    const focusFrame = window.requestAnimationFrame(() => closeButtonRef.current?.focus());
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.stopPropagation();
        onCloseRef.current();
        return;
      }

      if (event.key !== 'Tab' || !dialogRef.current) return;
      const focusable = dialogRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.cancelAnimationFrame(focusFrame);
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = previousOverflow;
      if (previousFocus?.isConnected) previousFocus.focus();
    };
  }, [open]);

  useEffect(
    () => () => {
      if (copyTimerRef.current !== null) window.clearTimeout(copyTimerRef.current);
    },
    [],
  );

  const copyText = async (key: string, value: string) => {
    try {
      if (!navigator.clipboard) throw new Error('Clipboard access is unavailable');
      await navigator.clipboard.writeText(value);
      setCopyError(null);
      setCopied(key);
      if (copyTimerRef.current !== null) window.clearTimeout(copyTimerRef.current);
      copyTimerRef.current = window.setTimeout(() => setCopied(null), 1800);
    } catch {
      setCopyError(key);
      setCopied(null);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4"
        >
          <motion.div
            ref={dialogRef}
            initial={{ opacity: 0, scale: 0.94, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 20 }}
            transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="contact-dialog-title"
            className="relative max-h-[calc(100dvh-2rem)] w-full max-w-lg overflow-y-auto overscroll-contain rounded-[32px] border-2 border-[#D7E2EA]/40 bg-[#0C0C0C] p-6 text-[#D7E2EA] shadow-2xl sm:p-8"
          >
            <button
              ref={closeButtonRef}
              type="button"
              onClick={onClose}
              aria-label="Close contact dialog"
              className="absolute right-5 top-5 flex h-10 w-10 items-center justify-center rounded-full border border-[#D7E2EA]/25 text-[#D7E2EA] transition-colors hover:bg-[#D7E2EA]/10"
            >
              <X className="h-5 w-5" />
            </button>

            <p className="text-xs uppercase tracking-[0.25em] text-[#BBCCD7]/70">
              Let&apos;s Collaborate
            </p>
            <h3 id="contact-dialog-title" className="hero-heading mt-1 text-3xl font-black uppercase leading-none tracking-tight sm:text-4xl">
              Jayed Jaman Seen
            </h3>
            <p className="mt-2 text-sm font-light text-[#D7E2EA]/75">
              WordPress Web Development &amp; AI Tools Specialist
            </p>

            <div className="mt-6 space-y-3">
              <div className="flex items-center justify-between rounded-2xl border border-[#D7E2EA]/15 bg-white/[0.03] px-4 py-3">
                <a
                  href="mailto:thunderseen@gmail.com"
                  className="flex items-center gap-3 text-sm sm:text-base hover:text-white transition-colors"
                >
                  <Mail className="h-4 w-4 text-[#BBCCD7]" />
                  <span>thunderseen@gmail.com</span>
                </a>
                <button
                  type="button"
                  aria-label={copied === 'email' ? 'Email copied' : 'Copy email address'}
                  onClick={() => void copyText('email', 'thunderseen@gmail.com')}
                  className="rounded-lg p-1.5 text-[#BBCCD7]/80 hover:bg-white/10 hover:text-white transition-colors"
                  title="Copy email"
                >
                  {copied === 'email' ? (
                    <Check className="h-4 w-4 text-emerald-400" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </button>
              </div>

              <div className="flex items-center justify-between rounded-2xl border border-[#D7E2EA]/15 bg-white/[0.03] px-4 py-3">
                <a
                  href="https://wa.me/8801307758119"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-sm sm:text-base hover:text-white transition-colors"
                >
                  <Phone className="h-4 w-4 text-[#BBCCD7]" />
                  <span>+880 1307-758119 (Phone / WhatsApp)</span>
                </a>
                <button
                  type="button"
                  aria-label={copied === 'phone' ? 'Phone number copied' : 'Copy phone number'}
                  onClick={() => void copyText('phone', '+880 1307-758119')}
                  className="rounded-lg p-1.5 text-[#BBCCD7]/80 hover:bg-white/10 hover:text-white transition-colors"
                  title="Copy phone number"
                >
                  {copied === 'phone' ? (
                    <Check className="h-4 w-4 text-emerald-400" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </button>
              </div>
              <p className="sr-only" aria-live="polite">
                {copied ? 'Copied to clipboard.' : copyError ? 'Clipboard access failed.' : ''}
              </p>

              <div className="flex items-center gap-3 rounded-2xl border border-[#D7E2EA]/15 bg-white/[0.03] px-4 py-3 text-sm sm:text-base text-[#D7E2EA]/80">
                <MapPin className="h-4 w-4 text-[#BBCCD7]" />
                <span>Barishal, Bangladesh • Remote Worldwide</span>
              </div>
            </div>

            <div className="mt-5 flex flex-wrap gap-2.5">
              <a
                href="https://www.fiverr.com/jayedjaman_seen?public_mode=true"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-emerald-400/40 bg-emerald-400/10 px-4 py-2 text-xs uppercase tracking-widest text-emerald-200 hover:bg-emerald-400/20 hover:text-white transition-colors"
              >
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                Fiverr
              </a>
              <a
                href="https://www.freelancer.com.bd/u/jayedjamans"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-sky-400/40 bg-sky-400/10 px-4 py-2 text-xs uppercase tracking-widest text-sky-200 hover:bg-sky-400/20 hover:text-white transition-colors"
              >
                <Briefcase className="h-3.5 w-3.5 text-sky-300" />
                Freelancer
              </a>
              <a
                href="https://x.com/JayedJamanSeen"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-[#D7E2EA]/35 px-4 py-2 text-xs uppercase tracking-widest hover:bg-[#D7E2EA]/10 transition-colors"
              >
                <svg
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                  className="h-3.5 w-3.5 fill-current"
                >
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
                X
              </a>
              <a
                href="https://www.linkedin.com/in/jayed-jaman-seen-b540b8334/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-[#D7E2EA]/35 px-4 py-2 text-xs uppercase tracking-widest hover:bg-[#D7E2EA]/10 transition-colors"
              >
                <Linkedin className="h-3.5 w-3.5" />
                LinkedIn
              </a>
              <a
                href="https://github.com/JJSEEN"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-[#D7E2EA]/35 px-4 py-2 text-xs uppercase tracking-widest hover:bg-[#D7E2EA]/10 transition-colors"
              >
                <Github className="h-3.5 w-3.5" />
                GitHub
              </a>
              <a
                href="https://student-id-portal-1.onrender.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-[#D7E2EA]/35 px-4 py-2 text-xs uppercase tracking-widest hover:bg-[#D7E2EA]/10 transition-colors"
              >
                <Globe className="h-3.5 w-3.5" />
                Live Portal
              </a>
            </div>

            <div className="mt-6 flex items-center gap-2 border-t border-[#D7E2EA]/15 pt-4 text-xs text-[#D7E2EA]/60">
              <Award className="h-4 w-4 shrink-0 text-[#BBCCD7]" />
              <span>
                BCC AI Certified • B.Sc. CSE (Trust University) • DYD 600h ICT
                Class Representative • IELTS 6.5
              </span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
