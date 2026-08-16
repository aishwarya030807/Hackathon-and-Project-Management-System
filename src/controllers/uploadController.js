import asyncHandler from '../utils/asyncHandler.js'; import AppError from '../utils/AppError.js';
export const uploadFile=asyncHandler(async(req,res)=>{if(!req.file)throw new AppError('File is required',400);res.status(201).json({url:`${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`,filename:req.file.filename});});
