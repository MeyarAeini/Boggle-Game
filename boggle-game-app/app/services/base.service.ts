import { auth } from "@/auth";
import axios from "axios";

export const BASE_URL = 'http://boggle-game-boggle-game-server-1:3003/';

export async function post(service: string, request: any) {
    const token = await getToken();
    return await axios.post(`${BASE_URL}${service}`, request, {
        headers: {
            'Authorization': `Bearer ${token}`
        },
    });
}

export async function getToken(): Promise<string> {
    const session = await auth();
    return session?.user?.accessToken;

}