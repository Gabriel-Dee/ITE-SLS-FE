import { useState, useMemo, useEffect, useRef, type CSSProperties, type ReactNode } from 'react';
import { scheduleData, triviaQuestions, sponsorPackages, teamGroups, EVENT_DATES, EVENT_PHOTOS_URL, PHOTOS_FROM } from './data';
import hero800 from './assets/images/hero-group-800.webp';
import hero1280 from './assets/images/hero-group-1280.webp';
import hero1920 from './assets/images/hero-group-1920.webp';
import tmc800 from './assets/images/tmc-tour-800.webp';
import tmc1280 from './assets/images/tmc-tour-1280.webp';
import tmc1920 from './assets/images/tmc-tour-1920.webp';
import bowl800 from './assets/images/traffic-bowl-fiu-uf-unf-800.webp';
import bowl1280 from './assets/images/traffic-bowl-fiu-uf-unf-1280.webp';
import bowl1920 from './assets/images/traffic-bowl-fiu-uf-unf-1920.webp';
import imgBowlTeams from './assets/images/traffic_bowl_teams.webp';
import imgUnfCampus from './assets/images/unf-campus-905.webp';
import imgDistrictLogo from './assets/images/ite-fprd-logo.png';
import imgIteUnfLogo from './assets/images/ite-unf-student-chapter-logo-white.png';
import imgIteUnfLogoColor from './assets/images/ite-unf-student-chapter-logo-osprey.png';
import sponsorshipPackagePdf from './assets/docs/ITE-SLS-2027-Sponsorship-Package.pdf?url';

const tmcSrcSet = `${tmc800} 800w, ${tmc1280} 1280w, ${tmc1920} 1920w`;
const bowlSrcSet = `${bowl800} 800w, ${bowl1280} 1280w, ${bowl1920} 1920w`;

// Past-summit photos until the 2027 album fills up (see EVENT_PHOTOS_URL).
const galleryItems = [
      { id: 'g1', thumb: tmc800, url: tmc1920, title: 'Traffic operations center tour', description: 'Past summit — delegates touring a traffic operations center and its camera video wall.' },
      { id: 'g2', thumb: bowl800, url: bowl1920, title: 'Collegiate Traffic Bowl', description: 'Past summit — FIU, UF, and UNF teams hold up their answers during a Traffic Bowl round.' },
      { id: 'g3', thumb: imgBowlTeams, url: imgBowlTeams, title: 'Traffic Bowl teams', description: 'Past summit — FAMU-FSU, FAU, and UF teams at their buzzer tables with delegates.' },
    ];

    const shownTeamGroups = teamGroups.filter((g) => g.members.length > 0);

    // Two full-width rows on wide screens (11 people: 6 + 5). A grid of top x bottom columns lets both rows fill it exactly.
    function teamRowSpans(count: number) {
      const top = Math.ceil(count / 2);
      const bottom = Math.max(count - top, 1);
      return {
        grid: { '--team-cols': top * bottom } as CSSProperties,
        member: (i: number) => ({ '--team-span': i < top ? bottom : top }) as CSSProperties,
      };
    }

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
  srcSet,
  position,
  alt,
  eyebrow,
  title,
  lead,
  ctaLabel,
  onCta,
}: {
  odId: string;
  image: string;
  srcSet?: string;
  position?: string;
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
            <img src={image} srcSet={srcSet} sizes="100vw" alt={alt} loading="lazy" decoding="async" style={position ? { objectPosition: position } : undefined} />
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

      useEffect(() => {
        if (lightboxIdx === null) return;
        const len = galleryItems.length;
        const onKey = (e) => {
          if (e.key === 'Escape') setLightboxIdx(null);
          if (e.key === 'ArrowRight') setLightboxIdx((i) => ((i ?? 0) + 1) % len);
          if (e.key === 'ArrowLeft') setLightboxIdx((i) => ((i ?? 0) - 1 + len) % len);
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
      }, [lightboxIdx]);

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
        ...(shownTeamGroups.length > 0 ? [{ label: 'Team', id: 'team' }] : []),
      ];

      return (
        <div>
          <a className="skip-link" href="#main">Skip to content</a>
          <header className={`site-header${scrolled || mobileOpen ? ' is-scrolled' : ''}${mobileOpen ? ' is-solid' : ''}`} data-od-id="nav">
            <div className="container nav-inner">
              <button
                type="button"
                className="nav-brand"
                aria-label="ITE Florida Puerto Rico District — SLS 2027, back to top"
                onClick={() => window.scrollTo({ top: 0, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' })}
              >
                <img className="nav-brand-logo" src={imgDistrictLogo} alt="" width={188} height={66} />
                <span className="nav-brand-mark">SLS 2027</span>
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
              <img src={hero1280} srcSet={`${hero800} 800w, ${hero1280} 1280w, ${hero1920} 1920w`} sizes="100vw" alt="Student delegates with name badges smiling together in front of an ITE Florida Puerto Rico District backdrop" fetchPriority="high" />
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
                <button type="button" className="btn btn-secondary btn-on-dark" onClick={() => scrollTo('schedule')}>View schedule</button>
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
            image={imgUnfCampus}
            position="center 62%"
            alt="University of North Florida building entrance with a large UNF Osprey sign beneath a glass canopy at dusk"
            eyebrow="Host campus"
            title="University of North Florida"
            lead={
              <>
                Sessions at the{' '}
                <a
                  className="showroom-link"
                  href="https://www.unf.edu/studentunion/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Senator Joe Carlucci Ballroom, Student Union Building, University of North Florida, Jacksonville
                </a>
                {' '}— check-in Friday at 1:30 PM, through Saturday evening.
              </>
            }
            ctaLabel="Venue & lodging"
            onCta={() => scrollTo('logistics')}
          />

          <section id="schedule" className="section section-alt" data-od-id="schedule">
            <div className="container">
              <div className="section-head center">
                <p className="eyebrow">Summit schedule</p>
                <h2 className="section-title">Conference schedule</h2>
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
                      <option value="career">Career development</option>
                      <option value="competition">Competitions</option>
                      <option value="social">Networking & social</option>
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
            image={bowl1280}
            srcSet={bowlSrcSet}
            position="center 55%"
            alt="FIU, UF, and UNF Collegiate Traffic Bowl teams hold up answer cards at their buzzer tables while a packed room of delegates watches"
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
            image={tmc1280}
            srcSet={tmcSrcSet}
            position="center 40%"
            alt="Summit delegates gathered in a traffic operations center in front of a wall of live traffic camera feeds and maps"
            eyebrow="Professional corridor"
            title="Networking"
            lead="Meet engineers, agency leaders, and students from across the district — Friday networking and resume reviews, plus the Saturday Career Fair."
            ctaLabel="See schedule"
            onCta={() => scrollTo('schedule')}
          />

          <section id="gallery" className="section section-alt" data-od-id="gallery">
            <div className="container">
              <div className="section-head center">
                <p className="eyebrow">Event photos</p>
                <h2 className="section-title">Photo gallery</h2>
                <p className="section-lead">
                  {EVENT_PHOTOS_URL
                    ? 'Every SLS 2027 photo, added during and after the summit.'
                    : `SLS 2027 photos will appear here starting ${PHOTOS_FROM}, and keep coming in during and after the summit. Until then, a few moments from past summits.`}
                </p>
                {EVENT_PHOTOS_URL ? (
                  <div className="cta-row" style={{ justifyContent: 'center', marginTop: 24 }}>
                    <a className="btn btn-dark" href={EVENT_PHOTOS_URL} target="_blank" rel="noopener noreferrer">View all event photos</a>
                  </div>
                ) : null}
              </div>
              <div className="gallery-grid">
                {galleryItems.map((g, i) => (
                  <button key={g.id} type="button" className="gallery-item" onClick={() => setLightboxIdx(i)} aria-label={`Open ${g.title}`}>
                    <img src={g.thumb} alt={g.description} loading="lazy" decoding="async" />
                  </button>
                ))}
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
                  <p>Senator Joe Carlucci Ballroom, Student Union Building, University of North Florida, Jacksonville.</p>
                </div>
                <div className="log-item">
                  <h4>Lodging</h4>
                  <p>Preferred overflow lodging near campus for Friday and Saturday nights. Shuttle service between the Student Union and the host hotel is included for registered delegates.</p>
                  <ul>
                    <li>Request the ITE SLS group rate when booking</li>
                    <li>Check-in opens Friday at 1:30 PM</li>
                  </ul>
                </div>
                <div className="log-item">
                  <h4>Arrival</h4>
                  <p>Jacksonville International Airport (JAX) is the recommended hub. Campus shuttles run on a posted Friday–Saturday loop; rideshare drop-off is at the Student Union entrance.</p>
                  <ul>
                    <li>UNF tour runs Friday, 3:30 – 5:00 PM</li>
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
              <div className="district-support">
                <img src={imgDistrictLogo} alt="ITE Florida Puerto Rico District" width={188} height={66} />
                <p>
                  <span className="district-support-label">Supported by</span>
                  The ITE Florida–Puerto Rico District, the parent organization of the district’s student chapters, supports the planning of SLS 2027.
                </p>
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
                <a className="btn btn-dark" style={{ marginTop: 24 }} href={sponsorshipPackagePdf} download="ITE-SLS-2027-Sponsorship-Package.pdf">
                  Download the sponsorship package (PDF)
                </a>
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

          {shownTeamGroups.length > 0 && (
            <section id="team" className="section section-alt" data-od-id="team">
              <div className="container">
                <div className="section-head center">
                  <p className="eyebrow">Meet the team</p>
                  <h2 className="section-title">Organizing team</h2>
                  <p className="section-lead">SLS 2027 is organized by the ITE Student Chapter at the University of North Florida.</p>
                </div>
                {shownTeamGroups.map((g) => {
                  const hasBios = g.members.some((m) => m.bio);
                  const rows = teamRowSpans(g.members.length);
                  return (
                  <div key={g.title} className="tier-block">
                    <p className="tier-label">{g.title}</p>
                    <div className={`team-grid ${hasBios ? 'team-grid-bios' : 'team-grid-rows'}`} style={hasBios ? undefined : rows.grid}>
                      {g.members.map((m, i) => (
                        <article key={m.name} className="team-member" style={hasBios ? undefined : rows.member(i)}>
                          {m.photo ? (
                            <img className="team-photo" src={m.photo} alt={m.name} loading="lazy" decoding="async" />
                          ) : (
                            <div className="team-photo team-initials" aria-hidden="true">
                              {m.name.split(' ').filter((w) => !w.endsWith('.')).map((w) => w[0]).slice(0, 2).join('')}
                            </div>
                          )}
                          <div>
                            <h3 className="team-name">{m.name}</h3>
                            {m.role ? <p className="team-role">{m.role}</p> : null}
                            {m.bio ? <p className="team-bio">{m.bio}</p> : null}
                            {m.link ? <a className="team-link" href={m.link.url} target="_blank" rel="noopener noreferrer">{m.link.label}</a> : null}
                          </div>
                        </article>
                      ))}
                    </div>
                  </div>
                  );
                })}
              </div>
            </section>
          )}
          </main>

          <footer className="site-footer" data-od-id="footer">
            <div className="container">
              <div className="footer-top">
                <h2 className="footer-headline">Building the next transportation leaders together.</h2>
                <div className="footer-top-aside">
                  <p className="footer-top-copy">
                    Student chapters across the Florida–Puerto Rico District meet at UNF for leadership, career workshops, and the Collegiate Traffic Bowl.
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
                    <a className="footer-ext" href="https://www.unf.edu/studentunion/" target="_blank" rel="noopener noreferrer">Student Union</a>
                  </div>
                  <div className="footer-col">
                    <p className="footer-col-title">Host</p>
                    <p className="footer-col-note">Senator Joe Carlucci Ballroom, Student Union Building</p>
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

          {lightboxIdx !== null && galleryItems[lightboxIdx] && (
            <div className="lightbox" role="dialog" aria-modal="true" aria-label={galleryItems[lightboxIdx].title} onClick={() => setLightboxIdx(null)}>
              <div className="lightbox-inner" onClick={(e) => e.stopPropagation()}>
                <img src={galleryItems[lightboxIdx].url} alt={galleryItems[lightboxIdx].title} />
                <div className="lightbox-nav">
                  <button type="button" aria-label="Previous photo" onClick={() => setLightboxIdx((i) => (i - 1 + galleryItems.length) % galleryItems.length)}>Previous</button>
                  <div className="lightbox-meta">
                    <div style={{ fontWeight: 500 }}>{galleryItems[lightboxIdx].title}</div>
                    <div className="lightbox-desc">{galleryItems[lightboxIdx].description}</div>
                  </div>
                  <button type="button" ref={lightboxCloseRef} aria-label="Close gallery" onClick={() => setLightboxIdx(null)}>Close</button>
                </div>
              </div>
            </div>
          )}
        </div>
      );
    }
