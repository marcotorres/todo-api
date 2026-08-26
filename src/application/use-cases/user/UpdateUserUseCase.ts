import { IUserRepository } from "../../../domain";
import { UpdateUserDTO, UserResponseDTO } from "../../dtos";
import { NotFoundError } from "../../errors";

export class UpdateUserUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(userId: string, dto: UpdateUserDTO): Promise<UserResponseDTO> {
    const existing = await this.userRepository.findById(userId);
    if (!existing) {
      throw new NotFoundError("User");
    }

    const updated = existing.update({
      name: dto.name?.trim(),
      lastname: dto.lastname?.trim(),
      phone: dto.phone?.trim(),
    });

    const saved = await this.userRepository.update(updated);

    return {
      id: saved.id!,
      uuid: saved.uuid,
      email: saved.email,
      name: saved.name,
      lastname: saved.lastname,
      phone: saved.phone,
      birthDate: saved.birthDate,
      gender: saved.gender,
      country: saved.country,
      termsAccepted: saved.termsAccepted,
      privacyPolicyAccepted: saved.privacyPolicyAccepted,
      notificationPreferences: saved.notificationPreferences,
      status: saved.status,
      role: saved.role,
      lastActivity: saved.lastActivity,
      createdAt: saved.createdAt,
    };
  }
}
