import { MessageSquare } from 'lucide-react';

const ChatBubble = ({ isOpen, onClick }) => {
  return (
    <div
      id="chat-bubble"
      className={`fixed bottom-6 right-6 w-14 h-14 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-lg hover:bg-blue-700 cursor-pointer transition-transform ${
        isOpen ? 'scale-90' : 'scale-100'
      }`}
      onClick={onClick}
    >
      <MessageSquare size={24} />
    </div>
  );
};

export default ChatBubble;