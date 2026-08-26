import { describe, it, expect, beforeEach, vi } from "vitest";
import { GetAllTasksUseCase } from "../../../../../src/application/use-cases/task/GetAllTasksUseCase";
import { createMockTaskRepository, createTestTask } from "../../../../mocks/repositories";

describe("GetAllTasksUseCase", () => {
  const mockTaskRepository = createMockTaskRepository();
  const useCase = new GetAllTasksUseCase(mockTaskRepository);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return all tasks for a user", async () => {
    const tasks = [
      createTestTask({ id: "task-1", title: "Task 1", userId: "user-1" }),
      createTestTask({ id: "task-2", title: "Task 2", userId: "user-1" }),
    ];
    mockTaskRepository.findByUserId.mockResolvedValue(tasks);

    const result = await useCase.execute("user-1");

    expect(result).toHaveLength(2);
    expect(result[0].id).toBe("task-1");
    expect(result[1].id).toBe("task-2");
    expect(mockTaskRepository.findByUserId).toHaveBeenCalledWith("user-1");
  });

  it("should return empty array when no tasks exist for user", async () => {
    mockTaskRepository.findByUserId.mockResolvedValue([]);

    const result = await useCase.execute("user-1");

    expect(result).toEqual([]);
  });

  it("should map task entities to DTOs correctly", async () => {
    const task = createTestTask({
      id: "task-1",
      title: "Test Task",
      description: "Test Description",
      completed: true,
      userId: "user-1",
    });
    mockTaskRepository.findByUserId.mockResolvedValue([task]);

    const result = await useCase.execute("user-1");

    expect(result[0]).toEqual({
      id: "task-1",
      title: "Test Task",
      description: "Test Description",
      completed: true,
      userId: "user-1",
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
    });
  });
});
