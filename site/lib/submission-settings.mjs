/** Basic protection is an explicit deployment choice, never a missing CAPTCHA setting. */
export const submissionsOnline = config => Boolean(config.contribute?.submissionUrl && (config.contribute?.spamProtection === "basic" || config.contribute?.captcha?.siteKey));

/** Enable only after the independently deployed inbox preserves the credit preference. */
export const anonymousSubmissionsAllowed = config => config.contribute?.allowAnonymous === true;

/** Progress intake has an independent deployment gate from new-problem proposals. */
export const progressSubmissionsOnline = config => Boolean(config.contribute?.progressSubmissionUrl && (config.contribute?.spamProtection === "basic" || config.contribute?.captcha?.siteKey));
