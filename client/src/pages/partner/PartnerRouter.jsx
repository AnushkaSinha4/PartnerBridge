import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

export default function PartnerRouter() {

  const navigate = useNavigate();

  useEffect(() => {

    const checkStatus = async () => {

      try {

        const res = await api.get("/partners/me");
        const partner = res.data.data;

        // First time login → onboarding form
        if (!partner || !partner.status) {
          navigate("/partner/onboarding");
          return;
        }

        // Application submitted → waiting approval
        if (partner.status === "in_review") {
          navigate("/partner/awaiting-approval");
          return;
        }

        // Rejected → fill form again
        if (partner.status === "rejected") {
          navigate("/partner/onboarding");
          return;
        }

        // Approved (temporary) → show approval screen
        if (partner.status === "approved") {
          navigate("/partner/dashboard");
          return;
        }

      } catch (error) {

        console.error("Partner status check failed:", error);

        // If API fails → send to onboarding
        navigate("/partner/onboarding");

      }

    };

    checkStatus();

  }, [navigate]);

  return <div>Checking partner status...</div>;
}