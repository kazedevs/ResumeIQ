

import FileUploader from "~/components/FileUploader";
import Navbar from "../components/Navbar";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { convertPdfToImage } from "~/lib/Pdf2Image";
import { generateUUID } from "~/lib/utils";
import { prepareInstructions } from "constants/index";


const Upload = () => {

    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const [isProcessing, setIsProcessing] = useState(false);
    const [statusText, setStatusText] = useState("");
    const [file, setFile] = useState<File | null>(null);

    useEffect(() => {
        const checkPuter = () => {
            if (window.puter) {
                setIsLoading(false);
            } else {
                setTimeout(checkPuter, 100);
            }
        };
        checkPuter();
    }, []);

    const handleFileSelect = (file: File | null) => {
        setFile(file);
    }


    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const companyName = formData.get('company-name') as string;
        const jobTitle = formData.get('job-title') as string;
        const jobDescription = formData.get('job-description') as string;

        if (!file) return;

        handleAnalyze({ companyName, jobTitle, jobDescription, file })
    };


    const handleAnalyze = async ({ companyName, jobTitle, jobDescription, file }: { companyName: string, jobTitle: string, jobDescription: string, file: File }) => {
        if (!window.puter) return;
        setIsProcessing(true);
        setStatusText("Analyzing your resume...");
        const uploadedFile = await window.puter.fs.upload([file]);

        if (!uploadedFile) return setStatusText("Failed to upload file");

        setStatusText("Converting to image...")
        const imageFile = await convertPdfToImage(file);
        if (!imageFile.file) return setStatusText("Failed to convert to image");

        setStatusText("Uploading your image...")
        const uploadedImage = await window.puter.fs.upload([imageFile.file]);
        if (!uploadedImage) return setStatusText("Failed to upload image");

        setStatusText("Preparing data...")
        const uuid = generateUUID();
        const data = {
            id: uuid,
            resumePath: uploadedFile.path,
            imagePath: uploadedImage.path,
            companyName,
            jobTitle,
            jobDescription,
            feedback: "",
        }
        await window.puter.kv.set(`resume:${uuid}`, JSON.stringify(data));

        setStatusText("Analyzing your resume...")

        const messages = [
            {
                role: "user",
                content: [
                    {
                        type: "file",
                        puter_path: uploadedFile.path,
                    },
                    {
                        type: "text",
                        text: prepareInstructions({ jobTitle, jobDescription }),
                    },
                ],
            },
        ];

        const feedback = await window.puter.ai.chat(messages, { model: "claude-opus-4-5-latest" });

        if (!feedback) return setStatusText("Failed to analyze your resume");

        const feedbackText = typeof feedback.message.content === "string"
            ? feedback.message.content
            : feedback.message.content[0].text;

        // Update KV with feedback
        data.feedback = JSON.parse(feedbackText);
        await window.puter.kv.set(`resume:${uuid}`, JSON.stringify(data));
        setStatusText("Analysis complete, redirecting to result page...");
        navigate(`/resume/${uuid}`);
    }

    return (
        <main className="bg-gradient-to-br from-slate-50 to-slate-100 min-h-screen">
            <Navbar />
            <section className="main-section container mx-auto px-4">
                <div className="page-heading py-16 text-center">
                    <h1 className="text-4xl font-bold mb-4">Smart feedback for your job</h1>
                    {isProcessing ? (
                        <div className="flex flex-col items-center justify-center">
                            <h2 className="text-xl mb-8">{statusText}</h2>
                            <img src="/resume-scan.gif" className="w-full max-w-md rounded-lg shadow-lg" alt="Scanning..." />
                        </div>
                    ) : (
                        <>
                            <h2 className="text-xl text-gray-600 mb-8">Upload your resume for an ATS score and improve your chances of getting hired</h2>
                        </>
                    )}
                    {!isProcessing && (
                        <form id="upload-from" onSubmit={handleSubmit} className="flex flex-col gap-6 mt-8 max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-sm">
                            <div className="form-div flex flex-col items-start gap-2">
                                <label htmlFor="company-name" className="font-medium text-gray-700">Company Name</label>
                                <input className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" type="text" id="company-name" name="company-name" placeholder="e.g. Google" required />
                            </div>
                            <div className="form-div flex flex-col items-start gap-2">
                                <label htmlFor="job-title" className="font-medium text-gray-700">Job Title</label>
                                <input className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" type="text" id="job-title" name="job-title" placeholder="e.g. Software Engineer" required />
                            </div>
                            <div className="form-div flex flex-col items-start gap-2">
                                <label htmlFor="job-description" className="font-medium text-gray-700">Job Description</label>
                                <textarea className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" rows={5} id="job-description" name="job-description" placeholder="Paste the job description here..." required></textarea>
                            </div>
                            <div className="form-div flex flex-col items-start gap-2">
                                <label htmlFor="uploader" className="font-medium text-gray-700">Upload Resume (PDF)</label>
                                <div className="w-full">
                                    <FileUploader onFileSelect={handleFileSelect} />
                                </div>
                            </div>

                            <button className="primary-button bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors mt-4 disabled:opacity-50 disabled:cursor-not-allowed" type="submit" disabled={!file}>Analyze Resume</button>
                        </form>
                    )}
                </div>
            </section>

        </main>
    );
};

export default Upload;