import React from "react";
import { View, TextInput, Button, StyleSheet, Text } from "react-native";

const FormularioUsuarios = ({
  nuevoUsuario,
  manejoCambioUsuario,
  guardarUsuario,
  actualizarUsuario,
  modoEdicion,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>
        {modoEdicion ? "Editar Usuario" : "Registro de Usuarios"}
      </Text>

      {/* Campo para el Nombre */}
      <TextInput
        style={styles.input}
        placeholder="Nombre"
        value={nuevoUsuario.nombre}
        onChangeText={(valor) => manejoCambioUsuario("nombre", valor)}
      />

      {/* Campo para el Correo */}
      <TextInput
        style={styles.input}
        placeholder="Correo"
        keyboardType="email-address"
        value={nuevoUsuario.correo}
        onChangeText={(valor) => manejoCambioUsuario("correo", valor)}
      />

      {/* Campo para el Teléfono */}
      <TextInput
        style={styles.input}
        placeholder="Teléfono"
        keyboardType="phone-pad"
        value={nuevoUsuario.telefono}
        onChangeText={(valor) => manejoCambioUsuario("telefono", valor)}
      />
      
      {/* Campo para la Edad */}
      <TextInput
        style={styles.input}
        placeholder="Edad"
        keyboardType="numeric"
        value={nuevoUsuario.edad}
        onChangeText={(valor) => manejoCambioUsuario("edad", valor)}
      />

      <Button
        title={modoEdicion ? "Actualizar" : "Guardar"}
        onPress={modoEdicion ? actualizarUsuario : guardarUsuario}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  titulo: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    marginBottom: 10,
    padding: 10,
  },
});

export default FormularioUsuarios;