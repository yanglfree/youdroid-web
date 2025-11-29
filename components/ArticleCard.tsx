import React from 'react';
import { BlogPost } from '../types';
import { Link } from 'react-router-dom';

interface Props {
  post: BlogPost;
  mode?: 'grid' | 'list';
}

const PLACEHOLDER_IMAGE = 'https://placehold.co/800x600/f3f4f6/9ca3af?text=Lumina';

const ArticleCard: React.FC<Props> = ({ post, mode = 'grid' }) => {
  const imageSrc = post.coverImage || PLACEHOLDER_IMAGE;

  if (mode === 'list') {
    return (
      <Link to={`/post/${post.id}`} className="group flex flex-col md:flex-row gap-6 bg-white p-4 rounded-2xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100">
        <div className="relative w-full md:w-64 h-48 flex-shrink-0 overflow-hidden rounded-xl bg-gray-100">
          <img 
            src={imageSrc} 
            alt={post.title} 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider text-primary shadow-sm">
            {post.category}
          </div>
        </div>
        <div className="flex-1 flex flex-col justify-center">
          <div className="flex items-center gap-3 text-sm text-gray-400 mb-2">
            <span>{post.date}</span>
            <span className="w-1 h-1 rounded-full bg-gray-300"></span>
            <span>{post.readTime}</span>
          </div>
          <h3 className="text-xl font-bold mb-2 text-primary group-hover:text-accent transition-colors">
            {post.title}
          </h3>
          <p className="text-secondary line-clamp-2 leading-relaxed mb-4 text-sm md:text-base">
            {post.excerpt}
          </p>
          <div className="mt-auto flex items-center text-sm font-medium text-primary">
            <span className="group-hover:underline decoration-accent underline-offset-4">阅读全文</span>
            <i className="ph ph-arrow-right ml-2 -rotate-45 group-hover:rotate-0 transition-transform duration-300 text-gray-400"></i>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link to={`/post/${post.id}`} className="article-card group cursor-pointer flex flex-col h-full">
      <div className="relative overflow-hidden rounded-2xl mb-5 shadow-sm bg-gray-100 aspect-[4/3]">
        <img 
          src={imageSrc} 
          alt={post.title} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-primary shadow-sm">
          {post.category}
        </div>
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-3 text-sm text-gray-400 mb-3">
          <span>{post.date}</span>
          <span className="w-1 h-1 rounded-full bg-gray-300"></span>
          <span>{post.readTime}</span>
        </div>
        <h3 className="card-title text-xl font-bold mb-3 transition-colors duration-300 group-hover:text-accent">
          {post.title}
        </h3>
        <p className="text-secondary line-clamp-3 leading-relaxed mb-4">
          {post.excerpt}
        </p>
      </div>
      <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
        <span className="text-sm font-medium text-primary group-hover:underline decoration-accent underline-offset-4">
          阅读全文
        </span>
        <i className="ph ph-arrow-right -rotate-45 group-hover:rotate-0 transition-transform duration-300 text-gray-400"></i>
      </div>
    </Link>
  );
};

export default ArticleCard;