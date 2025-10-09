import React from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import BotonEliminarProducto from "./BotonEliminarProducto.js";

const TablaProductos = ({ productos, eliminarProducto, editarProducto }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Tabla de Productos</Text>

      {/* Encabezado */}
      <View style={[styles.fila, styles.encabezado]}>
        <Text style={[styles.celda, styles.textoEncabezado]}>Nombre</Text>
        <Text style={[styles.celda, styles.textoEncabezado]}>Precio</Text>
        <Text style={[styles.celda, styles.textoEncabezado]}>Acciones</Text>
      </View>

      {/* Contenido */}
      <ScrollView>
        {productos.map((item) => (
          <View key={item.id} style={styles.fila}>
            <Text style={styles.celda}>{item.nombre}</Text>
            <Text style={styles.celda}>${item.precio}</Text>

            <View style={styles.celdaAcciones}>
              <TouchableOpacity
                style={styles.botonEditar}
                onPress={() => editarProducto(item)}
              >
                <Text style={styles.textoBoton}>✏️</Text>
              </TouchableOpacity>

              <BotonEliminarProducto id={item.id} eliminarProducto={eliminarProducto} />
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignSelf: "stretch",
  },
  titulo: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
  },
  fila: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: "#ccc",
    paddingVertical: 6,
    alignItems: "center",
  },
  encabezado: {
    backgroundColor: "#f0f0f0",
  },
  celda: {
    flex: 1,
    fontSize: 16,
    textAlign: "center",
  },
  celdaAcciones: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  textoEncabezado: {
    fontWeight: "bold",
    fontSize: 17,
    textAlign: "center",
  },
  botonActualizar: {
    backgroundColor: "#a6aba6ff",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
  },
  textoBoton: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default TablaProductos;
