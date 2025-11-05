// components/Chatbot.jsx
import React, {useState} from "react";

const Chatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");

    const handleSend = async () => {
        if (!input.trim()) return;

        // Add user message
        const newMessages = [...messages, {text: input, sender: "user"}];
        setMessages(newMessages);
        setInput("");

        // Call Gemini API (implementation needed)
        // const response = await getGeminiResponse(input);
        // setMessages([...newMessages, { text: response, sender: 'bot' }]);
    };

    return (
        <div className="fixed bottom-6 right-6">
            {isOpen && (
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-80 h-96 mb-4 flex flex-col">
                    <div className="p-4 border-b flex justify-between items-center">
                        <h3 className="font-semibold">Maternal Health Assistant</h3>
                        <button onClick={() => setIsOpen(false)}>×</button>
                    </div>
                    <div className="flex-grow p-4 overflow-y-auto">
                        {messages.map((msg, i) => (
                            <div key={i} className={`my-2 ${msg.sender === "user" ? "text-right" : ""}`}>
                                <div
                                    className={`inline-block p-2 rounded-lg ${
                                        msg.sender === "user"
                                            ? "bg-blue-100 dark:bg-blue-900"
                                            : "bg-gray-100 dark:bg-gray-800"
                                    }`}
                                >
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="p-4 border-t flex">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={(e) => e.key === "Enter" && handleSend()}
                            className="flex-grow border rounded-l p-2"
                            placeholder="Tambaya..."
                        />
                        <button onClick={handleSend} className="bg-blue-500 text-white p-2 rounded-r">
                            Aika
                        </button>
                    </div>
                </div>
            )}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="bg-custom-blue-dark text-white w-14 h-14 rounded-full flex items-center justify-center shadow-lg hover:bg-blue-800 transition duration-300"
            >
                <span className="material-icons">chat</span>
            </button>
        </div>
    );
};

export default Chatbot;
