import { ITaskRepository } from "../../../domain";
import { UpdateTaskDTO, TaskResponseDTO } from "../../dtos";
import { NotFoundError } from "../../errors";

export class UpdateTaskUseCase {
  constructor(private readonly taskRepository: ITaskRepository) {}

  async execute(id: string, dto: UpdateTaskDTO): Promise<TaskResponseDTO> {
    const existing = await this.taskRepository.findById(id);
    if (!existing) {
      throw new NotFoundError("Task");
    }

    const updated = existing.update({
      title: dto.title?.trim(),
      description: dto.description?.trim(),
      completed: dto.completed,
    });

    const saved = await this.taskRepository.update(updated);

    return {
      id: saved.id!,
      title: saved.title,
      description: saved.description,
      completed: saved.completed,
      userId: saved.userId,
      createdAt: saved.createdAt,
      updatedAt: saved.updatedAt,
    };
  }
}
