import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, TextInput, FlatList, TouchableOpacity,
  StyleSheet, ActivityIndicator, Keyboard
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useApp, COLORS, BOOKS_DATA } from '../services/AppContext';
import BookCard from '../components/BookCard';
import CategoryPill from '../components/CategoryPill';

const FILTERS = ['All', 'E-Books', 'PDFs', 'Audiobooks', 'Journals', 'Manuscripts', 'Free Only'];
const ALL_LOCAL = [...BOOKS_DATA.featured, ...BOOKS_DATA.trending, ...BOOKS_DATA.classics];

export default function DiscoverScreen({ navigation, route }) {
  const insets = useSafeAreaInsets();
  const [query, setQuery] = useState(route?.params?.query || '');
  const [results, setResults] = useState(ALL_LOCAL);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(null);
  const [activeFilter, setActiveFilter] = useState('All');
  const [error, setError] = useState(null);

  useEffect(() => {
    if (query) performSearch(query);
  }, []);

  const getEmoji = (subjects) => {
    if (!subjects) return '📚';
    const s = subjects.join(' ').toLowerCase();
    if (s.includes('fiction')) return '📖';
    if (s.includes('science')) return '🔬';
    if (s.includes('history')) return '⚔️';
    if (s.includes('philosophy')) return '🧠';
    if (s.includes('poetry')) return '🎭';
    if (s.includes('math')) return '📐';
    if (s.includes('medicine')) return '🏥';
    return '📚';
  };

  const performSearch = useCallback(async (q) => {
    const searchQ = q || query;
    if (!searchQ.trim()) { setResults(ALL_LOCAL); return; }
    setLoading(true);
    setError(null);
    Keyboard.dismiss();
    try {
      const res = await fetch(
        `https://openlibrary.org/search.json?q=${encodeURIComponent(searchQ)}&limit=30&fields=key,title,author_name,first_publish_year,subject,ratings_average,cover_i`
      );
      const data = await res.json();
      setTotal(data.numFound);
      const books = (data.docs || []).map(doc => ({
        id: doc.key?.replace('/works/', '') || String(Math.random()),
        title: doc.title || 'Unknown Title',
        author: doc.author_name?.[0] || 'Unknown Author',
        emoji: getEmoji(doc.subject),
        genre: doc.subject?.[0] || 'General',
        rating: doc.ratings_average ? Math.round(doc.ratings_average) : 4,
        year: doc.first_publish_year || '—',
        coverId: doc.cover_i,
      }));
      setResults(books.length ? books : ALL_LOCAL);
    } catch (e) {
      setError('Search error — showing local library');
      const local = ALL_LOCAL.filter(b =>
        b.title.toLowerCase().includes(searchQ.toLowerCase()) ||
        b.author.toLowerCase().includes(searchQ.toLowerCase())
      );
      setResults(local.length ? local : ALL_LOCAL);
    } finally {
      setLoading(false);
    }
  }, [query]);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>
          Discover <Text style={{ color: COLORS.gold }}>Books</Text>
        </Text>
        <TouchableOpacity onPress={() => navigation.navigate('Notifications')}>
          <Ionicons name="notifications-outline" size={22} color={COLORS.silver} />
        </TouchableOpacity>
      </View>

      {/* Search Input */}
      <View style={styles.searchWrap}>
        <Ionicons name="search-outline" size={18} color={COLORS.silver} />
        <TextInput
          style={styles.searchInput}
          placeholder="Title, author, topic, ISBN…"
          placeholderTextColor={COLORS.silver}
          value={query}
          onChangeText={setQuery}
          onSubmitEditing={() => performSearch()}
          returnKeyType="search"
          autoFocus={false}
        />
        {query.length > 0 && (
          <TouchableOpacity onPress={() => { setQuery(''); setResults(ALL_LOCAL); setTotal(null); }}>
            <Ionicons name="close-circle" size={18} color={COLORS.silver} />
          </TouchableOpacity>
        )}
        <TouchableOpacity onPress={() => performSearch()} style={styles.searchBtn}>
          <Text style={styles.searchBtnText}>GO</Text>
        </TouchableOpacity>
      </View>

      {/* Filters */}
      <FlatList
        data={FILTERS}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={i => i}
        style={{ maxHeight: 46 }}
        contentContainerStyle={{ paddingHorizontal: 20, gap: 8, paddingVertical: 6 }}
        renderItem={({ item }) => (
          <CategoryPill label={item} active={activeFilter === item} onPress={() => setActiveFilter(item)} />
        )}
      />

      {/* Status */}
      {total && !loading && (
        <Text style={styles.status}>
          {total.toLocaleString()} results for "{query}" across MOARL's global network
        </Text>
      )}
      {error && <Text style={styles.error}>{error}</Text>}

      {/* Results */}
      {loading ? (
        <View style={styles.loadingWrap}>
          <Text style={styles.loadingEmoji}>📚</Text>
          <Text style={styles.loadingText}>SEARCHING 247 WORLD LIBRARIES…</Text>
          <ActivityIndicator color={COLORS.gold} size="large" style={{ marginTop: 16 }} />
        </View>
      ) : (
        <FlatList
          data={results}
          numColumns={3}
          keyExtractor={(item, i) => `${item.id}-${i}`}
          contentContainerStyle={{ padding: 14, paddingBottom: 100 }}
          columnWrapperStyle={{ gap: 10, marginBottom: 14 }}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <View style={{ flex: 1, alignItems: 'center' }}>
              <BookCard
                book={item}
                size="small"
                onPress={() => navigation.navigate('BookDetail', { book: item })}
              />
            </View>
          )}
          ListEmptyComponent={
            <View style={styles.emptyWrap}>
              <Text style={{ fontSize: 48 }}>🔍</Text>
              <Text style={styles.emptyTitle}>No results found</Text>
              <Text style={styles.emptyBody}>Try a different search term or browse our curated collections</Text>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.void },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 14 },
  headerTitle: { fontFamily: 'CormorantGaramond_700Bold', fontSize: 26, color: COLORS.white },
  searchWrap: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: COLORS.panel, borderRadius: 14,
    borderWidth: 1, borderColor: COLORS.borderBright,
    marginHorizontal: 20, marginBottom: 10, paddingHorizontal: 14, gap: 10,
  },
  searchInput: { flex: 1, color: COLORS.snow, fontSize: 14, paddingVertical: 13 },
  searchBtn: { backgroundColor: COLORS.gold, paddingHorizontal: 12, paddingVertical: 7, borderRadius: 8 },
  searchBtnText: { color: COLORS.void, fontWeight: '800', fontSize: 11, letterSpacing: 1 },
  status: { fontSize: 11, color: COLORS.silver, marginHorizontal: 20, marginVertical: 8, marginBottom: 0 },
  error: { fontSize: 11, color: COLORS.amber, marginHorizontal: 20, marginBottom: 6 },
  loadingWrap: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 40 },
  loadingEmoji: { fontSize: 48, marginBottom: 16 },
  loadingText: { fontSize: 11, color: COLORS.silver, letterSpacing: 2 },
  emptyWrap: { alignItems: 'center', padding: 48 },
  emptyTitle: { fontFamily: 'CormorantGaramond_600SemiBold', fontSize: 22, color: COLORS.mist, marginTop: 16, marginBottom: 8 },
  emptyBody: { fontSize: 13, color: COLORS.silver, textAlign: 'center', lineHeight: 20 },
});
