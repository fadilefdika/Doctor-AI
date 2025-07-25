import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  TouchableOpacity,
  ScrollView,
  Platform,
  KeyboardAvoidingView,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import DoctorCard from './doctorcard';

const MOCK_DOCTORS = [
  { id: '1', name: 'Dr. Sinta Jaya', specialty: 'Penyakit Dalam', image: 'https://i.pravatar.cc/100?img=1' },
  { id: '2', name: 'Dr. Andi Teguh', specialty: 'Anak', image: 'https://i.pravatar.cc/100?img=2' },
  { id: '3', name: 'Dr. Rina Kusuma', specialty: 'Jantung', image: 'https://i.pravatar.cc/100?img=3' },
  { id: '4', name: 'Dr. Budi Prakoso', specialty: 'Umum', image: 'https://i.pravatar.cc/100?img=4' },
];

const SUGGESTIONS = ['medic', 'anak', 'jantung', 'umum'];

export default function DoctorPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter();

  const filteredDoctors = MOCK_DOCTORS.filter((d) =>
    (d.name + d.specialty).toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f2f4f7' }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.container}>

          <View style={styles.searchBoxWrapper}>
            <TextInput
              placeholder="Search by keyword..."
              placeholderTextColor="#aaa"
              value={searchTerm}
              onChangeText={setSearchTerm}
              style={styles.input}
            />
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.suggestionsContainer}
          >
            {SUGGESTIONS.map((term, index) => (
              <TouchableOpacity
                key={index}
                style={styles.suggestionChip}
                onPress={() => setSearchTerm(term)}
                activeOpacity={0.7}
              >
                <Text style={styles.suggestionText}>{term}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <FlatList
            data={filteredDoctors}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <DoctorCard doctor={item} />}
            ListEmptyComponent={
              <Text style={styles.emptyText}>🧐 No doctors found.</Text>
            }
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 100 }}
          />
        </View>

        <View style={styles.bottomNav}>
          <TouchableOpacity style={styles.navItem} onPress={() => router.push('/home')}>
            <Ionicons name="home-outline" size={26} color="#0599ff" />
            <Text style={styles.navText}>Home</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navItem}>
            <Ionicons name="medkit" size={26} color="#0599ff" />
            <Text style={styles.navText}>Medic</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navItem} onPress={() => router.push('/profile')}>
            <Ionicons name="person-outline" size={26} color="#0599ff" />
            <Text style={styles.navText}>Profile</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f2f4f7',
    flex: 1,
    paddingTop:80
  },
  header: {
    fontSize: 26,
    fontWeight: '600',
    color: '#1e1e1e',
    marginBottom: 20,
  },
  searchBoxWrapper: {
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 10,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    elevation: 3,
    marginBottom: 14,
  },
  input: {
    fontSize: 16,
    color: '#111',
  },
  suggestionsContainer: {
    flexDirection: 'row'
  },
  suggestionChip: {
    height:40,
    backgroundColor: '#e6ecf2',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginRight: 10,
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 3,
    elevation: 1,
  },
  suggestionText: {
    color: '#333',
    fontSize: 14,
    fontWeight: '500',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    color: '#999',
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
