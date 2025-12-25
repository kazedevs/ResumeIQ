import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router"
import Details from "~/components/Details";
import ATS from "~/components/ATS";
import Summary from "~/components/Summary";

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
        <main className="!pt-0">
            <nav className="resume-nav">
                <Link to="/" className="back-button">
                    <span className="text-gray-600 text-sm font-semibold">{"<"}</span>
                    Back to Homepage
                </Link>
            </nav>
            <div className="flex flex-row w-full max-lg:flex-col-reverse">
                <section className="feedback-section">
                    {imageUrl && resumeUrl && (
                        <div className="animate-in fade-in duration-1000 gradient-border max-sm:m-0 h-[90%] max-w-xl:h-fit w-fit">
                            <a href={resumeUrl} target="_blank">
                                <img src={imageUrl} alt="Resume"
                                    className="w-full h-full object-contain rounded-2xl"
                                    title="Resume"
                                />
                            </a>
                        </div>
                    )}
                </section>
                <section className="feedback-section">
                    <h2 className="text-4xl !text-black font-bold">Resume Review</h2>
                    {feedback ? (
                        <div className="flex flex-col gap-8 animate-in fade-in duration-1000">
                            <Summary feedback={feedback} />
                            <ATS score={feedback.ATS.score || 0} suggestions={feedback.ATS.tips || []}/>
                            <Details feedback={feedback} />
                        </div>
                    ) : (
                        <img src="/resume-scan-2.gif" className="w-full" />
                    )}
                </section>
            </div>
        </main>
    )
}


export default Resume;
