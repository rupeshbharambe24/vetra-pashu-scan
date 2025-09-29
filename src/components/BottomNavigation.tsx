import { Home, Camera, Database, BookOpen, Shield, Phone, Info, Mail } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

interface NavItem {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  path: string;
  external?: boolean;
  url?: string;
}

const navigationItems: NavItem[] = [
  { icon: Home, label: "Home", path: "/" },
  { icon: Camera, label: "Vetra", path: "/vetra" },
  { icon: Database, label: "Data", path: "/data" },
  { icon: BookOpen, label: "Schemes", path: "/schemes", external: true, url: "https://dahd.nic.in/schemes-programmes" },
  { icon: Shield, label: "Insurance", path: "/insurance", external: true, url: "https://dahd.nic.in/livestock-insurance" },
  { icon: Phone, label: "Helpline", path: "/helpline" },
  { icon: Info, label: "About", path: "/about" },
  { icon: Mail, label: "Contact", path: "/contact" }
];

const BottomNavigation = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleNavigation = (item: NavItem) => {
    if (item.external && item.url) {
      window.open(item.url, '_blank', 'noopener,noreferrer');
    } else {
      navigate(item.path);
    }
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-sm border-t border-border z-40">
      <div className="grid grid-cols-4 gap-1 p-2 max-w-lg mx-auto">
        {navigationItems.slice(0, 4).map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.path}
              onClick={() => handleNavigation(item)}
              className={`
                flex flex-col items-center gap-1 p-2 rounded-lg transition-all duration-200
                ${isActive 
                  ? "text-primary bg-primary/10" 
                  : "text-muted-foreground hover:text-primary hover:bg-primary/5"
                }
              `}
            >
              <item.icon className="w-5 h-5" />
              <span className="text-xs font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
      
      {/* Secondary navigation row */}
      <div className="grid grid-cols-4 gap-1 p-2 pt-0 max-w-lg mx-auto border-t border-border/30">
        {navigationItems.slice(4).map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.path}
              onClick={() => handleNavigation(item)}
              className={`
                flex flex-col items-center gap-1 p-2 rounded-lg transition-all duration-200
                ${isActive 
                  ? "text-primary bg-primary/10" 
                  : "text-muted-foreground hover:text-primary hover:bg-primary/5"
                }
              `}
            >
              <item.icon className="w-4 h-4" />
              <span className="text-xs font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNavigation;