import dotenv from 'dotenv';
import app from './app.js';
import connectDB from './config/db.js';

dotenv.config();

const port = process.env.PORT || 5001;

await connectDB();

app.listen(port, () => {
  console.log(`Veloura API running on port ${port}`);
});
