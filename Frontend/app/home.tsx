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
import { useRouter, usePathname } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';

export default function HomePage() {
  const router = useRouter();
  const pathname = usePathname();
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
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.title}>👋 Selamat Datang</Text>

          {response ? (
            <View style={styles.chatBubble}>
              <Text style={styles.chatText}>{response}</Text>
            </View>
          ) : (
            <Text style={styles.subtext}>Silakan ketik sesuatu di bawah ini.</Text>
          )}
        </ScrollView>

        {/* Input Chat seperti ChatGPT */}
        <View style={styles.chatInputWrapper}>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              value={input}
              onChangeText={setInput}
              placeholder="Tulis pesan..."
              placeholderTextColor="#999"
              multiline
            />
            <TouchableOpacity onPress={handleSend} style={styles.sendButton}>
              <Ionicons name="arrow-up" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>

      {/* Bottom Navbar */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/home')}>
          <Ionicons
            name={pathname === '/home' ? 'home' : 'home-outline'}
            size={26}
            color="#3C84F5"
          />
          <Text style={styles.navText}>Beranda</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/produk')}>
          <Ionicons
            name={pathname === '/produk' ? 'pricetag' : 'pricetag-outline'}
            size={26}
            color="#3C84F5"
          />
          <Text style={styles.navText}>Produk</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/profile')}>
          <Ionicons
            name={pathname === '/profile' ? 'person' : 'person-outline'}
            size={26}
            color="#3C84F5"
          />
          <Text style={styles.navText}>Profile</Text>
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
    justifyContent: 'flex-start',
    paddingHorizontal: 20,
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
    fontSize: 15,
    color: '#888',
    textAlign: 'center',
    marginTop: 10,
  },
  chatBubble: {
    backgroundColor: '#E7F1FF',
    padding: 14,
    borderRadius: 18,
    alignSelf: 'flex-start',
    maxWidth: '80%',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  chatText: {
    fontSize: 16,
    color: '#333',
  },
  chatInputWrapper: {
    paddingHorizontal: 16,
    paddingBottom: 80,
    backgroundColor: '#F9FAFB',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: '#ffffff',
    borderRadius: 25,
    paddingHorizontal: 14,
    paddingVertical: 8,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 5,
  },
  input: {
    flex: 1,
    maxHeight: 100,
    fontSize: 16,
    paddingVertical: 8,
    color: '#333',
  },
  sendButton: {
    backgroundColor: '#3C84F5',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 70,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderTopWidth: 0.5,
    borderColor: '#ddd',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 10,
  },
  navItem: {
    alignItems: 'center',
  },
  navText: {
    fontSize: 12,
    color: '#3C84F5',
    marginTop: 2,
  },
});
