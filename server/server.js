const  path = require("path");
const express =require("express");
const socketIO = require("socket.io");
const http =require('http');

const port = process.env.PORT||3000;
const publicPath = path.join(__dirname, '/../public');

let app=express();
let server = http.createServer(app);
let io = socketIO(server);
app.use(express.static(publicPath));


function formatTime(date) {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const amOrPm = hours >= 12 ? 'PM' : 'AM';
  
    // Convert to 12-hour format
    const formattedHours = hours % 12 || 12;
  
    // Add leading zeros to minutes if necessary
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
  
    return `${formattedHours}:${formattedMinutes} ${amOrPm}`;
  }
  

io.on('connection',(socket)=>{
    console.log('A NEW USER CONNECTED');

    socket.emit('newMessage',{
        from:"Admin",
        text:"Welcome to chat app!",
        createdAt:formatTime(new Date())
    });
    
    socket.broadcast.emit('newMessage',{
        from:"Admin",
        text:"A new user joined!",
        createdAt:formatTime(new Date())
    })

    socket.on('createMessage',(message,callback)=>{
        console.log("createMessage",message);
        io.emit('newMessage',{
            from:message.from,
            text:message.text,
            createdAt:formatTime(new Date())
        });
        callback('This is server');
    })

    socket.on('createLocationMessage',(coords)=>{
         io.emit('newLocationMessage',{
            from:'Admin',
            url:`https://www.google.com/maps?q=${coords.lat},${coords.lng}`,
            createdAt:formatTime(new Date())
         })
    })

    socket.on('disconnect',()=>{
        console.log('A  USER DISCONNECTED');
    });
});
server.listen(port,()=>{console.log('server is running');});