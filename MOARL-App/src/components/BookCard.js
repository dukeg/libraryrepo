import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '../services/AppContext';

const COVER_COLORS = [
  ['#4a1a00', '#1a0a00'],
  ['#0a1a4a', '#030810'],
  ['#0a2a1a', '#030a06'],
  ['#2a0a2a', '#0a030a'],
  ['#1a1a0a', '#060603'],
  ['#0a2a2a', '#030a0a'],
];

export default function BookCard({ book, onPress, size = 'normal' }) {
  const colorIdx = (book.title?.charCodeAt(0) || 0) % COVER_COLORS.length;
  const [c1, c2] = COVER_COLORS[colorIdx];
  const isSmall = size === 'small';

  return (
    <TouchableOpacity style={[styles.card, isSmall && styles.cardSmall]} onPress={onPress} activeOpacity={0.88}>
      {/* Cover */}
      <LinearGradient colors={[c1, c2]} style={[styles.cover, isSmall && styles.coverSmall]}>
        {/* Spine */}
        <LinearGradient colors={[COLORS.goldDim, COLORS.goldBright, COLORS.goldDim]} style={styles.spine} start={{x:0,y:0}} end={{x:0,y:1}} />
        <Text style={[styles.emoji, isSmall && { fontSize: 28 }]}>{book.emoji || '📚'}</Text>
        <Text style={styles.coverTitle} numberOfLines={3}>{book.title}</Text>
      </LinearGradient>

      {/* Info */}
      <View style={styles.info}>
        <Text style={[styles.title, isSmall && { fontSize: 12 }]} numberOfLines={2}>{book.title}</Text>
        <Text style={styles.author} numberOfLines={1}>{book.author}</Text>
        <View style={styles.meta}>
          <View style={styles.freeBadge}>
            <Text style={styles.freeBadgeText}>FREE</Text>
          </View>
          <Text style={styles.rating}>{'★'.repeat(book.rating || 4)}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: { width: 130, backgroundColor: COLORS.panel, borderRadius: 12, overflow: 'hidden', borderWidth: 1, borderColor: COLORS.border },
  cardSmall: { width: 110 },
  cover: { width: '100%', aspectRatio: 2/3, justifyContent: 'flex-end', alignItems: 'center', paddingBottom: 10, paddingHorizontal: 8, overflow: 'hidden' },
  coverSmall: {},
  spine: { position: 'absolute', left: 0, top: 0, bottom: 0, width: 7 },
  emoji: { fontSize: 34, marginBottom: 6 },
  coverTitle: { fontSize: 8, color: 'rgba(201,168,76,0.5)', textAlign: 'center', lineHeight: 11 },
  info: { padding: 10 },
  title: { fontFamily: 'CormorantGaramond_600SemiBold', fontSize: 13, color: COLORS.snow, marginBottom: 3, lineHeight: 17 },
  author: { fontSize: 10, color: COLORS.silver, marginBottom: 7 },
  meta: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  freeBadge: { backgroundColor: 'rgba(45,184,184,0.12)', borderRadius: 6, paddingHorizontal: 6, paddingVertical: 2, borderWidth: 1, borderColor: 'rgba(45,184,184,0.25)' },
  freeBadgeText: { fontSize: 8, color: COLORS.teal, letterSpacing: 1 },
  rating: { fontSize: 9, color: COLORS.gold },
});
