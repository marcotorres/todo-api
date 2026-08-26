import { ITaskRepository } from "../../../domain";
import { TaskResponseDTO } from "../../dtos";

export class GetAllTasksUseCase {
  constructor(private readonly taskRepository: ITaskRepository) {}

  async execute(userId: string): Promise<TaskResponseDTO[]> {
    const tasks = await this.taskRepository.findByUserId(userId);
    return tasks.map((task) => ({
      id: task.id!,
      title: task.title,
      description: task.description,
      completed: task.completed,
      userId: task.userId,
      createdAt: task.createdAt,
      updatedAt: task.updatedAt,
    }));
  }
}
