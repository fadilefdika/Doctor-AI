import { View, Text, StyleSheet, Image } from 'react-native';

export default function DoctorCard({ doctor }) {
  return (
    <View style={styles.card}>
      <Image source={{ uri: doctor.image }} style={styles.image} />
      <View style={styles.info}>
        <Text style={styles.name}>{doctor.name}</Text>
        <Text style={styles.specialty}>{doctor.specialty}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 2,
    marginBottom: 12,
    alignItems: 'center',
  },
  image: {
    width: 64,
    height: 64,
    borderRadius: 32,
  },
  info: {
    marginLeft: 14,
    justifyContent: 'center',
  },
  name: {
    fontSize: 17,
    fontWeight: '600',
    color: '#222',
  },
  specialty: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
});
