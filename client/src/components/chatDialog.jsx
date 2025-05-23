import { forwardRef, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';

const presetQuestions = [
  "What is DTE EMIS?",
  "How do I log in to DTE EMIS?",
  "Where can I find the user manual?",
  "Who can I contact for support?",
  "What is the official website for DTE EMIS?"
];

const ChatDialog = forwardRef(({
  messages,
  inputValue,
  onInputChange,
  onSendMessage,
  onKeyPress,
  isLoading
}, ref) => {
  // Helper to send preset question
  const handlePresetClick = (question) => {
    onSendMessage(question);
  };

  // Ref and effect for auto-scrolling
  const messagesEndRef = useRef(null);
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading]);

  return (
    <div 
      ref={ref}
      className="fixed bottom-24 right-6 w-[380px] h-[520px] bg-white rounded-xl shadow-2xl flex flex-col overflow-hidden border border-gray-300"
    >
      {/* Header */}
      <div className="bg-blue-700 text-white p-4 font-semibold text-lg">
        <h3>Chat with us</h3>
      </div>
      {/* Preset Questions */}
      <div className="p-3 flex flex-wrap gap-2 border-b border-gray-100 bg-blue-50">
        {presetQuestions.map((q) => (
          <button
            key={q}
            className="bg-blue-100 text-blue-800 rounded px-3 py-1 text-sm hover:bg-blue-200 transition"
            onClick={() => handlePresetClick(q)}
            type="button"
            disabled={isLoading}
          >
            {q}
          </button>
        ))}
      </div>
      {/* Messages area */}
      <div className="flex-1 p-4 overflow-y-auto flex flex-col space-y-3 text-base bg-gray-50">
        {messages.length === 0 ? (
          <div className="text-gray-500 text-center mt-4 text-base">
            <p>👋 Hi there! How can I help you today?</p>
          </div>
        ) : (
          messages.map((message, index) => (
            <div
              key={index}
              className={`max-w-[80%] p-3 rounded-lg break-words leading-relaxed shadow-sm ${
                message.sender === 'user'
                  ? 'bg-blue-600 text-white ml-auto rounded-br-none'
                  : 'bg-white text-gray-900 mr-auto rounded-bl-none border border-gray-200'
              }`}
              style={{ fontSize: '1rem' }}
            >
              {message.text}
            </div>
          ))
        )}
        {isLoading && (
          <div className="bg-gray-200 text-gray-800 p-3 rounded-lg max-w-[80%] mr-auto rounded-bl-none flex items-center space-x-1">
            <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"></div>
            <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0.4s' }}></div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      {/* Input area */}
      <div className="border-t border-gray-200 p-4 flex items-center bg-white">
        <input
          type="text"
          value={inputValue}
          onChange={onInputChange}
          onKeyPress={onKeyPress}
          placeholder="Type a message..."
          className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-base bg-gray-50"
          disabled={isLoading}
        />
        <button
          onClick={onSendMessage}
          disabled={inputValue.trim() === '' || isLoading}
          className={`ml-2 bg-blue-600 text-white p-3 rounded-full text-base ${
            inputValue.trim() === '' || isLoading
              ? 'opacity-50 cursor-not-allowed'
              : 'hover:bg-blue-700'
          }`}
        >
          <Send size={20} />
        </button>
      </div>
    </div>
  );
});

export default ChatDialog;
