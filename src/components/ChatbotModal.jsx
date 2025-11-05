import {useState} from "react";
import {MessageCircle, X, Send} from "lucide-react";
import {generateResponse} from "../services/gemini";
import ReactMarkdown from "react-markdown"; // Added for markdown rendering

// Chatbot: Floating button on all pages, opens panel, renders Gemini responses as markdown.
const ChatbotModal = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        {text: "Sannu! Ina taimaka a kan lafiyar mata da yara. Menene tambayarka?", from: "bot"},
    ]);
    const [input, setInput] = useState("");

    const handleSend = async () => {
        if (!input.trim()) return;
        const userMessage = {text: input, from: "user"};
        setMessages((prev) => [...prev, userMessage]);
        setInput("");

        try {
            setMessages((prev) => [...prev, {text: "Ina rubutawa...", from: "bot"}]);
            const response = await generateResponse(input);
            setMessages((prev) => [...prev.slice(0, -1), {text: response, from: "bot"}]);
        } catch (error) {
            setMessages((prev) => [
                ...prev.slice(0, -1),
                {text: "Sorry, an yi kuskure. Yi gwaji daga baya.", from: "bot"},
            ]);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-6 right-6 bg-blue-800 text-white p-4 rounded-full shadow-lg hover:bg-blue-800 z-50"
                aria-label="Open Chatbot"
            >
                <MessageCircle size={24} />
            </button>

            {/* Chat Panel */}
            {isOpen && (
                <div className="fixed bottom-24 right-6 w-80 h-96 bg-white shadow-xl rounded-lg flex flex-col z-50 border border-gray-200">
                    <div className="flex justify-between items-center p-4 border-b bg-gray-50 rounded-t-lg">
                        <h3 className="font-bold text-lg">Healthy Mama Bot</h3>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="text-gray-500 hover:text-gray-800"
                            aria-label="Close Chatbot"
                        >
                            <X size={20} />
                        </button>
                    </div>
                    <div className="flex-1 p-4 overflow-y-auto space-y-2">
                        {messages.map((msg, i) => (
                            <div key={i} className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"}`}>
                                <div
                                    className={`max-w-xs px-3 py-2 rounded-lg ${
                                        msg.from === "user" ? "bg-blue-800 text-white" : "bg-gray-200 text-gray-800"
                                    }`}
                                >
                                    {/* Render bot messages as markdown */}
                                    {msg.from === "bot" ? <ReactMarkdown>{msg.text}</ReactMarkdown> : msg.text}
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="p-4 border-t flex items-center space-x-2">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Rubuta tambayarka a Hausa..."
                            className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                            onClick={handleSend}
                            disabled={!input.trim()}
                            className="bg-blue-800 text-white p-2 rounded-lg disabled:opacity-50"
                        >
                            <Send size={18} />
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};

export default ChatbotModal;
