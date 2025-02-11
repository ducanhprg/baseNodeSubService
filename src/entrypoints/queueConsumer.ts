import { ConsumerService } from '@application/services/ConsumerService';

(async () => {
    try {
        console.log('Starting RabbitMQ consumer...');
        await ConsumerService.start();
        console.log('Consumer is running.');
    } catch (error) {
        console.error('Error starting consumer:', error instanceof Error ? error.message : String(error));
        process.exit(1);
    }
})();
