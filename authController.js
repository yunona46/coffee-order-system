import authService from "../services/authService.js";
import { asyncHandler } from "../utils/helpers.js";

class AuthController {
  register = asyncHandler(async (req, res) => {
    const result = await authService.registerUser(req.body);

    res.status(201).json({
      success: true,
      message: "Користувач успішно зареєстрований",
      data: result
    });
  });

  login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const result = await authService.loginUser(email, password);

    res.json({
      success: true,
      message: "Успішна авторизація",
      data: result
    });
  });

  logout = asyncHandler(async (req, res) => {
    res.json({
      success: true,
      message: "Успішний вихід з системи"
    });
  });

  changePassword = asyncHandler(async (req, res) => {
    const { oldPassword, newPassword } = req.body;
    const userId = req.user.id;

    const result = await authService.changePassword(userId, oldPassword, newPassword);

    res.json({
      success: true,
      message: result.message
    });
  });

  forgotPassword = asyncHandler(async (req, res) => {
    const { email } = req.body;
    const result = await authService.forgotPassword(email);

    res.json({
      success: true,
      message: result.message
    });
  });

  getMe = asyncHandler(async (req, res) => {
    res.json({
      success: true,
      data: {
        user: req.user
      }
    });
  });
}

const authController = new AuthController();
export default authController;
