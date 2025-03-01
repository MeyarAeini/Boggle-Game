// 'use client';

// import { useSession } from "next-auth/react";
// import { usePathname, useSearchParams } from "next/navigation";
// import { useRouter } from "next/router";
// import { useState } from "react";
import GamesTable from "./components/my-games-table";

export default function MyGamesPage(){
    // const {data} = useSession();
    // const param = useSearchParams();
    // const pathName = usePathname();
    // const router = useRouter();
    // const {pageNo,setPageNo} = useState(1);

    return (
        <>
        <GamesTable page={1}/>
        </>
    );
}