import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router, usePathname } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import Modal from 'react-native-modal';

export default function Profile() {
  const handleLogout = async () => {
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('username');
    router.replace('/login');
  }
  const router = useRouter();

  const [modal, setModal] = useState({
    visible: false,
    title: '',
    message: '',
  });

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
        showModal('Error', 'Failed to read token.');
        setTimeout(() => {
          setModal({ ...modal, visible: false });
          router.replace('/login');
        }, 1500);
      }
    };

    checkToken();
  }, []);

  return (
    <View style={styles.container}>
      {/* <Text style={styles.title}>Profil</Text> */}

      {/* Tombol Logout modern iOS-style */}
      <TouchableOpacity onPress={handleLogout} style={styles.logoutBtn}>
        <Ionicons name="log-out-outline" size={22} color="#fff" />
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>

      {/* Bottom Navbar */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/home')}>
          <Ionicons name="home-outline" size={26} color="#0599ff" />
          <Text style={styles.navText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/doctor')}>
          <Ionicons
            name="medkit-outline"
            size={26}
            color="#0599ff"
          />
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

const styles = StyleSheet.create({
  container: { 
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    padding: 24,
    paddingBottom: 80,
    backgroundColor: '#F9FAFB',
  },
  title: {
    fontSize: 28,
    fontWeight: '600',
    marginBottom: 32,
    color: '#1E1E1E',
  },
  logoutBtn: {
    marginTop: 550,
    width:200,
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
    // marginTop:16,
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
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
});
