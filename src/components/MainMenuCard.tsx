import { ReactNode } from "react";
import { useNavigate } from "react-router-dom";

interface MainMenuCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  onClick: () => void;
  variant?: "primary" | "secondary";
  disabled?: boolean;
}

const MainMenuCard = ({ 
  icon, 
  title, 
  description, 
  onClick, 
  variant = "primary",
  disabled = false 
}: MainMenuCardProps) => {
  const isPrimary = variant === "primary";
  
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        w-full p-6 text-left vetra-card group relative overflow-hidden
        ${isPrimary ? "vetra-button-primary" : "vetra-button-secondary"}
        ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
        transition-all duration-300
      `}
    >
      {/* Background gradient overlay for primary cards */}
      {isPrimary && (
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
      )}
      
      <div className="flex items-start gap-4 relative z-10">
        <div className={`
          p-3 rounded-xl shrink-0 transition-all duration-300 group-hover:scale-110
          ${isPrimary 
            ? "bg-white/20 text-white" 
            : "bg-primary/10 text-primary group-hover:bg-primary/20"
          }
        `}>
          {icon}
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className={`
            text-lg font-semibold mb-1 transition-all duration-300
            ${isPrimary ? "text-white" : "text-card-foreground group-hover:text-primary"}
          `}>
            {title}
          </h3>
          <p className={`
            text-sm transition-all duration-300
            ${isPrimary ? "text-white/80" : "text-muted-foreground"}
          `}>
            {description}
          </p>
        </div>
        
        <div className={`
          transition-all duration-300 group-hover:translate-x-1
          ${isPrimary ? "text-white/60" : "text-muted-foreground"}
        `}>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </button>
  );
};

export default MainMenuCard;