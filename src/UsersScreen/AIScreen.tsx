import React, { useState } from 'react';
import HeaderGlobal from '../MainScreens/header/HeaderGolobal';
import LeftSidebar from '../MainScreens/leftSidebar/LeftSidebar';
import { RootState } from '../Redux/store/store';
import { useSelector } from 'react-redux';
import { toast } from 'sonner';
import { CircularProgress } from '@mui/material';

const AIScreen = () => {
  const [messages, setMessages] = useState([
    { 
      id: 1, 
      sender: 'AI', 
      text: 'Welcome to ChatGPT!', 
      isTitle: true 
    },
    { 
      id: 3, 
      sender: 'AI', 
      text: 'Any kind of querry you wana ask with me ...!!!', 
      isMessage: true 
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;
    
    const newMessage = {
      id: messages.length + 1,
      sender: 'user',
      text: inputValue,
      isUser: true
    };
    
    setMessages([...messages, newMessage]);
    setInputValue('');
    setIsLoading(true);
    
    // Simulate AI response
    setTimeout(() => {
      const aiResponse = {
        id: messages.length + 2,
        sender: 'AI',
        text: 'This is a simulated AI response to your message.',
        isAI: true
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="font-poppins bg-gray-50 min-h-screen">
      <HeaderGlobal />
      <div className="container-1480 h-auto lg:flex md:flex block gap-6 py-6 px-4">
        <LeftSidebar />
        
        <div className="w-full lg:w-3/4 bg-white rounded-xl shadow-sm p-0">
          {/* Chat Header */}
          <div className="border-b border-gray-200 p-4">
            <h1 className="text-xl font-bold text-gray-800">AI Assistant</h1>
          </div>
          
          {/* Chat Messages */}
          <div className="h-[calc(100vh-180px)] overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div 
                key={message.id} 
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`max-w-3/4 rounded-lg p-3 ${
                    message.sender === 'user' 
                      ? 'bg-blue-100 text-blue-900' 
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {message.isTitle && (
                    <h2 className="text-2xl font-bold mb-2">{message.text}</h2>
                  )}
                  {message.isSubtitle && (
                    <h3 className="text-lg font-semibold mb-2">{message.text}</h3>
                  )}
                  {(message.isMessage || message.isAI) && (
                    <p className="whitespace-pre-line">{message.text}</p>
                  )}
                  {message.isPrompt && (
                    <p className="font-medium italic">{message.text}</p>
                  )}
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 rounded-lg p-3">
                  <CircularProgress size={20} />
                </div>
              </div>
            )}
          </div>
          
          {/* Input Area */}
          <div className="border-t border-gray-200 p-4">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              />
              <button
                onClick={handleSendMessage}
                disabled={isLoading}
                className="bg-blue-600 text-white rounded-full p-2 hover:bg-blue-700 disabled:opacity-50"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIScreen;