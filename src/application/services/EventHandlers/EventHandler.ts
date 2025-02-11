export interface EventHandler {
    process(requestId: string, payload: any[]): Promise<any>;
}
