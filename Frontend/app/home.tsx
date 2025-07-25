import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  BackHandler,
  TouchableOpacity,
} from 'react-native';
import ChatBox from './chatbox';
import { useRouter, usePathname } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Modal from 'react-native-modal';

export default function HomePage() {
  const [modal, setModal] = useState({ visible: false, title: '', message: '' });
  const [sessions, setSessions] = useState<string[]>([]);
  const [sidebarVisible, setSidebarVisible] = useState(false);

  const router = useRouter();
  const pathname = usePathname();

  const showModal = (title: string, message: string) => {
    setModal({ visible: true, title, message });
  };

  useEffect(() => {
    const checkToken = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (!token) {
          showModal('Session Expired', 'Please login again.');
          setTimeout(() => {
            setModal({ ...modal, visible: false });
            router.replace('/login');
          }, 1500);
        }
      } catch (err) {
        console.error('Token check failed:', err);
        showModal('Error', 'Failed to read token.');
        setTimeout(() => {
          setModal({ ...modal, visible: false });
          router.replace('/login');
        }, 1500);
      }
    };

    checkToken();

    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => true);
    return () => backHandler.remove();
  }, []);

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={80}
      >
        <View style={{ flexDirection: 'row', flex: 1 }}>
          {sidebarVisible && (
            <View style={styles.sidebar}>
              <Text style={styles.sidebarTitle}>Sessions</Text>
              {sessions.map((session, index) => (
                <View key={index} style={styles.sessionItem}>
                  <Text style={styles.sessionText}>Session {index + 1}</Text>
                </View>
              ))}
            </View>
          )}
          <ScrollView
            contentContainerStyle={styles.content}
            keyboardShouldPersistTaps="handled"
          >
            <TouchableOpacity onPress={() => setSidebarVisible(!sidebarVisible)}>
              <Ionicons
                name={sidebarVisible ? 'chevron-back' : 'chevron-forward'}
                size={24}
                color="#333"
              />
            </TouchableOpacity>
            {/* {sidebarVisible ? <></> : <Text style={styles.title}>👋 Welcome</Text>} */}
            <ChatBox isSidebar={sidebarVisible} />
          </ScrollView>
        </View>
      </KeyboardAvoidingView>

      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons
            name={pathname === '/home' ? 'home' : 'home-outline'}
            size={26}
            color="#0599ff"
          />
          <Text style={styles.navText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/doctor')}>
          <Ionicons
            name={pathname === '/doctor' ? 'medkit' : 'medkit-outline'}
            size={26}
            color="#0599ff"
          />
          <Text style={styles.navText}>Medic</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/profile')}>
          <Ionicons
            name={pathname === '/profile' ? 'person' : 'person-outline'}
            size={26}
            color="#0599ff"
          />
          <Text style={styles.navText}>Profile</Text>
        </TouchableOpacity>
      </View>

      <Modal isVisible={modal.visible}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>{modal.title}</Text>
          <Text style={styles.modalMessage}>{modal.message}</Text>
          <TouchableOpacity onPress={() => setModal({ ...modal, visible: false })}>
            <Text style={styles.modalClose}>OK</Text>
          </TouchableOpacity>
        </View>
      </Modal>
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
    color: '#0599ff',
    marginTop: 2,
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalMessage: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  modalClose: {
    fontSize: 16,
    color: '#0599ff',
    fontWeight: 'bold',
  },
  sidebar: {
    width: 150,
    backgroundColor: '#fdfcfcff',
    paddingTop: 60,
    paddingHorizontal: 8,
    borderRightWidth: 1,
    borderColor: '#ccc',
  },
  sidebarTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  sessionItem: {
    paddingVertical: 8,
    paddingHorizontal: 6,
    marginBottom: 8,
    borderRadius: 6,
    backgroundColor: '#fff',
  },
  sessionText: {
    fontSize: 13,
    color: '#333',
    textAlign: 'center',
  },
});
