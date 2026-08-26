import { describe, it, expect } from "vitest";
import { User, UserStatus, UserRole, Gender } from "../../../../src/domain/entities/User";

describe("User Entity", () => {
  describe("create", () => {
    it("should create a new user with default values", () => {
      const user = User.create({
        uuid: "test-uuid-1234",
        email: "test@example.com",
        name: "Test User",
        lastname: "Test Lastname",
        termsAccepted: true,
        privacyPolicyAccepted: true,
        notificationPreferences: { email: true, sms: false, push: false },
        registrationData: {
          ipAddress: "127.0.0.1",
          userAgent: "test-agent",
          timestamp: new Date(),
        },
      });

      expect(user.email).toBe("test@example.com");
      expect(user.name).toBe("Test User");
      expect(user.lastname).toBe("Test Lastname");
      expect(user.uuid).toBe("test-uuid-1234");
      expect(user.status).toBe(UserStatus.ACTIVE);
      expect(user.role).toBe(UserRole.ADMIN);
      expect(user.createdAt).toBeInstanceOf(Date);
      expect(user.lastActivity).toBeInstanceOf(Date);
      expect(user.id).toBeUndefined();
    });
  });

  describe("fromPersistence", () => {
    it("should create a user from persistence data", () => {
      const date = new Date("2024-01-01");
      const user = User.fromPersistence({
        id: "user-1",
        uuid: "test-uuid-1234",
        email: "persisted@example.com",
        name: "Persisted User",
        lastname: "Persisted Lastname",
        termsAccepted: true,
        privacyPolicyAccepted: true,
        notificationPreferences: { email: true, sms: false, push: false },
        status: UserStatus.ACTIVE,
        role: UserRole.ADMIN,
        registrationData: {
          ipAddress: "127.0.0.1",
          userAgent: "test-agent",
          timestamp: date,
        },
        lastActivity: date,
        createdAt: date,
      });

      expect(user.id).toBe("user-1");
      expect(user.email).toBe("persisted@example.com");
      expect(user.name).toBe("Persisted User");
      expect(user.lastname).toBe("Persisted Lastname");
      expect(user.createdAt).toEqual(date);
    });
  });

  describe("toObject", () => {
    it("should return plain object representation", () => {
      const date = new Date("2024-01-01");
      const user = User.fromPersistence({
        id: "user-1",
        uuid: "test-uuid-1234",
        email: "test@example.com",
        name: "Test User",
        lastname: "Test Lastname",
        termsAccepted: true,
        privacyPolicyAccepted: true,
        notificationPreferences: { email: true, sms: false, push: false },
        status: UserStatus.ACTIVE,
        role: UserRole.ADMIN,
        registrationData: {
          ipAddress: "127.0.0.1",
          userAgent: "test-agent",
          timestamp: date,
        },
        lastActivity: date,
        createdAt: date,
      });

      const obj = user.toObject();

      expect(obj.id).toBe("user-1");
      expect(obj.email).toBe("test@example.com");
      expect(obj.name).toBe("Test User");
      expect(obj.lastname).toBe("Test Lastname");
      expect(obj.uuid).toBe("test-uuid-1234");
      expect(obj.status).toBe(UserStatus.ACTIVE);
      expect(obj.role).toBe(UserRole.ADMIN);
    });
  });
});
