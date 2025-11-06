import React, { useEffect, useState} from "react";
import { View, StyleSheet, Alert, Button} from "react-native";
import { db } from "../database/firebaseconfig.js";
import { collection, getDocs, doc, deleteDoc, addDoc, updateDoc ,query, where, orderBy, limit} from "firebase/firestore";

// === INICIO DE IMPORTACIONES DE LA GUÍA ===
import * as FileSystem from "expo-file-system/legacy";
import * as Sharing from "expo-sharing";
import * as Clipboard from "expo-clipboard";
// === FIN DE IMPORTACIONES DE LA GUÍA ===

import FormularioProductos from "../components/FormularioProductos.js";
import TablaProductos from "../components/TablaProductos.js";


// === CONSTANTE DE COLECCIONES DE LA GUÍA ===
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
    
    // === FUNCIÓN DE LA GUÍA: CARGAR DATOS DE UNA COLECCIÓN ESPECÍFICA ===
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
            // Mostrará el error de permisos aquí (si es el caso)
            return; 
        }
    };
    
    // === FUNCIÓN DE LA GUÍA: CARGAR TODOS LOS DATOS ===
    const cargarTodasLasColecciones = async () => {
        try {
            const datosExportados = {};

            for (const col of colecciones) {
                // Llama a la función de carga individual para cada colección
                const datosColeccion = await cargarDatosFirebase(col); 
                // Añade los datos si no hay error
                if (datosColeccion) {
                    Object.assign(datosExportados, datosColeccion);
                }
            }

            return datosExportados;

        } catch (error) {
            console.error("Error extrayendo todos los datos:", error);
            // Esto solo se ejecutará si hay un error no capturado en cargarDatosFirebase
            return {}; 
        }
    };
    
    // === FUNCIÓN DE EXPORTACIÓN Y COPIADO DE LA GUÍA ===
    const exportarDatos = async (nombreColeccion, exportarTodos = false) => {
        try {
            // 1. CARGAR DATOS
            const datos = exportarTodos
                ? await cargarTodasLasColecciones()
                : await cargarDatosFirebase(nombreColeccion); 

            // Verificar que se hayan cargado datos
            if (!datos || Object.keys(datos).length === 0) {
                // La función ya maneja el error internamente (Error extrayendo datos...),
                // pero alertamos al usuario.
                Alert.alert("Aviso", "No se encontraron datos para exportar. Revisa la consola o las reglas de Firebase.");
                return;
            }

            // 2. FORMATEAR y NOMBRE DE ARCHIVO
            const jsonString = JSON.stringify(datos, null, 2);
            const baseFileName = exportarTodos ? "todos_los_datos.txt" : `datos_${nombreColeccion}.txt`;

            // 3. Copiar datos al portapapeles
            await Clipboard.setStringAsync(jsonString);
            console.log("Datos (JSON) copiados al portapapeles.");

            // 4. Verificar y compartir el archivo
            if (!(await Sharing.isAvailableAsync())) {
                Alert.alert("Aviso", "La función Compartir/Guardar no está disponible en tu dispositivo");
                return;
            }

            // Guardar el archivo temporalmente
            const fileUri = FileSystem.cacheDirectory + baseFileName;
            await FileSystem.writeAsStringAsync(fileUri, jsonString);

            // Abrir el diálogo de compartir
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
        // Si tienes una llamada a 'ejecutarConsultas()' aquí, DEBES ELIMINARLA.
        cargarDatos();
    }, []);

    // Manejar cambios en el formulario (existe)
    const manejoCambio = (campo, valor) => {
        setNuevoProducto({ ...nuevoProducto, [campo]: valor });
    };

    // ... (El resto de tus funciones CRUD existentes se mantiene sin cambios) ...
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

            {/* Este es el único botón de consulta que dejaremos limpio, si lo necesitas */}
            <View style={{ marginVertical: 10 }}>
                <Button 
                    title="Ejecutar Consulta: Ciudades" 
                    onPress={obtenerCiudadesGuatemalaMasPobladas} 
                />
            </View>

            {/* === BOTONES DE EXPORTACIÓN DE LA GUÍA === */}

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