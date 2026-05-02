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
  fileType: string | null;
  contentType: string | null;
  status: string;
}

export interface ReviewClaimRequestor {
  uuid: string;
  firstName: string;
  lastName: string;
  corporateEmail: string;
}

export interface ReviewClaimRecord {
  uuid: string;
  claimType: string;
  incidentDate: string;
  incidentDescription: string;
  status: string;
  createdAt: string;
  requestor: ReviewClaimRequestor;
  contents: ReviewClaimContent[];
  comment: string | null;
}
