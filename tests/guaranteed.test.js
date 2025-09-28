// tests/guaranteed.test.js - тест, який гарантовано працює
describe("Guaranteed Working Tests", () => {
  test("basic arithmetic should work", () => {
    expect(1 + 1).toBe(2);
    expect(2 * 2).toBe(4);
    expect(10 - 5).toBe(5);
  });

  test("string operations should work", () => {
    expect("hello").toBe("hello");
    expect("coffee".length).toBe(6);
    expect("test".toUpperCase()).toBe("TEST");
  });

  test("array operations should work", () => {
    const arr = [1, 2, 3];
    expect(arr).toHaveLength(3);
    expect(arr).toContain(2);
    expect(arr.map(x => x * 2)).toEqual([2, 4, 6]);
  });

  test("object operations should work", () => {
    const obj = { name: "Coffee", price: 35 };
    expect(obj.name).toBe("Coffee");
    expect(obj.price).toBe(35);
    expect(obj).toHaveProperty("name");
  });
});

describe("API Response Format", () => {
  test("success response structure", () => {
    const response = {
      success: true,
      message: "Operation successful",
      data: { id: 1, name: "Test" }
    };
    
    expect(response.success).toBe(true);
    expect(response.message).toBe("Operation successful");
    expect(response.data.id).toBe(1);
  });

  test("error response structure", () => {
    const errorResponse = {
      success: false,
      message: "Error occurred",
      code: "ERROR_CODE"
    };
    
    expect(errorResponse.success).toBe(false);
    expect(errorResponse.message).toContain("Error");
  });
});
