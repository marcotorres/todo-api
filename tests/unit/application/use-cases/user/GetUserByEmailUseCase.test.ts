import { describe, it, expect, beforeEach, vi } from "vitest";
import { GetUserByEmailUseCase } from "../../../../../src/application/use-cases/user/GetUserByEmailUseCase";
import { NotFoundError } from "../../../../../src/application/errors";
import { createMockUserRepository, createTestUser } from "../../../../mocks/repositories";

describe("GetUserByEmailUseCase", () => {
  const mockUserRepository = createMockUserRepository();
  const useCase = new GetUserByEmailUseCase(mockUserRepository);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return user when found", async () => {
    const user = createTestUser({ email: "test@example.com", name: "Test User" });
    mockUserRepository.findByEmail.mockResolvedValue(user);

    const result = await useCase.execute("test@example.com");

    expect(result.email).toBe("test@example.com");
    expect(result.name).toBe("Test User");
    expect(mockUserRepository.findByEmail).toHaveBeenCalledWith("test@example.com");
  });

  it("should throw NotFoundError when user does not exist", async () => {
    mockUserRepository.findByEmail.mockResolvedValue(null);

    await expect(useCase.execute("nonexistent@example.com")).rejects.toThrow(
      NotFoundError
    );
  });

  it("should map user entity to DTO correctly", async () => {
    const user = createTestUser({
      id: "user-1",
      email: "test@example.com",
      name: "Test User",
      lastname: "Test Lastname",
    });
    mockUserRepository.findByEmail.mockResolvedValue(user);

    const result = await useCase.execute("test@example.com");

    expect(result.id).toBe("user-1");
    expect(result.email).toBe("test@example.com");
    expect(result.name).toBe("Test User");
    expect(result.lastname).toBe("Test Lastname");
    expect(result.uuid).toBeDefined();
    expect(result.status).toBeDefined();
    expect(result.role).toBeDefined();
    expect(result.createdAt).toBeInstanceOf(Date);
  });
});
