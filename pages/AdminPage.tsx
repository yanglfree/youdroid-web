
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BlogPost } from '../types';
import { getPosts, deletePost } from '../services/storageService';

const AdminPage: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    setPosts(getPosts());
  }, []);

  const handleDelete = (id: string) => {
    if (window.confirm('确定要删除这篇文章吗？')) {
      deletePost(id);
      setPosts(getPosts());
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('lumina_is_admin');
    window.dispatchEvent(new Event('auth-change'));
    navigate('/login');
  };

  return (
    <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto min-h-screen">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-bold text-primary">内容管理</h1>
          <p className="text-secondary mt-2">管理你的博客文章与草稿</p>
        </div>
        <div className="flex gap-4">
             <button 
                onClick={handleLogout}
                className="flex items-center gap-2 px-5 py-3 border border-gray-200 text-secondary rounded-xl font-medium hover:bg-gray-50 transition-all"
            >
                <i className="ph ph-sign-out text-xl"></i>
                退出
            </button>
            <Link 
            to="/editor" 
            className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl font-medium hover:bg-opacity-90 transition-all shadow-lg hover:shadow-xl"
            >
            <i className="ph ph-plus-circle text-xl"></i>
            新建文章
            </Link>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="py-4 px-6 font-semibold text-sm text-secondary">标题</th>
              <th className="py-4 px-6 font-semibold text-sm text-secondary">分类</th>
              <th className="py-4 px-6 font-semibold text-sm text-secondary">日期</th>
              <th className="py-4 px-6 font-semibold text-sm text-secondary text-right">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {posts.map((post) => (
              <tr key={post.id} className="hover:bg-gray-50/50 transition-colors group">
                <td className="py-4 px-6">
                  <div className="font-medium text-primary mb-1">{post.title}</div>
                  <div className="text-xs text-gray-400 line-clamp-1">{post.excerpt}</div>
                </td>
                <td className="py-4 px-6">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-accent">
                    {post.category}
                  </span>
                </td>
                <td className="py-4 px-6 text-sm text-secondary">{post.date}</td>
                <td className="py-4 px-6 text-right space-x-2">
                   <button 
                    onClick={() => navigate(`/editor/${post.id}`)}
                    className="text-secondary hover:text-accent p-2 rounded-lg hover:bg-blue-50 transition-colors"
                  >
                     <i className="ph ph-pencil-simple text-lg"></i>
                   </button>
                   <button 
                    onClick={() => handleDelete(post.id)}
                    className="text-secondary hover:text-red-500 p-2 rounded-lg hover:bg-red-50 transition-colors"
                  >
                     <i className="ph ph-trash text-lg"></i>
                   </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {posts.length === 0 && (
          <div className="p-10 text-center text-secondary">
            还没有文章，点击右上角创建一个吧！
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPage;
