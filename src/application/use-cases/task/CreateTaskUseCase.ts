import { Task, ITaskRepository } from "../../../domain";
import { CreateTaskDTO, TaskResponseDTO } from "../../dtos";
import { ValidationError } from "../../errors";

export class CreateTaskUseCase {
  constructor(private readonly taskRepository: ITaskRepository) {}

  async execute(dto: CreateTaskDTO): Promise<TaskResponseDTO> {
    if (!dto.title?.trim()) {
      throw new ValidationError("Title is required");
    }
    if (!dto.userId?.trim()) {
      throw new ValidationError("UserId is required");
    }

    const task = Task.create({
      title: dto.title.trim(),
      description: dto.description?.trim() || "",
      userId: dto.userId,
    });

    const created = await this.taskRepository.create(task);

    return {
      id: created.id!,
      title: created.title,
      description: created.description,
      completed: created.completed,
      userId: created.userId,
      createdAt: created.createdAt,
      updatedAt: created.updatedAt,
    };
  }
}
