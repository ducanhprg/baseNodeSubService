import { EventHandlerFactory } from './EventHandlerFactory';
import { RabbitMQClient } from '@shared/utils/RabbitMQClient';
import pLimit from 'p-limit';
import { setCache } from '@shared/utils/RedisClient';
import { VendorEventTypes, VENDOR_EVENT_STATUS } from '@shared/enums/vendorEventTypes';
import { ExchangeNames } from '@src/shared/enums/exchangeNames';
import { Vendors } from '@src/shared/enums/vendors';

const EXCHANGE_NAME = ExchangeNames.VENDOR_REQUESTS;
const VENDOR_NAME = Vendors.VENDOR_GDE;
// const VENDOR_NAME = Services.SERVICE_VALIDATOR;
const QUEUE_NAME = `${VENDOR_NAME}_queue`;

// Automatically filter enabled event types
const ACTIVE_VENDOR_EVENT_TYPES = Object.keys(VENDOR_EVENT_STATUS)
    .filter((event) => VENDOR_EVENT_STATUS[event as VendorEventTypes])
    .map((event) => event as VendorEventTypes);

export class ConsumerService {
    static async start() {
        const channel = await RabbitMQClient.createChannel();
        await channel.assertExchange(EXCHANGE_NAME, 'topic', { durable: true });
        await channel.assertQueue(QUEUE_NAME, { durable: true });

        for (const event of ACTIVE_VENDOR_EVENT_TYPES) {
            await channel.bindQueue(QUEUE_NAME, EXCHANGE_NAME, `${VENDOR_NAME}.${event}`);
        }

        await channel.prefetch(5);
        console.log(` [*] ${VENDOR_NAME} listening for: ${ACTIVE_VENDOR_EVENT_TYPES.join(', ')}`);

        channel.consume(
            QUEUE_NAME,
            async (msg) => {
                if (msg) {
                    try {
                        const { requestId, batchData } = JSON.parse(msg.content.toString());
                        const eventType = msg.fields.routingKey.split('.')[1] as VendorEventTypes;

                        if (!VENDOR_EVENT_STATUS[eventType]) {
                            console.log(` [!] Skipping disabled event: ${eventType}`);
                            channel.ack(msg);
                            return;
                        }

                        console.log(` [x] ${VENDOR_NAME} processing ${eventType} for Request ID: ${requestId}`);

                        const handler = EventHandlerFactory.getHandler(eventType);
                        const limit = pLimit(10);
                        const results = await Promise.all(
                            batchData.map((data: any) => limit(() => handler.process(requestId, [data])))
                        );

                        await setCache(`request:${requestId}:validated`, JSON.stringify(results.flat()));
                        console.log(` [✓] ${VENDOR_NAME} finished processing ${eventType}`);

                        channel.ack(msg);
                    } catch (error) {
                        console.error('Error processing event:', error);
                        channel.nack(msg, false, true);
                    }
                }
            },
            { noAck: false }
        );
    }
}
