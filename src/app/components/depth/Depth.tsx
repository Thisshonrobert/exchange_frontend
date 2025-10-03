"use client";

import { useEffect, useState } from "react";
import { getDepth, getKlines, getTicker, getTrades } from "../../utils/httpClient";
import { BidTable } from "./BidTable";
import { AskTable } from "./AskTable";
import { SignalingManager } from "@/app/utils/SignalingManager";
import { Trade } from "@/app/utils/types";
import { TradesTable } from "./TradesTable";
import { VolumePercentage } from "./VolumePercentage";

export function Depth({ market }: {market: string}) {
    const [bids, setBids] = useState<[string, string][]>();
    const [asks, setAsks] = useState<[string, string][]>();
    const [price, setPrice] = useState<string>();
    const [trades,setTrades] = useState<Trade[]>([]);
    const [subSection , setSubSection] = useState<"Book" | "Trades">("Book");


    function modifyItems(setItems: React.Dispatch<React.SetStateAction<[string, string][] | undefined>>, item: [string, string], ascending: boolean) {
        if(item === undefined) return;

        const price = item[0];
        const quantity = item[1];

        setItems((prevItems) => {
             if (prevItems === undefined) return prevItems;

            let newItems = [...prevItems];

            const index = prevItems.findIndex(([p, _]) => p === price);

             if (/^0+(\.0+)?$/.test(quantity)) {
                // Remove the item if quantity is zero
                if(index !==-1){
                    newItems.splice(index,1);
                }
             }else{
                //Add item if not present 
                if(index === -1){
                    newItems = [...newItems,item];
                }
                else{
                    // if already present update the quantity
                    newItems[index][1] = quantity;
                }
             }
               newItems.sort((a, b) => ascending ? 
                    Number(a[0]) - Number(b[0]) :  // Asks: lowest price first
                    Number(b[0]) - Number(a[0])    // Bids: highest price first
                );
                return newItems;

        })
        
    }

    function modifyTrade(setTrades: React.Dispatch<React.SetStateAction<Trade[]>>, item: Trade) {
        setTrades((prevTrades) => {
            if(prevTrades === undefined) return prevTrades;
            // copying as newTrade so that we don't mutate the original array
            const newTrades = [...prevTrades];
            // finding the index of the trade with the same id
            const tradeIndex = newTrades.findIndex((t) => t.id === item.id);
            // if the trade is not found ie:(-1) means index is not there, add it to the beginning of the array and remove the last trade
            if(tradeIndex === -1){
                newTrades.unshift(item);
                newTrades.pop();
            }
            
            return newTrades;
        });
    }

    


    function registerCallbacks(){
         SignalingManager.getInstance().registerCallback("ticker", (data: any) => {
            setPrice(data.lastPrice);
        }, `ticker-${market}`);

         SignalingManager.getInstance().registerCallback("depth", (data: any) => {
            const bids = data.bids;
            const asks = data.asks;
            // Process each bid update
            bids.forEach((bid: [string, string]) => {
                modifyItems(setBids, bid, false); // false = descending (highest first)
            });         

            // Process each ask update  
            asks.forEach((ask: [string, string]) => {
                modifyItems(setAsks, ask, true); // true = ascending (lowest first)
            });  
         }, `depth-${market}`);

         SignalingManager.getInstance().registerCallback("trade", (data: any) => {
             modifyTrade(setTrades, data);
         }, `trade-${market}`);
         

    }
    useEffect(() => {
          getDepth(market).then(d => {    
            setBids(d.bids.reverse());
            setAsks(d.asks);
        });

        getTicker(market).then(t => setPrice(t.lastPrice));
        getTrades(market).then((t) => {
            setTrades(t.slice(0,19)),
            setPrice(t[0].price)});

        registerCallbacks();

        SignalingManager.getInstance().sendMessage({"method":"SUBSCRIBE","params":[`depth.${market}`]});
        SignalingManager.getInstance().sendMessage({"method":"SUBSCRIBE","params":[`trade.${market}`]});
      
       
        
        // getKlines(market, "1h", 1640099200, 1640100800).then(t => setPrice(t[0].close));
        return () => {
            SignalingManager.getInstance().sendMessage({"method":"UNSUBSCRIBE","params":[`depth.200ms.${market}`]});
            SignalingManager.getInstance().sendMessage({"method":"UNSUBSCRIBE","params":[`trade.${market}`]});
            SignalingManager.getInstance().deRegisterCallback("ticker", `ticker-${market}`);
            SignalingManager.getInstance().deRegisterCallback("depth", `depth-${market}`);
            SignalingManager.getInstance().deRegisterCallback("trade", `trade-${market}`);
        }
    }, [])
    
    return  <div>
    <div className="flex flex-col h-full ">
    <div className="px-3 ">
        <div className="flex flex-row flex-0 gap-5 undefined">
            <div className="flex flex-col cursor-pointer justify-center py-2">
                <div className={`text-sm font-medium py-1 border-b-2 hover:border-baseTextHighEmphasis hover:text-baseTextHighEmphasis ${subSection === 'Book' ? "border-accentBlue text-baseTextHighEmphasis" : "border-transparent text-baseTextMedEmphasis"}`}
                    onClick={() => setSubSection('Book')}
                >Book</div>
            </div>
            <div className="flex flex-col cursor-pointer justify-center py-2">
                <div className={`text-sm font-medium py-1 border-b-2  hover:border-baseTextHighEmphasis hover:text-baseTextHighEmphasis ${subSection === 'Trades' ? "border-accentBlue text-baseTextHighEmphasis" : "border-transparent text-baseTextMedEmphasis"}`}
                    onClick={() => setSubSection('Trades')}
                >Trades</div>
            </div>
        </div>
    </div>
    <div>
        {subSection === 'Book' ?  <BidsAsktable asks={asks} bids={bids} price={price}/> 
        : 
        <TradesTable trades={trades}/>}
    </div>
</div>
</div>
}

function BidsAsktable({asks , price , bids} : {asks : [string, string][] | undefined , price : string | undefined , bids : [string, string][] | undefined}){
    return(<div>
        <TableHeader />
        {asks && <AskTable asks={asks} />}
        {price && <div>{price}</div>}
        {bids && <BidTable bids={bids} />}
        <VolumePercentage />
    </div>)
}

function TableHeader() {
    return <div className="flex justify-between text-xs">
    <div className="text-white">Price</div>
    <div className="text-slate-500">Size</div>
    <div className="text-slate-500">Total</div>
</div>
}