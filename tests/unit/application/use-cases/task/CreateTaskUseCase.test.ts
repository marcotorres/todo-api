import { describe, it, expect, beforeEach, vi } from "vitest";
import { CreateTaskUseCase } from "../../../../../src/application/use-cases/task/CreateTaskUseCase";
import { ValidationError } from "../../../../../src/application/errors";
import { createMockTaskRepository } from "../../../../mocks/repositories";

describe("CreateTaskUseCase", () => {
  const mockTaskRepository = createMockTaskRepository();
  const useCase = new CreateTaskUseCase(mockTaskRepository);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should create a task successfully", async () => {
    mockTaskRepository.create.mockImplementation(async (task) => {
      return { ...task, id: "new-task-id" } as any;
    });

    const result = await useCase.execute({
      title: "New Task",
      description: "Task Description",
      userId: "user-1",
    });

    expect(result.id).toBe("new-task-id");
    expect(result.title).toBe("New Task");
    expect(result.description).toBe("Task Description");
    expect(result.completed).toBe(false);
    expect(mockTaskRepository.create).toHaveBeenCalledTimes(1);
  });

  it("should throw ValidationError when title is empty", async () => {
    await expect(
      useCase.execute({
        title: "",
        userId: "user-1",
      })
    ).rejects.toThrow(ValidationError);
  });

  it("should throw ValidationError when title is only whitespace", async () => {
    await expect(
      useCase.execute({
        title: "   ",
        userId: "user-1",
      })
    ).rejects.toThrow(ValidationError);
  });

  it("should throw ValidationError when userId is empty", async () => {
    await expect(
      useCase.execute({
        title: "Valid Title",
        userId: "",
      })
    ).rejects.toThrow(ValidationError);
  });

  it("should trim title and description", async () => {
    mockTaskRepository.create.mockImplementation(async (task) => {
      return { ...task, id: "new-task-id" } as any;
    });

    const result = await useCase.execute({
      title: "  Trimmed Title  ",
      description: "  Trimmed Description  ",
      userId: "user-1",
    });

    expect(result.title).toBe("Trimmed Title");
    expect(result.description).toBe("Trimmed Description");
  });

  it("should set empty description when not provided", async () => {
    mockTaskRepository.create.mockImplementation(async (task) => {
      return { ...task, id: "new-task-id" } as any;
    });

    const result = await useCase.execute({
      title: "Task Without Description",
      userId: "user-1",
    });

    expect(result.description).toBe("");
  });
});
