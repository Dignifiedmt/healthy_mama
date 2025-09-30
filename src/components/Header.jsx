import {useState} from "react";
import {Link} from "react-router-dom";
import {Menu, X} from "lucide-react";
import {useAuth} from "../contexts/AuthContext";

const Header = () => {
    const [isOpen, setIsOpen] = useState(false);
    const {isAdmin, logout} = useAuth();

    return (
        <header className="bg-white shadow-md">
            <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                <Link to="/" className="text-2xl font-bold text-blue-600">
                    Healthy Mama
                </Link>
                {/* Desktop nav (md+) */}
                <nav className="hidden md:flex space-x-6">
                    <Link to="/" className="hover:text-blue-600">
                        Gida
                    </Link>
                    <Link to="/articles" className="hover:text-blue-600">
                        Labarai
                    </Link>
                    <Link to="/contact" className="hover:text-blue-600">
                        Tuntuɓi Mu
                    </Link>
                    {isAdmin ? (
                        <>
                            <Link to="/admin" className="hover:text-blue-600">
                                Admin
                            </Link>
                            <button onClick={logout} className="hover:text-blue-600">
                                Fita
                            </button>
                        </>
                    ) : (
                        <Link to="/login" className="hover:text-blue-600">
                            Shiga
                        </Link>
                    )}
                </nav>
                {/* Tablet nav (sm to md: show limited links) */}
                <nav className="hidden sm:flex md:hidden space-x-4">
                    <Link to="/" className="hover:text-blue-600">
                        Gida
                    </Link>
                    <Link to="/articles" className="hover:text-blue-600">
                        Labarai
                    </Link>
                    <Link to="/contact" className="hover:text-blue-600">
                        Tuntuɓi Mu
                    </Link>

                    {/* Hamburger for more */}
                    <button onClick={() => setIsOpen(!isOpen)}>{isOpen ? <X size={24} /> : <Menu size={24} />}</button>
                </nav>
                {/* Mobile hamburger (<sm) */}
                <button className="sm:hidden" onClick={() => setIsOpen(!isOpen)}>
                    {isOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>
            {/* Mobile/Tablet menu */}
            {isOpen && (
                <nav className="flex flex-col space-y-4 px-4 pb-4">
                    <Link to="/contact" onClick={() => setIsOpen(false)}>
                        Tuntuɓi Mu
                    </Link>
                    {isAdmin ? (
                        <>
                            <Link to="/admin" onClick={() => setIsOpen(false)}>
                                Admin
                            </Link>
                            <button
                                onClick={() => {
                                    logout();
                                    setIsOpen(false);
                                }}
                            >
                                Fita
                            </button>
                        </>
                    ) : (
                        <Link to="/login" onClick={() => setIsOpen(false)}>
                            Shiga
                        </Link>
                    )}
                </nav>
            )}
        </header>
    );
};

export default Header;
