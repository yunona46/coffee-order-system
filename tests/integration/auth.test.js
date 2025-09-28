import request from "supertest";
import app from "../../server.js";
import User from "../../models/User.js";

describe("Auth API Integration Tests", () => {
  beforeEach(async () => {
    await User.deleteMany({});
  });

  describe("POST /api/v1/auth/register", () => {
    test("should register a new user", async () => {
      const userData = {
        firstName: "Test",
        lastName: "User",
        email: "test@example.com",
        password: "password123",
        phone: "+380501234567"
      };

      const response = await request(app)
        .post("/api/v1/auth/register")
        .send(userData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain("успішно зареєстрований");
      expect(response.body.data.user.email).toBe(userData.email);
      expect(response.body.data.user).not.toHaveProperty("password");
      expect(response.body.data).toHaveProperty("accessToken");
    });

    test("should return validation errors for invalid data", async () => {
      const invalidUserData = {
        firstName: "T", // Too short
        lastName: "U", // Too short
        email: "invalid-email",
        password: "123" // Too short
      };

      const response = await request(app)
        .post("/api/v1/auth/register")
        .send(invalidUserData)
        .expect(422);

      expect(response.body.success).toBe(false);
      expect(response.body.errors).toBeInstanceOf(Array);
      expect(response.body.errors.length).toBeGreaterThan(0);
    });
  });

  describe("POST /api/v1/auth/login", () => {
    beforeEach(async () => {
      // Створюємо користувача для тестування логіну
      const userData = {
        firstName: "Test",
        lastName: "User",
        email: "test@example.com",
        password: "password123"
      };

      await request(app)
        .post("/api/v1/auth/register")
        .send(userData);
    });

    test("should login user with correct credentials", async () => {
      const loginData = {
        email: "test@example.com",
        password: "password123"
      };

      const response = await request(app)
        .post("/api/v1/auth/login")
        .send(loginData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain("успішна авторизація");
      expect(response.body.data.user.email).toBe(loginData.email);
      expect(response.body.data).toHaveProperty("accessToken");
    });

    test("should return error for incorrect credentials", async () => {
      const loginData = {
        email: "test@example.com",
        password: "wrongpassword"
      };

      const response = await request(app)
        .post("/api/v1/auth/login")
        .send(loginData)
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain("Невірний email або пароль");
    });
  });

  describe("GET /api/v1/auth/me", () => {
    let authToken;

    beforeEach(async () => {
      // Реєструємо і логінимо користувача
      const userData = {
        firstName: "Test",
        lastName: "User",
        email: "test@example.com",
        password: "password123"
      };

      await request(app)
        .post("/api/v1/auth/register")
        .send(userData);

      const loginResponse = await request(app)
        .post("/api/v1/auth/login")
        .send({
          email: "test@example.com",
          password: "password123"
        });

      authToken = loginResponse.body.data.accessToken;
    });

    test("should get user profile with valid token", async () => {
      const response = await request(app)
        .get("/api/v1/auth/me")
        .set("Authorization", `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.user.email).toBe("test@example.com");
    });

    test("should return error without token", async () => {
      const response = await request(app)
        .get("/api/v1/auth/me")
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain("Токен доступу відсутній");
    });
  });
});
