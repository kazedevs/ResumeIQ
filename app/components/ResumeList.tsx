import { useEffect, useState } from "react";
import { Link } from "react-router";

interface ResumeData {
  id: string;
  companyName: string;
  jobTitle: string;
  imagePath: string;
  imageUrl?: string;
  feedback?: any;
  createdAt?: number;
}

export default function ResumeList() {
  const [resumes, setResumes] = useState<ResumeData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadResumes = async () => {
      if (!window.puter) return;

      try {
        const keys = await window.puter.kv.list("resume:*");
        const resumeData = await Promise.all(
          keys.map(async (key) => {
            const item = await window.puter.kv.get(key);
            if (!item) return null;

            const data = JSON.parse(item);
            let imageUrl = "";

            if (data.imagePath) {
              try {
                const blob = await window.puter.fs.read(data.imagePath);
                imageUrl = blob ? URL.createObjectURL(blob) : "";
              } catch (err) {
                console.error("Image load failed:", err);
              }
            }

            return { ...data, imageUrl } as ResumeData;
          })
        );

        const validResumes = resumeData.filter((r): r is ResumeData => r !== null);
        validResumes.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
        
        setResumes(validResumes);
      } catch (error) {
        console.error("Error loading resumes:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (window.puter) {
      loadResumes();
    } else {
      const interval = setInterval(() => {
        if (window.puter) {
          clearInterval(interval);
          loadResumes();
        }
      }, 500);
      return () => clearInterval(interval);
    }
  }, []);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <h2 className="text-2xl font-semibold mb-6">Your Resumes</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-64 bg-gray-100 rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (resumes.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12">
        <p className="text-xl text-gray-600">No resumes found</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h2 className="text-2xl font-semibold mb-6">Your Resumes</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {resumes.map((resume) => (
          <Link
            key={resume.id}
            to={`/resume/${resume.id}`}
            className="block bg-white rounded-lg border hover:shadow-lg transition-shadow"
          >
            <div className="aspect-[3/4] bg-gray-50">
              {resume.imageUrl ? (
                <img
                  src={resume.imageUrl}
                  alt={resume.jobTitle}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  No Preview
                </div>
              )}
            </div>

            <div className="p-4">
              <h3 className="font-semibold text-gray-900 truncate">
                {resume.jobTitle}
              </h3>
              <p className="text-sm text-gray-500 truncate">{resume.companyName}</p>

              {resume.feedback?.ATS?.score !== undefined && (
                <span
                  className={`inline-block mt-3 px-2 py-1 rounded text-xs font-medium ${
                    resume.feedback.ATS.score >= 80
                      ? "bg-green-100 text-green-700"
                      : resume.feedback.ATS.score >= 60
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  Score: {resume.feedback.ATS.score}
                </span>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
