import express from 'express'
import authRoutes from './routes/auth.routes.js'
import dotenv from 'dotenv'
import { connectDb } from './lib/db.js'
import cookieParser from 'cookie-parser'
import messageRoutes from "./routes/message.route.js"
import { app, server } from './lib/socket.js'
// import cors from 'cors'
dotenv.config()



const PORT = process.env.PORT || 5001

app.use(express.json())
app.use(cookieParser())
// app.use(cors({
// origin: "http://localhost:5173",
// credentials:true
// }))
app.use("/api/auth", authRoutes)
app.use("/api/message", messageRoutes)

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
    connectDb()
}
)