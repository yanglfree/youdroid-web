
import React, { useEffect, useState } from 'react';
import { BlogPost } from '../types';
import { getPosts } from '../services/storageService';
import ArticleCard from '../components/ArticleCard';

const ArticlesPage: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    setPosts(getPosts());
  }, []);

  const categories = ['All', 'Development', 'Life', 'Design', 'AI'];

  const filteredPosts = posts.filter((post) => {
    // 1. Search Query Filter
    const query = searchQuery.toLowerCase();
    const matchSearch = 
        post.title.toLowerCase().includes(query) ||
        post.category.toLowerCase().includes(query) ||
        post.tags.some(tag => tag.toLowerCase().includes(query));

    // 2. Category Filter
    const matchCategory = selectedCategory === 'All' || post.category === selectedCategory;
    
    return matchSearch && matchCategory;
  });

  return (
    <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto min-h-screen">
      <div className="flex flex-col md:flex-row justify-between md:items-end mb-8 gap-6">
        <div className="w-full md:w-auto">
          <h1 className="text-4xl font-bold text-primary mb-4">所有文章</h1>
          <p className="text-secondary text-lg">探索技术、设计与生活的思考</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto items-stretch sm:items-center">
          {/* Search Bar */}
          <div className="relative group flex-grow sm:w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <i className="ph ph-magnifying-glass text-gray-400 group-focus-within:text-accent transition-colors"></i>
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="搜索文章..."
              className="block w-full pl-10 pr-10 py-2.5 border border-gray-200 rounded-xl leading-5 bg-white text-primary placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors focus:outline-none"
                aria-label="Clear search"
              >
                <i className="ph ph-x-circle-fill text-lg"></i>
              </button>
            )}
          </div>

          {/* View Toggle */}
          <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-xl self-start sm:self-auto">
            <button 
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white shadow-sm text-accent' : 'text-gray-400 hover:text-gray-600'}`}
              aria-label="Grid View"
            >
              <i className="ph ph-squares-four text-xl"></i>
            </button>
            <button 
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white shadow-sm text-accent' : 'text-gray-400 hover:text-gray-600'}`}
              aria-label="List View"
            >
              <i className="ph ph-list-dashes text-xl"></i>
            </button>
          </div>
        </div>
      </div>

      {/* Category Filter Chips */}
      <div className="flex gap-2 mb-10 overflow-x-auto pb-2 hide-scrollbar">
        {categories.map((cat) => (
            <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-5 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                    selectedCategory === cat 
                    ? 'bg-primary text-white shadow-md transform -translate-y-0.5' 
                    : 'bg-white text-secondary border border-gray-200 hover:border-gray-300 hover:text-primary hover:bg-gray-50'
                }`}
            >
                {cat}
            </button>
        ))}
      </div>

      <div className={viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10" : "flex flex-col gap-6"}>
        {filteredPosts.map((post) => (
          <ArticleCard key={post.id} post={post} mode={viewMode} />
        ))}
      </div>
      
      {filteredPosts.length === 0 && (
        <div className="text-center py-20 text-gray-400 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
            <i className="ph ph-magnifying-glass text-4xl mb-4 block opacity-50"></i>
            {searchQuery || selectedCategory !== 'All' ? '没有找到相关文章' : '暂无文章'}
        </div>
      )}
    </div>
  );
};

export default ArticlesPage;
