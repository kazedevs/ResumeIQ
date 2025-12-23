import type { Route } from "./+types/home";
import Navbar from "../components/Navbar";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "ResumeIQ" },
    { name: "description", content: "ResumeIQ - The AI Resume Analyzer" },
  ];
}

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      if (typeof window !== "undefined" && window.puter) {
        const isSignedIn = await window.puter.auth.isSignedIn();
        setIsAuthenticated(isSignedIn);
        if (!isSignedIn) navigate("/auth?next=/");
      } else {
        const interval = setInterval(async () => {
          if (window.puter) {
            clearInterval(interval);
            const isSignedIn = await window.puter.auth.isSignedIn();
            setIsAuthenticated(isSignedIn);
            if (!isSignedIn) navigate("/auth?next=/");
          }
        }, 100);
        return () => clearInterval(interval);
      }
    };
    checkAuth();
  }, [navigate]);

  if (isAuthenticated === null) {
    return <div className="flex h-screen items-center justify-center">
      <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  }

  return (
    <main className="bg-gradient-to-br from-slate-50 to-slate-100">
      <Navbar />
      <section className="main-section">
        <div className="page-heading py-16">
          <h1>ResumeIQ - The AI resume Analyzer</h1>
          <p>
            ResumeIQ is an AI-powered resume analyzer that helps you optimize
            your resume and increase your chances of getting hired.
          </p>
        </div>
      </section>
    </main>
  );
}
