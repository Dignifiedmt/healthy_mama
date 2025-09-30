import {useState, useEffect} from "react";
import {getArticles, submitRequest, uploadImage} from "../services/supabase";
import ArticleCard from "../components/ArticleCard";
import SearchBar from "../components/SearchBar";
import {Target, Eye, Heart} from "lucide-react";
import SimpleMDE from "react-simplemde-editor"; // Updated import
import "easymde/dist/easymde.min.css"; // Added for editor styles

const Home = () => {
    const [articles, setArticles] = useState([]);
    const [search, setSearch] = useState("");
    const [form, setForm] = useState({title: "", excerpt: "", content: "", image: null, email: ""});
    const [currentTipIndex, setCurrentTipIndex] = useState(0);
    // Toggle visibility for the Add Article form
    const [showForm, setShowForm] = useState(false);

    const tips = [
        "Tabbatar kina shan isasshen ruwa a kowace rana don lafiyar jikinki da na jaririnki.",
        "Yi motsa jiki a kai a kai don karfafa jikinki a lokacin daukar ciki.",
        "Ciyar da jariri da nono na uwa shine mafi kyau ga lafiyarsa.",
        "Kai jariri zuwa rigakafi a kan lokaci don kare shi daga cututtuka.",
        "Yi amfani da abinci mai gina jiki kamar 'ya'yan itace da kayan lambu.",
        "Kula da tsaftar jariri don hana rashin lafiya.",
        "Yi barci mai kyau don karfafa jikinki bayan haihuwa.",
        "Tuntuɓi likita idan ka ga alamar rashin lafiya a jariri.",
        "Yi wasa da jariri don haɓaka kwakwalwarsa.",
        "Kula da lafiyar hankali a lokacin ciki.",
    ];

    useEffect(() => {
        async function fetchData() {
            const data = await getArticles();
            setArticles(data.slice(0, 3));
        }
        fetchData();

        const today = new Date().toISOString().slice(0, 10);
        const hash = today.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
        const startIndex = hash % tips.length;
        setCurrentTipIndex(startIndex);

        const interval = setInterval(() => {
            setCurrentTipIndex((prev) => (prev + 1) % tips.length);
        }, 3000);

        return () => clearInterval(interval);
    }, []);

    const handleSubmitRequest = async (e) => {
        e.preventDefault();
        let imagePath = "";
        if (form.image) {
            imagePath = await uploadImage(form.image);
        }
        await submitRequest({
            title: form.title,
            excerpt: form.excerpt,
            content: form.content,
            image_path: imagePath,
            status: "pending",
            submitter_email: form.email,
        });
        alert("Request submitted! Awaiting admin approval.");
        setForm({title: "", excerpt: "", content: "", image: null, email: ""});
    };

    const filteredArticles = articles.filter((a) => a.title.toLowerCase().includes(search.toLowerCase()));

    return (
        <div>
            <SearchBar value={search} onChange={(e) => setSearch(e.target.value)} />
            <section className="my-8 text-center bg-white shadow-md p-4 rounded">
                <h1 className="text-4xl font-bold mb-4">Lafiyar Mata Mai Juna Biyu da Yara</h1>
                <p className="text-lg mb-4">Samun ingantacciyar lafiya ga uwa da ɗanta shine babban burinmu.</p>
                <button className="bg-blue-600 text-white px-6 py-2 rounded">Fara Yanzu</button>
            </section>
            <section className="my-8 bg-blue-100 p-4 rounded">
                <h2 className="text-2xl font-bold mb-2 text-center">Shawara ta Yau</h2>
                <p className="text-center">{tips[currentTipIndex]}</p>
            </section>
            <section className="my-8 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                <div className="bg-white shadow-md p-4 rounded">
                    <Target size={48} className="mx-auto mb-4 text-blue-600" />
                    <h3 className="text-xl font-bold">Manufarmu</h3>
                    <p>
                        Wayar da kan al'umma game da mahimmancin lafiyar mata masu juna biyu da yara don rage mace-macen
                        da ake samu.
                    </p>
                </div>
                <div className="bg-white shadow-md p-4 rounded">
                    <Eye size={48} className="mx-auto mb-4 text-blue-600" />
                    <h3 className="text-xl font-bold">Burinmu</h3>
                    <p>
                        Ganin an samu al'umma mai cikakkiyar lafiya inda kowace uwa da yaro ke samun kulawar da ta dace.
                    </p>
                </div>
                <div className="bg-white shadow-md p-4 rounded">
                    <Heart size={48} className="mx-auto mb-4 text-blue-600" />
                    <h3 className="text-xl font-bold">Tasirinmu</h3>
                    <p>
                        Mun kai ga dubban mata da bayanai masu amfani waɗanda suka taimaka wajen inganta lafiyarsu da ta
                        iyalansu.
                    </p>
                </div>
            </section>
            <section className="my-8">
                <h2 className="text-3xl font-bold mb-4">Sabbin Rubuce-rubuce</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {filteredArticles.map((article) => (
                        <ArticleCard key={article.id} article={article} />
                    ))}
                </div>
            </section>
            <section className="my-8 flex items-center justify-between">
                <h2 className="text-3xl font-bold text-center">Nemi Rubuta Labari</h2>
                <div>
                    <button
                        className="bg-blue-600 text-white text-center px-4 py-2 rounded mr-2"
                        onClick={() => setShowForm(true)}
                    >
                        Add Article
                    </button>
                    {showForm && (
                        <button
                            className="bg-gray-300 text-gray-800 px-4 py-2 rounded"
                            onClick={() => setShowForm(false)}
                        >
                            Close
                        </button>
                    )}
                </div>
            </section>
            {showForm && (
                <section className="my-8">
                    <form onSubmit={handleSubmitRequest} className="bg-white p-6 rounded shadow-md">
                        <input
                            type="text"
                            placeholder="Title"
                            value={form.title}
                            onChange={(e) => setForm({...form, title: e.target.value})}
                            required
                            className="block mb-4 p-2 border w-full rounded"
                        />
                        <textarea
                            placeholder="Excerpt"
                            value={form.excerpt}
                            onChange={(e) => setForm({...form, excerpt: e.target.value})}
                            required
                            className="block mb-4 p-2 border w-full rounded"
                        />
                        <div className="mb-4">
                            <label className="block mb-2">Content (Markdown supported: bold, italic, etc.)</label>
                            <SimpleMDE
                                value={form.content}
                                onChange={(value) => setForm({...form, content: value})}
                                options={{
                                    autofocus: true,
                                    spellChecker: false,
                                    toolbar: [
                                        "bold",
                                        "italic",
                                        "heading",
                                        "|",
                                        "quote",
                                        "unordered-list",
                                        "ordered-list",
                                        "|",
                                        "link",
                                        "image",
                                        "|",
                                        "preview",
                                        "side-by-side",
                                        "fullscreen",
                                        "|",
                                        "guide",
                                    ],
                                }}
                            />
                        </div>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => setForm({...form, image: e.target.files[0]})}
                            className="block mb-4"
                        />
                        <input
                            type="email"
                            placeholder="Submitter Email"
                            value={form.email}
                            onChange={(e) => setForm({...form, email: e.target.value})}
                            required
                            className="block mb-4 p-2 border w-full rounded"
                        />
                        <div className="flex items-center">
                            <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded mr-3">
                                Submit Request
                            </button>
                            <button
                                type="button"
                                className="bg-gray-200 px-4 py-2 rounded"
                                onClick={() => setShowForm(false)}
                            >
                                Close
                            </button>
                        </div>
                    </form>
                </section>
            )}
        </div>
    );
};

export default Home;
