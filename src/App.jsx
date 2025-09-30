import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import {AuthProvider} from "./contexts/AuthContext";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Articles from "./pages/Articles";
import ArticleDetail from "./pages/ArticleDetail";
import Contact from "./pages/Contact";
import AdminDashboard from "./pages/AdminDashboard";
import Login from "./pages/Login";
import ChatbotModal from "./components/ChatbotModal";
import EDDCalculatorModal from "./components/EDDCalculatorModal";
function App() {
    return (
        <AuthProvider>
            <Router>
                <div className="flex flex-col min-h-screen">
                    <Header />
                    <main className="flex-grow container mx-auto px-4 py-8">
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/articles" element={<Articles />} />
                            <Route path="/articles/:slug" element={<ArticleDetail />} />
                            <Route path="/contact" element={<Contact />} />
                            <Route path="/admin" element={<AdminDashboard />} />
                            <Route path="/login" element={<Login />} />
                        </Routes>
                    </main>
                    <Footer />
                    {/* Floating EDD Calculator button on the left */}
                    <div className="fixed bottom-8 left-8 z-50">
                        <EDDCalculatorModal />
                    </div>
                    {/* Floating Chatbot button on the right */}
                    <div className="fixed bottom-8 right-8 z-50">
                        <ChatbotModal />
                    </div>
                </div>
            </Router>
        </AuthProvider>
    );
}

export default App;
