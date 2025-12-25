import { Link, useNavigate } from "react-router";
import { useEffect, useState } from "react";

const Navbar = () => {
    const [isSignedIn, setIsSignedIn] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const checkAuth = async () => {
            if (window.puter) {
                const signedIn = await window.puter.auth.isSignedIn();
                setIsSignedIn(signedIn);
            } else {
                // Poll for puter
                const interval = setInterval(async () => {
                    if (window.puter) {
                        clearInterval(interval);
                        const signedIn = await window.puter.auth.isSignedIn();
                        setIsSignedIn(signedIn);
                    }
                }, 100);
                return () => clearInterval(interval);
            }
        };

        checkAuth();
    }, []);

    const handleLogout = async () => {
        if (window.puter) {
             await window.puter.auth.signOut();
             setIsSignedIn(false);
             navigate("/");
             window.location.reload(); 
        }
    }

    return (
        <nav className="navbar flex justify-between items-center p-4">
            <Link to="/">
                <p className="text-2xl font-bold text-gradient">ResumeIQ</p>
            </Link>
            <div className="flex items-center gap-4">
                <Link to="/upload" className="primary-button w-fit">
                    Upload Resume
                </Link>
                {isSignedIn && (
                    <button 
                        onClick={handleLogout} 
                        className="text-gray-600 hover:text-red-600 font-medium transition-colors cursor-pointer"
                    >
                        Logout
                    </button>
                )}
            </div>
        </nav>
    )
}


export default Navbar;