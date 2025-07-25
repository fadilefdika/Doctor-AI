import { View, Text, StyleSheet, TouchableOpacity, Platform, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import Modal from 'react-native-modal';
import axios from 'axios';
// import { FlatList } from 'react-native-reanimated/lib/typescript/Animated';

type Flashcard = {
  tipe: string;
  judul: string;
  isi: string;
};

export default function Profile() {
  const router = useRouter();

  const handleLogout = async () => {
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('username');
    router.replace('/login');
  };

  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState({
    visible: false,
    title: '',
    message: '',
  });

  const showModal = (title: string, message: string) => {
    setModal({ visible: true, title, message });
  };

  useEffect(() => {
    const fetchFlashcards = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (!token) throw new Error('Token not found');

        const res = await axios.get('https://18.142.179.240:8001/chat/flashcards', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setFlashcards(res.data.flashcards || []);
      } catch (err) {
        console.error('Failed to load flashcards', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFlashcards();
    setFlashcards([
      {
        tipe: 'Kardiologi',
        judul: 'Hipertensi',
        isi: 'Hipertensi adalah kondisi di mana tekanan darah sistolik ≥140 mmHg atau diastolik ≥90 mmHg secara konsisten.',
      },
      {
        tipe: 'Endokrinologi',
        judul: 'Diabetes Mellitus Tipe 2',
        isi: 'Ditandai dengan kadar glukosa darah tinggi akibat resistensi insulin atau produksi insulin yang tidak adekuat.',
      },
      {
        tipe: 'Pulmonologi',
        judul: 'Asma Bronkial',
        isi: 'Asma adalah gangguan pernapasan kronis yang menyebabkan penyempitan saluran napas dan sesak napas.',
      },
      {
        tipe: 'Gastroenterologi',
        judul: 'Gastritis',
        isi: 'Radang pada lapisan lambung, biasanya disebabkan oleh infeksi H. pylori atau konsumsi NSAID berlebihan.',
      },
      {
        tipe: 'Psikiatri',
        judul: 'Gangguan Kecemasan Umum (GAD)',
        isi: 'Kondisi psikologis yang ditandai oleh kekhawatiran berlebihan, sulit konsentrasi, dan gangguan tidur.',
      },
    ]
    )
  }, []);

  useEffect(() => {
    const checkToken = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (!token) {
          showModal('Session Expired', 'Please login again.');
          setTimeout(() => {
            setModal((prev) => ({ ...prev, visible: false }));
            router.replace('/login');
          }, 1500);
        }
      } catch (err) {
        showModal('Error', 'Failed to read token.');
        setTimeout(() => {
          setModal((prev) => ({ ...prev, visible: false }));
          router.replace('/login');
        }, 1500);
      }
    };

    checkToken();
  }, []);

  return (
    <View style={styles.container}>


      {/* Flashcards */}
      <View style={styles.flashcardContainer}>
        <Text style={styles.sectionTitle}>Flashcards</Text>
        {loading ? (
          <Text style={styles.loadingText}>Loading...</Text>
        ) : flashcards.length === 0 ? (
          <Text style={styles.emptyText}>No flashcards found</Text>
        ) : (
          <FlatList
            data={flashcards}
            keyExtractor={(_, index) => index.toString()}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => (
              <View style={styles.card}>
                <Text style={styles.cardType}>{item.tipe}</Text>
                <Text style={styles.cardTitle}>{item.judul}</Text>
                <Text style={styles.cardContent}>{item.isi}</Text>
              </View>
            )}
          />

        )}
      </View>
      {/* Logout Button */}
      <TouchableOpacity onPress={handleLogout} style={styles.logoutBtn}>
        <Ionicons name="log-out-outline" size={22} color="#fff" />
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/home')}>
          <Ionicons name="home-outline" size={26} color="#0599ff" />
          <Text style={styles.navText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/doctor')}>
          <Ionicons name="medkit-outline" size={26} color="#0599ff" />
          <Text style={styles.navText}>Medic</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="person" size={26} color="#0599ff" />
          <Text style={styles.navText}>Profile</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// styles (tidak diubah)
const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    padding: 24,
    paddingBottom: 80,
    backgroundColor: '#F9FAFB',
  },
  logoutBtn: {
    marginTop: 50,
    width: 200,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0599ff',
    paddingVertical: 14,
    borderRadius: 14,
    shadowColor: '#0599ff',
    shadowOpacity: 0.3,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
    gap: 8,
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  flashcardContainer: {
    width: '100%',
    height:"auto",
    marginTop: 40,
    // backgroundColor:"red",
    paddingBottom:20
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: '#1c1c1e',
    marginBottom: 16,
  },
  loadingText: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#aaa',
    textAlign: 'center',
  },
  // card: {
  //   backgroundColor: '#fff',
  //   borderRadius: 16,
  //   padding: 20,
  //   marginBottom: 16,
  //   shadowColor: '#000',
  //   shadowOffset: { width: 0, height: 4 },
  //   shadowOpacity: 0.06,
  //   shadowRadius: 6,
  //   elevation: 4,
  // },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1c1c1e',
    marginBottom: 8,
  },
  cardContent: {
    fontSize: 15,
    color: '#333',
    lineHeight: 22,
  },
  cardType: {
    fontSize: 13,
    color: '#007aff',
    fontWeight: '500',
    marginBottom: 6,
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
  card: {
    width: 300,
    marginHorizontal: 12,
    padding: 24,
    backgroundColor: '#fff',
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 6,
    alignSelf: 'center',
  },

});
