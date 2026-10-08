/**
 * Shared Type Declarations for the ITE SLS Website
 */

export interface ScheduleItem {
  id: string;
  title: string;
  time: string;
  speaker?: string;
  speakerTitle?: string;
  location: string;
  category: 'general' | 'technical' | 'career' | 'social' | 'competition';
  day: number; // 1, 2, or 3
  description: string;
}

export interface TriviaQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface Sponsor {
  id: string;
  name: string;
  tier: 'Diamond' | 'Platinum' | 'Gold' | 'Silver';
  industry: string;
}

export interface AttendeeRegistration {
  fullName: string;
  email: string;
  organization: string;
  dietaryRestrictions: string;
  tShirtSize: string;
  ticketType: 'student-member' | 'student-nonmember' | 'professional' | 'sponsor';
}

export interface GalleryItem {
  id: string;
  url: string;
  title: string;
  category: 'highlights' | 'competitions' | 'networking';
  uploadedBy?: string;
  date?: string;
  description?: string;
  isCustom?: boolean;
}
