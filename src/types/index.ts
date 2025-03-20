export type Application = {
  id: string;
  created_at: string;
  user_id: string;
  company: string;
  position: string;
  location: string;
  date_applied: string;
  status: ApplicationStatus;
  url?: string | null;
  description?: string | null;
  is_archived: boolean;
};

export type ApplicationStatus =
  | "Applied"
  | "Screening call"
  | "Interviewing"
  | "Waiting offer"
  | "Got Offer"
  | "Accepted!"
  | "Declined"
  | "Rejected"
  | "Error";

export type StatusColor = {
  [key in ApplicationStatus]: {
    bg: string;
    text: string;
    dot: string;
  };
};

export type StatusGroup = "Active" | "Rejected" | "Archived";

export type ApplicationSummary = {
  totalApplications: number;
  positionsApplied: number;
  activeApplications: number;
  rejectedApplications: number;
  archivedApplications: number;
  offerReceived: number;
};

export type DateRange = {
  start: Date;
  end: Date;
};

export type ChartDataItem = {
  date: string;
  count: number;
  status?: ApplicationStatus;
};

export type User = {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
};
