import { ScheduleItem, TriviaQuestion, Sponsor } from './types';

export const scheduleData: ScheduleItem[] = [
  // Day 1: Friday, Feb 5
  {
    id: 's1',
    title: 'Summit Check-In & Registration Open',
    time: '12:30 PM - 2:00 PM',
    location: 'University Center Lobby, Adam W. Herbert University Center',
    category: 'general',
    day: 1,
    description: 'Arrive at the Adam W. Herbert University Center, pick up your summit badges, registration materials, custom T-shirt, and welcome packet. Coffee and light refreshments will be served.',
  },
  {
    id: 's2',
    title: 'State-Level Leadership Roundtable',
    time: '2:15 PM - 3:45 PM',
    speaker: 'District Student Activities Officers',
    speakerTitle: 'Florida-Puerto Rico ITE Executive Committee',
    location: 'University Center Meeting Room A',
    category: 'career',
    day: 1,
    description: 'An interactive leadership session designed to align student chapter officers with industry leadership frameworks. Learn best practices for recruiting, staging workshops, and building dynamic ITE student chapters.',
  },
  {
    id: 's3',
    title: 'Professional Micro-Mentorship & Speed Networking',
    time: '4:00 PM - 5:30 PM',
    speaker: 'Roundtable with 15+ Public & Private Agencies',
    location: 'University Center Ballroom B',
    category: 'career',
    day: 1,
    description: 'High-speed mentoring meeting! Get your resume reviewed, run through quick mock interviews, and receive direct career feedback from lead engineers and public agency HR managers active in Florida & Puerto Rico.',
  },
  {
    id: 's4',
    title: 'Welcome Reception & Sunset Networking Social',
    time: '6:00 PM - 8:30 PM',
    location: 'University Center Plaza / Osprey Plaza',
    category: 'social',
    day: 1,
    description: 'Kick off the Student Leadership Summit with delicious local Florida appetizers, a steel drum band, and team icebreakers. Reconnect with fellow students from other universities across the District.',
  },

  // Day 2: Saturday, Feb 6
  {
    id: 's5',
    title: 'Morning Breakfast & Fuel Station',
    time: '8:00 AM - 9:00 AM',
    location: 'University Center Ballroom Foyer',
    category: 'general',
    day: 2,
    description: 'Fuel up for our primary day of activities. Hot breakfast buffet, coffee, tea, and juice bar are open to all registered delegates.',
  },
  {
    id: 's6',
    title: 'Opening Plenary & Keynote Address',
    time: '9:00 AM - 10:15 AM',
    speaker: 'Hon. Manuel "Manny" Diaz, PE',
    speakerTitle: 'Senior Infrastructure Director & District Transit Consultant',
    location: 'University Center Ballroom A & B',
    category: 'general',
    day: 2,
    description: 'Opening remarks from UNF faculty and ITE District officers, followed by our Keynote: "Connected Networks – The Autonomous Horizon and Micro-Mobility Integration in Coastal Cities". Insights into modernizing vulnerable highway systems.',
  },
  {
    id: 's7',
    title: 'Technical Session: Smart Transit Solutions for Island & Coastal States',
    time: '10:30 AM - 11:45 AM',
    speaker: 'Dr. Alondra Rivera',
    speakerTitle: 'Research Chair, University of Puerto Rico - Mayagüez',
    location: 'University Center Meeting Room B',
    category: 'technical',
    day: 2,
    description: 'A deeply detailed panel exploring lessons in evacuation infrastructure routing, multi-modal disaster preparedness, and climate resilience projects linking mainland Florida hubs with Puerto Rico transit methodologies.',
  },
  {
    id: 's8',
    title: 'Luncheon & Student Research Poster Showcase',
    time: '12:00 PM - 1:30 PM',
    speaker: 'Student Presenters',
    location: 'University Center Ballroom C',
    category: 'competition',
    day: 2,
    description: 'Enjoy a premier plated lunch while evaluating cutting-edge academic posters from undergraduate and graduate researchers representing schools across our district. Cast your ballots for the People\'s Choice Award.',
  },
  {
    id: 's9',
    title: 'Interactive Career Panel: The Bridge to Professional Licensure',
    time: '1:45 PM - 3:00 PM',
    speaker: 'Panel of Regional Leaders',
    location: 'University Center Meeting Room A',
    category: 'career',
    day: 2,
    description: 'Learn the ins-and-outs of starting your professional life. Our panel of PE (Professional Engineer), PTOE (Professional Traffic Operations Engineer), and RSP (Road Safety Professional) designees break down exam preparation and career advancement.',
  },
  {
    id: 's10',
    title: 'District Collegiate Traffic Bowl Championship',
    time: '3:30 PM - 5:30 PM',
    speaker: 'Championship Teams from District Universities',
    location: 'University Center Amphitheater (Outdoor/Rain Location: University Center Ballroom)',
    category: 'competition',
    day: 2,
    description: 'The crowning event of the summit. Join us for a high-intensity, Jeopardy-style trivia championship where student teams test their speed and accuracy on transportation safety parameters, MUTCD codes, green book standards, and ITE protocols.',
  },
  {
    id: 's11',
    title: 'Grand Gala Dinner & SLS Awards Ceremony',
    time: '6:30 PM - 9:30 PM',
    location: 'Host Hotel Banquet Hall (Shuttles Provided)',
    category: 'social',
    day: 2,
    description: 'Celebrate our collective work in style at our premier evening gala. Featuring traditional Puerto Rican and Florida culinary fusions, live jazz, and the grand crowning of the Traffic Bowl Champions, Poster winners, and Chapter Excellence Awards.',
  },

  // Day 3: Sunday, Feb 7
  {
    id: 's12',
    title: 'Advisory Board Check-In & District Business Breakfast',
    time: '9:00 AM - 10:15 AM',
    speaker: 'District Student Officers',
    location: 'Student Union President\'s Dining Room',
    category: 'general',
    day: 3,
    description: 'A strategic coordination meeting discussing future summit hosts, budget proposals, district communication plans, and election structures for upcoming student officers.',
  },
  {
    id: 's13',
    title: 'Guided Technical Tour: Jacksonville Transit & Signal Control Center',
    time: '10:30 AM - 12:00 PM',
    speaker: 'Jacksonville Transportation Authority Guides',
    location: 'Meet at University Center Shuttle Dock',
    category: 'technical',
    day: 3,
    description: 'Hop on board our study bus. We will visit the regional transit center and receive exclusive access to the control deck watching active routing telemetry, dispatch schedules, and signal prioritization protocols.',
  },
  {
    id: 's14',
    title: 'Summit Closing Remarks & Adjournment',
    time: '12:00 PM - 12:30 PM',
    location: 'University Center Lobby',
    category: 'general',
    day: 3,
    description: 'Closing box lunches to-go, final photographs, official delegate exit checklist. See you in Puerto Rico next year!',
  }
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

export const sponsorList: Sponsor[] = [
  // Diamond Tier
  { id: 'sp1', name: 'Apex Traffic Solutions', tier: 'Diamond', industry: 'ITS Integration & Signal Engineering' },
  { id: 'sp2', name: 'First Coast Mobility Grid', tier: 'Diamond', industry: 'Public Transportation Advisory' },
  
  // Platinum Tier
  { id: 'sp3', name: 'Gulf Coast Civil & Transit', tier: 'Platinum', industry: 'Urban Planning & Structural Bridge Design' },
  { id: 'sp4', name: 'AeroVelo Intelligent Systems', tier: 'Platinum', industry: 'Autonomous Telemetry & EV Systems' },
  
  // Gold Tier
  { id: 'sp5', name: 'Sunshine State Engineering Partners', tier: 'Gold', industry: 'Environmental Transit Impact Assessment' },
  { id: 'sp6', name: 'Mayagüez Infrastructure Group', tier: 'Gold', industry: 'Coastal Geotechnical Engineering' },
  { id: 'sp7', name: 'Jacksonville Smartway Consulting', tier: 'Gold', industry: 'Micro-transit Planning & Demand Modeling' },
  
  // Silver Tier
  { id: 'sp8', name: 'Citrus Smart Corridors', tier: 'Silver', industry: 'Traffic Signal Optimization' },
  { id: 'sp9', name: 'Boricua Transportation Alliance', tier: 'Silver', industry: 'Transit Advocacy and Policy' },
  { id: 'sp10', name: 'Everglades Transit Builders', tier: 'Silver', industry: 'Highway Pavement Materials' },
  { id: 'sp11', name: 'SafeStreet Analytics', tier: 'Silver', industry: 'Vulnerable Roadway Safety Audits' },
];
