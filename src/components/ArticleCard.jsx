import {Link} from "react-router-dom";
import {Edit2, Trash2} from "lucide-react";

const ArticleCard = ({article, onEdit, onDelete}) => {
    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            {article.image_path && (
                <img src={article.image_path} alt={article.title} className="w-full h-48 object-cover" />
            )}
            <div className="p-4">
                <h3 className="text-xl font-semibold mb-2 line-clamp-2">{article.title}</h3>
                <p className="text-gray-800 mb-3 line-clamp-3">{article.excerpt}</p>
                <div className="flex justify-between items-center">
                    <Link to={`/articles/${article.slug}`} className="text-blue-800 hover:text-blue-800 font-medium">
                        Karanta Ƙari →
                    </Link>

                    {(onEdit || onDelete) && (
                        <div className="flex space-x-2">
                            {onEdit && (
                                <button
                                    onClick={onEdit}
                                    className="text-blue-800 hover:text-blue-800 p-1"
                                    title="Edit article"
                                >
                                    <Edit2 size={16} />
                                </button>
                            )}
                            {onDelete && (
                                <button
                                    onClick={onDelete}
                                    className="text-red-800 hover:text-red-800 p-1"
                                    title="Delete article"
                                >
                                    <Trash2 size={16} />
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ArticleCard;
