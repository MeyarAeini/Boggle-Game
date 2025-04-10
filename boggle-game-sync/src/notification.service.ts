import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { AppGateway } from './events.gateway';

@Controller()
export class NotificationService {
    constructor(private readonly gateway: AppGateway) { }

    @EventPattern('game-state-update')
    handleNotification(@Payload() data: any) {        
        this.gateway.sendNotificationToClients(data); // Send to WebSocket clients
    }
}