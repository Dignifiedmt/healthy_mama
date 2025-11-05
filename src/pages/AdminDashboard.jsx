import {useState, useEffect} from "react";
import {
    getRequests,
    approveRequest,
    deleteRequest,
    addArticle,
    uploadImage,
    updateArticle,
    getArticles,
    deleteArticle,
} from "../services/supabase";
import ArticleForm from "../components/ArticleForm";
import ArticleCard from "../components/ArticleCard";

const AdminDashboard = () => {
    const [requests, setRequests] = useState([]);
    const [articles, setArticles] = useState([]);
    const [showAddForm, setShowAddForm] = useState(false);
    const [editingArticle, setEditingArticle] = useState(null);
    const [activeTab, setActiveTab] = useState("requests");

    useEffect(() => {
        fetchData();
    }, []);

    async function fetchData() {
        try {
            const [requestsData, articlesData] = await Promise.all([getRequests(), getArticles()]);
            setRequests(requestsData || []);
            setArticles(articlesData || []);
        } catch (err) {
            console.error("Failed to fetch data:", err);
            alert("Error loading data. Please try again.");
        }
    }

    const handleApprove = async (request) => {
        try {
            let imagePath = request.image_path;
            if (request.image_file) {
                imagePath = await uploadImage(request.image_file);
            }

            await addArticle({
                title: request.title,
                slug: request.title.toLowerCase().replace(/\s+/g, "-"),
                excerpt: request.excerpt,
                content: request.content,
                image_path: imagePath,
                author: request.author || request.submitter_email || "Unknown Author",
            });

            await deleteRequest(request.id);
            setRequests((prev) => prev.filter((r) => r.id !== request.id));
            await fetchData(); // Refresh articles list
            alert("Request approved and article created!");
        } catch (err) {
            console.error("Failed to approve request:", err);
            alert("Error approving request.");
        }
    };

    const handleDeleteRequest = async (id) => {
        if (window.confirm("Are you sure you want to delete this request?")) {
            try {
                await deleteRequest(id);
                setRequests((prev) => prev.filter((r) => r.id !== id));
                alert("Request deleted!");
            } catch (err) {
                console.error("Failed to delete request:", err);
                alert("Error deleting request.");
            }
        }
    };

    const handleDeleteArticle = async (id) => {
        if (window.confirm("Are you sure you want to delete this article?")) {
            try {
                await deleteArticle(id);
                setArticles((prev) => prev.filter((a) => a.id !== id));
                alert("Article deleted!");
            } catch (err) {
                console.error("Failed to delete article:", err);
                alert("Error deleting article.");
            }
        }
    };

    const handleAddArticle = async (formData) => {
        try {
            let imagePath = "";
            if (formData.image) {
                imagePath = await uploadImage(formData.image);
            }
            await addArticle({
                title: formData.title,
                slug: formData.title.toLowerCase().replace(/\s+/g, "-"),
                excerpt: formData.excerpt,
                content: formData.content,
                image_path: imagePath,
                author: formData.author || "Admin",
            });
            alert("Article added successfully!");
            setShowAddForm(false);
            await fetchData(); // Refresh articles list
        } catch (err) {
            console.error("Failed to add article:", err);
            alert("Error adding article. Please try again.");
        }
    };

    const handleEditArticle = async (formData) => {
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
            alert("Article updated successfully!");
            setEditingArticle(null);
            await fetchData(); // Refresh articles list
        } catch (err) {
            console.error("Failed to update article:", err);
            alert("Error updating article. Please try again.");
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">Admin Dashboard</h1>
                    <p className="text-gray-600">Manage articles and review submission requests</p>
                </div>
                <div className="flex space-x-3 mt-4 lg:mt-0">
                    <button
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition duration-200 font-medium"
                        onClick={() => setShowAddForm(true)}
                    >
                        + Add New Article
                    </button>
                </div>
            </div>

            {/* Tab Navigation */}
            <div className="mb-6 border-b border-gray-200">
                <nav className="flex space-x-8">
                    <button
                        onClick={() => setActiveTab("requests")}
                        className={`py-4 px-1 border-b-2 font-medium text-sm ${
                            activeTab === "requests"
                                ? "border-blue-500 text-blue-600"
                                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                        }`}
                    >
                        Pending Requests
                        {requests.length > 0 && (
                            <span className="ml-2 bg-red-100 text-red-600 py-1 px-2 rounded-full text-xs">
                                {requests.length}
                            </span>
                        )}
                    </button>
                    <button
                        onClick={() => setActiveTab("articles")}
                        className={`py-4 px-1 border-b-2 font-medium text-sm ${
                            activeTab === "articles"
                                ? "border-blue-500 text-blue-600"
                                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                        }`}
                    >
                        Published Articles
                        <span className="ml-2 bg-gray-100 text-gray-600 py-1 px-2 rounded-full text-xs">
                            {articles.length}
                        </span>
                    </button>
                </nav>
            </div>

            {/* Add Article Form */}
            {showAddForm && (
                <section className="bg-white p-6 rounded-lg shadow-lg border border-gray-200 mb-8">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-gray-800">Add New Article</h2>
                        <button
                            onClick={() => setShowAddForm(false)}
                            className="text-gray-500 hover:text-gray-700 text-lg"
                        >
                            ✕
                        </button>
                    </div>
                    <ArticleForm
                        onSubmit={handleAddArticle}
                        onCancel={() => setShowAddForm(false)}
                        submitButtonText="Publish Article"
                    />
                </section>
            )}

            {/* Edit Article Form */}
            {editingArticle && (
                <section className="bg-white p-6 rounded-lg shadow-lg border border-gray-200 mb-8">
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
                        onSubmit={handleEditArticle}
                        onCancel={() => setEditingArticle(null)}
                        initialData={editingArticle}
                        submitButtonText="Update Article"
                    />
                </section>
            )}

            {/* Requests Tab */}
            {activeTab === "requests" && (
                <section>
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-gray-800">Pending Requests</h2>
                        <span className="text-sm text-gray-500">
                            {requests.length} request{requests.length !== 1 ? "s" : ""} pending review
                        </span>
                    </div>

                    <div className="grid gap-6">
                        {requests.length > 0 ? (
                            requests.map((request) => (
                                <div
                                    key={request.id}
                                    className="bg-white p-6 rounded-lg shadow-md border border-gray-200"
                                >
                                    <h3 className="text-xl font-semibold text-gray-800 mb-2">{request.title}</h3>
                                    <p className="text-gray-600 mb-3 line-clamp-2">
                                        {request.excerpt || "No excerpt available"}
                                    </p>
                                    <div className="text-sm text-gray-500 mb-4">
                                        <p>
                                            <strong>Submitted by:</strong> {request.submitter_email}
                                        </p>
                                        {request.author && (
                                            <p>
                                                <strong>Author name:</strong> {request.author}
                                            </p>
                                        )}
                                        <p>
                                            <strong>Submitted:</strong>{" "}
                                            {new Date(request.created_at).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <div className="flex space-x-3">
                                        <button
                                            onClick={() => handleApprove(request)}
                                            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition duration-200 font-medium"
                                        >
                                            Approve & Publish
                                        </button>
                                        <button
                                            onClick={() => handleDeleteRequest(request.id)}
                                            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition duration-200 font-medium"
                                        >
                                            Delete Request
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-12 bg-white rounded-lg shadow-md border border-gray-200">
                                <div className="text-gray-400 text-6xl mb-4">✅</div>
                                <p className="text-gray-500 text-lg mb-2">No pending requests</p>
                                <p className="text-gray-400">All submission requests have been reviewed.</p>
                            </div>
                        )}
                    </div>
                </section>
            )}

            {/* Articles Tab */}
            {activeTab === "articles" && (
                <section>
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-gray-800">Published Articles</h2>
                        <span className="text-sm text-gray-500">
                            {articles.length} article{articles.length !== 1 ? "s" : ""} published
                        </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {articles.length > 0 ? (
                            articles.map((article) => (
                                <ArticleCard
                                    key={article.id}
                                    article={article}
                                    onEdit={() => setEditingArticle(article)}
                                    onDelete={() => handleDeleteArticle(article.id)}
                                />
                            ))
                        ) : (
                            <div className="col-span-3 text-center py-12 bg-white rounded-lg shadow-md border border-gray-200">
                                <div className="text-gray-400 text-6xl mb-4">📝</div>
                                <p className="text-gray-500 text-lg mb-2">No articles published yet</p>
                                <p className="text-gray-400">
                                    Start by adding your first article or approving pending requests.
                                </p>
                            </div>
                        )}
                    </div>
                </section>
            )}
        </div>
    );
};

export default AdminDashboard;
