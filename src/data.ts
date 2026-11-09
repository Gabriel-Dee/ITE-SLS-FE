import { ScheduleItem, TriviaQuestion, SponsorPackage, TeamGroup } from './types';
import imgSando from './assets/images/team-thobias-sando.webp';
import imgManjunatha from './assets/images/team-pruthvi-manjunatha.webp';
import imgGabriel from './assets/images/team-gabriel-minzemalulu.webp';
import imgRobert from './assets/images/team-robert-daniel.webp';
import imgHenry from './assets/images/team-henry-kasirye.webp';
import imgDeogratias from './assets/images/team-deogratias-nyamhanga.webp';
import imgJoshua from './assets/images/team-joshua-mchaina.webp';
import imgJohn from './assets/images/team-john-butoto.webp';
import imgEsther from './assets/images/team-esther-bukuru.webp';
import imgRaymond from './assets/images/team-raymond-manento.webp';
import imgProtik from './assets/images/team-protik-saha-palash.webp';
import imgSamuel from './assets/images/team-samuel-nye.webp';
import imgAdrian from './assets/images/team-adrian-figueroa.webp';
import imgAbduel from './assets/images/team-abduel-mfangavo.webp';

// Also update DAYS labels in App.tsx and PHOTOS_FROM below if this changes.
export const EVENT_DATES = 'February 12–13, 2027';

// Shared OneDrive album for SLS 2027 photos. Empty = gallery shows the "photos from" note and no button.
export const EVENT_PHOTOS_URL = '';
export const PHOTOS_FROM = 'February 12, 2027';

// Organizing team. A group with no members stays hidden; with no members at all, so do the section and its nav link.
export const teamGroups: TeamGroup[] = [
  {
    title: 'Faculty advisors',
    members: [
      {
        name: 'Dr. Thobias Sando',
        role: 'Professor of Civil Engineering',
        bio: 'Directs the UNF Transportation Engineering Lab. A licensed Professional Engineer and Professional Traffic Operations Engineer with a Ph.D. in transportation from Florida State University, working in traffic operations, highway safety, transportation planning, and traffic flow modeling.',
        link: { label: 'UNF faculty profile', url: 'https://webapps.unf.edu/faculty/bio/N00612281/thobias-sando' },
        photo: imgSando,
      },
      {
        name: 'Dr. Pruthvi Manjunatha',
        role: 'Assistant Professor of Civil Engineering',
        bio: 'Works on connected and autonomous vehicles, intelligent transportation systems, traffic simulation, traffic engineering, and human factors. Holds a Ph.D. in civil engineering from the University of Florida.',
        link: { label: 'UNF faculty profile', url: 'https://webapps.unf.edu/faculty/bio/N01654005/pruthvi-manjunatha' },
        photo: imgManjunatha,
      },
    ],
  },
  {
    title: 'Student organizing team',
    members: [
      { name: 'Henry Kasirye', role: 'Conference Chair\nGraduate Research Assistant, UNF Transportation Lab', link: { label: 'LinkedIn', url: 'https://www.linkedin.com/in/henry-kasirye-765088340/' }, photo: imgHenry },
      { name: 'Deogratias Nyamhanga', role: 'Conference Co-Chair\nGraduate Research Assistant, UNF Transportation Lab', link: { label: 'LinkedIn', url: 'https://www.linkedin.com/in/deogratias-nyamhanga/' }, photo: imgDeogratias },
      { name: 'Adrian Figueroa', role: 'Programming & Social Events Coordinator\nITE Student Chapter Secretary', link: { label: 'LinkedIn', url: 'https://www.linkedin.com/in/adrian-figueroa-7807a4305/' }, photo: imgAdrian },
      { name: 'Samuel Nye', role: 'Programming & Social Events Coordinator\nITE Student Chapter President', link: { label: 'LinkedIn', url: 'https://www.linkedin.com/in/samuel-nye-166850393/' }, photo: imgSamuel },
      { name: 'Raymond Manento', role: 'Finance & Fundraising Coordinator\nGraduate Research Assistant, UNF Transportation Lab', link: { label: 'LinkedIn', url: 'https://www.linkedin.com/in/raymond-manento/' }, photo: imgRaymond },
      { name: 'Protik Saha Palash', role: 'Finance & Fundraising Coordinator\nGraduate Research Assistant, School of Engineering', link: { label: 'LinkedIn', url: 'https://www.linkedin.com/in/protik-saha-palash/' }, photo: imgProtik },
      { name: 'Robert Daniel', role: 'Event Logistics & Volunteer Coordinator\nGraduate Research Assistant, UNF Transportation Lab', link: { label: 'LinkedIn', url: 'https://www.linkedin.com/in/eng-robert-daniel-103912235/' }, photo: imgRobert },
      { name: 'Abduel Mfangavo', role: 'Event Logistics & Volunteer Coordinator\nGraduate Research Assistant, School of Engineering', link: { label: 'LinkedIn', url: 'https://www.linkedin.com/in/abduel-mfangavo-7869b8222/' }, photo: imgAbduel },
      { name: 'Gabriel Minzemalulu', role: 'Communication & Technology Coordinator\nGraduate Research Assistant, UNF Transportation Lab', link: { label: 'LinkedIn', url: 'https://www.linkedin.com/in/gabriel-minzemalulu/' }, photo: imgGabriel },
      { name: 'Esther Bukuru', role: 'ITE Student Chapter Supporting Leadership\nGraduate Research Assistant, UNF Transportation Lab', link: { label: 'LinkedIn', url: 'https://www.linkedin.com/in/esther-bukuru-b85948305/' }, photo: imgEsther },
      { name: 'Joshua Mchaina', role: 'ITE Student Chapter Supporting Leadership\nGraduate Research Assistant, UNF Transportation Lab', link: { label: 'LinkedIn', url: 'https://www.linkedin.com/in/joshua-mchaina-7a6292156/' }, photo: imgJoshua },
      { name: 'John Butoto', role: 'ITE Student Chapter Supporting Leadership\nGraduate Research Assistant, UNF Transportation Lab', link: { label: 'LinkedIn', url: 'https://www.linkedin.com/in/jrbutoto/' }, photo: imgJohn },
    ],
  },
];

export const scheduleData: ScheduleItem[] = [
  // Day 1: Friday, Feb 12
  { id: 's1', title: 'Team Prep', time: '12:00 PM', category: 'general', day: 1 },
  { id: 's2', title: 'Check-in', time: '1:30 - 4:30 PM', category: 'general', day: 1 },
  { id: 's3', title: 'Networking', time: '2:30 - 3:30 PM', category: 'career', day: 1 },
  { id: 's4', title: 'Resume Review or UNF Tour', time: '3:30 - 5:00 PM', category: 'career', day: 1 },
  { id: 's5', title: 'Off-Campus Dinner', time: '5:00 - 7:00 PM', category: 'social', day: 1 },

  // Day 2: Saturday, Feb 13
  { id: 's6', title: 'Breakfast', time: '7:30 - 8:30 AM', category: 'general', day: 2 },
  { id: 's7', title: 'Welcome Remarks', time: '8:30 - 9:00 AM', category: 'general', day: 2 },
  { id: 's8', title: 'Panel and Q&As', time: '9:00 - 10:15 AM', category: 'career', day: 2 },
  { id: 's9', title: 'Networking Break', time: '10:15 - 10:30 AM', category: 'social', day: 2 },
  { id: 's10', title: 'Workshop', time: '10:30 - 11:20 AM', category: 'career', day: 2, description: 'Career readiness, creating meaningful connections, and translating school work into projects.' },
  { id: 's11', title: 'Group Photo', time: '11:20 - 11:40 AM', category: 'social', day: 2 },
  { id: 's12', title: 'Keynote Speaker', time: '11:40 AM - 12:00 PM', category: 'general', day: 2 },
  { id: 's13', title: 'Lunch', time: '12:00 - 12:45 PM', category: 'general', day: 2 },
  { id: 's14', title: 'Breakout Workshop', time: '12:45 - 1:35 PM', category: 'career', day: 2, description: 'Resume preparation, communication improvement, interview preparation, and career path selection.' },
  { id: 's15', title: 'Networking Break', time: '1:35 - 2:00 PM', category: 'social', day: 2 },
  { id: 's16', title: 'ITE Traffic Bowl', time: '2:00 - 5:00 PM', category: 'competition', day: 2 },
  { id: 's17', title: 'Career Fair / Networking', time: '5:00 - 6:30 PM', category: 'career', day: 2 },
  { id: 's18', title: 'Dinner', time: '6:30 - 8:00 PM', category: 'social', day: 2 },
];

export const triviaQuestions: TriviaQuestion[] = [
  {
    id: 1,
    question: 'According to Federal Standards, what does the official acronym MUTCD stand for?',
    options: [
      'Model Unification of Traffic Control Designs',
      'Maximum Ultimate Traffic Capacity Density',
      'Manual on Uniform Traffic Control Devices',
      'Municipal Unit for Transit Coordination and Distribution'
    ],
    correctIndex: 2,
    explanation: 'The Manual on Uniform Traffic Control Devices (MUTCD) is published by the Federal Highway Administration (FHWA) and specifies standard traffic signs, road surface markings, and signals.'
  },
  {
    id: 2,
    question: 'Which innovative intersection pattern eliminates left turns across opposing traffic by flipping vehicle flow onto the opposite side of the road?',
    options: [
      'Continuous Flow Intersection',
      'Diverging Diamond Interchange (DDI)',
      'Single-Point Urban Interchange (SPUI)',
      'Modern Multi-Lane Roundabout'
    ],
    correctIndex: 1,
    explanation: 'A Diverging Diamond Interchange (DDI) moves traffic to the opposite side of the road temporarily, allowing for direct left turns onto highway entrance ramps without crossing opposing paths, vastly reducing collisions.'
  },
  {
    id: 3,
    question: 'Under AASHTO criteria, what standard color is designated for warning signs on highways to declare hazards ahead?',
    options: [
      'Fluorescent Pink',
      'Traffic Orange (for Construction)',
      'Vivid Yellow',
      'Interstate Green'
    ],
    correctIndex: 2,
    explanation: 'Yellow is the standard color background for warning signs conveying permanent physical hazard warnings (curves, intersections, lane endings), while orange is assigned for temporary construction zones.'
  },
  {
    id: 4,
    question: 'What is the Level of Service (LOS) score representation for an intersection with extreme delay, breakdown flow, and bumper-to-bumper density?',
    options: [
      'Level F',
      'Level E',
      'Level D',
      'Level X'
    ],
    correctIndex: 0,
    explanation: 'Level of Service (LOS) is rated from A (free flow) to F (complete gridlock, where demand exceeds capacity and queue delays are severe).'
  }
];

export const sponsorPackages: SponsorPackage[] = [
  {
    tier: 'Diamond',
    price: 2000,
    perks: [
      'Premier recognition with logo placement on the website, banners, and promotional materials',
      'Access to student resumes',
      'Career fair booth',
      'Social media mentions',
      'Workshop participation',
      'Acknowledgment during the SLS opening statement',
      '5 complimentary registrations',
    ],
  },
  {
    tier: 'Gold',
    price: 1500,
    perks: [
      'High-visibility logo placement on the website and promotional materials',
      'Social media mentions',
      'Access to student resumes',
      'Career fair booth',
      'Recognition during the SLS opening statement',
      '3 complimentary registrations',
    ],
  },
  {
    tier: 'Silver',
    price: 1000,
    perks: [
      'Organization logo placement on the website and promotional materials',
      'Social media mentions',
      'Access to student resumes',
      'A career fair booth',
      '1 complimentary registration',
    ],
  },
  {
    tier: 'Bronze',
    price: 500,
    perks: [
      'Logo featured on the website',
      'Selected promotional materials',
      'A social media post',
    ],
  },
];
