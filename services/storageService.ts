
import { BlogPost, Comment } from '../types';
import { INITIAL_POSTS } from '../constants';

const POSTS_KEY = 'lumina_blog_posts';
const COMMENTS_KEY = 'lumina_blog_comments';

// --- Posts ---

export const getPosts = (): BlogPost[] => {
  const stored = localStorage.getItem(POSTS_KEY);
  if (!stored) {
    // Initialize with demo data if empty
    localStorage.setItem(POSTS_KEY, JSON.stringify(INITIAL_POSTS));
    return INITIAL_POSTS;
  }
  return JSON.parse(stored);
};

export const savePost = (post: BlogPost): void => {
  const posts = getPosts();
  const existingIndex = posts.findIndex((p) => p.id === post.id);
  
  if (existingIndex >= 0) {
    posts[existingIndex] = post;
  } else {
    posts.unshift(post);
  }
  
  localStorage.setItem(POSTS_KEY, JSON.stringify(posts));
};

export const deletePost = (id: string): void => {
  const posts = getPosts();
  const newPosts = posts.filter((p) => p.id !== id);
  localStorage.setItem(POSTS_KEY, JSON.stringify(newPosts));
};

export const getPostById = (id: string): BlogPost | undefined => {
  const posts = getPosts();
  return posts.find((p) => p.id === id);
};

// --- Comments ---

export const getCommentsByPostId = (postId: string): Comment[] => {
  const stored = localStorage.getItem(COMMENTS_KEY);
  const allComments: Comment[] = stored ? JSON.parse(stored) : [];
  return allComments.filter(c => c.postId === postId).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

export const addComment = (comment: Comment): void => {
  const stored = localStorage.getItem(COMMENTS_KEY);
  const allComments: Comment[] = stored ? JSON.parse(stored) : [];
  allComments.unshift(comment);
  localStorage.setItem(COMMENTS_KEY, JSON.stringify(allComments));
};
