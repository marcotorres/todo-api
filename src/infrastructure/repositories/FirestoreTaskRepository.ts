import { Task, ITaskRepository } from "../../domain";
import { db, COLLECTIONS } from "../database/firebase";

export class FirestoreTaskRepository implements ITaskRepository {
  private readonly collection = db.collection(COLLECTIONS.TASKS);

  async findAll(): Promise<Task[]> {
    const snapshot = await this.collection.orderBy("createdAt", "desc").get();
    return snapshot.docs.map((doc) => this.mapToEntity(doc));
  }

  async findById(id: string): Promise<Task | null> {
    const doc = await this.collection.doc(id).get();
    if (!doc.exists) {
      return null;
    }
    return this.mapToEntity(doc);
  }

  async create(task: Task): Promise<Task> {
    const data = this.mapToFirestore(task);
    const docRef = await this.collection.add(data);
    return Task.fromPersistence({ ...task.toObject(), id: docRef.id });
  }

  async update(task: Task): Promise<Task> {
    const data = this.mapToFirestore(task);
    await this.collection.doc(task.id!).update(data);
    return task;
  }

  async delete(id: string): Promise<void> {
    await this.collection.doc(id).delete();
  }

  async findByUserId(userId: string): Promise<Task[]> {
    const snapshot = await this.collection
      .where("userId", "==", userId)
      .orderBy("createdAt", "desc")
      .get();
    return snapshot.docs.map((doc) => this.mapToEntity(doc));
  }

  async search(userId: string, query: string): Promise<Task[]> {
    // Firestore doesn't support full-text search, so we fetch user's tasks and filter in memory
    const tasks = await this.findByUserId(userId);
    const lowerQuery = query.toLowerCase();
    return tasks.filter(
      (task) =>
        task.title.toLowerCase().includes(lowerQuery) ||
        task.description.toLowerCase().includes(lowerQuery)
    );
  }

  private mapToEntity(doc: FirebaseFirestore.DocumentSnapshot): Task {
    const data = doc.data()!;
    return Task.fromPersistence({
      id: doc.id,
      title: data.title,
      description: data.description,
      completed: data.completed,
      userId: data.userId,
      createdAt: data.createdAt?.toDate() || new Date(),
      updatedAt: data.updatedAt?.toDate() || new Date(),
    });
  }

  private mapToFirestore(task: Task): Record<string, unknown> {
    const data: Record<string, unknown> = {};
    
    // Only include defined values (Firestore doesn't accept undefined)
    if (task.title !== undefined) data.title = task.title;
    if (task.description !== undefined) data.description = task.description;
    if (task.completed !== undefined) data.completed = task.completed;
    if (task.userId !== undefined) data.userId = task.userId;
    if (task.createdAt !== undefined) data.createdAt = task.createdAt;
    if (task.updatedAt !== undefined) data.updatedAt = task.updatedAt;

    return data;
  }
}
