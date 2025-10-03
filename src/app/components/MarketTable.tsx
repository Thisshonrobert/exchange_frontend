"use client";
import {  getAllKlines, getKlines, getMarketData, getTickers } from "@/app/utils/httpClient";
import {  KLine, Market, MarketData, Ticker } from "@/app/utils/types";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react"
import { LineChart, Line, ResponsiveContainer } from 'recharts';

export const MarketTable= () =>
{
    const marketDataMap = new Map(); 
    const [market , setMarket] = useState<Market[]>([]);
    const[loading , setLoading] = useState(true);
    const router = useRouter();
   

     useEffect(() => {
        const fetchData = async () => {
            try {
                
                const [marketdata, tickers] = await Promise.all([getMarketData(), getTickers()]);

                

                marketdata.forEach(m => marketDataMap.set(m.symbol.toLowerCase(), m));

                const updatedMarkets: Market[] = tickers.reduce<Market[]>((acc, ticker) => {
                    const symbol = ticker.symbol.split("_")[0].toLowerCase();
                    const marketData = marketDataMap.get(symbol);
                
                    if (marketData) {
                        const { name, symbol, image, market_cap } = marketData;
                        const { lastPrice: last_price, priceChangePercent, volume, quoteVolume } = ticker;

                        acc.push({ 
                            name, 
                            symbol, 
                            image, 
                            market_cap, 
                            lastPrice: last_price, 
                            priceChangePercent, 
                            marketSymbol : ticker.symbol, 
                            quoteVolume 
                        });
                    }
                    return acc;
                }, []);

                
                updatedMarkets.sort((a, b) => b.market_cap - a.market_cap);
                
                setMarket(updatedMarkets);
                setLoading(false);
            } catch (error) {
                console.error('Failed to fetch data:', error);
            }
        };

        fetchData();
    }, []);
 

    return (
        <table className="w-full border-separate border-spacing-y-4">
            <thead>
                <tr>
                <th className="px-2 py-3 w-1/5 text-left text-3xl font-normal text-baseTextMedEmphasis">
                    <div className="flex items-center gap-1 select-none">
                        Name
                        <span className="w-[16px]"></span>
                    </div>
                </th>
                 <th className="px-2 py-3 w-1/6 text-left text-xl font-normal text-baseTextMedEmphasis ">
                        <div className="flex items-center gap-1 cursor-pointer select-none">
                            Price
                            <span className="w-[16px]"></span>
                        </div>
                    </th>
                    <th className="px-2 py-3 w-1/6 text-left text-xl font-normal text-baseTextMedEmphasis ">
                        <div className="flex items-center gap-1 cursor-pointer select-none">
                            Market Cap
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-arrow-down h-4 w-4">
                                <path d="M12 5v14"></path><path d="m19 12-7 7-7-7"></path>
                            </svg>
                        </div>
                    </th>
                    <th className="px-2 py-3 w-1/6 text-left text-xl font-normal text-baseTextMedEmphasis ">
                        <div className="flex items-center gap-1 cursor-pointer select-none">
                            24h Volume
                            <span className="w-[16px]"></span>
                        </div>
                    </th>
                   
                    <th className="px-2 py-3 w-1/6 text-left text-xl font-normal text-baseTextMedEmphasis ">
                        <div className="flex items-center gap-1 cursor-pointer select-none">
                            24h Change
                            <span className="w-[16px]"></span>
                        </div>
                    </th>
                    {/* <th className="pr-8 py-3 w-1/6 text-right text-xl font-normal text-baseTextMedEmphasis ">
                        <div className="flex items-center justify-end gap-1 cursor-pointer select-none">
                            Last 7 Days
                            <span className="w-[16px]"></span>
                        </div>
                    </th> */}
                </tr>
            </thead>
             <tbody >
               {
                loading ? <>
                     {Array.from({ length: 8}).map((_, index) => (
                    <SkeletonRow/>
                    ))}
                </>:
                <>
                    {market.map((coin : Market) =>
                    {
                        return <MarketRow price={coin.lastPrice} symbol={coin.symbol}  name = {coin.name}  market_cap ={coin.market_cap}  quoteVolume= {coin.quoteVolume} image = {coin.image} priceChangePercent = {coin.priceChangePercent} marketSymbol = {coin.marketSymbol} router = {router}/>
                    })}
                </>
               }
            </tbody>
        </table>
    )
}
// function SimpleSparkline({ data, width = 100, height = 20 }: { data: number[]; width?: number; height?: number }) {
//     const isUp = data.length > 0 ? data[data.length - 1] >= data[0] : false;
    
//     const chartData = data.map((value, index) => ({ value, index }));
    
//     return (
//         <div style={{ width, height }}>
//             <ResponsiveContainer width="100%" height="100%">
//                 <LineChart data={chartData}>
//                     <Line 
//                         type="monotone" 
//                         dataKey="value" 
//                         stroke={isUp ? "#22c55e" : "#fd4b4e"}
//                         strokeWidth={2}
//                         dot={false}
//                         isAnimationActive={false}
//                     />
//                 </LineChart>
//             </ResponsiveContainer>
//         </div>
//     );
// }


function MarketRow({price , symbol , name , market_cap , image , priceChangePercent , quoteVolume , marketSymbol , router} : {price : string , symbol : string , name : string  , market_cap : number  , image : string , priceChangePercent : string , quoteVolume: string , marketSymbol : string , router : any}) {
    // const [sparklineData, setSparklineData] = useState<number[]>([]);
    
    // useEffect(() => {
    //     let mounted = true;
    //     const now = Math.floor(Date.now() / 1000);
    //     const start = Math.floor((Date.now() - 1000 * 60 * 60 * 24 * 7) / 1000);
        
    //     getKlines(marketSymbol, "1h", start, now).then((rows) => {
    //         if (!mounted) return;
    //         const closes = rows.map(r => parseFloat(r.close));
    //         setSparklineData(closes);
    //     });
        
    //     return () => { mounted = false; };
    // }, [marketSymbol]);

    return (
        <tr className="cursor-pointer border-t border-baseBorderLight hover:bg-slate-800" onClick={() => router.push(`/trade/${marketSymbol}`) }>
                        <td className="px-2 py-3 ">
                            <div className="flex shrink">
                                <div className="flex items-center undefined">
                                    <div className="relative flex-none overflow-hidden rounded-full border border-baseBorderMed w-10 h-10" >
                                        <div className="relative">
                                            <img alt={`${name} Logo`} loading="lazy" width="40" height="40" decoding="async" data-nimg="1" className=""  src={image} />
                                        </div>
                                    </div>
                                    <div className="ml-4 flex flex-col">
                                        <p className="whitespace-nowrap text-base font-medium text-baseTextHighEmphasis">{name}</p>
                                    <div className="flex items-center justify-start flex-row gap-2">
                                        <p className="flex-medium text-left text-xs leading-5 text-baseTextMedEmphasis">{symbol.toUpperCase()}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </td>
                    <td className="px-2 py-3 ">
                        <p className="text-base font-medium tabular-nums">${price}</p>
                    </td>
                    <td className="px-2 py-3 ">
                        <p className="text-base font-medium tabular-nums">{formatMarketCap(market_cap)}</p>
                    </td>
                    <td className="px-2 py-3 ">
                        <p className="text-base font-medium tabular-nums">{formatMarketCap(Number(quoteVolume))}</p>
                    </td>
                    
                    <td className="px-2 py-3 ">
                        <PricePercent priceChangePercent={priceChangePercent}/>
                    </td>
                   {/* <td className="px-2 py-3 text-right">
                {sparklineData.length > 0 ? (
                    <SimpleSparkline data={sparklineData} />
                ) : (
                    <Skeleton className="w-[100px] h-[20px] bg-neutral-700" />
                )}
            </td> */}
                   
                </tr>
    )
}


function SkeletonRow() {
    return (
        <tr>
          
            <td className="px-2 py-3 w-1/6">
                <Skeleton className="w-full h-[35px] rounded-xl bg-neutral-700 animate-pulse" />
            </td>
            
            <td className="px-2 py-3 w-5/6" colSpan={4}>
                <Skeleton className="w-full h-[35px] rounded-xl bg-neutral-700 animate-pulse" />
            </td>
        </tr>
    );
}




function formatMarketCap(num : number) {



  if (num >= 1e12) {
    return `$${(num / 1e12).toFixed(1)}T`;
  } else if (num >= 1e9) {
    return `$${(num / 1e9).toFixed(1)}B`;
  } else if (num >= 1e6) {
    return `$${(num / 1e6).toFixed(1)}M`;
  } else if (num >= 1e3) {
    return `$${(num / 1e3).toFixed(1)}K`;
  } else {
    return `$${num}`;
  }
}


function PricePercent({priceChangePercent} : {priceChangePercent : string})
{
    let number = parseFloat(priceChangePercent); // Convert string to number
    let percent = (number * 100).toFixed(2) + '%';

    return number < 0 ?  <p className="text-base font-medium tabular-nums text-redText">{percent}</p> :
        <p className="text-base font-medium tabular-nums text-greenText">+{percent}</p>
}

// function Sparkline({ values, width = 100, height = 20, positiveColor = "#22c55e", negativeColor = "#fd4b4e" }: { values: number[]; width?: number; height?: number; positiveColor?: string; negativeColor?: string }) {
//     const padding = 1;
//     const w = width - padding * 2;
//     const h = height - padding * 2;
//     const min = Math.min(...values);
//     const max = Math.max(...values);
//     const range = max - min || 1;
//     const points = values.map((v, i) => {
//         const x = padding + (i / Math.max(values.length - 1, 1)) * w;
//         const y = padding + (1 - (v - min) / range) * h;
//         return `${x},${y}`;
//     });
//     const d = `M${points[0]} L${points.slice(1).join(" ")}`;
//     const isUp = values[values.length - 1] - values[0] >= 0;
//     const stroke = isUp ? positiveColor : negativeColor;
//     return (
//         <div className="recharts-wrapper" style={{ position: "relative", cursor: "default", width, height }}>
//             <svg className="recharts-surface" width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{ width: "100%", height: "100%" }}>
//                 <defs>
//                     <clipPath id="spark-clip">
//                         <rect x="1" y="1" height={height - 2} width={width - 2}></rect>
//                     </clipPath>
//                 </defs>
//                 <g className="recharts-layer recharts-line">
//                     <path stroke={stroke} strokeWidth={2} fill="none" className="recharts-curve recharts-line-curve" d={d}></path>
//                 </g>
//             </svg>
//         </div>
//     );
// }

