import jwt, { SignOptions } from 'jsonwebtoken';
import { IJwtPayload } from '../interfaces/user.interface';

export const signToken = (payload: IJwtPayload): string => {
    const signInOptions: SignOptions = {
        expiresIn: (process.env.JWT_EXPIRES_IN || '1h') as any,
    };
    return jwt.sign(payload, process.env.JWT_SECRET as string, signInOptions);
};

export const verifyToken = (token: string): IJwtPayload | null => {
    try {
        return jwt.verify(token, process.env.JWT_SECRET as string) as IJwtPayload;
    } catch (error) {
        return null;
    }
};
