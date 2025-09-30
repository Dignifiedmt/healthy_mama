import {useState} from "react";
import FormInput from "../components/FormInput";
import {submitContact} from "../services/supabase";
import {MapPin, Mail, Phone} from "lucide-react";

// Contact: Matching hcontact.html – Form, address, FAQs.
const Contact = () => {
    const [form, setForm] = useState({name: "", email: "", message: ""});

    const handleSubmit = async (e) => {
        e.preventDefault();
        await submitContact(form);
        alert("Message sent!");
        setForm({name: "", email: "", message: ""});
    };

    return (
        <div>
            <h1 className="text-4xl font-bold mb-6">Tuntuɓi Mu</h1>
            <p className="mb-8">
                Muna farin cikin jin ta bakinku. Ko kuna da tambaya, shawara, ko kuna son yin aiki tare da mu, kada ku
                yi jinkirin tuntuɓar mu.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md">
                    <h2 className="text-2xl font-bold mb-4">Aiko Mana da Saƙo</h2>
                    <FormInput
                        label="Cikakken Suna"
                        value={form.name}
                        onChange={(e) => setForm({...form, name: e.target.value})}
                        required
                    />
                    <FormInput
                        label="Adireshin Imel"
                        type="email"
                        value={form.email}
                        onChange={(e) => setForm({...form, email: e.target.value})}
                        required
                    />
                    <div className="mb-4">
                        <label className="block mb-2">Saƙonku</label>
                        <textarea
                            value={form.message}
                            onChange={(e) => setForm({...form, message: e.target.value})}
                            required
                            className="w-full p-2 border rounded h-32"
                        />
                    </div>
                    <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded">
                        Aika Saƙo
                    </button>
                </form>
                <div>
                    <h2 className="text-2xl font-bold mb-4">Adireshinmu</h2>
                    <p className="mb-2">
                        <MapPin size={20} className="inline mr-2" /> Lamba 123, Titin Ahmadu Bello, Kano, Nigeria
                    </p>
                    <p className="mb-2">
                        <Mail size={20} className="inline mr-2" /> info@healthymama.ha
                    </p>
                    <p className="mb-8">
                        <Phone size={20} className="inline mr-2" /> +234 801 234 5678
                    </p>
                    <h2 className="text-2xl font-bold mb-4">Tambayoyi Akai-akai (FAQs)</h2>
                    <div className="space-y-4">
                        <div>
                            <h3 className="font-bold">Menene babban makasudin Healthy Mama?</h3>
                            <p>
                                Babban makasudinmu shine samar da ingantattun bayanai da ilimi game da lafiyar mata masu
                                juna biyu da yara don rage mace-macen da ake samu da kuma inganta lafiyar al'umma baki
                                ɗaya.
                            </p>
                        </div>
                        <div>
                            <h3 className="font-bold">Shin bayanan da kuke bayarwa kyauta ne?</h3>
                            <p>
                                Haka ne, dukkan bayanai, labarai, da albarkatun da muke wallafawa a wannan shafin kyauta
                                ne ga kowa da kowa. Manufarmu ita ce wayar da kai ya kai ga kowa.
                            </p>
                        </div>
                        {/* Add more FAQs as needed */}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contact;
