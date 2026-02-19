import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

interface ImageUploadProps {
  onFileSelect: (file: File) => void;
  currentImage?: string;
}

const ImageUpload = ({ onFileSelect, currentImage }: ImageUploadProps) => {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      onFileSelect(acceptedFiles[0]);
    }
  }, [onFileSelect]);

  const { getRootProps, getInputProps, isDragActive, isDragAccept, isDragReject, acceptedFiles } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    maxFiles: 1,
  });

  const borderColor = isDragAccept ? 'border-green-400 bg-green-50' : isDragReject ? 'border-red-400 bg-red-50' : isDragActive ? 'border-blue-400 bg-blue-50' : 'border-gray-300 bg-gray-50 hover:border-blue-400 hover:bg-blue-50';

  return (
    <div>
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-colors duration-150 ${borderColor}`}
      >
        <input {...getInputProps()} />
        {currentImage && acceptedFiles.length === 0 ? (
          <div className="flex flex-col items-center gap-3">
            <img src={currentImage} alt="Current" className="h-24 rounded-lg object-cover" />
            <p className="text-sm text-gray-500">Drop a new image to replace, or click to select</p>
          </div>
        ) : acceptedFiles.length > 0 ? (
          <div className="flex flex-col items-center gap-2">
            <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <p className="text-sm font-medium text-gray-700">{acceptedFiles[0].name}</p>
            <p className="text-xs text-gray-400">{(acceptedFiles[0].size / 1024).toFixed(1)} KB</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3">
            <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <div>
              <p className="text-sm font-medium text-gray-700">
                {isDragActive ? 'Drop the image here' : 'Drag & drop an image'}
              </p>
              <p className="text-xs text-gray-400 mt-1">or click to browse files</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageUpload;
