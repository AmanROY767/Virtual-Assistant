
import React, { createContext, useState } from 'react';
import run from '../gemini';

export const datacontext = createContext();

function UserContext({ children }) {
  const [speaking, setSpeaking] = useState(false);
  const [prompt, setPrompt] = useState("listening...");
  const [response, setResponse] = useState(false);

  function speak(text) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.volume = 1;
    utterance.rate = 1;
    utterance.pitch = 1;
    utterance.lang = "hi-IN"; 

    window.speechSynthesis.cancel(); 
    window.speechSynthesis.speak(utterance);
  }

  async function aiResponse(prompt) {
    const text = await run(prompt);

    
    const newText = text.replace(/[*]/g, "").replace(/google/gi, "Aman Anand");

    setPrompt(newText);
    speak(newText);
    setResponse(true);
    setTimeout(() => setSpeaking(false), 5000);
  }

  const speechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = new speechRecognition();

  recognition.onresult = (e) => {
    const currentIndex = e.resultIndex;
    const transcript = e.results[currentIndex][0].transcript;
    setPrompt(transcript);
    takeCommand(transcript.toLowerCase());
  };

  function takeCommand(command) {
    if (command.includes("open") && command.includes("youtube")) {
      window.open("https://www.youtube.com/", "_blank");
      speak("Opening YouTube");
      setPrompt("Opening YouTube...");
    } else if (command.includes("open") && command.includes("google")) {
      window.open("https://www.google.com/", "_blank");
      speak("Opening Google");
      setPrompt("Opening Google...");
    } else if (command.includes("open") && command.includes("instagram")) {
      window.open("https://www.instagram.com/", "_blank");
      speak("Opening Instagram");
      setPrompt("Opening Instagram...");
    } else if (command.includes("time")) {
      const time = new Date().toLocaleString(undefined, {
        hour: "numeric",
        minute: "numeric",
      });
      speak(`The time is ${time}`);
      setPrompt(time);
    } else if (command.includes("date")) {
      const date = new Date().toLocaleString(undefined, {
        day: "numeric",
        month: "short",
      });
      speak(`Today's date is ${date}`);
      setPrompt(date);
    } else {
      aiResponse(command);
    }

    setResponse(true);
    setTimeout(() => setSpeaking(false), 5000);
  }

  const value = {
    recognition,
    speaking,
    setSpeaking,
    prompt,
    setPrompt,
    response,
    setResponse,
  };

  return (
    <datacontext.Provider value={value}>
      {children}
    </datacontext.Provider>
  );
}

export default UserContext;
