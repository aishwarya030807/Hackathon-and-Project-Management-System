import { validationResult } from 'express-validator';
import AppError from '../utils/AppError.js';
export const validate = (req, _res, next) => { const result = validationResult(req); if (!result.isEmpty()) return next(new AppError('Validation failed', 422, result.array())); next(); };
