import { io,Socket  } from "socket.io-client";
import { useState,useEffect } from "react";
import { BoardPath } from "./definitions";

const SESSION_URL = process.env.SESSION_APP_API_URL || "http://localhost:4000";

export default function useSocket(onWordFound?:(data:BoardPath)=>void){
    const [connected,setConnected] = useState(false);
    const [socket,setSocket] = useState<Socket|null>(null);
    const [game,setGame] = useState("");
    
    useEffect(()=>{
        const iosocket = io(SESSION_URL);
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