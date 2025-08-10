import React, { useRef, useEffect, useState } from 'react';
import { Camera, Square, CheckCircle, AlertCircle } from 'lucide-react';

interface FaceCaptureProps {
  onCapture: (imageData: string) => void;
  isProcessing: boolean;
}

const FaceCapture: React.FC<FaceCaptureProps> = ({ onCapture, isProcessing }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string>('');
  const [faceDetected, setFaceDetected] = useState(false);

  useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
    };
  }, []);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: 'user'
        }
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsStreaming(true);
        setError('');
      }
    } catch (err) {
      setError('Unable to access camera. Please ensure camera permissions are granted.');
      console.error('Camera access error:', err);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      setIsStreaming(false);
    }
  };

  const captureImage = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const video = videoRef.current;
    const context = canvas.getContext('2d');

    if (!context) return;

    // Set canvas dimensions to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw the video frame to canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Convert to base64
    const imageData = canvas.toDataURL('image/jpeg', 0.8);
    onCapture(imageData);
  };

  // Simulate face detection (in a real app, this would use face detection libraries)
  useEffect(() => {
    if (isStreaming) {
      const interval = setInterval(() => {
        // Randomly simulate face detection for demo purposes
        setFaceDetected(Math.random() > 0.3);
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [isStreaming]);

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
      <div className="text-center mb-6">
        <div className="flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mx-auto mb-4">
          <Camera className="w-8 h-8 text-blue-600" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Face Recognition Check-in</h3>
        <p className="text-gray-600">Position your face in the camera frame and click capture</p>
      </div>

      {error ? (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <p className="text-red-800">{error}</p>
          </div>
          <button
            onClick={startCamera}
            className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
          >
            Retry Camera Access
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Camera Feed */}
          <div className="relative bg-gray-900 rounded-lg overflow-hidden">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-80 object-cover"
            />
            
            {/* Face detection overlay */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className={`w-48 h-48 border-4 rounded-lg transition-colors duration-300 ${
                faceDetected ? 'border-green-400' : 'border-white'
              }`}>
                <div className="w-full h-full border-2 border-dashed border-current opacity-50 rounded-lg" />
              </div>
            </div>

            {/* Status indicator */}
            <div className="absolute top-4 right-4">
              <div className={`flex items-center space-x-2 px-3 py-2 rounded-lg ${
                faceDetected ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
              }`}>
                {faceDetected ? (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    <span className="text-sm font-medium">Face Detected</span>
                  </>
                ) : (
                  <>
                    <Square className="w-4 h-4" />
                    <span className="text-sm font-medium">Position Face</span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Capture Button */}
          <div className="text-center">
            <button
              onClick={captureImage}
              disabled={!isStreaming || !faceDetected || isProcessing}
              className={`px-8 py-3 rounded-lg font-medium transition-all duration-200 ${
                isStreaming && faceDetected && !isProcessing
                  ? 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {isProcessing ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Processing...</span>
                </div>
              ) : (
                'Capture & Check In'
              )}
            </button>
            
            {!faceDetected && isStreaming && (
              <p className="text-sm text-gray-500 mt-2">
                Please position your face within the frame
              </p>
            )}
          </div>
        </div>
      )}

      {/* Hidden canvas for image capture */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};

export default FaceCapture;