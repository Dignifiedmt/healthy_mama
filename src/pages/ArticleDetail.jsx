import {useState, useEffect} from "react";
import {useParams, Link} from "react-router-dom";
import {getArticleBySlug} from "../services/supabase";
import ReactMarkdown from "react-markdown";

// Detail: Matching harticlepage(1).html – Markdown render for content.
const ArticleDetail = () => {
    const {slug} = useParams();
    const [article, setArticle] = useState(null);

    useEffect(() => {
        async function fetchData() {
            const data = await getArticleBySlug(slug);
            setArticle(data);
        }
        fetchData();
    }, [slug]);

    if (!article) return <p>Loading...</p>;

    return (
        <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl font-bold mb-4">{article.title}</h1>
            <p className="text-gray-600 mb-6">
                By {article.author} · {new Date(article.created_at).toLocaleDateString("ha-NG")}
            </p>
            {article.image_path && (
                <img src={article.image_path} alt={article.title} className="w-full h-64 object-cover mb-6 rounded" />
            )}
            <ReactMarkdown className="prose lg:prose-xl">{article.content}</ReactMarkdown>
            <Link to="/articles" className="text-blue-600 hover:underline mt-8 block">
                Back to Articles
            </Link>
        </div>
    );
};

export default ArticleDetail;
