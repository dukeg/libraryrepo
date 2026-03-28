import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '../services/AppContext';

export default function CategoryPill({ label, active, onPress }) {
  if (active) {
    return (
      <TouchableOpacity onPress={onPress}>
        <LinearGradient colors={[COLORS.goldDim, COLORS.gold]} style={styles.pillActive} start={{x:0,y:0}} end={{x:1,y:0}}>
          <Text style={styles.textActive}>{label}</Text>
        </LinearGradient>
      </TouchableOpacity>
    );
  }
  return (
    <TouchableOpacity style={styles.pill} onPress={onPress}>
      <Text style={styles.text}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  pill: { paddingHorizontal: 16, paddingVertical: 9, borderRadius: 20, borderWidth: 1, borderColor: COLORS.borderBright, backgroundColor: 'transparent' },
  pillActive: { paddingHorizontal: 16, paddingVertical: 9, borderRadius: 20 },
  text: { fontSize: 12, color: COLORS.mist },
  textActive: { fontSize: 12, color: COLORS.void, fontWeight: '700' },
});
