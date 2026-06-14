import express from 'express';
import cors from 'cors';
import authRouter from './routes/auth.js';
import mongoose from 'mongoose';
import config from './config/config.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const frontendPath = path.join(__dirname, '../frontend');

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/auth", authRouter);

// Serve static files from frontend
app.use(express.static(frontendPath));

// Catch-all for SPA - serve index.html for any other route
app.use((req, res) => {
  res.sendFile(path.join(frontendPath, 'index.html'));
});

const PORT = config.PORT || 5000;

mongoose.connect(config.mongoURI, {
            dbName: config.mongoDBName
        })
        .then(()=>{
            console.log('✅ Connected to MongoDB Atlas!');

            app.listen(PORT, function(){
                console.log(`🚀 Server running on http://localhost:${PORT}`);
                console.log(`Open your app at http://localhost:${PORT}`);
            });
        })
        .catch(function(error){
            console.error('❌ MongoDB connection failed:', error.message);
            process.exit(1);
        })