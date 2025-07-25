import React, { useState } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ActivityIndicator,
  Text,
} from 'react-native';
import axios from 'axios';
import { useRouter } from 'expo-router';
import Modal from 'react-native-modal';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState({ visible: false, title: '', message: '' });

  const router = useRouter();

  const showModal = (title: string, message: string) => {
    setModal({ visible: true, title, message });
  };

  const handleRegister = async () => {
    if (!name || !email || !password) {
      showModal('Registration Failed', 'All fields are required.');
      return;
    }

    setLoading(true);

    try {
      console.log(name,email,password);
      
      const response = await axios.post('https://plants-oem-adjustments-lightweight.trycloudflare.com/auth/register', {
        nama: name,
        email,
        password,
      });

      showModal('Registration Successful', 'Please log in with your account.');
      setTimeout(() => {
        setModal({ ...modal, visible: false });
        router.replace('/login');
      }, 1500);
    } catch (error) {
      console.error('Register error:', error);

      if (error.response) {
        const message = error.response.data?.message;

        if (message?.toLowerCase().includes('email')) {
          showModal('Registration Failed', 'Email is already registered.');
        } else if (message?.toLowerCase().includes('username')) {
          showModal('Registration Failed', 'Username is already taken.');
        } else {
          showModal('Registration Failed', message || 'An error occurred during registration.');
        }
      } else {
        showModal('Network Error', 'Unable to connect to the server.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Image
          source={require('../assets/images/LogoDocterAI.png')}
          style={styles.logo}
        />

        <Text style={styles.title}>Create Your Account</Text>

        <TextInput
          placeholder="Username"
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholderTextColor="#a0a0a0"
        />

        <TextInput
          placeholder="Email"
          style={styles.input}
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
          placeholderTextColor="#a0a0a0"
        />

        <View style={styles.passwordContainer}>
          <TextInput
            placeholder="Password"
            style={styles.passwordInput}
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={setPassword}
            placeholderTextColor="#a0a0a0"
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            {/* Add 👁️ toggle icon if needed */}
          </TouchableOpacity>
        </View>

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

        <TouchableOpacity onPress={() => router.replace('/login')} style={styles.loginButton}>
          <Text style={styles.loginText}>Already have an account? Login</Text>
        </TouchableOpacity>
      </View>

      {/* Modal Alert */}
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
    backgroundColor: '#f0f2f5',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  card: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    alignItems: 'center',
  },
  logo: {
    width: 80,
    height: 80,
    resizeMode: 'contain',
    marginBottom: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#333',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    padding: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 12,
    backgroundColor: '#f9f9f9',
    fontSize: 16,
    color: '#333',
  },
  passwordContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 12,
    backgroundColor: '#f9f9f9',
    marginBottom: 16,
    paddingRight: 12,
  },
  passwordInput: {
    flex: 1,
    padding: 14,
    fontSize: 16,
    color: '#333',
  },
  toggleText: {
    fontSize: 18,
    paddingHorizontal: 8,
  },
  button: {
    backgroundColor: '#0599ff',
    paddingVertical: 16,
    borderRadius: 12,
    width: '100%',
  },
  buttonDisabled: {
    opacity: 0.6,
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
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
    color: '#000',
  },
  modalMessage: {
    fontSize: 16,
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalClose: {
    fontSize: 16,
    color: '#0599ff',
    fontWeight: '500',
  },
});
