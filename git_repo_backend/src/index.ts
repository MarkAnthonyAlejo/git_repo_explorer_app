import express from 'express';
import dotenv from 'dotenv';
import userRoutes from './routes/userRoutes';
import cors from 'cors';

dotenv.config();

const app = express();
const allowedOrigins = [
  'https://git-repo-explorer-app.vercel.app', 
  'https://git-repo-explorer-app-1.onrender.com'
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log(`Blocked by CORS: ${origin}`)
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));

app.get('/', (req, res) => {
  res.send('Git Repo Explorer Backend is Running ✅');
});

app.use(express.json());
app.use('/users', userRoutes);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
