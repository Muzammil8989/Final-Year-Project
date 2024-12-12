import { useRef, useState, useEffect } from "react";
import Webcam from "react-webcam"; // Import react-webcam
import * as faceapi from "face-api.js";
import { Mic, MicOff, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import axios from "axios";

function InterviewChatbot() {
  const [messages, setMessages] = useState([
    { text: "Hello! I am your interview assistant. How are you?", isBot: true },
  ]);
  const [userMessage, setUserMessage] = useState("");
  const [conversation, setConversation] = useState([
    { role: "system", content: "You are an interviewer." },
  ]);
  const [isListening, setIsListening] = useState(false);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [isWaitingForAnswer, setIsWaitingForAnswer] = useState(false);
  const [isBotTyping, setIsBotTyping] = useState(false);

  const webcamRef = useRef(null);
  const canvasRef = useRef();
  // const recognitionRef = useRef(null);
  const scrollRef = useRef(null);

  // Load models for face detection
  useEffect(() => {
    loadModels();
    // setupSpeechRecognition();
    return () => {
      if (canvasRef.current) {
        canvasRef.current.innerHTML = "";
      }
    };
  }, []);

  // Scroll to the bottom when messages change
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Load face-api.js models
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

  // Detect face using face-api.js
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
      }
    }, 1000);
  };

  // // Setup speech recognition
  // const setupSpeechRecognition = () => {
  //   const SpeechRecognition =
  //     window.SpeechRecognition || window.webkitSpeechRecognition;
  //   if (SpeechRecognition) {
  //     recognitionRef.current = new SpeechRecognition();
  //     recognitionRef.current.continuous = true;
  //     recognitionRef.current.lang = "en-US";
  //     recognitionRef.current.interimResults = true;

  //     recognitionRef.current.onresult = (event) => {
  //       const lastResult = event.results[event.results.length - 1];
  //       if (lastResult.isFinal) {
  //         setUserMessage(lastResult[0].transcript);
  //         setIsWaitingForAnswer(false);
  //       }
  //     };

  //     recognitionRef.current.onerror = (event) => {
  //       console.error("Speech recognition error:", event.error);
  //     };

  //     recognitionRef.current.onend = () => {
  //       setIsListening(false);
  //     };
  //   } else {
  //     alert("Speech Recognition API is not supported in this browser.");
  //   }
  // };

  // // Toggle speech recognition
  // const toggleListening = () => {
  //   if (isListening) {
  //     recognitionRef.current.stop();
  //   } else {
  //     recognitionRef.current.start();
  //   }
  //   setIsListening(!isListening);
  // };

  // Send message and handle conversation flow
  const handleMessageSend = async () => {
    if (userMessage.trim()) {
      const updatedConversation = [
        ...conversation,
        { role: "user", content: userMessage },
      ];
      setMessages([...messages, { text: userMessage, isBot: false }]);
      setUserMessage("");
      setIsWaitingForAnswer(false);

      const candidateToken = localStorage.getItem("candidateToken");
      if (!candidateToken) {
        alert("Candidate token is missing. Please log in again.");
        return;
      }

      try {
        setIsBotTyping(true); // Start typing animation
        const response = await axios.post(
          "http://localhost:5001/api/simulate",
          { userAnswer: userMessage, currentStep: questionIndex },
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

        // Stop typing animation after a brief delay
        setTimeout(() => {
          setIsBotTyping(false);
        }, 1500);
      } catch (error) {
        alert(
          "An error occurred while processing the interview. Please try again.",
        );
      }
    }
  };

  // Automatically listen for answers when a new question is asked
  useEffect(() => {
    if (!isWaitingForAnswer && questionIndex < messages.length) {
      const question = messages[questionIndex]?.text;
      if (question && question !== "") {
        setIsWaitingForAnswer(true);
        // toggleListening(); // Start listening for an answer
      }
    }
  }, [questionIndex, messages, isWaitingForAnswer]);

  return (
    <div className="relative flex flex-col bg-gradient-to-br from-indigo-600 to-indigo-900 p-6">
      <h1 className="mb-6 text-center text-4xl font-semibold text-white">
        AI Recruitment Assistant
      </h1>

      <div className="flex flex-grow justify-between space-x-6">
        <div className="flex w-1/3 justify-center">
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

        <Card className="z-10 flex h-[50vh] w-2/3 flex-col">
          <CardHeader>
            <CardTitle>Interview Assistant</CardTitle>
          </CardHeader>
          <CardContent className="flex h-[40vh] flex-grow flex-col">
            <ScrollArea className="h-[40vh] flex-grow pr-4" ref={scrollRef}>
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`mb-4 flex ${
                    message.isBot ? "justify-start" : "justify-end"
                  }`}
                >
                  <div
                    className={`rounded-lg px-4 py-2 ${
                      message.isBot
                        ? "bg-indigo-500 text-white"
                        : "bg-purple-500 text-white"
                    }`}
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
            </ScrollArea>
            <div className="mt-4 flex items-center space-x-2">
              <Input
                type="text"
                value={userMessage}
                onChange={(e) => setUserMessage(e.target.value)}
                placeholder="Ask something..."
                className="flex-grow"
              />
              <Button onClick={handleMessageSend}>
                <Send className="mr-2 h-4 w-4" />
                Send
              </Button>
              <Button>
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
    </div>
  );
}

export default InterviewChatbot;
