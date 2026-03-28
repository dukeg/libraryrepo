import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
  FlatList, Animated, Dimensions, TextInput, StatusBar
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useApp, COLORS, BOOKS_DATA } from '../services/AppContext';
import BookCard from '../components/BookCard';
import CategoryPill from '../components/CategoryPill';

const { width } = Dimensions.get('window');

const CATEGORIES = [
  { id: 'all', label: 'All', icon: '📚' },
  { id: 'fiction', label: 'Fiction', icon: '📖' },
  { id: 'science', label: 'Science', icon: '🔬' },
  { id: 'history', label: 'History', icon: '⚔️' },
  { id: 'philosophy', label: 'Philosophy', icon: '🧠' },
  { id: 'technology', label: 'Technology', icon: '💻' },
  { id: 'art', label: 'Art', icon: '🎨' },
  { id: 'medicine', label: 'Medicine', icon: '🏥' },
  { id: 'biography', label: 'Biography', icon: '👤' },
  { id: 'children', label: "Children's", icon: '🧒' },
  { id: 'business', label: 'Business', icon: '💼' },
];

export default function HomeScreen({ navigation }) {
  const { user, unreadCount } = useApp();
  const insets = useSafeAreaInsets();
  const [activeCat, setActiveCat] = useState('all');
  const [searchText, setSearchText] = useState('');
  const [bookCount, setBookCount] = useState(50247831);
  const scrollY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const interval = setInterval(() => {
      setBookCount(n => n + Math.floor(Math.random() * 3));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const headerOpacity = scrollY.interpolate({ inputRange: [0, 80], outputRange: [0, 1], extrapolate: 'clamp' });

  const handleSearch = () => {
    if (searchText.trim()) {
      navigation.navigate('Discover', { query: searchText });
      setSearchText('');
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="light-content" />

      {/* Sticky header */}
      <Animated.View style={[styles.stickyHeader, { opacity: headerOpacity }]}>
        <LinearGradient colors={[COLORS.void, 'transparent']} style={StyleSheet.absoluteFill} />
        <Text style={styles.stickyTitle}>📚 MOARL</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Notifications')} style={styles.headerIcon}>
          <Ionicons name="notifications-outline" size={22} color={COLORS.gold} />
          {unreadCount > 0 && <View style={styles.badgeDot}><Text style={styles.badgeText}>{unreadCount}</Text></View>}
        </TouchableOpacity>
      </Animated.View>

      <Animated.ScrollView
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], { useNativeDriver: true })}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 32 }}
      >
        {/* Top Bar */}
        <View style={styles.topBar}>
          <View>
            <Text style={styles.greeting}>Good day, {user?.name?.split(' ')[0]} 👋</Text>
            <Text style={styles.subGreeting}>What will you read today?</Text>
          </View>
          <TouchableOpacity onPress={() => navigation.navigate('Profile')} style={styles.avatarBtn}>
            <LinearGradient colors={[COLORS.goldDim, COLORS.gold]} style={styles.avatar}>
              <Text style={styles.avatarText}>{user?.initials || 'GR'}</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View style={styles.searchBar}>
          <Ionicons name="search-outline" size={18} color={COLORS.silver} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search 50M+ books worldwide…"
            placeholderTextColor={COLORS.silver}
            value={searchText}
            onChangeText={setSearchText}
            onSubmitEditing={handleSearch}
            returnKeyType="search"
          />
          <TouchableOpacity onPress={handleSearch}>
            <Ionicons name="arrow-forward-circle" size={22} color={COLORS.gold} />
          </TouchableOpacity>
        </View>

        {/* Hero Banner */}
        <TouchableOpacity activeOpacity={0.95} onPress={() => navigation.navigate('AI')}>
          <LinearGradient
            colors={['#1a1040', '#2a0850', '#06060a']}
            style={styles.hero}
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
          >
            {/* Grid overlay */}
            <View style={styles.heroGrid} />
            <View style={styles.heroContent}>
              <View style={styles.liveTag}>
                <View style={styles.liveDot} />
                <Text style={styles.liveTagText}>LIVE — 247 LIBRARIES CONNECTED</Text>
              </View>
              <Text style={styles.heroTitle}>The{'\n'}<Text style={styles.heroTitleGold}>Mother</Text> of{'\n'}All Libraries</Text>
              <Text style={styles.heroSub}>50M+ books · Free access · DeepSeek AI</Text>
            </View>
            <View style={styles.heroStats}>
              {[
                [bookCount.toLocaleString(), 'Books'],
                ['247', 'Libraries'],
                ['FREE', 'Access'],
              ].map(([n, l]) => (
                <View key={l} style={styles.heroStatItem}>
                  <Text style={styles.heroStatNum}>{n}</Text>
                  <Text style={styles.heroStatLbl}>{l}</Text>
                </View>
              ))}
            </View>
          </LinearGradient>
        </TouchableOpacity>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          {[
            { icon: '🤖', label: 'AI Librarian', screen: 'AI', color: '#3010a0' },
            { icon: '⚡', label: 'DeepSeek', screen: 'DeepSeek', color: '#1a0840' },
            { icon: '🌍', label: 'Libraries', screen: 'Libraries', color: '#0a2040' },
            { icon: '📥', label: 'Downloads', screen: 'Shelf', color: '#0a3020' },
          ].map(({ icon, label, screen, color }) => (
            <TouchableOpacity key={label} style={[styles.quickBtn, { backgroundColor: color + '99' }]}
              onPress={() => navigation.navigate(screen)}>
              <Text style={styles.quickIcon}>{icon}</Text>
              <Text style={styles.quickLabel}>{label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Categories */}
        <FlatList
          data={CATEGORIES}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={i => i.id}
          style={styles.catList}
          contentContainerStyle={{ paddingHorizontal: 20, gap: 8 }}
          renderItem={({ item }) => (
            <CategoryPill
              label={`${item.icon} ${item.label}`}
              active={activeCat === item.id}
              onPress={() => setActiveCat(item.id)}
            />
          )}
        />

        {/* Featured Books */}
        <SectionHeader title="Featured This Week" onMore={() => navigation.navigate('Discover')} />
        <FlatList
          data={BOOKS_DATA.featured}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={i => i.id}
          contentContainerStyle={{ paddingHorizontal: 20, gap: 14 }}
          renderItem={({ item }) => (
            <BookCard book={item} onPress={() => navigation.navigate('BookDetail', { book: item })} />
          )}
        />

        {/* Trending Books */}
        <SectionHeader title="Trending Globally" onMore={() => navigation.navigate('Discover')} />
        <FlatList
          data={BOOKS_DATA.trending}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={i => i.id}
          contentContainerStyle={{ paddingHorizontal: 20, gap: 14 }}
          renderItem={({ item }) => (
            <BookCard book={item} onPress={() => navigation.navigate('BookDetail', { book: item })} />
          )}
        />

        {/* DeepSeek Banner */}
        <TouchableOpacity style={styles.deepseekBanner} onPress={() => navigation.navigate('DeepSeek')} activeOpacity={0.9}>
          <LinearGradient colors={['#16083a', '#0c0424']} style={styles.deepseekGrad}>
            <View style={styles.deepseekLeft}>
              <Text style={styles.deepseekIcon}>⚡</Text>
              <View>
                <Text style={styles.deepseekTitle}>DeepSeek AI Tools</Text>
                <Text style={styles.deepseekSub}>Book DNA · Research Agent · Knowledge Graph</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#c080ff" />
          </LinearGradient>
        </TouchableOpacity>

        {/* Classic Literature */}
        <SectionHeader title="Classic Literature" onMore={() => navigation.navigate('Discover')} />
        <FlatList
          data={BOOKS_DATA.classics}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={i => i.id}
          contentContainerStyle={{ paddingHorizontal: 20, gap: 14, paddingBottom: 4 }}
          renderItem={({ item }) => (
            <BookCard book={item} onPress={() => navigation.navigate('BookDetail', { book: item })} />
          )}
        />

      </Animated.ScrollView>
    </View>
  );
}

function SectionHeader({ title, onMore }) {
  const parts = title.split(' ');
  const last = parts.pop();
  return (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>
        {parts.join(' ')} <Text style={{ color: COLORS.gold }}>{last}</Text>
      </Text>
      <TouchableOpacity onPress={onMore}>
        <Text style={styles.sectionMore}>View All →</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.void },
  stickyHeader: {
    position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    padding: 16, paddingTop: 52,
  },
  stickyTitle: { fontFamily: 'CormorantGaramond_700Bold', fontSize: 22, color: COLORS.gold },
  headerIcon: { padding: 6, position: 'relative' },
  badgeDot: {
    position: 'absolute', top: 2, right: 2,
    width: 16, height: 16, borderRadius: 8,
    backgroundColor: COLORS.crimson,
    alignItems: 'center', justifyContent: 'center',
  },
  badgeText: { fontSize: 9, color: 'white', fontWeight: '700' },
  topBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, paddingBottom: 14 },
  greeting: { fontFamily: 'CormorantGaramond_700Bold', fontSize: 22, color: COLORS.snow },
  subGreeting: { fontSize: 12, color: COLORS.silver, marginTop: 2 },
  avatarBtn: { shadowColor: COLORS.gold, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.3, shadowRadius: 8 },
  avatar: { width: 42, height: 42, borderRadius: 21, alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontFamily: 'CormorantGaramond_700Bold', fontSize: 16, color: COLORS.void },
  searchBar: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: COLORS.panel, borderRadius: 14,
    borderWidth: 1, borderColor: COLORS.border,
    marginHorizontal: 20, marginBottom: 16, paddingHorizontal: 14, gap: 10,
  },
  searchInput: { flex: 1, color: COLORS.snow, fontSize: 14, paddingVertical: 13 },
  hero: { marginHorizontal: 20, borderRadius: 20, marginBottom: 20, overflow: 'hidden', borderWidth: 1, borderColor: COLORS.border },
  heroGrid: { position: 'absolute', inset: 0, opacity: 0.06 },
  heroContent: { padding: 24, paddingBottom: 0 },
  liveTag: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 12 },
  liveDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: '#4cff88' },
  liveTagText: { fontSize: 9, letterSpacing: 2, color: '#4cff88' },
  heroTitle: { fontFamily: 'CormorantGaramond_700Bold', fontSize: 34, color: COLORS.white, lineHeight: 40 },
  heroTitleGold: { color: COLORS.gold, fontFamily: 'CormorantGaramond_700Bold', fontStyle: 'italic' },
  heroSub: { fontSize: 12, color: COLORS.mist, marginTop: 8, marginBottom: 20 },
  heroStats: { flexDirection: 'row', borderTopWidth: 1, borderTopColor: COLORS.border },
  heroStatItem: { flex: 1, padding: 16, alignItems: 'center', borderRightWidth: 1, borderRightColor: COLORS.border },
  heroStatNum: { fontFamily: 'CormorantGaramond_700Bold', fontSize: 18, color: COLORS.gold },
  heroStatLbl: { fontSize: 9, color: COLORS.silver, letterSpacing: 1, marginTop: 2 },
  quickActions: { flexDirection: 'row', gap: 10, marginHorizontal: 20, marginBottom: 20 },
  quickBtn: { flex: 1, alignItems: 'center', paddingVertical: 14, borderRadius: 14, borderWidth: 1, borderColor: COLORS.border },
  quickIcon: { fontSize: 22, marginBottom: 4 },
  quickLabel: { fontSize: 10, color: COLORS.mist, letterSpacing: 0.5 },
  catList: { marginBottom: 20 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, marginBottom: 14, marginTop: 8 },
  sectionTitle: { fontFamily: 'CormorantGaramond_600SemiBold', fontSize: 20, color: COLORS.white },
  sectionMore: { fontSize: 12, color: COLORS.goldDim, borderBottomWidth: 1, borderBottomColor: COLORS.goldDim },
  deepseekBanner: { marginHorizontal: 20, borderRadius: 16, overflow: 'hidden', marginTop: 24, marginBottom: 8, borderWidth: 1, borderColor: 'rgba(120,60,240,0.3)' },
  deepseekGrad: { padding: 16 },
  deepseekLeft: { flexDirection: 'row', alignItems: 'center', gap: 14, flex: 1 },
  deepseekIcon: { fontSize: 32 },
  deepseekTitle: { fontSize: 15, color: '#c080ff', fontWeight: '700', marginBottom: 2 },
  deepseekSub: { fontSize: 11, color: COLORS.silver },
  deepseekBanner: { marginHorizontal: 20, borderRadius: 16, overflow: 'hidden', marginTop: 20, marginBottom: 20, borderWidth: 1, borderColor: 'rgba(120,60,240,0.3)' },
  deepseekGrad: { flexDirection: 'row', alignItems: 'center', padding: 18 },
});
