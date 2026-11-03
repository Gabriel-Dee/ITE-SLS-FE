import { GalleryItem } from './types';
import highlightsAI from './assets/images/event_highlights_sh_1781725533655.jpg';
import competitionsAI from './assets/images/traffic_bowl_teams.webp';
import networkingAI from './assets/images/networking_sh_1781725561546.jpg';
import unfHostAI from './assets/images/unf_host_sh_1781725574904.jpg';

export const initialGallery: GalleryItem[] = [
  {
    id: 'g1',
    url: highlightsAI,
    title: 'Keynote Plenary Session',
    category: 'highlights',
    uploadedBy: 'District Secretary',
    date: 'Feb 13, 2027',
    description:
      'Dr. Rivera delivering the opening keynote address on coastal transit evacuations and autonomous vehicle lanes.',
  },
  {
    id: 'g2',
    url: competitionsAI,
    title: 'Collegiate Traffic Bowl Finals',
    category: 'competitions',
    uploadedBy: 'Traffic Bowl Coordinator',
    date: 'Feb 13, 2027',
    description:
      'FAMU-FSU, FAU, and UF teams at their buzzer tables with delegates after a Collegiate Traffic Bowl round.',
  },
  {
    id: 'g3',
    url: networkingAI,
    title: 'Micro-Mentorship Speed Session',
    category: 'networking',
    uploadedBy: 'Gala Host',
    date: 'Feb 12, 2027',
    description:
      'Undergraduate engineering delegates reviewing resumes with transit chiefs and district agency HR teams.',
  },
  {
    id: 'g4',
    url: unfHostAI,
    title: 'Host Campus Reception',
    category: 'highlights',
    uploadedBy: 'UNF Host Committee',
    date: 'Feb 12, 2027',
    description: 'Campus welcome for Florida–Puerto Rico District student chapters.',
  },
  {
    id: 'g5',
    url: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80',
    title: 'Engineering Technical Poster Contest',
    category: 'competitions',
    uploadedBy: 'District Poster Judge',
    date: 'Feb 13, 2027',
    description:
      'Attendees evaluating innovative graduate engineering research designs during the midday evaluation period.',
  },
  {
    id: 'g6',
    url: 'https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&w=800&q=80',
    title: 'Gala Sunset Awards Social',
    category: 'networking',
    uploadedBy: 'Social Director',
    date: 'Feb 13, 2027',
    description:
      'Florida and Puerto Rico chapters celebrating accomplishments at the host hotel banquet hall.',
  },
  {
    id: 'g7',
    url: 'https://images.unsplash.com/photo-1474487548417-781cb71495f3?auto=format&fit=crop&w=800&q=80',
    title: 'Field Technical Tour: APM Controls',
    category: 'highlights',
    uploadedBy: 'Transportation Guide',
    date: 'Feb 13, 2027',
    description:
      'Technical delegates observing signal prioritization telemetry in the local transportation dispatch tower.',
  },
  {
    id: 'g8',
    url: 'https://images.unsplash.com/photo-1513828729020-0ac45e83e6e8?auto=format&fit=crop&w=800&q=80',
    title: 'Traffic Engineering Icebreakers',
    category: 'networking',
    uploadedBy: 'UNF Host Committee',
    date: 'Feb 12, 2027',
    description:
      'First day icebreaker games recreating multi-stage roundabout flows in the Student Union plaza.',
  },
];

export const unfTeaserInfo = {
  title: 'ITE SLS 2027 · UNF Ospreys',
  campus: 'University of North Florida',
  url: unfHostAI,
  image: unfHostAI,
  description:
    'Welcome to Jacksonville: the University of North Florida Ospreys are proud to host the Florida–Puerto Rico District Student Leadership Summit.',
  blurb:
    'Student chapters across the district are invited to Jacksonville for the UNF-hosted summit.',
};
