import { cn } from "~/lib/utils";
import type { Feedback } from "../../constants";
import {
  Accordion,
  AccordionContent,
  AccordionHeader,
  AccordionItem,
} from "./Accordian";

const ScoreBadge = ({ score }: { score: number }) => {
  return (
      <div className={cn(
              "flex flex-row gap-1 items-center px-3 py-1 rounded-full border",
              score > 69
                  ? "bg-emerald-50 border-emerald-100 text-emerald-700"
                  : score > 39
                      ? "bg-amber-50 border-amber-100 text-amber-700"
                      : "bg-red-50 border-red-100 text-red-700"
          )}
      >
        <p className="text-sm font-bold">
          {score}/100
        </p>
      </div>
  );
};

const CategoryHeader = ({
                          title,
                          categoryScore,
                        }: {
  title: string;
  categoryScore: number;
}) => {
  return (
      <div className="flex flex-row gap-4 items-center py-2">
        <p className="text-2xl font-semibold">{title}</p>
        <ScoreBadge score={categoryScore} />
      </div>
  );
};

const CategoryContent = ({
                          tips,
                        }: {
  tips: { type: "good" | "improve"; tip: string; explanation: string }[];
}) => {
  return (
      <div className="flex flex-col gap-6 items-center w-full pt-2 pb-4">
        {tips.length === 0 && (
            <div className="text-center text-gray-500 py-4">No specific feedback for this category.</div>
        )}
        <div className="flex flex-col gap-4 w-full">
          {tips.map((tip, index) => (
              <div
                  key={index + tip.tip}
                  className={cn(
                      "flex flex-col gap-3 rounded-xl p-5 border transition-all duration-200",
                      tip.type === "good"
                          ? "bg-emerald-50/50 border-emerald-100"
                          : "bg-amber-50/50 border-amber-100"
                  )}
              >
                <div className="flex flex-row gap-2 items-center">
                   <span className={cn(
                       "text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border",
                        tip.type === "good"
                          ? "bg-emerald-100 text-emerald-700 border-emerald-200"
                          : "bg-amber-100 text-amber-700 border-amber-200"
                   )}>
                       {tip.type === "good" ? "Strength" : "Improvement"}
                   </span>
                </div>
                <div>
                    <p className="text-lg font-semibold text-gray-900 mb-1">{tip.tip}</p>
                    <p className="text-gray-600 leading-relaxed text-sm0">{tip.explanation}</p>
                </div>
              </div>
          ))}
        </div>
      </div>
  );
};

const Details = ({ feedback }: { feedback: Feedback }) => {
  return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 w-full overflow-hidden flex flex-col">
         <div className="p-6 border-b border-gray-100 bg-gray-50/50">
            <h2 className="text-2xl font-bold text-gray-900">Detailed Analysis</h2>
            <p className="text-gray-500 text-sm mt-1">In-depth breakdown of your resume per category.</p>
         </div>
         <div className="p-2">
            <Accordion>
            <AccordionItem id="tone-style">
                <AccordionHeader itemId="tone-style">
                <CategoryHeader
                    title="Tone & Style"
                    categoryScore={feedback.toneAndStyle.score}
                />
                </AccordionHeader>
                <AccordionContent itemId="tone-style">
                <CategoryContent tips={feedback.toneAndStyle.tips} />
                </AccordionContent>
            </AccordionItem>
            <AccordionItem id="content">
                <AccordionHeader itemId="content">
                <CategoryHeader
                    title="Content"
                    categoryScore={feedback.content.score}
                />
                </AccordionHeader>
                <AccordionContent itemId="content">
                <CategoryContent tips={feedback.content.tips} />
                </AccordionContent>
            </AccordionItem>
            <AccordionItem id="structure">
                <AccordionHeader itemId="structure">
                <CategoryHeader
                    title="Structure"
                    categoryScore={feedback.structure.score}
                />
                </AccordionHeader>
                <AccordionContent itemId="structure">
                <CategoryContent tips={feedback.structure.tips} />
                </AccordionContent>
            </AccordionItem>
            <AccordionItem id="skills">
                <AccordionHeader itemId="skills">
                <CategoryHeader
                    title="Skills"
                    categoryScore={feedback.skills.score}
                />
                </AccordionHeader>
                <AccordionContent itemId="skills">
                <CategoryContent tips={feedback.skills.tips} />
                </AccordionContent>
            </AccordionItem>
            </Accordion>
         </div>
      </div>
  );
};

export default Details;