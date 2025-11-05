import {useState, useEffect} from "react";
import {getRequests, approveRequest, deleteRequest, addArticle, uploadImage, updateArticle} from "../services/supabase";
import ArticleForm from "../components/ArticleForm";

const AdminDashboard = () => {
    const [requests, setRequests] = useState([]);
    const [showAddForm, setShowAddForm] = useState(false);
    const [editingArticle, setEditingArticle] = useState(null);

    useEffect(() => {
        async function fetchRequests() {
            try {
                const data = await getRequests();
                setRequests(data || []);
            } catch (err) {
                console.error("Failed to fetch requests:", err);
                alert("Error loading requests. Please try again.");
                setRequests([]);
            }
        }
        fetchRequests();
    }, []);

    const handleApprove = async (request) => {
        try {
            await approveRequest(request.id);
            setRequests(requests.filter((r) => r.id !== request.id));
            alert("Request approved!");
        } catch (err) {
            console.error("Failed to approve request:", err);
            alert("Error approving request.");
        }
    };

    const handleDelete = async (id) => {
        try {
            await deleteRequest(id);
            setRequests(requests.filter((r) => r.id !== id));
            alert("Request deleted!");
        } catch (err) {
            console.error("Failed to delete request:", err);
            alert("Error deleting request.");
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
                author: "Admin",
            });
            alert("Article added!");
            setShowAddForm(false);
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
            });
            alert("Article updated!");
            setEditingArticle(null);
        } catch (err) {
            console.error("Failed to update article:", err);
            alert("Error updating article. Please try again.");
        }
    };

    return (
        <div>
            <div className="flex items-center justify-between my-4">
                <h1 className="text-2xl font-bold">Admin Dashboard</h1>
                <div>
                    <button
                        className="bg-blue-800 text-white px-4 py-2 rounded hover:bg-blue-800"
                        onClick={() => setShowAddForm(true)}
                    >
                        Add Article
                    </button>
                </div>
            </div>

            {showAddForm && (
                <section className="bg-white p-6 rounded shadow-md mb-6">
                    <h2 className="text-2xl font-bold mb-4">Add New Article</h2>
                    <ArticleForm
                        onSubmit={handleAddArticle}
                        onCancel={() => setShowAddForm(false)}
                        submitButtonText="Save Article"
                    />
                </section>
            )}

            {editingArticle && (
                <section className="bg-white p-6 rounded shadow-md mb-6">
                    <h2 className="text-2xl font-bold mb-4">Edit Article</h2>
                    <ArticleForm
                        onSubmit={handleEditArticle}
                        onCancel={() => setEditingArticle(null)}
                        initialData={editingArticle}
                        submitButtonText="Update Article"
                    />
                </section>
            )}

            <section>
                <h2 className="text-2xl font-bold mb-4">Pending Requests</h2>
                <div className="grid gap-4">
                    {requests.length > 0 ? (
                        requests.map((request) => (
                            <div key={request.id} className="bg-white p-4 rounded shadow-md">
                                <h3 className="text-xl font-semibold">{request.title}</h3>
                                <p className="text-gray-800 mb-2">{request.excerpt || "No excerpt available"}</p>
                                <p className="text-sm text-gray-500">Submitted by: {request.submitter_email}</p>
                                <div className="mt-3 flex space-x-2">
                                    <button
                                        onClick={() => handleApprove(request)}
                                        className="bg-green-800 text-white px-4 py-2 rounded hover:bg-green-800"
                                    >
                                        Approve
                                    </button>
                                    <button
                                        onClick={() => handleDelete(request.id)}
                                        className="bg-red-800 text-white px-4 py-2 rounded hover:bg-red-800"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-center text-gray-500">No pending requests.</p>
                    )}
                </div>
            </section>
        </div>
    );
};

export default AdminDashboard;
