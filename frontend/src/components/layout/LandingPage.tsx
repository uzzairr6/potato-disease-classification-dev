import React from 'react';
import { useNavigate } from 'react-router-dom';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="relative min-h-screen w-full flex flex-col items-center overflow-x-hidden p-4 sm:p-6 md:p-8">
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-primary/10 via-background-dark to-background-dark -z-10"></div>
      <div className="absolute top-[-20%] left-[-20%] w-96 h-96 bg-primary/20 rounded-full blur-3xl opacity-20 -z-10"></div>
      <div className="absolute bottom-[-20%] right-[-20%] w-96 h-96 bg-primary/20 rounded-full blur-3xl opacity-20 -z-10"></div>
      
      <header className="w-full max-w-7xl flex items-center justify-between whitespace-nowrap px-4 sm:px-6 py-4">
        <div className="flex items-center gap-4 text-white">
          <div className="w-8 h-8 flex items-center justify-center text-primary">
            <span className="material-symbols-outlined" style={{ fontSize: "32px" }}>local_florist</span>
          </div>
          <h2 className="text-white text-xl font-bold leading-tight tracking-[-0.015em]">Potato Guard</h2>
        </div>
        <nav className="hidden md:flex flex-1 justify-end gap-8">
          <div className="flex items-center gap-9">
            <a className="text-white/80 hover:text-white text-sm font-medium leading-normal transition-colors" href="#">About</a>
            <a className="text-white/80 hover:text-white text-sm font-medium leading-normal transition-colors" href="#">Contact</a>
            <button
              onClick={() => navigate('/dashboard')}
              className="text-white/80 hover:text-white text-sm font-medium leading-normal transition-colors"
            >
              Sign Up / Login
            </button>
          </div>
        </nav>
        <button className="md:hidden text-white">
          <span className="material-symbols-outlined">menu</span>
        </button>
      </header>
      
      <main className="w-full max-w-7xl flex-1 flex flex-col items-center justify-center py-10 md:py-16 text-center">
        <div className="w-full max-w-4xl flex flex-col items-center gap-10">
          <div className="flex flex-col gap-6 items-center">
            <div className="inline-flex items-center justify-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              Potato Disease Classification
            </div>
            <h1 className="text-white text-4xl sm:text-5xl md:text-7xl font-bold leading-tight tracking-tighter">Protect Your Harvest Before It's Too Late</h1>
            <p className="text-white/60 text-lg md:text-xl font-normal leading-normal max-w-2xl">Effortlessly identify potato leaf diseases with a single photo. Our advanced AI provides fast, accurate analysis to help you safeguard your crops.</p>
          </div>
          
          <button
            onClick={() => navigate('/dashboard')}
            className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-full h-12 px-8 bg-primary text-[#1A1A1A] text-base font-bold leading-normal tracking-[0.015em] hover:opacity-90 transition-opacity shadow-lg shadow-primary/20"
          >
            <span className="truncate">Start Classifying Now</span>
            <span className="material-symbols-outlined">arrow_forward</span>
          </button>
          
          <div className="relative w-full max-w-3xl mt-12">
            <img 
              alt="A close-up image of a potato leaf with visible signs of blight, showcasing the application's capability." 
              className="w-full h-auto rounded-xl border border-white/10 shadow-2xl shadow-black/50" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDA382ZsW3NwcBMogMcJuzbZ-XQTadsbshEEEVUNWx8UQpKHp3BFtN2khpk9wv86HzF0AnlprXMCcQwZme8CyIj6wY776BTLcT8mwT2OxxAhNXiIABKXNSaxX6ZJCJAdfy-pSSQjOsHxXxIlHNiC2VRiziMNSvhu4SLYGiPpjOXyi30D5mJn2hQQJZD7WuzN_VFmofOq3z35_63fu9Mkk8gLkjWZfjtrv9jptY6eZTZBUdvheLyF4glCeJdid9EcrhTLbKdY_ud-kk"
            />
            <div className="absolute -bottom-4 -right-4 sm:-bottom-6 sm:-right-6 w-32 h-32 sm:w-48 sm:h-48 rounded-lg bg-[#2B2B2B] p-4 border border-white/10 shadow-xl">
              <div className="w-full h-full flex flex-col items-center justify-center text-center gap-2 border-2 border-dashed border-white/20 rounded-md">
                <span className="material-symbols-outlined text-primary" style={{ fontSize: "36px" }}>upload_file</span>
                <p className="text-white/80 text-sm font-medium">Upload your leaf</p>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <footer className="w-full max-w-7xl mt-auto py-6">
        <p className="text-center text-sm text-white/40">© 2024 Potato Guard. All rights reserved.</p>
      </footer>
    </div>
  );
};