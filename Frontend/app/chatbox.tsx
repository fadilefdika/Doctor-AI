import { useState } from 'react';
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
import { Ionicons } from '@expo/vector-icons';
import Modal from 'react-native-modal';

export default function ChatBox() {
  const [inputs, setInputs] = useState<string[]>([]);
  const [currentInput, setCurrentInput] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [showNewSessionModal, setShowNewSessionModal] = useState(false);

  const startSession = async () => {
    const res = await fetch('https://your-api.com/chat/start-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    const data = await res.json();

    if (!res.ok) {
      throw new Error(data?.message || 'Failed to start session');
    }

    return data.session_id;
  };

  const sendMessages = async (id: string, messages: string[]) => {
    const res = await fetch('https://your-api.com/chat/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        session_id: id,
        message: messages.join('\n'),
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data?.message || 'Failed to send messages');
    }

    return data.reply || 'No response from doctor.';
  };

  const handleSend = async () => {
    const trimmed = currentInput.trim();
    if (!trimmed) return;

    const updatedInputs = [...inputs, trimmed];
    setInputs(updatedInputs);
    setCurrentInput('');

    if (updatedInputs.length === 3) {
      try {
        setLoading(true);

        let id = sessionId;
        if (!id) {
          id = await startSession();
          setSessionId(id);
        }

        const reply = await sendMessages(id, updatedInputs);
        setResponse(reply);
      } catch (err: any) {
        setError(err.message || 'Something went wrong.');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{ flex: 1, backgroundColor: '#f9f9fb' }}
    >
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <View style={styles.chatArea}>
          {response ? (
            <View style={styles.chatBubble}>
              <Text style={styles.chatText}>Doctor's note: {response}</Text>
            </View>
          ) : (
            <Text style={styles.label}>
              {inputs.length < 3
                ? `Please describe symptom ${inputs.length + 1}`
                : 'Sending your symptoms to the doctor...'}
            </Text>
          )}
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={currentInput}
            onChangeText={setCurrentInput}
            placeholder="Describe your symptom..."
            placeholderTextColor="#aaa"
            multiline
            editable={!loading && inputs.length < 3}
          />
          <TouchableOpacity
            onPress={handleSend}
            onLongPress={() => setShowNewSessionModal(true)}
            style={styles.sendButton}
            disabled={loading || inputs.length >= 3}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Ionicons name="arrow-up" size={20} color="#fff" />
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Error Modal */}
      <Modal isVisible={!!error} onBackdropPress={() => setError('')}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Medical Assistant Error</Text>
          <Text style={styles.modalMessage}>{error}</Text>
          <TouchableOpacity onPress={() => setError('')} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>Dismiss</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      {/* Start New Session Modal */}
      <Modal isVisible={showNewSessionModal} onBackdropPress={() => setShowNewSessionModal(false)}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Start New Session?</Text>
          <Text style={styles.modalMessage}>This will reset your session and clear all messages.</Text>
          <View style={{ flexDirection: 'row', marginTop: 10 }}>
            <TouchableOpacity
              onPress={() => {
                setSessionId(null);
                setInputs([]);
                setResponse('');
                setCurrentInput('');
                setShowNewSessionModal(false);
              }}
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
    alignItems: 'center',
    marginBottom: 30,
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
