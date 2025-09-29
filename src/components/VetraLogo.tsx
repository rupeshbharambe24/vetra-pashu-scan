import { useEffect, useState } from "react";

const VetraLogo = ({ className = "h-16 w-auto" }: { className?: string }) => {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    setAnimate(true);
  }, []);

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div 
        className={`relative transition-all duration-1000 ${
          animate ? 'scale-100 rotate-0' : 'scale-0 rotate-180'
        }`}
      >
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent shadow-lg flex items-center justify-center">
          <svg 
            viewBox="0 0 24 24" 
            className="w-7 h-7 text-white" 
            fill="currentColor"
          >
            <path d="M12 2L4 7v10c0 5.55 3.84 9.74 9 9.74s9-4.19 9-9.74V7l-8-5z"/>
            <path d="M12 6L8 9v6c0 2.21 1.79 4 4 4s4-1.79 4-4V9l-4-3z" fill="rgba(255,255,255,0.3)"/>
          </svg>
        </div>
        <div className="absolute -inset-1 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 blur-sm"></div>
      </div>
      
      <div className={`transition-all duration-1000 delay-300 ${
        animate ? 'translate-x-0 opacity-100' : 'translate-x-4 opacity-0'
      }`}>
        <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          VETRA
        </h1>
        <p className="text-xs text-muted-foreground -mt-1">
          Trait Extraction
        </p>
      </div>
    </div>
  );
};

export default VetraLogo;