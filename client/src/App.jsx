import React, { useState, useEffect, useRef } from 'react';
import ChatBubble from './components/chatBubble';
import ChatDialog from './components/chatDialog';


function App() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const dialogRef = useRef(null);

  // Close dialog when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dialogRef.current && !dialogRef.current.contains(event.target) && isOpen) {
        // Check if the click was not on the chat bubble
        const chatBubbleElement = document.getElementById('chat-bubble');
        if (chatBubbleElement && !chatBubbleElement.contains(event.target)) {
          setIsOpen(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const toggleChatDialog = () => {
    setIsOpen(!isOpen);
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const sendMessage = async (customMessage) => {
    const messageToSend = customMessage !== undefined ? customMessage : inputValue;
    if (messageToSend.trim() === '') return;

    const userMessage = {
      text: messageToSend,
      sender: 'user',
      timestamp: new Date().toISOString(),
    };

    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: userMessage.text }),
      });

      const data = await response.json();
      
      const botMessage = {
        text: data.response,
        sender: 'bot',
        timestamp: new Date().toISOString(),
      };

      setMessages((prevMessages) => [...prevMessages, botMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      
      // Add error message
      const errorMessage = {
        text: 'Sorry, I encountered an error. Please try again later.',
        sender: 'bot',
        timestamp: new Date().toISOString(),
      };
      
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        // backgroundImage: 'url(/image.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundColor: '#f3f4f6', // fallback color similar to bg-gray-100
      }}
    >
    

      {/* Chatbot UI */}
      <ChatBubble isOpen={isOpen} onClick={toggleChatDialog} />
      {isOpen && (
        <ChatDialog   
          ref={dialogRef}
          messages={messages}
          inputValue={inputValue}
          onInputChange={handleInputChange}
          onSendMessage={sendMessage}
          onKeyPress={handleKeyPress}
          isLoading={isLoading}
        />
      )}
    </div>
  );
}

export default App;
