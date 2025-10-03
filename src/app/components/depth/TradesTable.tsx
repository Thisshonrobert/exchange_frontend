import { Trade } from "@/app/utils/types";


export const TradesTable = ({trades} : { trades : Trade[]}) =>
{
    
    
    return (
        <div>
            <div className="flex flex-row border-b-1 border-b-borderColor w-full flex-1">
                <p className="w-[33.3%] px-1 text-left text-xs font-semibold text-baseTextMedEmphasis">Price (USDC)</p>
                <p className="w-[33.3%] px-1 text-right text-xs font-semibold text-baseTextMedEmphasis">Qty (SOL)</p>
            </div>
        <div className="flex flex-col">
            {trades.map((trade : Trade) => {
                return <TradeRow isBuyerMaker={trade.isBuyerMaker} price={trade.price} quantity={trade.quantity}
                timestamp = {trade.timestamp}/>
            })}
        </div>
        </div>
    )
}

function TradeRow({isBuyerMaker , price , quantity , timestamp} : {isBuyerMaker: Boolean , price : string , quantity: string , timestamp : number}) {
    return(
            <div className="flex flex-row w-full cursor-default bg-transparent hover:bg-white/7">
                <div className="flex items-center flex-row py-2 w-[33.3%] !py-1">
                    <div className={`w-full text-sm font-normal capitalize tabular-nums px-1 text-left ${isBuyerMaker === false ? "text-greenText": "text-redText "}`}>
                        {price}
                    </div>
                </div>
                <div className="flex items-center flex-row py-2 w-[33.3%] !py-1">
                    <div className="w-full text-sm font-normal capitalize tabular-nums text-baseTextHighEmphasis/90 text-right ">
                        {quantity}
                    </div>
                </div>
                <div className="flex items-center flex-row py-2 w-[33.3%] !py-1">
                    <div className="w-full text-sm font-normal capitalize tabular-nums text-baseTextHighEmphasis/90 text-right text-baseTextMedEmphasis">
                        {formatTime(timestamp)}
                    </div>
                </div>
        </div>
    )
}

function formatTime(ts: number) {
    return new Date(ts).toLocaleTimeString("en-GB", {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  }
