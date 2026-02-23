import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Onboarding from "./Onboarding";

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const raw = localStorage.getItem("budgetApp");
    if (raw) {
      const data = JSON.parse(raw);
      if (data.onboarded) {
        navigate("/dashboard");
      }
    }
  }, [navigate]);

  return <Onboarding />;
};

export default Index;
