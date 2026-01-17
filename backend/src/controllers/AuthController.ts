import { Request, Response } from 'express';
import { User } from '../models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'secret-key';

export class AuthController {
  async signUp(req: Request, res: Response) {
    console.log('Received signup request:', req.body);
    try {
      const { email, password, full_name } = req.body;

      if (!email || !password) {
        console.log('Missing email or password');
        return res.status(400).json({ error: 'Email và mật khẩu là bắt buộc' });
      }

      console.log('Checking existing user...');
      const existing = await User.findOne({ where: { email } });
      if (existing) {
        console.log('User already exists');
        return res.status(409).json({ error: 'Email đã tồn tại' });
      }

      console.log('Hashing password...');
      const hashedPassword = await bcrypt.hash(password, 10);

      console.log('Creating user...');
      const user = await User.create({
        email,
        password: hashedPassword,
        full_name,
        role: 'admin' // Default to admin for simplicity
      });
      console.log('User created:', user.id);

      res.status(201).json({ message: 'Đăng ký thành công', userId: user.id });
    } catch (error: any) {
      console.error('Signup error:', error);
      res.status(500).json({ error: error.message });
    }
  }

  async signIn(req: Request, res: Response) {
    console.log('Received signin request:', req.body);
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ error: 'Email và mật khẩu là bắt buộc' });
      }

      const user = await User.findOne({ where: { email } });
      if (!user) {
        return res.status(401).json({ error: 'Email hoặc mật khẩu không chính xác' });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ error: 'Email hoặc mật khẩu không chính xác' });
      }

      const token = jwt.sign(
        { userId: user.id, email: user.email, role: user.role },
        JWT_SECRET,
        { expiresIn: '24h' }
      );

      res.json({ token, role: user.role });
    } catch (error: any) {
      console.error('Signin error:', error);
      res.status(500).json({ error: error.message });
    }
  }
}
