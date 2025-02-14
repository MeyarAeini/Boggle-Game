
const {Server} = require("socket.io");
const http = require("http");

const UI_URL = process.env.UI_URL || "http://ui:3000";

const server = http.createServer();
const io = new Server(server,{
    cors:{
        origin:"http://localhost:3717",
        methods:["GET","POST"]
    }
});

io.on("connection",(socket)=>{
    console.log(`a client connect ${socket.id}`);
    socket.on("apply-word",(data)=>{
        console.log(data);
        io.emit("word-found",data);
    });

    socket.on("join-game",(game)=>{
        socket.join(game);
        console.log(`socket:${socket.id} join to game ${game}`);
    });

    socket.on("disconnect",()=>{
        console.log(`client disconnected ${socket.id}`);
    })

});

server.listen(4000,()=>{
    console.log("server is listening to http://localhost:4000");
})