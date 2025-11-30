
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LoginPage: React.FC = () => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // 简单的密码验证，实际项目中应使用更安全的验证方式
    if (password === 'admin') { 
      localStorage.setItem('lumina_is_admin', 'true');
      // 触发自定义事件通知 Navbar 更新状态
      window.dispatchEvent(new Event('auth-change'));
      navigate('/admin');
    } else {
      setError('密码错误，请重试');
    }
  };

  return (
    <div className="min-h-screen pt-32 pb-20 px-6 flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 w-full max-w-md animate-fade-in-up">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-primary text-white flex items-center justify-center rounded-lg mx-auto mb-4">
            <span className="font-bold text-xl">L</span>
          </div>
          <h1 className="text-2xl font-bold text-primary">管理员登录</h1>
          <p className="text-secondary mt-2 text-sm">请输入密码以访问管理后台</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="输入密码 (默认为 admin)"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all"
              autoFocus
            />
          </div>
          {error && (
            <div className="flex items-center gap-2 text-red-500 text-sm bg-red-50 p-3 rounded-lg">
                <i className="ph ph-warning-circle"></i> {error}
            </div>
          )}
          <button
            type="submit"
            className="w-full py-3 bg-primary text-white font-bold rounded-xl hover:bg-opacity-90 transition-all shadow-lg hover:shadow-xl transform active:scale-95 duration-200"
          >
            登录系统
          </button>
        </form>
        
        <div className="mt-8 text-center">
            <button onClick={() => navigate('/')} className="text-sm text-secondary hover:text-primary underline">
                返回首页
            </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
