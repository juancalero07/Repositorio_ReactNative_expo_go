import React, { useEffect, useState} from "react";
import { View, StyleSheet, Alert, Button} from "react-native";
import { db } from "../database/firebaseconfig.js";
import { collection, getDocs, doc, deleteDoc, addDoc, updateDoc } from "firebase/firestore";
import FormularioProductos from "../components/FormularioProductos.js";
import TablaProductos from "../components/TablaProductos.js";


const Productos = ({cerrarSesion}) => {
  const [productos, setProductos] = useState([]);
  const [nuevoProducto, setNuevoProducto] = useState({ nombre: "", precio: "" });
  const [modoEdicion, setModoEdicion] = useState(false);
  const [idActualizar, setIdActualizar] = useState(null);

  // Cargar productos desde Firestore
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
    cargarDatos();
  }, []);

  // Manejar cambios en el formulario
  const manejoCambio = (campo, valor) => {
    setNuevoProducto({ ...nuevoProducto, [campo]: valor });
  };

  // Guardar producto nuevo
  const guardarProducto = async () => {
    if (nuevoProducto.nombre && nuevoProducto.precio) {
      try {
        await addDoc(collection(db, "productos"), {
          nombre: nuevoProducto.nombre,
          precio: parseFloat(nuevoProducto.precio),
        });
        setNuevoProducto({ nombre: "", precio: "" });
        Alert.alert("Éxito", "Producto guardado correctamente");
        cargarDatos();
      } catch (error) {
        console.error("Error al registrar producto:", error);
      }
    } else {
      Alert.alert("Error", "Por favor complete todos los campos.");
    }
  };

  // Eliminar producto
  const eliminarProducto = async (id) => {
    try {
      await deleteDoc(doc(db, "productos", id));
      cargarDatos();
    } catch (error) {
      console.error("Error al eliminar:", error);
    }
  };

  // Cargar datos en modo edición
  const editarProducto = (producto) => {
    setNuevoProducto({ nombre: producto.nombre, precio: String(producto.precio) });
    setIdActualizar(producto.id);
    setModoEdicion(true);
  };

  // Actualizar producto existente
  const actualizarProducto = async () => {
    if (nuevoProducto.nombre && nuevoProducto.precio && idActualizar) {
      try {
        const productoRef = doc(db, "productos", idActualizar);
        await updateDoc(productoRef, {
          nombre: nuevoProducto.nombre,
          precio: parseFloat(nuevoProducto.precio),
        });
        setNuevoProducto({ nombre: "", precio: "" });
        setModoEdicion(false);
        setIdActualizar(null);
        Alert.alert("Éxito", "Producto actualizado correctamente");
        cargarDatos();
      } catch (error) {
        console.error("Error al actualizar producto:", error);
      }
    } else {
      Alert.alert("Error", "Por favor complete todos los campos.");
    }
  };

  return (
    <View style={styles.container}>
      <Button title="Cerrar Sesión" onPress={cerrarSesion} />
      <FormularioProductos
        nuevoProducto={nuevoProducto}
        manejoCambio={manejoCambio}
        guardarProducto={guardarProducto}
        actualizarProducto={actualizarProducto}
        modoEdicion={modoEdicion}
        
      />
    

      <TablaProductos
        productos={productos}
        eliminarProducto={eliminarProducto}
        editarProducto={editarProducto}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex:1,
    padding:30,
  },
});

export default Productos;
