import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-surface pt-16 pb-8 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-8">
          <div className="flex items-center gap-2">
            <span className="font-bold text-xl tracking-tight">Lumina</span>
          </div>
          <div className="flex space-x-6 text-2xl text-secondary">
            <a href="#" className="hover:text-primary transition-colors"><i className="ph ph-github-logo"></i></a>
            <a href="#" className="hover:text-primary transition-colors"><i className="ph ph-twitter-logo"></i></a>
            <a href="#" className="hover:text-primary transition-colors"><i className="ph ph-instagram-logo"></i></a>
            <a href="#" className="hover:text-primary transition-colors"><i className="ph ph-envelope-simple"></i></a>
          </div>
        </div>
        <div className="border-t border-gray-200 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} Lumina Blog. 保留所有权利。</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-primary">隐私政策</a>
            <a href="#" className="hover:text-primary">使用条款</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
