import {useState, useEffect} from "react";
import SimpleMDE from "react-simplemde-editor";
import "easymde/dist/easymde.min.css";

const ArticleForm = ({onSubmit, onCancel, initialData = null, submitButtonText = "Save"}) => {
    const [form, setForm] = useState({
        title: "",
        excerpt: "",
        content: "",
        image: null
    });

    useEffect(() => {
        if (initialData) {
            setForm({
                title: initialData.title || "",
                excerpt: initialData.excerpt || "",
                content: initialData.content || "",
                image: null
            });
        }
    }, [initialData]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        await onSubmit(form);
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md">
            <input
                type="text"
                placeholder="Title"
                value={form.title}
                onChange={(e) => setForm({...form, title: e.target.value})}
                required
                className="block mb-4 p-2 border w-full rounded focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
            <textarea
                placeholder="Excerpt"
                value={form.excerpt}
                onChange={(e) => setForm({...form, excerpt: e.target.value})}
                required
                className="block mb-4 p-2 border w-full rounded focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 h-20"
            />
            <div className="mb-4">
                <label className="block mb-2">Content (Markdown supported)</label>
                <SimpleMDE
                    value={form.content}
                    onChange={(value) => setForm({...form, content: value})}
                    options={{
                        autofocus: false, // Fixed focus issue
                        spellChecker: false,
                        toolbar: [
                            "bold", "italic", "heading", "|",
                            "quote", "unordered-list", "ordered-list", "|",
                            "link", "image", "|",
                            "preview", "side-by-side", "fullscreen", "|",
                            "guide"
                        ],
                    }}
                />
            </div>
            <input
                type="file"
                accept="image/*"
                onChange={(e) => setForm({...form, image: e.target.files[0]})}
                className="block mb-4 p-2 border w-full rounded"
            />
            <div className="flex justify-end space-x-2">
                <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
                    {submitButtonText}
                </button>
                <button 
                    type="button" 
                    className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
                    onClick={onCancel}
                >
                    Cancel
                </button>
            </div>
        </form>
    );
};

export default ArticleForm;