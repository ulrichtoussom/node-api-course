import prisma from '../db/prisma.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';


const register = async (userData) => {
    
  // Vérifier si l'utilisateur existe déjà
  const existingUser = await prisma.user.findUnique({ where: { email: userData.email } });
  if (existingUser) throw new Error('EMAIL_ALREADY_USED');

  // Hachage du mot de passe (Section 2 : cost >= 10)
  const hashedPassword = await bcrypt.hash(userData.password, 10);

  const user = await prisma.user.create({
    data: {
      ...userData,
      password: hashedPassword
    }
  });

  // On ne renvoie pas le password
  const { password, ...userWithoutPassword } = user;
  return userWithoutPassword;
};

const login = async (email, password) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new Error('INVALID_CREDENTIALS');

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error('INVALID_CREDENTIALS');

  const token = jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  );

  const { password: _, ...userWithoutPassword } = user;
  return { user: userWithoutPassword, token };
};

export { register, login };