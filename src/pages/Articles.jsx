import {useState, useEffect} from "react";
import {getArticles, deleteArticle, updateArticle, uploadImage} from "../services/supabase";
import ArticleCard from "../components/ArticleCard";
import SearchBar from "../components/SearchBar";
import ArticleForm from "../components/ArticleForm";
import {useAuth} from "../contexts/AuthContext";

const Articles = () => {
    const [articles, setArticles] = useState([]);
    const [search, setSearch] = useState("");
    const [editingArticle, setEditingArticle] = useState(null);
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
        if (window.confirm("Are you sure you want to delete this article?")) {
            try {
                await deleteArticle(id);
                setArticles((prev = []) => prev.filter((a) => a.id !== id));
            } catch (err) {
                console.error("Failed to delete article:", err);
                alert("Error deleting article.");
            }
        }
    };

    const handleEdit = async (formData) => {
        try {
            let imagePath = editingArticle.image_path;
            if (formData.image) {
                imagePath = await uploadImage(formData.image);
            }
            await updateArticle(editingArticle.id, {
                title: formData.title,
                slug: formData.title.toLowerCase().replace(/\s+/g, "-"),
                excerpt: formData.excerpt,
                content: formData.content,
                image_path: imagePath,
                author: formData.author || editingArticle.author,
            });
            alert("Article updated!");

            // Refresh articles
            const data = await getArticles();
            setArticles(data || []);
            setEditingArticle(null);
        } catch (err) {
            console.error("Failed to update article:", err);
            alert("Error updating article. Please try again.");
        }
    };

    const filteredArticles = (articles || []).filter((a) =>
        (a.title || "").toLowerCase().includes((search || "").toLowerCase())
    );

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
                <div>
                    <h1 className="text-4xl font-bold text-gray-800 mb-2">Labarai</h1>
                    <p className="text-gray-600">Discover insightful articles on health and wellness</p>
                </div>
                <div className="mt-4 md:mt-0 w-full md:w-auto">
                    <SearchBar value={search} onChange={(e) => setSearch(e.target.value)} />
                </div>
            </div>

            {editingArticle && (
                <section className="my-8 bg-white p-6 rounded-lg shadow-lg border border-gray-200">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-gray-800">Edit Article</h2>
                        <button
                            onClick={() => setEditingArticle(null)}
                            className="text-gray-500 hover:text-gray-700 text-lg"
                        >
                            ✕
                        </button>
                    </div>
                    <ArticleForm
                        onSubmit={handleEdit}
                        onCancel={() => setEditingArticle(null)}
                        initialData={editingArticle}
                        submitButtonText="Update Article"
                    />
                </section>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
                {filteredArticles.length > 0 ? (
                    filteredArticles.map((article) => (
                        <ArticleCard
                            key={article.id}
                            article={article}
                            onEdit={isAdmin ? () => setEditingArticle(article) : undefined}
                            onDelete={isAdmin ? () => handleDelete(article.id) : undefined}
                        />
                    ))
                ) : (
                    <div className="col-span-3 text-center py-12">
                        <div className="text-gray-400 text-6xl mb-4">📝</div>
                        <p className="text-gray-500 text-lg mb-2">No articles found</p>
                        <p className="text-gray-400">
                            Try a different search term or check back later for new content.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Articles;
