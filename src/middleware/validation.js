const validator = require('validator');

const validateRegistration = (req, res, next) => {
    const { firstName, lastName, email, password, phone } = req.body;
    const errors = [];

    // Validate first name
    if (!firstName || firstName.length < 2) {
        errors.push({
            field: 'firstName',
            message: 'First name must be at least 2 characters long',
            code: 'INVALID_FIRST_NAME'
        });
    }

    // Validate last name
    if (!lastName || lastName.length < 2) {
        errors.push({
            field: 'lastName',
            message: 'Last name must be at least 2 characters long',
            code: 'INVALID_LAST_NAME'
        });
    }

    // Validate email
    if (!email || !validator.isEmail(email)) {
        errors.push({
            field: 'email',
            message: 'Valid email address is required',
            code: 'INVALID_EMAIL'
        });
    }

    // Validate password
    if (!password || password.length < 6) {
        errors.push({
            field: 'password',
            message: 'Password must be at least 6 characters long',
            code: 'INVALID_PASSWORD'
        });
    }

    // Validate phone (optional)
    if (phone && !validator.isMobilePhone(phone, 'any')) {
        errors.push({
            field: 'phone',
            message: 'Valid phone number is required',
            code: 'INVALID_PHONE'
        });
    }

    if (errors.length > 0) {
        return res.status(422).json({
            success: false,
            message: 'Validation failed',
            code: 'VALIDATION_ERROR',
            errors: errors
        });
    }

    next();
};

const validateLogin = (req, res, next) => {
    const { email, password } = req.body;
    const errors = [];

    if (!email || !validator.isEmail(email)) {
        errors.push({
            field: 'email',
            message: 'Valid email address is required',
            code: 'INVALID_EMAIL'
        });
    }

    if (!password) {
        errors.push({
            field: 'password',
            message: 'Password is required',
            code: 'INVALID_PASSWORD'
        });
    }

    if (errors.length > 0) {
        return res.status(422).json({
            success: false,
            message: 'Validation failed',
            code: 'VALIDATION_ERROR',
            errors: errors
        });
    }

    next();
};

const validateOrder = (req, res, next) => {
    const { deliveryType, paymentMethod, contactPhone, deliveryAddress } = req.body;
    const errors = [];

    // Validate delivery type
    if (!deliveryType || !['delivery', 'pickup'].includes(deliveryType)) {
        errors.push({
            field: 'deliveryType',
            message: 'Delivery type must be either "delivery" or "pickup"',
            code: 'INVALID_DELIVERY_TYPE'
        });
    }

    // Validate payment method
    if (!paymentMethod || !['cash', 'card', 'online'].includes(paymentMethod)) {
        errors.push({
            field: 'paymentMethod',
            message: 'Payment method must be either "cash", "card", or "online"',
            code: 'INVALID_PAYMENT_METHOD'
        });
    }

    // Validate contact phone
    if (!contactPhone) {
        errors.push({
            field: 'contactPhone',
            message: 'Contact phone is required',
            code: 'CONTACT_PHONE_REQUIRED'
        });
    } else if (!validator.isMobilePhone(contactPhone, 'any')) {
        errors.push({
            field: 'contactPhone',
            message: 'Valid phone number is required',
            code: 'INVALID_PHONE'
        });
    }

    // Validate delivery address for delivery orders
    if (deliveryType === 'delivery') {
        if (!deliveryAddress) {
            errors.push({
                field: 'deliveryAddress',
                message: 'Delivery address is required for delivery orders',
                code: 'DELIVERY_ADDRESS_REQUIRED'
            });
        } else {
            if (!deliveryAddress.street) {
                errors.push({
                    field: 'deliveryAddress.street',
                    message: 'Street is required',
                    code: 'STREET_REQUIRED'
                });
            }
            if (!deliveryAddress.building) {
                errors.push({
                    field: 'deliveryAddress.building',
                    message: 'Building number is required',
                    code: 'BUILDING_REQUIRED'
                });
            }
        }
    }

    if (errors.length > 0) {
        return res.status(400).json({
            success: false,
            message: 'Validation failed',
            code: 'VALIDATION_ERROR',
            errors: errors
        });
    }

    next();
};

const validateProfileUpdate = (req, res, next) => {
    const { firstName, lastName, phone, preferences } = req.body;
    const errors = [];

    // Validate first name
    if (firstName && firstName.length < 2) {
        errors.push({
            field: 'firstName',
            message: 'First name must be at least 2 characters long',
            code: 'INVALID_FIRST_NAME'
        });
    }

    // Validate last name
    if (lastName && lastName.length < 2) {
        errors.push({
            field: 'lastName',
            message: 'Last name must be at least 2 characters long',
            code: 'INVALID_LAST_NAME'
        });
    }

    // Validate phone
    if (phone && !validator.isMobilePhone(phone, 'any')) {
        errors.push({
            field: 'phone',
            message: 'Valid phone number is required',
            code: 'INVALID_PHONE'
        });
    }

    if (errors.length > 0) {
        return res.status(400).json({
            success: false,
            message: 'Validation failed',
            code: 'VALIDATION_ERROR',
            errors: errors
        });
    }

    next();
};

module.exports = { 
    validateRegistration, 
    validateLogin, 
    validateOrder, 
    validateProfileUpdate 
};
