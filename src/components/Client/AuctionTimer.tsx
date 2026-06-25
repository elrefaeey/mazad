import CountdownDisplay from "./CountdownDisplay";
import { TimeLeft } from "../../hooks/useAuctionTimer";

interface AuctionTimerProps {
  timeLeft: TimeLeft | null;
  isExpired: boolean;
  auctionName: string;
}

function AuctionTimer({ timeLeft, isExpired, auctionName }: AuctionTimerProps) {
  return (
    <div className="w-full bg-[#285240] py-3 sm:py-3.5">
      <div className="container">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <h1 className="type-subheading text-white leading-snug">
            {auctionName}
          </h1>

          {timeLeft && (
            <CountdownDisplay
              timeLeft={timeLeft}
              isExpired={isExpired}
              variant="compact"
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default AuctionTimer;
