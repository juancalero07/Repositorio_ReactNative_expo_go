import React, { useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { View } from "react-native";
import { auth } from "./src/database/firebaseconfig";
import Login from "./src/views/Login";
import Productos from "./src/views/Productos";
//import { ejecutarConsultas } from "./src/components/ConsultasFirestore"; // ✅ solo usamos esta

export default function App() {
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    // Escucha los cambios en la autenticación (login/logout)
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUsuario(user);

      // 👉 Cuando el usuario inicia sesión
      if (user) {
        console.log("✅ Usuario autenticado:", user.email);

        try {
          // 🔥 Ejecuta las consultas (actividades del documento)
          await ejecutarConsultas();
        } catch (error) {
          console.error("❌ Error al ejecutar las consultas:", error);
        }
      } else {
        console.log("🚫 Usuario no autenticado");
      }
    });

    // Limpieza de suscripción
    return () => unsubscribe();
  }, []);

  const cerrarSesion = async () => {
    await signOut(auth);
  };

  if (!usuario) {
    // Si no hay usuario autenticado, mostrar Login
    return <Login onLoginSuccess={() => setUsuario(auth.currentUser)} />;
  }

  // Si hay usuario autenticado, mostrar Productos
  return (
    <View style={{ flex: 1 }}>
      <Productos cerrarSesion={cerrarSesion} />
    </View>
  );
}
