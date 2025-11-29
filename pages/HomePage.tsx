import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BlogPost } from '../types';
import { getPosts } from '../services/storageService';
import ArticleCard from '../components/ArticleCard';

const HomePage: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);

  useEffect(() => {
    setPosts(getPosts());
  }, []);

  // Get only the latest 3 posts
  const recentPosts = posts.slice(0, 3);

  return (
    <>
      {/* Hero Section */}
      <header id="home" className="pt-32 pb-20 lg:pt-48 lg:pb-32 px-6 max-w-7xl mx-auto">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-accent text-xs font-semibold uppercase tracking-wide mb-6">
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse"></span>
            Welcome to my blog
          </div>
          <h1 className="text-5xl lg:text-7xl font-bold tracking-tight mb-8 text-primary">
            思考，记录，<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-500 to-gray-900">
              然后在代码中寻找诗意。
            </span>
          </h1>
          <p className="text-xl text-secondary mb-10 leading-relaxed max-w-2xl">
            你好，我是 Lumina。这里是我的数字花园，我在这里分享关于前端开发、极简设计以及数字游民的生活感悟。
          </p>
          <div className="flex flex-wrap gap-4">
            <Link to="/articles" className="flex items-center justify-center gap-2 px-7 py-3.5 bg-primary text-white rounded-full font-medium hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">
              阅读文章 <i className="ph ph-arrow-right"></i>
            </Link>
            <a href="#about" className="flex items-center justify-center gap-2 px-7 py-3.5 bg-white border border-gray-200 text-primary rounded-full font-medium hover:border-gray-400 transition-all duration-300">
              了解更多
            </a>
          </div>
        </div>
      </header>

      {/* Latest Articles Section */}
      <section className="px-6 py-20 max-w-7xl mx-auto">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-3xl font-bold mb-2">最新发布</h2>
            <p className="text-secondary">探索最新的想法与教程</p>
          </div>
          <Link to="/articles" className="hidden md:flex items-center text-sm font-semibold text-accent hover:text-blue-700 transition-colors">
            查看归档 <i className="ph ph-arrow-right ml-1"></i>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {recentPosts.map((post) => (
            <ArticleCard key={post.id} post={post} />
          ))}
        </div>
        
        <div className="mt-12 text-center md:hidden">
            <Link to="/articles" className="inline-flex items-center text-sm font-semibold text-accent hover:text-blue-700 transition-colors">
                查看归档 <i className="ph ph-arrow-right ml-1"></i>
            </Link>
        </div>
      </section>

      {/* About/Newsletter Section */}
      <section id="about" className="bg-white py-24 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="bg-primary rounded-3xl p-8 lg:p-16 text-white overflow-hidden relative shadow-2xl">
            <div className="absolute top-0 right-0 -mt-20 -mr-20 w-80 h-80 bg-blue-500 rounded-full blur-3xl opacity-20"></div>
            <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-80 h-80 bg-purple-500 rounded-full blur-3xl opacity-20"></div>

            <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl lg:text-4xl font-bold mb-6">每周一封，<br />关于技术与生活的思考。</h2>
                <p className="text-gray-400 mb-8 leading-relaxed">
                  我不会发送垃圾邮件。加入 2,000+ 订阅者，获取我最新的文章更新。
                </p>
                <form className="flex flex-col sm:flex-row gap-3" onSubmit={(e) => e.preventDefault()}>
                  <input type="email" placeholder="你的邮箱地址" className="flex-1 px-5 py-3.5 rounded-full bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent focus:bg-white/20 transition-all" />
                  <button type="submit" className="px-8 py-3.5 bg-accent text-white font-bold rounded-full hover:bg-blue-600 transition-colors shadow-lg hover:shadow-blue-500/30">
                    立即订阅
                  </button>
                </form>
              </div>
              <div className="hidden md:flex justify-center">
                 <div className="grid grid-cols-2 gap-4 opacity-80">
                    <div className="bg-white/10 p-6 rounded-2xl backdrop-blur-sm">
                        <i className="ph ph-pencil-simple text-3xl text-accent mb-2"></i>
                        <div className="font-bold">写作</div>
                    </div>
                    <div className="bg-white/10 p-6 rounded-2xl backdrop-blur-sm mt-8">
                        <i className="ph ph-code text-3xl text-purple-400 mb-2"></i>
                        <div className="font-bold">代码</div>
                    </div>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default HomePage;