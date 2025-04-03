import { io,Socket  } from "socket.io-client";

const SESSION_URL = "http://localhost:3003";

const socket = io(SESSION_URL);

export default socket;