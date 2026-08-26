export interface TaskProps {
  id?: string;
  title: string;
  description: string;
  completed: boolean;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export class Task {
  readonly id?: string;
  readonly title: string;
  readonly description: string;
  readonly completed: boolean;
  readonly userId: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;

  private constructor(props: TaskProps) {
    this.id = props.id;
    this.title = props.title;
    this.description = props.description;
    this.completed = props.completed;
    this.userId = props.userId;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }

  static create(props: Omit<TaskProps, "createdAt" | "updatedAt" | "completed">): Task {
    return new Task({
      ...props,
      completed: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  static fromPersistence(props: TaskProps): Task {
    return new Task(props);
  }

  update(props: Partial<Pick<TaskProps, "title" | "description" | "completed">>): Task {
    return new Task({
      ...this.toObject(),
      title: props.title !== undefined ? props.title : this.title,
      description: props.description !== undefined ? props.description : this.description,
      completed: props.completed !== undefined ? props.completed : this.completed,
      updatedAt: new Date(),
    });
  }

  toObject(): TaskProps {
    return {
      id: this.id,
      title: this.title,
      description: this.description,
      completed: this.completed,
      userId: this.userId,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
