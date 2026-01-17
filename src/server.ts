import dotenv from 'dotenv';
// Load env vars before importing app
dotenv.config();

import mongoose from 'mongoose';
import app from './app';

const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/zodd';

// Connect to MongoDB
mongoose
    .connect(MONGO_URI)
    .then(() => {
        console.log('Connected to MongoDB');
        // Start Server
        const server = app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
            console.log(`Test with: http://localhost:${PORT}`);
        });

        server.on('error', (error: any) => {
            if (error.code === 'EADDRINUSE') {
                console.error(`ERROR: Port ${PORT} is already in use.`);
                console.error('Likely there is a zombie node process running from a previous crash.');
                console.error('Please run: "taskkill /F /IM node.exe" in your terminal to kill it.');
                process.exit(1);
            } else {
                console.error(error);
            }
        });

        // Graceful Shutdown
        const shutdown = () => {
            server.close(() => {
                mongoose.connection.close(false).then(() => {
                    console.log('MongoDB connection closed');
                    process.exit(0);
                });
            });
        };

        process.on('SIGTERM', shutdown);
        process.on('SIGINT', shutdown);

    })
    .catch((error) => {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    });
