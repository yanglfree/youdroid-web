import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navClass = `fixed w-full z-50 transition-all duration-300 ${
    scrolled ? 'bg-white/85 backdrop-blur-md shadow-sm border-b border-gray-100' : 'bg-transparent'
  }`;

  const linkClass = (path: string) => 
    `text-sm font-medium transition-colors ${
      location.pathname === path ? 'text-accent' : 'text-primary hover:text-accent'
    }`;

  return (
    <nav className={navClass}>
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0 flex items-center gap-2 cursor-pointer">
            <div className="w-8 h-8 bg-primary text-white flex items-center justify-center rounded-lg">
              <span className="font-bold text-lg">L</span>
            </div>
            <span className="font-bold text-xl tracking-tight">Lumina</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-8 items-center">
            <Link to="/" className={linkClass('/')}>首页</Link>
            <Link to="/articles" className={linkClass('/articles')}>文章</Link>
            <Link to="/admin" className={linkClass('/admin')}>管理后台</Link>
            <button className="px-5 py-2.5 bg-primary text-white text-sm font-medium rounded-full hover:bg-opacity-90 transition-all hover:shadow-lg">
              订阅更新
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button 
              onClick={() => setIsOpen(!isOpen)}
              className="text-primary hover:text-accent focus:outline-none"
            >
              <i className={`ph text-2xl ${isOpen ? 'ph-x' : 'ph-list'}`}></i>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 absolute w-full shadow-lg animate-fade-in-down">
          <div className="px-6 pt-4 pb-6 space-y-3 flex flex-col">
            <Link to="/" onClick={() => setIsOpen(false)} className="block text-base font-medium text-secondary hover:text-primary">首页</Link>
            <Link to="/articles" onClick={() => setIsOpen(false)} className="block text-base font-medium text-secondary hover:text-primary">文章</Link>
            <Link to="/admin" onClick={() => setIsOpen(false)} className="block text-base font-medium text-secondary hover:text-primary">管理后台</Link>
            <button className="text-left block text-base font-medium text-accent">订阅更新</button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;