import User from "../models/User.js";
import { asyncHandler } from "../utils/helpers.js";

class UserController {
  getProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user.id);

    res.json({
      success: true,
      data: { user }
    });
  });

  updateProfile = asyncHandler(async (req, res) => {
    const allowedUpdates = ["firstName", "lastName", "phone", "preferences"];
    const updates = {};
    
    Object.keys(req.body).forEach(key => {
      if (allowedUpdates.includes(key)) {
        updates[key] = req.body[key];
      }
    });

    const user = await User.findByIdAndUpdate(
      req.user.id,
      updates,
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: "Профіль успішно оновлено",
      data: { user }
    });
  });

  getAddresses = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user.id).select("addresses");

    res.json({
      success: true,
      data: { addresses: user.addresses }
    });
  });

  addAddress = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user.id);
    
    if (user.addresses.length === 0 || req.body.isDefault) {
      user.addresses.forEach(addr => addr.isDefault = false);
    }

    user.addresses.push({
      ...req.body,
      isDefault: user.addresses.length === 0 ? true : (req.body.isDefault || false)
    });

    await user.save();

    const newAddress = user.addresses[user.addresses.length - 1];

    res.status(201).json({
      success: true,
      message: "Адресу додано",
      data: { address: newAddress }
    });
  });

  updateAddress = asyncHandler(async (req, res) => {
    const { addressId } = req.params;
    const user = await User.findById(req.user.id);
    
    const address = user.addresses.id(addressId);
    if (!address) {
      return res.status(404).json({
        success: false,
        message: "Адресу не знайдено"
      });
    }

    if (req.body.isDefault) {
      user.addresses.forEach(addr => addr.isDefault = false);
    }

    Object.keys(req.body).forEach(key => {
      address[key] = req.body[key];
    });

    await user.save();

    res.json({
      success: true,
      message: "Адресу оновлено",
      data: { address }
    });
  });

  deleteAddress = asyncHandler(async (req, res) => {
    const { addressId } = req.params;
    const user = await User.findById(req.user.id);
    
    const address = user.addresses.id(addressId);
    if (!address) {
      return res.status(404).json({
        success: false,
        message: "Адресу не знайдено"
      });
    }

    const wasDefault = address.isDefault;
    address.remove();

    if (wasDefault && user.addresses.length > 0) {
      user.addresses[0].isDefault = true;
    }

    await user.save();

    res.json({
      success: true,
      message: "Адресу видалено"
    });
  });

  getUserStatistics = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    
    const user = await User.findById(userId)
      .select("statistics")
      .populate("statistics.favoriteItems.menuItemId", "name images");

    res.json({
      success: true,
      data: { statistics: user.statistics }
    });
  });
}

const userController = new UserController();
export default userController;
