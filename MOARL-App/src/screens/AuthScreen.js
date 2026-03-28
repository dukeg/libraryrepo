import React, { useState, useRef } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  KeyboardAvoidingView, Platform, ScrollView, Animated,
  Dimensions, ActivityIndicator
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useApp, COLORS } from '../services/AppContext';

const { width, height } = Dimensions.get('window');

export default function AuthScreen() {
  const { login } = useApp();
  const [tab, setTab] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [country, setCountry] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(40)).current;

  React.useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 700, useNativeDriver: true }),
      Animated.spring(slideAnim, { toValue: 0, tension: 50, friction: 8, useNativeDriver: true }),
    ]).start();
  }, []);

  const doLogin = async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 1200));
    const n = name || email.split('@')[0] || 'Reader';
    login({ name: n, email: email || 'guest@moarl.world', initials: n.slice(0,2).toUpperCase(), country: country || 'World' });
    setLoading(false);
  };

  const doGuest = async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 800));
    login({ name: 'Guest Reader', email: 'guest@moarl.world', initials: 'GR', country: 'World' });
    setLoading(false);
  };

  return (
    <LinearGradient colors={[COLORS.void, COLORS.deep, '#0a0820']} style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          
          {/* Background decoration */}
          <View style={styles.bgCircle1} />
          <View style={styles.bgCircle2} />
          
          <Animated.View style={[styles.card, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
            
            {/* Logo */}
            <View style={styles.logoArea}>
              <Text style={styles.logoEmoji}>📚</Text>
              <Text style={styles.logoName}>MOARL</Text>
              <Text style={styles.logoSub}>MOTHER OF ALL REAL-TIME LIBRARIES</Text>
              <View style={styles.liveRow}>
                <View style={styles.liveDot} />
                <Text style={styles.liveText}>247 Libraries Connected Worldwide</Text>
              </View>
            </View>

            {/* Tabs */}
            <View style={styles.tabs}>
              <TouchableOpacity style={[styles.tab, tab === 'login' && styles.tabActive]} onPress={() => setTab('login')}>
                <Text style={[styles.tabText, tab === 'login' && styles.tabTextActive]}>Sign In</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.tab, tab === 'register' && styles.tabActive]} onPress={() => setTab('register')}>
                <Text style={[styles.tabText, tab === 'register' && styles.tabTextActive]}>Register</Text>
              </TouchableOpacity>
            </View>

            {/* Form */}
            {tab === 'register' && (
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>FULL NAME</Text>
                <View style={styles.inputWrap}>
                  <Ionicons name="person-outline" size={16} color={COLORS.silver} style={styles.inputIcon} />
                  <TextInput style={styles.input} placeholder="Your full name" placeholderTextColor={COLORS.silver}
                    value={name} onChangeText={setName} />
                </View>
              </View>
            )}

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>EMAIL ADDRESS</Text>
              <View style={styles.inputWrap}>
                <Ionicons name="mail-outline" size={16} color={COLORS.silver} style={styles.inputIcon} />
                <TextInput style={styles.input} placeholder="you@example.com" placeholderTextColor={COLORS.silver}
                  value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>PASSWORD</Text>
              <View style={styles.inputWrap}>
                <Ionicons name="lock-closed-outline" size={16} color={COLORS.silver} style={styles.inputIcon} />
                <TextInput style={[styles.input, { flex: 1 }]} placeholder="••••••••" placeholderTextColor={COLORS.silver}
                  value={password} onChangeText={setPassword} secureTextEntry={!showPass} />
                <TouchableOpacity onPress={() => setShowPass(!showPass)} style={styles.eyeBtn}>
                  <Ionicons name={showPass ? 'eye-outline' : 'eye-off-outline'} size={16} color={COLORS.silver} />
                </TouchableOpacity>
              </View>
            </View>

            {tab === 'register' && (
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>COUNTRY</Text>
                <View style={styles.inputWrap}>
                  <Ionicons name="globe-outline" size={16} color={COLORS.silver} style={styles.inputIcon} />
                  <TextInput style={styles.input} placeholder="Your country" placeholderTextColor={COLORS.silver}
                    value={country} onChangeText={setCountry} />
                </View>
              </View>
            )}

            {/* Primary Button */}
            <TouchableOpacity style={styles.primaryBtn} onPress={doLogin} disabled={loading} activeOpacity={0.85}>
              <LinearGradient colors={[COLORS.goldDim, COLORS.gold, COLORS.goldBright]} style={styles.primaryBtnGrad} start={{x:0,y:0}} end={{x:1,y:0}}>
                {loading ? <ActivityIndicator color={COLORS.void} /> : (
                  <>
                    <Text style={styles.primaryBtnText}>{tab === 'login' ? 'ACCESS GLOBAL LIBRARY' : 'CREATE FREE ACCOUNT'}</Text>
                    <Ionicons name="arrow-forward" size={16} color={COLORS.void} />
                  </>
                )}
              </LinearGradient>
            </TouchableOpacity>

            {/* Divider */}
            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>or continue with</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Social Buttons */}
            <View style={styles.socialRow}>
              {['🌐 Google', '📘 Facebook', '🍎 Apple'].map(s => (
                <TouchableOpacity key={s} style={styles.socialBtn} onPress={doGuest}>
                  <Text style={styles.socialBtnText}>{s}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Guest */}
            <TouchableOpacity style={styles.guestBtn} onPress={doGuest}>
              <Text style={styles.guestText}>Continue as Guest →</Text>
            </TouchableOpacity>

            {/* Stats */}
            <View style={styles.statsRow}>
              {[['50M+', 'Books'], ['247', 'Libraries'], ['190+', 'Countries'], ['FREE', 'Access']].map(([n, l]) => (
                <View key={l} style={styles.statItem}>
                  <Text style={styles.statNum}>{n}</Text>
                  <Text style={styles.statLbl}>{l}</Text>
                </View>
              ))}
            </View>

          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { flexGrow: 1, justifyContent: 'center', padding: 20, paddingVertical: 48 },
  bgCircle1: {
    position: 'absolute', width: 300, height: 300, borderRadius: 150,
    backgroundColor: 'rgba(140,90,20,0.08)', top: -80, left: -80,
  },
  bgCircle2: {
    position: 'absolute', width: 200, height: 200, borderRadius: 100,
    backgroundColor: 'rgba(60,30,140,0.12)', bottom: 40, right: -60,
  },
  card: {
    backgroundColor: COLORS.panel,
    borderRadius: 24,
    padding: 28,
    borderWidth: 1,
    borderColor: COLORS.borderBright,
    shadowColor: COLORS.gold,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
  },
  logoArea: { alignItems: 'center', marginBottom: 28 },
  logoEmoji: { fontSize: 48, marginBottom: 8 },
  logoName: { fontFamily: 'CormorantGaramond_700Bold', fontSize: 36, color: COLORS.gold, letterSpacing: 2 },
  logoSub: { fontSize: 9, letterSpacing: 3, color: COLORS.silver, marginTop: 4 },
  liveRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 10 },
  liveDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: '#4cff88' },
  liveText: { fontSize: 11, color: COLORS.mist },
  tabs: { flexDirection: 'row', backgroundColor: COLORS.surface, borderRadius: 12, marginBottom: 24, padding: 4 },
  tab: { flex: 1, paddingVertical: 10, borderRadius: 10, alignItems: 'center' },
  tabActive: { backgroundColor: COLORS.gold },
  tabText: { fontSize: 13, color: COLORS.silver },
  tabTextActive: { color: COLORS.void, fontWeight: '700' },
  inputGroup: { marginBottom: 16 },
  inputLabel: { fontSize: 9, letterSpacing: 2, color: COLORS.silver, marginBottom: 6 },
  inputWrap: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: COLORS.surface, borderRadius: 12,
    borderWidth: 1, borderColor: COLORS.borderBright,
    paddingHorizontal: 14,
  },
  inputIcon: { marginRight: 10 },
  input: { flex: 1, color: COLORS.snow, fontSize: 14, paddingVertical: 13 },
  eyeBtn: { padding: 4 },
  primaryBtn: { borderRadius: 14, overflow: 'hidden', marginTop: 8, marginBottom: 20 },
  primaryBtnGrad: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 16, gap: 8 },
  primaryBtnText: { color: COLORS.void, fontWeight: '800', fontSize: 13, letterSpacing: 1.5 },
  divider: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 16 },
  dividerLine: { flex: 1, height: 1, backgroundColor: COLORS.border },
  dividerText: { fontSize: 11, color: COLORS.silver },
  socialRow: { flexDirection: 'row', gap: 8, marginBottom: 16 },
  socialBtn: {
    flex: 1, paddingVertical: 10, borderRadius: 10,
    borderWidth: 1, borderColor: COLORS.borderBright,
    alignItems: 'center',
  },
  socialBtnText: { fontSize: 12, color: COLORS.mist },
  guestBtn: { alignItems: 'center', paddingVertical: 8, marginBottom: 20 },
  guestText: { fontSize: 13, color: COLORS.goldDim },
  statsRow: {
    flexDirection: 'row', justifyContent: 'space-around',
    borderTopWidth: 1, borderTopColor: COLORS.border, paddingTop: 20,
  },
  statItem: { alignItems: 'center' },
  statNum: { fontFamily: 'CormorantGaramond_700Bold', fontSize: 22, color: COLORS.gold },
  statLbl: { fontSize: 9, color: COLORS.silver, letterSpacing: 1 },
});
