import { useState, useMemo, useEffect, useRef, type ReactNode } from 'react';
import { scheduleData, triviaQuestions, sponsorPackages, EVENT_DATES } from './data';
import imgHighlights from './assets/images/event_highlights_sh_1781725533655.jpg';
import imgCompetitions from './assets/images/traffic_bowl_teams.webp';
import imgNetworking from './assets/images/networking_sh_1781725561546.jpg';
import imgUnfHost from './assets/images/unf_host_sh_1781725574904.jpg';
import imgIteUnfLogo from './assets/images/ite-unf-student-chapter-logo-white.png';
import imgIteUnfLogoColor from './assets/images/ite-unf-student-chapter-logo-osprey.png';

const galleryItems = [
      { id: 'g1', url: imgHighlights, title: 'Keynote Plenary Session', category: 'highlights', description: 'Opening keynote on coastal transit evacuations and autonomous vehicle lanes.' },
      { id: 'g2', url: imgCompetitions, title: 'Collegiate Traffic Bowl Finals', category: 'competitions', description: 'FAMU-FSU, FAU, and UF teams at their buzzer tables with delegates after a Collegiate Traffic Bowl round.' },
      { id: 'g3', url: imgNetworking, title: 'Micro-Mentorship Speed Session', category: 'networking', description: 'Delegates reviewing resumes with transit chiefs and agency HR teams.' },
      { id: 'g4', url: imgUnfHost, title: 'Host Campus Reception', category: 'highlights', description: 'Campus welcome for Florida–Puerto Rico District student chapters.' },
    ];

    const DAYS = [
      { num: 1, label: 'Fri, Feb 12' },
      { num: 2, label: 'Sat, Feb 13' },
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
                <button type="button" className="btn btn-primary" onClick={() => scrollTo('registration')}>Registration info</button>
              </div>
              <button type="button" className="nav-toggle" aria-label={mobileOpen ? 'Close menu' : 'Open menu'} aria-expanded={mobileOpen} aria-controls="mobile-nav" onClick={() => setMobileOpen(!mobileOpen)}>
                <Icon d={mobileOpen ? 'M6 6l12 12M6 18L18 6' : 'M4 7h16M4 12h16M4 17h16'} size={22} />
              </button>
            </div>
            <div id="mobile-nav" className={`mobile-drawer${mobileOpen ? ' open' : ''}`} aria-hidden={!mobileOpen}>
              {navItems.map((n) => (
                <button key={n.id} type="button" tabIndex={mobileOpen ? 0 : -1} onClick={() => scrollTo(n.id)}>{n.label}</button>
              ))}
              <button type="button" className="btn btn-primary btn-block" tabIndex={mobileOpen ? 0 : -1} onClick={() => scrollTo('registration')}>Registration info</button>
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
              <p className="hero-eyebrow">Florida–Puerto Rico District · {EVENT_DATES}</p>
              <h1 className="hero-title">
                <span className="hero-title-line">Building a Career</span>
                <span className="hero-title-accent">in Transportation.</span>
              </h1>
              <p className="hero-sub">
                Student chapters, faculty mentors, and agency partners meet at the University of North Florida for two days to explore career paths, build career-ready skills, and connect with employers.
              </p>
              <div className="cta-row hero-cta">
                <button type="button" className="btn btn-primary" onClick={() => scrollTo('registration')}>Registration info</button>
                <button type="button" className="btn btn-secondary btn-on-dark" onClick={() => scrollTo('schedule')}>View Schedule</button>
              </div>
            </div>
          </section>

          <section id="about" className="about-band" data-od-id="about">
            <div className="container about-band-grid">
              <div className="about-band-left reveal-target">
                <p className="eyebrow">About the summit</p>
                <h2 className="section-title about-band-title">
                  <span className="about-band-title-line">Explore career paths. Build career-ready skills.</span>
                  <span className="about-band-muted">Connect with employers.</span>
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
                {' '}on Jacksonville’s campus — check-in Friday at 2:30 PM, through Saturday evening.
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
                <p className="section-lead">Networking, professional sessions, and competitions across two conference days.</p>
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
                            {[item.location, item.speaker].filter(Boolean).join(' · ')}
                          </div>
                          {open && item.description && <p className="session-body">{item.description}</p>}
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
            alt="Collegiate Traffic Bowl teams from FAMU-FSU, FAU, and UF at their tables with traffic-signal buzzers, surrounded by summit delegates"
            eyebrow="Saturday championship"
            title="Traffic Bowl"
            lead="Jeopardy-style MUTCD, Green Book, and safety standards — Saturday afternoon finals."
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
                    <p style={{ color: 'var(--fg-2)' }}>Bring this pace to the Traffic Bowl on Saturday afternoon.</p>
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
            lead="Speed sessions with transit chiefs and agency HR — Friday afternoon with resume reviews, plus the Saturday Career Fair."
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
                  <p>Preferred overflow lodging near campus for Friday and Saturday nights. Shuttle service between the University Center and the host hotel is included for registered delegates.</p>
                  <ul>
                    <li>Request the ITE SLS group rate when booking</li>
                    <li>Check-in opens Friday at 2:30 PM</li>
                  </ul>
                </div>
                <div className="log-item">
                  <h4>Arrival</h4>
                  <p>Jacksonville International Airport (JAX) is the recommended hub. Campus shuttles run on a posted Friday–Saturday loop; rideshare drop-off is at the University Center entrance.</p>
                  <ul>
                    <li>Tour of UNF starts Friday at 4:30 PM</li>
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
                <p className="section-lead">Our 2027 sponsors will be announced here. Every tier is open — yours could be the first logo on this page.</p>
              </div>
              {sponsorPackages.map(({ tier }) => (
                <div key={tier} className="tier-block">
                  <p className="tier-label">{tier}</p>
                  <div className="sponsor-row">
                    <div className="sponsor-tile sponsor-tile-empty">
                      <div className="sponsor-name">Sponsors coming soon</div>
                      <button type="button" className="sponsor-ind sponsor-link" onClick={() => scrollTo('sponsor-packages')}>
                        Become a {tier} sponsor →
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              <div id="sponsor-packages" className="packages-head">
                <p className="eyebrow">Call for sponsors</p>
                <h3 className="section-title" style={{ fontSize: 'var(--text-3xl)' }}>Sponsorship packages</h3>
                <p className="section-lead">Support one of Florida’s leading student-led transportation gatherings: connect talent, advance ideas, build communities, and shape a stronger tomorrow.</p>
              </div>
              <div className="package-grid">
                {sponsorPackages.map((p) => (
                  <article key={p.tier} className={`package-card package-${p.tier.toLowerCase()}`}>
                    <h4 className="package-tier">{p.tier}</h4>
                    <p className="package-price">${p.price.toLocaleString('en-US')}</p>
                    <ul className="package-perks">
                      {p.perks.map((perk) => <li key={perk}>{perk}</li>)}
                    </ul>
                    <button type="button" className="btn btn-dark btn-block" onClick={() => scrollTo('sponsor-notify')}>
                      Sponsorship opening soon
                    </button>
                  </article>
                ))}
              </div>

              <div id="sponsor-notify" className="sponsor-form-wrap">
                <div className="sponsor-form-intro">
                  <h3 className="section-title" style={{ fontSize: 'var(--text-3xl)' }}>Sponsorship opens soon</h3>
                  <p className="section-lead" style={{ marginTop: 16 }}>
                    Online sponsorship isn’t live yet. To reserve a tier or ask a question, email <a className="showroom-link" href="mailto:unf.ite@unf.edu">unf.ite@unf.edu</a> or
                    call <a className="showroom-link" href="tel:+19048841496">(904) 884-1496</a>.
                  </p>
                </div>
                <img
                  className="sponsor-chapter-logo"
                  src={imgIteUnfLogoColor}
                  alt="ITE University of North Florida Student Chapter — Florida Puerto Rico District"
                  width={240}
                  height={134}
                />
              </div>
            </div>
          </section>

          <section id="registration" className="section" data-od-id="registration">
            <div className="container">
              <div className="section-head">
                <p className="eyebrow">Registration</p>
                <h2 className="section-title">Registration opens soon</h2>
              </div>
              <div className="badge-done">
                <p style={{ fontSize: 'var(--text-2xl)', fontWeight: 500, margin: '0 0 16px' }}>Save the date: {EVENT_DATES}</p>
                <p style={{ color: 'var(--fg-2)' }}>Registration for SLS 2027 at the University of North Florida isn’t open yet — check back here soon.</p>
              </div>
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
                    Registration info
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
                    Florida–Puerto Rico District Student Leadership Summit · {EVENT_DATES} · University of North Florida.
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
                    <button type="button" onClick={() => scrollTo('registration')}>Registration</button>
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
                  <button type="button" onClick={() => scrollTo('registration')}>Registration</button>
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
