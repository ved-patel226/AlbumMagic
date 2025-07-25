import { type ReactNode } from "react";
import { useAuthCheck } from "../hooks/useAuthCheck";

interface AuthRouteWrapperProps {
  children: ReactNode;
}

export default function AuthRouteWrapper({ children }: AuthRouteWrapperProps) {
  const { isAuthenticated } = useAuthCheck();

  if (isAuthenticated === null) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl">Checking authentication...</div>
      </div>
    );
  }

  if (isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
