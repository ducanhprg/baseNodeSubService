import { VendorEventTypes } from '@src/shared/enums/vendorEventTypes';
import { EventHandler } from './EventHandlers/EventHandler';
import { GetPriceHandler as CreateOrderHandler } from './EventHandlers/GetPriceHandler';
import { ValidateOrderHandler as GetLabelHandler } from './EventHandlers/ValidateOrderHandler';

export class EventHandlerFactory {
    static getHandler(eventType: string): EventHandler {
        switch (eventType) {
            case VendorEventTypes.CREATE_ORDER:
                return new CreateOrderHandler();
            case VendorEventTypes.GET_LABEL:
                return new GetLabelHandler();
            default:
                throw new Error(`No handler found for event type: ${eventType}`);
        }
    }
}
