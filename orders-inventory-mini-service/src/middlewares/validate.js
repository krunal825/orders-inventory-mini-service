import { validationResult } from 'express-validator';


// Validation Middleware
export function validate(req, res, next) {
  const errors = validationResult(req);
  if (errors.isEmpty()) return next();
// if any validation errors
  const details = errors.array().map(e => ({
    field: e.path,
    message: e.msg
  }));
  return res.status(400).json({ code: 'VALIDATION_ERROR', message: 'Invalid input', details });
}
