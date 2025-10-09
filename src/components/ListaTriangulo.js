import React from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";

const ListaTriangulo = ({ triangulos }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Triángulos Registrados</Text>

      <FlatList
        data={triangulos}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <Text style={styles.item}>
              ID: {item.id.substring(0, 8)}... | Base: {item.base} | Altura: {item.altura} | Unidad: {item.unidad}
            </Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    justifyContent: "center",
    paddingHorizontal: 10,
  },
  titulo: { 
    fontSize: 22, 
    fontWeight: "bold", 
    marginBottom: 10, 
    textAlign: "center",
  },
  itemContainer: { 
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  item: { 
    fontSize: 16, 
    color: "#333",
  },
});

export default ListaTriangulo;
