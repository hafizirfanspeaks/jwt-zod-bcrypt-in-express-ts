import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { z } from 'zod';
import User from '../models/user.model';
import { signToken } from '../utils/jwt.utils';

// Zod Schemas
const registerSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
    role: z.enum(['user', 'admin']).optional(),
});

const loginSchema = z.object({
    email: z.string().email(),
    password: z.string(),
});

export const register = async (req: Request, res: Response) => {
    try {
        // Validate input
        const parseResult = registerSchema.safeParse(req.body);
        if (!parseResult.success) {
            return res.status(400).json({ error: parseResult.error.errors });
        }

        const { email, password, role } = parseResult.data;

        // Check if user exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const newUser = await User.create({
            email,
            password: hashedPassword,
            role: role || 'user',
        });

        res.status(201).json({ message: 'User registered successfully', userId: newUser._id.toString() });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        // Validate input
        const parseResult = loginSchema.safeParse(req.body);
        if (!parseResult.success) {
            return res.status(400).json({ error: parseResult.error.errors });
        }

        const { email, password } = parseResult.data;

        // Find user
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password as string);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Generate token
        const token = signToken({ userId: user._id.toString(), role: user.role });

        res.json({ token, expiresIn: process.env.JWT_EXPIRES_IN || '1h' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};
