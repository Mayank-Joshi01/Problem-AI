import  express  from "express"
import cors from "cors"
import {Request, Response} from "express"
import mongoose from "mongoose";
import chatsRouter from "./routes/chats.js";
import messagesRouter from "./routes/messages.js";


const app = express()


app.use(cors())
app.use(express.json())

// Connect to MongoDB
const MONGO = process.env.MONGODB_URI || "mongodb+srv://MayankJoshi:mayankjoshi@cluster0.wdt0mrj.mongodb.net/";
mongoose
  .connect(MONGO)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });


// API routes
app.use("/api/chats", chatsRouter);         // GET /, POST /, GET /:id, DELETE /:id
app.use("/api/chats", messagesRouter);      // POST /:id/messages



app.listen(5000,()=>{
    console.log("Server is running on port 5000")
})