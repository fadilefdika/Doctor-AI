import React, { useState } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  Image,
  ActivityIndicator,
  Text,
} from 'react-native';
import axios from 'axios';
import { useRouter } from 'expo-router';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async () => {
    if (!name || !email || !password) {
      Alert.alert('Registrasi Gagal', 'Semua field wajib diisi.');
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post('http://18.142.179.240:8001/auth/register', {
        name,
        email,
        password,
      });

      Alert.alert('Registrasi Berhasil', 'Silakan login dengan akun Anda.');
      router.replace('/login');
    } catch (error) {
      console.error('Register error:', error);

      if (error.response) {
        const message = error.response.data?.message;

        if (message?.toLowerCase().includes('email')) {
          Alert.alert('Registrasi Gagal', 'Email sudah terdaftar.');
        } else {
          Alert.alert('Registrasi Gagal', message || 'Terjadi kesalahan saat mendaftar.');
        }
      } else {
        Alert.alert('Kesalahan Jaringan', 'Tidak dapat terhubung ke server.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/images/LogoDocterAI.png')}
        style={styles.logo}
      />

      <TextInput
        placeholder="Username"
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholderTextColor="#7f8c8d"
      />

      <TextInput
        placeholder="Email"
        style={styles.input}
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
        placeholderTextColor="#7f8c8d"
      />

      <TextInput
        placeholder="Password"
        style={styles.input}
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        placeholderTextColor="#7f8c8d"
      />

      <TouchableOpacity
        onPress={handleRegister}
        style={[styles.button, loading && styles.buttonDisabled]}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Register</Text>
        )}
      </TouchableOpacity>

      {/* Tombol untuk Login */}
      <TouchableOpacity onPress={() => router.replace('/login')} style={styles.loginButton}>
        <Text style={styles.loginText}>Already have an Account? Login</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ecf0f1',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 24,
    resizeMode: 'contain',
  },
  input: {
    width: '100%',
    padding: 14,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: '#bdc3c7',
    borderRadius: 10,
    backgroundColor: '#fff',
    fontSize: 16,
    color: '#2d3436',
  },
  button: {
    backgroundColor: '#0599ff',
    paddingVertical: 16,
    borderRadius: 10,
    width: '100%',
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: '#fff',
    fontSize: 17,
    textAlign: 'center',
    fontWeight: '600',
  },
  loginButton: {
    marginTop: 16,
  },
  loginText: {
    color: '#0599ff',
    fontSize: 14,
    textAlign: 'center',
  },
});
