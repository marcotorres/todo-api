import { describe, it, expect, beforeEach, vi } from "vitest";
import { CreateUserUseCase, CreateUserOptions } from "../../../../../src/application/use-cases/user/CreateUserUseCase";
import { CreateUserDTO } from "../../../../../src/application/dtos";
import { ValidationError, ConflictError } from "../../../../../src/application/errors";
import { RegistrationData } from "../../../../../src/domain";
import { createMockUserRepository, createTestUser } from "../../../../mocks/repositories";

const createValidDTO = (overrides: Partial<CreateUserDTO> = {}): CreateUserDTO => ({
  email: "new@example.com",
  name: "New User",
  lastname: "Test Lastname",
  termsAccepted: true,
  privacyPolicyAccepted: true,
  notificationPreferences: { email: true, sms: false, push: false },
  ...overrides,
});

const mockRegistrationData: RegistrationData = {
  ipAddress: "127.0.0.1",
  userAgent: "test-agent",
  timestamp: new Date(),
};

describe("CreateUserUseCase", () => {
  const mockUserRepository = createMockUserRepository();
  const useCase = new CreateUserUseCase(mockUserRepository);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should create a user successfully", async () => {
    mockUserRepository.findByEmail.mockResolvedValue(null);
    mockUserRepository.create.mockImplementation(async (user) => {
      return { ...user, id: "new-user-id" } as any;
    });

    const result = await useCase.execute({
      dto: createValidDTO(),
      registrationData: mockRegistrationData,
    });

    expect(result.id).toBe("new-user-id");
    expect(result.email).toBe("new@example.com");
    expect(result.name).toBe("New User");
    expect(result.lastname).toBe("Test Lastname");
    expect(mockUserRepository.create).toHaveBeenCalledTimes(1);
  });

  it("should throw ValidationError when email is empty", async () => {
    await expect(
      useCase.execute({
        dto: createValidDTO({ email: "" }),
        registrationData: mockRegistrationData,
      })
    ).rejects.toThrow(ValidationError);
  });

  it("should throw ValidationError when name is empty", async () => {
    await expect(
      useCase.execute({
        dto: createValidDTO({ name: "" }),
        registrationData: mockRegistrationData,
      })
    ).rejects.toThrow(ValidationError);
  });

  it("should throw ValidationError when lastname is empty", async () => {
    await expect(
      useCase.execute({
        dto: createValidDTO({ lastname: "" }),
        registrationData: mockRegistrationData,
      })
    ).rejects.toThrow(ValidationError);
  });

  it("should throw ValidationError when terms not accepted", async () => {
    await expect(
      useCase.execute({
        dto: createValidDTO({ termsAccepted: false }),
        registrationData: mockRegistrationData,
      })
    ).rejects.toThrow(ValidationError);
  });

  it("should throw ValidationError when privacy policy not accepted", async () => {
    await expect(
      useCase.execute({
        dto: createValidDTO({ privacyPolicyAccepted: false }),
        registrationData: mockRegistrationData,
      })
    ).rejects.toThrow(ValidationError);
  });

  it("should throw ConflictError when email already exists", async () => {
    const existingUser = createTestUser({ email: "existing@example.com" });
    mockUserRepository.findByEmail.mockResolvedValue(existingUser);

    await expect(
      useCase.execute({
        dto: createValidDTO({ email: "existing@example.com" }),
        registrationData: mockRegistrationData,
      })
    ).rejects.toThrow(ConflictError);
  });

  it("should normalize email to lowercase", async () => {
    mockUserRepository.findByEmail.mockResolvedValue(null);
    mockUserRepository.create.mockImplementation(async (user) => {
      return { ...user, id: "new-user-id" } as any;
    });

    const result = await useCase.execute({
      dto: createValidDTO({ email: "TEST@EXAMPLE.COM" }),
      registrationData: mockRegistrationData,
    });

    expect(result.email).toBe("test@example.com");
  });

  it("should trim email and name", async () => {
    mockUserRepository.findByEmail.mockResolvedValue(null);
    mockUserRepository.create.mockImplementation(async (user) => {
      return { ...user, id: "new-user-id" } as any;
    });

    const result = await useCase.execute({
      dto: createValidDTO({ email: "  test@example.com  ", name: "  Test User  " }),
      registrationData: mockRegistrationData,
    });

    expect(result.email).toBe("test@example.com");
    expect(result.name).toBe("Test User");
  });
});
