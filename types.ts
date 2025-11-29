
export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string; // Markdown or HTML
  coverImage: string;
  date: string;
  readTime: string;
  category: 'Development' | 'Life' | 'Design' | 'AI';
  tags: string[];
}

export interface User {
  name: string;
  avatar: string;
  username: string;
}

export interface Comment {
  id: string;
  postId: string;
  user: User;
  content: string;
  date: string;
}

export type ViewMode = 'list' | 'detail' | 'admin' | 'editor';
