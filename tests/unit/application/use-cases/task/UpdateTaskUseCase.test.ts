import { describe, it, expect, beforeEach, vi } from "vitest";
import { UpdateTaskUseCase } from "../../../../../src/application/use-cases/task/UpdateTaskUseCase";
import { NotFoundError } from "../../../../../src/application/errors";
import { createMockTaskRepository, createTestTask } from "../../../../mocks/repositories";

describe("UpdateTaskUseCase", () => {
  const mockTaskRepository = createMockTaskRepository();
  const useCase = new UpdateTaskUseCase(mockTaskRepository);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should update a task successfully", async () => {
    const existingTask = createTestTask({ id: "task-1", title: "Original" });
    mockTaskRepository.findById.mockResolvedValue(existingTask);
    mockTaskRepository.update.mockImplementation(async (task) => task);

    const result = await useCase.execute("task-1", {
      title: "Updated Title",
      completed: true,
    });

    expect(result.title).toBe("Updated Title");
    expect(result.completed).toBe(true);
    expect(mockTaskRepository.findById).toHaveBeenCalledWith("task-1");
    expect(mockTaskRepository.update).toHaveBeenCalledTimes(1);
  });

  it("should throw NotFoundError when task does not exist", async () => {
    mockTaskRepository.findById.mockResolvedValue(null);

    await expect(
      useCase.execute("non-existent", { title: "Updated" })
    ).rejects.toThrow(NotFoundError);
  });

  it("should only update provided fields", async () => {
    const existingTask = createTestTask({
      id: "task-1",
      title: "Original Title",
      description: "Original Description",
      completed: false,
    });
    mockTaskRepository.findById.mockResolvedValue(existingTask);
    mockTaskRepository.update.mockImplementation(async (task) => task);

    const result = await useCase.execute("task-1", { completed: true });

    expect(result.title).toBe("Original Title");
    expect(result.description).toBe("Original Description");
    expect(result.completed).toBe(true);
  });

  it("should trim updated title and description", async () => {
    const existingTask = createTestTask({ id: "task-1" });
    mockTaskRepository.findById.mockResolvedValue(existingTask);
    mockTaskRepository.update.mockImplementation(async (task) => task);

    const result = await useCase.execute("task-1", {
      title: "  Trimmed  ",
      description: "  Also Trimmed  ",
    });

    expect(result.title).toBe("Trimmed");
    expect(result.description).toBe("Also Trimmed");
  });
});
