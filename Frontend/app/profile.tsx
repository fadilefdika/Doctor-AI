import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

export default function Profile() {
  return (
    <View style={styles.container}>
      {/* <Text style={styles.title}>Profil</Text> */}

      {/* Tombol Logout modern iOS-style */}
      <TouchableOpacity style={styles.logoutBtn}>
        <Ionicons name="log-out-outline" size={22} color="#fff" />
        <Text style={styles.logoutText}>Keluar</Text>
      </TouchableOpacity>

      {/* Bottom Navbar */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/home')}>
          <Ionicons name="home-outline" size={26} color="#3C84F5" />
          <Text style={styles.navText}>Beranda</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/produk')}>
          <Ionicons name="pricetag-outline" size={26} color="#3C84F5" />
          <Text style={styles.navText}>Produk</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/profile')}>
          <Ionicons name="person" size={26} color="#3C84F5" />
          <Text style={styles.navText}>Profile</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
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
    marginTop:550,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3C84F5',
    paddingVertical: 14,
    borderRadius: 14,
    shadowColor: '#3C84F5',
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
    color: '#3C84F5',
    marginTop: 2,
  },
});
