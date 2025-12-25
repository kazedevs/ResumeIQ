

import ScoreBadge from "./ScoreBadge";

interface ATSProps {
    score: number;
    suggestions: {
        type: "good" | "improve";
        tip: string;
    }[];
}

const ATS = ({ score, suggestions }: ATSProps) => {
    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 w-full overflow-hidden">
            <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex flex-row items-center justify-between">
                <div className="flex flex-col gap-1">
                    <h2 className="text-2xl font-bold text-gray-900">ATS Score</h2>
                    <p className="text-gray-500 text-sm">Automated Tracking System compatibility.</p>
                </div>
                 <div className="scale-110">
                    <ScoreBadge score={score} />
                </div>
            </div>

            <div className="flex flex-col gap-3 p-6">
                {suggestions.map((suggestion, index) => (
                    <div key={index} className={`flex flex-row items-start gap-4 p-4 rounded-xl border transition-all duration-200 ${
                        suggestion.type === 'good' 
                        ? 'bg-emerald-50/50 border-emerald-100' 
                        : 'bg-amber-50/50 border-amber-100'
                    }`}>
                        <div className={`mt-0.5 p-1.5 rounded-full flex-shrink-0 ${
                             suggestion.type === 'good' ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'
                        }`}>
                             {suggestion.type === 'good' ? (
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                             ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg> 
                             )}
                        </div>
                        <div className="flex flex-col gap-1">
                            <span className={`text-xs font-bold uppercase tracking-wider ${
                                suggestion.type === 'good' ? 'text-emerald-700' : 'text-amber-700'
                            }`}>
                                {suggestion.type === 'good' ? 'Great Job' : 'Needs Improvement'}
                            </span>
                            <p className="text-gray-700 text-sm leading-relaxed">{suggestion.tip}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default ATS