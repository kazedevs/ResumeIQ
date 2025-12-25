import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router"
import Details from "~/components/Details";
import ATS from "~/components/ATS";
import Summary from "~/components/Summary";
import type { Feedback } from "../../constants";

export const meta = () => {
    return [
        { title: "ResumeIQ | Review" },
        { name: "description", content: "View your resume analysis" },
    ];
};

const Resume = () => {

    const { id } = useParams();
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
    const [imageUrl, setImageUrl] = useState('');
    const [resumeUrl, setResumeUrl] = useState('');
    const [feedback, setFeedback] = useState<Feedback | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const checkAuth = async () => {
            // Wait for window.puter to be available
            if (typeof window === "undefined") return;

            if (window.puter) {
                setIsLoading(false);
                const isSignedIn = await window.puter.auth.isSignedIn();
                setIsAuthenticated(isSignedIn);
                if (!isSignedIn) navigate(`/auth?next=/resume/${id}`);
            } else {
                const interval = setInterval(async () => {
                    if (window.puter) {
                        clearInterval(interval);
                        setIsLoading(false);
                        const isSignedIn = await window.puter.auth.isSignedIn();
                        setIsAuthenticated(isSignedIn);
                        if (!isSignedIn) navigate("/auth?next=/");
                    }
                }, 100);
                return () => clearInterval(interval);
            }
        };
        checkAuth();
    }, [navigate, id]);

    useEffect(() => {
        if (!id || !window.puter) return;

        const loadResume = async () => {
            try {
                const resume = await window.puter.kv.get(`resume:${id}`);
                if (!resume) return;
                const data = JSON.parse(resume);

                const resumeBlob = await window.puter.fs.read(data.resumePath);
                if (!resumeBlob) return;

                const pdfBlob = new Blob([resumeBlob], { type: "application/pdf" });
                const resumeUrl = URL.createObjectURL(pdfBlob);
                setResumeUrl(resumeUrl);

                const imageBlob = await window.puter.fs.read(data.imagePath);
                if (!imageBlob) return;
                const imageUrl = URL.createObjectURL(imageBlob);
                setImageUrl(imageUrl);

                setFeedback(data.feedback);
            } catch (error) {
                console.error("Error loading resume data:", error);
            }
        }

        // Only load resume if puter is ready
        if (!isLoading) {
            loadResume();
        }
    }, [id, isLoading])

    return (
        <main className="!pt-0 min-h-screen bg-gray-50/50">
            <nav className="resume-nav bg-white/80 backdrop-blur-md sticky top-0 z-50">
                <Link to="/" className="back-button hover:bg-gray-50 transition-colors">
                    <span className="text-gray-600 text-sm font-semibold">{"<"}</span>
                    Back to Homepage
                </Link>
            </nav>
            <div className="flex flex-col lg:flex-row w-full max-w-[1600px] mx-auto p-4 lg:p-8 gap-8">
                {/* Resume Preview Section */}
                <section className="w-full lg:w-[45%] xl:w-[40%] flex-shrink-0">
                    <div className="sticky top-24">
                        {imageUrl && resumeUrl && (
                            <div className="animate-in fade-in duration-1000 bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                                <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                                    <h3 className="font-semibold text-gray-700">Resume Preview</h3>
                                    <a href={resumeUrl} target="_blank" rel="noreferrer" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                                        Open PDF ↗
                                    </a>
                                </div>
                                <div className="p-4 bg-gray-100/50 flex justify-center items-center min-h-[600px]">
                                     <a href={resumeUrl} target="_blank" rel="noreferrer" className="block w-full shadow-sm hover:shadow-md transition-shadow duration-300">
                                        <img src={imageUrl} alt="Resume"
                                            className="w-full h-auto object-contain rounded-lg border border-gray-200"
                                            title="Resume Preview"
                                        />
                                    </a>
                                </div>
                            </div>
                        )}
                        {!imageUrl && (
                             <div className="animate-pulse bg-gray-200 rounded-2xl h-[600px] w-full"></div>
                        )}
                    </div>
                </section>

                {/* Feedback Section */}
                <section className="w-full lg:w-[55%] xl:w-[60%] flex flex-col gap-8">
                    <div className="flex flex-col gap-2">
                        <h2 className="text-4xl !text-black font-bold tracking-tight">Resume Review</h2>
                        <p className="text-gray-500">Deep dive analysis into your resume's strengths and weaknesses.</p>
                    </div>

                    {feedback ? (
                        <div className="flex flex-col gap-6 animate-in slide-in-from-bottom-4 duration-700 fade-in fill-mode-forwards">
                            <Summary feedback={feedback} />
                            <ATS score={feedback.ATS.score || 0} suggestions={feedback.ATS.tips || []} />
                            <Details feedback={feedback} />
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center p-12 bg-white rounded-2xl shadow-sm border border-gray-100">
                             <img src="/resume-scan-2.gif" className="w-64 opacity-50" alt="Scanning..." />
                             <p className="mt-4 text-gray-400 font-medium animate-pulse">Analyzing your resume...</p>
                        </div>
                    )}
                </section>
            </div>
        </main>
    )
}


export default Resume;
