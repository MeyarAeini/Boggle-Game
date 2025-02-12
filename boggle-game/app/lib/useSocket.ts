import { io,Socket  } from "socket.io-client";
import { useState,useEffect } from "react";
import { BoardPath } from "./definitions";


export default function useSocket(onWordFound?:(data:BoardPath)=>void){
    const [connected,setConnected] = useState(false);
    const [socket,setSocket] = useState<Socket|null>(null);
    const [game,setGame] = useState("");
    
    useEffect(()=>{
        const iosocket = io("http://localhost:4000");
        setSocket(iosocket);

        iosocket.on("connect",()=>{            
            setConnected(true);
        });

        iosocket.on("disconnect",()=>{
            setConnected(false);
        });

        iosocket.on("word-found",(data:BoardPath)=>{
            if(onWordFound)
                onWordFound(data);
        });

        return ()=>{iosocket.disconnect()};
    },[]);

    const send = (message:BoardPath)=>{
        if(socket)
            socket.emit("apply-word",{...message,game:game});
    };

    const join = (gameId:string)=>{        
        if(socket){
            socket.emit("join-game",gameId);
            setGame(gameId);
        }
    }

    return {connected,send,join};
}