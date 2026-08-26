import jwt, { SignOptions, JwtPayload } from "jsonwebtoken";

export interface TokenPayload {
  userId: string;
  email: string;
}

export interface JwtConfig {
  secret: string;
  expiresIn: string;
}

const DEFAULT_CONFIG: JwtConfig = {
  secret: process.env.JWT_SECRET || "your-secret-key-change-in-production",
  expiresIn: process.env.JWT_EXPIRES_IN || "24h",
};

const REFRESH_TOKEN_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || "7d";

export class JwtService {
  private readonly config: JwtConfig;

  constructor(config?: Partial<JwtConfig>) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  generateToken(payload: TokenPayload): string {
    const options: SignOptions = {
      expiresIn: this.config.expiresIn as jwt.SignOptions["expiresIn"],
    };
    return jwt.sign(payload, this.config.secret, options);
  }

  generateRefreshToken(payload: TokenPayload): string {
    const options: SignOptions = {
      expiresIn: REFRESH_TOKEN_EXPIRES_IN as jwt.SignOptions["expiresIn"],
    };
    return jwt.sign({ ...payload, type: "refresh" }, this.config.secret, options);
  }

  verifyRefreshToken(token: string): TokenPayload {
    const decoded = jwt.verify(token, this.config.secret) as JwtPayload & TokenPayload & { type?: string };
    if (decoded.type !== "refresh") {
      throw new Error("Invalid refresh token");
    }
    return {
      userId: decoded.userId,
      email: decoded.email,
    };
  }

  verifyToken(token: string): TokenPayload {
    const decoded = jwt.verify(token, this.config.secret) as JwtPayload & TokenPayload;
    return {
      userId: decoded.userId,
      email: decoded.email,
    };
  }

  decodeToken(token: string): TokenPayload | null {
    try {
      const decoded = jwt.decode(token) as JwtPayload & TokenPayload;
      if (!decoded) return null;
      return {
        userId: decoded.userId,
        email: decoded.email,
      };
    } catch {
      return null;
    }
  }
}

export const jwtService = new JwtService();
