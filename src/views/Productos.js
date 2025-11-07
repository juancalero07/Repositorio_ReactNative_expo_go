import React, { useEffect, useState} from "react";
import { View, StyleSheet, Alert, Button} from "react-native";
import { db } from "../database/firebaseconfig.js";
import { collection, getDocs, doc, deleteDoc, addDoc, updateDoc ,query, where, orderBy, limit} from "firebase/firestore";

// === Importaciones de Expo para Archivos y Compartir ===
import * as FileSystem from "expo-file-system/legacy"; 
import * as Sharing from "expo-sharing"; 
import * as Clipboard from "expo-clipboard"; 

import FormularioProductos from "../components/FormularioProductos.js";
import TablaProductos from "../components/TablaProductos.js";


// === CONSTANTE DE COLECCIONES ===
const colecciones = ["productos", "usuarios", "edades", "ciudades"];
// ===========================================

const Productos = ({cerrarSesion}) => {
    const [productos, setProductos] = useState([]);
    const [nuevoProducto, setNuevoProducto] = useState({ nombre: "", precio: "" });
    const [modoEdicion, setModoEdicion] = useState(false);
    const [idActualizar, setIdActualizar] = useState(null);

    // Cargar productos desde Firestore (función existente)
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

    // ------------------------------------------------------------------
    // ---------------------- FUNCIONES PARA EXCEL ----------------------
    // ------------------------------------------------------------------

    // Función para convertir ArrayBuffer (respuesta binaria) a Base64
    const arrayBufferToBase64 = (buffer) => {
        let binary = '';
        const bytes = new Uint8Array(buffer);
        const len = bytes.byteLength;
        for (let i = 0; i < len; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        return btoa(binary);
    };

    // Función que llama a la API de AWS Lambda para generar el Excel
    const generarExcel = async () => {
        try {
            // Datos de prueba para el Excel. Puedes reemplazarlos con datos dinámicos si es necesario.
            const datosParaExcel = [
                { nombre: "Producto A", categoria: "Electrónicos", precio: 100 },
                { nombre: "Producto B", categoria: "Ropa", precio: 50 },
                { nombre: "Producto C", categoria: "Electrónicos", precio: 75 },
            ];

            // 1. Llamada a tu API Gateway
            const response = await fetch("https://c215pf5em9.execute-api.us-east-2.amazonaws.com/generarexcel", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ datos: datosParaExcel }), 
            });

            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status}. Revisa el CloudWatch de tu Lambda.`);
            }

            // 2. Obtención de ArrayBuffer y conversión a base64
            const arrayBuffer = await response.arrayBuffer();
            const base64 = arrayBufferToBase64(arrayBuffer);

            // 3. Ruta temporal para el archivo
            const fileUri = FileSystem.documentDirectory + "reporte.xlsx";

            // 4. Escribir el archivo Excel en el sistema de archivos de Expo
            await FileSystem.writeAsStringAsync(fileUri, base64, {
                encoding: FileSystem.EncodingType.Base64,
            });

            // 5. Compartir el archivo generado
            if (await Sharing.isAvailableAsync()) {
                await Sharing.shareAsync(fileUri, {
                    mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                    dialogTitle: 'Descargar Reporte Excel'
                });
                Alert.alert("Éxito", "Archivo Excel generado y listo para compartir.");
            } else {
                Alert.alert("Aviso", "La función Compartir no está disponible en este dispositivo.");
            }

        } catch (error) {
            console.error("Error generando Excel:", error);
            Alert.alert("Error de API/Excel", `Error: ${error.message}`);
        }
    };

    // ------------------------------------------------------------------
    // ---------------------- FUNCIONES PARA JSON -----------------------
    // ------------------------------------------------------------------
    
    // Función para cargar datos de una colección específica
    const cargarDatosFirebase = async (nombreColeccion) => {

        if (!nombreColeccion || typeof nombreColeccion !== 'string') {
            console.error("Error: Se requiere un nombre de colección válido.");
            return; 
        }

        try {
            const datosExportados = {};
            const snapshot = await getDocs(collection(db, nombreColeccion));

            datosExportados[nombreColeccion] = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));

            return datosExportados;

        } catch (error) {
            console.error(`Error extrayendo datos de la colección '${nombreColeccion}':`, error);
            return; 
        }
    };
    
    // Función para cargar todas las colecciones
    const cargarTodasLasColecciones = async () => {
        try {
            const datosExportados = {};

            for (const col of colecciones) {
                const datosColeccion = await cargarDatosFirebase(col); 
                if (datosColeccion) {
                    Object.assign(datosExportados, datosColeccion);
                }
            }

            return datosExportados;

        } catch (error) {
            console.error("Error extrayendo todos los datos:", error);
            return {}; 
        }
    };
    
    // Función principal de exportación (JSON/TXT)
    const exportarDatos = async (nombreColeccion, exportarTodos = false) => {
        try {
            // 1. CARGAR DATOS
            const datos = exportarTodos
                ? await cargarTodasLasColecciones()
                : await cargarDatosFirebase(nombreColeccion); 

            if (!datos || Object.keys(datos).length === 0) {
                Alert.alert("Aviso", "No se encontraron datos para exportar. Revisa la consola o las reglas de Firebase.");
                return;
            }

            // 2. FORMATEAR y NOMBRE DE ARCHIVO
            const jsonString = JSON.stringify(datos, null, 2);
            const baseFileName = exportarTodos ? "todos_los_datos.txt" : `datos_${nombreColeccion}.txt`;

            // 3. Copiar datos al portapapeles
            await Clipboard.setStringAsync(jsonString);
            console.log("Datos (JSON) copiados al portapapeles.");

            // 4. Compartir el archivo
            if (!(await Sharing.isAvailableAsync())) {
                Alert.alert("Aviso", "La función Compartir/Guardar no está disponible en tu dispositivo");
                return;
            }

            const fileUri = FileSystem.cacheDirectory + baseFileName;
            await FileSystem.writeAsStringAsync(fileUri, jsonString);

            await Sharing.shareAsync(fileUri, {
                mimeType: 'text/plain',
                dialogTitle: exportarTodos ? 'Compartir todos los datos de Firebase (JSON)' : `Compartir datos de ${nombreColeccion} (JSON)`
            });

            Alert.alert("Éxito", "Datos copiados al portapapeles y listos para compartir.");

        } catch (error) {
            console.error("Error al exportar y compartir:", error);
            Alert.alert("Error de Exportación", `Error de archivo/dispositivo. Mensaje: ${error.message}`);
        }
    };
    
    // Función de consulta existente
    const obtenerCiudadesGuatemalaMasPobladas = async () => {
        try {
            console.log(" Consulta: Obtener las 2 ciudades más pobladas de Guatemala");

            const ref = collection(db, "ciudades");
            const q = query(
                ref,
                where("pais", "==", "Guatemala"),
                orderBy("poblacion", "desc"),
                limit(2)
            );

            const snapshot = await getDocs(q);

            if (snapshot.empty) {
                console.log("No hay ciudades de Guatemala.");
                return;
            }

            console.log("Resultados:");
            snapshot.forEach((doc) => {
                console.log(`ID: ${doc.id}`, doc.data());
            });
            Alert.alert("Consulta Ejecutada", "Resultados en la consola (terminal).");
        } catch (error) {
            console.error("Error en la consulta:", error);
            Alert.alert("Error", "Error al ejecutar la consulta: " + error.message);
        }
    };
    
    
    useEffect(() => {
        cargarDatos();
    }, []);

    // Manejar cambios en el formulario (existe)
    const manejoCambio = (campo, valor) => {
        setNuevoProducto({ ...nuevoProducto, [campo]: valor });
    };

    // ... (Funciones CRUD de productos) ...
    const guardarProducto = async () => { /* Tu código aquí */ };
    const eliminarProducto = async (id) => { /* Tu código aquí */ };
    const editarProducto = (producto) => { /* Tu código aquí */ };
    const actualizarProducto = async () => { /* Tu código aquí */ };


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

            {/* BOTÓN para la consulta de ciudades */}
            <View style={{ marginVertical: 10 }}>
                <Button 
                    title="Ejecutar Consulta: Ciudades" 
                    onPress={obtenerCiudadesGuatemalaMasPobladas} 
                />
            </View>

            {/* === BOTÓN PARA GENERAR EXCEL === */}
            <View style={{ marginVertical: 10 }}>
                <Button title="Generar Excel" onPress={generarExcel} />
            </View>

            {/* === BOTONES DE EXPORTACIÓN JSON === */}

            <View style={{ marginVertical: 10 }}>
                <Button 
                    title="Exportar Productos (JSON)" 
                    onPress={() => exportarDatos("productos")} 
                />
            </View>

            <View style={{ marginVertical: 10 }}>
                <Button 
                    title="Exportar TODAS las Colecciones (JSON)" 
                    onPress={() => exportarDatos(null, true)} 
                />
            </View>

            <View style={{ marginVertical: 10 }}>
                <Button 
                    title="Exportar Usuarios (JSON)" 
                    onPress={() => exportarDatos("usuarios")} 
                />
            </View>
            <View style={{ marginVertical: 10 }}>
                <Button 
                    title="Exportar Ciudades (JSON)" 
                    onPress={() => exportarDatos("ciudades")} 
                />
            </View>
            <View style={{ marginVertical: 10 }}>
                <Button 
                    title="Exportar Edades (JSON)" 
                    onPress={() => exportarDatos("edades")} 
                />
            </View>
        
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