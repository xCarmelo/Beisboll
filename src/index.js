import app from "./app.js";
import {Server as webSocketServer} from 'socket.io';
import http, { Server } from 'node:http';
import {connectDB} from './config/bd.js';
import {PORT} from './config/config.js';
import socket from "./socket/socket.js";

connectDB();

const server = http.createServer(app);
const httpServer = server.listen(PORT);

console.log('Server on http//localhost: ' , PORT);

const io = new webSocketServer(httpServer, {
    cors: {
        origin: [
            "http://localhost:3000", 
            "https://losbombarderos-del-1ro-de-mayo-b74774f63bed.herokuapp.com"
        ],
        methods: ["GET", "POST"]
    }
});

socket(io);




