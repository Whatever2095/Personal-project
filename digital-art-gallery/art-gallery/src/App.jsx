import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import data from './captions.json';

const R2_BASE_URL = import.meta.env.VITE_R2_BASE_URL;

function useScrollReveal(threshold = 0.12) {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setIsVisible(true); observer.unobserve(el); } },
      { threshold }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return [ref, isVisible];
}

function MarqueeTicker() {
  const items = ['Original Work', 'Digital Art', 'Procreate', 'The Creative Cluster', 'SRE by Day', 'Artist by Night', 'Bold Brushstrokes', 'Cosmic Landscapes', 'Abstract Worlds'];
  const doubled = [...items, ...items];
  return (
    <div className="ticker-wrap" aria-hidden="true">
      <div className="ticker-track">
        {doubled.map((item, i) => (
          <span key={i} className="ticker-item">
            {item}
            <span className="ticker-dot">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}

function GalleryItem({ art, index, onClick }) {
  const [ref, isVisible] = useScrollReveal();
  const num = String(index + 1).padStart(2, '0');

  return (
    <div
      ref={ref}
      className={`gallery-item${isVisible ? ' visible' : ''}`}
      style={{ transitionDelay: `${(index % 4) * 90}ms` }}
      onClick={() => onClick(art)}
    >
      <div className="gallery-item-inner">
        <img
          src={`${R2_BASE_URL}/Gallery-pics/${art.image}`}
          alt={art.title}
          loading="lazy"
        />
        <div className="gallery-item-overlay">
          <span className="gallery-item-num">{num}</span>
          <h3 className="gallery-item-title">{art.title}</h3>
          <span className="gallery-item-cta">
            View Story
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="14" height="14">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </span>
        </div>
      </div>
    </div>
  );
}

function StoryModal({ art, onClose, onPrev, onNext, hasPrev, hasNext }) {
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight' && hasNext) onNext();
      if (e.key === 'ArrowLeft' && hasPrev) onPrev();
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose, onPrev, onNext, hasPrev, hasNext]);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Close">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        <div className="modal-image-pane">
          <img src={`${R2_BASE_URL}/Gallery-pics/${art.image}`} alt={art.title} />
          <div className="modal-nav">
            <button className="modal-nav-btn" onClick={onPrev} disabled={!hasPrev} aria-label="Previous">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
                <path d="M19 12H5M12 5l-7 7 7 7" />
              </svg>
            </button>
            <button className="modal-nav-btn" onClick={onNext} disabled={!hasNext} aria-label="Next">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        <div className="modal-content">
          <span className="label-tag">The Story</span>
          <h2 className="modal-title">{art.title}</h2>
          <div className="modal-divider" />
          <p className="modal-story">{art.story}</p>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [activeIndex, setActiveIndex] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollTo = (id) => {
    setMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const openStory = (art) => setActiveIndex(data.gallery.findIndex(a => a.id === art.id));
  const closeStory = () => setActiveIndex(null);
  const prevStory = () => setActiveIndex(i => Math.max(0, i - 1));
  const nextStory = () => setActiveIndex(i => Math.min(data.gallery.length - 1, i + 1));

  const activeArt = activeIndex !== null ? data.gallery[activeIndex] : null;

  return (
    <div className="app">

      {/* ── Navigation ── */}
      <nav className={`nav${scrolled ? ' nav-scrolled' : ''}`}>
        <div className="nav-inner">
          <a href="#top" className="nav-brand" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
            <span className="nav-brand-first">Neelima</span>
            <span className="nav-brand-last">Devulapalli</span>
          </a>

          <div className="nav-links">
            <button onClick={() => scrollTo('works')}>Works</button>
            <button onClick={() => scrollTo('about')}>About</button>
          </div>

          <button className={`nav-hamburger${menuOpen ? ' open' : ''}`} onClick={() => setMenuOpen(v => !v)} aria-label="Menu">
            <span /><span /><span />
          </button>
        </div>

        {menuOpen && (
          <div className="nav-mobile-menu">
            <button onClick={() => scrollTo('works')}>Works</button>
            <button onClick={() => scrollTo('about')}>About</button>
          </div>
        )}
      </nav>

      {/* ── Hero ── */}
      <section className="hero" id="top">
        <div className="hero-bg">
          <img src={`${R2_BASE_URL}/Gallery-pics/${data.gallery[2].image}`} alt="Featured artwork" />
          <div className="hero-overlay" />
        </div>
        <div className="hero-content">
          <span className="hero-eyebrow">Digital Gallery</span>
          <h1 className="hero-headline">
            <span>The Creative</span>
            <span className="hero-headline-accent">Cluster</span>
          </h1>
          <p className="hero-sub">{data.profile.name}</p>
          <button className="hero-cta" onClick={() => scrollTo('works')}>
            Explore Works
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
              <path d="M7 17L17 7M17 7H7M17 7v10" />
            </svg>
          </button>
        </div>
        <div className="hero-scroll-indicator">
          <div className="scroll-bar" />
        </div>
      </section>

      {/* ── Gallery ── */}
      <section id="works" className="gallery-section">
        <div className="section-header">
          <span className="label-tag">Portfolio</span>
          <h2 className="section-title">Selected Works</h2>
          <p className="section-sub">{data.gallery.length} original pieces</p>
        </div>

        <div className="gallery-grid">
          {data.gallery.map((art, index) => (
            <GalleryItem key={art.id} art={art} index={index} onClick={openStory} />
          ))}
        </div>
      </section>

      <MarqueeTicker />

      {/* ── About ── */}
      <section id="about" className="about-section">
        <div className="about-inner">
          <div className="about-image-col">
            <div className="about-image-frame">
              <img src={`${R2_BASE_URL}/Gallery-pics/${data.profile.profile_image}`} alt={data.profile.name} />
            </div>
            <div className="about-stats">
              <div className="stat-item">
                <span className="stat-num">{data.gallery.length}</span>
                <span className="stat-label">Works</span>
              </div>
              <div className="stat-divider" />
              <div className="stat-item">
                <span className="stat-num">∞</span>
                <span className="stat-label">Stories</span>
              </div>
              <div className="stat-divider" />
              <div className="stat-item">
                <span className="stat-num">1</span>
                <span className="stat-label">Artist</span>
              </div>
            </div>
          </div>

          <div className="about-text-col">
            <span className="label-tag">Artist</span>
            <h2 className="about-name">{data.profile.name}</h2>
            <p className="about-role">{data.profile.title}</p>
            <div className="about-divider" />
            <p className="about-bio">{data.profile.bio}</p>

            <div className="about-tags">
              {['Procreate', 'Digital Illustration', 'Landscape', 'Abstract', 'Portraiture', 'Mandala'].map(tag => (
                <span key={tag} className="about-tag">{tag}</span>
              ))}
            </div>

            <a
              href="https://www.linkedin.com/in/devulapallineelima/"
              target="_blank"
              rel="noopener noreferrer"
              className="linkedin-btn"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18" aria-hidden="true">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
              Connect on LinkedIn
            </a>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="footer">
        <div className="footer-inner">
          <span className="footer-brand">Neelima Devulapalli</span>
          <span className="footer-copy">© {new Date().getFullYear()} · All works original</span>
        </div>
      </footer>

      {/* ── Story Modal ── */}
      {activeArt && (
        <StoryModal
          art={activeArt}
          onClose={closeStory}
          onPrev={prevStory}
          onNext={nextStory}
          hasPrev={activeIndex > 0}
          hasNext={activeIndex < data.gallery.length - 1}
        />
      )}
    </div>
  );
}
