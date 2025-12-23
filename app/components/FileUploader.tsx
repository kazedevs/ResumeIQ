import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { formatSize } from "~/lib/utils";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

interface FileUploaderProps {
    onFileSelect?: (file: File | null) => void;
}

const FileUploader = ({ onFileSelect }: FileUploaderProps) => {
    const [internalFile, setInternalFile] = useState<File | null>(null);

    const onDrop = useCallback(
        (acceptedFiles: File[]) => {
            const file = acceptedFiles[0] || null;
            setInternalFile(file);
            onFileSelect?.(file);
        },
        [onFileSelect]
    );
    const { getRootProps, getInputProps, isDragActive, acceptedFiles } =
        useDropzone({
            onDrop,
            multiple: false,
            accept: {
                "application/pdf": [".pdf"],
            },
            maxSize: MAX_FILE_SIZE,
        });



    return (
        <div className="w-full border border-dashed border-gray-300 p-4 rounded-lg">
            <div {...getRootProps()}>
                <input {...getInputProps()} />

                <div className="space-y-4 cursor-pointer">
                    {internalFile ? (
                        <div
                            className="uploader-selected-file"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex items-center justify-center size-10 bg-blue-50 rounded-lg text-xl">
                                📄
                            </div>
                            <div className="flex items-center space-x-3">
                                <div>
                                    <p className="text-sm font-medium text-gray-700 truncate max-w-xs">
                                        {internalFile.name}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        {formatSize(internalFile.size)}
                                    </p>
                                </div>
                            </div>
                            <button
                                type="button"
                                className="p-2 cursor-pointer"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setInternalFile(null);
                                    onFileSelect?.(null);
                                }}
                            >
                                <span className="font-bold block leading-none text-white bg-red-400 rounded-full w-6 h-6 flex items-center justify-center cursor-pointer">
                                    ✕
                                </span>
                            </button>
                        </div>
                    ) : (
                        <div>
                            <div className="mx-auto w-16 h-16 flex items-center justify-center mb-2 text-4xl">
                                📤
                            </div>
                            <p className="text-lg text-gray-500">
                                <span className="font-semibold">Click to upload</span> or drag
                                and drop
                            </p>
                            <p className="text-lg text-gray-500">
                                PDF (max {formatSize(MAX_FILE_SIZE)})
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default FileUploader;