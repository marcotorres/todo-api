import { Gender, NotificationPreferences, UserStatus, UserRole } from "../../domain";

export interface CreateUserDTO {
  email: string;
  name: string;
  lastname: string;
  phone?: string;
  birthDate?: string;
  gender?: Gender;
  country?: string;
  termsAccepted: boolean;
  privacyPolicyAccepted: boolean;
  notificationPreferences: NotificationPreferences;
  captchaToken?: string;
}

export interface UpdateUserDTO {
  name?: string;
  lastname?: string;
  phone?: string;
}

export interface UserResponseDTO {
  id: string;
  uuid: string;
  email: string;
  name: string;
  lastname: string;
  phone?: string;
  birthDate?: Date;
  gender?: Gender;
  country?: string;
  termsAccepted: boolean;
  privacyPolicyAccepted: boolean;
  notificationPreferences: NotificationPreferences;
  status: UserStatus;
  role: UserRole;
  lastActivity: Date;
  createdAt: Date;
}
