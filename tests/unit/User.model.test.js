import User from "../../models/User.js";

describe("User Model Tests", () => {
  beforeEach(async () => {
    await User.deleteMany({});
  });

  test("should create a user successfully", async () => {
    const userData = {
      firstName: "John",
      lastName: "Doe",
      email: "john@example.com",
      password: "password123"
    };

    const user = new User(userData);
    const savedUser = await user.save();

    expect(savedUser._id).toBeDefined();
    expect(savedUser.email).toBe(userData.email);
    expect(savedUser.firstName).toBe(userData.firstName);
    expect(savedUser.lastName).toBe(userData.lastName);
    expect(savedUser.password).not.toBe(userData.password); // Password should be hashed
  });

  test("should not create user with duplicate email", async () => {
    const userData = {
      firstName: "John",
      lastName: "Doe",
      email: "john@example.com",
      password: "password123"
    };

    await new User(userData).save();

    const duplicateUser = new User(userData);
    
    await expect(duplicateUser.save())
      .rejects
      .toThrow();
  });

  test("should compare password correctly", async () => {
    const userData = {
      firstName: "John",
      lastName: "Doe",
      email: "john@example.com",
      password: "password123"
    };

    const user = new User(userData);
    await user.save();

    const isMatch = await user.comparePassword("password123");
    const isNotMatch = await user.comparePassword("wrongpassword");

    expect(isMatch).toBe(true);
    expect(isNotMatch).toBe(false);
  });

  test("should generate JWT token", async () => {
    const userData = {
      firstName: "John",
      lastName: "Doe",
      email: "john@example.com",
      password: "password123"
    };

    const user = new User(userData);
    await user.save();

    const token = user.generateJWT();

    expect(typeof token).toBe("string");
    expect(token.length).toBeGreaterThan(0);
  });

  test("should return fullName virtual field", async () => {
    const userData = {
      firstName: "John",
      lastName: "Doe",
      email: "john@example.com",
      password: "password123"
    };

    const user = new User(userData);
    await user.save();

    expect(user.fullName).toBe("John Doe");
  });
});
