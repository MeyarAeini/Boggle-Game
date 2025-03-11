'use server';

import axios from "axios";
import { BASE_URL } from "./base.service";


export async function register(data:any) {
    return await axios.post(`${BASE_URL}user`, data, {});
}