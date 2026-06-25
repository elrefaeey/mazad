import HeroSection from "../components/Client/Home/HeroSection";
import HowItWorks from "../components/Client/Home/HowItWorks";
import InfoSection from "../components/Client/Home/InfoSection";
import AuctionSection from "../components/Client/Home/AuctionSection";
function ClientHome() {
  return (
    <div className="min-h-[calc(100vh_-_73px_-_164px)] ">
      <div className="  ">
        <HeroSection />
        <HowItWorks />
        <AuctionSection />
        <InfoSection />
      </div>
    </div>
  );
}

export default ClientHome;
