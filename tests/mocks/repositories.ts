import { vi } from "vitest";
import { Task, User, ITaskRepository, IUserRepository, UserStatus, UserRole, Gender, NotificationPreferences } from "../../src/domain";

export const createMockTaskRepository = () => ({
  findAll: vi.fn(),
  findById: vi.fn(),
  findByUserId: vi.fn(),
  search: vi.fn(),
  create: vi.fn(),
  update: vi.fn(),
  delete: vi.fn(),
}) as unknown as ITaskRepository & { [K in keyof ITaskRepository]: ReturnType<typeof vi.fn> };

export const createMockUserRepository = () => ({
  findByEmail: vi.fn(),
  findById: vi.fn(),
  create: vi.fn(),
  update: vi.fn(),
}) as unknown as IUserRepository & { [K in keyof IUserRepository]: ReturnType<typeof vi.fn> };

export const createTestTask = (overrides: Partial<{
  id: string;
  title: string;
  description: string;
  completed: boolean;
  userId: string;
}> = {}): Task => {
  return Task.fromPersistence({
    id: overrides.id ?? "task-1",
    title: overrides.title ?? "Test Task",
    description: overrides.description ?? "Test Description",
    completed: overrides.completed ?? false,
    userId: overrides.userId ?? "user-1",
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  });
};

export const createTestUser = (overrides: Partial<{
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
}> = {}): User => {
  return User.fromPersistence({
    id: overrides.id ?? "user-1",
    uuid: overrides.uuid ?? "test-uuid-1234",
    email: overrides.email ?? "test@example.com",
    name: overrides.name ?? "Test User",
    lastname: overrides.lastname ?? "Test Lastname",
    phone: overrides.phone,
    birthDate: overrides.birthDate,
    gender: overrides.gender,
    country: overrides.country,
    termsAccepted: overrides.termsAccepted ?? true,
    privacyPolicyAccepted: overrides.privacyPolicyAccepted ?? true,
    notificationPreferences: overrides.notificationPreferences ?? { email: true, sms: false, push: false },
    status: overrides.status ?? UserStatus.ACTIVE,
    role: overrides.role ?? UserRole.ADMIN,
    registrationData: {
      ipAddress: "127.0.0.1",
      userAgent: "test-agent",
      timestamp: new Date("2024-01-01"),
    },
    lastActivity: new Date("2024-01-01"),
    createdAt: new Date("2024-01-01"),
  });
};
