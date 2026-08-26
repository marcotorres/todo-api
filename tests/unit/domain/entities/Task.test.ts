import { describe, it, expect } from "vitest";
import { Task } from "../../../../src/domain/entities/Task";

describe("Task Entity", () => {
  describe("create", () => {
    it("should create a new task with default values", () => {
      const task = Task.create({
        title: "Test Task",
        description: "Test Description",
        userId: "user-1",
      });

      expect(task.title).toBe("Test Task");
      expect(task.description).toBe("Test Description");
      expect(task.userId).toBe("user-1");
      expect(task.completed).toBe(false);
      expect(task.createdAt).toBeInstanceOf(Date);
      expect(task.updatedAt).toBeInstanceOf(Date);
      expect(task.id).toBeUndefined();
    });
  });

  describe("fromPersistence", () => {
    it("should create a task from persistence data", () => {
      const date = new Date("2024-01-01");
      const task = Task.fromPersistence({
        id: "task-1",
        title: "Persisted Task",
        description: "Persisted Description",
        completed: true,
        userId: "user-1",
        createdAt: date,
        updatedAt: date,
      });

      expect(task.id).toBe("task-1");
      expect(task.title).toBe("Persisted Task");
      expect(task.completed).toBe(true);
      expect(task.createdAt).toEqual(date);
    });
  });

  describe("update", () => {
    it("should return a new task with updated fields", () => {
      const originalDate = new Date("2024-01-01");
      const task = Task.fromPersistence({
        id: "task-1",
        title: "Original Title",
        description: "Original Description",
        completed: false,
        userId: "user-1",
        createdAt: originalDate,
        updatedAt: originalDate,
      });

      const updated = task.update({ title: "Updated Title", completed: true });

      expect(updated.title).toBe("Updated Title");
      expect(updated.completed).toBe(true);
      expect(updated.description).toBe("Original Description");
      expect(updated.updatedAt.getTime()).toBeGreaterThan(originalDate.getTime());
      expect(task.title).toBe("Original Title");
    });

    it("should only update provided fields", () => {
      const task = Task.fromPersistence({
        id: "task-1",
        title: "Original",
        description: "Description",
        completed: false,
        userId: "user-1",
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const updated = task.update({ completed: true });

      expect(updated.title).toBe("Original");
      expect(updated.completed).toBe(true);
    });
  });

  describe("toObject", () => {
    it("should return plain object representation", () => {
      const date = new Date("2024-01-01");
      const task = Task.fromPersistence({
        id: "task-1",
        title: "Test",
        description: "Desc",
        completed: false,
        userId: "user-1",
        createdAt: date,
        updatedAt: date,
      });

      const obj = task.toObject();

      expect(obj).toEqual({
        id: "task-1",
        title: "Test",
        description: "Desc",
        completed: false,
        userId: "user-1",
        createdAt: date,
        updatedAt: date,
      });
    });
  });
});
