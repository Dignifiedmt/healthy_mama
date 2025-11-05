import {useState, useEffect} from "react";
import {useParams, Link} from "react-router-dom";
import {getArticleBySlug} from "../services/supabase";
import ReactMarkdown from "react-markdown";

const ArticleDetail = () => {
    const {slug} = useParams();
    const [article, setArticle] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            try {
                setLoading(true);
                const data = await getArticleBySlug(slug);
                if (data) {
                    setArticle(data);
                    setError(null);
                } else {
                    setError("Article not found.");
                }
            } catch (err) {
                console.error(`Failed to fetch article (${slug}):`, err);
                setError("Error loading article. Please try again.");
                setArticle(null);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, [slug]);

    if (loading) {
        return (
            <div className="max-w-4xl mx-auto px-4 py-8">
                <div className="animate-pulse">
                    <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
                    <div className="h-64 bg-gray-200 rounded mb-6"></div>
                    <div className="space-y-3">
                        <div className="h-4 bg-gray-200 rounded"></div>
                        <div className="h-4 bg-gray-200 rounded"></div>
                        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-4xl mx-auto px-4 py-8">
                <div className="text-center">
                    <div className="text-6xl mb-4">📄</div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Article Not Found</h2>
                    <p className="text-red-600 mb-4">{error}</p>
                    <Link
                        to="/articles"
                        className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
                    >
                        ← Back to Articles
                    </Link>
                </div>
            </div>
        );
    }

    if (!article) {
        return (
            <div className="max-w-4xl mx-auto px-4 py-8 text-center">
                <p className="text-gray-500">No article data available.</p>
                <Link
                    to="/articles"
                    className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium mt-4"
                >
                    ← Back to Articles
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            {/* Breadcrumb */}
            <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-6">
                <Link to="/" className="hover:text-blue-600">
                    Home
                </Link>
                <span>→</span>
                <Link to="/articles" className="hover:text-blue-600">
                    Articles
                </Link>
                <span>→</span>
                <span className="text-gray-800 truncate">{article.title}</span>
            </nav>

            {/* Article Header */}
            <header className="mb-8">
                <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4 leading-tight">{article.title}</h1>

                {/* Article Meta Information */}
                <div className="flex flex-wrap items-center gap-4 text-gray-600 mb-6">
                    <div className="flex items-center space-x-2">
                        <span className="font-medium">By:</span>
                        <span className="text-gray-800">{article.author || "Unknown Author"}</span>
                    </div>

                    {article.submitter_email && (
                        <div className="flex items-center space-x-2">
                            <span className="font-medium">Email:</span>
                            <a
                                href={`mailto:${article.submitter_email}`}
                                className="text-blue-600 hover:text-blue-800 hover:underline"
                            >
                                {article.submitter_email}
                            </a>
                        </div>
                    )}

                    <div className="flex items-center space-x-2">
                        <span>•</span>
                        <time dateTime={article.created_at}>
                            {article.created_at
                                ? new Date(article.created_at).toLocaleDateString("en-US", {
                                      year: "numeric",
                                      month: "long",
                                      day: "numeric",
                                  })
                                : "Unknown date"}
                        </time>
                    </div>
                </div>

                {/* Excerpt */}
                {article.excerpt && (
                    <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
                        <p className="text-lg text-gray-700 italic">{article.excerpt}</p>
                    </div>
                )}
            </header>

            {/* Featured Image */}
            {article.image_path && (
                <div className="mb-8">
                    <img
                        src={article.image_path}
                        alt={article.title}
                        className="w-full h-auto max-h-96 object-cover rounded-lg shadow-md"
                    />
                    {article.image_caption && (
                        <p className="text-center text-gray-500 text-sm mt-2">{article.image_caption}</p>
                    )}
                </div>
            )}

            {/* Article Content */}
            <article className="prose prose-lg max-w-none">
                <ReactMarkdown
                    components={{
                        h1: ({node, ...props}) => (
                            <h1 className="text-3xl font-bold mt-8 mb-4 text-gray-900" {...props} />
                        ),
                        h2: ({node, ...props}) => (
                            <h2 className="text-2xl font-bold mt-6 mb-3 text-gray-800" {...props} />
                        ),
                        h3: ({node, ...props}) => (
                            <h3 className="text-xl font-bold mt-5 mb-2 text-gray-800" {...props} />
                        ),
                        p: ({node, ...props}) => <p className="mb-4 text-gray-700 leading-relaxed" {...props} />,
                        ul: ({node, ...props}) => <ul className="mb-4 list-disc list-inside space-y-1" {...props} />,
                        ol: ({node, ...props}) => <ol className="mb-4 list-decimal list-inside space-y-1" {...props} />,
                        li: ({node, ...props}) => <li className="text-gray-700" {...props} />,
                        blockquote: ({node, ...props}) => (
                            <blockquote
                                className="border-l-4 border-blue-500 pl-4 italic text-gray-600 my-4"
                                {...props}
                            />
                        ),
                        a: ({node, ...props}) => (
                            <a className="text-blue-600 hover:text-blue-800 hover:underline" {...props} />
                        ),
                        strong: ({node, ...props}) => <strong className="font-bold text-gray-900" {...props} />,
                        em: ({node, ...props}) => <em className="italic text-gray-800" {...props} />,
                    }}
                >
                    {article.content}
                </ReactMarkdown>
            </article>

            {/* Article Footer */}
            <footer className="mt-12 pt-6 border-t border-gray-200">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="text-sm text-gray-500">
                        <p>
                            Published on{" "}
                            {article.created_at
                                ? new Date(article.created_at).toLocaleDateString("en-US", {
                                      year: "numeric",
                                      month: "long",
                                      day: "numeric",
                                  })
                                : "Unknown date"}
                        </p>
                        {article.updated_at && article.updated_at !== article.created_at && (
                            <p>
                                Last updated on{" "}
                                {new Date(article.updated_at).toLocaleDateString("en-US", {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                })}
                            </p>
                        )}
                    </div>

                    <Link
                        to="/articles"
                        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200 font-medium"
                    >
                        ← Back to All Articles
                    </Link>
                </div>
            </footer>
        </div>
    );
};

export default ArticleDetail;
