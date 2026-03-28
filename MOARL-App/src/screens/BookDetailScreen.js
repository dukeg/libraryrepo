// ════════════════════════════════════════════════════
// BookDetailScreen.js
// ════════════════════════════════════════════════════
import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Share, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useApp, COLORS } from '../services/AppContext';

export default function BookDetailScreen({ navigation, route }) {
  const { book } = route.params;
  const { addToShelf, shelf } = useApp();
  const insets = useSafeAreaInsets();
  const isSaved = shelf.some(b => b.id === book.id);

  const details = [
    { label: 'Genre', value: book.genre || 'Literature' },
    { label: 'Year', value: book.year || 'Classic' },
    { label: 'Pages', value: book.pages ? `${book.pages} pages` : 'N/A' },
    { label: 'Language', value: book.language || 'English' },
    { label: 'Rating', value: '★'.repeat(book.rating || 4) + '☆'.repeat(5 - (book.rating || 4)) },
    { label: 'Downloads', value: book.downloads || '1M+' },
  ];

  const handleShare = () => Share.share({ message: `📚 Reading "${book.title}" by ${book.author} on MOARL — the world's largest free digital library!\n\nGet it free at moarl.world` });

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Hero */}
        <LinearGradient colors={['#1a1010', '#0a0a1a', COLORS.void]} style={styles.hero}>
          <View style={styles.heroNav}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
              <Ionicons name="chevron-back" size={24} color={COLORS.gold} />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleShare}>
              <Ionicons name="share-outline" size={22} color={COLORS.silver} />
            </TouchableOpacity>
          </View>
          <View style={styles.coverWrap}>
            <LinearGradient colors={['#3a1a10', '#0a0508']} style={styles.bigCover}>
              <LinearGradient colors={[COLORS.goldDim, COLORS.goldBright, COLORS.goldDim]} style={styles.bigSpine} start={{x:0,y:0}} end={{x:0,y:1}} />
              <Text style={styles.bigEmoji}>{book.emoji || '📚'}</Text>
              <Text style={styles.bigCoverTitle} numberOfLines={3}>{book.title}</Text>
            </LinearGradient>
          </View>
          <Text style={styles.bookTitle}>{book.title}</Text>
          <Text style={styles.bookAuthor}>by {book.author}</Text>
          <View style={styles.ratingRow}>
            <Text style={styles.starsText}>{'★'.repeat(book.rating || 4)}</Text>
            <View style={styles.freeBadge}><Text style={styles.freeBadgeText}>FREE ACCESS</Text></View>
          </View>
        </LinearGradient>

        {/* Action Buttons */}
        <View style={styles.actions}>
          <TouchableOpacity style={styles.readBtn} onPress={() => navigation.navigate('BookReader', { book })}>
            <LinearGradient colors={[COLORS.goldDim, COLORS.gold]} style={styles.readBtnGrad} start={{x:0,y:0}} end={{x:1,y:0}}>
              <Ionicons name="book-outline" size={18} color={COLORS.void} />
              <Text style={styles.readBtnText}>READ NOW</Text>
            </LinearGradient>
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconBtn} onPress={() => { addToShelf(book); Alert.alert('Saved!', `"${book.title}" added to your shelf.`); }}>
            <Ionicons name={isSaved ? 'bookmark' : 'bookmark-outline'} size={22} color={isSaved ? COLORS.gold : COLORS.silver} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconBtn} onPress={handleShare}>
            <Ionicons name="share-outline" size={22} color={COLORS.silver} />
          </TouchableOpacity>
        </View>

        {/* Details Grid */}
        <View style={styles.detailsGrid}>
          {details.map(({ label, value }) => (
            <View key={label} style={styles.detailItem}>
              <Text style={styles.detailLabel}>{label}</Text>
              <Text style={styles.detailValue}>{value}</Text>
            </View>
          ))}
        </View>

        {/* About */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About This Book</Text>
          <Text style={styles.sectionBody}>
            {`"${book.title}" by ${book.author} is a landmark work of ${book.genre || 'literature'}, first published in ${book.year || 'an important year'}. Available free through MOARL's global library network, this work has been read by millions of readers across 190+ countries.\n\nMOARL provides universal, barrier-free access to the world's greatest literature, ensuring knowledge reaches every reader regardless of geography or circumstance.`}
          </Text>
        </View>

        {/* Library Source */}
        <View style={styles.sourceCard}>
          <Text style={styles.sourceTitle}>🌍 Available From</Text>
          <View style={styles.sourceList}>
            {['Project Gutenberg', 'Internet Archive', 'Open Library', 'HathiTrust'].map(s => (
              <View key={s} style={styles.sourceItem}>
                <View style={styles.sourceDot} />
                <Text style={styles.sourceText}>{s}</Text>
                <Text style={styles.sourceFree}>FREE</Text>
              </View>
            ))}
          </View>
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.void },
  hero: { paddingBottom: 24 },
  heroNav: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16 },
  backBtn: { padding: 4 },
  coverWrap: { alignItems: 'center', marginVertical: 20 },
  bigCover: { width: 140, height: 210, borderRadius: 10, alignItems: 'center', justifyContent: 'flex-end', paddingBottom: 16, overflow: 'hidden', elevation: 10 },
  bigSpine: { position: 'absolute', left: 0, top: 0, bottom: 0, width: 10 },
  bigEmoji: { fontSize: 48, marginBottom: 8 },
  bigCoverTitle: { fontSize: 9, color: 'rgba(201,168,76,0.5)', textAlign: 'center', paddingHorizontal: 10 },
  bookTitle: { fontFamily: 'CormorantGaramond_700Bold', fontSize: 28, color: COLORS.white, textAlign: 'center', paddingHorizontal: 24, lineHeight: 34 },
  bookAuthor: { fontSize: 14, color: COLORS.silver, textAlign: 'center', marginTop: 6, fontStyle: 'italic' },
  ratingRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 12, marginTop: 12 },
  starsText: { fontSize: 16, color: COLORS.gold },
  freeBadge: { backgroundColor: 'rgba(45,184,184,0.15)', borderRadius: 10, paddingHorizontal: 10, paddingVertical: 4, borderWidth: 1, borderColor: 'rgba(45,184,184,0.3)' },
  freeBadgeText: { fontSize: 10, color: COLORS.teal, letterSpacing: 1.5, fontWeight: '700' },
  actions: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 20, paddingTop: 0 },
  readBtn: { flex: 1, borderRadius: 14, overflow: 'hidden' },
  readBtnGrad: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 15, gap: 8 },
  readBtnText: { color: COLORS.void, fontWeight: '800', fontSize: 14, letterSpacing: 1.5 },
  iconBtn: { width: 50, height: 50, backgroundColor: COLORS.panel, borderRadius: 14, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: COLORS.border },
  detailsGrid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 20, gap: 10, marginBottom: 20 },
  detailItem: { width: '30%', backgroundColor: COLORS.panel, borderRadius: 12, padding: 12, borderWidth: 1, borderColor: COLORS.border },
  detailLabel: { fontSize: 9, color: COLORS.silver, letterSpacing: 1.5, marginBottom: 4 },
  detailValue: { fontSize: 13, color: COLORS.snow, fontWeight: '600' },
  section: { paddingHorizontal: 20, marginBottom: 20 },
  sectionTitle: { fontFamily: 'CormorantGaramond_600SemiBold', fontSize: 20, color: COLORS.white, marginBottom: 12 },
  sectionBody: { fontSize: 14, color: COLORS.mist, lineHeight: 22 },
  sourceCard: { marginHorizontal: 20, marginBottom: 32, backgroundColor: COLORS.panel, borderRadius: 16, padding: 18, borderWidth: 1, borderColor: COLORS.border },
  sourceTitle: { fontSize: 15, color: COLORS.snow, fontWeight: '700', marginBottom: 14 },
  sourceList: { gap: 10 },
  sourceItem: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  sourceDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#4cff88' },
  sourceText: { flex: 1, fontSize: 13, color: COLORS.mist },
  sourceFree: { fontSize: 10, color: COLORS.teal, fontWeight: '700', letterSpacing: 1 },
});
