import { EventHandler } from './EventHandler';

export class GetPriceHandler implements EventHandler {
    async process(requestId: string, payload: any[]) {

        // TODO: Logic code here

        return payload.map((data) => ({
            rateId: data.rateId,
            price: `$${(Math.random() * 100).toFixed(2)}`,
        }));
    }
}
