
import authenticate from '../middlewares/authenticate.js';
import { registerSchema, loginSchema } from '../utils/validators.js';
import * as authService from '../services/authService.js';   

export const register = async (req, res, next) => {
  try {
    const validatedData = registerSchema.parse(req.body);
    const user = await authService.register(validatedData);
    
    res.status(201).json({ user });
  } catch (error) {
    if (error.name === 'ZodError') return res.status(400).json(error.errors);
    if (error.message === 'EMAIL_ALREADY_USED') return res.status(409).json({ message: "Email déjà utilisé" });
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = loginSchema.parse(req.body);
    const result = await authService.login(email, password);
    res.json(result);
  } catch (error) {
    if (error.name === 'ZodError') return res.status(400).json(error.errors);
    if (error.message === 'INVALID_CREDENTIALS') {
      return res.status(401).json({ message: "Email ou mot de passe incorrect" });
    }
    next(error);
  }
};

export const getMe = async (req, res) => {

  const user = await require('../db/prisma').user.findUnique({
    where: { id: req.user.id },
    select: { id: true, nom: true, email: true, role: true, createdAt: true }
  });
  res.json(user);
};