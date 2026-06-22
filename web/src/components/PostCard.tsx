import { motion } from 'framer-motion';
import { Heart, MessageCircle, Eye, User } from 'lucide-react';

interface PostCardProps {
  id: string;
  title: string;
  content: string;
  author: {
    id: string;
    username: string;
    avatar?: string;
  };
  tags: string[];
  likes: number;
  comments: number;
  views: number;
  createdAt: string;
  onClick?: () => void;
  onLike?: () => void;
}

export default function PostCard({
  title,
  content,
  author,
  tags,
  likes,
  comments,
  views,
  createdAt,
  onClick,
  onLike,
}: PostCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) {
      const hours = Math.floor(diff / (1000 * 60 * 60));
      if (hours === 0) {
        const minutes = Math.floor(diff / (1000 * 60));
        return `${minutes}分钟前`;
      }
      return `${hours}小时前`;
    }
    if (days < 7) return `${days}天前`;
    if (days < 30) return `${Math.floor(days / 7)}周前`;
    return date.toLocaleDateString('zh-CN');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.01 }}
      transition={{ duration: 0.3 }}
      onClick={onClick}
      className={`glass-card-hover p-5 cursor-pointer ${onClick ? 'cursor-pointer' : ''}`}
    >
      {/* 作者信息 */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gold to-primary flex items-center justify-center">
          {author.avatar ? (
            <img src={author.avatar} alt={author.username} className="w-full h-full rounded-full object-cover" />
          ) : (
            <User className="w-5 h-5 text-dark" />
          )}
        </div>
        <div>
          <p className="text-cream font-medium">{author.username}</p>
          <p className="text-cream/50 text-xs">{formatDate(createdAt)}</p>
        </div>
      </div>

      {/* 标题 */}
      <h3 className="font-serif text-lg text-cream mb-2 line-clamp-2">{title}</h3>

      {/* 内容 */}
      <p className="text-cream/70 text-sm mb-4 line-clamp-3">{content}</p>

      {/* 标签 */}
      <div className="flex flex-wrap gap-2 mb-4">
        {tags.map((tag, index) => (
          <span
            key={index}
            className="px-2 py-1 text-xs rounded-full bg-primary/30 text-gold"
          >
            #{tag}
          </span>
        ))}
      </div>

      {/* 统计信息 */}
      <div className="flex items-center gap-6 text-cream/60 text-sm">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onLike?.();
          }}
          className="flex items-center gap-1 hover:text-gold transition-colors"
        >
          <Heart className="w-4 h-4" />
          <span>{likes}</span>
        </button>
        <div className="flex items-center gap-1">
          <MessageCircle className="w-4 h-4" />
          <span>{comments}</span>
        </div>
        <div className="flex items-center gap-1">
          <Eye className="w-4 h-4" />
          <span>{views}</span>
        </div>
      </div>
    </motion.div>
  );
}