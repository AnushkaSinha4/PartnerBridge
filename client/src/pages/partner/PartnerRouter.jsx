import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

export default function PartnerRouter() {

  const navigate = useNavigate();

  useEffect(() => {

    const checkStatus = async () => {

      try {

        const res = await api.get("/partners/me");

        const partner = res.data?.data;

        console.log("Partner status:", partner);

        // First login
        if (!partner) {
          navigate("/partner/onboarding");
          return;
        }

        if (partner.status === "in_review") {
          navigate("/partner/awaiting-approval");
          return;
        }

        if (partner.status === "rejected") {
          navigate("/partner/onboarding");
          return;
        }

        if (partner.status === "approved") {
          navigate("/partner/dashboard");
          return;
        }

        // fallback
        navigate("/partner/onboarding");

      } catch (error) {

        console.error("Partner status check failed:", error);

        navigate("/partner/onboarding");

      }

    };

    checkStatus();

  }, [navigate]);

  return <div>Checking partner status...</div>;

}