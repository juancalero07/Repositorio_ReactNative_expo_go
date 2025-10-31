// src/components/InsertarCiudades.js
import { db } from "../database/firebaseconfig";
import { collection, addDoc } from "firebase/firestore";

export const insertarCiudades = async () => {
  const ciudades = [
    
    { nombre: "Mixco", poblacion: 500, pais: "Guatemala", region: "América Central" },
    { nombre: "San Salvador", poblacion: 570, pais: "El Salvador", region: "América Central" },
    { nombre: "Santa Ana", poblacion: 250, pais: "El Salvador", region: "América Central" },
    { nombre: "Tegucigalpa", poblacion: 1100, pais: "Honduras", region: "América Central" },
    { nombre: "San Pedro Sula", poblacion: 800, pais: "Honduras", region: "América Central" },
    { nombre: "Managua", poblacion: 1000, pais: "Nicaragua", region: "América Central" },
    { nombre: "León", poblacion: 200, pais: "Nicaragua", region: "América Central" },
    { nombre: "San José", poblacion: 350, pais: "Costa Rica", region: "América Central" },
    { nombre: "Alajuela", poblacion: 250, pais: "Costa Rica", region: "América Central" },
  ];

  try {
    const ciudadesRef = collection(db, "ciudades");

    for (const ciudad of ciudades) {
      await addDoc(ciudadesRef, ciudad);
      console.log(`✅ Ciudad agregada: ${ciudad.nombre}`);
    }

    console.log("🚀 Todas las ciudades fueron insertadas correctamente.");
  } catch (error) {
    console.error("❌ Error al insertar ciudades:", error);
  }
};
export default insertarCiudades
