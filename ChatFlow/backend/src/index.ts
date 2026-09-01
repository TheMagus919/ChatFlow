import app from './app';
import dotenv from 'dotenv';
import { initSocket } from './socket';

dotenv.config();

const PORT = process.env.PORT || 3000;
/*
app.listen(PORT, () => {
  console.log(`🚀 ChatFlow API running on port ${PORT}`);
});*/

const httpServer = app.listen(PORT, () => {
  console.log(`🚀 ChatFlow API running on port ${PORT}`);
});

initSocket(httpServer);