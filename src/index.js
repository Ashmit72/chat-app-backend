import express from 'express'
import authRoutes from './routes/auth.routes.js'
import dotenv from 'dotenv'
import { connectDb } from './lib/db.js'
import cookieParser from 'cookie-parser'
import messageRoutes from "./routes/message.route.js"
import { app, server } from './lib/socket.js'
import cors from 'cors'
dotenv.config()



const PORT = process.env.PORT || 5001

app.use(express.json())
app.use(cookieParser())
app.use(cors({
origin:process.env.CLIENT_URI,
methods:["GET", "POST", "PUT", "DELETE"],
credentials:true
}))
app.use("/api/auth", authRoutes)
app.use("/api/message", messageRoutes)
app.get('/', (req,res) => {
    res.send('Hello Server is Running!')
})

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
    connectDb()
}
)