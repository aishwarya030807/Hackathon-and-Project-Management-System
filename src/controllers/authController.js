import * as service from '../services/authService.js'; import asyncHandler from '../utils/asyncHandler.js';
export const register=asyncHandler(async(req,res)=>res.status(201).json(await service.register(req.body)));
export const login=asyncHandler(async(req,res)=>res.json(await service.login(req.body.email,req.body.password)));
export const profile=asyncHandler(async(req,res)=>res.json({user:await service.profile(req.user.id)}));
