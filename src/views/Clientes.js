import React, { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import { db } from "../database/firebaseconfig.js";
import { collection, getDocs,deleteDoc, doc } from "firebase/firestore";
import FormularioClientes from "../components/FormularioClientes.js";
import TablaClientes from "../components/TablaClientes.js";// Asegúrate de que este path sea correcto

const Clientes = () => {
  const [clientes, setClientes] = useState([]);

  const cargarDatos = async () => {
    try {
      // Colección cambiada a "clientes"
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

  // Función de eliminación adaptada para "clientes"
  const eliminarCliente = async (id) => {
    try {
      // Referencia al documento de la colección "clientes"
      await deleteDoc(doc(db, "clientes", id)); 
      cargarDatos(); // recargar lista
    } catch (error) {
      console.error("Error al eliminar:", error);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  return (
    <View style={styles.container}>
      <FormularioClientes cargarDatos={cargarDatos} />
      {/* Se añade el componente TablaClientes con los datos y la función de eliminación */}
      <TablaClientes
        clientes={clientes}
        eliminarCliente={eliminarCliente} 
      /> 
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex:2.5, padding: 20},
});

export default Clientes;