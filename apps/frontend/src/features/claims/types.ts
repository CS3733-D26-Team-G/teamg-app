export const CLAIM_TYPE_LABELS = {
  AUTO: "Auto",
  PROPERTY_DAMAGE: "Property Damage",
  MEDICAL: "Medical",
  LIABILITY: "Liability",
  WORKERS_COMPENSATION: "Workers' Compensation",
  THEFT: "Theft",
  NATURAL_DISASTER: "Natural Disaster",
  OTHER: "Other",
} as const;

export type ReviewClaimType = keyof typeof CLAIM_TYPE_LABELS;

export interface ReviewClaimContent {
  uuid: string;
  title: string;
  url: string;
  file_type: string | null;
  content_type: string | null;
  status: string;
}

export interface ReviewClaimRequestor {
  uuid: string;
  first_name: string;
  last_name: string;
  corporate_email: string;
}

export interface ReviewClaimRecord {
  uuid: string;
  claim_type: string;
  incident_date: string;
  incident_description: string;
  status: string;
  createdAt: string;
  requestor: ReviewClaimRequestor;
  contents: ReviewClaimContent[];
}
