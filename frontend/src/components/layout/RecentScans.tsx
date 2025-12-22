import { PredictionResponse } from '../../types';

interface RecentScansProps {
  scans: PredictionResponse[];
}

export const RecentScans: React.FC<RecentScansProps> = ({ scans }) => {
  const getTimeAgo = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days > 0) {
      return `Scanned ${days} day${days > 1 ? 's' : ''} ago`;
    } else if (hours > 0) {
      return `Scanned ${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else {
      return 'Scanned just now';
    }
  };

  const getImageForDisease = (disease: string) => {
    switch (disease) {
      case 'Early Blight':
        return 'https://lh3.googleusercontent.com/aida-public/AB6AXuDn4HMM_UnagbjCQmrys55BU0bWxSjkvMQn07G6EL353jzHZRg3bTJ9kCRF_5lQa9IE9ktyIo3T9WV9c6Yo1qukgPEdCpmdmx59coFpbroJw6tnvM17Lz6bsl4JPFIttv0f5ay0F15IU1hbwInTNVVc-vtY3M27m4U9NiIkoz43eiuyHXJL4c8G6e7iIRXjUnE8nCXjxx52eqGxITwqw4jb9pJV3EbUpn1saywbgjZvYMxD12NSafBgkKM29OdbX-FRi0pYcU4-rk8';
      case 'Late Blight':
        return 'https://lh3.googleusercontent.com/aida-public/AB6AXuAM9PWaRreaTXyu8aKSFejSprXfVG3TVZ1NpXHgHp2a7or4auc_sw1impzPm22D0T8IH7peZDT55VaWo-bwYI6CsEUKXSLo_UCpCfQTR9775elA4-DV_tx9qVavH1ZMj6gpxQXj2v02QRyDAup8NA6vwHHRPoFzAwkACO7VZ9n9D1Adatuy4jBNBnWrC09rcpiy8Pv2cfrDYeB881gYiEJJRMwZzz6f0Yhp_E77lDdA08VEfmklsxOKnhd1_s5RvjlWTkcHDg4ZX28';
      case 'Healthy':
        return 'https://lh3.googleusercontent.com/aida-public/AB6AXuCqtdeX13jzxD-5inPZ6NKUbmL5VnSjZZjXah1pTz7iLK9WHBRJ7uoYSnf64ElNisjlKXuexwyL46RWxh9H9bviNMWayrbmFMXghVVhl6EvK0BVH0JGwlwpOCVcRTqBg6ZRM3yUDpqVFqCalYoQTwe1BMTaKUC7JwkIK4MngnLCVGWZNZec8S5JYdDoMQtt0HfBxa_W-iFYI5YPSTnsVYrqkPMraFnE5n4iz4RxlKK9CRUebYT16umH80OcL9Hjf7KMItcHYI3PXcU';
      default:
        return '';
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-white text-[22px] font-bold leading-tight tracking-[-0.015em] px-4">Recent Scans</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {scans.map((scan, index) => (
          <div key={index} className="flex items-center gap-4 bg-[#2B2B2B] p-3 rounded-lg border border-transparent hover:border-white/20 transition-colors">
            <img 
              className="w-16 h-16 rounded-md object-cover flex-shrink-0" 
              src={getImageForDisease(scan.class)} 
              alt={`A potato leaf showing ${scan.class}`}
            />
            <div className="flex flex-col">
              <p className="text-white font-semibold">{scan.class}</p>
              <p className="text-white/60 text-sm">{getTimeAgo(Date.now())}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};