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
      'http://18.142.179.240:8001/chat/start-session',
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
      'http://18.142.179.240:8001/chat/send',
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
    console.log(sessionId);
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


  const handleNewSession = async () => {
    try {
      if (!token) throw new Error('Token not loaded');

      // const newId = await startSession();
      onNewSession?.("new"); // beritahu parent session baru
      setInputs([]);
      setCurrentInput('');
      setResponse('');
      setShowNewSessionModal(false);
    } catch (err: any) {
      setError(err.message || 'Failed to start a new session.');
    }
  };



  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{ flex: 1, backgroundColor: '#f9f9fb' }}
    >
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <View style={styles.chatArea}>
          {/* {inputs.map((input, index) => (
    <View key={index} style={styles.chatBubble}>
      <Text style={styles.chatText}>{input}</Text>
    </View>
  ))} */}
          {response && !isSidebar && (
            <View style={[styles.chatBubble, { backgroundColor: '#f7f7f7ff' }]}>
              <Text style={styles.chatText}>{response}</Text>
            </View>
          )}
        </View>


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
      </ScrollView>

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
  label: {
    fontSize: 15,
    color: '#777',
    textAlign: 'center',
    marginBottom: 12,
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
    alignSelf: 'flex-start', // 👈 Mojok kiri
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
});
