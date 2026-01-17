import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { register, login } from './controllers/auth.controller';
import { getAllUsers, getUserById, updateUser, deleteUser } from './controllers/user.controller';
import { authenticate, authorizeAdmin } from './middleware/auth.middleware';

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// Routes

// Auth Routes (Public)
app.post('/auth/register', register);
app.post('/auth/login', login);

// User Routes (Protected: Admin Only)
// All routes starting with /users require authentication and admin role
app.use('/users', authenticate, authorizeAdmin);

app.get('/users', getAllUsers);
app.get('/users/:id', getUserById);
app.put('/users/:id', updateUser);
app.delete('/users/:id', deleteUser);

// Health Check
app.get('/', (req, res) => {
    res.json({ message: 'User Management API is running' });
});

export default app;
