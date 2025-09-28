// tests/basic.test.js - простий тест для перевірки налаштувань
describe("Basic Test Setup", () => {
  test("should pass basic test", () => {
    expect(1 + 1).toBe(2);
  });

  test("should have test user defined", () => {
    expect(global.testUser).toBeDefined();
    expect(global.testUser.email).toBe("test@example.com");
  });
});
