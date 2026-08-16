import { Router } from 'express'; import { body } from 'express-validator'; import * as controller from '../controllers/authController.js'; import { protect } from '../middleware/authMiddleware.js'; import { validate } from '../middleware/validationMiddleware.js';
const router=Router(); const credentials=[body('email').isEmail().normalizeEmail(),body('password').isLength({min:8,max:128})];
/** @swagger
 * /auth/register: { post: { summary: Register a user, requestBody: { required: true }, responses: { 201: { description: Created } } } }
 * /auth/login: { post: { summary: Log in, responses: { 200: { description: JWT returned } } } }
 * /auth/profile: { get: { summary: Current user profile, security: [{ bearerAuth: [] }], responses: { 200: { description: Profile } } } }
 */
router.post('/register',[body('name').trim().isLength({min:2,max:100}),...credentials],validate,controller.register);router.post('/login',credentials,validate,controller.login);router.get('/profile',protect,controller.profile);export default router;
