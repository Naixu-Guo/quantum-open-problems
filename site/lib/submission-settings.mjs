/** Basic protection is an explicit deployment choice, never a missing CAPTCHA setting. */
export const submissionsOnline = config => Boolean(config.contribute?.submissionUrl && (config.contribute?.spamProtection === "basic" || config.contribute?.captcha?.siteKey));
