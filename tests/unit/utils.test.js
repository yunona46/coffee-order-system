// tests/unit/utils.test.js - тести для утиліт
import { asyncHandler, AppError } from "../../utils/helpers.js";

describe("Utils Tests", () => {
  describe("asyncHandler", () => {
    test("should handle async functions correctly", async () => {
      const mockReq = {};
      const mockRes = {};
      const mockNext = jest.fn();
      
      const asyncFn = async (req, res, next) => {
        return "success";
      };
      
      const handler = asyncHandler(asyncFn);
      await handler(mockReq, mockRes, mockNext);
      
      expect(mockNext).not.toHaveBeenCalled();
    });
  });

  describe("AppError", () => {
    test("should create AppError with correct properties", () => {
      const error = new AppError("Test error", 400, "TEST_ERROR");
      
      expect(error.message).toBe("Test error");
      expect(error.statusCode).toBe(400);
      expect(error.code).toBe("TEST_ERROR");
      expect(error.isOperational).toBe(true);
    });
  });
});
