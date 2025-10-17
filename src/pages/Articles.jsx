// import {useState, useEffect} from "react";
// import {getArticles, deleteArticle} from "../services/supabase";
// import ArticleCard from "../components/ArticleCard";
// import SearchBar from "../components/SearchBar";
// import {useAuth} from "../contexts/AuthContext";

// const Articles = () => {
//     const [articles, setArticles] = useState([]);
//     const [search, setSearch] = useState("");
//     const {isAdmin} = useAuth();

//     useEffect(() => {
//         async function fetchData() {
//             try {
//                 const data = await getArticles();
//                 setArticles(data || []);
//             } catch (err) {
//                 console.error("Failed to fetch articles:", err);
//                 alert("Error loading articles. Please try again.");
//                 setArticles([]);
//             }
//         }
//         fetchData();
//     }, []);

//     const handleDelete = async (id) => {
//         if (window.confirm("Delete?")) {
//             try {
//                 await deleteArticle(id);
//                 setArticles((prev = []) => prev.filter((a) => a.id !== id));
//             } catch (err) {
//                 console.error("Failed to delete article:", err);
//                 alert("Error deleting article.");
//             }
//         }
//     };

//     const filteredArticles = (articles || []).filter((a) =>
//         (a.title || "").toLowerCase().includes((search || "").toLowerCase())
//     );

//     return (
//         <div>
//             <h1 className="text-3xl font-bold mb-4">Labarai</h1>
//             <SearchBar value={search} onChange={(e) => setSearch(e.target.value)} />
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
//                 {filteredArticles.length > 0 ? (
//                     filteredArticles.map((article) => (
//                         <ArticleCard
//                             key={article.id}
//                             article={article}
//                             onEdit={isAdmin ? () => alert("Edit form TODO") : undefined}
//                             onDelete={isAdmin ? () => handleDelete(article.id) : undefined}
//                         />
//                     ))
//                 ) : (
//                     <p className="text-center">No articles found. Try a different search or check back later.</p>
//                 )}
//             </div>
//         </div>
//     );
// };

// export default Articles;

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
        <div>
            <h1 className="text-3xl font-bold mb-4">Labarai</h1>
            <SearchBar value={search} onChange={(e) => setSearch(e.target.value)} />

            {editingArticle && (
                <section className="my-6 bg-white p-6 rounded shadow-md">
                    <h2 className="text-2xl font-bold mb-4">Edit Article</h2>
                    <ArticleForm
                        onSubmit={handleEdit}
                        onCancel={() => setEditingArticle(null)}
                        initialData={editingArticle}
                        submitButtonText="Update Article"
                    />
                </section>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
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
                    <p className="text-center col-span-3 text-gray-500">
                        No articles found. Try a different search or check back later.
                    </p>
                )}
            </div>
        </div>
    );
};

export default Articles;
