import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Onboarding from "./Onboarding";
import { loadAppData } from "@/lib/data";

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const data = loadAppData();
    if (data.onboarded) {
      navigate("/dashboard");
    }
  }, [navigate]);

  return <Onboarding />;
};

export default Index;
