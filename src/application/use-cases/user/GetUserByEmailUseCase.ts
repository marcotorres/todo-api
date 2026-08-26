import { IUserRepository } from "../../../domain";
import { UserResponseDTO } from "../../dtos";
import { NotFoundError } from "../../errors";

export class GetUserByEmailUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(email: string): Promise<UserResponseDTO> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new NotFoundError("User");
    }

    return {
      id: user.id!,
      uuid: user.uuid,
      email: user.email,
      name: user.name,
      lastname: user.lastname,
      phone: user.phone,
      birthDate: user.birthDate,
      gender: user.gender,
      country: user.country,
      termsAccepted: user.termsAccepted,
      privacyPolicyAccepted: user.privacyPolicyAccepted,
      notificationPreferences: user.notificationPreferences,
      status: user.status,
      role: user.role,
      lastActivity: user.lastActivity,
      createdAt: user.createdAt,
    };
  }
}
