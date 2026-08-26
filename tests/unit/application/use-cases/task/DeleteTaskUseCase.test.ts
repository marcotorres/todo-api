import { describe, it, expect, beforeEach, vi } from "vitest";
import { DeleteTaskUseCase } from "../../../../../src/application/use-cases/task/DeleteTaskUseCase";
import { NotFoundError } from "../../../../../src/application/errors";
import { createMockTaskRepository, createTestTask } from "../../../../mocks/repositories";

describe("DeleteTaskUseCase", () => {
  const mockTaskRepository = createMockTaskRepository();
  const useCase = new DeleteTaskUseCase(mockTaskRepository);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should delete a task successfully", async () => {
    const existingTask = createTestTask({ id: "task-1" });
    mockTaskRepository.findById.mockResolvedValue(existingTask);
    mockTaskRepository.delete.mockResolvedValue(undefined);

    await useCase.execute("task-1");

    expect(mockTaskRepository.findById).toHaveBeenCalledWith("task-1");
    expect(mockTaskRepository.delete).toHaveBeenCalledWith("task-1");
  });

  it("should throw NotFoundError when task does not exist", async () => {
    mockTaskRepository.findById.mockResolvedValue(null);

    await expect(useCase.execute("non-existent")).rejects.toThrow(NotFoundError);
    expect(mockTaskRepository.delete).not.toHaveBeenCalled();
  });
});
