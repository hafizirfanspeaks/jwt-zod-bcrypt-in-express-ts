import { Document, Types } from 'mongoose';

export interface IUser extends Document {
    _id: Types.ObjectId;
    email: string;
    password?: string; // Optional because we might exclude it
    role: 'user' | 'admin';
    createdAt: Date;
    updatedAt: Date;
}

export interface IJwtPayload {
    userId: string;
    role: 'user' | 'admin';
}
