import React, { useEffect, useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";

// Importaciones de Firebase Realtime Database
import { ref, set, push, onValue } from "firebase/database";
import { realtimeDB } from "../database/firebaseconfig"; // Asumiendo esta es la ruta a tu config

const ProductosRealtime = () => {
  // 1. Variables de estado para los campos del formulario y el listado [cite: 24]
  const [nombre, setNombre] = useState("");
  const [precio, setPrecio] = useState("");
  const [productosRT, setProductosRT] = useState([]);

  // 2. Método para guardar datos en Realtime Database [cite: 25]
  const guardarEnRT = async () => {
    if (!nombre || !precio) {
      Alert.alert("Rellena ambos campos");
      return;
    }
    try {
      const referencia = ref(realtimeDB, "productos_rt");
      const nuevoRef = push(referencia); // crea ID automático
      await set(nuevoRef, {
        nombre,
        precio: Number(precio),
      });

      setNombre("");
      setPrecio("");

      Alert.alert("Producto guardado en Realtime");
    } catch (error) {
      console.log("Error al guardar:", error);
    }
  };

  // 3. Método para leer datos en Realtime Database (con escucha en tiempo real) [cite: 26]
  const leerRT = () => {
    const referencia = ref(realtimeDB, "productos_rt");

    onValue(referencia, (snapshot) => {
      if (snapshot.exists()) {
        // snapshot.val() devuelve un objeto {id: {data}}
        const dataObj = snapshot.val();

        // convertir ese objeto en un array limpio
        const lista = Object.entries(dataObj).map(([id, datos]) => ({
          id,
          ...datos,
        }));
        setProductosRT(lista);
      } else {
        setProductosRT([]);
      }
    });
  };

  // 4. useEffect para cargar los datos al acceder a la vista [cite: 27]
  useEffect(() => {
    leerRT(); // Se conecta a los cambios en tiempo real
  }, []);

  // 5. Retorno de la vista con formulario y listado [cite: 28]
  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Prueba Realtime Database</Text>
      <TextInput
        style={styles.input}
        placeholder="Nombre producto"
        value={nombre}
        onChangeText={setNombre}
      />
      <TextInput
        style={styles.input}
        placeholder="Precio"
        keyboardType="numeric"
        value={precio}
        onChangeText={setPrecio}
      />
      <Button title="Guardar en Realtime" onPress={guardarEnRT} />
      <Text style={styles.subtitulo}>Productos en RT:</Text>
      {productosRT.length === 0 ? (
        <Text>No hay productos</Text>
      ) : (
        productosRT.map((p) => (
          <Text key={p.id}>
            • {p.nombre} - ${p.precio}
          </Text>
        ))
      )}
    </View>
  );
};

export default ProductosRealtime; // Exportación de la vista [cite: 23]

// 6. Estilos de la vista [cite: 29]
const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, marginTop: 50 },
  titulo: { fontSize: 22, fontWeight: "bold", marginBottom: 20 },
  subtitulo: { fontSize: 18, marginTop: 20, fontWeight: "bold" },
  input: {
    borderWidth: 1,
    borderColor: "#aaa",
    padding: 8,
    marginBottom: 10,
    borderRadius: 5,
  },
});