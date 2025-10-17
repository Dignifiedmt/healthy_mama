import {useState, useEffect} from "react";
import {getArticles, submitRequest, uploadImage} from "../services/supabase";
import ArticleCard from "../components/ArticleCard";
import SearchBar from "../components/SearchBar";
import ArticleForm from "../components/ArticleForm";
import {Target, Eye, Heart} from "lucide-react";
import hero1 from "../assets/hero1.png";
import hero2 from "../assets/hero2.png";
import hero3 from "../assets/hero3.png";
import hero4 from "../assets/hero4.png";
import hero5 from "../assets/hero5.png";

const Home = () => {
    const [articles, setArticles] = useState([]);
    const [search, setSearch] = useState("");
    const [form, setForm] = useState({title: "", excerpt: "", content: "", image: null, email: ""});
    const [currentTipIndex, setCurrentTipIndex] = useState(0);
    const [showForm, setShowForm] = useState(false);
    const [currentHeroIndex, setCurrentHeroIndex] = useState(0);

    const heroImages = [hero1, hero2, hero3, hero4, hero5];

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
            try {
                const data = await getArticles();
                setArticles(data.slice(0, 3) || []);
            } catch (err) {
                console.error("Failed to fetch articles:", err);
                alert("Error loading articles. Please try again.");
                setArticles([]);
            }
        }
        fetchData();

        const today = new Date().toISOString().slice(0, 10);
        const hash = today.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
        const startIndex = hash % tips.length;
        setCurrentTipIndex(startIndex);

        // Hero image carousel interval
        const heroInterval = setInterval(() => {
            setCurrentHeroIndex((prev) => (prev + 1) % heroImages.length);
        }, 10000);

        // Tips interval
        const tipsInterval = setInterval(() => {
            setCurrentTipIndex((prev) => (prev + 1) % tips.length);
        }, 3000);

        return () => {
            clearInterval(heroInterval);
            clearInterval(tipsInterval);
        };
    }, []);

    const handleSubmitRequest = async (formData) => {
        try {
            let imagePath = "";
            if (formData.image) {
                // uploadImage may return { publicURL } or a string path depending on service implementation
                const uploadResult = await uploadImage(formData.image);
                if (uploadResult && typeof uploadResult === "object" && uploadResult.publicURL) {
                    imagePath = uploadResult.publicURL;
                } else if (typeof uploadResult === "string") {
                    imagePath = uploadResult;
                } else {
                    // fallback - try to read nested path field if present
                    imagePath = uploadResult?.path ?? "";
                }
            }
            await submitRequest({
                title: formData.title,
                excerpt: formData.excerpt,
                content: formData.content,
                image_path: imagePath,
                status: "pending",
                submitter_email: formData.email, // FIX: use formData.email (was using outer form state)
            });
            alert("Request submitted! Awaiting admin approval.");
            setForm({title: "", excerpt: "", content: "", image: null, email: ""});
            setShowForm(false);
        } catch (err) {
            console.error("Failed to submit request:", err);
            alert(
                "Error submitting request. Please try again. If this persists, check storage/RLS configuration on the server."
            );
        }
    };

    const filteredArticles = articles.filter((a) => a.title.toLowerCase().includes(search.toLowerCase()));

    return (
        <div>
            <SearchBar value={search} onChange={(e) => setSearch(e.target.value)} />

            {/* Hero Section with Carousel */}
            <section className="my-8 text-center bg-white shadow-md rounded-lg overflow-hidden relative h-96">
                <div
                    className="absolute inset-0 bg-cover bg-center transition-opacity duration-1000"
                    style={{backgroundImage: `url(${heroImages[currentHeroIndex]})`}}
                />
                <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col justify-center items-center">
                    <h1 className="text-4xl font-bold mb-4 text-white">Lafiyar Mata Mai Juna Biyu da Yara</h1>
                    <p className="text-lg mb-4 text-white">
                        Samun ingantacciyar lafiya ga uwa da ɗanta shine babban burinmu.
                    </p>
                    <button className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">Fara Yanzu</button>
                </div>

                {/* Carousel Indicators */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                    {heroImages.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentHeroIndex(index)}
                            className={`w-3 h-3 rounded-full transition-all ${
                                index === currentHeroIndex
                                    ? "bg-white scale-125"
                                    : "bg-white bg-opacity-50 hover:bg-opacity-75"
                            }`}
                        />
                    ))}
                </div>
            </section>

            <section className="my-8 bg-blue-100 p-4 rounded">
                <h2 className="text-2xl font-bold mb-2 text-center">Shawara ta Yau</h2>
                <p className="text-center">{tips[currentTipIndex]}</p>
            </section>

            {/* Rest of the existing sections remain the same */}
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
                    {filteredArticles.length > 0 ? (
                        filteredArticles.map((article) => <ArticleCard key={article.id} article={article} />)
                    ) : (
                        <p className="text-center">No recent articles available.</p>
                    )}
                </div>
            </section>

            <section className="my-8 flex items-center justify-between">
                <h2 className="text-3xl font-bold">Nemi Rubuta Labari</h2>
                <div>
                    <button
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                        onClick={() => setShowForm(true)}
                    >
                        Add Article
                    </button>
                </div>
            </section>

            {showForm && (
                <section className="my-8">
                    <ArticleForm
                        onSubmit={handleSubmitRequest}
                        onCancel={() => setShowForm(false)}
                        submitButtonText="Submit Request"
                    />
                </section>
            )}
        </div>
    );
};

export default Home;
