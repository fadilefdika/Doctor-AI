import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';

export default function HomePage() {
  const router = useRouter();
  const [input, setInput] = useState('');
  const [response, setResponse] = useState('');

  const handleSend = () => {
    if (input.trim()) {
      setResponse(`Kamu menulis: ${input}`);
      setInput('');
    }
  };

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={80}
      >
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <Text style={styles.title}>Selamat Datang 👋</Text>

          {response ? (
            <View style={styles.chatBubble}>
              <Text style={styles.chatText}>{response}</Text>
            </View>
          ) : (
            <Text style={styles.subtext}>Silakan kirim pesan di bawah</Text>
          )}
        </ScrollView>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={input}
            onChangeText={setInput}
            placeholder="Tulis sesuatu..."
            placeholderTextColor="#999"
          />
          <TouchableOpacity onPress={handleSend} style={styles.sendButton}>
            <Ionicons name="arrow-up" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>

      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/home')}>
          <Ionicons name="home-outline" size={26} color="#0599ff" />
          <Text style={styles.navText}>Beranda</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/produk')}>
          <Ionicons name="pricetag-outline" size={26} color="#0599ff" />
          <Text style={styles.navText}>Produk</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/profil')}>
          <Ionicons name="person-outline" size={26} color="#0599ff" />
          <Text style={styles.navText}>Profil</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  content: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingTop: 80,
    paddingBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '600',
    color: '#1C1C1E',
    textAlign: 'center',
    marginBottom: 20,
  },
  subtext: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  chatBubble: {
    backgroundColor: '#E5F1FF',
    padding: 14,
    borderRadius: 18,
    alignSelf: 'flex-start',
    maxWidth: '85%',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 2,
  },
  chatText: {
    fontSize: 16,
    color: '#333',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    height: 44,
    backgroundColor: '#F0F1F3',
    borderRadius: 22,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#333',
  },
  sendButton: {
    backgroundColor: '#0599ff',
    borderRadius: 22,
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderColor: '#eee',
  },
  navItem: {
    alignItems: 'center',
  },
  navText: {
    fontSize: 13,
    marginTop: 4,
    color: '#0599ff',
    fontWeight: '500',
  },
});
