import { useState, useEffect } from "react";
import "./App.css";
import ChatInput from "./components/ChatInput";
import ChatResponse from "./components/ChatResponse";
import { fetchChatResponse } from "./services/api";

function App() {
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [animatedTitle, setAnimatedTitle] = useState("");
  const [darkMode, setDarkMode] = useState(false); // Dark mode state

  useEffect(() => {
    const title = "Chatbot"; // Ensure correct spelling
    setAnimatedTitle(""); // Reset before animation

    let index = 0;
    const interval = setInterval(() => {
      setAnimatedTitle(title.substring(0, index + 1)); // Add one letter at a time
      index++;

      if (index === title.length) {
        clearInterval(interval);
      }
    }, 400); // Adjust speed as needed

    return () => clearInterval(interval);
  }, []); // Runs only once on mount

  const handleQuestionSubmit = async (question) => {
    setLoading(true);
    setResponse(null);
    try {
      const apiResponse = await fetchChatResponse(question);
      setResponse(apiResponse);
    } catch (error) {
      alert("Failed to get response");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`App ${darkMode ? "dark-mode" : ""}`}> {/* Toggle class */}
      <header className="bg-primary text-white text-center py-4 header-container">
        <button 
          onClick={() => setDarkMode(!darkMode)} 
          className="toggle-btn"
        >
          {darkMode ? "☀️" : "🌙"} {/* Only the icon */}
        </button>
        <h1>{animatedTitle}</h1> {/* Title remains centered */}
      </header>
      <ChatInput onSubmit={handleQuestionSubmit} />
      {loading && <h3>Loading...</h3>}
      <ChatResponse response={response} />
    </div>
  );
}

export default App;
