export enum UserStatus {
  ACTIVE = "active",
  INACTIVE = "inactive",
  SUSPENDED = "suspended",
}

export enum UserRole {
  ADMIN = "admin",
  USER = "user",
}

export enum Gender {
  MALE = "male",
  FEMALE = "female",
  OTHER = "other",
  PREFER_NOT_TO_SAY = "prefer_not_to_say",
}

export interface NotificationPreferences {
  email: boolean;
  sms: boolean;
  push: boolean;
}

export interface RegistrationData {
  ipAddress: string;
  userAgent: string;
  timestamp: Date;
}

export interface UserProps {
  id?: string;
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
  registrationData: RegistrationData;
  lastActivity: Date;
  createdAt: Date;
}

export interface CreateUserProps {
  id?: string;
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
  registrationData: RegistrationData;
}

export class User {
  readonly id?: string;
  readonly uuid: string;
  readonly email: string;
  readonly name: string;
  readonly lastname: string;
  readonly phone?: string;
  readonly birthDate?: Date;
  readonly gender?: Gender;
  readonly country?: string;
  readonly termsAccepted: boolean;
  readonly privacyPolicyAccepted: boolean;
  readonly notificationPreferences: NotificationPreferences;
  readonly status: UserStatus;
  readonly role: UserRole;
  readonly registrationData: RegistrationData;
  readonly lastActivity: Date;
  readonly createdAt: Date;

  private constructor(props: UserProps) {
    this.id = props.id;
    this.uuid = props.uuid;
    this.email = props.email;
    this.name = props.name;
    this.lastname = props.lastname;
    this.phone = props.phone;
    this.birthDate = props.birthDate;
    this.gender = props.gender;
    this.country = props.country;
    this.termsAccepted = props.termsAccepted;
    this.privacyPolicyAccepted = props.privacyPolicyAccepted;
    this.notificationPreferences = props.notificationPreferences;
    this.status = props.status;
    this.role = props.role;
    this.registrationData = props.registrationData;
    this.lastActivity = props.lastActivity;
    this.createdAt = props.createdAt;
  }

  static create(props: CreateUserProps): User {
    const now = new Date();
    return new User({
      ...props,
      status: UserStatus.ACTIVE,
      role: UserRole.ADMIN,
      lastActivity: now,
      createdAt: now,
    });
  }

  static fromPersistence(props: UserProps): User {
    return new User(props);
  }

  update(props: Partial<Pick<UserProps, "name" | "lastname" | "phone">>): User {
    return new User({
      ...this.toObject(),
      name: props.name !== undefined ? props.name : this.name,
      lastname: props.lastname !== undefined ? props.lastname : this.lastname,
      phone: props.phone !== undefined ? props.phone : this.phone,
      lastActivity: new Date(),
    });
  }

  toObject(): UserProps {
    return {
      id: this.id,
      uuid: this.uuid,
      email: this.email,
      name: this.name,
      lastname: this.lastname,
      phone: this.phone,
      birthDate: this.birthDate,
      gender: this.gender,
      country: this.country,
      termsAccepted: this.termsAccepted,
      privacyPolicyAccepted: this.privacyPolicyAccepted,
      notificationPreferences: this.notificationPreferences,
      status: this.status,
      role: this.role,
      registrationData: this.registrationData,
      lastActivity: this.lastActivity,
      createdAt: this.createdAt,
    };
  }
}
