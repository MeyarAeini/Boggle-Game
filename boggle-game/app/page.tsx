'use client';
import BoggleBoard from "./ui/boggle-board";
import { useState } from "react";
import { useSearchParams,usePathname,useRouter } from "next/navigation";

export default function Page()  {
  const [gameId,setGameId] = useState(1);
  const searchParam = useSearchParams();
  const pathName = usePathname();
  const { replace } = useRouter();

  const restart = ()=>{
    
    const params = new URLSearchParams(searchParam);
    params.set("gameId",(gameId+1).toString());
    replace(`${pathName}?${params.toString()}`);
    setGameId(prev=>prev+1);
  }

  return (
  <div className="flex flex-col items-center justify-center h-screen gap-4">
    <button onClick={restart} 
    className="w-16 h-16 flex items-center justify-center text-xl font-bold text-white rounded-lg shadow-md bg-green-400">
      reset</button>
    <BoggleBoard key={gameId}/>
    
  </div>)
};
