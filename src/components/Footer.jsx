import {Link} from "react-router-dom";
import {Mail, Phone, MapPin} from "lucide-react";

// Footer matching hindex.html/hcontact.html: Sections for about, links, newsletter, contact.
const Footer = () => {
    return (
        <footer className="bg-gray-800 text-white py-8">
            <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
                <div>
                    <h3 className="text-xl font-bold">Healthy Mama</h3>
                    <p>Muna sadaukar da kanmu don samar da bayanai masu amfani don inganta lafiyar mata da yara.</p>
                </div>
                <div>
                    <h4 className="font-bold">Masu Muhimmanci</h4>
                    <ul>
                        <li>
                            <Link to="/">Gida</Link>
                        </li>
                        <li>
                            <Link to="/articles">Labarai</Link>
                        </li>
                        <li>
                            <Link to="/contact">Tuntuɓi Mu</Link>
                        </li>
                    </ul>
                </div>
                <div>
                    <h4 className="font-bold">Shiga Shafin Wasikunmu</h4>
                    <p>Karɓi sabbin labarai da shawarwari kai tsaye a cikin akwatin saƙo naka.</p>
                    <input type="email" placeholder="Imel" className="w-full p-2 mt-2 text-black rounded" />
                    <button className="bg-blue-800 p-2 mt-2 rounded w-full">Aika</button>
                </div>
                <div>
                    <h4 className="font-bold">Tuntuɓi Mu</h4>
                    <p>
                        <MapPin size={16} className="inline mr-2" /> Lamba 123, Titin Ahmadu Bello, Kano, Nigeria
                    </p>
                    <p>
                        <Mail size={16} className="inline mr-2" /> info@healthymama.ha
                    </p>
                    <p>
                        <Phone size={16} className="inline mr-2" /> +234 801 234 5678
                    </p>
                </div>
            </div>
            <p className="text-center mt-8">&copy; 2025 Healthy Mama. Dukkan haƙƙoƙi mallakarmu ne.</p>
        </footer>
    );
};

export default Footer;
