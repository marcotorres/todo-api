import { describe, it, expect, beforeEach, vi } from "vitest";
import request from "supertest";
import { Application } from "express";
import { createApp } from "../../src/presentation/http";
import { Task, User, ITaskRepository, IUserRepository } from "../../src/domain";
import { createTestTask, createTestUser } from "../mocks/repositories";

// Mock JWT Service
vi.mock("../../src/infrastructure/services/JwtService", () => ({
  jwtService: {
    generateToken: vi.fn().mockReturnValue("mock-jwt-token"),
    generateRefreshToken: vi.fn().mockReturnValue("mock-refresh-token"),
    verifyToken: vi.fn().mockReturnValue({
      userId: "test-user-id",
      email: "test@example.com",
    }),
    verifyRefreshToken: vi.fn().mockReturnValue({
      userId: "test-user-id",
      email: "test@example.com",
    }),
  },
  JwtService: vi.fn(),
}));

const TEST_TOKEN = "Bearer valid-test-token";

describe("API Integration Tests", () => {
  let app: Application;
  let mockTaskRepository: ITaskRepository & { [K in keyof ITaskRepository]: ReturnType<typeof vi.fn> };
  let mockUserRepository: IUserRepository & { [K in keyof IUserRepository]: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    mockTaskRepository = {
      findAll: vi.fn(),
      findById: vi.fn(),
      findByUserId: vi.fn(),
      search: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    } as any;

    mockUserRepository = {
      findByEmail: vi.fn(),
      findById: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
    } as any;

    app = createApp({
      taskRepository: mockTaskRepository,
      userRepository: mockUserRepository,
    });
  });

  describe("GET /", () => {
    it("should return API info", async () => {
      const response = await request(app).get("/");

      expect(response.status).toBe(200);
      expect(response.body.message).toBe("TODO API");
      expect(response.body.status).toBe("healthy");
    });
  });

  describe("Tasks API", () => {
    describe("GET /tasks", () => {
      it("should return all tasks", async () => {
        const tasks = [
          createTestTask({ id: "1", title: "Task 1", userId: "test-user-id" }),
          createTestTask({ id: "2", title: "Task 2", userId: "test-user-id" }),
        ];
        mockTaskRepository.findByUserId.mockResolvedValue(tasks);

        const response = await request(app)
          .get("/tasks")
          .set("Authorization", TEST_TOKEN);

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.data).toHaveLength(2);
      });

      it("should return empty array when no tasks", async () => {
        mockTaskRepository.findByUserId.mockResolvedValue([]);

        const response = await request(app)
          .get("/tasks")
          .set("Authorization", TEST_TOKEN);

        expect(response.status).toBe(200);
        expect(response.body.data).toEqual([]);
      });
    });

    describe("POST /tasks", () => {
      it("should create a new task", async () => {
        mockTaskRepository.create.mockImplementation(async (task) => {
          return Task.fromPersistence({ ...task.toObject(), id: "new-id" });
        });

        const response = await request(app)
          .post("/tasks")
          .set("Authorization", TEST_TOKEN)
          .send({ title: "New Task", description: "Description", userId: "user-1" });

        expect(response.status).toBe(201);
        expect(response.body.success).toBe(true);
        expect(response.body.data.title).toBe("New Task");
        expect(response.body.message).toBe("Task created successfully");
      });

      it("should return 400 when title is missing", async () => {
        const response = await request(app)
          .post("/tasks")
          .set("Authorization", TEST_TOKEN)
          .send({ userId: "user-1" });

        expect(response.status).toBe(400);
        expect(response.body.success).toBe(false);
      });

    });

    describe("PUT /tasks/:id", () => {
      it("should update an existing task", async () => {
        const existingTask = createTestTask({ id: "task-1" });
        mockTaskRepository.findById.mockResolvedValue(existingTask);
        mockTaskRepository.update.mockImplementation(async (task) => task);

        const response = await request(app)
          .put("/tasks/task-1")
          .set("Authorization", TEST_TOKEN)
          .send({ title: "Updated", completed: true });

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.data.title).toBe("Updated");
      });

      it("should return 404 when task not found", async () => {
        mockTaskRepository.findById.mockResolvedValue(null);

        const response = await request(app)
          .put("/tasks/non-existent")
          .set("Authorization", TEST_TOKEN)
          .send({ title: "Updated" });

        expect(response.status).toBe(404);
        expect(response.body.success).toBe(false);
      });
    });

    describe("DELETE /tasks/:id", () => {
      it("should delete an existing task", async () => {
        const existingTask = createTestTask({ id: "task-1" });
        mockTaskRepository.findById.mockResolvedValue(existingTask);
        mockTaskRepository.delete.mockResolvedValue(undefined);

        const response = await request(app)
          .delete("/tasks/task-1")
          .set("Authorization", TEST_TOKEN);

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.message).toBe("Task deleted successfully");
      });

      it("should return 404 when task not found", async () => {
        mockTaskRepository.findById.mockResolvedValue(null);

        const response = await request(app)
          .delete("/tasks/non-existent")
          .set("Authorization", TEST_TOKEN);

        expect(response.status).toBe(404);
        expect(response.body.success).toBe(false);
      });
    });
  });

  describe("Users API", () => {
    describe("GET /users/:email", () => {
      it("should return user by email with abilities", async () => {
        const user = createTestUser({ email: "test@example.com" });
        mockUserRepository.findByEmail.mockResolvedValue(user);

        const response = await request(app).get("/users/test@example.com");

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.data.email).toBe("test@example.com");
        expect(response.body.data.abilities).toBeDefined();
        expect(Array.isArray(response.body.data.abilities)).toBe(true);
      });

      it("should return 404 when user not found", async () => {
        mockUserRepository.findByEmail.mockResolvedValue(null);

        const response = await request(app).get("/users/nonexistent@example.com");

        expect(response.status).toBe(404);
        expect(response.body.success).toBe(false);
      });
    });

    describe("POST /users", () => {
      const validUserPayload = {
        email: "new@example.com",
        name: "New User",
        lastname: "Test Lastname",
        termsAccepted: true,
        privacyPolicyAccepted: true,
        notificationPreferences: { email: true, sms: false, push: false },
      };

      it("should create a new user with abilities and token", async () => {
        mockUserRepository.findByEmail.mockResolvedValue(null);
        mockUserRepository.create.mockImplementation(async (user) => {
          return User.fromPersistence({ ...user.toObject(), id: "new-id" });
        });

        const response = await request(app)
          .post("/users")
          .send(validUserPayload);

        expect(response.status).toBe(201);
        expect(response.body.success).toBe(true);
        expect(response.body.data.email).toBe("new@example.com");
        expect(response.body.data.lastname).toBe("Test Lastname");
        expect(response.body.data.abilities).toBeDefined();
        expect(Array.isArray(response.body.data.abilities)).toBe(true);
        expect(response.body.data.token).toBeDefined();
      });

      it("should return 400 when email is missing", async () => {
        const response = await request(app)
          .post("/users")
          .send({ ...validUserPayload, email: undefined });

        expect(response.status).toBe(400);
        expect(response.body.success).toBe(false);
      });

      it("should return 400 when lastname is missing", async () => {
        const response = await request(app)
          .post("/users")
          .send({ ...validUserPayload, lastname: undefined });

        expect(response.status).toBe(400);
        expect(response.body.success).toBe(false);
      });

      it("should return 400 when terms not accepted", async () => {
        const response = await request(app)
          .post("/users")
          .send({ ...validUserPayload, termsAccepted: false });

        expect(response.status).toBe(400);
        expect(response.body.success).toBe(false);
      });

      it("should return 409 when email already exists", async () => {
        const existingUser = createTestUser({ email: "existing@example.com" });
        mockUserRepository.findByEmail.mockResolvedValue(existingUser);

        const response = await request(app)
          .post("/users")
          .send({ ...validUserPayload, email: "existing@example.com" });

        expect(response.status).toBe(409);
        expect(response.body.success).toBe(false);
      });
    });

    describe("POST /users/login", () => {
      it("should login and return token with abilities", async () => {
        const user = createTestUser({ email: "test@example.com" });
        mockUserRepository.findByEmail.mockResolvedValue(user);

        const response = await request(app)
          .post("/users/login")
          .send({ email: "test@example.com" });

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.data.email).toBe("test@example.com");
        expect(response.body.data.token).toBeDefined();
        expect(response.body.data.refreshToken).toBeDefined();
        expect(response.body.data.abilities).toBeDefined();
      });

      it("should return 404 when user not found", async () => {
        mockUserRepository.findByEmail.mockResolvedValue(null);

        const response = await request(app)
          .post("/users/login")
          .send({ email: "nonexistent@example.com" });

        expect(response.status).toBe(404);
        expect(response.body.success).toBe(false);
      });
    });
  });
});
