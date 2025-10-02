import React, { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import { db } from "../database/firebaseconfig.js";
import { collection, getDocs, doc, deleteDoc } from "firebase/firestore";
import ListaProductos from "../components/ListaProductos.js";
import FormularioProductos from "../components/FormularioProductos.js";
import TablaProductos from "../components/TablaProductos.js"

const Productos = () => {
  const [productos, setProductos] = useState([]);

  const cargarDatos = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "productos"));
      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProductos(data);
    } catch (error) {
      console.error("Error al obtener documentos:", error);
    }
    
  };

  useEffect(() => {
    // Cargar productos al montar el componente
    cargarDatos();
  }, []);
   const eliminarProducto = async (id) => {
      try {
        await deleteDoc(doc(db, "productos", id));
        cargarDatos(); // recargar lista
     }  catch (error) {
        console.error("Error al eliminar:", error);
    }
};
  return (
    <View style={styles.container}>
      <FormularioProductos cargarDatos={cargarDatos} />
      <TablaProductos productos={productos}
      eliminarProducto={eliminarProducto} />
      

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 2.5,
    padding: 20,
  },
});

export default Productos;
