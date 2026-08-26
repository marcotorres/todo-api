import { ITaskRepository } from "../../../domain";
import { TaskResponseDTO } from "../../dtos";

export class SearchTasksUseCase {
  constructor(private readonly taskRepository: ITaskRepository) {}

  async execute(userId: string, query: string): Promise<TaskResponseDTO[]> {
    const tasks = await this.taskRepository.search(userId, query);

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
