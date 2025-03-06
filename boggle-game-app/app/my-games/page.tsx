import GamesTable from "./components/my-games-table";
import { Suspense } from "react";
import Pagination from "./components/pagination";
import { getMyGamesCount } from "../services/game.service";

export default async function MyGamesPage(props: {
    searchParams?: Promise<{
        page?: string;
    }>;
}) {
    const searchParams = await props.searchParams;
    const currentPage = Number(searchParams?.page) || 1;

    const totalPages = Math.ceil((await getMyGamesCount())/5);
    return (
        <div className="w-full">
            <Suspense key={currentPage} >
                <GamesTable page={currentPage} />
            </Suspense>
            <div className="mt-5 flex w-full justify-center">
                <Pagination totalPages={totalPages} />
            </div>
        </div>
    );
}