import { maxAskTotal } from "./AskTable";
import { maxBidTotal } from "./BidTable";

export function VolumePercentage() {
    let totalVolume = maxAskTotal + maxBidTotal;
    let askVolumePercentage = (maxAskTotal / totalVolume) * 100;
    let bidVolumePercentage = (maxBidTotal / totalVolume) * 100;
    return (
        <div className="volume-comparison">
          {/* <div className="flex justify-between text-xs mb-1">
            <span>Bids</span>
            <span>Asks</span>
          </div> */}
          
          {/* Visual Bar */}
          <div className="w-full h-4 bg-gray-700  overflow-hidden flex ">
            <div 
              className="bg-greenbar transition-all duration-300"
              style={{ width: `${bidVolumePercentage}%` }}
            ></div>
            <div 
              className="bg-redbar transition-all duration-300" 
              style={{ width: `${askVolumePercentage}%` }}
            ></div>
          </div>
          
          {/* Percentage Labels */}
          <div className="flex justify-between text-xs mt-1">
            <span className="text-green-400">{bidVolumePercentage.toFixed(0)}%</span>
            <span className="text-red-400">{askVolumePercentage.toFixed(0)}%</span>
          </div>
        </div>
      );
}
