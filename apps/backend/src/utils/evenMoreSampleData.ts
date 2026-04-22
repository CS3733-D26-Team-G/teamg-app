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
        content_owner: "Liam Porter",
        for_position: "ACTUARIAL_ANALYST",
        last_modified_time: new Date("2023-03-12"),
        expiration_time: new Date("2024-03-12"),
        content_type: "WORKFLOW",
        status: "IN_USE",
      },

      {
        title: "stochastic modeling assumptions catalog",
        url: "https://supabase.teamg/stochastic_modeling_assumptions.pdf",
        content_owner: "Sophia Nguyen",
        for_position: "ACTUARIAL_ANALYST",
        last_modified_time: new Date("2022-12-01"),
        expiration_time: new Date("2023-12-01"),
        content_type: "WORKFLOW",
        status: "AVAILABLE",
      },

      {
        title: "loss triangle validation checklist",
        url: "https://supabase.teamg/loss_triangle_validation.xlsx",
        content_owner: "Ethan Brooks",
        for_position: "ACTUARIAL_ANALYST",
        last_modified_time: new Date("2023-06-18"),
        expiration_time: new Date("2024-06-18"),
        content_type: "WORKFLOW",
        status: "IN_USE",
      },

      {
        title: "rate indication methodology overview",
        url: "https://supabase.teamg/rate_indication_methodology.pdf",
        content_owner: "Olivia Carter",
        for_position: "ACTUARIAL_ANALYST",
        last_modified_time: new Date("2023-01-09"),
        expiration_time: new Date("2024-01-09"),
        content_type: "WORKFLOW",
        status: "AVAILABLE",
      },

      {
        title: "credibility factor reference sheet",
        url: "https://supabase.teamg/credibility_factor_reference.xlsx",
        content_owner: "Noah Kim",
        for_position: "ACTUARIAL_ANALYST",
        last_modified_time: new Date("2022-10-22"),
        expiration_time: new Date("2023-10-22"),
        content_type: "WORKFLOW",
        status: "UNAVAILABLE",
      },

      {
        title: "actuarial peer review guidelines",
        url: "https://supabase.teamg/actuarial_peer_review_guidelines.docx",
        content_owner: "Ava Thompson",
        for_position: "ACTUARIAL_ANALYST",
        last_modified_time: new Date("2023-04-03"),
        expiration_time: new Date("2024-04-03"),
        content_type: "WORKFLOW",
        status: "IN_USE",
      },

      {
        title: "trend factor selection workbook",
        url: "https://supabase.teamg/trend_factor_selection.xlsm",
        content_owner: "Mason Rivera",
        for_position: "ACTUARIAL_ANALYST",
        last_modified_time: new Date("2023-07-14"),
        expiration_time: new Date("2024-07-14"),
        content_type: "WORKFLOW",
        status: "AVAILABLE",
      },

      {
        title: "reserve variability analysis toolkit",
        url: "https://supabase.teamg/reserve_variability_toolkit.xlsx",
        content_owner: "Isabella Flores",
        for_position: "ACTUARIAL_ANALYST",
        last_modified_time: new Date("2022-09-05"),
        expiration_time: new Date("2023-09-05"),
        content_type: "WORKFLOW",
        status: "UNAVAILABLE",
      },

      {
        title: "premium trend monitoring dashboard",
        url: "https://supabase.teamg/premium_trend_dashboard.xlsx",
        content_owner: "James Walker",
        for_position: "ACTUARIAL_ANALYST",
        last_modified_time: new Date("2023-02-27"),
        expiration_time: new Date("2024-02-27"),
        content_type: "WORKFLOW",
        status: "IN_USE",
      },

      {
        title: "actuarial audit preparation packet",
        url: "https://supabase.teamg/actuarial_audit_prep.pdf",
        content_owner: "Mia Johnson",
        for_position: "ACTUARIAL_ANALYST",
        last_modified_time: new Date("2023-03-30"),
        expiration_time: new Date("2024-03-30"),
        content_type: "WORKFLOW",
        status: "AVAILABLE",
      },

      {
        title: "loss emergence monitoring sheet",
        url: "https://supabase.teamg/loss_emergence_monitoring.xlsx",
        content_owner: "Benjamin Scott",
        for_position: "ACTUARIAL_ANALYST",
        last_modified_time: new Date("2022-11-18"),
        expiration_time: new Date("2023-11-18"),
        content_type: "WORKFLOW",
        status: "UNAVAILABLE",
      },

      {
        title: "exposure base selection guide",
        url: "https://supabase.teamg/exposure_base_selection.pdf",
        content_owner: "Charlotte Adams",
        for_position: "ACTUARIAL_ANALYST",
        last_modified_time: new Date("2023-05-11"),
        expiration_time: new Date("2024-05-11"),
        content_type: "WORKFLOW",
        status: "IN_USE",
      },

      {
        title: "actuarial data validation SOP",
        url: "https://supabase.teamg/actuarial_data_validation_sop.docx",
        content_owner: "Henry Martinez",
        for_position: "ACTUARIAL_ANALYST",
        last_modified_time: new Date("2023-06-02"),
        expiration_time: new Date("2024-06-02"),
        content_type: "WORKFLOW",
        status: "AVAILABLE",
      },

      {
        title: "reserve roll-forward automation sheet",
        url: "https://supabase.teamg/reserve_rollforward.xlsm",
        content_owner: "Amelia Brooks",
        for_position: "ACTUARIAL_ANALYST",
        last_modified_time: new Date("2022-08-29"),
        expiration_time: new Date("2023-08-29"),
        content_type: "WORKFLOW",
        status: "UNAVAILABLE",
      },

      {
        title: "actuarial workflow onboarding packet",
        url: "https://supabase.teamg/actuarial_onboarding_packet.pdf",
        content_owner: "Lucas Bennett",
        for_position: "ACTUARIAL_ANALYST",
        last_modified_time: new Date("2023-01-20"),
        expiration_time: new Date("2024-01-20"),
        content_type: "WORKFLOW",
        status: "IN_USE",
      },
      {
        title: "claims intake processing SOP",
        url: "https://supabase.teamg/claims_intake_processing.pdf",
        content_owner: "Riley Morgan",
        for_position: "EXL_OPERATIONS",
        last_modified_time: new Date("2023-04-15"),
        expiration_time: new Date("2024-04-15"),
        content_type: "WORKFLOW",
        status: "IN_USE",
      },

      {
        title: "policy document indexing guide",
        url: "https://supabase.teamg/policy_indexing_guide.docx",
        content_owner: "Harper Diaz",
        for_position: "EXL_OPERATIONS",
        last_modified_time: new Date("2023-02-02"),
        expiration_time: new Date("2024-02-02"),
        content_type: "WORKFLOW",
        status: "AVAILABLE",
      },

      {
        title: "claims routing matrix",
        url: "https://supabase.teamg/claims_routing_matrix.xlsx",
        content_owner: "Aiden Murphy",
        for_position: "EXL_OPERATIONS",
        last_modified_time: new Date("2022-10-10"),
        expiration_time: new Date("2023-10-10"),
        content_type: "WORKFLOW",
        status: "UNAVAILABLE",
      },

      {
        title: "document quality assurance checklist",
        url: "https://supabase.teamg/document_qa_checklist.pdf",
        content_owner: "Ella Simmons",
        for_position: "EXL_OPERATIONS",
        last_modified_time: new Date("2023-06-09"),
        expiration_time: new Date("2024-06-09"),
        content_type: "WORKFLOW",
        status: "IN_USE",
      },

      {
        title: "claims escalation workflow",
        url: "https://supabase.teamg/claims_escalation_workflow.docx",
        content_owner: "Logan Price",
        for_position: "EXL_OPERATIONS",
        last_modified_time: new Date("2023-03-01"),
        expiration_time: new Date("2024-03-01"),
        content_type: "WORKFLOW",
        status: "AVAILABLE",
      },

      {
        title: "policy data correction request form",
        url: "https://supabase.teamg/policy_data_correction_form.pdf",
        content_owner: "Zoe Ramirez",
        for_position: "EXL_OPERATIONS",
        last_modified_time: new Date("2022-09-14"),
        expiration_time: new Date("2023-09-14"),
        content_type: "WORKFLOW",
        status: "UNAVAILABLE",
      },

      {
        title: "claims batch processing instructions",
        url: "https://supabase.teamg/claims_batch_processing.docx",
        content_owner: "Jackson Reed",
        for_position: "EXL_OPERATIONS",
        last_modified_time: new Date("2023-05-21"),
        expiration_time: new Date("2024-05-21"),
        content_type: "WORKFLOW",
        status: "IN_USE",
      },

      {
        title: "policy renewal verification checklist",
        url: "https://supabase.teamg/policy_renewal_verification.xlsx",
        content_owner: "Lily Cooper",
        for_position: "EXL_OPERATIONS",
        last_modified_time: new Date("2023-01-17"),
        expiration_time: new Date("2024-01-17"),
        content_type: "WORKFLOW",
        status: "AVAILABLE",
      },

      {
        title: "claims documentation standards",
        url: "https://supabase.teamg/claims_documentation_standards.pdf",
        content_owner: "Wyatt Turner",
        for_position: "EXL_OPERATIONS",
        last_modified_time: new Date("2022-11-29"),
        expiration_time: new Date("2023-11-29"),
        content_type: "WORKFLOW",
        status: "UNAVAILABLE",
      },

      {
        title: "policy workflow onboarding packet",
        url: "https://supabase.teamg/policy_workflow_onboarding.pdf",
        content_owner: "Aria Mitchell",
        for_position: "EXL_OPERATIONS",
        last_modified_time: new Date("2023-02-25"),
        expiration_time: new Date("2024-02-25"),
        content_type: "WORKFLOW",
        status: "IN_USE",
      },

      {
        title: "claims audit preparation guide",
        url: "https://supabase.teamg/claims_audit_prep.docx",
        content_owner: "Sebastian Hayes",
        for_position: "EXL_OPERATIONS",
        last_modified_time: new Date("2023-04-28"),
        expiration_time: new Date("2024-04-28"),
        content_type: "WORKFLOW",
        status: "AVAILABLE",
      },

      {
        title: "policy correction workflow map",
        url: "https://supabase.teamg/policy_correction_workflow.pdf",
        content_owner: "Nora Phillips",
        for_position: "EXL_OPERATIONS",
        last_modified_time: new Date("2022-08-30"),
        expiration_time: new Date("2023-08-30"),
        content_type: "WORKFLOW",
        status: "UNAVAILABLE",
      },

      {
        title: "claims intake triage guide",
        url: "https://supabase.teamg/claims_intake_triage.pdf",
        content_owner: "Gabriel Foster",
        for_position: "EXL_OPERATIONS",
        last_modified_time: new Date("2023-03-19"),
        expiration_time: new Date("2024-03-19"),
        content_type: "WORKFLOW",
        status: "IN_USE",
      },

      {
        title: "policy workflow exception handling",
        url: "https://supabase.teamg/policy_exception_handling.docx",
        content_owner: "Hannah Ward",
        for_position: "EXL_OPERATIONS",
        last_modified_time: new Date("2023-01-05"),
        expiration_time: new Date("2024-01-05"),
        content_type: "WORKFLOW",
        status: "AVAILABLE",
      },

      {
        title: "claims processing onboarding packet",
        url: "https://supabase.teamg/claims_processing_onboarding.pdf",
        content_owner: "Elijah Morris",
        for_position: "EXL_OPERATIONS",
        last_modified_time: new Date("2022-12-20"),
        expiration_time: new Date("2023-12-20"),
        content_type: "WORKFLOW",
        status: "UNAVAILABLE",
      },
      {
        title: "rating workflow overview",
        url: "https://supabase.teamg/rating_workflow_overview.pdf",
        content_owner: "Natalie Brooks",
        for_position: "BUSINESS_OP_RATING",
        last_modified_time: new Date("2023-04-11"),
        expiration_time: new Date("2024-04-11"),
        content_type: "WORKFLOW",
        status: "IN_USE",
      },

      {
        title: "rating factor update checklist",
        url: "https://supabase.teamg/rating_factor_update.xlsx",
        content_owner: "Connor Hayes",
        for_position: "BUSINESS_OP_RATING",
        last_modified_time: new Date("2023-02-08"),
        expiration_time: new Date("2024-02-08"),
        content_type: "WORKFLOW",
        status: "AVAILABLE",
      },

      {
        title: "rating exception handling guide",
        url: "https://supabase.teamg/rating_exception_handling.docx",
        content_owner: "Madison Lee",
        for_position: "BUSINESS_OP_RATING",
        last_modified_time: new Date("2022-11-03"),
        expiration_time: new Date("2023-11-03"),
        content_type: "WORKFLOW",
        status: "UNAVAILABLE",
      },

      {
        title: "rating audit preparation packet",
        url: "https://supabase.teamg/rating_audit_prep.pdf",
        content_owner: "Owen Carter",
        for_position: "BUSINESS_OP_RATING",
        last_modified_time: new Date("2023-05-12"),
        expiration_time: new Date("2024-05-12"),
        content_type: "WORKFLOW",
        status: "IN_USE",
      },

      {
        title: "rating model input validation sheet",
        url: "https://supabase.teamg/rating_input_validation.xlsx",
        content_owner: "Aubrey King",
        for_position: "BUSINESS_OP_RATING",
        last_modified_time: new Date("2023-01-22"),
        expiration_time: new Date("2024-01-22"),
        content_type: "WORKFLOW",
        status: "AVAILABLE",
      },

      {
        title: "rating workflow onboarding packet",
        url: "https://supabase.teamg/rating_onboarding_packet.pdf",
        content_owner: "Julian Rivera",
        for_position: "BUSINESS_OP_RATING",
        last_modified_time: new Date("2022-09-27"),
        expiration_time: new Date("2023-09-27"),
        content_type: "WORKFLOW",
        status: "UNAVAILABLE",
      },

      {
        title: "rating factor documentation standards",
        url: "https://supabase.teamg/rating_factor_standards.docx",
        content_owner: "Scarlett Hughes",
        for_position: "BUSINESS_OP_RATING",
        last_modified_time: new Date("2023-03-06"),
        expiration_time: new Date("2024-03-06"),
        content_type: "WORKFLOW",
        status: "IN_USE",
      },

      {
        title: "rating worksheet automation template",
        url: "https://supabase.teamg/rating_worksheet_automation.xlsm",
        content_owner: "Grayson Powell",
        for_position: "BUSINESS_OP_RATING",
        last_modified_time: new Date("2023-06-01"),
        expiration_time: new Date("2024-06-01"),
        content_type: "WORKFLOW",
        status: "AVAILABLE",
      },

      {
        title: "rating factor change log",
        url: "https://supabase.teamg/rating_factor_change_log.xlsx",
        content_owner: "Victoria Allen",
        for_position: "BUSINESS_OP_RATING",
        last_modified_time: new Date("2022-10-19"),
        expiration_time: new Date("2023-10-19"),
        content_type: "WORKFLOW",
        status: "UNAVAILABLE",
      },

      {
        title: "rating workflow exception matrix",
        url: "https://supabase.teamg/rating_exception_matrix.pdf",
        content_owner: "Leo Barnes",
        for_position: "BUSINESS_OP_RATING",
        last_modified_time: new Date("2023-02-14"),
        expiration_time: new Date("2024-02-14"),
        content_type: "WORKFLOW",
        status: "IN_USE",
      },

      {
        title: "rating model QA checklist",
        url: "https://supabase.teamg/rating_model_qa.xlsx",
        content_owner: "Penelope Gray",
        for_position: "BUSINESS_OP_RATING",
        last_modified_time: new Date("2023-04-02"),
        expiration_time: new Date("2024-04-02"),
        content_type: "WORKFLOW",
        status: "AVAILABLE",
      },
      {
        title: "rating data intake validation workflow",
        url: "https://supabase.teamg/rating_data_intake_validation.xlsx",
        content_owner: "Evelyn Sharp",
        for_position: "BUSINESS_OP_RATING",
        last_modified_time: new Date("2023-03-27"),
        expiration_time: new Date("2024-03-27"),
        content_type: "WORKFLOW",
        status: "IN_USE",
      },

      {
        title: "rating factor governance handbook",
        url: "https://supabase.teamg/rating_factor_governance.pdf",
        content_owner: "Dylan Matthews",
        for_position: "BUSINESS_OP_RATING",
        last_modified_time: new Date("2022-12-08"),
        expiration_time: new Date("2023-12-08"),
        content_type: "WORKFLOW",
        status: "AVAILABLE",
      },

      {
        title: "rating workflow compliance checklist",
        url: "https://supabase.teamg/rating_workflow_compliance.xlsx",
        content_owner: "Jasmine Patel",
        for_position: "BUSINESS_OP_RATING",
        last_modified_time: new Date("2023-01-31"),
        expiration_time: new Date("2024-01-31"),
        content_type: "WORKFLOW",
        status: "UNAVAILABLE",
      },

      {
        title: "rating model documentation index",
        url: "https://supabase.teamg/rating_model_documentation_index.docx",
        content_owner: "Caleb Foster",
        for_position: "BUSINESS_OP_RATING",
        last_modified_time: new Date("2023-04-04"),
        expiration_time: new Date("2024-04-04"),
        content_type: "WORKFLOW",
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
