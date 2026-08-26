import { Request, Response } from "express";
import {
  GetUserByEmailUseCase,
  CreateUserUseCase,
  UpdateUserUseCase,
  UserResponseDTO,
  defineAbilitiesFor,
  serializeAbilities,
  Permission,
  CreateUserDTO,
  UpdateUserDTO,
} from "../../../application";
import { IUserRepository, RegistrationData } from "../../../domain";
import { jwtService, recaptchaService } from "../../../infrastructure";
import { ValidationError } from "../../../application";
import { ApiResponse, AuthenticatedRequest } from "../middleware";

interface UserWithAbilities extends UserResponseDTO {
  abilities: Permission[];
}

interface LoginResponse extends UserWithAbilities {
  token: string;
  refreshToken: string;
}

export class UserController {
  private readonly getUserByEmailUseCase: GetUserByEmailUseCase;
  private readonly createUserUseCase: CreateUserUseCase;
  private readonly updateUserUseCase: UpdateUserUseCase;

  constructor(userRepository: IUserRepository) {
    this.getUserByEmailUseCase = new GetUserByEmailUseCase(userRepository);
    this.createUserUseCase = new CreateUserUseCase(userRepository);
    this.updateUserUseCase = new UpdateUserUseCase(userRepository);
  }

  private buildUserWithAbilities(userDto: UserResponseDTO): UserWithAbilities {
    const abilitiesResult = defineAbilitiesFor();
    const abilities = serializeAbilities(abilitiesResult);
    return {
      ...userDto,
      abilities,
    };
  }

  private getClientIp(req: Request): string {
    const forwarded = req.headers["x-forwarded-for"];
    if (typeof forwarded === "string") {
      return forwarded.split(",")[0].trim();
    }
    if (Array.isArray(forwarded)) {
      return forwarded[0];
    }
    return req.ip || req.socket.remoteAddress || "unknown";
  }

  getByEmail = async (req: Request, res: Response): Promise<void> => {
    const email = req.params.email as string;
    const user = await this.getUserByEmailUseCase.execute(email);
    const userWithAbilities = this.buildUserWithAbilities(user);
    const response: ApiResponse<UserWithAbilities> = {
      success: true,
      data: userWithAbilities,
    };
    res.status(200).json(response);
  };

  login = async (req: Request, res: Response): Promise<void> => {
    const { email } = req.body;
    const user = await this.getUserByEmailUseCase.execute(email);
    const userWithAbilities = this.buildUserWithAbilities(user);
    const tokenPayload = { userId: user.id, email: user.email };
    const token = jwtService.generateToken(tokenPayload);
    const refreshToken = jwtService.generateRefreshToken(tokenPayload);
    const loginResponse: LoginResponse = {
      ...userWithAbilities,
      token,
      refreshToken,
    };
    const response: ApiResponse<LoginResponse> = {
      success: true,
      data: loginResponse,
    };
    res.status(200).json(response);
  };

  create = async (req: Request, res: Response): Promise<void> => {
    const body = req.body;
    
    const captchaToken = body.captchaToken || body.securityMetadata?.captchaToken;
    
    const dto: CreateUserDTO = {
      ...body,
      captchaToken,
    };

    if (captchaToken) {
      const captchaResult = await recaptchaService.verify(captchaToken);
      if (!captchaResult.valid) {
        throw new ValidationError(captchaResult.error || "Captcha verification failed");
      }
    }

    const registrationData: RegistrationData = {
      ipAddress: this.getClientIp(req),
      userAgent: req.headers["user-agent"] || "unknown",
      timestamp: new Date(),
    };

    const user = await this.createUserUseCase.execute({
      dto,
      registrationData,
    });
    const userWithAbilities = this.buildUserWithAbilities(user);
    const tokenPayload = { userId: user.id, email: user.email };
    const token = jwtService.generateToken(tokenPayload);
    const refreshToken = jwtService.generateRefreshToken(tokenPayload);
    const loginResponse: LoginResponse = {
      ...userWithAbilities,
      token,
      refreshToken,
    };
    const response: ApiResponse<LoginResponse> = {
      success: true,
      data: loginResponse,
      message: "User created successfully",
    };
    res.status(201).json(response);
  };

  refresh = async (req: Request, res: Response): Promise<void> => {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      throw new ValidationError("Refresh token is required");
    }

    try {
      const payload = jwtService.verifyRefreshToken(refreshToken);
      const user = await this.getUserByEmailUseCase.execute(payload.email);
      const userWithAbilities = this.buildUserWithAbilities(user);
      const tokenPayload = { userId: user.id, email: user.email };
      const newToken = jwtService.generateToken(tokenPayload);
      const newRefreshToken = jwtService.generateRefreshToken(tokenPayload);
      const loginResponse: LoginResponse = {
        ...userWithAbilities,
        token: newToken,
        refreshToken: newRefreshToken,
      };
      const response: ApiResponse<LoginResponse> = {
        success: true,
        data: loginResponse,
      };
      res.status(200).json(response);
    } catch {
      throw new ValidationError("Invalid or expired refresh token");
    }
  };

  update = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const userId = req.user!.userId;
    const dto: UpdateUserDTO = req.body;

    const user = await this.updateUserUseCase.execute(userId, dto);
    const userWithAbilities = this.buildUserWithAbilities(user);
    const response: ApiResponse<UserWithAbilities> = {
      success: true,
      data: userWithAbilities,
      message: "User updated successfully",
    };
    res.status(200).json(response);
  };
}
