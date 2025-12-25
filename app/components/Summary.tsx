import Score from "./Score";
import ScoreBadge from "./ScoreBadge";
import type { Feedback } from "../../constants";


const Category = ({ title, score }: { title: string, score: number }) => {
    const textColor = score >= 70
        ? "text-emerald-600"
        : score >= 50
            ? "text-yellow-600"
            : "text-red-600";
            
     const bgColor = score >= 70
        ? "bg-emerald-50 border-emerald-100"
        : score >= 50
            ? "bg-yellow-50 border-yellow-100"
            : "bg-red-50 border-red-100";

    return (
        <div className={`flex flex-col gap-3 p-4 rounded-xl border ${bgColor}`}>
            <div className="flex flex-row items-center justify-between w-full">
                <span className="font-medium text-gray-700">{title}</span>
                <ScoreBadge score={score} />
            </div>
            <div className="flex items-end gap-1">
                 <span className={`text-3xl font-bold ${textColor}`}>{score}</span>
                 <span className="text-gray-400 mb-1 font-medium">/100</span>
            </div>
        </div>
    )
}

const Summary = ({ feedback }: { feedback: Feedback }) => {
    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 w-full overflow-hidden">
            <div className="p-6 border-b border-gray-100 bg-gray-50/50">
                <div className="flex flex-row items-center gap-6">
                    <Score score={feedback.overallScore || 0} />
                    <div className="flex flex-col gap-1">
                        <h2 className="text-2xl font-bold text-gray-900">Overall Score</h2>
                        <p className="text-gray-500 text-sm">
                            Calculated based on key performance indicators below.
                        </p>
                    </div>
                </div>
            </div>

            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <Category title="Tone & Style" score={feedback.toneAndStyle.score} />
                <Category title="Content" score={feedback.content.score} />
                <Category title="Structure" score={feedback.structure.score} />
                <Category title="Skills" score={feedback.skills.score} />
            </div>
        </div>
    )
}

export default Summary
