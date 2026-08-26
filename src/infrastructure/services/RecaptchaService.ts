export interface RecaptchaVerifyResponse {
  success: boolean;
  score?: number;
  action?: string;
  challenge_ts?: string;
  hostname?: string;
  "error-codes"?: string[];
}

export interface RecaptchaConfig {
  secretKey: string;
  minScore?: number;
}

export class RecaptchaService {
  private readonly secretKey: string;
  private readonly minScore: number;
  private readonly verifyUrl = "https://www.google.com/recaptcha/api/siteverify";

  constructor(config: RecaptchaConfig) {
    this.secretKey = config.secretKey;
    this.minScore = config.minScore ?? 0.5;
  }

  async verify(token: string, expectedAction?: string): Promise<{ valid: boolean; score?: number; error?: string }> {
    if (!token) {
      return { valid: false, error: "Captcha token is required" };
    }

    try {
      const response = await fetch(this.verifyUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          secret: this.secretKey,
          response: token,
        }),
      });

      const data: RecaptchaVerifyResponse = await response.json();

      if (!data.success) {
        return {
          valid: false,
          error: `reCAPTCHA verification failed: ${data["error-codes"]?.join(", ") || "unknown error"}`,
        };
      }

      if (data.score !== undefined && data.score < this.minScore) {
        return {
          valid: false,
          score: data.score,
          error: `Score too low: ${data.score}`,
        };
      }

      if (expectedAction && data.action !== expectedAction) {
        return {
          valid: false,
          score: data.score,
          error: `Action mismatch: expected ${expectedAction}, got ${data.action}`,
        };
      }

      return { valid: true, score: data.score };
    } catch (error) {
      return {
        valid: false,
        error: `reCAPTCHA verification error: ${error instanceof Error ? error.message : "unknown"}`,
      };
    }
  }
}

const secretKey = process.env.RECAPTCHA_SECRET_KEY || "";

export const recaptchaService = new RecaptchaService({
  secretKey,
  minScore: 0.5,
});
