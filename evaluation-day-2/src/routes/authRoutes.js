
import express from 'express';
import { Router } from 'express';

import { register, login, getMe } from '../controllers/authController.js';
import authenticate from '../middlewares/authenticate.js';

const router = Router();


router.post('/register', register);
router.post('/login', login);
router.get('/me', authenticate, getMe);

export default router  ;