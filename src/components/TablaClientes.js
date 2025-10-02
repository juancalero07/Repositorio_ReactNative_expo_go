import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
// Reutilizamos el BotonEliminarProducto para esta nueva tabla
import BotonEliminarCliente from "./BotonEliminarCliente";

const TablaClientes = ({ clientes, eliminarCliente }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Tabla de Clientes</Text>

      {/* Encabezado de la tabla */}
      <View style={[styles.fila, styles.encabezado]}>
        <Text style={[styles.celda, styles.textoEncabezado]}>Nombre</Text>
        <Text style={[styles.celda, styles.textoEncabezado]}>Apellido</Text> 
        <Text style={[styles.celda, styles.textoEncabezado]}>Acciones</Text>
      </View>

      {/* Contenido de la tabla */}
      <ScrollView>
        {clientes.map((item) => (
          // Usamos el ID del documento (ej: 27b6mAPzICRxoRE2zA1Z) como key
          <View key={item.id} style={styles.fila}> 
            {/* Campos del cliente de la imagen */}
            <Text style={styles.celda}>{item.nombre}</Text>
            <Text style={styles.celda}>{item.apellido}</Text> 
            

            {/* Columna de Acciones */}
            <View style={styles.celdaAcciones}>
              <BotonEliminarCliente
                id={item.id}
                // Cambiamos a eliminarCliente
                eliminarCliente={eliminarCliente} 
              />
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

// --- ESTILOS MODIFICADOS LIGERAMENTE PARA ACOMODAR UNA COLUMNA EXTRA ---

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignSelf: "stretch"
  },
  titulo: { fontSize: 22, fontWeight: "bold", marginBottom: 10 },
  fila: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: "#CCC",
    paddingVertical: 6,
    alignItems: "center",
  },
  encabezado: {
    backgroundColor: "#f0f0f0",
  },
  // La celda ahora tiene un flex menor (flex: 1) para dar espacio a la columna extra
  celda: { 
    flex: 1, 
    fontSize: 16,
    textAlign: "center",
  },
  celdaAcciones: {
    // La columna de acciones es más pequeña
    flex: 0.7, 
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
});

export default TablaClientes;