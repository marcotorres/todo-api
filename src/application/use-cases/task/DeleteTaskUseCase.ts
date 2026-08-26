import { ITaskRepository } from "../../../domain";
import { NotFoundError } from "../../errors";

export class DeleteTaskUseCase {
  constructor(private readonly taskRepository: ITaskRepository) {}

  async execute(id: string): Promise<void> {
    const existing = await this.taskRepository.findById(id);
    if (!existing) {
      throw new NotFoundError("Task");
    }

    await this.taskRepository.delete(id);
  }
}
