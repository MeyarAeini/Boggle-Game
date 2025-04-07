import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import {
    WebSocketGateway,
    WebSocketServer,
    SubscribeMessage,
    MessageBody,
    ConnectedSocket,
    OnGatewayConnection,
    OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@Injectable()
@WebSocketGateway({
    cors: {
        origin: 'http://localhost:3717',
        methods: ['GET', 'POST'],
    },
    pingTimeout: 60000, // Prevents idle disconnect
    pingInterval: 25000, // Keeps connection alive
})
export class AppGateway implements OnGatewayConnection, OnGatewayDisconnect {

    constructor(
        private jwtService: JwtService,
        private readonly configService: ConfigService
    ) { }

    private logger = new Logger('MessageGateway');
    private clients:Set<string> = new Set<string>();

    sendNotificationToClients(data: any) {
        console.log(this.clients);
        try {
            this.server.emit('game-state-update', data);
            this.logger.log('Message emitted successfully');
        } catch (error) {
            this.logger.error('Error emitting message:', error);
        }
    }

    @WebSocketServer()
    private server: Server;

    // Handle connection event
    handleConnection(@ConnectedSocket() socket: Socket) {
        this.logger.log(`Client connected: ${socket.id}`);
        this.logger.log(`Total clients: ${this.server.sockets.sockets.size}`);
        socket.emit("message", { text: "Hello from server!" });
        this.clients.add(socket.id);
    }

    // Handle disconnect event
    handleDisconnect(@ConnectedSocket() socket: Socket) {
        console.log(`client disconnected ${socket.id}`);
        this.clients.delete(socket.id);
    }

    // Handle "join-game" event
    @SubscribeMessage('join-game')
    handleJoinGame(@ConnectedSocket() socket: Socket, @MessageBody() data) {
        const { token, gameId } = data;

        if (!token) return;
        const payload = this.jwtService.verify(
            token,
            {
                secret: this.configService.get<string>('JWT_SECRET') || ''
            }
        );
        if (!payload?.sub) return;
        socket.join(gameId); // Join the room
        console.log(`user: ${payload.sub} joined game ${gameId}`);
    }
}