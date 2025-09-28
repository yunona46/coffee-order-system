const validate = (schema) => {
    return (req, res, next) => {
        const { error } = schema.validate(req.body, { abortEarly: false });
        
        if (error) {
            const errors = error.details.map(detail => ({
                field: detail.path[0],
                message: detail.message,
                code: 'VALIDATION_ERROR'
            }));
            
            return res.status(422).json({
                success: false,
                message: 'Помилка валідації',
                code: 'VALIDATION_ERROR',
                errors
            });
        }
        
        next();
    };
};

module.exports = validate;
