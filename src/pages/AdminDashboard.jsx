import {useState, useEffect} from "react";
import {getRequests, approveRequest, deleteRequest, addArticle, uploadImage} from "../services/supabase";
import SimpleMDE from "react-simplemde-editor";
import "easymde/dist/easymde.min.css";

const AdminDashboard = () => {
    const [requests, setRequests] = useState([]);
    const [form, setForm] = useState({title: "", excerpt: "", content: "", image: null});
    const [showAddForm, setShowAddForm] = useState(false);

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

    const handleAddArticle = async (e) => {
        e.preventDefault();
        try {
            let imagePath = "";
            if (form.image) {
                imagePath = await uploadImage(form.image);
            }
            await addArticle({
                title: form.title,
                slug: form.title.toLowerCase().replace(/\s+/g, "-"),
                excerpt: form.excerpt,
                content: form.content,
                image_path: imagePath,
                author: "Admin", // Replace with actual admin user if available
            });
            alert("Article added!");
            setForm({title: "", excerpt: "", content: "", image: null});
            setShowAddForm(false);
        } catch (err) {
            console.error("Failed to add article:", err);
            alert("Error adding article. Please try again.");
        }
    };

    return (
        <div>
            <div className="flex items-center justify-between my-4">
                <h1 className="text-2xl font-bold">Admin Dashboard</h1>
                <div>
                    <button
                        className="bg-blue-600 text-white px-4 py-2 rounded mr-2"
                        onClick={() => setShowAddForm(true)}
                    >
                        Add Article
                    </button>
                    {showAddForm && (
                        <button
                            className="bg-gray-300 text-gray-800 px-4 py-2 rounded"
                            onClick={() => setShowAddForm(false)}
                        >
                            Close
                        </button>
                    )}
                </div>
            </div>

            {showAddForm && (
                <section className="bg-white p-6 rounded shadow-md mb-6">
                    <h2 className="text-2xl font-bold mb-4">Add New Article</h2>
                    <form onSubmit={handleAddArticle} className="bg-white p-6 rounded shadow-md">
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
                            <label className="block mb-2">Content (Markdown supported)</label>
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
                        <div className="flex justify-end">
                            <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded mr-2">
                                Save
                            </button>
                            <button className="bg-gray-200 px-4 py-2 rounded" onClick={() => setShowAddForm(false)}>
                                Close
                            </button>
                        </div>
                    </form>
                </section>
            )}

            <section>
                <h2 className="text-2xl font-bold mb-4">Pending Requests</h2>
                <div className="grid gap-4">
                    {requests.length > 0 ? (
                        requests.map((request) => (
                            <div key={request.id} className="bg-white p-4 rounded shadow-md">
                                <h3 className="text-xl font-semibold">{request.title}</h3>
                                <p>{request.excerpt || "No excerpt available"}</p>
                                <button
                                    onClick={() => handleApprove(request)}
                                    className="bg-green-600 text-white px-4 py-2 rounded mr-2"
                                >
                                    Approve
                                </button>
                                <button
                                    onClick={() => handleDelete(request.id)}
                                    className="bg-red-600 text-white px-4 py-2 rounded"
                                >
                                    Delete
                                </button>
                            </div>
                        ))
                    ) : (
                        <p className="text-center">No pending requests.</p>
                    )}
                </div>
            </section>
        </div>
    );
};

export default AdminDashboard;
