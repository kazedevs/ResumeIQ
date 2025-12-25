import { Link } from "react-router";

const HomeHero = () => {
    return (
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
            {/* Hero Header */}
            <div className="text-center max-w-4xl mx-auto mb-16 lg:mb-24">
                <div className="inline-block mb-4 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-100">
                    <span className="text-blue-600 font-medium text-sm tracking-wide uppercase">AI-Powered Career Growth</span>
                </div>
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-900 mb-8 leading-tight">
                    Optimize Your Resume <br className="hidden md:block" />
                    <span className="text-gradient">
                        Get Hired Faster
                    </span>
                </h1>
                <p className="text-xl md:text-2xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
                    ResumeIQ uses advanced AI to analyze your resume against job descriptions, providing actionable feedback to beat the ATS and impress recruiters.
                </p>
                <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Link
                        to="/upload"
                        className="primary-button text-lg !px-8 !py-4 !w-auto transition-all transform hover:-translate-y-1"
                    >
                        Analyze My Resume
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default HomeHero;
