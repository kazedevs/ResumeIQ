import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import type { PuterUser } from "constants/index";

export const meta = () => {
    return [
        { title: "ResumeIQ | Auth" },
        { name: "description", content: "Log in to your account" },
    ];
};

const Auth = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [user, setUser] = useState<PuterUser | null>(null);
    const location = useLocation();
    const next = location.search.split("next=")[1] || "/";
    const navigate = useNavigate();

    useEffect(() => {
        const checkAuth = async () => {
            if (typeof window !== "undefined" && window.puter) {
                try {
                    const isSignedIn = await window.puter.auth.isSignedIn();
                    if (isSignedIn) {
                        const puterUser = await window.puter.auth.getUser();
                        setUser(puterUser);
                        navigate(next);
                    }
                } catch (error) {
                    console.error("Auth check failed:", error);
                } finally {
                    setIsLoading(false);
                }
            } else {
                // Wait for puter to be available
                const interval = setInterval(async () => {
                    if (window.puter) {
                        clearInterval(interval);
                        const isSignedIn = await window.puter.auth.isSignedIn();
                        if (isSignedIn) {
                            const puterUser = await window.puter.auth.getUser();
                            setUser(puterUser);
                            navigate(next);
                        }
                        setIsLoading(false);
                    }
                }, 100);
                return () => clearInterval(interval);
            }
        };

        checkAuth();
    }, [navigate, next]);

    const handleSignIn = async () => {
        if (!window.puter) return;
        setIsLoading(true);
        try {
            await window.puter.auth.signIn();
            const puterUser = await window.puter.auth.getUser();
            setUser(puterUser);
        } catch (error) {
            console.error("Sign in failed:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSignOut = async () => {
        if (!window.puter) return;
        setIsLoading(true);
        try {
            await window.puter.auth.signOut();
            setUser(null);
        } catch (error) {
            console.error("Sign out failed:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <main className="flex min-h-screen items-center justify-center bg-gray-50/50 p-4">
            <div className="w-full max-w-md">
                <div className="gradient-border shadow-2xl transition-all duration-300 hover:shadow-blue-100/50">
                    <section className="flex flex-col gap-10 bg-white p-10 rounded-2xl">
                        <div className="flex flex-col items-center gap-3 text-center">
                            <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mb-2">
                                <span className="text-3xl">🚀</span>
                            </div>
                            <h1 className="text-4xl bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 font-bold">
                                Welcome Back
                            </h1>
                            <p className="text-gray-500 font-medium">
                                Sign in to ResumeIQ to continue
                            </p>
                        </div>

                        <div className="w-full">
                            {isLoading ? (
                                <button className="w-full py-4 rounded-xl bg-gray-100 text-gray-400 font-semibold animate-pulse cursor-not-allowed flex items-center justify-center gap-2">
                                    <div className="w-5 h-5 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
                                    Processing...
                                </button>
                            ) : (
                                <>
                                    {user ? (
                                        <button
                                            className="w-full primary-gradient hover:primary-gradient-hover text-white rounded-xl py-4 px-8 font-bold text-lg transition-all duration-200 shadow-lg shadow-blue-200 active:scale-[0.98] cursor-pointer"
                                            onClick={handleSignOut}
                                        >
                                            Sign out
                                        </button>
                                    ) : (
                                        <button
                                            className="w-full primary-gradient hover:primary-gradient-hover text-white rounded-xl py-4 px-8 font-bold text-lg transition-all duration-200 shadow-lg shadow-blue-200 active:scale-[0.98] flex items-center justify-center gap-3 cursor-pointer"
                                            onClick={handleSignIn}
                                        >
                                            <span>Sign in</span>
                                        </button>
                                    )}
                                </>
                            )}
                        </div>
                    </section>
                </div>
            </div>
        </main>
    );
};

export default Auth;