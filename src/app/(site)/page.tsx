// src/app/(site)/page.tsx
"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle2, AlertCircle } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { motion, useScroll, useTransform } from "framer-motion";
import ImageReveal from "@/components/ui/ImageReveal";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { useLoading } from "@/components/PageTransition";
import { getActualites, getLiveStatus } from "@/lib/api";

import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin, SplitText);

interface Actualite {
  id: string | number;
  titre: string;
  image_url?: string;
  date_evenement?: string;
  date_publication?: string;
  date?: string;
}

interface LiveStatus {
  is_active: boolean;
  video_url: string;
  titre?: string;
}

// Fonction utilitaire pour formater la date
const formatDate = (dateString: string | undefined) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "";
  return date.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
};

// Fonction pour extraire l'ID de la vidéo YouTube
const extractYouTubeId = (url: string): string | null => {
  if (!url) return null;

  const patterns = [
    /youtube\.com\/watch\?v=([a-zA-Z0-9_-]+)/,
    /youtu\.be\/([a-zA-Z0-9_-]+)/,
    /youtube\.com\/embed\/([a-zA-Z0-9_-]+)/,
    /youtube\.com\/live\/([a-zA-Z0-9_-]+)/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) return match[1];
  }
  return null;
};

export default function Home() {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [actualites, setActualites] = useState<Actualite[]>([]);
  const [live, setLive] = useState<LiveStatus | null>(null);
  const [loadingNews, setLoadingNews] = useState(true);
  const [formStatus, setFormStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [showAlert, setShowAlert] = useState(false);
  const alertRef = useRef<HTMLDivElement>(null);
  const { isLoading: isGlobalLoading } = useLoading();

  // Gestion de l'alerte Apple style
  useEffect(() => {
    if (showAlert) {
      // Animation d'entrée
      gsap.fromTo(alertRef.current,
        { y: -100, opacity: 0, scale: 0.9 },
        { y: 20, opacity: 1, scale: 1, duration: 0.6, ease: "expo.out" }
      );

      // Auto-fermeture après 3s
      const timer = setTimeout(() => {
        gsap.to(alertRef.current, {
          y: -100,
          opacity: 0,
          scale: 0.9,
          duration: 0.5,
          ease: "expo.in",
          onComplete: () => setShowAlert(false)
        });
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [showAlert]);

  // Récupérer les actualités et le live au chargement
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [newsData, liveData] = await Promise.all([
          getActualites(),
          getLiveStatus()
        ]);
        setActualites(newsData.slice(0, 3));
        setLive(liveData);
      } catch (error) {
        console.error("Erreur lors du chargement", error);
      } finally {
        setLoadingNews(false);
      }
    };
    fetchData();
  }, []);

  const heroRef = useRef<HTMLDivElement>(null);
  const heroBgRef = useRef<HTMLDivElement>(null);
  const heroOverlayRef = useRef<HTMLDivElement>(null);
  const heroParaRef = useRef<HTMLParagraphElement>(null);
  const heroBtnsRef = useRef<HTMLDivElement>(null);
  const scrollTopBtnRef = useRef<HTMLButtonElement>(null);
  const aboutSectionRef = useRef<HTMLElement>(null);
  const aboutBadgeRef = useRef<HTMLDivElement>(null);
  const aboutItemsRef = useRef<(HTMLDivElement | null)[]>([]);
  const impactSectionRef = useRef<HTMLElement>(null);
  const impactCardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const activitiesSectionRef = useRef<HTMLElement>(null);
  const activityItemsRef = useRef<(HTMLDivElement | null)[]>([]);
  const mediaSectionRef = useRef<HTMLElement>(null);
  const newsSectionRef = useRef<HTMLElement>(null);
  const newsCardsRef = useRef<(HTMLAnchorElement | null)[]>([]);
  const contactSectionRef = useRef<HTMLElement>(null);
  const cleanupRef = useRef<(() => void) | null>(null);

  // ─── PARALLAX HERO ───────────────────────────────────────────────────────
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "16%"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.55], [1, 0.12]);

  // ─── SCROLL TO TOP BUTTON ────────────────────────────────────────────────
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const threshold = window.innerHeight * 0.5;
      if (scrollY > threshold && !showScrollTop) {
        setShowScrollTop(true);
        gsap.fromTo(scrollTopBtnRef.current,
          { scale: 0, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.4, ease: "back.out(1.7)" }
        );
      } else if (scrollY <= threshold && showScrollTop) {
        setShowScrollTop(false);
        gsap.to(scrollTopBtnRef.current, {
          scale: 0,
          opacity: 0,
          duration: 0.3,
          ease: "power2.in"
        });
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [showScrollTop]);

  const scrollToTop = () => {
    gsap.to(window, {
      duration: 0.8,
      scrollTo: { y: 0 },
      ease: "power2.inOut"
    });
  };

  // ─── ANIMATIONS GSAP ─────────────────────────────────────────────────────
  useEffect(() => {
    let isActive = true;

    const initTimer = window.setTimeout(() => {
      if (!isActive) return;

      // Store event listeners for cleanup
      const eventListeners: Array<{ element: HTMLElement; type: string; listener: (event: Event) => void }> = [];

      const ctx = gsap.context(() => {
      // HERO
      if (heroRef.current) {
        const heroTl = gsap.timeline({ defaults: { ease: "power4.out" } });
        if (heroOverlayRef.current) {
          heroTl.from(heroOverlayRef.current, { opacity: 0, duration: 0.8 }, 0);
        }

        heroTl.set(heroRef.current, { opacity: 1 }, 0);
        if (heroParaRef.current) {
          heroTl.from(heroParaRef.current, { opacity: 0, y: 30, duration: 0.9 }, "-=0.4");
        }
        if (heroBtnsRef.current) {
          heroTl.from(heroBtnsRef.current, { opacity: 0, y: 24, duration: 0.8 }, "-=0.5");
        }
      }

      if (heroBgRef.current) {
        gsap.set(heroBgRef.current, {
          willChange: "transform",
          force3D: true,
          backfaceVisibility: "hidden",
        });
      }

      // IMPACT
      impactCardsRef.current.forEach((card, i) => {
        if (!card) return;
        const valueEl = card.querySelector(".stat-value");
        if (valueEl) {
          const rawText = valueEl.textContent?.trim() || "";
          const prefix = rawText.startsWith("+") ? "+" : "";
          const num = parseInt(rawText.replace(/\D/g, ""), 10);
          if (!isNaN(num)) {
            const obj = { val: 0 };
            gsap.to(obj, {
              val: num, duration: 1.8, ease: "power2.out", delay: i * 0.1 + 0.3,
              scrollTrigger: { trigger: card, start: "top 80%", once: true },
              onUpdate: () => { if (valueEl) valueEl.textContent = prefix + Math.round(obj.val); }
            });
          }
        }
      });

      // ACTIVITIES
      activityItemsRef.current.forEach((el, i) => {
        if (!el) return;
        const dir = i % 2 === 0 ? -60 : 60;
        gsap.from(el, { opacity: 0, x: dir, duration: 1.1, ease: "expo.out", scrollTrigger: { trigger: el, start: "top 82%" } });
        const bigNum = el.querySelector(".big-num");
        if (bigNum) {
          gsap.from(bigNum, { opacity: 0, scale: 0.6, duration: 1, ease: "back.out(1.4)", scrollTrigger: { trigger: el, start: "top 80%" } });
        }
      });

      // NEWS CARDS - Just 3D effect, visibility handled by ScrollReveal
      newsCardsRef.current.forEach((card) => {
        if (!card) return;
        const onMove = (e: MouseEvent) => {
          try {
            if (card && card.getBoundingClientRect) {
              const rect = card.getBoundingClientRect();
              const x = (e.clientX - rect.left) / rect.width - 0.5;
              const y = (e.clientY - rect.top) / rect.height - 0.5;
              gsap.to(card, { rotateY: x * 8, rotateX: -y * 8, transformPerspective: 800, ease: "power1.out", duration: 0.4 });
            }
          } catch (_e) {
            // Silently handle errors in mousemove
          }
        };
        const onLeave = () => {
          try {
            if (card) {
              gsap.to(card, { rotateY: 0, rotateX: 0, duration: 0.6, ease: "power2.out" });
            }
          } catch (_e) {
            // Silently handle errors in mouseleave
          }
        };
        if (card && typeof card.addEventListener === 'function') {
          card.addEventListener("mousemove", onMove);
          card.addEventListener("mouseleave", onLeave);
          eventListeners.push({ element: card, type: "mousemove", listener: onMove as EventListener });
          eventListeners.push({ element: card, type: "mouseleave", listener: onLeave as EventListener });
        }
      });

      // CONTACT
      // Géré uniquement par ScrollReveal pour éviter que le contenu reste caché
      // lors d'une navigation directe vers #contact.

      // MAGNETIC BUTTONS
      document.querySelectorAll<HTMLElement>(".btn-magnetic").forEach((btn) => {
        if (!btn) return;
        const onMove = (e: MouseEvent) => {
          try {
            if (btn && btn.getBoundingClientRect) {
              const rect = btn.getBoundingClientRect();
              const dx = e.clientX - (rect.left + rect.width / 2);
              const dy = e.clientY - (rect.top + rect.height / 2);
              gsap.to(btn, { x: dx * 0.35, y: dy * 0.35, duration: 0.4, ease: "power2.out" });
            }
          } catch (_e) {
            // Silently handle errors
          }
        };
        const onLeave = () => {
          try {
            if (btn) {
              gsap.to(btn, { x: 0, y: 0, duration: 0.7, ease: "elastic.out(1, 0.4)" });
            }
          } catch (_e) {
            // Silently handle errors
          }
        };
        if (typeof btn.addEventListener === 'function') {
          btn.addEventListener("mousemove", onMove);
          btn.addEventListener("mouseleave", onLeave);
          eventListeners.push({ element: btn, type: "mousemove", listener: onMove as EventListener });
          eventListeners.push({ element: btn, type: "mouseleave", listener: onLeave as EventListener });
        }
      });

      // SCROLL PROGRESS
      const progressBar = document.querySelector(".scroll-progress");
      if (progressBar) {
        gsap.to(".scroll-progress", { scaleX: 1, ease: "none", scrollTrigger: { trigger: "body", start: "top top", end: "bottom bottom", scrub: true } });
      }

      });

      const cleanup = () => {
        eventListeners.forEach(({ element, type, listener }) => {
          try {
            if (element && typeof element.removeEventListener === 'function') {
              element.removeEventListener(type, listener);
            }
          } catch (e) {
            console.warn('Error removing event listener:', e);
          }
        });
        ScrollTrigger.getAll().forEach(trigger => trigger.kill());
        ctx.revert();
      };

      cleanupRef.current = cleanup;
    }, 400);

    return () => {
      isActive = false;
      window.clearTimeout(initTimer);
      cleanupRef.current?.();
      cleanupRef.current = null;
    };
  }, []);

  // Gestion de l'envoi du formulaire de contact
  const handleContactSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget; // On capture le formulaire au début car e.currentTarget devient null après un await
    setFormStatus('sending');

    const formData = new FormData(form);
    const data = {
      nom: formData.get('nom'),
      email: formData.get('email'),
      telephone: formData.get('telephone'),
      message: formData.get('message')
    };

    try {
      const API_URL = 'http://admin-memfa.site.je/admin/save_message.php';

      const res = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(data),
        mode: 'cors',
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error('Erreur HTTP:', res.status, errorText);
        throw new Error(`Erreur serveur: ${res.status}`);
      }

      const result = await res.json();

      if (result.success) {
        setFormStatus('success');
        setShowAlert(true);
        form.reset();
        setTimeout(() => setFormStatus('idle'), 5000);
      } else {
        setFormStatus('error');
        setShowAlert(true);
        setTimeout(() => setFormStatus('idle'), 5000);
      }
    } catch (error) {
      console.error('Erreur fetch:', error);
      setFormStatus('error');
      setShowAlert(true);
      setTimeout(() => setFormStatus('idle'), 5000);
    }
  };

  return (
    <div className="min-h-screen bg-white">

      {/* APPLE STYLE ALERT */}
      {showAlert && (
        <div className="fixed top-0 left-0 right-0 z-[1001] flex justify-center pointer-events-none">
          <div
            ref={alertRef}
            className="mt-8 px-6 py-3 bg-white/80 backdrop-blur-xl border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.12)] rounded-2xl flex items-center gap-4 min-w-[300px] pointer-events-auto"
          >
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${formStatus === 'success' ? 'bg-green-500' : 'bg-red-500'}`}>
              {formStatus === 'success' ? (
                <CheckCircle2 className="text-white" size={24} />
              ) : (
                <AlertCircle className="text-white" size={24} />
              )}
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-black">
                {formStatus === 'success' ? 'Message envoyé' : 'Erreur d&apos;envoi'}
              </span>
              <span className="text-xs text-gray-500">
                {formStatus === 'success'
                  ? 'Votre message a bien été transmis.'
                  : 'Veuillez réessayer plus tard.'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* SCROLL PROGRESS BAR */}
      <div className="fixed top-0 left-0 right-0 z-[999] h-[3px] bg-gray-100">
        <div className="scroll-progress h-full bg-gradient-to-r from-[#1a0f2b] to-[#d97706] origin-left" style={{ transform: "scaleX(0)" }} />
      </div>

      {/* SCROLL TO TOP BUTTON */}
      <button
        ref={scrollTopBtnRef}
        onClick={scrollToTop}
        className="fixed bottom-8 right-8 z-[998] w-12 h-12 bg-[#1a0f2b] text-white rounded-full shadow-lg hover:bg-[#d97706] transition-colors duration-300 flex items-center justify-center opacity-0 scale-0"
        aria-label="Remonter en haut de la page"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
        </svg>
      </button>

      {/* ── HERO ───────────────────────────────────────────────────────── */}
      <section
        ref={heroRef}
        className="relative min-h-screen w-full flex flex-col items-center justify-center text-center px-4 sm:px-6 pt-28 pb-10 md:pt-32 md:pb-12 bg-white overflow-hidden"
        style={{ opacity: 0, position: 'relative' }}
      >
        {/* Image de fond avec Parallaxe */}
        <motion.div
          ref={heroBgRef}
          className="absolute -inset-[6%] z-0 bg-[url('/hero.png')] bg-cover bg-center bg-no-repeat"
          style={{ y: bgY, scale: 1.06 }}
        />

        <div ref={heroOverlayRef} className="hero-bg-overlay absolute inset-0 bg-white/80 z-[1]" aria-hidden="true" />

        <motion.div
          className="relative z-[2] mx-auto flex min-h-full w-full max-w-5xl -translate-y-6 flex-col items-center justify-center md:-translate-y-8"
          style={{ opacity: contentOpacity }}
        >
          <h1 className="font-serif text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold text-[#1a0f2b] tracking-tight leading-[1.1] mb-4 px-2">
            <div className="overflow-hidden py-1">
              <motion.span
                initial={{ y: "110%", opacity: 0 }}
                animate={!isGlobalLoading ? { y: 0, opacity: 1 } : { y: "110%", opacity: 0 }}
                transition={{
                  duration: 1.2,
                  delay: 0.2,
                  ease: [0.33, 1, 0.68, 1],
                }}
                className="block"
              >
                Mission Évangélique
              </motion.span>
            </div>
            <div className="overflow-hidden py-1">
              <motion.span
                initial={{ y: "110%", opacity: 0 }}
                animate={!isGlobalLoading ? { y: 0, opacity: 1 } : { y: "110%", opacity: 0 }}
                transition={{
                  duration: 1.2,
                  delay: 0.35,
                  ease: [0.33, 1, 0.68, 1],
                }}
                className="block not-italic font-bold"
              >
                Maranatha
              </motion.span>
            </div>
          </h1>
          <div className="overflow-hidden py-1">
            <motion.div
              initial={{ y: "110%", opacity: 0 }}
              animate={!isGlobalLoading ? { y: 0, opacity: 1 } : { y: "110%", opacity: 0 }}
              transition={{
                duration: 1.2,
                delay: 0.5,
                ease: [0.33, 1, 0.68, 1],
              }}
              className="text-xl sm:text-2xl text-[#d97706] font-semibold mb-6 italic"
            >
              Foi et Action
            </motion.div>
          </div>
          <p ref={heroParaRef} className="text-base sm:text-lg md:text-2xl font-medium text-gray-500 max-w-3xl mx-auto mb-10 md:mb-12 px-4 italic">
            « Afin que vous soyez irréprochables et purs, des enfants de Dieu irrépréhensibles au milieu d&apos;une génération perverse et corrompue, parmi laquelle vous brillez comme des luminaires dans le monde. »
            <br />
            <span className="text-sm font-semibold text-[#d97706] not-italic mt-4 block">Philippiens 2:15</span>
          </p>
          <div ref={heroBtnsRef} className="flex flex-col sm:flex-row gap-5 items-center justify-center pb-4 sm:pb-0">
            <Button className="btn-magnetic bg-black text-white font-semibold h-14 px-10 rounded-full text-lg shadow-lg">
              Découvrir
            </Button>
            <Button className="btn-magnetic bg-white text-black border border-black font-semibold h-14 px-10 rounded-full text-lg shadow-lg">
              Contactez-nous
            </Button>
          </div>
        </motion.div>
      </section>

      {/* ── À PROPOS ─────────────────────────────────────────────────────── */}
      <section ref={aboutSectionRef} id="a-propos" className="py-24 md:py-32 bg-white w-full overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 sm:px-12">
          <ScrollReveal direction="up" className="text-center mb-16">
            <h2 className="text-sm font-bold uppercase tracking-[0.3em] text-memfa-or mb-8">Notre Identité</h2>
          </ScrollReveal>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <ScrollReveal direction="left" className="relative flex justify-center">
              <div className="w-full max-w-md lg:max-w-none relative">
                <ImageReveal
                  src="/hero.png" // Utilisation d'une image existante pour éviter le 404
                  alt="Maranatha Vision"
                  className="shadow-2xl transition-transform hover:scale-[1.02] duration-500"
                />
                <div ref={aboutBadgeRef} className="absolute -bottom-6 -left-4 md:-bottom-10 md:-left-10 bg-memfa-violet p-6 md:p-8 rounded-3xl shadow-xl border border-memfa-or/20 z-20">
                  <p className="text-memfa-or font-black text-xl md:text-2xl tracking-tight leading-tight">Objectif <br /> Nord</p>
                  <p className="text-white/60 text-[8px] md:text-[10px] font-bold uppercase tracking-widest mt-2">Zones non atteintes</p>
                </div>
              </div>
            </ScrollReveal>
            <ScrollReveal direction="right" delay={0.2} className="space-y-8 text-center lg:text-left">
              <div>
                <h3 className="font-serif text-3xl md:text-5xl text-memfa-violet leading-tight italic">
                  Une mission pour restaurer la <br />
                  <span className="not-italic font-bold">dignité de l&apos;Évangile.</span>
                </h3>
              </div>
              <p className="text-base md:text-lg text-gray-500 leading-relaxed font-medium">
                <span className="font-bold text-[#1a1a1a]">La Mission Évangélique Maranatha Foi et Action (MEMFA) </span> est portée par une conviction profonde : la foi doit s&apos;accompagner d&apos;une action concrète et exemplaire. Nous nous engageons à présenter le message de l&apos;Évangile avec toute la dignité et la rigueur qu&apos;il mérite.
              </p>
              <div className="grid gap-6">
                {[
                  { num: "01", title: "L’Église", desc: "Le réseau de nos assembles locales pour former des disciples et mobiliser les bâtisseurs." },
                  { num: "02", title: "Le Centre Holistique", desc: "Écoles, centres de santé et fermes agro-pastorales pour améliorer le quotidien socio-économique." },
                  { num: "03", title: "La Station Missionnaire", desc: "Piloter les implantations dans les grandes villes et villages pour la moisson finale." },
                ].map((item, i) => (
                  <div key={i} ref={(el) => {if (el) aboutItemsRef.current[i] = el;}} className="flex gap-6 p-6 rounded-3xl border border-gray-50 hover:bg-gray-50 transition-colors">
                    <div className="text-memfa-or font-serif italic text-2xl">{item.num}</div>
                    <div>
                      <h4 className="font-bold text-memfa-violet uppercase text-xs tracking-widest mb-2">{item.title}</h4>
                      <p className="text-gray-400 text-sm">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ── IMPACT STATS ─────────────────────────────────────────────────── */}
      <section ref={impactSectionRef} id="impact" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 sm:px-12">
          <ScrollReveal direction="up" className="mb-16 text-center">
            <h2 className="text-sm font-bold uppercase tracking-[0.3em] text-memfa-or mb-4">Notre Impact</h2>
            <h3 className="font-serif text-4xl md:text-5xl text-memfa-violet italic">
              Une œuvre qui brille <br />
              <span className="not-italic font-bold">par ses fruits.</span>
            </h3>
          </ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { value: "14", label: "Ans d'existence", desc: "Une consécration absolue pour le rassemblement des bâtisseurs.", icon: "M6 2a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V4a2 2 0 00-2-2H6zm0 4h12M8 8V6m8 2V6" },
              { value: "+150", label: "Membres Actifs", desc: "Une famille unie marchant dans l'amour fraternel et l'unité.", icon: "M17 20h5v-2a4 4 0 00-4-4h-1.5a4.5 4.5 0 10-9 0H4a4 4 0 00-4 4v2h5m7-16a4 4 0 110 8 4 4 0 010-8z" },
              { value: "3", label: "Structures Clés", desc: "L'Église, la Station Missionnaire et le Centre Holistique.", icon: "M4 21h16M4 10h16M6 4h12v6H6V4zm0 10h4v7H6v-7zm8 0h4v7h-4v-7z" },
              { value: "1", label: "Vision Nord", desc: "Engagement résolu vers les zones non atteintes du pays.", icon: "M12 2a10 10 0 100 20 10 10 0 000-20zm1.5 5.5l4.5 2.1-2.1 4.5-4.5-2.1 2.1-4.5z" },
            ].map((stat, i) => (
              <ScrollReveal key={i} direction="up" delay={i * 0.1}>
                <div ref={(el) => {if (el) impactCardsRef.current[i] = el;}} className="group p-8 rounded-4xl border border-gray-50 bg-gray-50/30 hover:bg-white hover:shadow-2xl hover:shadow-memfa-violet/5 transition-all duration-500 h-full">
                  <div className="flex items-center justify-between mb-4">
                    <div className="stat-value text-5xl font-black text-memfa-or tracking-tighter group-hover:scale-110 transition-transform duration-500 origin-left">{stat.value}</div>
                    <div className="w-12 h-12 rounded-2xl bg-white border border-gray-200 flex items-center justify-center shadow-sm">
                      <svg className="w-6 h-6 text-memfa-violet" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={stat.icon} />
                      </svg>
                    </div>
                  </div>
                  <h4 className="text-memfa-violet font-bold uppercase text-xs tracking-widest mb-3">{stat.label}</h4>
                  <p className="text-gray-400 text-sm leading-relaxed font-medium">{stat.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── ACTIVITÉS ────────────────────────────────────────────────────── */}
      <section ref={activitiesSectionRef} id="activites" className="py-32 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-12">
          <div className="text-center mb-24">
            <h2 className="text-sm font-bold uppercase tracking-[0.3em] text-memfa-or mb-4">Nos Activités</h2>
            <h3 className="font-serif text-4xl md:text-6xl text-memfa-violet italic leading-tight">
              Vivre la foi au quotidien <br />
              <span className="not-italic font-bold text-black">par l&apos;enseignement et la prière.</span>
            </h3>
          </div>
          <div className="relative">
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-px bg-gray-100 hidden lg:block" />
            <div className="space-y-24">
              {[
                { title: "Culte Dominical", desc: "Louange, adoration et enseignement profond pour recevoir la révélation biblique en famille.", time: "Dimanche 08H30 — 11H30", num: "01", color: "memfa-or", reverse: false },
                { title: "Enseignement Matinal", desc: "Plonger dans la découverte des Écritures avec des enseignements pratiques et inspirants.", time: "Dimanche 07H45 — 08H30", num: "02", color: "memfa-violet", reverse: true },
                { title: "École de disciples", desc: "Grandir dans votre foi et marcher dans les pas du Seigneur à travers des études bibliques approfondies.", time: "Jeudi 18H30 — 20H00", num: "03", color: "memfa-or", reverse: false },
                { title: "Culte du Mercredi", desc: "Moment de ressourcement en milieu de semaine avec étude biblique et prière d'intercession collective.", time: "Mercredi 18H30 — 20H00", num: "04", color: "memfa-violet", reverse: true },
              ].map((item, i) => (
                <div key={i} ref={(el) => {if (el) activityItemsRef.current[i] = el;}} className={`relative flex flex-col ${item.reverse ? "lg:flex-row-reverse" : "lg:flex-row"} items-center group`}>
                  <div className={`flex-1 ${item.reverse ? "lg:text-left lg:pl-20" : "lg:text-right lg:pr-20"} mb-8 lg:mb-0`}>
                    <h4 className="text-2xl font-bold text-[#1a0f2b] mb-4">{item.title}</h4>
                    <p className="text-gray-500 font-medium leading-relaxed max-w-lg">{item.desc}</p>
                    <div className={`mt-4 text-${item.color} font-black tracking-widest uppercase text-xs`}>{item.time}</div>
                  </div>
                  <div className={`w-12 h-12 bg-white border-4 border-${item.color} rounded-full z-10 flex items-center justify-center shadow-xl group-hover:scale-125 transition-transform duration-500`}>
                    <div className={`w-2 h-2 bg-${item.color} rounded-full`} />
                  </div>
                  <div className={`flex-1 ${item.reverse ? "lg:pr-20 text-right" : "lg:pl-20"} hidden lg:block`}>
                    <div className={`big-num text-[100px] font-black text-${item.color} select-none`}>{item.num}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── MÉDIA AVEC LIVE DYNAMIQUE ───────────────────────────────────── */}
      <section ref={mediaSectionRef} id="multimedia" className="py-24 md:py-32 bg-[#fafafa]">
        <div className="max-w-7xl mx-auto px-6 sm:px-12">
          <ScrollReveal direction="up" className="text-center mb-16">
            <h2 className="text-sm font-bold uppercase tracking-[0.3em] text-memfa-or mx-auto">Média & Ressources</h2>
          </ScrollReveal>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <ScrollReveal direction="left" className="media-left relative group">
              <div className="aspect-video bg-gray-200 rounded-[40px] overflow-hidden shadow-2xl relative">
                {live && live.is_active && live.video_url ? (
                  <>
                    {live.video_url.includes('youtube.com') || live.video_url.includes('youtu.be') ? (
                      (() => {
                        const videoId = extractYouTubeId(live.video_url);
                        if (videoId) {
                          return (
                            <iframe
                              src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&rel=0&modestbranding=1&playsinline=1`}
                              className="absolute inset-0 w-full h-full"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                              allowFullScreen
                              title="Live Stream"
                              loading="lazy"
                            />
                          );
                        }
                        return null;
                      })()
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center bg-gray-800 p-6">
                        <div className="text-center">
                          <p className="text-white text-lg mb-4 font-medium">{live.titre || "Live disponible"}</p>
                          <a
                            href={live.video_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 bg-[#1877F2] hover:bg-[#166fe5] text-white px-6 py-3 rounded-full font-medium transition-all"
                          >
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/>
                            </svg>
                            Regarder sur Facebook
                          </a>
                        </div>
                      </div>
                    )}
                    <div className="absolute top-6 left-6 flex items-center gap-2 bg-red-600 px-3 py-1 rounded-full animate-pulse z-10">
                      <div className="w-2 h-2 bg-white rounded-full" />
                      <span className="text-[10px] font-black text-white uppercase tracking-widest">En Direct</span>
                    </div>
                  </>
                ) : (
                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center group-hover:bg-black/10 transition-all">
                    <div className="w-20 h-20 bg-memfa-or rounded-full flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform">
                      <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                  </div>
                )}
              </div>
            </ScrollReveal>
            <ScrollReveal direction="right" delay={0.2} className="media-right space-y-8">
              <h3 className="font-serif text-4xl text-memfa-violet italic leading-tight">
                Accédez à la <span className="not-italic font-black text-black">Bibliothèque Spirituelle.</span>
              </h3>
              <p className="text-gray-500 font-medium leading-relaxed">
                Ne manquez aucun moment de grâce. Retrouvez nos cultes en direct, nos enseignements audio et notre bibliothèque virtuelle pour nourrir votre foi.
              </p>
              <Link href="/media" className="btn-magnetic bg-memfa-violet text-white px-10 py-5 rounded-full font-bold text-xs uppercase tracking-[0.2em] hover:bg-black transition-all shadow-xl inline-flex items-center justify-center w-fit duration-300">
                Ouvrir l&apos;Espace Média
              </Link>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ── ACTUALITÉS DYNAMIQUES ───────────────────────────────────────── */}
      <section ref={newsSectionRef} id="actualites" className="py-24 md:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6 sm:px-12">
          <ScrollReveal direction="up" className="flex flex-col items-center text-center mb-16 gap-4">
            <div>
              <h2 className="text-sm font-bold uppercase tracking-[0.3em] text-memfa-or mb-4">Mises à jour</h2>
              <h3 className="text-4xl font-black text-memfa-violet tracking-tighter uppercase">Dernières Actualités</h3>
            </div>
            <Link href="/media" className="text-xs font-black uppercase tracking-[0.2em] text-[#1a0f2b] border-b-2 border-memfa-or/20 hover:border-memfa-or transition-all pb-1">
              Voir tout →
            </Link>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {loadingNews ? (
              [1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-[16/10] bg-gray-200 rounded-[32px] mb-6"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/3 mb-3"></div>
                  <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                </div>
              ))
            ) : actualites.length > 0 ? (
              actualites.map((actu: Actualite, i: number) => {
                const displayDate = actu.date_evenement || actu.date_publication || actu.date;

                return (
                  <ScrollReveal key={actu.id} direction="up" delay={i * 0.1}>
                    <Link
                      href={`/media?id=${actu.id}`}
                      className="group cursor-pointer block"
                      style={{ transformStyle: "preserve-3d" }}
                      ref={(el) => {if (el) newsCardsRef.current[i] = el;}}
                    >
                      <div className="aspect-[16/10] bg-gray-100 rounded-[32px] mb-6 overflow-hidden border border-gray-50 relative">
                        {actu.image_url ? (
                          <img
                            src={`http://admin-memfa.site.je/public/${actu.image_url}`}
                            alt={actu.titre}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-100 group-hover:scale-105 transition-transform duration-700" />
                        )}
                      </div>
                      <p className="text-[10px] font-bold text-[#1a0f2b] uppercase tracking-[0.2em] mb-3">
                        Événement • {formatDate(displayDate) || "Date non spécifiée"}
                      </p>
                      <h4 className="font-bold text-lg text-memfa-violet group-hover:text-memfa-or transition-colors leading-snug line-clamp-2">
                        {actu.titre}
                      </h4>
                    </Link>
                  </ScrollReveal>
                );
              })
            ) : (
              <p className="col-span-3 text-center text-gray-500">Aucune actualité disponible pour le moment.</p>
            )}
          </div>
        </div>
      </section>

      {/* ── CONTACT ─────────────────────────────────────────────────────── */}
      <section ref={contactSectionRef} id="contact" className="py-24 bg-[#fafafa]">
        <div className="max-w-7xl mx-auto px-6 sm:px-12">
          <ScrollReveal direction="up" className="contact-animate text-center mb-14">
            <h2 className="text-sm font-bold uppercase tracking-[0.3em] text-memfa-or mb-4">Contact</h2>
            <h3 className="font-serif text-3xl sm:text-4xl md:text-6xl text-memfa-violet italic leading-tight px-2">
              Prêt à faire le prochain pas ? <br />
              <span className="not-italic font-bold text-black text-2xl sm:text-3xl md:text-5xl">Contactez-nous dès aujourd&apos;hui.</span>
            </h3>
            <p className="max-w-2xl mx-auto mt-6 text-sm sm:text-base text-gray-500 px-4">
              Partagez votre besoin spirituel ou votre projet, et notre équipe vous répondra avec attention et accompagnement.
            </p>
          </ScrollReveal>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 justify-center">
            <ScrollReveal direction="left" className="contact-animate bg-white rounded-[32px] md:rounded-[40px] p-6 sm:p-12 shadow-xl shadow-gray-200/50 border border-gray-100">
              <h3 className="text-2xl md:text-3xl font-black text-memfa-violet mb-8 md:mb-10 tracking-tighter uppercase">Envoyez-nous un message</h3>

              {/* Messages de statut du formulaire */}
              {formStatus === 'success' && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl text-green-700 text-sm font-medium">
                  ✅ Message envoyé avec succès ! Nous vous répondrons bientôt.
                </div>
              )}
              {formStatus === 'error' && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm font-medium">
                  ❌ Une erreur est survenue. Veuillez réessayer.
                </div>
              )}

              <form className="space-y-6" onSubmit={handleContactSubmit}>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-memfa-violet/40 uppercase tracking-[0.2em] ml-2">Nom Complet *</label>
                  <input name="nom" required type="text" placeholder="Votre nom" className="w-full p-6 rounded-[22px] bg-gray-50 border-none focus:ring-2 focus:ring-memfa-or/20 outline-none transition-all font-semibold text-sm" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-memfa-violet/40 uppercase tracking-[0.2em] ml-2">Email professionnel *</label>
                    <input name="email" required type="email" placeholder="votre@email.com" className="w-full p-6 rounded-[22px] bg-gray-50 border-none focus:ring-2 focus:ring-memfa-or/20 outline-none transition-all font-semibold text-sm" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-memfa-violet/40 uppercase tracking-[0.2em] ml-2">Téléphone</label>
                    <input name="telephone" type="tel" placeholder="+225 XX XX XX XX XX" className="w-full p-6 rounded-[22px] bg-gray-50 border-none focus:ring-2 focus:ring-memfa-or/20 outline-none transition-all font-semibold text-sm" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-memfa-violet/40 uppercase tracking-[0.2em] ml-2">Message *</label>
                  <textarea name="message" required rows={4} placeholder="Comment pouvons-nous vous aider ?" className="w-full p-6 rounded-[22px] bg-gray-50 border-none focus:ring-2 focus:ring-memfa-or/20 outline-none transition-all font-semibold text-sm resize-none"></textarea>
                </div>
                <button
                  type="submit"
                  disabled={formStatus === 'sending'}
                  className={`btn-magnetic w-full py-6 rounded-[24px] text-white font-black text-xs uppercase tracking-[0.3em] shadow-xl transition-all flex items-center justify-center gap-4 ${
                    formStatus === 'sending'
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-memfa-violet to-[#5d3fd3] hover:shadow-memfa-violet/30 hover:-translate-y-1'
                  }`}
                >
                  {formStatus === 'sending' ? (
                    <>
                      <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Envoi en cours...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                      </svg>
                      Nous contacter maintenant
                    </>
                  )}
                </button>
              </form>
            </ScrollReveal>

            {/* Infos de contact */}
            <ScrollReveal direction="right" delay={0.2} className="space-y-8">
              <div className="contact-animate w-full h-[300px] bg-white rounded-[40px] p-2 shadow-lg border border-gray-100 relative group overflow-hidden">
                <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3947.218!2d-5.0558!3d7.7112!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zN8KwNDInNDAuMyJOIDXCsDAzJzIwLjkiVw!5e0!3m2!1sfr!2sci!4v1713170000000!5m2!1sfr!2sci" className="w-full h-full rounded-[35px] grayscale-[0.3] contrast-[1.1]" style={{ border: 0 }} allowFullScreen loading="lazy"></iframe>
                <div className="absolute top-6 left-6 bg-memfa-violet text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3">
                  <div className="w-8 h-8 bg-memfa-or rounded-lg flex items-center justify-center text-white">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-[9px] font-black uppercase tracking-tighter opacity-70">Localisation</p>
                    <p className="text-xs font-bold">PW6V+FMR, Bouaké</p>
                  </div>
                </div>
              </div>
              <div className="contact-animate grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-[32px] shadow-sm border border-gray-100 space-y-3">
                  <div className="w-10 h-10 bg-memfa-or/10 rounded-xl flex items-center justify-center text-memfa-or">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <p className="text-[#1a0f2b] font-bold text-sm leading-tight">+225 XX XX XX XX XX <br/>+225 XX XX XX XX XX</p>
                </div>
                <div className="bg-white p-6 rounded-[32px] shadow-sm border border-gray-100 space-y-3">
                  <div className="w-10 h-10 bg-memfa-violet/10 rounded-xl flex items-center justify-center text-memfa-violet">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 012-2V7a2 2 0 01-2-2H5a2 2 0 01-2 2v10a2 2 0 012 2z" />
                    </svg>
                  </div>
                  <p className="text-[#1a0f2b] font-bold text-sm leading-tight">contact@memfa.org <br/>info@memfa.org</p>
                </div>
              </div>
              <div className="contact-animate bg-white p-8 rounded-[40px] shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-center gap-8">
                <div className="flex gap-4 items-center">
                  <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-memfa-violet">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest">Ouverture</p>
                    <p className="text-memfa-violet font-bold text-xs">Lun-Sam : 05h30 - 20h00</p>
                    <p className="text-memfa-or font-bold text-xs">Dim : 08h00 - 13h00</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  {[
                    {
                      id: "fb",
                      color: "bg-[#1877F2]",
                      icon: (
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                        </svg>
                      )
                    },
                    {
                      id: "yt",
                      color: "bg-[#FF0000]",
                      icon: (
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                        </svg>
                      )
                    },
                    {
                      id: "ig",
                      color: "bg-gradient-to-tr from-[#F58529] via-[#DD2A7B] to-[#8134AF]",
                      icon: (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                          <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                          <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                        </svg>
                      )
                    },
                    {
                      id: "wa",
                      color: "bg-[#25D366]",
                      icon: (
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.414 0 .001 5.413 0 12.048c0 2.123.554 4.197 1.608 6.037L0 24l6.117-1.605a11.803 11.803 0 0 0 5.925 1.586h.005c6.635 0 12.049-5.413 12.05-12.048a11.823 11.823 0 0 0-3.417-8.414z"/>
                        </svg>
                      )
                    },
                  ].map((social) => (
                    <a key={social.id} href="#" className={`${social.color} w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-lg hover:scale-110 transition-all active:scale-95`}>
                      {social.icon}
                    </a>
                  ))}
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

    </div>
  );
}

