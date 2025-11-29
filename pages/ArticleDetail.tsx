
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { BlogPost } from '../types';
import { getPostById, getPosts } from '../services/storageService';
import ArticleCard from '../components/ArticleCard';
import CommentSection from '../components/CommentSection';

const ArticleDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);
  const [headings, setHeadings] = useState<{ id: string; text: string; level: number }[]>([]);

  useEffect(() => {
    if (id) {
      const found = getPostById(id);
      setPost(found || null);

      if (found) {
        // Find related posts based on category
        const allPosts = getPosts();
        const related = allPosts
          .filter(p => p.category === found.category && p.id !== found.id)
          .slice(0, 3);
        setRelatedPosts(related);

        // Extract headings for ToC
        const lines = found.content.split('\n');
        const extractedHeadings = lines
          .filter(line => line.match(/^#{1,3}\s/))
          .map(line => {
            const level = line.match(/^#+/)?.[0].length || 1;
            const text = line.replace(/^#+\s/, '');
            const headingId = text.toLowerCase().replace(/[^\w\u4e00-\u9fa5]+/g, '-');
            return { id: headingId, text, level };
          });
        setHeadings(extractedHeadings);
      }
    }
  }, [id]);

  if (!post) {
    return (
      <div className="min-h-screen pt-32 flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold text-primary mb-4">文章未找到</h2>
        <Link to="/" className="text-accent hover:underline">返回首页</Link>
      </div>
    );
  }

  // Helper to handle inline bold/italic/link/code
  const parseInline = (text: string) => {
    // Regex splits text into: bold, italic, code, link, normal text
    const parts = text.split(/(\*\*.*?\*\*|\*.*?\*|`.*?`|\[.*?\]\(.*?\))/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) return <strong key={i} className="font-bold text-primary">{part.slice(2, -2)}</strong>;
      if (part.startsWith('*') && part.endsWith('*')) return <em key={i} className="italic">{part.slice(1, -1)}</em>;
      if (part.startsWith('`') && part.endsWith('`')) return <code key={i} className="bg-gray-100 text-pink-500 px-1 rounded font-mono text-sm">{part.slice(1, -1)}</code>;
      if (part.startsWith('[') && part.includes('](')) {
        const match = part.match(/\[(.*?)\]\((.*?)\)/);
        if (match) return <a key={i} href={match[2]} target="_blank" rel="noreferrer" className="text-accent hover:underline">{match[1]}</a>;
      }
      return part;
    });
  };

  // HTML Escaping for code blocks
  const escapeHtml = (text: string) => {
    return text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  };

  // Basic Syntax Highlighting
  const highlightCode = (code: string) => {
    let safeCode = escapeHtml(code);
    
    safeCode = safeCode
        .replace(/(&quot;.*?&quot;|&#039;.*?&#039;)/g, '<span class="text-green-400">$1</span>')
        .replace(/(\/\/.*$)/gm, '<span class="text-gray-500 italic">$1</span>')
        .replace(/\b(const|let|var|function|return|import|export|from|class|interface|type|async|await|if|else|for|while|try|catch|throw|new|void)\b/g, '<span class="text-pink-400 font-bold">$1</span>')
        .replace(/\b(true|false|null|undefined)\b/g, '<span class="text-blue-400 font-bold">$1</span>')
        .replace(/\b(\d+)\b/g, '<span class="text-orange-400">$1</span>');

    return safeCode;
  };

  // Improved Markdown Renderer
  const renderContent = (content: string) => {
    const parts = content.split(/(```[\s\S]*?```)/g);

    return parts.map((part, partIndex) => {
        // Handle Code Block
        if (part.startsWith('```') && part.endsWith('```')) {
            const lines = part.split('\n');
            const lang = lines[0].replace('```', '').trim();
            const codeBody = lines.slice(1, -1).join('\n');
            
            return (
                <div key={partIndex} className="my-8 rounded-xl overflow-hidden bg-[#1e1e1e] shadow-lg border border-gray-800">
                    <div className="flex items-center justify-between px-4 py-2 bg-[#252526] border-b border-gray-700">
                        <span className="text-xs text-gray-400 font-mono lowercase">{lang || 'text'}</span>
                        <div className="flex gap-1.5">
                            <div className="w-2.5 h-2.5 rounded-full bg-red-500/20"></div>
                            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/20"></div>
                            <div className="w-2.5 h-2.5 rounded-full bg-green-500/20"></div>
                        </div>
                    </div>
                    <pre className="p-4 overflow-x-auto text-sm font-mono text-gray-200 leading-relaxed">
                        <code dangerouslySetInnerHTML={{ __html: highlightCode(codeBody) }} />
                    </pre>
                </div>
            );
        }

        return part.split('\n').map((line, index) => {
            const key = `${partIndex}-${index}`;
            // Headings
            if (line.startsWith('# ')) {
                const text = line.replace('# ', '');
                const id = text.toLowerCase().replace(/[^\w\u4e00-\u9fa5]+/g, '-');
                return <h1 id={id} key={key} className="text-3xl font-bold mt-10 mb-6 text-primary">{text}</h1>;
            }
            if (line.startsWith('## ')) {
                const text = line.replace('## ', '');
                const id = text.toLowerCase().replace(/[^\w\u4e00-\u9fa5]+/g, '-');
                return <h2 id={id} key={key} className="text-2xl font-bold mt-8 mb-4 text-primary">{text}</h2>;
            }
            if (line.startsWith('### ')) {
                const text = line.replace('### ', '');
                const id = text.toLowerCase().replace(/[^\w\u4e00-\u9fa5]+/g, '-');
                return <h3 id={id} key={key} className="text-xl font-bold mt-6 mb-3 text-primary">{text}</h3>;
            }
            
            // Blockquotes
            if (line.startsWith('> ')) {
                return <blockquote key={key} className="border-l-4 border-accent pl-4 italic my-6 text-secondary bg-gray-50 py-3 rounded-r-lg">{parseInline(line.replace('> ', ''))}</blockquote>;
            }

            // Images
            if (line.startsWith('![')) {
                const match = line.match(/!\[(.*?)\]\((.*?)\)/);
                if (match) return <img key={key} src={match[2]} alt={match[1]} className="w-full rounded-2xl my-8 shadow-sm" />;
            }

            // Lists
            if (line.startsWith('- ')) {
                return (
                    <ul key={key} className="list-disc ml-5 mb-2 text-secondary">
                        <li>{parseInline(line.replace('- ', ''))}</li>
                    </ul>
                );
            }

            if (line.trim() === '') return <br key={key} />;
            
            // Paragraphs
            return <p key={key} className="mb-4 text-lg leading-loose text-secondary">{parseInline(line)}</p>;
        });
    });
  };

  return (
    <article className="pt-32 pb-24 px-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section (Full Width) */}
        <div className="max-w-4xl mx-auto mb-16 text-center">
          <Link to="/articles" className="inline-flex items-center text-sm font-medium text-secondary hover:text-accent mb-8 transition-colors">
            <i className="ph ph-arrow-left mr-2"></i> 返回文章列表
          </Link>
          
          <div className="flex items-center justify-center gap-3 text-sm text-gray-400 mb-6">
            <span className="bg-blue-50 text-accent px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">{post.category}</span>
            <span>{post.date}</span>
            <span className="w-1 h-1 rounded-full bg-gray-300"></span>
            <span>{post.readTime}</span>
          </div>
          
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-primary leading-tight mb-10">
            {post.title}
          </h1>

          {post.coverImage && (
            <div className="relative aspect-video w-full overflow-hidden rounded-2xl shadow-sm">
                <img 
                src={post.coverImage} 
                alt={post.title} 
                className="w-full h-full object-cover"
                />
            </div>
          )}
        </div>
        
        {/* Main Content & Sidebar Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Left Column: Content */}
          <div className="lg:col-span-8">
            <div className="prose prose-lg prose-gray max-w-none">
              {renderContent(post.content)}
            </div>

            <div className="mt-16 pt-8 border-t border-gray-100">
               <div className="flex items-center gap-2 mb-4 text-sm font-medium text-secondary">
                  <i className="ph ph-tag"></i> 相关标签:
               </div>
               <div className="flex flex-wrap gap-2">
                 {post.tags.map(tag => (
                   <Link to="/articles" key={tag} className="text-sm text-gray-500 bg-gray-50 px-4 py-2 rounded-full hover:bg-gray-100 transition-colors">#{tag}</Link>
                 ))}
               </div>
            </div>

            {/* Comment Section */}
            <CommentSection postId={post.id} />
            
          </div>

          {/* Right Column: Sidebar (Sticky) */}
          <aside className="lg:col-span-4 space-y-12">
            <div className="sticky top-32 space-y-10">
              
              {/* Table of Contents */}
              {headings.length > 0 && (
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                  <h3 className="font-bold text-primary mb-4 flex items-center gap-2">
                    <i className="ph ph-list-bullets text-accent"></i> 目录
                  </h3>
                  <nav className="flex flex-col space-y-2">
                    {headings.map((heading) => (
                      <a 
                        key={heading.id} 
                        href={`#${heading.id}`}
                        className={`text-sm text-secondary hover:text-accent transition-colors line-clamp-1 ${heading.level === 2 ? 'pl-4' : ''} ${heading.level === 3 ? 'pl-8' : ''}`}
                      >
                        {heading.text}
                      </a>
                    ))}
                  </nav>
                </div>
              )}

              {/* Share/Newsletter Promo */}
              <div className="bg-primary text-white p-6 rounded-2xl">
                <h4 className="font-bold mb-2">喜欢这篇文章？</h4>
                <p className="text-sm text-gray-300 mb-4">订阅我们的周刊，不错过任何更新。</p>
                <button className="w-full py-2 bg-white text-primary text-sm font-bold rounded-lg hover:bg-gray-100 transition-colors">
                  订阅更新
                </button>
              </div>

            </div>
          </aside>
        
        </div>

        {/* Related Posts Bottom Section */}
        {relatedPosts.length > 0 && (
          <div className="mt-20 border-t border-gray-100 pt-16">
            <h2 className="text-2xl font-bold text-primary mb-8">相关推荐</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedPosts.map(post => (
                <ArticleCard key={post.id} post={post} />
              ))}
            </div>
          </div>
        )}

      </div>
    </article>
  );
};

export default ArticleDetail;
