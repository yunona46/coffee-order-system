import authService from "../../services/authService.js";
import User from "../../models/User.js";

describe("AuthService Unit Tests", () => {
  beforeEach(async () => {
    // Очищаємо базу даних перед кожним тестом
    if (User.db.readyState === 1) {
      await User.deleteMany({});
    }
  });

  describe("registerUser", () => {
    test("should register a new user successfully", async () => {
      const userData = {
        firstName: "John",
        lastName: "Doe",
        email: "john@example.com",
        password: "password123"
      };

      const result = await authService.registerUser(userData);

      expect(result.user).toHaveProperty("email", "john@example.com");
      expect(result.user).not.toHaveProperty("password");
      expect(result).toHaveProperty("accessToken");
    });

    test("should throw error for duplicate email", async () => {
      const userData = {
        firstName: "John",
        lastName: "Doe",
        email: "john@example.com",
        password: "password123"
      };

      // Перша реєстрація
      await authService.registerUser(userData);

      // Друга спроба реєстрації з тим же email
      await expect(authService.registerUser(userData))
        .rejects
        .toThrow("Користувач з таким email вже існує");
    });
  });
});
