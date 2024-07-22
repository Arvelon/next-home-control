import { io } from "socket.io-client";

const URL = process.env.NEXT_PUBLIC_HOST; // Replace with your server URL
const socket = io(URL);

export default socket;
