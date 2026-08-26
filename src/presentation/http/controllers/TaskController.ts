import { Response } from "express";
import { AuthenticatedRequest } from "../middleware";
import {
  GetAllTasksUseCase,
  CreateTaskUseCase,
  UpdateTaskUseCase,
  DeleteTaskUseCase,
  SearchTasksUseCase,
} from "../../../application";
import { ITaskRepository } from "../../../domain";
import { ApiResponse } from "../middleware";

export class TaskController {
  private readonly getAllTasksUseCase: GetAllTasksUseCase;
  private readonly createTaskUseCase: CreateTaskUseCase;
  private readonly updateTaskUseCase: UpdateTaskUseCase;
  private readonly deleteTaskUseCase: DeleteTaskUseCase;
  private readonly searchTasksUseCase: SearchTasksUseCase;

  constructor(taskRepository: ITaskRepository) {
    this.getAllTasksUseCase = new GetAllTasksUseCase(taskRepository);
    this.createTaskUseCase = new CreateTaskUseCase(taskRepository);
    this.updateTaskUseCase = new UpdateTaskUseCase(taskRepository);
    this.deleteTaskUseCase = new DeleteTaskUseCase(taskRepository);
    this.searchTasksUseCase = new SearchTasksUseCase(taskRepository);
  }

  getAll = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const userId = req.user!.userId;
    const tasks = await this.getAllTasksUseCase.execute(userId);
    const response: ApiResponse<typeof tasks> = {
      success: true,
      data: tasks,
    };
    res.status(200).json(response);
  };

  create = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const userId = req.user!.userId;
    const task = await this.createTaskUseCase.execute({
      ...req.body,
      userId,
    });
    const response: ApiResponse<typeof task> = {
      success: true,
      data: task,
      message: "Task created successfully",
    };
    res.status(201).json(response);
  };

  update = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const id = req.params.id as string;
    const task = await this.updateTaskUseCase.execute(id, req.body);
    const response: ApiResponse<typeof task> = {
      success: true,
      data: task,
      message: "Task updated successfully",
    };
    res.status(200).json(response);
  };

  delete = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const id = req.params.id as string;
    await this.deleteTaskUseCase.execute(id);
    const response: ApiResponse = {
      success: true,
      message: "Task deleted successfully",
    };
    res.status(200).json(response);
  };

  patch = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const id = req.params.id as string;
    const task = await this.updateTaskUseCase.execute(id, req.body);
    const response: ApiResponse<typeof task> = {
      success: true,
      data: task,
      message: "Task updated successfully",
    };
    res.status(200).json(response);
  };

  search = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const userId = req.user!.userId;
    const query = (req.query.q as string) || "";
    const tasks = await this.searchTasksUseCase.execute(userId, query);
    const response: ApiResponse<typeof tasks> = {
      success: true,
      data: tasks,
    };
    res.status(200).json(response);
  };
}
