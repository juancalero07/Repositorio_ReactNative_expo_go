import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, ScrollView } from "react-native";
import { db } from "./src/database/firebaseconfig";
import { collection, getDocs } from "firebase/firestore";

export default function App() {
  const [productos, setProductos] = useState([]);
  const [clientes, setClientes] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // --- Colección Productos ---
        const querySnapshot = await getDocs(collection(db, "productos"));
        const data = querySnapshot.docs.map(async (doc) => {
          const productoData = { id: doc.id, ...doc.data() };
          // Subcolección sabores
          const saboresSnapshot = await getDocs(
            collection(db, `productos/${doc.id}/sabores`)
          );
          productoData.sabores = saboresSnapshot.docs.map((subDoc) => ({
            id: subDoc.id,
            ...subDoc.data(),
          }));
          return productoData;
        });
        const productosConSabores = await Promise.all(data);
        setProductos(productosConSabores);

        // --- Colección Clientes (solo nombre y apellido) ---
        const clientesSnapshot = await getDocs(collection(db, "clientes"));
        const clientesData = clientesSnapshot.docs.map((doc) => ({
          id: doc.id,
          nombre: doc.data().nombre || "",
          apellido: doc.data().apellido || "",
        }));
        setClientes(clientesData);

      } catch (error) {
        console.error("Error al obtener documentos: ", error);
      }
    };

    fetchData();
  }, []);

  return (
    <ScrollView style={styles.container}>
      {/* Productos */}
      <Text style={styles.titulo}>Lista de Productos</Text>
      <FlatList
        data={productos}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text>{item.nombre} - ${item.precio}</Text>
            {item.sabores && item.sabores.length > 0 && (
              <FlatList
                data={item.sabores}
                keyExtractor={(subItem) => subItem.id}
                renderItem={({ item: subItem }) => (
                  <Text style={styles.subItem}> - {subItem.sabor}</Text>
                )}
              />
            )}
          </View>
        )}
      />

      {/* Clientes */}
      <Text style={styles.titulo}>Lista de Clientes</Text>
      <FlatList
        data={clientes}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text>{item.nombre} {item.apellido}</Text>
          </View>
        )}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  titulo: { fontSize: 22, fontWeight: "bold", marginVertical: 10 },
  item: { marginBottom: 15 },
  subItem: { fontSize: 16, marginLeft: 20 },
});