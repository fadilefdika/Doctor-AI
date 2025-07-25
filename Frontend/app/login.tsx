import React, { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Image,
    ActivityIndicator,
} from 'react-native';
import axios from 'axios';
import { useRouter } from 'expo-router';
import Modal from 'react-native-modal';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [modal, setModal] = useState({ visible: false, title: '', message: '' });

    const router = useRouter();

    const showModal = (title: string, message: string) => {
        setModal({ visible: true, title, message });
    };

    const handleLogin = async () => {
        if (!email || !password) {
            showModal('Login Failed', 'Email and password are required.');
            return;
        }

        setLoading(true);

        try {
            const response = await axios.post(' https://stores-lands-simultaneously-definitely.trycloudflare.com/auth/login', {
                email,
                password,
            });
            console.log(response.data)
            const { access_token, user } = response.data;
            await AsyncStorage.setItem('token', access_token);
            await AsyncStorage.setItem('username', user || '');
            const data = response.data;
            showModal('Login Successful', `Welcome back, ${data.user || email}`);
            setTimeout(() => {
                setModal({ ...modal, visible: false });
                router.push('/home');
            }, 1500);
        } catch (error) {
            console.log(error)
            const message = error.response?.data?.message || 'An error occurred.';

            if (message.toLowerCase().includes('email') || message.toLowerCase().includes('user')) {
                showModal('Login Failed', 'Email or username not found.');
            } else if (message.toLowerCase().includes('password')) {
                showModal('Login Failed', 'Incorrect password.');
            } else {
                showModal('Login Failed', error);
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

                <Text style={styles.title}>Welcome Back</Text>

                <TextInput
                    placeholder="Email"
                    style={styles.input}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    value={email}
                    onChangeText={setEmail}
                    placeholderTextColor="#a0a0a0"
                />

                <TextInput
                    placeholder="Password"
                    style={styles.input}
                    secureTextEntry
                    value={password}
                    onChangeText={setPassword}
                    placeholderTextColor="#a0a0a0"
                />

                <TouchableOpacity
                    onPress={handleLogin}
                    style={[styles.button, loading && styles.buttonDisabled]}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text style={styles.buttonText}>Login</Text>
                    )}
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => router.push('/register')}
                    style={styles.registerButton}
                >
                    <Text style={styles.registerText}>Don't have an account? Register</Text>
                </TouchableOpacity>
            </View>

            {/* iOS-style modal */}
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
    registerButton: {
        marginTop: 16,
    },
    registerText: {
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
