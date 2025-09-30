import {Link} from "react-router-dom";
import {Calendar} from "lucide-react";

// Card matching harticlepage.html: Title, author/date, excerpt.
const ArticleCard = ({article, onEdit, onDelete}) => {
    return (
        <div className="bg-white p-4 rounded shadow-md">
            {article.image_path && (
                <img src={article.image_path} alt={article.title} className="w-full h-48 object-cover mb-4 rounded" />
            )}
            <h3 className="text-xl font-bold mb-2">{article.title}</h3>
            <p className="text-sm text-gray-600 mb-2">
                <Calendar size={16} className="inline mr-1" />{" "}
                {new Date(article.created_at).toLocaleDateString("ha-NG")}
            </p>
            <p className="text-gray-700 mb-4">{article.excerpt.substring(0, 100)}...</p>
            <Link to={`/articles/${article.slug}`} className="text-blue-600 hover:underline">
                Kara Karatu arrow_forward
            </Link>
            {onEdit && (
                <button onClick={onEdit} className="ml-4 text-green-600">
                    Edit
                </button>
            )}
            {onDelete && (
                <button onClick={onDelete} className="ml-4 text-red-600">
                    Delete
                </button>
            )}
        </div>
    );
};

export default ArticleCard;
