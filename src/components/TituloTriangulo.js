import React from "react";
import { Text, StyleSheet } from "react-native";

const TituloTriangulo = ({ resultado }) => {
  return (
    <Text style={styles.titulo}>
      {resultado !== null
        ? `Área del Triángulo: ${resultado}`
        : "Sin datos de triángulo"}
    </Text>
  );
};

const styles = StyleSheet.create({
  titulo: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 10,
    textAlign: "center",
  },
});

export default TituloTriangulo;
