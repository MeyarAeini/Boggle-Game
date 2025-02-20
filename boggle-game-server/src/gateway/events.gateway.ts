import {
    WebSocketGateway,
    WebSocketServer,
    SubscribeMessage,
    MessageBody,
    ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
    cors: {
        origin: 'http://localhost:3717',
        methods: ['GET', 'POST'],
    },
})
export class AppGateway {
    @WebSocketServer() server: Server;

    // Handle connection event
    handleConnection(@ConnectedSocket() socket: Socket) {
        console.log(`a client connected ${socket.id}`);
    }

    // Handle disconnect event
    handleDisconnect(@ConnectedSocket() socket: Socket) {
        console.log(`client disconnected ${socket.id}`);
    }

    // Handle "apply-word" event
    @SubscribeMessage('apply-word')
    handleApplyWord(@ConnectedSocket() socket: Socket, @MessageBody() data: any) {
        console.log(data);
        this.server.emit('word-found', data); // Broadcast to all clients
    }

    // Handle "join-game" event
    @SubscribeMessage('join-game')
    handleJoinGame(@ConnectedSocket() socket: Socket, @MessageBody() data) {
        const { email, gameId } = data;
        socket.join(gameId); // Join the room
        console.log(`socket: ${email} joined game ${gameId}`);
    }
}