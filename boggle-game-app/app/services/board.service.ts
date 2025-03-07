import axios from "axios";

export async function getBoard(token:string) : Promise<string[][] | undefined>{
    try{
        const response = await axios.post("http://localhost:3003/board",{},{
            headers:{
                'Authorization': `Bearer ${token}`                
            },
        });

        const board =  response.data;
        return  Array.from({ length: 4 }, (_, i) =>
            Array.from({ length: 4 }, (_, j) => board.slice(i * 4 + j, i * 4 + j + 1))
        );
    }
    catch(error){
        console.log(error);
    }
}