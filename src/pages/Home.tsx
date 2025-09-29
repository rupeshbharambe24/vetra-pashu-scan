import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Camera, Database } from "lucide-react";
import Layout from "@/components/Layout";
import VetraLogo from "@/components/VetraLogo";
import MainMenuCard from "@/components/MainMenuCard";
import NavigationMenu from "@/components/NavigationMenu";

const Home = () => {
  const navigate = useNavigate();

  const handleOpenVetra = () => {
    navigate("/vetra");
  };

  const handleOpenData = () => {
    navigate("/data");
  };

  return (
    <Layout showHeader={false}>
      <div className="max-w-lg mx-auto pb-32">{/* Extra padding for bottom navigation */}
        {/* Hero Section */}
        <div className="text-center mb-8 pt-8">
          <VetraLogo className="h-20 mx-auto mb-4" />
          <p className="text-muted-foreground">
            Advanced livestock trait extraction using AI technology
          </p>
        </div>

        {/* Main Action Cards */}
        <div className="space-y-4 mb-8">
          <MainMenuCard
            icon={<Camera className="w-6 h-6" />}
            title="Vetra (Trait Extraction)"
            description="Capture or upload livestock images for AI-powered trait analysis"
            onClick={handleOpenVetra}
            variant="primary"
          />

          <MainMenuCard
            icon={<Database className="w-6 h-6" />}
            title="Data (Past Records)"
            description="View and manage your previous trait extraction results"
            onClick={handleOpenData}
            variant="secondary"
          />
        </div>

        {/* Navigation Menu */}
        <div className="vetra-card p-6">
          <NavigationMenu />
        </div>

      </div>
    </Layout>
  );
};

export default Home;