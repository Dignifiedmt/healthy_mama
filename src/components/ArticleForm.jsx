import {useState, useEffect, useRef} from "react";
import SimpleMDE from "react-simplemde-editor";
import "easymde/dist/easymde.min.css";

const ArticleForm = ({onSubmit, onCancel, initialData = null, submitButtonText = "Save"}) => {
    const [form, setForm] = useState({
        title: "",
        excerpt: "",
        content: "",
        image: null,
    });

    // added refs
    const editorRef = useRef(null);
    const titleRef = useRef(null);

    useEffect(() => {
        if (initialData) {
            setForm({
                title: initialData.title || "",
                excerpt: initialData.excerpt || "",
                content: initialData.content || "",
                image: null,
            });
        }
    }, [initialData]);

    useEffect(() => {
        if (!initialData) {
            
            const t = setTimeout(() => {
                try {
                    if (editorRef.current && editorRef.current.codemirror) {
                        editorRef.current.codemirror.refresh(); // ensure layout is correct
                        editorRef.current.codemirror.focus();
                    } else if (titleRef.current) {
                        titleRef.current.focus();
                    }
                } catch (err) {
                    // ignore focus errors
                }
            }, 120);
            return () => clearTimeout(t);
        }
    }, [initialData]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        await onSubmit(form);
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md">
            <input
                ref={titleRef} // keep a ref to title if fallback focus is needed
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
                    // capture the instance so we can refresh/focus it programmatically
                    getMdeInstance={(instance) => (editorRef.current = instance)}
                    options={{
                        autofocus: false, // disable automatic focus to avoid stealing from other inputs
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
                className="block mb-4 p-2 border w-full rounded"
            />
            <div className="flex justify-end space-x-2">
                <button type="submit" className="bg-green-800 text-white px-4 py-2 rounded hover:bg-green-800">
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
