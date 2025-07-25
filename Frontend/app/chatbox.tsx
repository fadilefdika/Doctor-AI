import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import Modal from 'react-native-modal';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { useRouter } from 'expo-router';

export default function ChatBox({
  isSidebar,
  sessionId,
  onNewSession,
}: {
  isSidebar: boolean;
  sessionId: string | null;
  onNewSession?: (id: string) => void;
}) {
  const [inputs, setInputs] = useState<string[]>([]);
  const [currentInput, setCurrentInput] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [token, setToken] = useState<string | null>(null);
  const [showNewSessionModal, setShowNewSessionModal] = useState(false);
  const [showSummaryModal, setShowSummaryModal] = useState(false);
  const [summaryResult, setSummaryResult] = useState('');
const router = useRouter();

  useEffect(() => {
    (async () => {
      await loadToken();
    })();
  }, []);

  const loadToken = async () => {
    try {
      const stored = await AsyncStorage.getItem('token');
      if (stored) setToken(stored);
      else throw new Error('No token found');
    } catch (err: any) {
      setError(err.message || 'Failed to load token');
    }
  };

  const startSession = async () => {
    const res = await axios.post(
      'https://filme-roads-boots-buffalo.trycloudflare.com/chat/start-session',
      {},
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return res.data.session_id;
  };

  const sendMessages = async (id: string, messages: string[]) => {
    const res = await axios.post(
      'https://filme-roads-boots-buffalo.trycloudflare.com/chat/send',
      { session_id: id, message: messages.join('\n') },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return res.data.response || 'No response from doctor.';
  };

  const handleSend = async () => {
    const trimmed = currentInput.trim();
    if (!trimmed) return;

    const updatedInputs = [...inputs, trimmed];
    setInputs(updatedInputs);
    setCurrentInput('');

    try {
      setLoading(true);
      if (!token) throw new Error('Token not loaded');

      let id = sessionId;
      if (!id) {
        id = await startSession();
        onNewSession?.(id);
      }

      const reply = await sendMessages(id!, [trimmed]);
      setResponse(reply);
    } catch (err: any) {
      setError(err.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  const handleNewSession = () => {
    onNewSession?.('new');
    setInputs([]);
    setCurrentInput('');
    setResponse('');
    setShowNewSessionModal(false);
  };

  const fetchSummary = async () => {
    try {
      if (!token) throw new Error('Token not loaded');
      if (!sessionId) throw new Error('No session ID found');

      setLoading(true);
      const res = await axios.post(
        'https://filme-roads-boots-buffalo.trycloudflare.com/chat/summary',
        { session_id: sessionId },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setSummaryResult(res.data?.summary || 'No summary provided.');
      setShowSummaryModal(true);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch summary');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
      keyboardVerticalOffset={80}
    >
      <View style={{ flex: 1 }}>
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.chatArea}>
            {response && !isSidebar && (
              <View style={[styles.chatBubble, { backgroundColor: '#f7f7f7ff' }]}>
                <Text style={styles.chatText}>{response}</Text>
              </View>
            )}
          </View>
        </ScrollView>

        {!isSidebar && (
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              value={currentInput}
              onChangeText={setCurrentInput}
              placeholder="Describe your symptom..."
              placeholderTextColor="#aaa"
              multiline
              editable={!loading}
            />
            <TouchableOpacity
              onPress={handleSend}
              onLongPress={() => setShowNewSessionModal(true)}
              style={styles.sendButton}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Ionicons name="arrow-up" size={20} color="#fff" />
              )}
            </TouchableOpacity>
          </View>
        )}
      </View>
      {(!isSidebar && inputs.length >= 3) && (
        <TouchableOpacity
          style={styles.summaryButton}
          onPress={fetchSummary}
          disabled={loading || !sessionId}
          activeOpacity={0.8}
        >
          <Ionicons name="document-text-outline" size={20} color="#fff" style={{ marginRight: 8 }} />
          <Text style={styles.summaryButtonText}>
            {loading ? 'Loading...' : 'View Summary'}
          </Text>
        </TouchableOpacity>

      )}
      {/* Summary Modal */}
      <Modal isVisible={showSummaryModal} onBackdropPress={() => setShowSummaryModal(false)}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Summary</Text>
          <Text style={styles.modalMessage}>{summaryResult}</Text>
          <TouchableOpacity onPress={() => setShowSummaryModal(false)} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
  style={styles.doctorButton}
  onPress={() => router.push('/doctor')}
  activeOpacity={0.8}
>
  <Ionicons name="person-circle-outline" size={20} color="#fff" style={{ marginRight: 8 }} />
  <Text style={styles.doctorButtonText}>Consult a Doctor</Text>
</TouchableOpacity>

      </Modal>

      {/* Error Modal */}
      <Modal isVisible={!!error} onBackdropPress={() => setError('')}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Error</Text>
          <Text style={styles.modalMessage}>{error}</Text>
          <TouchableOpacity onPress={() => setError('')} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>Dismiss</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      {/* New Session Modal */}
      <Modal isVisible={showNewSessionModal} onBackdropPress={() => setShowNewSessionModal(false)}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Start New Session?</Text>
          <Text style={styles.modalMessage}>
            This will reset your session and clear all messages.
          </Text>
          <View style={{ flexDirection: 'row', marginTop: 10 }}>
            <TouchableOpacity
              onPress={handleNewSession}
              style={[styles.closeButton, { backgroundColor: '#34c759', marginRight: 10 }]}
            >
              <Text style={styles.closeButtonText}>Yes</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setShowNewSessionModal(false)}
              style={[styles.closeButton, { backgroundColor: '#ccc' }]}
            >
              <Text style={[styles.closeButtonText, { color: '#333' }]}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
  },
  chatArea: {
    marginBottom: 20,
  },
  chatBubble: {
    backgroundColor: '#f0f0f5',
    padding: 16,
    borderRadius: 18,
    maxWidth: '85%',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 3,
    alignSelf: 'flex-start',
  },
  chatText: {
    fontSize: 16,
    color: '#333',
    lineHeight: 22,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: '#fff',
    borderRadius: 28,
    paddingHorizontal: 16,
    paddingVertical: Platform.OS === 'ios' ? 12 : 8,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 6,
    elevation: 4,
    marginBottom: 60
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#111',
    paddingVertical: 6,
    maxHeight: 100,
    marginBottom: 4,
  },
  sendButton: {
    marginLeft: 12,
    backgroundColor: '#007aff',
    padding: 10,
    borderRadius: 24,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#e74c3c',
    marginBottom: 10,
  },
  modalMessage: {
    fontSize: 15,
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
  },
  closeButton: {
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 18,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  summaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginTop: 14,
    backgroundColor: '#34c759',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 4,
  },
  summaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
doctorButton: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  alignSelf: 'center',
  marginTop: 10,
  backgroundColor: '#007aff',
  paddingVertical: 12,
  paddingHorizontal: 20,
  borderRadius: 30,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 3 },
  shadowOpacity: 0.1,
  shadowRadius: 5,
  elevation: 4,
},
doctorButtonText: {
  color: '#fff',
  fontSize: 16,
  fontWeight: '600',
},

});
