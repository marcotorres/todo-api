import { randomUUID } from "crypto";
import { User, IUserRepository, RegistrationData } from "../../../domain";
import { CreateUserDTO, UserResponseDTO } from "../../dtos";
import { ValidationError, ConflictError } from "../../errors";

export interface CreateUserOptions {
  dto: CreateUserDTO;
  registrationData: RegistrationData;
}

export class CreateUserUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(options: CreateUserOptions): Promise<UserResponseDTO> {
    const { dto, registrationData } = options;

    if (!dto.email?.trim()) {
      throw new ValidationError("Email is required");
    }
    if (!dto.name?.trim()) {
      throw new ValidationError("Name is required");
    }
    if (!dto.lastname?.trim()) {
      throw new ValidationError("Lastname is required");
    }
    if (!dto.termsAccepted) {
      throw new ValidationError("Terms and conditions must be accepted");
    }
    if (!dto.privacyPolicyAccepted) {
      throw new ValidationError("Privacy policy must be accepted");
    }
    if (!dto.notificationPreferences) {
      throw new ValidationError("Notification preferences are required");
    }

    const existing = await this.userRepository.findByEmail(dto.email);
    if (existing) {
      throw new ConflictError("A user with this email already exists");
    }

    const user = User.create({
      uuid: randomUUID(),
      email: dto.email.trim().toLowerCase(),
      name: dto.name.trim(),
      lastname: dto.lastname.trim(),
      phone: dto.phone?.trim(),
      birthDate: dto.birthDate ? new Date(dto.birthDate) : undefined,
      gender: dto.gender,
      country: dto.country?.trim(),
      termsAccepted: dto.termsAccepted,
      privacyPolicyAccepted: dto.privacyPolicyAccepted,
      notificationPreferences: dto.notificationPreferences,
      registrationData,
    });

    const created = await this.userRepository.create(user);

    return {
      id: created.id!,
      uuid: created.uuid,
      email: created.email,
      name: created.name,
      lastname: created.lastname,
      phone: created.phone,
      birthDate: created.birthDate,
      gender: created.gender,
      country: created.country,
      termsAccepted: created.termsAccepted,
      privacyPolicyAccepted: created.privacyPolicyAccepted,
      notificationPreferences: created.notificationPreferences,
      status: created.status,
      role: created.role,
      lastActivity: created.lastActivity,
      createdAt: created.createdAt,
    };
  }
}
