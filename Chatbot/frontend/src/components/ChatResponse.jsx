import { useState, useEffect } from "react";

const ChatResponse = ({ response, isDarkMode }) => {
  const [displayText, setDisplayText] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [showResponse, setShowResponse] = useState(false);

  useEffect(() => {
    if (response && response.candidates?.length > 0) {
      setShowResponse(true);
      let text = (response.candidates[0].content.parts[0]?.text || "").trim();
  
      if (!text) {
        setDisplayText("No response available.");
        return;
      }
  
      let index = 0;
      let correctText = ""; // New variable to store properly typed text
  
      // Capture the first letter properly
      if (text.length > 0) {
        correctText = text[0]; // First letter
        index = 1;
      }
  
      setDisplayText(correctText);
  
      const interval = setInterval(() => {
        if (index < text.length) {
          correctText += text[index]; // Ensure proper letter-by-letter animation
          setDisplayText(correctText);
          index++;
        } else {
          clearInterval(interval);
  
          // Store in history only after completion
          setChatHistory((prev) => [
            ...prev,
            { text, timestamp: new Date().toLocaleTimeString() },
          ]);
        }
      }, 20);
  
      return () => clearInterval(interval);
    }
  }, [response]);
  

  return (
    <div style={{ maxWidth: "800px", margin: "auto", padding: "20px", position: "relative" }}>
      <button
        onClick={() => setShowHistory(!showHistory)}
        style={{
          position: "absolute",
          top: "10px",
          right: "10px",
          backgroundColor: "#1565c0",
          color: "white",
          border: "none",
          padding: "10px 15px",
          cursor: "pointer",
          borderRadius: "5px",
          fontSize: "14px",
          display: showResponse ? "block" : "none",
        }}
      >
        {showHistory ? "Hide History" : "Show History"}
      </button>

      {showResponse && (
        <>
          <h3 style={{ color: "#1565c0", textAlign: "center", marginBottom: "20px" }}>AI Response</h3>

          <div
            style={{
              borderLeft: "5px solid #1565c0",
              padding: "15px",
              marginBottom: "15px",
              backgroundColor: isDarkMode ? "#1e1e1e" : "#f8f9fa",
              color: isDarkMode ? "#ffffff" : "#000000",
              borderRadius: "8px",
              fontFamily: "monospace",
              whiteSpace: "pre-wrap",
              minHeight: "50px",
            }}
          >
            <h5 style={{ color: isDarkMode ? "#ffffff" : "#000000" }}>Response</h5>
            <p>{displayText || "..."}</p>
          </div>

          {showHistory && (
            <div
              style={{
                marginTop: "20px",
                padding: "15px",
                backgroundColor: isDarkMode ? "#2c2c2c" : "#e3f2fd",
                color: isDarkMode ? "#ffffff" : "#000000",
                borderRadius: "8px",
                maxHeight: "300px",
                overflowY: "auto",
              }}
            >
              <h4>Chat History</h4>
              {chatHistory.length > 0 ? (
                chatHistory.map((chat, index) => (
                  <div key={index} style={{ marginBottom: "10px", padding: "10px", borderBottom: "1px solid gray" }}>
                    <p><strong>Time:</strong> {chat.timestamp}</p>
                    <p>{chat.text}</p>
                  </div>
                ))
              ) : (
                <p>No chat history available.</p>
              )}
            </div>
          )}

          {response?.usageMetadata && (
            <div
              style={{
                background: isDarkMode ? "#2c2c2c" : "#e3f2fd",
                color: isDarkMode ? "#ffffff" : "#000000",
                padding: "15px",
                borderRadius: "8px",
                marginTop: "20px",
              }}
            >
              <h4>Usage Statistics</h4>
              <p>🔹 Prompt Tokens: {response.usageMetadata.promptTokenCount}</p>
              <p>🔹 Response Tokens: {response.usageMetadata.candidatesTokenCount}</p>
              <p>🔹 Total Tokens: {response.usageMetadata.totalTokenCount}</p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ChatResponse;
