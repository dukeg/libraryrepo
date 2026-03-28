import React, { createContext, useContext, useState, useCallback } from 'react';
import * as SecureStore from 'expo-secure-store';

const AppContext = createContext(null);

export const COLORS = {
  void: '#06060a',
  deep: '#0c0c14',
  surface: '#11111d',
  panel: '#161624',
  border: '#1e1e32',
  borderBright: '#2a2a48',
  gold: '#c9a84c',
  goldDim: '#8a6f2e',
  goldBright: '#f0c96a',
  amber: '#e8943a',
  crimson: '#c94040',
  teal: '#2db8b8',
  silver: '#8888aa',
  mist: '#aaaacc',
  snow: '#e8e8f4',
  white: '#f4f4ff',
  purple: '#c080ff',
  green: '#4cff88',
};

export const FONTS = {
  display: 'CormorantGaramond_700Bold',
  displayRegular: 'CormorantGaramond_400Regular',
  displaySemiBold: 'CormorantGaramond_600SemiBold',
  mono: 'System',
};

export const BOOKS_DATA = {
  featured: [
    { id: 'OL24347953W', title: '1984', author: 'George Orwell', emoji: '📕', genre: 'Fiction', rating: 5, year: 1949, pages: 328, language: 'English', downloads: '4.2M' },
    { id: 'OL262758W', title: 'To Kill a Mockingbird', author: 'Harper Lee', emoji: '📗', genre: 'Fiction', rating: 5, year: 1960, pages: 281, language: 'English', downloads: '3.8M' },
    { id: 'OL102749W', title: 'A Brief History of Time', author: 'Stephen Hawking', emoji: '🔭', genre: 'Science', rating: 5, year: 1988, pages: 212, language: 'English', downloads: '2.9M' },
    { id: 'OL27479W', title: 'The Republic', author: 'Plato', emoji: '🏛️', genre: 'Philosophy', rating: 4, year: -380, pages: 416, language: 'Greek/English', downloads: '2.1M' },
    { id: 'OL257943W', title: 'Pride and Prejudice', author: 'Jane Austen', emoji: '💌', genre: 'Fiction', rating: 5, year: 1813, pages: 432, language: 'English', downloads: '5.6M' },
    { id: 'OL893415W', title: 'Sapiens', author: 'Yuval Noah Harari', emoji: '🦴', genre: 'History', rating: 5, year: 2011, pages: 443, language: 'English', downloads: '6.2M' },
    { id: 'OL1966819W', title: 'Dune', author: 'Frank Herbert', emoji: '🌌', genre: 'Sci-Fi', rating: 5, year: 1965, pages: 688, language: 'English', downloads: '3.4M' },
    { id: 'OL20821429W', title: 'Atomic Habits', author: 'James Clear', emoji: '⚛️', genre: 'Psychology', rating: 5, year: 2018, pages: 320, language: 'English', downloads: '7.1M' },
  ],
  trending: [
    { id: 'OL22497M', title: 'The Art of War', author: 'Sun Tzu', emoji: '⚔️', genre: 'Philosophy', rating: 5, year: -500, pages: 68, language: 'Chinese/English', downloads: '8.9M' },
    { id: 'OL45804W', title: 'Meditations', author: 'Marcus Aurelius', emoji: '🧘', genre: 'Philosophy', rating: 5, year: 180, pages: 256, language: 'Greek/English', downloads: '4.5M' },
    { id: 'OL1168527W', title: 'Thinking, Fast and Slow', author: 'Daniel Kahneman', emoji: '🧠', genre: 'Psychology', rating: 5, year: 2011, pages: 499, language: 'English', downloads: '3.2M' },
    { id: 'OL262775W', title: 'Brave New World', author: 'Aldous Huxley', emoji: '🌐', genre: 'Fiction', rating: 5, year: 1932, pages: 311, language: 'English', downloads: '2.8M' },
    { id: 'OL66554W', title: 'Crime and Punishment', author: 'Dostoevsky', emoji: '🔪', genre: 'Fiction', rating: 5, year: 1866, pages: 551, language: 'Russian/English', downloads: '2.1M' },
    { id: 'c3', title: 'Hamlet', author: 'William Shakespeare', emoji: '💀', genre: 'Classic', rating: 5, year: 1603, pages: 342, language: 'English', downloads: '9.3M' },
    { id: 'c4', title: 'War and Peace', author: 'Leo Tolstoy', emoji: '📜', genre: 'Fiction', rating: 5, year: 1869, pages: 1392, language: 'Russian/English', downloads: '1.8M' },
    { id: 'c8', title: 'Frankenstein', author: 'Mary Shelley', emoji: '⚡', genre: 'Horror', rating: 5, year: 1818, pages: 280, language: 'English', downloads: '3.7M' },
  ],
  classics: [
    { id: 'c1', title: 'The Iliad', author: 'Homer', emoji: '🏺', genre: 'Classic', rating: 5, year: -800, pages: 704, language: 'Greek/English', downloads: '2.3M' },
    { id: 'c2', title: 'Divine Comedy', author: 'Dante Alighieri', emoji: '🌹', genre: 'Classic', rating: 5, year: 1320, pages: 798, language: 'Italian/English', downloads: '1.9M' },
    { id: 'c5', title: 'Moby Dick', author: 'Herman Melville', emoji: '🐋', genre: 'Classic', rating: 4, year: 1851, pages: 635, language: 'English', downloads: '2.0M' },
    { id: 'c6', title: 'Jane Eyre', author: 'Charlotte Brontë', emoji: '🌧️', genre: 'Classic', rating: 5, year: 1847, pages: 532, language: 'English', downloads: '4.1M' },
    { id: 'c7', title: 'The Odyssey', author: 'Homer', emoji: '⛵', genre: 'Classic', rating: 5, year: -800, pages: 541, language: 'Greek/English', downloads: '3.0M' },
    { id: 'OL7353617M', title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', emoji: '🥂', genre: 'Fiction', rating: 4, year: 1925, pages: 180, language: 'English', downloads: '5.5M' },
  ],
};

export const WORLD_LIBRARIES = [
  { flag: '🇺🇸', name: 'Library of Congress', country: 'USA', count: '170M+ items', status: 'LIVE', books: 32000000, color: '#1a3a6b' },
  { flag: '🇬🇧', name: 'British Library', country: 'UK', count: '150M+ items', status: 'LIVE', books: 29000000, color: '#3a1a2a' },
  { flag: '🇫🇷', name: 'Bibliothèque Nationale', country: 'France', count: '40M+ items', status: 'LIVE', books: 14000000, color: '#2a1a3a' },
  { flag: '🇩🇪', name: 'Deutsche Nationalbibliothek', country: 'Germany', count: '36M+ items', status: 'LIVE', books: 12000000, color: '#1a2a1a' },
  { flag: '🇷🇺', name: 'Russian State Library', country: 'Russia', count: '47M+ items', status: 'LIVE', books: 18000000, color: '#3a1a1a' },
  { flag: '🇨🇳', name: 'National Library of China', country: 'China', count: '37M+ items', status: 'LIVE', books: 15000000, color: '#2a1a1a' },
  { flag: '🇯🇵', name: 'National Diet Library', country: 'Japan', count: '45M+ items', status: 'LIVE', books: 17000000, color: '#1a1a3a' },
  { flag: '🇮🇳', name: 'National Library of India', country: 'India', count: '2.2M+ items', status: 'LIVE', books: 2200000, color: '#2a2a1a' },
  { flag: '🇪🇬', name: 'Library of Alexandria', country: 'Egypt', count: '8M+ items', status: 'LIVE', books: 8000000, color: '#3a2a1a' },
  { flag: '🇻🇦', name: 'Vatican Apostolic Library', country: 'Vatican', count: '1.6M+ items', status: 'LIVE', books: 1600000, color: '#1a2a3a' },
  { flag: '🇧🇷', name: 'National Library of Brazil', country: 'Brazil', count: '9M+ items', status: 'LIVE', books: 9000000, color: '#1a3a2a' },
  { flag: '🇦🇺', name: 'National Library of Australia', country: 'Australia', count: '10M+ items', status: 'LIVE', books: 10000000, color: '#2a3a1a' },
];

export function AppProvider({ children }) {
  const [user, setUser] = useState(null);
  const [shelf, setShelf] = useState([]);
  const [downloads, setDownloads] = useState([]);
  const [readingHistory, setReadingHistory] = useState([]);
  const [notifications, setNotifications] = useState([
    { id: 1, title: 'New books from British Library', body: '1,240 new titles added this week.', icon: '📚', unread: true, time: '2h ago' },
    { id: 2, title: 'AI Recommendation', body: 'Try "Structure of Scientific Revolutions"', icon: '🤖', unread: true, time: '5h ago' },
    { id: 3, title: 'National Library of India joined', body: '350,000 books now accessible', icon: '🌍', unread: true, time: '1d ago' },
    { id: 4, title: 'DeepSeek v3 upgrade complete', body: 'AI Librarian upgraded with new engine', icon: '⚡', unread: false, time: '2d ago' },
  ]);

  const login = useCallback((userData) => setUser(userData), []);
  const logout = useCallback(() => setUser(null), []);

  const addToShelf = useCallback((book) => {
    setShelf(prev => {
      if (prev.find(b => b.id === book.id)) return prev;
      return [{ ...book, progress: 0, addedAt: new Date().toISOString() }, ...prev];
    });
  }, []);

  const removeFromShelf = useCallback((id) => {
    setShelf(prev => prev.filter(b => b.id !== id));
  }, []);

  const updateProgress = useCallback((id, progress) => {
    setShelf(prev => prev.map(b => b.id === id ? { ...b, progress } : b));
  }, []);

  const addToHistory = useCallback((book) => {
    setReadingHistory(prev => {
      const filtered = prev.filter(b => b.id !== book.id);
      return [{ ...book, readAt: new Date().toISOString() }, ...filtered].slice(0, 50);
    });
  }, []);

  const addDownload = useCallback((book) => {
    setDownloads(prev => {
      if (prev.find(b => b.id === book.id)) return prev;
      return [{ ...book, downloadedAt: new Date().toISOString() }, ...prev];
    });
  }, []);

  const markNotificationRead = useCallback((id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, unread: false } : n));
  }, []);

  return (
    <AppContext.Provider value={{
      user, login, logout,
      shelf, addToShelf, removeFromShelf, updateProgress,
      downloads, addDownload,
      readingHistory, addToHistory,
      notifications, markNotificationRead,
      unreadCount: notifications.filter(n => n.unread).length,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
