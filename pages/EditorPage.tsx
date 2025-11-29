
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { BlogPost } from '../types';
import { getPostById, savePost } from '../services/storageService';
import { generateBlogContent } from '../services/geminiService';

const EditorPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const [formData, setFormData] = useState<BlogPost>({
    id: Date.now().toString(),
    title: '',
    excerpt: '',
    content: '',
    coverImage: 'https://picsum.photos/800/600',
    date: new Date().toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' }),
    readTime: '5 min read',
    category: 'Development',
    tags: [],
  });

  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [showAiModal, setShowAiModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'write' | 'preview'>('write');
  
  // Auto-save states
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const formDataRef = useRef(formData);

  useEffect(() => {
    if (id) {
      const post = getPostById(id);
      if (post) setFormData(post);
    }
  }, [id]);

  // Keep ref updated for the interval closure
  useEffect(() => {
    formDataRef.current = formData;
  }, [formData]);

  // Auto-save Timer
  useEffect(() => {
    const timer = setInterval(() => {
      const currentData = formDataRef.current;
      // Only auto-save if there is at least a title or content
      if (currentData.title || currentData.content) {
        performSave(currentData, true);
      }
    }, 30000); // Auto-save every 30 seconds

    return () => clearInterval(timer);
  }, []);

  // Keyboard Shortcut (Ctrl+S / Cmd+S)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 's') {
        e.preventDefault();
        performSave(formDataRef.current, false); // Manual save triggers same logic
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const performSave = (data: BlogPost, isAuto: boolean) => {
    if (!data.title && !data.content) return;
    
    setIsSaving(true);
    // Simulate a tiny delay for visual feedback so "Saving..." is readable
    setTimeout(() => {
      savePost(data);
      setLastSaved(new Date());
      setIsSaving(false);
    }, 500);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleManualSaveAndPublish = () => {
    if (!formData.title || !formData.content) {
      alert('请填写标题和内容');
      return;
    }
    savePost(formData);
    navigate('/admin');
  };

  const handleAiGenerate = async (type: 'outline' | 'full' | 'summary', explicitTopic?: string) => {
    const topic = explicitTopic || aiPrompt || formData.title;
    if (!topic) return;
    
    setIsAiLoading(true);
    
    const result = await generateBlogContent(topic, type);
    
    if (type === 'summary') {
        setFormData(prev => ({ ...prev, excerpt: result }));
    } else {
        setFormData(prev => ({ 
            ...prev, 
            content: prev.content ? prev.content + '\n\n' + result : result 
        }));
    }
    
    setIsAiLoading(false);
    setShowAiModal(false);
    setAiPrompt('');
  };

  // Markdown Insertion Logic
  const insertFormat = (prefix: string, suffix: string = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const before = text.substring(0, start);
    const selection = text.substring(start, end);
    const after = text.substring(end);

    const newText = before + prefix + selection + suffix + after;
    
    setFormData(prev => ({ ...prev, content: newText }));
    
    // Reset cursor position
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, end + prefix.length);
    }, 0);
  };

  // Helper to handle inline bold/italic/link
  const parseInline = (text: string) => {
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
    
    // Highlights
    safeCode = safeCode
        .replace(/(&quot;.*?&quot;|&#039;.*?&#039;)/g, '<span class="text-green-400">$1</span>')
        .replace(/(\/\/.*$)/gm, '<span class="text-gray-500 italic">$1</span>')
        .replace(/\b(const|let|var|function|return|import|export|from|class|interface|type|async|await|if|else|for|while|try|catch|throw|new|void)\b/g, '<span class="text-pink-400 font-bold">$1</span>')
        .replace(/\b(true|false|null|undefined)\b/g, '<span class="text-blue-400 font-bold">$1</span>')
        .replace(/\b(\d+)\b/g, '<span class="text-orange-400">$1</span>');

    return safeCode;
  };

  // Improved Preview Renderer with Code Block Support
  const renderPreview = (content: string) => {
    if (!content) return <p className="text-gray-400 italic">暂无内容...</p>;
    
    // Split content by code blocks ``` ... ```
    const parts = content.split(/(```[\s\S]*?```)/g);

    return parts.map((part, partIndex) => {
        // Handle Code Block
        if (part.startsWith('```') && part.endsWith('```')) {
            const lines = part.split('\n');
            const lang = lines[0].replace('```', '').trim();
            const codeBody = lines.slice(1, -1).join('\n');
            
            return (
                <div key={partIndex} className="my-6 rounded-xl overflow-hidden bg-[#1e1e1e] shadow-lg border border-gray-800">
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

        // Handle Regular Markdown Text (Line-by-line)
        return part.split('\n').map((line, index) => {
            const key = `${partIndex}-${index}`;
            // Headers
            if (line.startsWith('# ')) return <h1 key={key} className="text-3xl font-bold mt-6 mb-4">{line.replace('# ', '')}</h1>;
            if (line.startsWith('## ')) return <h2 key={key} className="text-2xl font-bold mt-5 mb-3">{line.replace('## ', '')}</h2>;
            if (line.startsWith('### ')) return <h3 key={key} className="text-xl font-bold mt-4 mb-2">{line.replace('### ', '')}</h3>;
            // Quotes
            if (line.startsWith('> ')) return <blockquote key={key} className="border-l-4 border-accent pl-4 italic my-4 text-secondary bg-gray-50 py-2 rounded-r-lg">{line.replace('> ', '')}</blockquote>;
            // Images
            if (line.startsWith('![')) {
                const match = line.match(/!\[(.*?)\]\((.*?)\)/);
                if (match) return <img key={key} src={match[2]} alt={match[1]} className="w-full rounded-xl my-4 shadow-sm" />;
            }
            // Lists
            if (line.startsWith('- ')) return <li key={key} className="ml-4 list-disc mb-1 text-secondary">{parseInline(line.replace('- ', ''))}</li>;
            
            if (line.trim() === '') return <br key={key} />;
            
            return <p key={key} className="mb-2 leading-relaxed text-secondary">{parseInline(line)}</p>;
        });
    });
  };

  return (
    <div className="pt-32 pb-20 px-6 max-w-6xl mx-auto min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-primary">
          {id ? '编辑文章' : '新建文章'}
        </h1>
        <div className="flex items-center gap-4">
          {/* Auto-save Status Indicator */}
          <div className="text-sm text-gray-400 font-medium hidden sm:block">
            {isSaving ? (
              <span className="flex items-center gap-1.5 animate-pulse">
                <i className="ph ph-spinner animate-spin"></i> 正在保存...
              </span>
            ) : lastSaved ? (
              <span className="flex items-center gap-1.5">
                <i className="ph ph-check-circle text-green-500"></i> 
                已自动保存 {lastSaved.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
              </span>
            ) : null}
          </div>

          <div className="flex gap-3">
            <button 
                onClick={() => navigate('/admin')}
                className="px-5 py-2.5 rounded-xl border border-gray-200 text-secondary hover:bg-gray-50 font-medium transition-colors"
            >
                取消
            </button>
            <button 
                onClick={handleManualSaveAndPublish}
                className="px-6 py-2.5 bg-primary text-white rounded-xl font-medium hover:bg-opacity-90 shadow-lg transition-all"
            >
                保存发布
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Editor Area */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col min-h-[700px]">
            {/* Title Input */}
             <div className="p-6 border-b border-gray-100 flex items-center justify-between gap-4">
               <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="文章标题"
                className="flex-grow text-3xl font-bold text-primary placeholder-gray-300 border-none outline-none bg-transparent"
              />
              {formData.title && (
                <button 
                    onClick={() => handleAiGenerate('outline', formData.title)}
                    disabled={isAiLoading}
                    className="flex-shrink-0 flex items-center gap-2 px-4 py-2 bg-purple-50 text-purple-600 rounded-lg text-sm font-medium hover:bg-purple-100 transition-colors border border-purple-100 disabled:opacity-50"
                    title="根据标题生成大纲"
                >
                    {isAiLoading ? <i className="ph ph-spinner animate-spin text-lg"></i> : <i className="ph ph-list-numbers text-lg"></i>}
                    <span className="hidden sm:inline">生成大纲</span>
                </button>
              )}
             </div>

             {/* Toolbar */}
             <div className="px-4 py-2 bg-gray-50 border-b border-gray-100 flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-1">
                   <button onClick={() => insertFormat('# ')} className="p-2 text-secondary hover:text-primary hover:bg-white rounded-lg transition-all" title="Heading 1"><i className="ph ph-text-h-one"></i></button>
                   <button onClick={() => insertFormat('## ')} className="p-2 text-secondary hover:text-primary hover:bg-white rounded-lg transition-all" title="Heading 2"><i className="ph ph-text-h-two"></i></button>
                   <div className="w-px h-4 bg-gray-300 mx-1"></div>
                   <button onClick={() => insertFormat('**', '**')} className="p-2 text-secondary hover:text-primary hover:bg-white rounded-lg transition-all" title="Bold"><i className="ph ph-text-b"></i></button>
                   <button onClick={() => insertFormat('*', '*')} className="p-2 text-secondary hover:text-primary hover:bg-white rounded-lg transition-all" title="Italic"><i className="ph ph-text-italic"></i></button>
                   <div className="w-px h-4 bg-gray-300 mx-1"></div>
                   <button onClick={() => insertFormat('- ')} className="p-2 text-secondary hover:text-primary hover:bg-white rounded-lg transition-all" title="List"><i className="ph ph-list-bullets"></i></button>
                   <button onClick={() => insertFormat('> ')} className="p-2 text-secondary hover:text-primary hover:bg-white rounded-lg transition-all" title="Quote"><i className="ph ph-quotes"></i></button>
                   <button onClick={() => insertFormat('```\n', '\n```')} className="p-2 text-secondary hover:text-primary hover:bg-white rounded-lg transition-all" title="Code Block"><i className="ph ph-code-block"></i></button>
                   <button onClick={() => insertFormat('`', '`')} className="p-2 text-secondary hover:text-primary hover:bg-white rounded-lg transition-all" title="Inline Code"><i className="ph ph-code"></i></button>
                   <button onClick={() => insertFormat('[', '](url)')} className="p-2 text-secondary hover:text-primary hover:bg-white rounded-lg transition-all" title="Link"><i className="ph ph-link"></i></button>
                   <button onClick={() => insertFormat('![alt]', '(url)')} className="p-2 text-secondary hover:text-primary hover:bg-white rounded-lg transition-all" title="Image"><i className="ph ph-image"></i></button>
                </div>

                <div className="flex bg-gray-200/50 p-1 rounded-lg">
                    <button 
                        onClick={() => setActiveTab('write')}
                        className={`px-3 py-1 text-sm font-medium rounded-md transition-all ${activeTab === 'write' ? 'bg-white text-primary shadow-sm' : 'text-gray-500 hover:text-primary'}`}
                    >
                        编辑
                    </button>
                    <button 
                        onClick={() => setActiveTab('preview')}
                        className={`px-3 py-1 text-sm font-medium rounded-md transition-all ${activeTab === 'preview' ? 'bg-white text-primary shadow-sm' : 'text-gray-500 hover:text-primary'}`}
                    >
                        预览
                    </button>
                </div>
             </div>

             {/* Editor / Preview Area */}
             <div className="flex-grow relative bg-white">
                {activeTab === 'write' ? (
                     <>
                        <div className="absolute top-4 right-4 z-10">
                            <button 
                                onClick={() => setShowAiModal(true)}
                                className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-50 text-purple-600 rounded-lg text-sm font-medium hover:bg-purple-100 transition-colors border border-purple-100"
                            >
                                <i className="ph ph-sparkle-fill"></i> AI 助手
                            </button>
                        </div>
                        <textarea
                            ref={textareaRef}
                            name="content"
                            value={formData.content}
                            onChange={handleChange}
                            placeholder="开始撰写你的故事... (支持 Markdown)"
                            className="w-full h-full p-6 resize-none text-base leading-relaxed text-secondary placeholder-gray-300 border-none outline-none bg-transparent font-mono"
                            style={{ minHeight: '500px' }}
                        />
                     </>
                ) : (
                    <div className="p-8 prose prose-gray max-w-none overflow-y-auto h-full" style={{ minHeight: '500px' }}>
                        {renderPreview(formData.content)}
                    </div>
                )}
             </div>
          </div>
        </div>

        {/* Sidebar Settings */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
            <h3 className="font-semibold text-primary">文章设置</h3>
            
            <div>
              <label className="block text-sm font-medium text-secondary mb-1">封面图片 URL</label>
              <input 
                type="text" 
                name="coverImage"
                value={formData.coverImage}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all text-sm"
              />
              {formData.coverImage && (
                  <div className="mt-2 rounded-lg overflow-hidden border border-gray-100">
                      <img src={formData.coverImage} alt="Preview" className="h-32 w-full object-cover" />
                  </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-secondary mb-1">摘要</label>
              <textarea 
                name="excerpt"
                value={formData.excerpt}
                onChange={handleChange}
                rows={3}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all text-sm"
              />
              <button 
                onClick={() => handleAiGenerate('summary')}
                disabled={isAiLoading || !formData.title}
                className="mt-2 text-xs flex items-center gap-1 text-purple-600 hover:text-purple-700 font-medium"
              >
                  {isAiLoading ? '生成中...' : <><i className="ph ph-magic-wand"></i> 自动生成摘要</>}
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                <label className="block text-sm font-medium text-secondary mb-1">分类</label>
                <select 
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all text-sm bg-white"
                >
                    <option value="Development">Development</option>
                    <option value="Life">Life</option>
                    <option value="Design">Design</option>
                    <option value="AI">AI</option>
                </select>
                </div>
                
                <div>
                <label className="block text-sm font-medium text-secondary mb-1">阅读时间</label>
                <input 
                    type="text" 
                    name="readTime"
                    value={formData.readTime}
                    onChange={handleChange}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all text-sm"
                />
                </div>
            </div>
          </div>
        </div>
      </div>

      {/* AI Modal */}
      {showAiModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl animate-fade-in-up">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <i className="ph ph-sparkle text-purple-500"></i> AI 助手
              </h3>
              <button onClick={() => setShowAiModal(false)} className="text-gray-400 hover:text-primary"><i className="ph ph-x text-xl"></i></button>
            </div>
            
            <p className="text-sm text-gray-500 mb-4">输入主题，让 Gemini 帮你构建文章。</p>
            
            <input 
              type="text" 
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              placeholder="例如：React Hooks 最佳实践..."
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 mb-4"
            />
            
            <div className="flex flex-col gap-2">
              <button 
                onClick={() => handleAiGenerate('outline')}
                disabled={isAiLoading}
                className="w-full py-2.5 bg-purple-50 text-purple-700 font-medium rounded-lg hover:bg-purple-100 transition-colors flex items-center justify-center gap-2"
              >
                {isAiLoading ? '思考中...' : '生成大纲'}
              </button>
               <button 
                onClick={() => handleAiGenerate('full')}
                disabled={isAiLoading}
                className="w-full py-2.5 border border-purple-100 text-purple-600 font-medium rounded-lg hover:bg-purple-50 transition-colors flex items-center justify-center gap-2"
              >
                {isAiLoading ? '思考中...' : '生成整段内容'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditorPage;
