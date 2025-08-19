import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors'
import cookieParser from 'cookie-parser';

dotenv.config();

const InventoryServer = express();
const port = process.env.inventoryport;

//Setup Middlewares
InventoryServer.use(cors({
    origin:'http://localhost:5173',
    credentials:true
}))
InventoryServer.use(express.json({ limit: '20mb' }));
InventoryServer.use(cookieParser())
InventoryServer.use('/api/inventoryservice', signUpRouter);



try {
  
  InventoryServer.listen(port, () => {
    objUserDb.connectDB();
    console.log(`User server is running on port: ${port}`);
  }); 
} catch (error) {
  console.error("Error initiating server:", error);
}
