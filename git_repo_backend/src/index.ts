import express from 'express';
import dotenv from 'dotenv';
import userRoutes from './routes/userRoutes';
import cors from 'cors';

dotenv.config();

const app = express();

app.use(cors({
  origin: 'http://localhost:3000', // frontend URL
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
