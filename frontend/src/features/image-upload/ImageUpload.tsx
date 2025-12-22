import { useState, useEffect, useCallback } from 'react';
import { Dropzone } from '../../components/ui/Dropzone';
import { Header } from '../../components/layout/Header';
import { predictImage } from '../../lib/api';
import { PredictionResponse } from '../../types';

export const ImageUpload: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [data, setData] = useState<PredictionResponse | null>(null);
  const [image, setImage] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const sendFile = useCallback(async () => {
    if (image && selectedFile) {
      setIsLoading(true);
      
      try {
        const response = await predictImage(selectedFile);
        setData(response);
      } catch (error) {
        console.error("Upload failed:", error);
        setData({ class: "Error", confidence: 0 });
      } finally {
        setIsLoading(false);
      }
    }
  }, [image, selectedFile]);

  const clearData = useCallback(() => {
    setData(null);
    setImage(false);
    setSelectedFile(null);
    setPreview(null);
  }, []);

  const onSelectFile = useCallback((file: File) => {
    setSelectedFile(file);
    setData(null);
    setImage(true);
  }, []);

  useEffect(() => {
    if (!selectedFile) {
      setPreview(null);
      return;
    }
    const objectUrl = URL.createObjectURL(selectedFile);
    setPreview(objectUrl);

    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [selectedFile]);

  useEffect(() => {
    if (!preview) {
      return;
    }
    sendFile();
  }, [preview, sendFile]);

  const confidence = data ? (data.confidence * 100).toFixed(2) : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center">
          <div className={`mx-auto max-w-md ${!image ? 'h-auto' : 'h-[500px]'} bg-transparent shadow-[0px_9px_70px_0px_rgba(0,0,0,0.3)] rounded-xl`}>
            {image && preview && (
              <div className="w-full h-full">
                <img
                  src={preview}
                  alt="Preview"
                  className="w-full h-full object-contain rounded-xl"
                />
              </div>
            )}
            
            {!image && (
              <div className="p-4">
                <Dropzone onFileSelect={onSelectFile} />
              </div>
            )}
            
            {data && (
              <div className="bg-white flex flex-col items-center py-4">
                <table className="w-full max-w-xs bg-transparent">
                  <thead className="bg-transparent">
                    <tr className="bg-transparent">
                      <th className="text-sm bg-transparent border-transparent text-[#000000a6] font-bold py-1 px-4 text-left">Label:</th>
                      <th className="text-sm bg-transparent border-transparent text-[#000000a6] font-bold py-1 px-4 text-right">Confidence:</th>
                    </tr>
                  </thead>
                  <tbody className="bg-transparent">
                    <tr className="bg-transparent">
                      <td className="text-xl bg-transparent border-transparent text-[#000000a6] font-bold py-1 px-4">{data.class}</td>
                      <td className="text-xl bg-transparent border-transparent text-[#000000a6] font-bold py-1 px-4 text-right">{confidence}%</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
            
            {isLoading && (
              <div className="flex flex-col items-center py-4">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#be6a77]"></div>
                <p className="mt-2 text-lg">Processing</p>
              </div>
            )}
          </div>
        </div>

        {data && (
          <div className="flex justify-center mt-4">
            <button
              className="w-full max-w-xs rounded-xl p-4 text-[#000000a6] text-lg font-bold bg-white hover:bg-[#ffffff7a]"
              onClick={clearData}
            >
              <span className="flex items-center justify-center">
                Clear
              </span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};