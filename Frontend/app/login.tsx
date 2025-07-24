import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Alert,
    StyleSheet,
    Image,
    ActivityIndicator,
} from 'react-native';
import axios from 'axios';
import { useRouter } from 'expo-router';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async () => {
         router.push('/home'); 
        if (!email || !password) {
            Alert.alert('Login Gagal', 'Email dan password harus diisi.');
            return;
        }

        setLoading(true);

        try {
            const response = await axios.post('http://18.142.179.240:8001/auth/login', {
                email,
                password,
            });

            const data = response.data;
            Alert.alert('Login Berhasil', `Selamat datang, ${data.username || email}`);
            router.push('/home'); // pindahkan setelah berhasil login
        } catch (error) {
            console.error('Login error:', error);

            if (error.response) {
                const message = error.response.data?.message;

                if (
                    message?.toLowerCase().includes('email') ||
                    message?.toLowerCase().includes('username') ||
                    message?.toLowerCase().includes('user')
                ) {
                    Alert.alert('Login Gagal', 'Email atau username tidak ditemukan.');
                } else if (message?.toLowerCase().includes('password')) {
                    Alert.alert('Login Gagal', 'Password salah.');
                } else {
                    Alert.alert('Login Gagal', message || 'Email atau password salah.');
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

            {/* Tombol Register */}
            <TouchableOpacity onPress={() => router.push('/register')} style={styles.registerButton}>
                <Text style={styles.registerText}>Don't have an account ? Register</Text>
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
        backgroundColor: '#0984e3',
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
    registerButton: {
        marginTop: 16,
    },
    registerText: {
        color: '#0984e3',
        fontSize: 14,
        textAlign: 'center',
    },
});
