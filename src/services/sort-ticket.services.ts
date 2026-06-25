import { generateAIText } from "../lib/ai";
import {
  detectCaseType,
  generateSummary,
  getDepartment,
  getSeverity,
  requiresHumanReview,
} from "../utils/sort-ticket";

const systemPrompt = `
You are a CRM Ticket Classification Engine.

Analyze the customer's complaint and return ONLY a valid JSON object.

INPUT:
{
  "ticket_id": "string",
  "channel": "app | sms | call_center | merchant_portal",
  "locale": "bn | en | mixed",
  "message": "customer complaint"
}

OUTPUT FORMAT:
{
  "ticket_id": "string",
  "case_type": "wrong_transfer | payment_failed | refund_request | phishing_or_social_engineering | other",
  "severity": "low | medium | high | critical",
  "department": "customer_support | dispute_resolution | payments_ops | fraud_risk",
  "agent_summary": "neutral summary",
  "human_review_required": boolean,
  "confidence": number
}

CLASSIFICATION RULES:

1. wrong_transfer
- Customer sent money to the wrong number, account, recipient, or person.
- Severity: high
- Department: dispute_resolution

Examples:
- "I sent money to the wrong number"
- "Transferred funds to the wrong account"

2. payment_failed
- Transaction failed, unsuccessful, pending, or balance deducted but payment did not complete.
- Severity: high
- Department: payments_ops

Examples:
- "Payment failed but balance deducted"
- "Transaction failed"

3. refund_request
- Customer explicitly requests a refund, reversal, cancellation refund, or money back.
- Severity: low unless clearly significant financial impact.
- Department: customer_support
- Use dispute_resolution only if the refund is disputed or contested.

Examples:
- "Please refund my transaction"
- "I want my money back"

4. phishing_or_social_engineering
- Mentions OTP, PIN, password, scam, fraud, suspicious call, suspicious SMS, credential theft, or social engineering attempts.
- Severity: critical
- Department: fraud_risk
- human_review_required: true

Examples:
- "Someone called asking for my OTP"
- "A person asked for my PIN"

5. other
- Any issue not covered above.
- Examples: app crash, login issue, UI bug, feature request, general complaint.
- Severity: low
- Department: customer_support

SEVERITY RULES:
- wrong_transfer -> high
- payment_failed -> high
- refund_request -> low
- phishing_or_social_engineering -> critical
- other -> low

HUMAN REVIEW RULES:
- true if case_type is phishing_or_social_engineering
- true if severity is critical
- otherwise false

AGENT SUMMARY RULES:
- Maximum 2 sentences.
- Neutral and professional tone.
- Summarize the complaint only.
- Do not speculate.
- Do not provide advice.

SECURITY RULES:
Never ask for, request, suggest, or mention sharing:
- OTP
- PIN
- Password
- Full card number
- CVV

CONFIDENCE RULES:
- Clear classification: 0.90 - 0.99
- Moderate certainty: 0.75 - 0.89
- Ambiguous: 0.50 - 0.74

FINAL RULE:
Return ONLY the JSON object.
Do not return markdown.
Do not return explanations.
Do not wrap the JSON in code blocks.
`;

export const sortTicketService = async (body: any) => {
  const requestMessage = {
    ticket_id: body.ticket_id,
    channel: body.channel,
    locale: body.locale,
    message: body.message,
  };

  const LLMResponse= await generateAIText({
    system: systemPrompt,
    prompt: JSON.stringify(requestMessage),
  });

  const decodedResponse = JSON.parse(LLMResponse);

  const { case_type, severity, department, agent_summary, human_review_required, confidence } = decodedResponse;

  if(!case_type || !severity || !department || !agent_summary || human_review_required || confidence === undefined) {
    throw new Error("Invalid response from AI model");
  }

  return {
    ticket_id: body.ticket_id,
    case_type,
    severity,
    department,
    agent_summary,
    human_review_required,
    confidence,
  };
};
