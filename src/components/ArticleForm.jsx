import {useState, useEffect, useRef} from "react";
import SimpleMDE from "react-simplemde-editor";
import "easymde/dist/easymde.min.css";

const ArticleForm = ({onSubmit, onCancel, initialData = null, submitButtonText = "Save"}) => {
    const [form, setForm] = useState({
        title: "",
        excerpt: "",
        content: "",
        image: null,
        author: "",
        submitter_email: "",
    });

    const [isEditorReady, setIsEditorReady] = useState(false);

    // refs for auto-focus
    const editorRef = useRef(null);
    const titleRef = useRef(null);
    const hasFocused = useRef(false);

    useEffect(() => {
        if (initialData) {
            setForm({
                title: initialData.title || "",
                excerpt: initialData.excerpt || "",
                content: initialData.content || "",
                image: null,
                author: initialData.author || "",
                submitter_email: initialData.submitter_email || "",
            });
        }
    }, [initialData]);

    // Handle editor instance when it's ready
    const handleEditorInstance = (instance) => {
        editorRef.current = instance;
        setIsEditorReady(true);
    };

    // Auto-focus logic
    useEffect(() => {
        if (!initialData && !hasFocused.current) {
            const focusEditor = () => {
                try {
                    if (editorRef.current && editorRef.current.codemirror) {
                        const cm = editorRef.current.codemirror;
                        // Refresh and focus the editor
                        cm.refresh();
                        cm.focus();
                        // Set cursor to beginning
                        cm.setCursor(0, 0);
                        hasFocused.current = true;
                        console.log("Editor focused successfully");
                    }
                } catch (error) {
                    console.warn("Could not focus editor:", error);
                }
            };

            if (isEditorReady) {
                // Small delay to ensure editor is fully rendered
                const timer = setTimeout(focusEditor, 100);
                return () => clearTimeout(timer);
            } else {
                // If editor takes too long to load, fallback to title
                const fallbackTimer = setTimeout(() => {
                    if (!hasFocused.current && titleRef.current) {
                        titleRef.current.focus();
                        hasFocused.current = true;
                        console.log("Fell back to title focus");
                    }
                }, 1000);

                return () => clearTimeout(fallbackTimer);
            }
        }
    }, [isEditorReady, initialData]);

    // Reset focus flag when component unmounts or form is submitted
    useEffect(() => {
        return () => {
            hasFocused.current = false;
        };
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        hasFocused.current = false; // Reset for next time
        await onSubmit(form);
    };

    const handleFormChange = (field, value) => {
        setForm((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md">
            {/* Author Information Section */}
            <div className="mb-6 p-4 border border-gray-200 rounded-lg bg-gray-50">
                <h3 className="text-lg font-semibold mb-3 text-gray-700">Writer Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">Author Name *</label>
                        <input
                            type="text"
                            placeholder="Enter author name"
                            value={form.author}
                            onChange={(e) => handleFormChange("author", e.target.value)}
                            required
                            className="block w-full p-2 border border-gray-300 rounded focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">Email Address *</label>
                        <input
                            type="email"
                            placeholder="Enter email address"
                            value={form.submitter_email}
                            onChange={(e) => handleFormChange("submitter_email", e.target.value)}
                            required
                            className="block w-full p-2 border border-gray-300 rounded focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                        />
                    </div>
                </div>
            </div>

            {/* Article Content Section */}
            <input
                ref={titleRef}
                type="text"
                placeholder="Article Title"
                value={form.title}
                onChange={(e) => handleFormChange("title", e.target.value)}
                required
                className="block mb-4 p-2 border border-gray-300 w-full rounded focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
            />

            <textarea
                placeholder="Article Excerpt"
                value={form.excerpt}
                onChange={(e) => handleFormChange("excerpt", e.target.value)}
                required
                className="block mb-4 p-2 border border-gray-300 w-full rounded focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 h-20"
            />

            <div className="mb-4">
                <label className="block mb-2 font-medium text-gray-700">Content (Markdown supported)</label>
                <SimpleMDE
                    value={form.content}
                    onChange={(value) => handleFormChange("content", value)}
                    getMdeInstance={handleEditorInstance}
                    options={{
                        autofocus: false, // Important: disable built-in auto-focus
                        spellChecker: false,
                        minHeight: "300px",
                        placeholder: "Write your article content here...",
                        autoDownloadFontAwesome: false,
                        status: false,
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

            <div className="mb-6">
                <label className="block mb-2 font-medium text-gray-700">Featured Image</label>
                <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFormChange("image", e.target.files[0])}
                    className="block w-full p-2 border border-gray-300 rounded file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
            </div>

            <div className="flex justify-end space-x-2">
                <button
                    type="submit"
                    className="bg-green-800 text-white px-4 py-2 rounded hover:bg-green-700 transition duration-200"
                >
                    {submitButtonText}
                </button>
                <button
                    type="button"
                    className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400 transition duration-200"
                    onClick={onCancel}
                >
                    Cancel
                </button>
            </div>
        </form>
    );
};

export default ArticleForm;
