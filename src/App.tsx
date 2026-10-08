import { useState, useMemo, useEffect, useRef, type FormEvent, type ReactNode } from 'react';
import { scheduleData, triviaQuestions, sponsorList } from './data';
import type { AttendeeRegistration } from './types';
import imgHighlights from './assets/images/event_highlights_sh_1781725533655.jpg';
import imgCompetitions from './assets/images/competitions_sh_1781725548098.jpg';
import imgNetworking from './assets/images/networking_sh_1781725561546.jpg';
import imgUnfHost from './assets/images/unf_host_sh_1781725574904.jpg';
import imgIteUnfLogo from './assets/images/ite-unf-student-chapter-logo-white.png';
import imgIteUnfLogoColor from './assets/images/ite-unf-student-chapter-logo-osprey.png';

function isValidEmail(value: string) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value).trim());
    }

const galleryItems = [
      { id: 'g1', url: imgHighlights, title: 'Keynote Plenary Session', category: 'highlights', description: 'Opening keynote on coastal transit evacuations and autonomous vehicle lanes.' },
      { id: 'g2', url: imgCompetitions, title: 'Collegiate Traffic Bowl Finals', category: 'competitions', description: 'University teams competing in the final round on MUTCD standards.' },
      { id: 'g3', url: imgNetworking, title: 'Micro-Mentorship Speed Session', category: 'networking', description: 'Delegates reviewing resumes with transit chiefs and agency HR teams.' },
      { id: 'g4', url: imgUnfHost, title: 'Host Campus Reception', category: 'highlights', description: 'Campus welcome for Florida–Puerto Rico District student chapters.' },
    ];

    const DAYS = [
      { num: 1, label: 'Fri, Feb 5' },
      { num: 2, label: 'Sat, Feb 6' },
      { num: 3, label: 'Sun, Feb 7' },
    ];

    const TICKETS = [
      { id: 'student-member', name: 'Student — ITE Member', price: 45 },
      { id: 'student-nonmember', name: 'Student — Non-Member', price: 55 },
      { id: 'professional', name: 'Professional', price: 120 },
      { id: 'sponsor', name: 'Sponsor Guest', price: 0 },
    ];

function Icon({ d, size = 20 }: { d: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={d} />
    </svg>
  );
}

function ShowroomChapter({
  odId,
  image,
  alt,
  eyebrow,
  title,
  lead,
  ctaLabel,
  onCta,
}: {
  odId: string;
  image: string;
  alt: string;
  eyebrow?: string;
  title: string;
  lead?: ReactNode;
  ctaLabel?: string;
  onCta?: () => void;
}) {
      return (
        <section className="showroom-chapter" data-od-id={odId} aria-label={title}>
          <div className="showroom-media">
            <img src={image} alt={alt} loading="lazy" />
          </div>
          <div className="showroom-scrim" aria-hidden="true" />
          <div className="showroom-content reveal-target">
            {eyebrow ? <p className="showroom-eyebrow">{eyebrow}</p> : null}
            <h2 className="showroom-title">{title}</h2>
            {lead ? <p className="showroom-lead">{lead}</p> : null}
            {ctaLabel ? (
              <div className="cta-row">
                <button type="button" className="btn btn-secondary btn-on-dark" onClick={onCta}>{ctaLabel}</button>
              </div>
            ) : null}
          </div>
        </section>
      );
    }

    export default function App() {
      const [mobileOpen, setMobileOpen] = useState(false);
      const [scrolled, setScrolled] = useState(false);
      const [activeDay, setActiveDay] = useState(2);
      const [scheduleQuery, setScheduleQuery] = useState('');
      const [scheduleCategory, setScheduleCategory] = useState('all');
      const [expandedId, setExpandedId] = useState<string | null>(null);

      const [triviaStarted, setTriviaStarted] = useState(false);
      const [triviaIdx, setTriviaIdx] = useState(0);
      const [selectedOpt, setSelectedOpt] = useState<number | null>(null);
      const [triviaScore, setTriviaScore] = useState(0);
      const [triviaDone, setTriviaDone] = useState(false);

      const [galleryCat, setGalleryCat] = useState('all');
      const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);

      const [sponsorSubmitted, setSponsorSubmitted] = useState(false);
      const [sponsorForm, setSponsorForm] = useState({ name: '', company: '', email: '', interest: 'Diamond' });
      const [sponsorErrors, setSponsorErrors] = useState<Record<string, string>>({});

      const [reg, setReg] = useState({ name: '', email: '', org: '', diet: 'none', size: 'L', type: 'student-member' as AttendeeRegistration['ticketType'], count: 1 });
      const [regDone, setRegDone] = useState(false);
      const [ticketNo, setTicketNo] = useState('');
      const [regErrors, setRegErrors] = useState<Record<string, string>>({});
      const lightboxCloseRef = useRef(null);
      const lastFocusRef = useRef(null);

      useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 40);
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
      }, []);

      useEffect(() => {
        const nodes = Array.from(document.querySelectorAll('.reveal-target'));
        if (!nodes.length) return undefined;
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
          nodes.forEach((el) => el.classList.add('is-in'));
          return undefined;
        }
        const io = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                entry.target.classList.add('is-in');
                io.unobserve(entry.target);
              }
            });
          },
          { threshold: 0.28, rootMargin: '0px 0px -8% 0px' }
        );
        nodes.forEach((el) => io.observe(el));
        return () => io.disconnect();
      }, []);

      useEffect(() => {
        document.body.classList.toggle('drawer-open', mobileOpen);
        return () => document.body.classList.remove('drawer-open');
      }, [mobileOpen]);

      useEffect(() => {
        if (!mobileOpen) return undefined;
        const onKey = (e) => {
          if (e.key === 'Escape') setMobileOpen(false);
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
      }, [mobileOpen]);

      useEffect(() => {
        document.body.classList.toggle('lightbox-open', lightboxIdx !== null);
        return () => document.body.classList.remove('lightbox-open');
      }, [lightboxIdx]);

      useEffect(() => {
        if (lightboxIdx === null) return undefined;
        lastFocusRef.current = document.activeElement;
        const t = window.setTimeout(() => lightboxCloseRef.current?.focus(), 0);
        return () => {
          window.clearTimeout(t);
          if (lastFocusRef.current && typeof lastFocusRef.current.focus === 'function') {
            lastFocusRef.current.focus();
          }
        };
      }, [lightboxIdx]);

      const filteredGallery = useMemo(() => {
        return galleryItems.filter((g) => galleryCat === 'all' || g.category === galleryCat);
      }, [galleryCat]);

      useEffect(() => {
        if (lightboxIdx === null) return;
        const len = filteredGallery.length || 1;
        const onKey = (e) => {
          if (e.key === 'Escape') setLightboxIdx(null);
          if (e.key === 'ArrowRight') setLightboxIdx((i) => ((i ?? 0) + 1) % len);
          if (e.key === 'ArrowLeft') setLightboxIdx((i) => ((i ?? 0) - 1 + len) % len);
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
      }, [lightboxIdx, filteredGallery.length]);

      useEffect(() => {
        if (lightboxIdx === null) return;
        if (filteredGallery.length === 0) {
          setLightboxIdx(null);
          return;
        }
        if (lightboxIdx >= filteredGallery.length) {
          setLightboxIdx(0);
        }
      }, [lightboxIdx, filteredGallery.length]);

      const scrollTo = (id) => {
        setMobileOpen(false);
        const el = document.getElementById(id);
        if (!el) return;
        const top = el.getBoundingClientRect().top + window.scrollY - 64;
        window.scrollTo({ top, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
      };

      const filteredSchedule = useMemo(() => {
        return scheduleData.filter((item) => {
          const dayOk = item.day === activeDay;
          const catOk = scheduleCategory === 'all' || item.category === scheduleCategory;
          const q = scheduleQuery.toLowerCase();
          const searchOk =
            !q ||
            item.title.toLowerCase().includes(q) ||
            (item.speaker && item.speaker.toLowerCase().includes(q)) ||
            item.location.toLowerCase().includes(q) ||
            item.description.toLowerCase().includes(q);
          return dayOk && catOk && searchOk;
        });
      }, [activeDay, scheduleCategory, scheduleQuery]);

      const billing = useMemo(() => {
        const unit = TICKETS.find((t) => t.id === reg.type)?.price ?? 45;
        const subtotal = unit * reg.count;
        const isGroup = reg.count >= 4;
        const discount = isGroup ? Number((subtotal * 0.1).toFixed(2)) : 0;
        const fee = reg.type === 'sponsor' ? 0 : 2.5 * reg.count;
        return { unit, subtotal, isGroup, discount, fee, total: Number((subtotal - discount + fee).toFixed(2)) };
      }, [reg.type, reg.count]);

      const handleTrivia = (idx) => {
        if (selectedOpt !== null) return;
        setSelectedOpt(idx);
        if (idx === triviaQuestions[triviaIdx].correctIndex) setTriviaScore((s) => s + 1);
      };

      const nextTrivia = () => {
        setSelectedOpt(null);
        if (triviaIdx < triviaQuestions.length - 1) setTriviaIdx((i) => i + 1);
        else setTriviaDone(true);
      };

      const resetTrivia = () => {
        setTriviaIdx(0);
        setSelectedOpt(null);
        setTriviaScore(0);
        setTriviaDone(false);
        setTriviaStarted(true);
      };

      const submitSponsor = (e: FormEvent) => {
        e.preventDefault();
        const next: Record<string, string> = {};
        if (!sponsorForm.name.trim()) next.name = 'Enter your full name.';
        if (!sponsorForm.company.trim()) next.company = 'Enter your company.';
        if (!sponsorForm.email.trim()) next.email = 'Enter a work email.';
        else if (!isValidEmail(sponsorForm.email)) next.email = 'Use a valid email address.';
        setSponsorErrors(next);
        if (Object.keys(next).length) {
          const first = document.getElementById(next.name ? 'sp-name' : next.company ? 'sp-co' : 'sp-em');
          first?.focus();
          return;
        }
        setSponsorSubmitted(true);
      };

      const submitReg = (e: FormEvent) => {
        e.preventDefault();
        const next: Record<string, string> = {};
        if (!reg.name.trim()) next.name = 'Enter your full name.';
        if (!reg.email.trim()) next.email = 'Enter your email.';
        else if (!isValidEmail(reg.email)) next.email = 'Use a valid email address.';
        if (!reg.org.trim()) next.org = 'Enter your university or organization.';
        setRegErrors(next);
        if (Object.keys(next).length) {
          const firstId = next.name ? 'reg-name' : next.email ? 'reg-email' : 'reg-org';
          document.getElementById(firstId)?.focus();
          return;
        }
        const prefix = reg.type === 'professional' ? 'PRO' : reg.type === 'student-member' ? 'STU-MBR' : reg.type === 'student-nonmember' ? 'STU-NM' : 'SPN';
        setTicketNo(`${prefix}-${Math.floor(100000 + Math.random() * 90000)}`);
        setRegDone(true);
      };

      const navItems = [
        { label: 'About', id: 'about' },
        { label: 'Schedule', id: 'schedule' },
        { label: 'Competitions', id: 'competitions' },
        { label: 'Gallery', id: 'gallery' },
        { label: 'Logistics', id: 'logistics' },
        { label: 'Sponsors', id: 'sponsors' },
      ];

      return (
        <div>
          <a className="skip-link" href="#main">Skip to content</a>
          <header className={`site-header${scrolled || mobileOpen ? ' is-scrolled' : ''}${mobileOpen ? ' is-solid' : ''}`} data-od-id="nav">
            <div className="container nav-inner">
              <button
                type="button"
                className="nav-brand"
                aria-label="ITE SLS 2027 — back to top"
                onClick={() => window.scrollTo({ top: 0, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' })}
              >
                <span className="nav-brand-mark">ITE SLS</span>
                <span className="nav-brand-sub">Florida–Puerto Rico · 2027</span>
              </button>
              <nav className="nav-links" aria-label="Primary">
                {navItems.map((n) => (
                  <button key={n.id} type="button" onClick={() => scrollTo(n.id)}>{n.label}</button>
                ))}
              </nav>
              <div className="nav-actions">
                <button type="button" className="btn btn-primary" onClick={() => scrollTo('registration')}>Register Now</button>
              </div>
              <button type="button" className="nav-toggle" aria-label={mobileOpen ? 'Close menu' : 'Open menu'} aria-expanded={mobileOpen} aria-controls="mobile-nav" onClick={() => setMobileOpen(!mobileOpen)}>
                <Icon d={mobileOpen ? 'M6 6l12 12M6 18L18 6' : 'M4 7h16M4 12h16M4 17h16'} size={22} />
              </button>
            </div>
            <div id="mobile-nav" className={`mobile-drawer${mobileOpen ? ' open' : ''}`} aria-hidden={!mobileOpen}>
              {navItems.map((n) => (
                <button key={n.id} type="button" tabIndex={mobileOpen ? 0 : -1} onClick={() => scrollTo(n.id)}>{n.label}</button>
              ))}
              <button type="button" className="btn btn-primary btn-block" tabIndex={mobileOpen ? 0 : -1} onClick={() => scrollTo('registration')}>Register Now</button>
            </div>
          </header>

          <main id="main">
          <section className="hero" data-od-id="hero" aria-label="Summit hero">
            <div className="hero-media">
              <img src={imgHighlights} alt="Summit plenary session" />
            </div>
            <div className="hero-scrim" aria-hidden="true" />
            <div className="hero-content">
              <img
                className="hero-logo"
                src={imgIteUnfLogo}
                alt="ITE University of North Florida Student Chapter — Florida Puerto Rico District"
                width={220}
                height={123}
              />
              <p className="hero-eyebrow">Florida–Puerto Rico District · February 5–7, 2027</p>
              <h1 className="hero-title">
                <span className="hero-title-line">Building the next</span>
                <span className="hero-title-accent">transit leaders.</span>
              </h1>
              <p className="hero-sub">
                Student chapters, faculty mentors, and agency partners meet at the University of North Florida for three days of leadership, technical sessions, and the Collegiate Traffic Bowl.
              </p>
              <div className="cta-row hero-cta">
                <button type="button" className="btn btn-primary" onClick={() => scrollTo('registration')}>Register Now</button>
                <button type="button" className="btn btn-secondary btn-on-dark" onClick={() => scrollTo('schedule')}>View Schedule</button>
              </div>
            </div>
          </section>

          <section id="about" className="about-band" data-od-id="about">
            <div className="container about-band-grid">
              <div className="about-band-left reveal-target">
                <p className="eyebrow">About the summit</p>
                <h2 className="section-title about-band-title">
                  <span className="about-band-title-line">Where student leadership meets</span>
                  <span className="about-band-muted">transportation innovation</span>
                </h2>
              </div>
              <div className="about-band-right reveal-target">
                <p className="about-band-copy">
                  Past district summits have brought 100–150+ delegates together for keynotes, mentorship rounds, poster showcases, and Traffic Bowl finals — entirely student-planned. In 2027, UNF continues that tradition in Jacksonville with the same energy and a First Coast host committee.
                </p>
                <div className="about-band-stats" aria-label="Summit highlights">
                  <div>
                    <div className="glance-value">150+</div>
                    <div className="glance-meta">Student delegates</div>
                  </div>
                  <div>
                    <div className="glance-value">20+</div>
                    <div className="glance-meta">Active sessions</div>
                  </div>
                  <div>
                    <div className="glance-value">15+</div>
                    <div className="glance-meta">Partner firms</div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <ShowroomChapter
            odId="chapter-host"
            image={imgUnfHost}
            alt="Host campus reception at UNF"
            eyebrow="Host campus"
            title="University of North Florida"
            lead={
              <>
                Sessions at the{' '}
                <a
                  className="showroom-link"
                  href="https://www.unf.edu/universitycenter/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Adam W. Herbert University Center
                </a>
                {' '}on Jacksonville’s campus — check-in Friday noon, through Sunday adjournment.
              </>
            }
            ctaLabel="Venue & lodging"
            onCta={() => scrollTo('logistics')}
          />

          <section id="schedule" className="section section-alt" data-od-id="schedule">
            <div className="container">
              <div className="section-head center">
                <p className="eyebrow">Summit schedule</p>
                <h2 className="section-title">Technical program</h2>
                <p className="section-lead">Networking, professional sessions, and competitions across three conference days.</p>
              </div>

              <div className="controls">
                <div className="day-tabs" role="tablist" aria-label="Summit day">
                  {DAYS.map((d) => (
                    <button key={d.num} type="button" role="tab" aria-selected={activeDay === d.num} className={`day-tab${activeDay === d.num ? ' active' : ''}`} onClick={() => setActiveDay(d.num)}>
                      {d.label}
                    </button>
                  ))}
                </div>
                <div className="filter-row">
                  <div className="field">
                    <label htmlFor="sched-search">Search</label>
                    <input id="sched-search" type="search" placeholder="Sessions or speakers…" value={scheduleQuery} onChange={(e) => setScheduleQuery(e.target.value)} />
                  </div>
                  <div className="field" style={{ maxWidth: 200 }}>
                    <label htmlFor="sched-cat">Category</label>
                    <select id="sched-cat" value={scheduleCategory} onChange={(e) => setScheduleCategory(e.target.value)}>
                      <option value="all">All categories</option>
                      <option value="general">Opening & general</option>
                      <option value="technical">Technical tracks</option>
                      <option value="career">Career development</option>
                      <option value="competition">Competitions</option>
                      <option value="social">Gala & social</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="session-list">
                {filteredSchedule.length === 0 ? (
                  <div className="empty-state">
                    <p>No sessions match your filters.</p>
                    <button type="button" className="btn btn-secondary" style={{ marginTop: 16 }} onClick={() => { setScheduleQuery(''); setScheduleCategory('all'); }}>Clear filters</button>
                  </div>
                ) : (
                  filteredSchedule.map((item) => {
                    const open = expandedId === item.id;
                    return (
                      <button key={item.id} type="button" className="session" aria-expanded={open} onClick={() => setExpandedId(open ? null : item.id)}>
                        <span className="session-time">{item.time}</span>
                        <div>
                          <div className="session-title">{item.title}</div>
                          <div className="session-meta">
                            {item.location}
                            {item.speaker ? ` · ${item.speaker}` : ''}
                          </div>
                          {open && <p className="session-body">{item.description}</p>}
                        </div>
                        <span className="session-cat">{item.category}</span>
                      </button>
                    );
                  })
                )}
              </div>
            </div>
          </section>

          <ShowroomChapter
            odId="chapter-competitions"
            image={imgCompetitions}
            alt="Collegiate Traffic Bowl finals"
            eyebrow="Saturday championship"
            title="Traffic Bowl"
            lead="Jeopardy-style MUTCD, Green Book, and safety standards — amphitheater finals after the career panel."
            ctaLabel="Warm-up round"
            onCta={() => scrollTo('competitions')}
          />

          <section id="competitions" className="section" data-od-id="competitions">
            <div className="container">
              <div className="section-head center reveal-target">
                <p className="eyebrow">Practice module</p>
                <h2 className="section-title">Warm-up round</h2>
                <p className="section-lead">Four questions drawn from MUTCD, interchange design, signage color, and Level of Service — the same themes teams face on stage.</p>
              </div>
              <div className="trivia-card" style={{ maxWidth: 640, marginInline: 'auto', minHeight: 0 }}>
                {!triviaStarted ? (
                  <>
                    <p className="trivia-q">Ready when you are.</p>
                    <button type="button" className="btn btn-dark" onClick={() => setTriviaStarted(true)}>Start practice round</button>
                  </>
                ) : triviaDone ? (
                  <>
                    <p className="trivia-progress">Practice complete</p>
                    <p className="score-big">{triviaScore} / {triviaQuestions.length}</p>
                    <p style={{ color: 'var(--fg-2)' }}>Bring this pace to the amphitheater finals on Saturday.</p>
                    <button type="button" className="btn btn-secondary" onClick={resetTrivia}>Try again</button>
                  </>
                ) : (
                  <>
                    <p className="trivia-progress">Question {triviaIdx + 1} of {triviaQuestions.length}</p>
                    <p className="trivia-q">{triviaQuestions[triviaIdx].question}</p>
                    <div className="option-list">
                      {triviaQuestions[triviaIdx].options.map((opt, i) => {
                        let cls = 'option';
                        if (selectedOpt !== null) {
                          if (i === triviaQuestions[triviaIdx].correctIndex) cls += ' correct';
                          else if (i === selectedOpt) cls += ' wrong';
                        }
                        return (
                          <button key={i} type="button" className={cls} disabled={selectedOpt !== null} onClick={() => handleTrivia(i)}>{opt}</button>
                        );
                      })}
                    </div>
                    {selectedOpt !== null && (
                      <>
                        <p className="trivia-explain">{triviaQuestions[triviaIdx].explanation}</p>
                        <button type="button" className="btn btn-dark" onClick={nextTrivia}>
                          {triviaIdx < triviaQuestions.length - 1 ? 'Next question' : 'See score'}
                        </button>
                      </>
                    )}
                  </>
                )}
              </div>
            </div>
          </section>

          <ShowroomChapter
            odId="chapter-networking"
            image={imgNetworking}
            alt="Micro-mentorship and networking at the summit"
            eyebrow="Professional corridor"
            title="Micro-mentorship"
            lead="Speed sessions with transit chiefs and agency HR — Friday afternoon in Ballroom B, plus the sunset plaza social."
            ctaLabel="See schedule"
            onCta={() => scrollTo('schedule')}
          />

          <section id="gallery" className="section section-alt" data-od-id="gallery">
            <div className="container">
              <div className="section-head center">
                <p className="eyebrow">Moments from the corridor</p>
                <h2 className="section-title">Photo gallery</h2>
              </div>
              <div className="gallery-toolbar" role="tablist" aria-label="Gallery category">
                {['all', 'highlights', 'competitions', 'networking'].map((c) => (
                  <button key={c} type="button" role="tab" className={`chip${galleryCat === c ? ' active' : ''}`} aria-selected={galleryCat === c} onClick={() => setGalleryCat(c)}>
                    {c === 'all' ? 'All' : c.charAt(0).toUpperCase() + c.slice(1)}
                  </button>
                ))}
              </div>
              <div className="gallery-grid">
                {filteredGallery.length === 0 ? (
                  <div className="empty-state" style={{ gridColumn: '1 / -1' }}>
                    <p>No photos in this category yet.</p>
                    <button type="button" className="btn btn-secondary" style={{ marginTop: 16 }} onClick={() => setGalleryCat('all')}>Show all photos</button>
                  </div>
                ) : (
                  filteredGallery.map((g, i) => (
                    <button key={g.id} type="button" className="gallery-item" onClick={() => setLightboxIdx(i)} aria-label={`Open ${g.title}`}>
                      <img src={g.url} alt={g.title} loading="lazy" decoding="async" />
                    </button>
                  ))
                )}
              </div>
            </div>
          </section>

          <section id="logistics" className="section" data-od-id="logistics">
            <div className="container">
              <div className="section-head">
                <p className="eyebrow">Transit guidelines</p>
                <h2 className="section-title">Logistics & lodging</h2>
              </div>
              <div className="log-grid">
                <div className="log-item">
                  <h4>Venue</h4>
                  <p>Adam W. Herbert University Center, University of North Florida — Jacksonville campus. Primary sessions in University Center meeting rooms and ballrooms.</p>
                </div>
                <div className="log-item">
                  <h4>Lodging</h4>
                  <p>Preferred overflow lodging near campus for the Saturday gala night. Shuttle service between the University Center and the host hotel is included for registered delegates.</p>
                  <ul>
                    <li>Request the ITE SLS group rate when booking</li>
                    <li>Check-in window opens Friday at noon</li>
                  </ul>
                </div>
                <div className="log-item">
                  <h4>Arrival</h4>
                  <p>Jacksonville International Airport (JAX) is the recommended hub. Campus shuttles run on a posted Friday–Sunday loop; rideshare drop-off is at the University Center entrance.</p>
                  <ul>
                    <li>Sunday tour departs from the University Center shuttle dock</li>
                    <li>Bring a photo ID for badge pickup</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          <section id="sponsors" className="section section-alt" data-od-id="sponsors">
            <div className="container">
              <div className="section-head center">
                <p className="eyebrow">Supporting partners</p>
                <h2 className="section-title">Sponsors</h2>
                <p className="section-lead">Agencies and firms recruiting across the Florida–Puerto Rico corridor.</p>
              </div>
              {['Diamond', 'Platinum', 'Gold', 'Silver'].map((tier) => (
                <div key={tier} className="tier-block">
                  <p className="tier-label">{tier}</p>
                  <div className="sponsor-row">
                    {sponsorList.filter((s) => s.tier === tier).map((s) => (
                      <div key={s.id} className="sponsor-tile">
                        <div className="sponsor-name">{s.name}</div>
                        <div className="sponsor-ind">{s.industry}</div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              <div className="sponsor-form-wrap">
                <div className="sponsor-form-intro">
                  <h3 className="section-title" style={{ fontSize: 'var(--text-3xl)' }}>Become a partner</h3>
                  <p className="section-lead" style={{ marginTop: 16 }}>Diamond through Silver tiers include booth space, resume bank access, and Traffic Bowl stage recognition.</p>
                  <img
                    className="sponsor-chapter-logo"
                    src={imgIteUnfLogoColor}
                    alt="ITE University of North Florida Student Chapter — Florida Puerto Rico District"
                    width={240}
                    height={134}
                  />
                </div>
                {sponsorSubmitted ? (
                  <p className="form-success">Thank you — your partnership inquiry is queued. Our sponsorship desk will reply within two business days.</p>
                ) : (
                  <form className="form-stack" onSubmit={submitSponsor} noValidate>
                    {Object.keys(sponsorErrors).length > 0 && (
                      <p className="form-error-summary" role="alert">Fix the highlighted fields to send your inquiry.</p>
                    )}
                    <div className="field">
                      <label htmlFor="sp-name">Full name</label>
                      <input id="sp-name" autoComplete="name" aria-invalid={!!sponsorErrors.name} aria-describedby={sponsorErrors.name ? 'sp-name-err' : undefined} value={sponsorForm.name} onChange={(e) => { setSponsorForm({ ...sponsorForm, name: e.target.value }); setSponsorErrors((err) => { const n = { ...err }; delete n.name; return n; }); }} />
                      {sponsorErrors.name ? <p id="sp-name-err" className="field-error">{sponsorErrors.name}</p> : null}
                    </div>
                    <div className="field">
                      <label htmlFor="sp-co">Company</label>
                      <input id="sp-co" autoComplete="organization" aria-invalid={!!sponsorErrors.company} aria-describedby={sponsorErrors.company ? 'sp-co-err' : undefined} value={sponsorForm.company} onChange={(e) => { setSponsorForm({ ...sponsorForm, company: e.target.value }); setSponsorErrors((err) => { const n = { ...err }; delete n.company; return n; }); }} />
                      {sponsorErrors.company ? <p id="sp-co-err" className="field-error">{sponsorErrors.company}</p> : null}
                    </div>
                    <div className="field">
                      <label htmlFor="sp-em">Work email</label>
                      <input id="sp-em" type="email" autoComplete="email" aria-invalid={!!sponsorErrors.email} aria-describedby={sponsorErrors.email ? 'sp-em-err' : undefined} value={sponsorForm.email} onChange={(e) => { setSponsorForm({ ...sponsorForm, email: e.target.value }); setSponsorErrors((err) => { const n = { ...err }; delete n.email; return n; }); }} />
                      {sponsorErrors.email ? <p id="sp-em-err" className="field-error">{sponsorErrors.email}</p> : null}
                    </div>
                    <div className="field">
                      <label htmlFor="sp-tier">Interest tier</label>
                      <select id="sp-tier" value={sponsorForm.interest} onChange={(e) => setSponsorForm({ ...sponsorForm, interest: e.target.value })}>
                        <option>Diamond</option>
                        <option>Platinum</option>
                        <option>Gold</option>
                        <option>Silver</option>
                      </select>
                    </div>
                    <button type="submit" className="btn btn-dark">Send inquiry</button>
                  </form>
                )}
              </div>

            </div>
          </section>

          <section id="registration" className="section" data-od-id="registration">
            <div className="container">
              <div className="section-head">
                <p className="eyebrow">Secure attendance</p>
                <h2 className="section-title">Register for SLS 2027</h2>
                <p className="section-lead">Select your pass, add delegates, and generate a badge number. Groups of four or more receive a 10% discount.</p>
              </div>

              {regDone ? (
                <div className="badge-done">
                  <p className="eyebrow">Registration confirmed</p>
                  <p style={{ fontSize: 'var(--text-2xl)', fontWeight: 500, margin: '8px 0 16px' }}>Welcome, {reg.name}</p>
                  <p style={{ color: 'var(--fg-2)', marginBottom: 12 }}>Badge number</p>
                  <code>{ticketNo}</code>
                  <p style={{ color: 'var(--muted)', marginTop: 16, fontSize: 'var(--text-sm)' }}>Present this code at University Center lobby check-in. A confirmation email will arrive shortly.</p>
                  <button type="button" className="btn btn-secondary" style={{ marginTop: 24 }} onClick={() => { setRegDone(false); setTicketNo(''); }}>Register another</button>
                </div>
              ) : (
                <div className="reg-grid">
                  <form className="form-stack" onSubmit={submitReg} noValidate>
                    {Object.keys(regErrors).length > 0 && (
                      <p className="form-error-summary" role="alert">Complete the required fields to finish registration.</p>
                    )}
                    <div className="ticket-types" role="radiogroup" aria-label="Ticket type">
                      {TICKETS.map((t) => (
                        <button
                          key={t.id}
                          type="button"
                          role="radio"
                          aria-checked={reg.type === t.id}
                          className={`ticket-type${reg.type === t.id ? ' active' : ''}`}
                          onClick={() => setReg({ ...reg, type: t.id as AttendeeRegistration['ticketType'] })}
                        >
                          <span className="ticket-name">{t.name}</span>
                          <span className="ticket-price">{t.price === 0 ? 'Included' : `$${t.price}`}</span>
                        </button>
                      ))}
                    </div>
                    <div className="field">
                      <label htmlFor="reg-name">Full name</label>
                      <input id="reg-name" autoComplete="name" aria-invalid={!!regErrors.name} aria-describedby={regErrors.name ? 'reg-name-err' : undefined} value={reg.name} onChange={(e) => { setReg({ ...reg, name: e.target.value }); setRegErrors((err) => { const n = { ...err }; delete n.name; return n; }); }} />
                      {regErrors.name ? <p id="reg-name-err" className="field-error">{regErrors.name}</p> : null}
                    </div>
                    <div className="field">
                      <label htmlFor="reg-email">Email</label>
                      <input id="reg-email" type="email" autoComplete="email" aria-invalid={!!regErrors.email} aria-describedby={regErrors.email ? 'reg-email-err' : undefined} value={reg.email} onChange={(e) => { setReg({ ...reg, email: e.target.value }); setRegErrors((err) => { const n = { ...err }; delete n.email; return n; }); }} />
                      {regErrors.email ? <p id="reg-email-err" className="field-error">{regErrors.email}</p> : null}
                    </div>
                    <div className="field">
                      <label htmlFor="reg-org">University / organization</label>
                      <input id="reg-org" autoComplete="organization" aria-invalid={!!regErrors.org} aria-describedby={regErrors.org ? 'reg-org-err' : undefined} value={reg.org} onChange={(e) => { setReg({ ...reg, org: e.target.value }); setRegErrors((err) => { const n = { ...err }; delete n.org; return n; }); }} />
                      {regErrors.org ? <p id="reg-org-err" className="field-error">{regErrors.org}</p> : null}
                    </div>
                    <div className="form-row-2">
                      <div className="field">
                        <label htmlFor="reg-diet">Dietary needs</label>
                        <select id="reg-diet" value={reg.diet} onChange={(e) => setReg({ ...reg, diet: e.target.value })}>
                          <option value="none">None</option>
                          <option value="vegetarian">Vegetarian</option>
                          <option value="vegan">Vegan</option>
                          <option value="gluten-free">Gluten-free</option>
                        </select>
                      </div>
                      <div className="field">
                        <label htmlFor="reg-size">T-shirt size</label>
                        <select id="reg-size" value={reg.size} onChange={(e) => setReg({ ...reg, size: e.target.value })}>
                          {['XS', 'S', 'M', 'L', 'XL', 'XXL'].map((s) => <option key={s}>{s}</option>)}
                        </select>
                      </div>
                    </div>
                    <div>
                      <p className="eyebrow" id="delegate-label" style={{ marginBottom: 8 }}>Delegates</p>
                      <div className="qty-row" role="group" aria-labelledby="delegate-label">
                        <button type="button" aria-label="Decrease count" disabled={reg.count <= 1} onClick={() => setReg({ ...reg, count: Math.max(1, reg.count - 1) })}>−</button>
                        <span className="qty-val" aria-live="polite">{reg.count}</span>
                        <button type="button" aria-label="Increase count" disabled={reg.count >= 20} onClick={() => setReg({ ...reg, count: Math.min(20, reg.count + 1) })}>+</button>
                      </div>
                    </div>
                    <button type="submit" className="btn btn-primary">Complete registration</button>
                  </form>

                  <aside className="summary" aria-live="polite">
                    <h4>Order summary</h4>
                    <div className="summary-row"><span>Unit price</span><span>${billing.unit.toFixed(2)}</span></div>
                    <div className="summary-row"><span>Subtotal × {reg.count}</span><span>${billing.subtotal.toFixed(2)}</span></div>
                    {billing.isGroup && <div className="summary-row"><span>Group discount (10%)</span><span>−${billing.discount.toFixed(2)}</span></div>}
                    <div className="summary-row"><span>Booking fee</span><span>${billing.fee.toFixed(2)}</span></div>
                    <div className="summary-total"><span>Total</span><span>${billing.total.toFixed(2)}</span></div>
                  </aside>
                </div>
              )}
            </div>
          </section>
          </main>

          <footer className="site-footer" data-od-id="footer">
            <div className="container">
              <div className="footer-top">
                <h2 className="footer-headline">Building the next transit leaders together.</h2>
                <div className="footer-top-aside">
                  <p className="footer-top-copy">
                    Student chapters across the Florida–Puerto Rico District meet at UNF for leadership, technical sessions, and the Collegiate Traffic Bowl.
                  </p>
                  <button type="button" className="btn footer-cta" onClick={() => scrollTo('registration')}>
                    Register for SLS 2027
                  </button>
                </div>
              </div>

              <div className="footer-mid">
                <div className="footer-brand-col">
                  <img
                    className="footer-logo"
                    src={imgIteUnfLogo}
                    alt="ITE University of North Florida Student Chapter — Florida Puerto Rico District"
                    width={280}
                    height={157}
                  />
                  <p className="footer-brand-desc">
                    Florida–Puerto Rico District Student Leadership Summit · February 5–7, 2027 · University of North Florida.
                  </p>
                </div>
                <div className="footer-cols">
                  <div className="footer-col">
                    <p className="footer-col-title">Summit</p>
                    <button type="button" onClick={() => scrollTo('about')}>About</button>
                    <button type="button" onClick={() => scrollTo('schedule')}>Schedule</button>
                    <button type="button" onClick={() => scrollTo('competitions')}>Competitions</button>
                    <button type="button" onClick={() => scrollTo('gallery')}>Gallery</button>
                  </div>
                  <div className="footer-col">
                    <p className="footer-col-title">Attend</p>
                    <button type="button" onClick={() => scrollTo('logistics')}>Logistics</button>
                    <button type="button" onClick={() => scrollTo('sponsors')}>Sponsors</button>
                    <button type="button" onClick={() => scrollTo('registration')}>Register</button>
                    <a className="footer-ext" href="https://www.unf.edu/universitycenter/" target="_blank" rel="noopener noreferrer">University Center</a>
                  </div>
                  <div className="footer-col">
                    <p className="footer-col-title">Host</p>
                    <p className="footer-col-note">Adam W. Herbert University Center</p>
                    <p className="footer-col-note">University of North Florida</p>
                    <p className="footer-col-note">Jacksonville, FL</p>
                  </div>
                </div>
              </div>

              <div className="footer-bottom">
                <p className="footer-copy">© 2027 Institute of Transportation Engineers — Florida–Puerto Rico District</p>
                <div className="footer-bottom-links">
                  <button type="button" onClick={() => scrollTo('registration')}>Register</button>
                  <button type="button" onClick={() => scrollTo('logistics')}>Venue</button>
                  <button type="button" onClick={() => scrollTo('sponsors')}>Partners</button>
                </div>
              </div>
            </div>
          </footer>

          {lightboxIdx !== null && filteredGallery[lightboxIdx] && (
            <div className="lightbox" role="dialog" aria-modal="true" aria-label={filteredGallery[lightboxIdx].title} onClick={() => setLightboxIdx(null)}>
              <div className="lightbox-inner" onClick={(e) => e.stopPropagation()}>
                <img src={filteredGallery[lightboxIdx].url} alt={filteredGallery[lightboxIdx].title} />
                <div className="lightbox-nav">
                  <button type="button" aria-label="Previous photo" onClick={() => setLightboxIdx((i) => (i - 1 + filteredGallery.length) % filteredGallery.length)}>Previous</button>
                  <div className="lightbox-meta">
                    <div style={{ fontWeight: 500 }}>{filteredGallery[lightboxIdx].title}</div>
                    <div className="lightbox-desc">{filteredGallery[lightboxIdx].description}</div>
                  </div>
                  <button type="button" ref={lightboxCloseRef} aria-label="Close gallery" onClick={() => setLightboxIdx(null)}>Close</button>
                </div>
              </div>
            </div>
          )}
        </div>
      );
    }
