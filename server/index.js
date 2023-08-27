const express = require('express');
const cors = require('cors');
const {Pool} = require('pg');
const userRoutes = require('./routes/userRoutes')
const messageRoutes = require('./routes/messageRoutes')
const socket = require('socket.io')
const app = express();
require('dotenv').config();

app.use(cors());
app.use(express.json());
app.use('/api/auth',userRoutes)
app.use("/api/messages", messageRoutes);

const pool = new Pool({
    connectionString: process.env.DB_CONNECTION_STRING,
  });
  pool.connect()
  .then(() => {
    console.log("DB Connection Successful");
  })
  .catch((err) => {
    console.error(err.message);
  });

const server = app.listen(process.env.PORT,()=>{
    console.log(`server is listening at ${process.env.PORT}`)
})
const io = socket(server,{
  cors:{
    origin:"http://localhost:3000",
    Credential:true
  }
});
global.onlineUsers = new Map();
io.on("connection",(socket)=>{
  global.chatSocket = socket;
  socket.on("add-user",(userId)=>{
    onlineUsers.set(userId,socket.id);
  });
  socket.on("send-msg",(data)=>{
    const sendUserSocket = onlineUsers.get(data.to);
    if(sendUserSocket){
      socket.to(sendUserSocket).emit("msg-recieve",data.message);
    }
  });
});