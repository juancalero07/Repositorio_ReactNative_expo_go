import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import BotonEliminarUsuario from "./BotonEliminarUsuarios";

const TablaUsuarios = ({ usuarios, eliminarUsuario, editarUsuario }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Tabla de Usuarios</Text>

      {/* Encabezado */}
      <View style={[styles.fila, styles.encabezado]}>
        <Text style={[styles.celdaNombre, styles.textoEncabezado]}>Nombre</Text>
        <Text style={[styles.celdaCorreo, styles.textoEncabezado]}>Correo</Text>
        <Text style={[styles.celdaTelefono, styles.textoEncabezado]}>Teléfono</Text>
        <Text style={[styles.celdaEdad, styles.textoEncabezado]}>Edad</Text>
        <Text style={[styles.celdaAcciones, styles.textoEncabezado]}>Acciones</Text>
      </View>

      {/* Contenido */}
      <ScrollView>
        {usuarios.map((item) => (
          <View key={item.id} style={styles.fila}>
            <Text style={styles.celdaNombre}>{item.nombre}</Text>
            <Text style={styles.celdaCorreo}>{item.correo}</Text>
            <Text style={styles.celdaTelefono}>{item.telefono}</Text>
            <Text style={styles.celdaEdad}>{item.edad}</Text>

            <View style={styles.celdaAcciones}>
              <TouchableOpacity
                style={styles.botonEditar}
                onPress={() => editarUsuario(item)}
              >
                <Text style={styles.textoBoton}>✏️</Text>
              </TouchableOpacity>

              <BotonEliminarUsuario
                id={item.id}
                eliminarUsuario={eliminarUsuario}
              />
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
    textAlign: "center",
  },
  fila: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: "#CCC",
    paddingVertical: 8,
    alignItems: "center",
  },
  encabezado: {
    backgroundColor: "#f0f0f0",
  },
  celdaNombre: {
    flex: 1.5,
    fontSize: 14,
    textAlign: "left",
    paddingLeft: 5,
  },
  celdaCorreo: {
    flex: 2,
    fontSize: 14,
    textAlign: "left",
  },
  celdaTelefono: {
    flex: 1.2,
    fontSize: 14,
    textAlign: "center",
  },
  celdaEdad: {
    flex: 0.8,
    fontSize: 14,
    textAlign: "center",
  },
  celdaAcciones: {
    flex: 1.2,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  textoEncabezado: {
    fontWeight: "bold",
    fontSize: 15,
    textAlign: "center",
  },
  botonEditar: {
    backgroundColor: "#2a9d8f",
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 6,
  },
  textoBoton: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default TablaUsuarios;
