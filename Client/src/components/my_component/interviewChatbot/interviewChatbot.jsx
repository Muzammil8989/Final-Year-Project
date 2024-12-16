import { useRef, useState, useEffect } from "react";
import Webcam from "react-webcam";
import * as faceapi from "face-api.js";
import { Mic, MicOff, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import axios from "axios";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import { Modal } from "antd";
function InterviewChatbot() {
  const [messages, setMessages] = useState([
    { text: "Hello! I am your interview assistant. How are you?", isBot: true },
  ]);
  const [conversation, setConversation] = useState([
    { role: "system", content: "You are an interviewer." },
  ]);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [isBotTyping, setIsBotTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [timerActive, setTimerActive] = useState(false); // Timer state
  const [timer, setTimer] = useState(60); // 60 seconds timer
  const [modalVisible, setModalVisible] = useState(false); // Modal visibility state
  const [modalMessage, setModalMessage] = useState("");

  const { transcript, resetTranscript, listening } = useSpeechRecognition();
  const webcamRef = useRef(null);
  const canvasRef = useRef();
  const scrollRef = useRef(null);
  const timeoutRef = useRef(null); // Reference for timeout

  useEffect(() => {
    loadModels();
    return () => {
      if (canvasRef.current) {
        canvasRef.current.innerHTML = "";
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current); // Clean up timeout when component unmounts
      }
    };
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }

    console.log("Transcript:", transcript);
  }, [transcript, messages]);

  // Function to load face-api models
  const loadModels = () => {
    Promise.all([
      faceapi.nets.tinyFaceDetector.loadFromUri("/models"),
      faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
      faceapi.nets.faceRecognitionNet.loadFromUri("/models"),
      faceapi.nets.faceExpressionNet.loadFromUri("/models"),
    ]).then(() => {
      faceMyDetect();
    });
  };

  // Function to handle face detection
  const faceMyDetect = () => {
    setInterval(async () => {
      if (webcamRef.current) {
        const detections = await faceapi
          .detectAllFaces(
            webcamRef.current.video,
            new faceapi.TinyFaceDetectorOptions(),
          )
          .withFaceLandmarks()
          .withFaceExpressions();

        canvasRef.current.innerHTML = "";
        const canvas = faceapi.createCanvasFromMedia(webcamRef.current.video);
        canvasRef.current.append(canvas);
        faceapi.matchDimensions(canvas, { width: 320, height: 240 });

        const resized = faceapi.resizeResults(detections, {
          width: 320,
          height: 240,
        });
        faceapi.draw.drawDetections(canvas, resized);
        faceapi.draw.drawFaceLandmarks(canvas, resized);
        faceapi.draw.drawFaceExpressions(canvas, resized);

        // Check if there are more than one face detected
        if (detections.length >= 2) {
          terminateInterview(); // Call the function to terminate the interview
        }
      }
    }, 1000);
  };
  const terminateInterview = () => {
    setModalMessage(
      "Multiple faces detected. The interview has been terminated.",
    );
    setModalVisible(true);
    setIsBotTyping(false);
    setTimerActive(false); // Stop the timer
  };

  const handleOk = () => {
    setModalVisible(false);
  };

  // Function to send message and call API
  const handleMessageSend = async () => {
    if (transcript.trim()) {
      const updatedConversation = [
        ...conversation,
        { role: "user", content: transcript },
      ];
      setMessages([...messages, { text: transcript, isBot: false }]);
      resetTranscript();

      const candidateToken = localStorage.getItem("candidateToken");
      if (!candidateToken) {
        alert("Candidate token is missing. Please log in again.");
        return;
      }

      try {
        setIsBotTyping(true);
        const response = await axios.post(
          "http://localhost:5001/api/simulate",
          { userAnswer: transcript, currentStep: questionIndex },
          { headers: { Authorization: `Bearer ${candidateToken}` } },
        );

        const { question, nextStep } = response.data;
        setConversation([
          ...updatedConversation,
          { role: "assistant", content: question },
        ]);
        setMessages((prevMessages) => [
          ...prevMessages,
          { text: question, isBot: true },
        ]);
        setQuestionIndex(nextStep);

        setTimeout(() => {
          setIsBotTyping(false);
        }, 1500);

        // Start the timer after bot sends a question
        setTimer(60);
        setTimerActive(true);
        timeoutRef.current = setTimeout(() => {
          handleTimerExpired();
        }, 60000); // 60 seconds timeout
      } catch (error) {
        alert(
          "An error occurred while processing the interview. Please try again.",
        );
      }
    }
  };

  // Function to handle timer expiration (if user doesn't respond in time)
  const handleTimerExpired = () => {
    if (timerActive) {
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          text: "You took too long to respond. Please try again.",
          isBot: true,
        },
      ]);
      setTimerActive(false); // Stop timer
      setQuestionIndex(questionIndex + 1); // Move to the next question
    }
  };

  // Toggle listening state
  const toggleListening = () => {
    if (listening) {
      SpeechRecognition.stopListening();
      setIsListening(false);
    } else {
      SpeechRecognition.startListening({ continuous: true, language: "en-US" });
      setIsListening(true);
    }
  };

  // Function to handle when the user stops speaking
  const handleStopSpeaking = () => {
    if (transcript.trim()) {
      handleMessageSend();
    }
  };

  // Setting a timeout to detect when the user stops speaking
  const handleSpeechEnd = () => {
    setTimeout(() => {
      if (listening) {
        handleStopSpeaking();
      }
    }, 2000); // Wait for 2 seconds of silence before sending the message
  };

  useEffect(() => {
    if (!listening) {
      handleSpeechEnd();
    }
  }, [listening]);

  useEffect(() => {
    // Update the timer every second if it's active
    if (timerActive) {
      const timerInterval = setInterval(() => {
        setTimer((prevTimer) => {
          if (prevTimer === 0) {
            clearInterval(timerInterval);
          }
          return prevTimer - 1;
        });
      }, 1000);

      return () => clearInterval(timerInterval); // Cleanup the interval on unmount or when timer is inactive
    }
  }, [timerActive]);

  return (
    <div className="relative flex flex-col bg-gradient-to-br from-indigo-600 to-indigo-900 p-6">
      <h1 className="mb-6 text-center text-4xl font-semibold text-white">
        AI Recruitment Assistant
      </h1>

      <div className="flex flex-grow justify-between space-x-6">
        {/* Left Section for Webcam & Timer */}
        <div className="flex w-1/3 flex-col items-center justify-center space-y-4">
          <div className="relative">
            <Webcam
              audio={false}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              videoConstraints={{ facingMode: "user" }}
              className="rounded-lg shadow-lg"
              width="320px"
              height="240px"
            />
            <div
              ref={canvasRef}
              className="absolute left-0 top-0 h-full w-full"
            />
          </div>
          {timerActive && (
            <div className="mt-4 font-semibold text-white">
              Time remaining: {timer}s
            </div>
          )}
        </div>

        {/* Right Section for Chatbot Interface */}
        <Card className="z-10 flex h-[50vh] w-2/3 flex-col">
          <CardHeader>
            <CardTitle>Interview Assistant</CardTitle>
          </CardHeader>
          <CardContent className="flex h-[40vh] flex-grow flex-col">
            <ScrollArea className="h-[40vh] flex-grow pr-4" ref={scrollRef}>
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`mb-4 flex ${message.isBot ? "justify-start" : "justify-end"}`}
                >
                  <div
                    className={`rounded-lg px-4 py-2 ${message.isBot ? "bg-indigo-500 text-white" : "bg-purple-500 text-white"}`}
                  >
                    {message.text}
                  </div>
                </div>
              ))}
              {isBotTyping && (
                <div className="mb-4 flex justify-start">
                  <div className="rounded-lg bg-indigo-500 px-4 py-2 text-white">
                    Typing...
                  </div>
                </div>
              )}
              {listening && (
                <div className="mb-4 flex justify-end">
                  <div className="rounded-lg bg-gray-500 px-4 py-2 text-white">
                    {transcript}
                  </div>
                </div>
              )}
            </ScrollArea>
            <div className="mt-4 flex items-center space-x-2">
              <Button onClick={handleMessageSend}>
                <Send className="mr-2 h-4 w-4" />
                Send
              </Button>
              <Button onClick={toggleListening}>
                {isListening ? (
                  <Mic className="h-4 w-4 animate-pulse" />
                ) : (
                  <MicOff className="h-4 w-4" />
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      <Modal
        title="Interview Terminated"
        visible={modalVisible}
        onOk={handleOk}
        footer={null}
        className="rounded-lg bg-gray-800 text-white"
        bodyStyle={{
          padding: "20px", // Space around the content inside the modal
        }}
        titleStyle={{
          fontSize: "1.5rem", // Larger font size for the title
          fontWeight: "bold", // Bold title for emphasis
          color: "#F9FAFB", // Light color for the title
        }}
      >
        <div className="rounded-lg bg-gray-700 p-6">
          <p className="text-lg">{modalMessage}</p>
        </div>
      </Modal>
    </div>
  );
}

export default InterviewChatbot;
