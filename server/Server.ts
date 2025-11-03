import  express  from "express"
import cors from "cors"
import {Request, Response} from "express"

const app = express()


app.use(cors())
app.use(express.json())

app.get("/",(req : Request,res: Response)=>{
    res.send({message: "Server is running"});
})

app.post("/api/chat",(req: Request,res: Response)=>{
    const prompt: string = req.body.prompt;
    if(!prompt){
        res.json({message:`Please provide a prompt`})
    }
    res.json({response:`You sent: ${prompt}`});
})
app.listen(5000,()=>{
    console.log("Server is running on port 5000")
})