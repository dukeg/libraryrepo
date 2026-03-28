import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, TextInput, FlatList, TouchableOpacity,
  StyleSheet, ActivityIndicator, KeyboardAvoidingView,
  Platform, ScrollView
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS } from '../services/AppContext';

const QUICK_PROMPTS = [
  '📚 Recommend classic novels',
  '🔬 Best science books 2024',
  '🧠 Philosophy for beginners',
  '📖 Summarize a book for me',
  '🌍 Books translated from Hindi',
  '🎓 Best AI research papers',
  '⚔️ History books this decade',
  '👤 Books like Atomic Habits',
];

const SYSTEM_PROMPT = `You are MOARL AI Librarian — the world's most sophisticated literary AI, combining DeepSeek reasoning with Claude intelligence. You operate within MOARL (Mother of All Real-Time Libraries), a global digital library portal connecting 247 world-class libraries with 50M+ books, all free.

Personality: Deeply knowledgeable, warm, intellectually curious, enthusiastic about literature. You speak with the authority of a master librarian and the warmth of a reading companion.

You can: recommend books, provide summaries and analysis, discuss literary history, find rare manuscripts, suggest reading lists, explain academic works, compare books across cultures, discuss author influences.

Always reference MOARL's 50M+ collection and 247 library partners. Format responses with emojis for readability. Be specific and enthusiastic. Keep responses concise but valuable for a mobile reader.`;

export default function AIScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const [messages, setMessages] = useState([
    {
      id: '0', role: 'ai',
      text: `👋 Welcome to MOARL AI Librarian!\n\nI'm powered by DeepSeek × Claude — the world's most advanced literary AI.\n\n📚 I can help you:\n• Find books across 50M+ titles\n• Get instant book summaries\n• Discover by mood or theme\n• Research academic papers\n• Recommend your next read\n\nWhat would you like to explore?`,
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [conversation, setConversation] = useState([]);
  const flatListRef = useRef(null);

  const sendMessage = async (text) => {
    const msg = text || input.trim();
    if (!msg || loading) return;
    setInput('');

    const userMsg = { id: Date.now().toString(), role: 'user', text: msg, time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) };
    const newConv = [...conversation, { role: 'user', content: msg }];
    setMessages(prev => [...prev, userMsg, { id: 'typing', role: 'typing' }]);
    setConversation(newConv);

    setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);

    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1000,
          system: SYSTEM_PROMPT,
          messages: newConv.slice(-12),
        }),
      });
      const data = await response.json();
      const reply = data.content?.[0]?.text || "I'm here to help! Tell me what you're looking for.";
      const updatedConv = [...newConv, { role: 'assistant', content: reply }];
      setConversation(updatedConv);
      setMessages(prev => prev.filter(m => m.id !== 'typing').concat({
        id: Date.now().toString(), role: 'ai', text: reply,
        time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
      }));
    } catch (e) {
      const fallback = getFallback(msg);
      setConversation(prev => [...prev, { role: 'assistant', content: fallback }]);
      setMessages(prev => prev.filter(m => m.id !== 'typing').concat({
        id: Date.now().toString(), role: 'ai', text: fallback,
        time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
      }));
    } finally {
      setLoading(false);
      setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 200);
    }
  };

  function getFallback(msg) {
    const q = msg.toLowerCase();
    if (q.includes('recommend') || q.includes('suggest')) return `📚 Top Recommendations:\n\n🌟 Fiction: "The Brothers Karamazov" · "100 Years of Solitude"\n🔬 Science: "The Elegant Universe" · "The Gene"\n🧠 Philosophy: "Meditations" · "The Republic"\n\nAll free on MOARL! Which interests you?`;
    if (q.includes('summar')) return `📋 I'd love to summarize a book!\n\nPlease tell me:\n📖 Which book? (title + author)\n📝 How detailed? (overview / chapter / thematic)\n\nI'll provide a smart, spoiler-aware summary!`;
    return `📚 Great question! As your MOARL AI Librarian with access to 50M+ books across 247 world libraries, I can help with:\n\n• 📖 Book recommendations\n• 🧠 Literary analysis\n• 👤 Author research\n• 🎓 Academic papers\n• 📅 Personalized reading plans\n\nCould you give me more detail about what you're looking for?`;
  }

  const renderMessage = ({ item }) => {
    if (item.role === 'typing') return (
      <View style={[styles.msgRow, { justifyContent: 'flex-start' }]}>
        <View style={styles.aiBubble}>
          <View style={styles.typingDots}>
            {[0, 1, 2].map(i => <View key={i} style={[styles.dot, { opacity: 0.3 + i * 0.35 }]} />)}
          </View>
        </View>
      </View>
    );
    const isUser = item.role === 'user';
    return (
      <View style={[styles.msgRow, isUser && { justifyContent: 'flex-end' }]}>
        {isUser ? (
          <LinearGradient colors={[COLORS.goldDim, COLORS.gold]} style={styles.userBubble} start={{x:0,y:0}} end={{x:1,y:1}}>
            <Text style={styles.userText}>{item.text}</Text>
            <Text style={styles.timeTextUser}>{item.time}</Text>
          </LinearGradient>
        ) : (
          <View style={styles.aiBubble}>
            <Text style={styles.aiText}>{item.text}</Text>
            <Text style={styles.timeText}>{item.time}</Text>
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <LinearGradient colors={[COLORS.deep, COLORS.void]} style={styles.header}>
        <View style={styles.headerLeft}>
          <LinearGradient colors={['#4020a0', '#8040d0']} style={styles.aiAvatar}>
            <Text style={{ fontSize: 20 }}>🤖</Text>
          </LinearGradient>
          <View>
            <Text style={styles.headerTitle}>MOARL AI Librarian</Text>
            <View style={styles.onlineRow}>
              <View style={styles.onlineDot} />
              <Text style={styles.onlineText}>DeepSeek × Claude • Online</Text>
            </View>
          </View>
        </View>
        <TouchableOpacity onPress={() => navigation.navigate('DeepSeek')}>
          <LinearGradient colors={['#1a1040', '#2a1060']} style={styles.deepseekBtn}>
            <Text style={styles.deepseekBtnText}>⚡ Tools</Text>
          </LinearGradient>
        </TouchableOpacity>
      </LinearGradient>

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined} keyboardVerticalOffset={90}>
        {/* Messages */}
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={i => i.id}
          renderItem={renderMessage}
          contentContainerStyle={{ padding: 16, paddingBottom: 24 }}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: false })}
        />

        {/* Quick Prompts */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.quickScroll} contentContainerStyle={{ paddingHorizontal: 16, gap: 8, paddingVertical: 8 }}>
          {QUICK_PROMPTS.map(p => (
            <TouchableOpacity key={p} style={styles.quickPrompt} onPress={() => sendMessage(p)}>
              <Text style={styles.quickPromptText}>{p}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Input */}
        <View style={[styles.inputArea, { paddingBottom: Math.max(insets.bottom, 12) }]}>
          <TextInput
            style={styles.textInput}
            placeholder="Ask about books, authors, research…"
            placeholderTextColor={COLORS.silver}
            value={input}
            onChangeText={setInput}
            multiline
            maxLength={1000}
            onSubmitEditing={() => sendMessage()}
          />
          <TouchableOpacity
            onPress={() => sendMessage()}
            disabled={!input.trim() || loading}
            style={[styles.sendBtn, (!input.trim() || loading) && { opacity: 0.5 }]}
          >
            <LinearGradient colors={['#4020a0', '#8040d0']} style={styles.sendBtnGrad}>
              {loading ? <ActivityIndicator color="white" size="small" /> : <Ionicons name="send" size={18} color="white" />}
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.void },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  aiAvatar: { width: 42, height: 42, borderRadius: 21, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 15, color: COLORS.white, fontWeight: '700' },
  onlineRow: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 2 },
  onlineDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#4cff88' },
  onlineText: { fontSize: 10, color: COLORS.silver },
  deepseekBtn: { paddingHorizontal: 12, paddingVertical: 7, borderRadius: 16, borderWidth: 1, borderColor: 'rgba(120,60,240,0.4)' },
  deepseekBtnText: { fontSize: 12, color: '#c080ff', fontWeight: '600' },
  msgRow: { flexDirection: 'row', marginBottom: 14 },
  userBubble: { maxWidth: '78%', padding: 14, borderRadius: 18, borderBottomRightRadius: 4 },
  userText: { color: COLORS.void, fontSize: 14, lineHeight: 20 },
  timeTextUser: { fontSize: 9, color: 'rgba(6,6,10,0.6)', marginTop: 4, textAlign: 'right' },
  aiBubble: { maxWidth: '82%', backgroundColor: COLORS.surface, padding: 14, borderRadius: 4, borderTopRightRadius: 18, borderBottomRightRadius: 18, borderBottomLeftRadius: 18, borderWidth: 1, borderColor: COLORS.borderBright },
  aiText: { color: COLORS.snow, fontSize: 14, lineHeight: 21 },
  timeText: { fontSize: 9, color: COLORS.silver, marginTop: 4 },
  typingDots: { flexDirection: 'row', gap: 5, padding: 4 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: COLORS.silver },
  quickScroll: { maxHeight: 50, borderTopWidth: 1, borderTopColor: COLORS.border },
  quickPrompt: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 16, borderWidth: 1, borderColor: COLORS.borderBright, backgroundColor: COLORS.surface },
  quickPromptText: { fontSize: 12, color: COLORS.mist },
  inputArea: { flexDirection: 'row', alignItems: 'flex-end', padding: 12, gap: 10, backgroundColor: COLORS.deep, borderTopWidth: 1, borderTopColor: COLORS.border },
  textInput: { flex: 1, backgroundColor: COLORS.surface, borderRadius: 14, borderWidth: 1, borderColor: COLORS.borderBright, paddingHorizontal: 14, paddingTop: 12, paddingBottom: 12, color: COLORS.snow, fontSize: 14, maxHeight: 100 },
  sendBtn: {},
  sendBtnGrad: { width: 46, height: 46, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
});
