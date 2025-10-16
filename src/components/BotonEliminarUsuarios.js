import React, { useState } from "react";
import { View, Text, TouchableOpacity, Modal, StyleSheet } from "react-native";

// El componente se llama ahora BotonEliminarUsuario y recibe eliminarUsuario
const BotonEliminarUsuario = ({ id, eliminarUsuario }) => {
  const [visible, setVisible] = useState(false);

  const confirmarEliminar = () => {
    setVisible(false);
    // Llama a la función de eliminación de usuario
    eliminarUsuario(id);
  };

  return (
    <View>
      {/* Botón pequeño */}
      <TouchableOpacity
        style={styles.boton}
        onPress={() => setVisible(true)}
      >
        <Text style={styles.textoBoton}>🗑</Text>
      </TouchableOpacity>

      {/* Modal de confirmación */}
      <Modal
        visible={visible}
        transparent
        animationType="fade"
        onRequestClose={() => setVisible(false)}
      >
        <View style={styles.overlay}>
          <View style={styles.modal}>
            {/* El texto del modal se actualiza para referirse a 'usuario' */}
            <Text style={styles.texto}>¿Desea eliminar este usuario?</Text> 

            <View style={styles.fila}>
              <TouchableOpacity
                style={[styles.botonAccion, styles.cancelar]}
                onPress={() => setVisible(false)}
              >
                <Text style={styles.textoAccion}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.botonAccion, styles.confirmar]}
                onPress={confirmarEliminar}
              >
                <Text style={styles.textoAccion}>Eliminar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};


// --- ESTILOS (SE MANTIENEN IDÉNTICOS) ---

const styles = StyleSheet.create({
  boton: {
    padding: 4,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    backgroundColor: "#e63946", // Cambiado el color del botón principal a rojo para que sea más visible como eliminar
  },
  textoBoton: { color: "white", fontSize: 14 },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modal: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    width: "80%",
    alignItems: "center",
  },
  texto: { fontSize: 18, marginBottom: 20, textAlign: 'center' },
  fila: { flexDirection: "row", justifyContent: "space-between", width: "100%" },
  botonAccion: {
    flex: 1,
    marginHorizontal: 5,
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  cancelar: { backgroundColor: "#ccc" },
  confirmar: { backgroundColor: "#e63946" },
  textoAccion: { color: "white", fontWeight: "bold" },
});

// Exportamos el componente con el nombre de usuario
export default BotonEliminarUsuario;