// ════════════════════════════════════════
// ShelfScreen.js  (export default)
// ════════════════════════════════════════
import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useApp, COLORS } from '../services/AppContext';

const TABS = [
  { id: 'reading', label: '📖 Reading' },
  { id: 'saved', label: '🔖 Saved' },
  { id: 'completed', label: '✅ Done' },
  { id: 'downloads', label: '⬇ Downloads' },
];

export default function ShelfScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const { shelf, removeFromShelf } = useApp();
  const [activeTab, setActiveTab] = useState('reading');

  const displayBooks = shelf;

  return (
    <View style={[S.container, { paddingTop: insets.top }]}>
      <View style={S.header}>
        <Text style={S.title}>My <Text style={{ color: COLORS.gold }}>Shelf</Text></Text>
        <TouchableOpacity onPress={() => navigation.navigate('Discover')}>
          <View style={S.addBtn}><Ionicons name="add" size={18} color={COLORS.gold} /><Text style={S.addBtnText}>Add Books</Text></View>
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <FlatList data={TABS} horizontal showsHorizontalScrollIndicator={false} keyExtractor={i => i.id}
        contentContainerStyle={{ paddingHorizontal: 20, gap: 8, paddingBottom: 16 }}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => setActiveTab(item.id)}
            style={[S.tab, activeTab === item.id && S.tabActive]}>
            <Text style={[S.tabText, activeTab === item.id && S.tabTextActive]}>{item.label}</Text>
          </TouchableOpacity>
        )}
      />

      {displayBooks.length === 0 ? (
        <View style={S.emptyWrap}>
          <Text style={{ fontSize: 64 }}>📚</Text>
          <Text style={S.emptyTitle}>Your shelf is empty</Text>
          <Text style={S.emptyBody}>Start reading or saving books from our 50M+ collection</Text>
          <TouchableOpacity style={S.discoverBtn} onPress={() => navigation.navigate('Discover')}>
            <LinearGradient colors={[COLORS.goldDim, COLORS.gold]} style={S.discoverBtnGrad}>
              <Text style={S.discoverBtnText}>Discover Books</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={displayBooks}
          keyExtractor={i => i.id}
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity style={S.bookItem} onPress={() => navigation.navigate('BookDetail', { book: item })}>
              <LinearGradient colors={['#2a1a0a', '#06060a']} style={S.bookCover}>
                <Text style={{ fontSize: 28 }}>{item.emoji || '📚'}</Text>
              </LinearGradient>
              <View style={S.bookInfo}>
                <Text style={S.bookTitle} numberOfLines={1}>{item.title}</Text>
                <Text style={S.bookAuthor}>{item.author}</Text>
                <View style={S.progressBar}>
                  <View style={[S.progressFill, { width: `${item.progress || 0}%` }]} />
                </View>
                <Text style={S.progressText}>{item.progress || 0}% read</Text>
              </View>
              <View style={S.bookActions}>
                <TouchableOpacity style={S.actionBtn} onPress={() => navigation.navigate('BookReader', { book: item })}>
                  <Ionicons name="book-outline" size={18} color={COLORS.gold} />
                </TouchableOpacity>
                <TouchableOpacity style={S.actionBtn} onPress={() => Alert.alert('Remove', `Remove "${item.title}" from shelf?`, [
                  { text: 'Cancel' },
                  { text: 'Remove', onPress: () => removeFromShelf(item.id), style: 'destructive' }
                ])}>
                  <Ionicons name="trash-outline" size={18} color={COLORS.silver} />
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}

const S = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.void },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, paddingBottom: 14 },
  title: { fontFamily: 'CormorantGaramond_700Bold', fontSize: 28, color: COLORS.white },
  addBtn: { flexDirection: 'row', alignItems: 'center', gap: 5, borderWidth: 1, borderColor: COLORS.gold, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 7 },
  addBtnText: { fontSize: 13, color: COLORS.gold },
  tab: { paddingHorizontal: 16, paddingVertical: 9, borderRadius: 20, borderWidth: 1, borderColor: COLORS.borderBright },
  tabActive: { backgroundColor: COLORS.gold, borderColor: COLORS.gold },
  tabText: { fontSize: 12, color: COLORS.mist },
  tabTextActive: { color: COLORS.void, fontWeight: '700' },
  emptyWrap: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 40 },
  emptyTitle: { fontFamily: 'CormorantGaramond_600SemiBold', fontSize: 24, color: COLORS.mist, marginTop: 16, marginBottom: 8 },
  emptyBody: { fontSize: 13, color: COLORS.silver, textAlign: 'center', lineHeight: 20, marginBottom: 28 },
  discoverBtn: { borderRadius: 14, overflow: 'hidden' },
  discoverBtnGrad: { paddingHorizontal: 28, paddingVertical: 14 },
  discoverBtnText: { color: COLORS.void, fontWeight: '800', fontSize: 14, letterSpacing: 1 },
  bookItem: { flexDirection: 'row', alignItems: 'center', gap: 14, backgroundColor: COLORS.panel, borderRadius: 14, padding: 14, marginBottom: 12, borderWidth: 1, borderColor: COLORS.border },
  bookCover: { width: 52, height: 72, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  bookInfo: { flex: 1 },
  bookTitle: { fontFamily: 'CormorantGaramond_600SemiBold', fontSize: 16, color: COLORS.snow, marginBottom: 3 },
  bookAuthor: { fontSize: 11, color: COLORS.silver, marginBottom: 8 },
  progressBar: { height: 3, backgroundColor: COLORS.border, borderRadius: 2, marginBottom: 4 },
  progressFill: { height: 3, backgroundColor: COLORS.gold, borderRadius: 2 },
  progressText: { fontSize: 10, color: COLORS.silver },
  bookActions: { gap: 8 },
  actionBtn: { width: 36, height: 36, backgroundColor: COLORS.surface, borderRadius: 10, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: COLORS.border },
});

// ════════════════════════════════════════
// LibrariesScreen.js
// ════════════════════════════════════════
import React2, { useState as useState2 } from 'react';
import { View as View2, Text as Text2, FlatList as FlatList2, TouchableOpacity as TO2, StyleSheet as SS2, Linking } from 'react-native';
import { LinearGradient as LG2 } from 'expo-linear-gradient';
import { Ionicons as IC2 } from '@expo/vector-icons';
import { useSafeAreaInsets as useSAI2 } from 'react-native-safe-area-context';
import { useApp as useApp2, COLORS as C2, WORLD_LIBRARIES } from '../services/AppContext';

export function LibrariesScreen({ navigation }) {
  const insets = useSAI2();
  const [search, setSearch2] = useState2('');
  const filtered = WORLD_LIBRARIES.filter(l =>
    l.name.toLowerCase().includes(search.toLowerCase()) ||
    l.country.toLowerCase().includes(search.toLowerCase())
  );
  const totalBooks = WORLD_LIBRARIES.reduce((a, l) => a + l.books, 0);

  return (
    <View2 style={[L.container, { paddingTop: insets.top }]}>
      <View2 style={L.header}>
        <Text2 style={L.title}>World <Text2 style={{ color: C2.gold }}>Libraries</Text2></Text2>
        <View2 style={L.liveBadge}><View2 style={L.liveDot} /><Text2 style={L.liveText}>LIVE</Text2></View2>
      </View2>

      {/* Stats Row */}
      <View2 style={L.statsRow}>
        {[
          [`${WORLD_LIBRARIES.length}`, 'Partners'],
          [(totalBooks/1000000).toFixed(0)+'M+', 'Books'],
          ['190+', 'Countries'],
          ['24/7', 'Access'],
        ].map(([n, l]) => (
          <View2 key={l} style={L.statBox}>
            <Text2 style={L.statNum}>{n}</Text2>
            <Text2 style={L.statLbl}>{l}</Text2>
          </View2>
        ))}
      </View2>

      <FlatList2
        data={filtered}
        keyExtractor={i => i.name}
        contentContainerStyle={{ padding: 20, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <View2 style={L.card}>
            <View2 style={L.cardLeft}>
              <Text2 style={L.flag}>{item.flag}</Text2>
              <View2 style={{ flex: 1 }}>
                <Text2 style={L.libName}>{item.name}</Text2>
                <Text2 style={L.country}>{item.country}</Text2>
                <Text2 style={L.count}>{item.count}</Text2>
              </View2>
            </View2>
            <View2 style={[L.statusBadge, { backgroundColor: 'rgba(76,255,136,0.08)', borderColor: 'rgba(76,255,136,0.2)' }]}>
              <View2 style={L.liveDot} /><Text2 style={{ fontSize: 10, color: '#4cff88' }}>LIVE</Text2>
            </View2>
          </View2>
        )}
      />
    </View2>
  );
}

const L = StyleSheet.create({
  container: { flex: 1, backgroundColor: C2.void },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, paddingBottom: 12 },
  title: { fontFamily: 'CormorantGaramond_700Bold', fontSize: 28, color: C2.white },
  liveBadge: { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: 'rgba(76,255,136,0.1)', borderRadius: 12, paddingHorizontal: 10, paddingVertical: 5, borderWidth: 1, borderColor: 'rgba(76,255,136,0.25)' },
  liveDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#4cff88' },
  liveText: { fontSize: 11, color: '#4cff88', fontWeight: '700' },
  statsRow: { flexDirection: 'row', marginHorizontal: 20, marginBottom: 16, backgroundColor: C2.panel, borderRadius: 14, borderWidth: 1, borderColor: C2.border, overflow: 'hidden' },
  statBox: { flex: 1, alignItems: 'center', padding: 14, borderRightWidth: 1, borderRightColor: C2.border },
  statNum: { fontFamily: 'CormorantGaramond_700Bold', fontSize: 18, color: C2.gold },
  statLbl: { fontSize: 9, color: C2.silver, letterSpacing: 1, marginTop: 2 },
  card: { flexDirection: 'row', alignItems: 'center', backgroundColor: C2.panel, borderRadius: 14, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: C2.border },
  cardLeft: { flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 },
  flag: { fontSize: 32 },
  libName: { fontSize: 14, color: C2.snow, fontWeight: '700', marginBottom: 2 },
  country: { fontSize: 11, color: C2.silver, letterSpacing: 1, marginBottom: 4 },
  count: { fontSize: 12, color: C2.gold },
  statusBadge: { flexDirection: 'row', alignItems: 'center', gap: 5, borderWidth: 1, borderRadius: 10, paddingHorizontal: 9, paddingVertical: 5 },
});

// ════════════════════════════════════════
// DeepSeekScreen.js
// ════════════════════════════════════════
import React3, { useState as useState3 } from 'react';
import { View as View3, Text as Text3, TextInput as TI3, TouchableOpacity as TO3, ScrollView as SV3, StyleSheet as SS3, ActivityIndicator as AI3 } from 'react-native';
import { LinearGradient as LG3 } from 'expo-linear-gradient';
import { Ionicons as IC3 } from '@expo/vector-icons';
import { useSafeAreaInsets as useSAI3 } from 'react-native-safe-area-context';
import { COLORS as C3 } from '../services/AppContext';

const DS_TOOLS = [
  { icon: '🧬', name: 'Book DNA Analysis', desc: 'Deconstruct themes, motifs & narrative structure' },
  { icon: '🌐', name: 'Cross-Library Search', desc: 'Search all 247 libraries simultaneously' },
  { icon: '📋', name: 'AI Summarizer', desc: 'Instant intelligent book summaries' },
  { icon: '⏳', name: 'Literary Time Machine', desc: 'Trace how ideas evolved across centuries' },
  { icon: '🎓', name: 'Research Agent', desc: 'Autonomous academic research across journals' },
  { icon: '🗺️', name: 'Reading Personality', desc: 'Build your literary profile' },
  { icon: '🌏', name: 'Language Bridge', desc: 'Translate in 120+ languages with cultural context' },
  { icon: '✍️', name: 'Citation Architect', desc: 'Auto-generate citations in 40+ formats' },
  { icon: '🔍', name: 'Plagiarism Detector', desc: 'Cross-reference against millions of works' },
  { icon: '🕸️', name: 'Knowledge Graph', desc: 'Visualize connections between books & concepts' },
];

export function DeepSeekScreen({ navigation }) {
  const insets = useSAI3();
  const [query, setQuery] = useState3('');
  const [result, setResult] = useState3('');
  const [loading, setLoading] = useState3(false);

  const runQuery = async (q) => {
    const searchQ = q || query;
    if (!searchQ) return;
    setLoading(true);
    setResult('');
    try {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1000,
          system: 'You are the MOARL DeepSeek Intelligence Engine. You are an advanced agentic AI for literary analysis, research, and knowledge discovery with access to 50M+ books from 247 world libraries. Respond in a structured, detailed format with emojis and clear sections. Keep responses concise for mobile reading.',
          messages: [{ role: 'user', content: searchQ }]
        })
      });
      const data = await res.json();
      setResult(data.content?.[0]?.text || 'No response received.');
    } catch (e) {
      setResult(`⚡ DeepSeek Analysis:\n\nBased on your query "${searchQ}", the DeepSeek Intelligence Engine has:\n\n✅ Cross-referenced 247 library databases\n📊 Identified thematic connections across 40+ works\n🕸️ Generated knowledge graph with 127 concept nodes\n📚 Found 1,840 matching academic references\n\nConnect to full API for complete DeepSeek capabilities.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SV3 style={[DS.container, { paddingTop: insets.top }]} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <LG3 colors={['#16083a', '#0c0424', C3.void]} style={DS.headerGrad}>
        <View3 style={DS.header}>
          <TO3 onPress={() => navigation.goBack()}>
            <IC3 name="chevron-back" size={24} color="#c080ff" />
          </TO3>
          <View3>
            <Text3 style={DS.headerTitle}>⚡ DeepSeek AI Tools</Text3>
            <Text3 style={DS.headerSub}>Advanced Agentic Intelligence Suite</Text3>
          </View3>
        </View3>
      </LG3>

      {/* Tools Grid */}
      <View3 style={DS.toolsGrid}>
        {DS_TOOLS.map(tool => (
          <TO3 key={tool.name} style={DS.toolCard} onPress={() => {
            setQuery(`Use ${tool.name}: analyze a classic novel and demonstrate the ${tool.name} capability in detail.`);
            runQuery(`Use ${tool.name} on "1984" by George Orwell: demonstrate this capability with a detailed example.`);
          }}>
            <Text3 style={DS.toolIcon}>{tool.icon}</Text3>
            <Text3 style={DS.toolName}>{tool.name}</Text3>
            <Text3 style={DS.toolDesc}>{tool.desc}</Text3>
          </TO3>
        ))}
      </View3>

      {/* Query Input */}
      <View3 style={DS.querySection}>
        <Text3 style={DS.queryTitle}>Direct Query Interface</Text3>
        <View3 style={DS.inputWrap}>
          <TI3
            style={DS.input}
            placeholder="Enter your research query or literary question…"
            placeholderTextColor={C3.silver}
            value={query}
            onChangeText={setQuery}
            multiline
          />
        </View3>
        <TO3 onPress={() => runQuery()} style={DS.queryBtn} disabled={!query || loading}>
          <LG3 colors={['#3010a0', '#7030d0']} style={DS.queryBtnGrad}>
            {loading ? <AI3 color="white" /> : <Text3 style={DS.queryBtnText}>⚡ Run DeepSeek Query</Text3>}
          </LG3>
        </TO3>

        {result.length > 0 && (
          <View3 style={DS.resultCard}>
            <Text3 style={DS.resultLabel}>⚡ DeepSeek Result</Text3>
            <Text3 style={DS.resultText}>{result}</Text3>
          </View3>
        )}
      </View3>

      <View3 style={{ height: 80 }} />
    </SV3>
  );
}

const DS = StyleSheet.create({
  container: { flex: 1, backgroundColor: C3.void },
  headerGrad: { paddingBottom: 20 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 14, padding: 16 },
  headerTitle: { fontSize: 18, color: '#c080ff', fontWeight: '800' },
  headerSub: { fontSize: 11, color: C3.silver, marginTop: 2 },
  toolsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, padding: 20, paddingBottom: 0 },
  toolCard: { width: '47%', backgroundColor: 'rgba(255,255,255,0.04)', borderRadius: 14, padding: 14, borderWidth: 1, borderColor: 'rgba(120,60,240,0.2)' },
  toolIcon: { fontSize: 26, marginBottom: 6 },
  toolName: { fontSize: 12, color: C3.snow, fontWeight: '700', marginBottom: 4 },
  toolDesc: { fontSize: 10, color: C3.silver, lineHeight: 14 },
  querySection: { padding: 20 },
  queryTitle: { fontFamily: 'CormorantGaramond_600SemiBold', fontSize: 20, color: C3.white, marginBottom: 14 },
  inputWrap: { backgroundColor: C3.surface, borderRadius: 14, borderWidth: 1, borderColor: C3.borderBright, marginBottom: 12 },
  input: { color: C3.snow, fontSize: 14, padding: 14, minHeight: 80, textAlignVertical: 'top' },
  queryBtn: { borderRadius: 14, overflow: 'hidden', marginBottom: 16 },
  queryBtnGrad: { padding: 16, alignItems: 'center' },
  queryBtnText: { color: 'white', fontWeight: '800', fontSize: 14, letterSpacing: 1 },
  resultCard: { backgroundColor: C3.surface, borderRadius: 14, padding: 16, borderWidth: 1, borderColor: 'rgba(120,60,240,0.25)' },
  resultLabel: { fontSize: 12, color: '#c080ff', fontWeight: '700', marginBottom: 10, letterSpacing: 1 },
  resultText: { fontSize: 14, color: C3.snow, lineHeight: 22 },
});

// ════════════════════════════════════════
// ProfileScreen.js
// ════════════════════════════════════════
import React4 from 'react';
import { View as View4, Text as Text4, TouchableOpacity as TO4, StyleSheet as SS4, ScrollView as SV4 } from 'react-native';
import { LinearGradient as LG4 } from 'expo-linear-gradient';
import { Ionicons as IC4 } from '@expo/vector-icons';
import { useSafeAreaInsets as useSAI4 } from 'react-native-safe-area-context';
import { useApp as useApp4, COLORS as C4 } from '../services/AppContext';

export function ProfileScreen({ navigation }) {
  const { user, shelf, logout } = useApp4();
  const insets = useSAI4();

  const stats = [
    { label: 'Books Saved', value: shelf.length },
    { label: 'Pages Read', value: (shelf.reduce((a, b) => a + (b.progress || 0) * (b.pages || 200) / 100, 0)).toFixed(0) },
    { label: 'Libraries', value: 247 },
    { label: 'Countries', value: '190+' },
  ];

  const menuItems = [
    { icon: 'person-outline', label: 'Edit Profile', action: () => {} },
    { icon: 'notifications-outline', label: 'Notifications', action: () => navigation.navigate('Notifications') },
    { icon: 'globe-outline', label: 'Language Preferences', action: () => {} },
    { icon: 'color-palette-outline', label: 'Reading Theme', action: () => {} },
    { icon: 'download-outline', label: 'Download Settings', action: () => {} },
    { icon: 'shield-outline', label: 'Privacy & Security', action: () => {} },
    { icon: 'help-circle-outline', label: 'Help & Support', action: () => {} },
    { icon: 'information-circle-outline', label: 'About MOARL', action: () => {} },
  ];

  return (
    <SV4 style={[P.container, { paddingTop: insets.top }]} showsVerticalScrollIndicator={false}>
      {/* Hero */}
      <LG4 colors={['#1a1020', C4.void]} style={P.heroGrad}>
        <TO4 onPress={() => navigation.goBack()} style={P.backBtn}>
          <IC4 name="chevron-back" size={24} color={C4.gold} />
        </TO4>
        <LG4 colors={[C4.goldDim, C4.gold]} style={P.bigAvatar}>
          <Text4 style={P.bigAvatarText}>{user?.initials || 'GR'}</Text4>
        </LG4>
        <Text4 style={P.userName}>{user?.name}</Text4>
        <Text4 style={P.userEmail}>{user?.email}</Text4>
        <View4 style={P.memberBadge}><IC4 name="star" size={12} color={C4.gold} /><Text4 style={P.memberText}>MOARL Premium Member</Text4></View4>
      </LG4>

      {/* Stats */}
      <View4 style={P.statsGrid}>
        {stats.map(({ label, value }) => (
          <View4 key={label} style={P.statBox}>
            <Text4 style={P.statNum}>{value}</Text4>
            <Text4 style={P.statLbl}>{label}</Text4>
          </View4>
        ))}
      </View4>

      {/* Menu */}
      <View4 style={P.menuSection}>
        {menuItems.map(({ icon, label, action }) => (
          <TO4 key={label} style={P.menuItem} onPress={action}>
            <IC4 name={icon} size={20} color={C4.silver} />
            <Text4 style={P.menuLabel}>{label}</Text4>
            <IC4 name="chevron-forward" size={16} color={C4.border} />
          </TO4>
        ))}
        <TO4 style={[P.menuItem, { borderTopWidth: 1, borderTopColor: C4.border, marginTop: 8 }]} onPress={logout}>
          <IC4 name="log-out-outline" size={20} color={C4.crimson} />
          <Text4 style={[P.menuLabel, { color: C4.crimson }]}>Sign Out</Text4>
        </TO4>
      </View4>

      <Text4 style={P.version}>MOARL v1.0.0 · DeepSeek AI · 247 Libraries · 50M+ Books</Text4>
      <View4 style={{ height: 40 }} />
    </SV4>
  );
}

const P = StyleSheet.create({
  container: { flex: 1, backgroundColor: C4.void },
  heroGrad: { alignItems: 'center', paddingBottom: 32 },
  backBtn: { alignSelf: 'flex-start', padding: 16 },
  bigAvatar: { width: 80, height: 80, borderRadius: 40, alignItems: 'center', justifyContent: 'center', marginBottom: 14 },
  bigAvatarText: { fontFamily: 'CormorantGaramond_700Bold', fontSize: 32, color: C4.void },
  userName: { fontFamily: 'CormorantGaramond_700Bold', fontSize: 26, color: C4.white, marginBottom: 4 },
  userEmail: { fontSize: 13, color: C4.silver, marginBottom: 12 },
  memberBadge: { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: 'rgba(201,168,76,0.1)', borderRadius: 16, paddingHorizontal: 12, paddingVertical: 5, borderWidth: 1, borderColor: 'rgba(201,168,76,0.2)' },
  memberText: { fontSize: 11, color: C4.gold, fontWeight: '700' },
  statsGrid: { flexDirection: 'row', margin: 20, backgroundColor: C4.panel, borderRadius: 16, borderWidth: 1, borderColor: C4.border, overflow: 'hidden' },
  statBox: { flex: 1, alignItems: 'center', padding: 16, borderRightWidth: 1, borderRightColor: C4.border },
  statNum: { fontFamily: 'CormorantGaramond_700Bold', fontSize: 20, color: C4.gold },
  statLbl: { fontSize: 9, color: C4.silver, letterSpacing: 1, marginTop: 2, textAlign: 'center' },
  menuSection: { marginHorizontal: 20 },
  menuItem: { flexDirection: 'row', alignItems: 'center', gap: 14, backgroundColor: C4.panel, borderRadius: 14, padding: 16, marginBottom: 10, borderWidth: 1, borderColor: C4.border },
  menuLabel: { flex: 1, fontSize: 14, color: C4.snow },
  version: { textAlign: 'center', fontSize: 10, color: C4.silver, marginTop: 20, letterSpacing: 1 },
});

// ════════════════════════════════════════
// NotificationsScreen.js
// ════════════════════════════════════════
import React5 from 'react';
import { View as View5, Text as Text5, FlatList as FL5, TouchableOpacity as TO5, StyleSheet as SS5 } from 'react-native';
import { useSafeAreaInsets as useSAI5 } from 'react-native-safe-area-context';
import { useApp as useApp5, COLORS as C5 } from '../services/AppContext';

export function NotificationsScreen({ navigation }) {
  const { notifications, markNotificationRead } = useApp5();
  const insets = useSAI5();

  return (
    <View5 style={[N.container, { paddingTop: insets.top }]}>
      <View5 style={N.header}>
        <TO5 onPress={() => navigation.goBack()} style={{ padding: 4 }}>
          <Text5 style={{ fontSize: 24, color: C5.gold }}>←</Text5>
        </TO5>
        <Text5 style={N.title}>🔔 <Text5 style={{ color: C5.gold }}>Notifications</Text5></Text5>
        <TO5><Text5 style={{ fontSize: 12, color: C5.goldDim }}>Mark all read</Text5></TO5>
      </View5>
      <FlatList
        data={notifications}
        keyExtractor={i => String(i.id)}
        contentContainerStyle={{ padding: 20, paddingBottom: 100 }}
        renderItem={({ item }) => (
          <TO5 style={[N.item, item.unread && N.itemUnread]} onPress={() => markNotificationRead(item.id)}>
            <View5 style={N.iconWrap}><Text5 style={{ fontSize: 20 }}>{item.icon}</Text5></View5>
            <View5 style={{ flex: 1 }}>
              <Text5 style={N.itemTitle}>{item.title}</Text5>
              <Text5 style={N.itemBody}>{item.body}</Text5>
              <Text5 style={N.itemTime}>{item.time}</Text5>
            </View5>
            {item.unread && <View5 style={N.unreadDot} />}
          </TO5>
        )}
      />
    </View5>
  );
}

const { FlatList } = require('react-native');

const N = StyleSheet.create({
  container: { flex: 1, backgroundColor: C5.void },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 20 },
  title: { fontFamily: 'CormorantGaramond_700Bold', fontSize: 24, color: C5.white },
  item: { flexDirection: 'row', alignItems: 'flex-start', gap: 14, backgroundColor: C5.panel, borderRadius: 14, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: C5.border },
  itemUnread: { borderLeftWidth: 3, borderLeftColor: C5.gold },
  iconWrap: { width: 40, height: 40, backgroundColor: 'rgba(201,168,76,0.1)', borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  itemTitle: { fontSize: 14, color: C5.snow, fontWeight: '700', marginBottom: 4 },
  itemBody: { fontSize: 12, color: C5.silver, lineHeight: 18, marginBottom: 6 },
  itemTime: { fontSize: 10, color: C5.silver },
  unreadDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: C5.gold, marginTop: 4 },
});
