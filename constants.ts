import { BlogPost } from './types';

export const INITIAL_POSTS: BlogPost[] = [
  {
    id: '1',
    title: '为什么我们仍需要学习原生 JavaScript？',
    excerpt: '在框架横行的时代，回归基础显得尤为重要。本文将探讨原生 JS 的核心概念以及它如何帮助你更好地理解 React 和 Vue。',
    content: '这里是文章的详细内容。原生 JavaScript 是所有前端框架的基石...',
    coverImage: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    date: '2023年 10月 24日',
    readTime: '5 min read',
    category: 'Development',
    tags: ['JavaScript', 'Frontend'],
  },
  {
    id: '2',
    title: '数字极简主义：重夺注意力的 30 天',
    excerpt: '不仅仅是断舍离。在这篇文章中，我记录了关闭社交媒体通知、整理数字工作流的一个月挑战与收获。',
    content: '在这个信息过载的时代，我们的注意力成了最稀缺的资源...',
    coverImage: 'https://images.unsplash.com/photo-1493723843684-a63dc3093c81?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    date: '2023年 11月 05日',
    readTime: '3 min read',
    category: 'Life',
    tags: ['Minimalism', 'Productivity'],
  },
  {
    id: '3',
    title: 'UI 设计中的留白艺术',
    excerpt: 'Negative Space 并不是空的，它是一种活跃的设计元素。学会如何运用留白来引导用户的视觉流动。',
    content: '留白不仅仅是空白，它是设计的呼吸...',
    coverImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    date: '2023年 11月 18日',
    readTime: '7 min read',
    category: 'Design',
    tags: ['UI/UX', 'Design Theory'],
  },
];
