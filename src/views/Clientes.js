import React, { useEffect, useState } from "react";
import { View, StyleSheet, Alert } from "react-native";
import { db } from "../database/firebaseconfig.js";
import { collection, getDocs, deleteDoc, doc, addDoc, updateDoc } from "firebase/firestore";
import FormularioClientes from "../components/FormularioClientes.js";
import TablaClientes from "../components/TablaClientes.js";

const Clientes = () => {
  const [clientes, setClientes] = useState([]);
  const [nuevoCliente, setNuevoCliente] = useState({ nombre: "", apellido: "" });
  const [modoEdicion, setModoEdicion] = useState(false);
  const [idActualizar, setIdActualizar] = useState(null);

  // Cargar datos desde Firestore
  const cargarDatos = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "clientes"));
      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setClientes(data);
    } catch (error) {
      console.error("Error al obtener documentos:", error);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  // Manejo de cambios en el formulario
  const manejoCambio = (campo, valor) => {
    setNuevoCliente({ ...nuevoCliente, [campo]: valor });
  };

  // Guardar nuevo cliente
  const guardarCliente = async () => {
    if (nuevoCliente.nombre && nuevoCliente.apellido) {
      try {
        await addDoc(collection(db, "clientes"), {
          nombre: nuevoCliente.nombre,
          apellido: nuevoCliente.apellido,
        });
        setNuevoCliente({ nombre: "", apellido: "" });
        Alert.alert("Éxito", "Cliente guardado correctamente");
        cargarDatos();
      } catch (error) {
        console.error("Error al registrar cliente:", error);
      }
    } else {
      Alert.alert("Error", "Por favor complete todos los campos.");
    }
  };

  // Eliminar cliente
  const eliminarCliente = async (id) => {
    Alert.alert("Confirmar eliminación", "¿Desea eliminar este cliente?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Eliminar",
        onPress: async () => {
          try {
            await deleteDoc(doc(db, "clientes", id));
            cargarDatos();
          } catch (error) {
            console.error("Error al eliminar:", error);
          }
        },
      },
    ]);
  };

  // Cargar datos al formulario para editar
  const editarCliente = (cliente) => {
    setNuevoCliente({ nombre: cliente.nombre, apellido: cliente.apellido });
    setIdActualizar(cliente.id);
    setModoEdicion(true);
  };

  // Actualizar cliente existente
  const actualizarCliente = async () => {
    if (nuevoCliente.nombre && nuevoCliente.apellido && idActualizar) {
      try {
        const clienteRef = doc(db, "clientes", idActualizar);
        await updateDoc(clienteRef, {
          nombre: nuevoCliente.nombre,
          apellido: nuevoCliente.apellido,
        });
        setNuevoCliente({ nombre: "", apellido: "" });
        setModoEdicion(false);
        setIdActualizar(null);
        Alert.alert("Éxito", "Cliente actualizado correctamente");
        cargarDatos();
      } catch (error) {
        console.error("Error al actualizar cliente:", error);
      }
    } else {
      Alert.alert("Error", "Por favor complete todos los campos.");
    }
  };

  return (
    <View style={styles.container}>
      <FormularioClientes
        nuevoCliente={nuevoCliente}
        manejoCambio={manejoCambio}
        guardarCliente={guardarCliente}
        actualizarCliente={actualizarCliente}
        modoEdicion={modoEdicion}
      />

      <TablaClientes
        clientes={clientes}
        eliminarCliente={eliminarCliente}
        editarCliente={editarCliente}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 2.5,
    padding: 20,
  },
});

export default Clientes;
