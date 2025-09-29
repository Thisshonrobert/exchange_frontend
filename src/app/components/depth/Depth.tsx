"use client";

import { useEffect, useState } from "react";
import { getDepth, getKlines, getTicker, getTrades } from "../../utils/httpClient";
import { BidTable } from "./BidTable";
import { AskTable } from "./AskTable";
import { SignalingManager } from "@/app/utils/SignalingManager";

export function Depth({ market }: {market: string}) {
    const [bids, setBids] = useState<[string, string][]>();
    const [asks, setAsks] = useState<[string, string][]>();
    const [price, setPrice] = useState<string>();

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
         }, `DEPTH-${market}`);
         

    }
    useEffect(() => {
          getDepth(market).then(d => {    
            setBids(d.bids.reverse());
            setAsks(d.asks);
        });

        getTicker(market).then(t => setPrice(t.lastPrice));
        getTrades(market).then(t => setPrice(t[0].price));

        registerCallbacks();

        SignalingManager.getInstance().sendMessage({"method":"SUBSCRIBE","params":[`depth.${market}`]});

      
       
        
        // getKlines(market, "1h", 1640099200, 1640100800).then(t => setPrice(t[0].close));
        return () => {
            SignalingManager.getInstance().sendMessage({"method":"UNSUBSCRIBE","params":[`depth.200ms.${market}`]});
            SignalingManager.getInstance().deRegisterCallback("ticker", `ticker-${market}`);
            SignalingManager.getInstance().deRegisterCallback("depth", `depth-${market}`);
        }
    }, [])
    
    return <div>
        <TableHeader />
        {asks && <AskTable asks={asks} />}
        {price && <div>{price}</div>}
        {bids && <BidTable bids={bids} />}
    </div>
}

function TableHeader() {
    return <div className="flex justify-between text-xs">
    <div className="text-white">Price</div>
    <div className="text-slate-500">Size</div>
    <div className="text-slate-500">Total</div>
</div>
}