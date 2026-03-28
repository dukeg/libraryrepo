import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
  Animated, StatusBar, ActivityIndicator, Share
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useApp, COLORS } from '../services/AppContext';

const THEMES = {
  dark: { bg: '#06060a', text: '#d8d8e8', heading: '#f4f4ff', accent: '#c9a84c' },
  sepia: { bg: '#f5ede0', text: '#3a2a1a', heading: '#1a1008', accent: '#8B4513' },
  light: { bg: '#fafafa', text: '#1a1a2a', heading: '#000010', accent: '#1a4a8b' },
};

function generateContent(book) {
  return [
    { type: 'title', text: book.title },
    { type: 'author', text: `by ${book.author}` },
    { type: 'meta', text: `${book.genre || 'Literature'} · ${book.year || 'Classic'} · Free on MOARL` },
    { type: 'quote', text: '"A reader lives a thousand lives before he dies. The man who never reads lives only one." — George R.R. Martin' },
    { type: 'heading', text: 'Preface' },
    { type: 'para', text: `Welcome to this MOARL edition of "${book.title}" by ${book.author}. This work has been digitized and made universally accessible through MOARL's global library network — connecting 247 world libraries and 50 million books to readers in 190+ countries, absolutely free.` },
    { type: 'para', text: `"${book.title}" stands as one of the defining works of ${book.genre || 'literature'}. First published in ${book.year || 'a formative era'}, it has shaped literary conversation for generations, inspiring scholars, writers, and readers worldwide.` },
    { type: 'heading', text: 'Chapter I — The Opening' },
    { type: 'para', text: `The world of "${book.title}" unfolds with deliberate precision. ${book.author} constructs a narrative landscape where every detail carries weight and every word earns its place. The opening passages signal what kind of work this will be — one that demands full attention and rewards careful reading.` },
    { type: 'para', text: `What distinguishes this work from its contemporaries is the quality of its attention to the human interior. ${book.author} is interested not merely in what characters do, but in why — the psychological geography that maps desire, fear, ambition, and love onto the surface of everyday life.` },
    { type: 'para', text: `The prose rhythm is unmistakably the author's own: sentences that build with patient deliberateness, subordinate clauses weighted with meaning, dialogue that reveals character through what is left unsaid as much as what is spoken. This is writing that understands silence.` },
    { type: 'heading', text: 'Chapter II — Development' },
    { type: 'para', text: `As the narrative develops, we become aware of the central tension that will propel the work to its conclusion. ${book.author} is too sophisticated a writer to reduce this tension to a simple conflict — it ramifies through every relationship, every conversation, every moment of solitude.` },
    { type: 'para', text: `The secondary characters emerge with surprising fullness. Minor figures who appear briefly in the early chapters return transformed, their trajectories illuminating aspects of the central theme from unexpected angles. This is the mark of a writer in full command of a complex fictional world.` },
    { type: 'quote', text: '"The books that the world calls immoral are books that show the world its own shame." — Oscar Wilde' },
    { type: 'heading', text: 'Chapter III — The Crisis' },
    { type: 'para', text: `The middle section of the work is where ${book.author}'s gifts are most fully on display. The pacing shifts — urgent passages of action alternate with extended interior monologue, and the reader begins to sense the approach of the crisis that the opening chapters have prepared.` },
    { type: 'para', text: `There is a particular quality to the writing here — a controlled intensity, as though the author is holding something back, releasing it in carefully measured doses. The reader feels the pressure building. This is the architecture of a master storyteller.` },
    { type: 'heading', text: 'Chapter IV — Resolution' },
    { type: 'para', text: `The conclusion of "${book.title}" is among the most discussed in the literature of its genre. ${book.author} refuses the comforting resolution — the ending that would confirm our expectations and leave us secure in our pre-existing beliefs. Instead, we are left with something richer and more troubling.` },
    { type: 'para', text: `The final pages linger. We find ourselves returning to earlier passages, reading them differently in the light of what we now know. This is the signature of great literature: it changes us, however slightly, in our understanding of ourselves and the world we inhabit.` },
    { type: 'para', text: `This MOARL edition is provided free of charge to all readers worldwide. We believe that access to great literature is a fundamental human right, not a privilege. Read freely. Share widely. The library of humanity belongs to everyone.` },
  ];
}

export default function BookReaderScreen({ navigation, route }) {
  const { book } = route.params;
  const { addToShelf, updateProgress } = useApp();
  const insets = useSafeAreaInsets();
  const [theme, setTheme] = useState('dark');
  const [fontSize, setFontSize] = useState(17);
  const [progress, setProgress] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const [content] = useState(() => generateContent(book));
  const controlsAnim = useRef(new Animated.Value(1)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;

  const T = THEMES[theme];

  useEffect(() => { addToShelf(book); }, []);

  const toggleControls = () => {
    setShowControls(prev => {
      Animated.timing(controlsAnim, { toValue: prev ? 0 : 1, duration: 200, useNativeDriver: true }).start();
      return !prev;
    });
  };

  const cycleTheme = () => setTheme(t => t === 'dark' ? 'sepia' : t === 'sepia' ? 'light' : 'dark');

  const handleScroll = (e) => {
    const { contentOffset, contentSize, layoutMeasurement } = e.nativeEvent;
    const pct = Math.min(100, Math.round((contentOffset.y / (contentSize.height - layoutMeasurement.height)) * 100));
    setProgress(pct);
    updateProgress(book.id, pct);
    Animated.timing(progressAnim, { toValue: pct / 100, duration: 200, useNativeDriver: false }).start();
  };

  const renderBlock = (block, i) => {
    switch (block.type) {
      case 'title': return <Text key={i} style={[styles.titleText, { color: T.heading, fontSize: 30 }]}>{block.text}</Text>;
      case 'author': return <Text key={i} style={[styles.authorText, { color: T.accent }]}>{block.text}</Text>;
      case 'meta': return <Text key={i} style={[styles.metaText, { color: T.text, opacity: 0.5 }]}>{block.text}</Text>;
      case 'heading': return <Text key={i} style={[styles.headingText, { color: T.accent, borderBottomColor: T.accent + '40' }]}>{block.text}</Text>;
      case 'para': return <Text key={i} style={[styles.paraText, { color: T.text, fontSize }]}>{block.text}</Text>;
      case 'quote': return (
        <View key={i} style={[styles.quoteBlock, { borderLeftColor: T.accent }]}>
          <Text style={[styles.quoteText, { color: T.text, opacity: 0.75, fontSize: fontSize - 1 }]}>{block.text}</Text>
        </View>
      );
      default: return null;
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: T.bg }]}>
      <StatusBar barStyle={theme === 'light' ? 'dark-content' : 'light-content'} backgroundColor={T.bg} />

      {/* Top Bar */}
      <Animated.View style={[styles.topBar, { backgroundColor: T.bg + 'f0', opacity: controlsAnim, paddingTop: insets.top }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.closeBtn}>
          <Ionicons name="chevron-down" size={24} color={T.accent} />
        </TouchableOpacity>
        <View style={{ flex: 1, alignItems: 'center' }}>
          <Text style={[styles.topTitle, { color: T.heading }]} numberOfLines={1}>{book.title}</Text>
          <Text style={[styles.progressText, { color: T.text, opacity: 0.5 }]}>{progress}% read</Text>
        </View>
        <View style={styles.topActions}>
          <TouchableOpacity onPress={cycleTheme} style={styles.ctrlBtn}>
            <Ionicons name="color-palette-outline" size={20} color={T.accent} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => Share.share({ message: `📚 Reading "${book.title}" free on MOARL!` })} style={styles.ctrlBtn}>
            <Ionicons name="share-outline" size={20} color={T.text + 'aa'} />
          </TouchableOpacity>
        </View>
      </Animated.View>

      {/* Font Controls */}
      <Animated.View style={[styles.fontBar, { backgroundColor: T.bg + 'e0', borderBottomColor: T.accent + '20', opacity: controlsAnim }]}>
        <TouchableOpacity onPress={() => setFontSize(f => Math.max(13, f - 1))} style={styles.fontBtn}>
          <Text style={[styles.fontBtnText, { color: T.text }]}>A-</Text>
        </TouchableOpacity>
        <Text style={[styles.fontSizeLabel, { color: T.text, opacity: 0.4 }]}>{fontSize}px</Text>
        <TouchableOpacity onPress={() => setFontSize(f => Math.min(24, f + 1))} style={styles.fontBtn}>
          <Text style={[styles.fontBtnText, { color: T.text }]}>A+</Text>
        </TouchableOpacity>
      </Animated.View>

      {/* Content */}
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={[styles.content, { paddingTop: showControls ? 100 : 24 }]}
        onScroll={handleScroll}
        scrollEventThrottle={32}
        showsVerticalScrollIndicator={false}
        onTouchEnd={toggleControls}
      >
        {content.map(renderBlock)}
        <View style={{ height: 80 }} />
      </ScrollView>

      {/* Progress Bar */}
      <Animated.View style={[styles.progressBar, { backgroundColor: T.bg }]}>
        <Animated.View style={[styles.progressFill, {
          width: progressAnim.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] }),
          backgroundColor: T.accent,
        }]} />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  topBar: { position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10, flexDirection: 'row', alignItems: 'center', padding: 14, paddingBottom: 10, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.06)' },
  closeBtn: { padding: 4 },
  topTitle: { fontSize: 13, fontWeight: '600' },
  progressText: { fontSize: 10, marginTop: 2 },
  topActions: { flexDirection: 'row', gap: 4 },
  ctrlBtn: { padding: 8 },
  fontBar: { position: 'absolute', top: 84, left: 0, right: 0, zIndex: 9, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 16, paddingVertical: 8, borderBottomWidth: 1 },
  fontBtn: { padding: 8 },
  fontBtnText: { fontSize: 14, fontWeight: '700' },
  fontSizeLabel: { fontSize: 11 },
  content: { paddingHorizontal: 26, paddingBottom: 48 },
  titleText: { fontFamily: 'CormorantGaramond_700Bold', marginTop: 20, marginBottom: 10, lineHeight: 36, textAlign: 'center' },
  authorText: { fontSize: 15, fontStyle: 'italic', textAlign: 'center', marginBottom: 6 },
  metaText: { fontSize: 11, textAlign: 'center', letterSpacing: 1, marginBottom: 32 },
  headingText: { fontFamily: 'CormorantGaramond_600SemiBold', fontSize: 22, marginTop: 36, marginBottom: 16, paddingBottom: 10, borderBottomWidth: 1 },
  paraText: { lineHeight: 30, marginBottom: 20, fontFamily: 'CormorantGaramond_400Regular' },
  quoteBlock: { borderLeftWidth: 3, paddingLeft: 18, marginVertical: 24 },
  quoteText: { fontFamily: 'CormorantGaramond_400Regular', fontStyle: 'italic', lineHeight: 28 },
  progressBar: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 3 },
  progressFill: { height: 3, borderRadius: 1.5 },
});
