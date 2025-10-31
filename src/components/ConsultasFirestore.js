import { db, } from "../database/firebaseconfig";
import {
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  clearIndexedDbPersistence,
} from "firebase/firestore";

export const ejecutarConsultas = async () => {
  try {
    console.log("🚀 Ejecutando consultas de Firestore...\n");

    // 🔹 Limpia caché de índices por si hay versiones antiguas
    try {
      await clearIndexedDbPersistence(db);
      console.log("🧹 Caché de Firestore limpia (índices actualizados).");
    } catch (e) {
      console.log("ℹ️ Caché ya inicializada, continuando...");
    }

    // 1️⃣ Las 2 ciudades más pobladas de Guatemala
    const q1 = query(
      collection(db, "ciudades"),
      where("pais", "==", "Guatemala"),
      orderBy("poblacion", "desc"),
      limit(2)
    );
    const snapshot1 = await getDocs(q1);
    console.log("1️⃣ Las 2 ciudades más pobladas de Guatemala:");
    snapshot1.forEach((doc) => console.log(doc.id, doc.data()));
    console.log("\n");

    // 2️⃣ Ciudades de Honduras con población >700 ordenadas por nombre
const q2 = query(
  collection(db, "ciudades"),
  where("pais", "==", "Honduras"),
  where("poblacion", ">", 700),
  orderBy("poblacion", "asc"), // 🔹 primero el campo de rango
  orderBy("nombre", "asc"),
  limit(3)
);
    const snapshot2 = await getDocs(q2);
    console.log("2️⃣ Ciudades de Honduras con población >700:");
    snapshot2.forEach((doc) => console.log(doc.id, doc.data()));
    console.log("\n");

    // 3️⃣ Las 2 ciudades salvadoreñas más pequeñas
    const q3 = query(
      collection(db, "ciudades"),
      where("pais", "==", "El Salvador"),
      orderBy("poblacion", "asc"),
      limit(2)
    );
    const snapshot3 = await getDocs(q3);
    console.log("3️⃣ Las 2 ciudades salvadoreñas con menor población:");
    snapshot3.forEach((doc) => console.log(doc.id, doc.data()));
    console.log("\n");

 // 4️⃣ Ciudades con población <=300 ordenadas por país desc
const q4 = query(
  collection(db, "ciudades"),
  where("poblacion", "<=", 300),
  orderBy("poblacion", "asc"), // 🔹 el campo del rango siempre primero
  orderBy("pais", "desc"),
  limit(4)
);
const snapshot4 = await getDocs(q4);
console.log("4️⃣ Ciudades con población <=300:");
snapshot4.forEach((doc) => console.log(doc.id, doc.data()));
console.log("\n");

// 5️⃣ Ciudades con población >900 ordenadas por nombre
const q5 = query(
  collection(db, "ciudades"),
  where("poblacion", ">", 900),
  orderBy("poblacion", "asc"), // 🔹 primero el campo del rango
  orderBy("nombre", "asc"),
  limit(3)
);
const snapshot5 = await getDocs(q5);
console.log("5️⃣ Ciudades con población >900:");
snapshot5.forEach((doc) => console.log(doc.id, doc.data()));
console.log("\n");

// 6️⃣ Ciudades guatemaltecas por población descendente
const q6 = query(
  collection(db, "ciudades"),
  where("pais", "==", "Guatemala"),
  orderBy("poblacion", "desc"),
  limit(5)
);
const snapshot6 = await getDocs(q6);
console.log("6️⃣ Ciudades guatemaltecas ordenadas por población:");
snapshot6.forEach((doc) => console.log(doc.id, doc.data()));
console.log("\n");

// 7️⃣ Ciudades con población entre 200 y 600 ordenadas por país asc
const q7 = query(
  collection(db, "ciudades"),
  where("poblacion", ">=", 200),
  where("poblacion", "<=", 600),
  orderBy("poblacion", "asc"), // 🔹 primero el campo del rango
  orderBy("pais", "asc"),
  limit(5)
);
const snapshot7 = await getDocs(q7);
console.log("7️⃣ Ciudades con población entre 200 y 600:");
snapshot7.forEach((doc) => console.log(doc.id, doc.data()));
console.log("\n");

// 8️⃣ Las 5 ciudades más pobladas (ordenadas por región)
const q8 = query(
  collection(db, "ciudades"),
  orderBy("poblacion", "desc"),
  orderBy("region", "desc"),
  limit(5)
);
const snapshot8 = await getDocs(q8);
console.log("8️⃣ Las 5 ciudades más pobladas (ordenadas por región):");
snapshot8.forEach((doc) => console.log(doc.id, doc.data()));
console.log("\n");

    console.log("✅ Consultas completadas correctamente.");
  } catch (error) {
    console.error("❌ Error al ejecutar las consultas:", error);
  }
};
