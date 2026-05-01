import "dotenv/config";
import { prisma } from "@repo/db";

async function EvenMoreSampleData() {
  // await generateSampleContentData();
  // await generateSampleEmployeeData();
  await evenMoreSampleData();
}

async function evenMoreSampleData() {
  //Content sample data
  await prisma.content.createMany({
    data: [
      {
        title: "actuarial quarterly reserve review template",
        url: "https://supabase.teamg/actuarial_quarterly_reserve_review.docx",
        contentOwner: "Liam Porter",
        forPosition: "ACTUARIAL_ANALYST",
        lastModifiedTime: new Date("2023-03-12"),
        expirationTime: new Date("2024-03-12"),
        contentType: "WORKFLOW",
        status: "IN_USE",
      },

      {
        title: "stochastic modeling assumptions catalog",
        url: "https://supabase.teamg/stochastic_modeling_assumptions.pdf",
        contentOwner: "Sophia Nguyen",
        forPosition: "ACTUARIAL_ANALYST",
        lastModifiedTime: new Date("2022-12-01"),
        expirationTime: new Date("2023-12-01"),
        contentType: "WORKFLOW",
        status: "AVAILABLE",
      },

      {
        title: "loss triangle validation checklist",
        url: "https://supabase.teamg/loss_triangle_validation.xlsx",
        contentOwner: "Ethan Brooks",
        forPosition: "ACTUARIAL_ANALYST",
        lastModifiedTime: new Date("2023-06-18"),
        expirationTime: new Date("2024-06-18"),
        contentType: "WORKFLOW",
        status: "IN_USE",
      },

      {
        title: "rate indication methodology overview",
        url: "https://supabase.teamg/rate_indication_methodology.pdf",
        contentOwner: "Olivia Carter",
        forPosition: "ACTUARIAL_ANALYST",
        lastModifiedTime: new Date("2023-01-09"),
        expirationTime: new Date("2024-01-09"),
        contentType: "WORKFLOW",
        status: "AVAILABLE",
      },

      {
        title: "credibility factor reference sheet",
        url: "https://supabase.teamg/credibility_factor_reference.xlsx",
        contentOwner: "Noah Kim",
        forPosition: "ACTUARIAL_ANALYST",
        lastModifiedTime: new Date("2022-10-22"),
        expirationTime: new Date("2023-10-22"),
        contentType: "WORKFLOW",
        status: "UNAVAILABLE",
      },

      {
        title: "actuarial peer review guidelines",
        url: "https://supabase.teamg/actuarial_peer_review_guidelines.docx",
        contentOwner: "Ava Thompson",
        forPosition: "ACTUARIAL_ANALYST",
        lastModifiedTime: new Date("2023-04-03"),
        expirationTime: new Date("2024-04-03"),
        contentType: "WORKFLOW",
        status: "IN_USE",
      },

      {
        title: "trend factor selection workbook",
        url: "https://supabase.teamg/trend_factor_selection.xlsm",
        contentOwner: "Mason Rivera",
        forPosition: "ACTUARIAL_ANALYST",
        lastModifiedTime: new Date("2023-07-14"),
        expirationTime: new Date("2024-07-14"),
        contentType: "WORKFLOW",
        status: "AVAILABLE",
      },

      {
        title: "reserve variability analysis toolkit",
        url: "https://supabase.teamg/reserve_variability_toolkit.xlsx",
        contentOwner: "Isabella Flores",
        forPosition: "ACTUARIAL_ANALYST",
        lastModifiedTime: new Date("2022-09-05"),
        expirationTime: new Date("2023-09-05"),
        contentType: "WORKFLOW",
        status: "UNAVAILABLE",
      },

      {
        title: "premium trend monitoring dashboard",
        url: "https://supabase.teamg/premium_trend_dashboard.xlsx",
        contentOwner: "James Walker",
        forPosition: "ACTUARIAL_ANALYST",
        lastModifiedTime: new Date("2023-02-27"),
        expirationTime: new Date("2024-02-27"),
        contentType: "WORKFLOW",
        status: "IN_USE",
      },

      {
        title: "actuarial audit preparation packet",
        url: "https://supabase.teamg/actuarial_audit_prep.pdf",
        contentOwner: "Mia Johnson",
        forPosition: "ACTUARIAL_ANALYST",
        lastModifiedTime: new Date("2023-03-30"),
        expirationTime: new Date("2024-03-30"),
        contentType: "WORKFLOW",
        status: "AVAILABLE",
      },

      {
        title: "loss emergence monitoring sheet",
        url: "https://supabase.teamg/loss_emergence_monitoring.xlsx",
        contentOwner: "Benjamin Scott",
        forPosition: "ACTUARIAL_ANALYST",
        lastModifiedTime: new Date("2022-11-18"),
        expirationTime: new Date("2023-11-18"),
        contentType: "WORKFLOW",
        status: "UNAVAILABLE",
      },

      {
        title: "exposure base selection guide",
        url: "https://supabase.teamg/exposure_base_selection.pdf",
        contentOwner: "Charlotte Adams",
        forPosition: "ACTUARIAL_ANALYST",
        lastModifiedTime: new Date("2023-05-11"),
        expirationTime: new Date("2024-05-11"),
        contentType: "WORKFLOW",
        status: "IN_USE",
      },

      {
        title: "actuarial data validation SOP",
        url: "https://supabase.teamg/actuarial_data_validation_sop.docx",
        contentOwner: "Henry Martinez",
        forPosition: "ACTUARIAL_ANALYST",
        lastModifiedTime: new Date("2023-06-02"),
        expirationTime: new Date("2024-06-02"),
        contentType: "WORKFLOW",
        status: "AVAILABLE",
      },

      {
        title: "reserve roll-forward automation sheet",
        url: "https://supabase.teamg/reserve_rollforward.xlsm",
        contentOwner: "Amelia Brooks",
        forPosition: "ACTUARIAL_ANALYST",
        lastModifiedTime: new Date("2022-08-29"),
        expirationTime: new Date("2023-08-29"),
        contentType: "WORKFLOW",
        status: "UNAVAILABLE",
      },

      {
        title: "actuarial workflow onboarding packet",
        url: "https://supabase.teamg/actuarial_onboarding_packet.pdf",
        contentOwner: "Lucas Bennett",
        forPosition: "ACTUARIAL_ANALYST",
        lastModifiedTime: new Date("2023-01-20"),
        expirationTime: new Date("2024-01-20"),
        contentType: "WORKFLOW",
        status: "IN_USE",
      },
      {
        title: "claims intake processing SOP",
        url: "https://supabase.teamg/claims_intake_processing.pdf",
        contentOwner: "Riley Morgan",
        forPosition: "EXL_OPERATIONS",
        lastModifiedTime: new Date("2023-04-15"),
        expirationTime: new Date("2024-04-15"),
        contentType: "WORKFLOW",
        status: "IN_USE",
      },

      {
        title: "policy document indexing guide",
        url: "https://supabase.teamg/policy_indexing_guide.docx",
        contentOwner: "Harper Diaz",
        forPosition: "EXL_OPERATIONS",
        lastModifiedTime: new Date("2023-02-02"),
        expirationTime: new Date("2024-02-02"),
        contentType: "WORKFLOW",
        status: "AVAILABLE",
      },

      {
        title: "claims routing matrix",
        url: "https://supabase.teamg/claims_routing_matrix.xlsx",
        contentOwner: "Aiden Murphy",
        forPosition: "EXL_OPERATIONS",
        lastModifiedTime: new Date("2022-10-10"),
        expirationTime: new Date("2023-10-10"),
        contentType: "WORKFLOW",
        status: "UNAVAILABLE",
      },

      {
        title: "document quality assurance checklist",
        url: "https://supabase.teamg/document_qa_checklist.pdf",
        contentOwner: "Ella Simmons",
        forPosition: "EXL_OPERATIONS",
        lastModifiedTime: new Date("2023-06-09"),
        expirationTime: new Date("2024-06-09"),
        contentType: "WORKFLOW",
        status: "IN_USE",
      },

      {
        title: "claims escalation workflow",
        url: "https://supabase.teamg/claims_escalation_workflow.docx",
        contentOwner: "Logan Price",
        forPosition: "EXL_OPERATIONS",
        lastModifiedTime: new Date("2023-03-01"),
        expirationTime: new Date("2024-03-01"),
        contentType: "WORKFLOW",
        status: "AVAILABLE",
      },

      {
        title: "policy data correction request form",
        url: "https://supabase.teamg/policy_data_correction_form.pdf",
        contentOwner: "Zoe Ramirez",
        forPosition: "EXL_OPERATIONS",
        lastModifiedTime: new Date("2022-09-14"),
        expirationTime: new Date("2023-09-14"),
        contentType: "WORKFLOW",
        status: "UNAVAILABLE",
      },

      {
        title: "claims batch processing instructions",
        url: "https://supabase.teamg/claims_batch_processing.docx",
        contentOwner: "Jackson Reed",
        forPosition: "EXL_OPERATIONS",
        lastModifiedTime: new Date("2023-05-21"),
        expirationTime: new Date("2024-05-21"),
        contentType: "WORKFLOW",
        status: "IN_USE",
      },

      {
        title: "policy renewal verification checklist",
        url: "https://supabase.teamg/policy_renewal_verification.xlsx",
        contentOwner: "Lily Cooper",
        forPosition: "EXL_OPERATIONS",
        lastModifiedTime: new Date("2023-01-17"),
        expirationTime: new Date("2024-01-17"),
        contentType: "WORKFLOW",
        status: "AVAILABLE",
      },

      {
        title: "claims documentation standards",
        url: "https://supabase.teamg/claims_documentation_standards.pdf",
        contentOwner: "Wyatt Turner",
        forPosition: "EXL_OPERATIONS",
        lastModifiedTime: new Date("2022-11-29"),
        expirationTime: new Date("2023-11-29"),
        contentType: "WORKFLOW",
        status: "UNAVAILABLE",
      },

      {
        title: "policy workflow onboarding packet",
        url: "https://supabase.teamg/policy_workflow_onboarding.pdf",
        contentOwner: "Aria Mitchell",
        forPosition: "EXL_OPERATIONS",
        lastModifiedTime: new Date("2023-02-25"),
        expirationTime: new Date("2024-02-25"),
        contentType: "WORKFLOW",
        status: "IN_USE",
      },

      {
        title: "claims audit preparation guide",
        url: "https://supabase.teamg/claims_audit_prep.docx",
        contentOwner: "Sebastian Hayes",
        forPosition: "EXL_OPERATIONS",
        lastModifiedTime: new Date("2023-04-28"),
        expirationTime: new Date("2024-04-28"),
        contentType: "WORKFLOW",
        status: "AVAILABLE",
      },

      {
        title: "policy correction workflow map",
        url: "https://supabase.teamg/policy_correction_workflow.pdf",
        contentOwner: "Nora Phillips",
        forPosition: "EXL_OPERATIONS",
        lastModifiedTime: new Date("2022-08-30"),
        expirationTime: new Date("2023-08-30"),
        contentType: "WORKFLOW",
        status: "UNAVAILABLE",
      },

      {
        title: "claims intake triage guide",
        url: "https://supabase.teamg/claims_intake_triage.pdf",
        contentOwner: "Gabriel Foster",
        forPosition: "EXL_OPERATIONS",
        lastModifiedTime: new Date("2023-03-19"),
        expirationTime: new Date("2024-03-19"),
        contentType: "WORKFLOW",
        status: "IN_USE",
      },

      {
        title: "policy workflow exception handling",
        url: "https://supabase.teamg/policy_exception_handling.docx",
        contentOwner: "Hannah Ward",
        forPosition: "EXL_OPERATIONS",
        lastModifiedTime: new Date("2023-01-05"),
        expirationTime: new Date("2024-01-05"),
        contentType: "WORKFLOW",
        status: "AVAILABLE",
      },

      {
        title: "claims processing onboarding packet",
        url: "https://supabase.teamg/claims_processing_onboarding.pdf",
        contentOwner: "Elijah Morris",
        forPosition: "EXL_OPERATIONS",
        lastModifiedTime: new Date("2022-12-20"),
        expirationTime: new Date("2023-12-20"),
        contentType: "WORKFLOW",
        status: "UNAVAILABLE",
      },
      {
        title: "rating workflow overview",
        url: "https://supabase.teamg/rating_workflow_overview.pdf",
        contentOwner: "Natalie Brooks",
        forPosition: "BUSINESS_OP_RATING",
        lastModifiedTime: new Date("2023-04-11"),
        expirationTime: new Date("2024-04-11"),
        contentType: "WORKFLOW",
        status: "IN_USE",
      },

      {
        title: "rating factor update checklist",
        url: "https://supabase.teamg/rating_factor_update.xlsx",
        contentOwner: "Connor Hayes",
        forPosition: "BUSINESS_OP_RATING",
        lastModifiedTime: new Date("2023-02-08"),
        expirationTime: new Date("2024-02-08"),
        contentType: "WORKFLOW",
        status: "AVAILABLE",
      },

      {
        title: "rating exception handling guide",
        url: "https://supabase.teamg/rating_exception_handling.docx",
        contentOwner: "Madison Lee",
        forPosition: "BUSINESS_OP_RATING",
        lastModifiedTime: new Date("2022-11-03"),
        expirationTime: new Date("2023-11-03"),
        contentType: "WORKFLOW",
        status: "UNAVAILABLE",
      },

      {
        title: "rating audit preparation packet",
        url: "https://supabase.teamg/rating_audit_prep.pdf",
        contentOwner: "Owen Carter",
        forPosition: "BUSINESS_OP_RATING",
        lastModifiedTime: new Date("2023-05-12"),
        expirationTime: new Date("2024-05-12"),
        contentType: "WORKFLOW",
        status: "IN_USE",
      },

      {
        title: "rating model input validation sheet",
        url: "https://supabase.teamg/rating_input_validation.xlsx",
        contentOwner: "Aubrey King",
        forPosition: "BUSINESS_OP_RATING",
        lastModifiedTime: new Date("2023-01-22"),
        expirationTime: new Date("2024-01-22"),
        contentType: "WORKFLOW",
        status: "AVAILABLE",
      },

      {
        title: "rating workflow onboarding packet",
        url: "https://supabase.teamg/rating_onboarding_packet.pdf",
        contentOwner: "Julian Rivera",
        forPosition: "BUSINESS_OP_RATING",
        lastModifiedTime: new Date("2022-09-27"),
        expirationTime: new Date("2023-09-27"),
        contentType: "WORKFLOW",
        status: "UNAVAILABLE",
      },

      {
        title: "rating factor documentation standards",
        url: "https://supabase.teamg/rating_factor_standards.docx",
        contentOwner: "Scarlett Hughes",
        forPosition: "BUSINESS_OP_RATING",
        lastModifiedTime: new Date("2023-03-06"),
        expirationTime: new Date("2024-03-06"),
        contentType: "WORKFLOW",
        status: "IN_USE",
      },

      {
        title: "rating worksheet automation template",
        url: "https://supabase.teamg/rating_worksheet_automation.xlsm",
        contentOwner: "Grayson Powell",
        forPosition: "BUSINESS_OP_RATING",
        lastModifiedTime: new Date("2023-06-01"),
        expirationTime: new Date("2024-06-01"),
        contentType: "WORKFLOW",
        status: "AVAILABLE",
      },

      {
        title: "rating factor change log",
        url: "https://supabase.teamg/rating_factor_change_log.xlsx",
        contentOwner: "Victoria Allen",
        forPosition: "BUSINESS_OP_RATING",
        lastModifiedTime: new Date("2022-10-19"),
        expirationTime: new Date("2023-10-19"),
        contentType: "WORKFLOW",
        status: "UNAVAILABLE",
      },

      {
        title: "rating workflow exception matrix",
        url: "https://supabase.teamg/rating_exception_matrix.pdf",
        contentOwner: "Leo Barnes",
        forPosition: "BUSINESS_OP_RATING",
        lastModifiedTime: new Date("2023-02-14"),
        expirationTime: new Date("2024-02-14"),
        contentType: "WORKFLOW",
        status: "IN_USE",
      },

      {
        title: "rating model QA checklist",
        url: "https://supabase.teamg/rating_model_qa.xlsx",
        contentOwner: "Penelope Gray",
        forPosition: "BUSINESS_OP_RATING",
        lastModifiedTime: new Date("2023-04-02"),
        expirationTime: new Date("2024-04-02"),
        contentType: "WORKFLOW",
        status: "AVAILABLE",
      },
      {
        title: "rating data intake validation workflow",
        url: "https://supabase.teamg/rating_data_intake_validation.xlsx",
        contentOwner: "Evelyn Sharp",
        forPosition: "BUSINESS_OP_RATING",
        lastModifiedTime: new Date("2023-03-27"),
        expirationTime: new Date("2024-03-27"),
        contentType: "WORKFLOW",
        status: "IN_USE",
      },

      {
        title: "rating factor governance handbook",
        url: "https://supabase.teamg/rating_factor_governance.pdf",
        contentOwner: "Dylan Matthews",
        forPosition: "BUSINESS_OP_RATING",
        lastModifiedTime: new Date("2022-12-08"),
        expirationTime: new Date("2023-12-08"),
        contentType: "WORKFLOW",
        status: "AVAILABLE",
      },

      {
        title: "rating workflow compliance checklist",
        url: "https://supabase.teamg/rating_workflow_compliance.xlsx",
        contentOwner: "Jasmine Patel",
        forPosition: "BUSINESS_OP_RATING",
        lastModifiedTime: new Date("2023-01-31"),
        expirationTime: new Date("2024-01-31"),
        contentType: "WORKFLOW",
        status: "UNAVAILABLE",
      },

      {
        title: "rating model documentation index",
        url: "https://supabase.teamg/rating_model_documentation_index.docx",
        contentOwner: "Caleb Foster",
        forPosition: "BUSINESS_OP_RATING",
        lastModifiedTime: new Date("2023-04-04"),
        expirationTime: new Date("2024-04-04"),
        contentType: "WORKFLOW",
        status: "IN_USE",
      },
    ],
  });
}
EvenMoreSampleData()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
