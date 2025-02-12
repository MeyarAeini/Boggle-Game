
const {Server} = require("socket.io");
const http = require("http");

const server = http.createServer();
const io = new Server(server,{
    cors:{
        origin:"http://localhost:3000",
        methods:["GET","POST"]
    }
});

io.on("connection",(socket)=>{
    console.log(`a client connect ${socket.id}`);
    socket.on("message",(data)=>{
        const {message,game} = data;
        io.to(game).emit("message",message);
    });

    socket.on("disconnect",()=>{
        console.log(`client disconnected ${socket.id}`);
    })

});

server.listen(4000,()=>{
    console.log("server is listening to http://localhost:4000");
})