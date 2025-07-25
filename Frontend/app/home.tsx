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
const dummySessions = [
  { id: '1', title: 'Headache and fatigue' },
  { id: '2', title: 'Fever and chills' },
  { id: '3', title: 'Cough with sore throat' },
  { id: '4', title: 'Stomach ache' },
  { id: '5', title: 'Skin rash' },
]
export default function HomePage() {
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [modal, setModal] = useState({ visible: false, title: '', message: '' });
  const [sessions, setSessions] = useState<any[]>([]);
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const showModal = (title: string, message: string) => {
    setModal({ visible: true, title, message });
  };
  const handleNewSession = (id: string | null) => {
    if (id == "new") {
      setCurrentSessionId(null)
    } else {
      dummySessions.unshift({ id: id, title: " " })
      setCurrentSessionId(id);

    }
  };
  useEffect(() => {
    const checkTokenAndLoadDummySessions = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (!token) {
          showModal('Session Expired', 'Please login again.');
          setTimeout(() => {
            setModal({ ...modal, visible: false });
            router.replace('/login');
          }, 1500);
          return;
        }




        setSessions(dummySessions);
      } catch (err) {
        console.error('Token check failed:', err);
        showModal('Error', 'Failed to read token.');
        setTimeout(() => {
          setModal({ ...modal, visible: false });
          router.replace('/login');
        }, 1500);
      }
    };

    checkTokenAndLoadDummySessions();

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
              {/* <Text style={styles.sidebarTitle}>Sessions</Text> */}
              {sessions.map((session, index) => (
                <TouchableOpacity
                  key={session.id}
                  style={styles.sessionItem}
                  onPress={() => setCurrentSessionId(session.id)}
                >
                  <Text style={styles.sessionText}>{session.title}</Text>
                </TouchableOpacity>
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
            <ChatBox isSidebar={sidebarVisible} sessionId={currentSessionId} onNewSession={handleNewSession} />
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
    paddingTop: 60,
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
    width: 190,
    backgroundColor: '#fdfdfd',
    paddingTop: 60,
    paddingHorizontal: 12,
    borderRightWidth: 1,
    borderColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 4,
  },

  sidebarTitle: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 16,
    textAlign: 'left',
    color: '#333',
  },

  sessionItem: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginBottom: 10,
    borderRadius: 8,
    backgroundColor: '#ffffffff',
    borderWidth: 1,
    borderColor: '#f6f4f4ff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.01,
    shadowRadius: 2,
    elevation: 2,
  },

  sessionText: {
    fontSize: 14,
    color: '#333',
    textAlign: 'left',
    fontWeight: '500',
  },

});
