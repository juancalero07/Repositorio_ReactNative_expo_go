import React, { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import { db } from "../database/firebaseconfig.js";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
// Componentes adaptados para triángulos
import TituloTriangulo from "../components/TituloTriangulo.js";
import FormularioTriangulo from "../components/FormularioTriangulo.js";
import TablaTriangulo from "../components/TablaTriangulo.js";

const Triangulos = () => {
  const [triangulos, setTriangulos] = useState([]);
  const [resultado, setResultado] = useState(null);

  // Cargar datos desde Firebase
  const cargarDatos = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "triangulos"));
      const data = querySnapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
      }));
      setTriangulos(data);

      if (data.length > 0) {
        calcularAreaAPI(data);
      } else {
        setResultado(null);
      }
    } catch (error) {
      console.error("Error al obtener documentos:", error);
    }
  };

  // Calcular área usando la API
  const calcularAreaAPI = async (lista) => {
    try {
      console.log("Datos recibidos para calcular área:", lista);

      // Tomamos el primer triángulo como ejemplo para enviar a la API
      const payload = {
        base: lista[0].base || 0,
        altura: lista[0].altura || 0,
        unidad: lista[0].unidad || "cm",
      };

      console.log("Payload enviado a la API:", payload);

      const response = await fetch(
        "https://tnkdw5vqi9.execute-api.us-east-2.amazonaws.com/calcular-area-triangulo",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();
      console.log("Respuesta API:", data);

      if (data.area !== undefined && !data.error) {
        setResultado(data.area);
      } else {
        // Fallback local: área = (base * altura) / 2
        const areaLocal = (payload.base * payload.altura) / 2;
        setResultado(areaLocal);
      }
    } catch (error) {
      console.error("Error al calcular área en API:", error);
      const payload = lista[0];
      const areaLocal = (payload.base * payload.altura) / 2;
      setResultado(areaLocal);
    }
  };

  // Eliminar triángulo de Firebase
  const eliminarTriangulo = async (id) => {
    try {
      await deleteDoc(doc(db, "triangulos", id));
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
      <TituloTriangulo resultado={resultado} />
      <FormularioTriangulo cargarDatos={cargarDatos} />
      <TablaTriangulo triangulos={triangulos} eliminarTriangulo={eliminarTriangulo} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 2.7, padding: 20 },
});

export default Triangulos;
