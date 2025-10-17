import {useState} from "react";
import {Link} from "react-router-dom";
import {Menu, X} from "lucide-react";
import {useAuth} from "../contexts/AuthContext";
import logo from "../assets/logo.png"; // added import

const Header = () => {
    const [isOpen, setIsOpen] = useState(false);
    const {isAdmin, logout} = useAuth();

    return (
        <header className="bg-white shadow-md">
            <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                {/* Logo and Brand */}
                <div className="flex items-center space-x-3">
                    {/* replaced background div with bundled img so path resolves */}
                    <img src={logo} alt="Healthy Mama logo" className="w-10 h-10 object-cover rounded-full" />
                    <Link to="/" className="text-2xl font-bold text-blue-600">
                        Healthy Mama
                    </Link>
                </div>

                {/* Desktop nav (md+) - All links visible */}
                <nav className="hidden md:flex space-x-6 items-center">
                    <Link to="/" className="hover:text-blue-600 transition-colors">
                        Gida
                    </Link>
                    <Link to="/articles" className="hover:text-blue-600 transition-colors">
                        Labarai
                    </Link>
                    <Link to="/contact" className="hover:text-blue-600 transition-colors">
                        Tuntuɓi Mu
                    </Link>
                    {isAdmin ? (
                        <>
                            <Link to="/admin" className="hover:text-blue-600 transition-colors">
                                Admin
                            </Link>
                            <button onClick={logout} className="hover:text-blue-600 transition-colors">
                                Fita
                            </button>
                        </>
                    ) : (
                        <Link to="/login" className="hover:text-blue-600 transition-colors">
                            Shiga
                        </Link>
                    )}
                </nav>

                {/* Mobile hamburger */}
                <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
                    {isOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile menu - All links visible */}
            {isOpen && (
                <nav className="flex flex-col space-y-4 px-4 pb-4 md:hidden bg-white border-t">
                    <Link to="/" onClick={() => setIsOpen(false)} className="py-2 hover:text-blue-600">
                        Gida
                    </Link>
                    <Link to="/articles" onClick={() => setIsOpen(false)} className="py-2 hover:text-blue-600">
                        Labarai
                    </Link>
                    <Link to="/contact" onClick={() => setIsOpen(false)} className="py-2 hover:text-blue-600">
                        Tuntuɓi Mu
                    </Link>
                    {isAdmin ? (
                        <>
                            <Link to="/admin" onClick={() => setIsOpen(false)} className="py-2 hover:text-blue-600">
                                Admin
                            </Link>
                            <button
                                onClick={() => {
                                    logout();
                                    setIsOpen(false);
                                }}
                                className="py-2 text-left hover:text-blue-600"
                            >
                                Fita
                            </button>
                        </>
                    ) : (
                        <Link to="/login" onClick={() => setIsOpen(false)} className="py-2 hover:text-blue-600">
                            Shiga
                        </Link>
                    )}
                </nav>
            )}
        </header>
    );
};

export default Header;
