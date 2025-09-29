import { Depth, Ticker, Trade } from "./types";

export const BASE_URL = "wss://ws.backpack.exchange/"
export interface callbacksEntry {
    callback: (data: any) => void;
    id: string
}

export interface Message {
    method: string;
    params: string[];
    id?: number;
}

export class SignalingManager {
    private ws: WebSocket;
    private static instance: SignalingManager;
    private bufferedMessages: Message[] = [];
    private callbacks: { [type: string]: callbacksEntry[] } = {};
    private id: number;
    private initialized: boolean = false;

    private constructor(signalingUrl: string) {
        this.ws = new WebSocket(signalingUrl || BASE_URL);
        this.id = 0;
        this.init();
        this.bufferedMessages = [];
    }

    public static getInstance(signalingUrl?: string): SignalingManager {
        if (!SignalingManager.instance) {
            SignalingManager.instance = new SignalingManager(signalingUrl || BASE_URL);
        }
        return SignalingManager.instance;
    }
    init() {
        this.ws.onopen = () => {
            this.initialized = true;
            this.bufferedMessages.forEach(bufferedMessage => {
                this.ws.send(JSON.stringify(bufferedMessage))
            })
            this.bufferedMessages = [];
        }
        this.ws.onmessage = (event) => {
            const message = JSON.parse(event.data);
            const type = message.data.e;
            if (this.callbacks[type]) {
                this.callbacks[type].forEach(({ callback }) => {
                    if (type === "ticker") {
                        const newTicker: Partial<Ticker> = {
                            lastPrice: message.data.c,
                            high: message.data.h,
                            low: message.data.l,
                            volume: message.data.v,
                            quoteVolume: message.data.V,
                            symbol: message.data.s,
                        }
                        callback(newTicker);
                    } else if (type === "depth") {

                        const depthChange = {
                            bids: message.data.b,
                            asks: message.data.a
                        }
                        callback(depthChange);
                    } else if (type === 'trade') {


                        const newTrade: Trade = {
                            id: message.data.t,
                            isBuyerMaker: message.data.m,
                            price: message.data.p,
                            quantity: message.data.q,
                            quoteQuantity: "",
                            timestamp: message.data.E / 1000
                        }

                        callback(newTrade);
                    }
                });
            }
        }
    }
    async registerCallback(type:string,callback:any,id:string){
      //  this.callbacks[type] = this.callbacks[type] || [];
       if (!this.callbacks[type]) {
        this.callbacks[type] = [];
    }
        this.callbacks[type].push({callback,id})
    }
    async deRegisterCallback(type:string,id:string){
        if(this.callbacks[type]){
            const index = this.callbacks[type].findIndex(callback => callback.id === id);
            if (index !== -1) {
                this.callbacks[type].splice(index, 1);
            }
        }
    }
    sendMessage(message:Message){
        const messageToSend ={
            ...message,
            id: this.id++
        }
        if(!this.initialized){
            this.bufferedMessages.push(messageToSend);
            return;
        }
        this.ws.send(JSON.stringify(messageToSend));

    }
}