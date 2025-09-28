const User = require('../models/User');
const { validationResult } = require('express-validator');
const { asyncHandler, AppError } = require('../utils/helpers');

class UserController {
  getProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user.id);

    res.json({
      success: true,
      data: { user }
    });
  });

  updateProfile = asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({
        success: false,
        message: 'Помилка валідації',
        errors: errors.array().map(error => ({
          field: error.path,
          message: error.msg
        }))
      });
    }

    const allowedUpdates = ['firstName', 'lastName', 'phone', 'preferences'];
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
      message: 'Профіль успішно оновлено',
      data: { user }
    });
  });

  getAddresses = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user.id).select('addresses');

    res.json({
      success: true,
      data: { addresses: user.addresses }
    });
  });

  addAddress = asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({
        success: false,
        message: 'Помилка валідації',
        errors: errors.array().map(error => ({
          field: error.path,
          message: error.msg
        }))
      });
    }

    const user = await User.findById(req.user.id);
    
    // Якщо це перша адреса або встановлена як за замовчуванням
    if (user.addresses.length === 0 || req.body.isDefault) {
      // Зняти мітку за замовчуванням з інших адрес
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
      message: 'Адресу додано',
      data: { address: newAddress }
    });
  });

  updateAddress = asyncHandler(async (req, res) => {
    const { addressId } = req.params;
    const user = await User.findById(req.user.id);
    
    const address = user.addresses.id(addressId);
    if (!address) {
      throw new AppError('Адресу не знайдено', 404);
    }

    // Якщо встановлюємо як за замовчуванням
    if (req.body.isDefault) {
      user.addresses.forEach(addr => addr.isDefault = false);
    }

    Object.keys(req.body).forEach(key => {
      address[key] = req.body[key];
    });

    await user.save();

    res.json({
      success: true,
      message: 'Адресу оновлено',
      data: { address }
    });
  });

  deleteAddress = asyncHandler(async (req, res) => {
    const { addressId } = req.params;
    const user = await User.findById(req.user.id);
    
    const address = user.addresses.id(addressId);
    if (!address) {
      throw new AppError('Адресу не знайдено', 404);
    }

    const wasDefault = address.isDefault;
    address.remove();

    // Якщо видалили адресу за замовчуванням, встановити першу наявну
    if (wasDefault && user.addresses.length > 0) {
      user.addresses[0].isDefault = true;
    }

    await user.save();

    res.json({
      success: true,
      message: 'Адресу видалено'
    });
  });

  getUserStatistics = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    
    const user = await User.findById(userId)
      .select('statistics')
      .populate('statistics.favoriteItems.menuItemId', 'name images');

    res.json({
      success: true,
      data: { statistics: user.statistics }
    });
  });
}

module.exports = new UserController();