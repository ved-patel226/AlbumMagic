import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function Callback() {
  const useQuery = () => {
    return new URLSearchParams(useLocation().search);
  };
  const navigate = useNavigate();

  const query = useQuery();
  const code = query.get("code");
  const state = query.get("state");

  useEffect(() => {
    const handleCallback = async () => {
      if (code && state) {
        localStorage.setItem("auth_code", code);
        localStorage.setItem("auth_state", state);

        await fetch("http://localhost:3000/auth/callback", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ code: code, state: state }),
        });

        let response = await fetch("http://localhost:3000/auth/check");
        let data = await response.json();

        console.log("Auth Check Response:", data);

        if (data.authenticated === true) {
          navigate("/");
        }
      } else {
        navigate("/");
      }
    };

    handleCallback();
  }, [code, state, navigate]);

  return (
    <div className="flex items-center justify-center h-screen">
      <h1 className="text-4xl font-bold">Callback Page</h1>
    </div>
  );
}
