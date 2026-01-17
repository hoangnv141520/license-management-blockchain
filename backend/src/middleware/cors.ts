import cors from 'cors';

const allowOriginsEnv = process.env.ALLOW_ORIGIN || 'http://localhost:3000';
const allowOrigins = allowOriginsEnv.split(',').map(origin => origin.trim()).filter(Boolean);

if (allowOrigins.length === 1 && allowOrigins[0] === '*') {
    // Default wildcard behavior
}

const corsOptions: cors.CorsOptions = {
    origin: (origin, callback) => {
        if (!origin || allowOrigins.includes('*') || allowOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Origin', 'Content-Type', 'Authorization'],
    exposedHeaders: ['Content-Length'],
    credentials: true,
    maxAge: 12 * 60 * 60, // 12 hours
};

export default cors(corsOptions);
