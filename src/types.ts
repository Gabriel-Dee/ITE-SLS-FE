/**
 * Shared Type Declarations for the ITE SLS Website
 */

export interface ScheduleItem {
  id: string;
  title: string;
  time: string;
  speaker?: string;
  speakerTitle?: string;
  location?: string;
  category: 'general' | 'technical' | 'career' | 'social' | 'competition';
  day: number; // 1 or 2
  description?: string;
}

export interface TriviaQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export type SponsorTier = 'Diamond' | 'Gold' | 'Silver' | 'Bronze';

export interface SponsorPackage {
  tier: SponsorTier;
  price: number;
  perks: string[];
}

export interface AttendeeRegistration {
  fullName: string;
  email: string;
  organization: string;
  dietaryRestrictions: string;
  tShirtSize: string;
  ticketType: 'student-member' | 'student-nonmember' | 'professional' | 'sponsor';
}

export interface TeamMember {
  name: string;
  role: string;
  photo?: string; // imported image; initials show until there is one
}

export interface TeamGroup {
  title: string;
  members: TeamMember[];
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
