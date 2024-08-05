const http = require('http');
const express=require('express')
const cors=require('cors')


const PORT=5000
const app=express()
const server=require('http').createServer(app)
const io=require('socket.io')(server,{
  cors:{
    origin:'*',
    method:['GET','POST']
  }
})

app.use(cors())


io.on('connection',(socket)=>{   

    socket.on('join_room',(data)=>{
        socket.join(data)
        console.log(`${socket.id} joined room ${data}`)
     })

     socket.on('send_message',(data)=>{
        socket.to(data.roomId).emit('recieved_chat', data)
     })

     socket.on('disconnect',()=>{
        console.log(`client ${socket.id} disconnected.....`)
     })

})


app.get('/ping',(req, res)=>{
  return res.status(200).json({message: "Hello I'm working fine!"});
})


server.listen(PORT,()=>{
  console.log('Socket server is listening on PORT:',PORT)
})
  