export type CaseType =
  | "wrong_transfer"
  | "payment_failed"
  | "refund_request"
  | "phishing_or_social_engineering"
  | "other";

export type Severity =
  | "low"
  | "medium"
  | "high"
  | "critical";

export type Department =
  | "customer_support"
  | "dispute_resolution"
  | "payments_ops"
  | "fraud_risk";

export const validateRequest = (body: any): string[] => {
  const errors: string[] = [];

  if (!body.ticket_id) {
    errors.push("ticket_id is required");
  }

  if (!body.message) {
    errors.push("message is required");
  }

  return errors;
};

export const detectCaseType = (
  message: string
): { caseType: CaseType; confidence: number } => {
  const text = message.toLowerCase();

  if (
    text.includes("wrong number") ||
    text.includes("wrong recipient") ||
    text.includes("sent 3000") ||
    text.includes("sent 5000")
  ) {
    return {
      caseType: "wrong_transfer",
      confidence: 0.9,
    };
  }

  if (
    text.includes("payment failed") ||
    text.includes("balance deducted") ||
    text.includes("transaction failed")
  ) {
    return {
      caseType: "payment_failed",
      confidence: 0.9,
    };
  }

  if (
    text.includes("refund") ||
    text.includes("money back")
  ) {
    return {
      caseType: "refund_request",
      confidence: 0.85,
    };
  }

  if (
    text.includes("otp") ||
    text.includes("pin") ||
    text.includes("password") ||
    text.includes("scam") ||
    text.includes("phishing")
  ) {
    return {
      caseType: "phishing_or_social_engineering",
      confidence: 0.95,
    };
  }

  return {
    caseType: "other",
    confidence: 0.6,
  };
};

export const getSeverity = (
  caseType: CaseType
): Severity => {
  switch (caseType) {
    case "wrong_transfer":
      return "high";

    case "payment_failed":
      return "high";

    case "refund_request":
      return "low";

    case "phishing_or_social_engineering":
      return "critical";

    default:
      return "low";
  }
};

export const getDepartment = (
  caseType: CaseType
): Department => {
  switch (caseType) {
    case "wrong_transfer":
      return "dispute_resolution";

    case "payment_failed":
      return "payments_ops";

    case "refund_request":
      return "customer_support";

    case "phishing_or_social_engineering":
      return "fraud_risk";

    default:
      return "customer_support";
  }
};

export const generateSummary = (
  caseType: CaseType
): string => {
  switch (caseType) {
    case "wrong_transfer":
      return "Customer reports sending money to the wrong recipient and requests recovery assistance.";

    case "payment_failed":
      return "Customer reports a failed payment where funds may have been deducted.";

    case "refund_request":
      return "Customer is requesting a refund for a previous transaction.";

    case "phishing_or_social_engineering":
      return "Customer reports suspicious activity involving sensitive account information.";

    default:
      return "Customer reported a general issue requiring support.";
  }
};

export const requiresHumanReview = (
  caseType: CaseType,
  severity: Severity
): boolean => {
  return (
    caseType === "phishing_or_social_engineering" ||
    severity === "critical"
  );
};