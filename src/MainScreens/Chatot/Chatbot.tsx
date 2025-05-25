import React, { useState, useRef, useEffect, ReactNode, createContext, useContext } from 'react';
import { MdSmartToy, MdMenuBook, MdSchool, MdSend } from 'react-icons/md';
import { Button, Card, CardContent, Input, Switch } from '@mui/material';
import UniversityHero from '../../Comp/UniversityHero';

// ====================== Chat Context ======================
export type UserRole = 'student' | 'teacher' | 'alumni' | 'dean' | 'faculty' | 'visitor';

export interface Message {
    id: string;
    text: string;
    sender: 'user' | 'bot';
    timestamp: Date;
}

interface ChatContextProps {
    messages: Message[];
    addMessage: (text: string, sender: 'user' | 'bot') => void;
    clearMessages: () => void;
    userRole: UserRole;
    setUserRole: (role: UserRole) => void;
    isGlobalMode: boolean;
    toggleMode: () => void;
}

const ChatContext = createContext<ChatContextProps | undefined>(undefined);

const useChat = (): ChatContextProps => {
    const context = useContext(ChatContext);
    if (!context) throw new Error('useChat must be used within a ChatProvider');
    return context;
};

const ChatProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [userRole, setUserRole] = useState<UserRole>('visitor');
    const [isGlobalMode, setIsGlobalMode] = useState(false);

    const addMessage = (text: string, sender: 'user' | 'bot') => {
        setMessages(prev => [...prev, { id: Date.now().toString(), text, sender, timestamp: new Date() }]);
    };

    const clearMessages = () => setMessages([]);
    const toggleMode = () => setIsGlobalMode(prev => !prev);

    return (
        <ChatContext.Provider value={{ messages, addMessage, clearMessages, userRole, setUserRole, isGlobalMode, toggleMode }}>
            {children}
        </ChatContext.Provider>
    );
};

// ====================== Chat Interface ======================
const ChatInterface: React.FC = () => {
    const { messages, addMessage, isGlobalMode, toggleMode, userRole } = useChat();
    const [inputValue, setInputValue] = useState('');
    const messagesEndRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputValue.trim()) return;

        addMessage(inputValue, 'user');

        setTimeout(() => {
            const response = generateBotResponse(inputValue, isGlobalMode, userRole);
            addMessage(response, 'bot');
        }, 1000);

        setInputValue('');
    };

    return (
        <div className="flex flex-col h-[600px] bg-white rounded-lg shadow-lg">
            <div className="flex justify-between items-center p-4 border-b">
                <h2 className="text-lg font-bold font-serif text-university-blue">
                    {isGlobalMode ? 'Global AI Assistant' : 'University Assistant'}
                </h2>
                <div className="flex items-center space-x-2">
                    <span className="text-sm text-muted-foreground">University Mode</span>
                    <Switch checked={isGlobalMode} />
                    <span className="text-sm text-muted-foreground">Global Mode</span>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center">
                        <MdSmartToy size={48} className="text-university-blue mb-4" />
                        <h3 className="font-serif text-xl text-university-blue">
                            {isGlobalMode ? 'Welcome to the Global AI Assistant' : 'Welcome to the University Assistant'}
                        </h3>
                        <p className="text-muted-foreground max-w-md">
                            {isGlobalMode
                                ? 'Ask me anything about any topic, and I\'ll do my best to help!'
                                : `Hello, ${userRole}! Ask me anything about our university, courses, campus life, or resources.`}
                        </p>
                    </div>
                ) : (
                    messages.map((msg) => (
                        <div key={msg.id} className={`chat-message flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[80%] rounded-lg p-3 ${msg.sender === 'user' ? 'bg-university-blue text-white' : 'bg-gray-100 text-gray-800'}`}>
                                {msg.text}
                            </div>
                        </div>
                    ))
                )}
                <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSubmit} className="p-4 border-t flex space-x-2">
                <Input
                    type="text"
                    placeholder="Type your message here..."
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    className="flex-1"
                />
                <Button type="submit" className="bg-university-blue hover:bg-university-green">
                    <MdSend className="h-4 w-4" />
                </Button>
            </form>
        </div>
    );
};

const generateBotResponse = (input: string, isGlobalMode: boolean, role: string): string => {
    const lcInput = input.toLowerCase();

    if (isGlobalMode) {
        if (lcInput.includes('hello') || lcInput.includes('hi')) return "Hello! I'm a global AI assistant. How can I help you today?";
        if (lcInput.includes('name')) return "I'm GlobalU's AI assistant. You can call me GU Assistant.";
        if (lcInput.includes('weather')) return "I don't have real-time weather data, but I can talk about climate!";
        if (lcInput.includes('joke')) return "Why don't scientists trust atoms? Because they make up everything!";
        return "I'm here to help with a wide range of topics. Can you give me more details?";
    } else {
        if (lcInput.includes('course') || lcInput.includes('class')) return "Our university offers a wide range of courses. Check our catalog!";
        if (lcInput.includes('admission') || lcInput.includes('apply')) return "Submit an application, transcripts, and recommendation letters.";
        if (lcInput.includes('campus') || lcInput.includes('facility')) return "Our campus includes libraries, labs, and sports centers.";
        if (lcInput.includes('faculty') || lcInput.includes('professor')) return "Our faculty are industry leaders and researchers.";
        if (lcInput.includes('research')) return "We have many research centers and student projects.";
        if (lcInput.includes('deadline') || lcInput.includes('date')) return "Upcoming deadlines: Registration - June 1, Graduate apps - Jan 15.";

        switch (role) {
            case 'student':
                return "You have access to advising, tutoring, and clubs. How can I help?";
            case 'teacher':
                return "Explore grants, research tools, and teaching support.";
            case 'alumni':
                return "Stay connected via our alumni events and mentoring programs.";
            case 'dean':
                return "Access analytics, faculty reviews, and budget tools.";
            default:
                return "Feel free to ask anything about the university!";
        }
    }
};

// ====================== Main Page ======================
const ChatPage: React.FC = () => {
    const [showRoleSelector, setShowRoleSelector] = useState(true);


    return (
        <ChatProvider>
            <div className="min-h-screen flex flex-col bg-gray-50">
                <div className="container mx-auto py-12 px-6">
                    <div className="max-w-4xl mx-auto"><ChatInterface /></div>
                    <div className="grid md:grid-cols-3 gap-8 mt-16">
                        {[
                            {
                                icon: <MdSmartToy size={24} />,
                                title: "24/7 Assistant",
                                desc: "Get answers to your questions anytime, anywhere with our AI-powered university assistant.",
                                bg: "bg-university-blue",
                                text: "text-white"
                            },
                            {
                                icon: <MdMenuBook size={24} />,
                                title: "Program Information",
                                desc: "Explore our academic programs designed for success.",
                                bg: "bg-university-green",
                                text: "text-white"
                            },
                            {
                                icon: <MdSchool size={24} />,
                                title: "Student Resources",
                                desc: "Access resources to support your academic and personal growth.",
                                bg: "bg-university-gold",
                                text: "text-university-dark"
                            }
                        ].map(({ icon, title, desc, bg, text }, i) => (
                            <Card key={i}>
                                <CardContent className="pt-6 text-center">
                                    <div className={`mx-auto w-12 h-12 flex items-center justify-center rounded-full ${bg} ${text} mb-4`}>
                                        {icon}
                                    </div>
                                    <h3 className="font-serif text-xl font-bold mb-2">{title}</h3>
                                    <p className="text-gray-600">{desc}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>

            </div>
        </ChatProvider>
    );
};

export default ChatPage;
