import * as service from '../services/projectService.js'; import asyncHandler from '../utils/asyncHandler.js';
export const list=asyncHandler(async(req,res)=>res.json({projects:await service.list(req.query)}));
export const get=asyncHandler(async(req,res)=>res.json({project:await service.get(req.params.id)}));
export const create=asyncHandler(async(req,res)=>res.status(201).json({project:await service.create(req.body,req.user.id)}));
export const update=asyncHandler(async(req,res)=>res.json({project:await service.update(req.params.id,req.body,req.user)}));
export const remove=asyncHandler(async(req,res)=>{await service.remove(req.params.id,req.user);res.status(204).send();});
export const adopt=asyncHandler(async(req,res)=>res.status(201).json({adoption:await service.adopt(req.params.id,req.user.id,req.body.message)}));
export const recommendations=asyncHandler(async(req,res)=>res.json({hackathons:await service.recommendations(req.params.id)}));
