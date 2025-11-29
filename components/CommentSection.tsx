
import React, { useState, useEffect } from 'react';
import { Comment, User } from '../types';
import { getCommentsByPostId, addComment } from '../services/storageService';

interface Props {
  postId: string;
}

const CommentSection: React.FC<Props> = ({ postId }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [newComment, setNewComment] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  useEffect(() => {
    // Load comments for this post
    setComments(getCommentsByPostId(postId));

    // Check for existing session (simulated)
    const savedUser = localStorage.getItem('lumina_current_user');
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }
  }, [postId]);

  // Simulate GitHub Login
  const handleLogin = () => {
    setIsLoggingIn(true);
    
    // Simulate API delay
    setTimeout(() => {
      const mockUser: User = {
        name: 'Guest User',
        username: 'guest_dev',
        avatar: 'https://ui-avatars.com/api/?name=Guest+User&background=0D1117&color=fff',
      };
      localStorage.setItem('lumina_current_user', JSON.stringify(mockUser));
      setCurrentUser(mockUser);
      setIsLoggingIn(false);
    }, 1500);
  };

  const handleLogout = () => {
    localStorage.removeItem('lumina_current_user');
    setCurrentUser(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !currentUser) return;

    const comment: Comment = {
      id: Date.now().toString(),
      postId,
      user: currentUser,
      content: newComment,
      date: new Date().toISOString(),
    };

    addComment(comment);
    setComments([comment, ...comments]); // Optimistic update
    setNewComment('');
  };

  const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="mt-24 pt-10 border-t border-gray-100" id="comments">
      <h3 className="text-2xl font-bold text-primary mb-8 flex items-center gap-2">
        <i className="ph ph-chat-circle-dots"></i> 
        评论 <span className="text-secondary text-lg font-normal">({comments.length})</span>
      </h3>

      {/* Comment Form / Login Area */}
      <div className="mb-12 bg-gray-50 rounded-2xl p-6 md:p-8 border border-gray-100">
        {!currentUser ? (
          <div className="text-center py-6">
            <h4 className="text-lg font-semibold text-primary mb-2">加入讨论</h4>
            <p className="text-secondary mb-6">登录后即可发表评论，与作者和其他读者交流。</p>
            <button
              onClick={handleLogin}
              disabled={isLoggingIn}
              className="inline-flex items-center gap-2 bg-[#24292e] hover:bg-[#2c3137] text-white px-6 py-3 rounded-lg font-bold transition-all shadow-lg hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoggingIn ? (
                <>
                  <i className="ph ph-spinner animate-spin text-xl"></i> 正在连接 GitHub...
                </>
              ) : (
                <>
                  <i className="ph ph-github-logo text-xl"></i> 使用 GitHub 登录
                </>
              )}
            </button>
            <p className="text-xs text-gray-400 mt-4">* 演示模式：点击即模拟登录成功</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center gap-3">
                <img src={currentUser.avatar} alt={currentUser.name} className="w-8 h-8 rounded-full border border-gray-200" />
                <span className="font-medium text-sm text-primary">
                    以 <span className="font-bold">{currentUser.username}</span> 身份评论
                </span>
              </div>
              <button 
                type="button" 
                onClick={handleLogout}
                className="text-xs text-secondary hover:text-red-500 underline"
              >
                退出登录
              </button>
            </div>
            
            <div className="relative">
                <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="分享你的想法..."
                className="w-full min-h-[120px] p-4 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all resize-y text-base"
                required
                />
            </div>
            
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={!newComment.trim()}
                className="px-6 py-2.5 bg-accent text-white font-bold rounded-lg hover:bg-blue-600 transition-colors shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                发表评论
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Comments List */}
      <div className="space-y-8">
        {comments.length === 0 ? (
          <div className="text-center py-10 text-gray-400">
            <i className="ph ph-chats-teardrop text-4xl mb-3 block opacity-30"></i>
            <p>还没有评论，抢占沙发吧！</p>
          </div>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="flex gap-4 group">
              <div className="flex-shrink-0">
                <img 
                  src={comment.user.avatar} 
                  alt={comment.user.name} 
                  className="w-10 h-10 rounded-full border border-gray-100"
                />
              </div>
              <div className="flex-grow">
                <div className="bg-white p-5 rounded-2xl rounded-tl-none border border-gray-100 shadow-sm group-hover:shadow-md transition-shadow relative">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <span className="font-bold text-primary text-sm mr-2">{comment.user.name}</span>
                      <span className="text-xs text-gray-400">@{comment.user.username}</span>
                    </div>
                    <time className="text-xs text-gray-400" title={comment.date}>
                      {formatDate(comment.date)}
                    </time>
                  </div>
                  <p className="text-secondary leading-relaxed whitespace-pre-wrap">{comment.content}</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CommentSection;
