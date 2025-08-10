import React, { useState } from 'react';
import FaceCapture from '../components/FaceCapture';
import Modal from '../components/Modal';
import { CheckCircle, AlertCircle, Clock } from 'lucide-react';
import { mockFaceRecognition, mockAttendanceSubmission } from '../data/mockData';

const Attendance: React.FC = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [recognitionResult, setRecognitionResult] = useState<{
    success: boolean;
    studentId?: string;
    confidence?: number;
    message?: string;
  } | null>(null);

  const handleFaceCapture = async (imageData: string) => {
    setIsProcessing(true);
    
    try {
      // Simulate face recognition API call
      const result = await mockFaceRecognition(imageData);
      
      if (result.success && result.studentId) {
        // Simulate attendance submission
        const attendanceResult = await mockAttendanceSubmission(result.studentId, 'CS101');
        
        setRecognitionResult({
          success: true,
          studentId: result.studentId,
          confidence: result.confidence,
          message: attendanceResult.message
        });
        setShowSuccessModal(true);
      } else {
        setRecognitionResult({
          success: false,
          message: 'Face not recognized. Please try again or contact support.'
        });
        setShowErrorModal(true);
      }
    } catch (error) {
      setRecognitionResult({
        success: false,
        message: 'An error occurred during recognition. Please try again.'
      });
      setShowErrorModal(true);
    } finally {
      setIsProcessing(false);
    }
  };

  const closeModals = () => {
    setShowSuccessModal(false);
    setShowErrorModal(false);
    setRecognitionResult(null);
  };

  return (
    <div className="ml-64 min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Mark Attendance</h1>
          <p className="text-gray-600">Use face recognition to check in to your classes</p>
        </div>

        {/* Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">How to Check In</h3>
          <div className="grid md:grid-cols-3 gap-4 text-sm">
            <div className="flex items-start space-x-3">
              <div className="flex items-center justify-center w-8 h-8 bg-blue-600 text-white rounded-full text-xs font-bold">1</div>
              <div>
                <p className="font-medium text-blue-900">Position Your Face</p>
                <p className="text-blue-700">Center your face within the camera frame</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="flex items-center justify-center w-8 h-8 bg-blue-600 text-white rounded-full text-xs font-bold">2</div>
              <div>
                <p className="font-medium text-blue-900">Wait for Detection</p>
                <p className="text-blue-700">The system will detect your face automatically</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="flex items-center justify-center w-8 h-8 bg-blue-600 text-white rounded-full text-xs font-bold">3</div>
              <div>
                <p className="font-medium text-blue-900">Capture & Check In</p>
                <p className="text-blue-700">Click the button to complete attendance</p>
              </div>
            </div>
          </div>
        </div>

        {/* Current Class Info */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Current Class</h3>
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-500">Course</p>
              <p className="font-medium text-gray-900">Introduction to Programming</p>
              <p className="text-sm text-gray-600">CS101</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Lecturer</p>
              <p className="font-medium text-gray-900">Dr. Sarah Johnson</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Time</p>
              <p className="font-medium text-gray-900">9:00 AM - 10:30 AM</p>
              <p className="text-sm text-gray-600">Room A101</p>
            </div>
          </div>
        </div>

        {/* Face Capture Component */}
        <FaceCapture onCapture={handleFaceCapture} isProcessing={isProcessing} />

        {/* Success Modal */}
        <Modal
          isOpen={showSuccessModal}
          onClose={closeModals}
          title="Attendance Recorded Successfully!"
          size="md"
        >
          <div className="text-center py-4">
            <div className="flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Check-in Complete</h3>
            <p className="text-gray-600 mb-4">{recognitionResult?.message}</p>
            
            {recognitionResult?.confidence && (
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <p className="text-sm text-gray-600">
                  Recognition Confidence: <span className="font-medium">{Math.round(recognitionResult.confidence * 100)}%</span>
                </p>
                <p className="text-sm text-gray-600">
                  Time: <span className="font-medium">{new Date().toLocaleTimeString()}</span>
                </p>
              </div>
            )}
            
            <button
              onClick={closeModals}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
            >
              Continue
            </button>
          </div>
        </Modal>

        {/* Error Modal */}
        <Modal
          isOpen={showErrorModal}
          onClose={closeModals}
          title="Recognition Failed"
          size="md"
        >
          <div className="text-center py-4">
            <div className="flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mx-auto mb-4">
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Unable to Recognize Face</h3>
            <p className="text-gray-600 mb-4">{recognitionResult?.message}</p>
            
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
              <div className="flex items-center space-x-2">
                <Clock className="w-5 h-5 text-yellow-600" />
                <p className="text-sm text-yellow-800">
                  <strong>Tips for better recognition:</strong>
                </p>
              </div>
              <ul className="text-sm text-yellow-700 mt-2 space-y-1">
                <li>• Ensure good lighting on your face</li>
                <li>• Remove glasses or face coverings if possible</li>
                <li>• Look directly at the camera</li>
                <li>• Keep your face centered in the frame</li>
              </ul>
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={closeModals}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
              >
                Try Again
              </button>
              <button
                onClick={() => alert('Contact support functionality would be implemented here')}
                className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors duration-200"
              >
                Contact Support
              </button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default Attendance;