import { EventHandler } from './EventHandler';

export class ValidateOrderHandler implements EventHandler {
    async process(requestId: string, payload: any[]) {

        // TODO: Logic code here

        // Store data to redis

        // Code gì trong này cũng được

        return payload.map((data) => ({
            rateId: data.rateId,
            status: 'Validated',
        }));
    }
}
