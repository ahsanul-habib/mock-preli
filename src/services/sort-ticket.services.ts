import {
  detectCaseType,
  generateSummary,
  getDepartment,
  getSeverity,
  requiresHumanReview,
} from "../utils/sort-ticket"

export const sortTicketService = (body: any) => {
  const { caseType, confidence } = detectCaseType(
    body.message
  );

  const severity = getSeverity(caseType);
  const department = getDepartment(caseType);

  return {
    ticket_id: body.ticket_id,
    case_type: caseType,
    severity,
    department,
    agent_summary: generateSummary(caseType),
    human_review_required: requiresHumanReview(
      caseType,
      severity
    ),
    confidence,
  };
};