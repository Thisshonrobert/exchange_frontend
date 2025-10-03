export let maxAskTotal:number = 0;

export const AskTable = ({ asks }: {asks: [string, string][]}) => {
   let currentTotal = 0;
   const relevantAsks = asks.slice(0,15);
   const AskWithTotal: [string, string, number][] = []
   //relevantAsks.map(([price, quantity]) => [price, quantity, currentTotal += Number(quantity)]);
   for(let i=0;i<relevantAsks.length;i++){
         const [price, quantity] = relevantAsks[i];
         AskWithTotal.push([price, quantity, currentTotal+=Number(quantity)]);
   }
   maxAskTotal = relevantAsks.reduce((acc, [_, quantity]) => acc + Number(quantity),0 );
   AskWithTotal.reverse();

    return <div>
        {AskWithTotal?.map(([price, quantity, total]) => <Ask maxTotal={maxAskTotal} total={total} key={price} price={price} quantity={quantity} />)}
    </div>
}



function Ask({price, quantity, total, maxTotal}: {price: string, quantity: string, total: number, maxTotal: number}) {
    return <div
    style={{
        display: "flex",
        position: "relative",
        width: "100%",
        backgroundColor: "transparent",
        overflow: "hidden",
    }}
>
    <div
        style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: `${(100 * total) / maxTotal}%`,
        height: "100%",
        background: "rgba(228, 75, 68, 0.325)",
        transition: "width 0.3s ease-in-out",
        }}
    ></div>
    <div className="flex justify-between text-xs w-full">
        <div className="text-redText">
            {price}
        </div>
        <div className="text-baseTextHighEmphasis/80">
            {quantity}
        </div>
        <div className="text-baseTextHighEmphasis/80">
            {total?.toFixed(2)}
        </div>
    </div>
    </div>
}
