import {useState, useEffect} from "react";
import {getArticles, deleteArticle} from "../services/supabase";
import ArticleCard from "../components/ArticleCard";
import SearchBar from "../components/SearchBar";
import {useAuth} from "../contexts/AuthContext";

const Articles = () => {
    const [articles, setArticles] = useState([]);
    const [search, setSearch] = useState("");
    const {isAdmin} = useAuth();

    useEffect(() => {
        async function fetchData() {
            try {
                const data = await getArticles();
                setArticles(data || []);
            } catch (err) {
                console.error("Failed to fetch articles:", err);
                alert("Error loading articles. Please try again.");
                setArticles([]);
            }
        }
        fetchData();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm("Delete?")) {
            try {
                await deleteArticle(id);
                setArticles((prev = []) => prev.filter((a) => a.id !== id));
            } catch (err) {
                console.error("Failed to delete article:", err);
                alert("Error deleting article.");
            }
        }
    };

    const filteredArticles = (articles || []).filter((a) =>
        (a.title || "").toLowerCase().includes((search || "").toLowerCase())
    );

    return (
        <div>
            <h1 className="text-3xl font-bold mb-4">Labarai</h1>
            <SearchBar value={search} onChange={(e) => setSearch(e.target.value)} />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
                {filteredArticles.length > 0 ? (
                    filteredArticles.map((article) => (
                        <ArticleCard
                            key={article.id}
                            article={article}
                            onEdit={isAdmin ? () => alert("Edit form TODO") : undefined}
                            onDelete={isAdmin ? () => handleDelete(article.id) : undefined}
                        />
                    ))
                ) : (
                    <p className="text-center">No articles found. Try a different search or check back later.</p>
                )}
            </div>
        </div>
    );
};

export default Articles;
