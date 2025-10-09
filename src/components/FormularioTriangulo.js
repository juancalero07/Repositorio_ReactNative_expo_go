import React, { useState } from "react";
import { View, TextInput, Button, StyleSheet, Text, Alert } from "react-native";
import { db } from "../database/firebaseconfig";
import { collection, addDoc } from "firebase/firestore";

const FormularioTriangulo = ({ cargarDatos }) => {
  const [base, setBase] = useState("");
  const [altura, setAltura] = useState("");
  const [unidad, setUnidad] = useState("cm"); // Valor por defecto

  const guardarTriangulo = async () => {
    if (base && altura && unidad) {
      try {
        await addDoc(collection(db, "triangulos"), {
          base: parseFloat(base),
          altura: parseFloat(altura),
          unidad,
        });

        // Limpiamos los campos
        setBase("");
        setAltura("");
        setUnidad("cm");

        // Recargamos los datos
        cargarDatos();
      } catch (error) {
        console.error("Error al registrar triángulo:", error);
        Alert.alert("Error", "Ocurrió un error al intentar guardar el triángulo.");
      }
    } else {
      Alert.alert("Advertencia", "Por favor, complete todos los campos.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Registrar Triángulo</Text>

      <TextInput
        style={styles.input}
        placeholder="Base"
        value={base}
        onChangeText={setBase}
        keyboardType="numeric"
      />

      <TextInput
        style={styles.input}
        placeholder="Altura"
        value={altura}
        onChangeText={setAltura}
        keyboardType="numeric"
      />

      <TextInput
        style={styles.input}
        placeholder="Unidad (ej. cm)"
        value={unidad}
        onChangeText={setUnidad}
      />

      <Button title="Guardar Triángulo" onPress={guardarTriangulo} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 10 },
  titulo: { fontSize: 22, fontWeight: "bold", marginBottom: 10, textAlign: "center" },
  input: { borderWidth: 1, borderColor: "#ccc", marginBottom: 10, padding: 10, borderRadius: 5 },
});

export default FormularioTriangulo;
