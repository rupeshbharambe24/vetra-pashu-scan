import { 
  BookOpen, 
  Shield, 
  Phone, 
  Info, 
  Mail,
  ExternalLink 
} from "lucide-react";

interface NavItem {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  url: string;
  external?: boolean;
}

const navigationItems: NavItem[] = [
  {
    icon: BookOpen,
    title: "Schemes",
    description: "Government livestock schemes and benefits",
    url: "https://dahd.nic.in/schemes-programmes",
    external: true
  },
  {
    icon: Shield,
    title: "Insurance",
    description: "Livestock insurance and coverage options",
    url: "https://dahd.nic.in/livestock-insurance",
    external: true
  },
  {
    icon: Phone,
    title: "Helpline",
    description: "24/7 support for livestock queries",
    url: "/helpline"
  },
  {
    icon: Info,
    title: "About Us",
    description: "Learn more about VETRA platform",
    url: "/about"
  },
  {
    icon: Mail,
    title: "Contact",
    description: "Get in touch with our team",
    url: "/contact"
  }
];

const NavigationMenu = () => {
  const handleNavigation = (item: NavItem) => {
    if (item.external) {
      window.open(item.url, '_blank', 'noopener,noreferrer');
    } else {
      // For internal navigation, you would use react-router
      window.location.hash = item.url;
    }
  };

  return (
    <div className="space-y-3">
      <h2 className="text-lg font-semibold text-foreground/80 mb-4">
        Quick Access
      </h2>
      
      {navigationItems.map((item) => (
        <button
          key={item.title}
          onClick={() => handleNavigation(item)}
          className="vetra-nav-item w-full text-left"
        >
          <div className="p-2 rounded-lg bg-primary/10">
            <item.icon className="w-5 h-5 text-primary" />
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-medium">{item.title}</span>
              {item.external && (
                <ExternalLink className="w-3 h-3 text-muted-foreground" />
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              {item.description}
            </p>
          </div>
        </button>
      ))}
    </div>
  );
};

export default NavigationMenu;