import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert, ScrollView, TouchableOpacity } from "react-native";
// Importar onValue para leer datos en tiempo real
import { ref, set, push, onValue } from "firebase/database";
import { realtimeDB } from "../database/firebaseconfig"; 

// Aceptamos la prop 'cerrarSesion' que viene de App.js
const IMCCalculator = ({ cerrarSesion }) => { 
  // Variables de estado para el formulario
  const [nombre, setNombre] = useState("");
  const [peso, setPeso] = useState(""); // en kg
  const [altura, setAltura] = useState(""); // en metros
  const [imc, setImc] = useState(null);
  const [estado, setEstado] = useState("");

  // 🎯 Estado para guardar la lista de registros de IMC
  const [registrosIMC, setRegistrosIMC] = useState([]);

  // 1. Método para calcular el IMC
  const calcularIMC = () => {
    if (!nombre || !peso || !altura) {
      Alert.alert("Error", "Por favor, rellena todos los campos.");
      return;
    }

    const p = parseFloat(peso);
    const a = parseFloat(altura);

    if (isNaN(p) || isNaN(a) || a <= 0) {
      Alert.alert("Error", "El peso y la altura deben ser números válidos y la altura mayor a cero.");
      return;
    }

    const resultadoIMC = (p / (a * a)).toFixed(2);
    setImc(resultadoIMC);
    
    let estadoNutricional = "";
    if (resultadoIMC < 18.5) {
      estadoNutricional = "Bajo peso";
    } else if (resultadoIMC >= 18.5 && resultadoIMC <= 24.9) {
      estadoNutricional = "Peso normal";
    } else if (resultadoIMC >= 25 && resultadoIMC <= 29.9) {
      estadoNutricional = "Sobrepeso";
    } else {
      estadoNutricional = "Obesidad";
    }
    setEstado(estadoNutricional);

    guardarIMC(nombre, p, a, resultadoIMC, estadoNutricional);
  };

  // 2. Método para guardar el resultado del IMC en Realtime Database
  const guardarIMC = async (n, p, a, resultadoIMC, estadoNutricional) => {
    try {
      const referencia = ref(realtimeDB, "registros_imc"); 
      const nuevoRef = push(referencia); 
      
      await set(nuevoRef, { 
        nombre: n,
        peso_kg: p,
        altura_m: a,
        imc: parseFloat(resultadoIMC),
        estado: estadoNutricional,
        fecha: new Date().toISOString(),
      });

      Alert.alert("Éxito", "Cálculo de IMC guardado en Realtime Database.");
      
      setNombre("");
      setPeso("");
      setAltura("");
      
    } catch (error) {
      console.log("Error al guardar el IMC:", error);
      Alert.alert("Error", "No se pudo guardar el registro en Firebase.");
    }
  };

  // 3. Método para leer los registros en tiempo real
  const leerIMC = () => {
    const referencia = ref(realtimeDB, "registros_imc");

    const unsubscribe = onValue(referencia, (snapshot) => {
      if (snapshot.exists()) {
        const dataObj = snapshot.val();
        
        // Convertir el objeto de Firebase en un array de registros
        const lista = Object.entries(dataObj).map(([id, datos]) => ({
          id,
          ...datos,
        })).reverse(); // Mostrar los más nuevos primero
        
        setRegistrosIMC(lista);
      } else {
        setRegistrosIMC([]);
      }
    });

    // Devolver la función de limpieza para detener la escucha
    return unsubscribe; 
  };

  // 4. useEffect para iniciar la escucha de datos al cargar el componente
  useEffect(() => {
    // Es importante devolver la función de limpieza
    const cleanup = leerIMC();
    return () => cleanup();
  }, []);

  // Función auxiliar para formatear la fecha
  const formatDate = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  return (
    <ScrollView style={styles.container}>
      {/* Nuevo Header con Título y Botón de Cerrar Sesión */}
      <View style={styles.header}>
        <Text style={styles.titulo}>Calculadora y Registro de IMC</Text>
        <TouchableOpacity onPress={cerrarSesion} style={styles.logoutButton}>
          <Text style={styles.logoutText}>Cerrar Sesión</Text>
        </TouchableOpacity>
      </View>

      {/* --- Formulario --- */}
      <View style={styles.card}>
        <Text style={styles.subtitulo}>Nuevo Registro</Text>
        <TextInput
          style={styles.input}
          placeholder="Nombre"
          value={nombre}
          onChangeText={setNombre}
        />
        <TextInput
          style={styles.input}
          placeholder="Peso (kg)"
          keyboardType="numeric"
          value={peso}
          onChangeText={setPeso}
        />
        <TextInput
          style={styles.input}
          placeholder="Altura (metros)"
          keyboardType="numeric"
          value={altura}
          onChangeText={setAltura}
        />
        <Button title="Calcular y Guardar IMC" onPress={calcularIMC} color="#3f51b5" />
      </View>
      
      {/* --- Resultado del Último Cálculo --- */}
      {imc !== null && (
        <View style={styles.resultadoContainer}>
          <Text style={styles.subtitulo}>Último Resultado:</Text>
          
          {/* FIX 1: Uso de <Text> anidado para asegurar que la etiqueta estática 'IMC:' esté envuelta con negrita */}
          <Text style={styles.resultText}>
            <Text style={{ fontWeight: 'bold' }}>IMC:</Text> {imc}
          </Text>
          
          <Text style={[styles.resultText, { color: styles.statusColor[estado] || '#333' }]}>
            <Text style={{ fontWeight: 'bold' }}>Estado:</Text> {estado}
          </Text>

        </View>
      )}

      {/* 5. Historial de Registros en Formato Tarjeta */}
      <Text style={[styles.subtitulo, { marginTop: 30 }]}>Historial de Registros ({registrosIMC.length})</Text>

      {registrosIMC.length === 0 ? (
        <Text style={{ textAlign: 'center', marginTop: 10, color: '#666' }}>No hay registros de IMC guardados. ¡Agrega el primero!</Text>
      ) : (
        registrosIMC.map((registro) => (
          <View key={registro.id} style={styles.registroCard}>
            <View style={styles.row}>
              <Text style={styles.cardTitle}>{registro.nombre}</Text>
              <Text style={styles.cardDate}>{formatDate(registro.fecha)}</Text>
            </View>
            
            {/* FIX 2: Implementación más explícita para el detalle de Altura y Peso */}
            <Text style={styles.cardDetail}>
              <Text style={{ fontWeight: 'bold' }}>Altura:</Text> {registro.altura_m} m
            </Text>
            <Text style={styles.cardDetail}>
              <Text style={{ fontWeight: 'bold' }}>Peso:</Text> {registro.peso_kg} kg
            </Text>

            <View style={styles.row}>
                {/* FIX 3: Implementación más explícita para el detalle de IMC del historial */}
                <Text style={styles.cardIMC}>
                  <Text style={{ fontWeight: '700' }}>IMC:</Text> {registro.imc}
                </Text>
                
                <Text style={[styles.cardStatus, { backgroundColor: styles.statusColor[registro.estado] || '#607d8b' }]}>
                    {registro.estado}
                </Text>
            </View>
          </View>
        ))
      )}
      <View style={{ height: 50 }} /> 
    </ScrollView>
  );
};

export default IMCCalculator;

// Estilos
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: '#f5f5f5', // Fondo más suave
  },
  // --- NUEVOS ESTILOS PARA EL ENCABEZADO DENTRO DE IMCCalculator ---
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 40, // Espacio superior para el notch/barra de estado
    marginBottom: 20, // Espacio antes del formulario
    paddingHorizontal: 0, // No necesitamos padding horizontal aquí
  },
  titulo: {
    fontSize: 22, // Un poco más pequeño para dejar espacio al botón
    fontWeight: "bold",
    textAlign: 'left',
    color: '#3f51b5',
    flex: 1, // Permite que el título ocupe el espacio restante
  },
  logoutButton: {
    backgroundColor: '#f44336', // Rojo
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginLeft: 10,
  },
  logoutText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  },
  // --- FIN NUEVOS ESTILOS ---
  subtitulo: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: 10,
    marginBottom: 10,
    color: '#3f51b5',
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    marginBottom: 15,
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  card: {
    padding: 15,
    borderRadius: 10,
    backgroundColor: '#fff', 
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 3,
  },
  resultadoContainer: {
    marginTop: 20,
    padding: 15,
    borderLeftWidth: 5,
    borderLeftColor: '#4caf50', // Color que llama la atención
    borderRadius: 8,
    backgroundColor: '#e8f5e9', // Fondo suave para el resultado
  },
  resultText: {
    fontSize: 16,
    marginBottom: 5,
    color: '#333',
  },
  // Estilos de la tarjeta de registro (Historial)
  registroCard: {
    padding: 15,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#3f51b5',
  },
  cardDate: {
    fontSize: 12,
    color: '#999',
  },
  cardDetail: {
    fontSize: 14,
    color: '#666',
  },
  cardIMC: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000',
    paddingVertical: 5,
  },
  cardStatus: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 15, // Redondeado para parecer una pastilla
    fontWeight: 'bold',
    color: 'white',
    fontSize: 12,
    textAlign: 'center',
  },
  statusColor: {
    "Bajo peso": '#2196f3', // Azul
    "Peso normal": '#4caf50', // Verde
    "Sobrepeso": '#ff9800', // Naranja
    "Obesidad": '#f44336', // Rojo
  }
});