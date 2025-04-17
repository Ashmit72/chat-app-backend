import {Server} from 'socket.io';
import http from 'http'
import express from 'express';


const app=express()
const server = http.createServer(app);

const io=new Server(server,{
    cors:{
        origin:process.env.CLIENT_URI,
    }
})

export function getRecieverSocketId(userId) {
  return userSocketMap[userId];
}

const userSocketMap={}

io.on('connection', (socket) => {
  const userId = socket.handshake.auth.userId || socket.handshake.query.userId;
//   console.log("User connecting with id:", userId);
  if (userId) {
    userSocketMap[userId] = socket.id;
  } else {
    // console.warn("User ID is undefined for socket:", socket.id);
  }
//   console.log("Current userSocketMap:", userSocketMap);
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on('disconnect', () => {
    console.log("Socket disconnected:", socket.id);
    if (userId) {
      delete userSocketMap[userId];
    }
    // console.log("Updated userSocketMap:", userSocketMap);
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});


export {io,app,server}