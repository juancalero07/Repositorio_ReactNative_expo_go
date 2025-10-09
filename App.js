import React from "react";
import { View, StyleSheet,ScrollView } from "react-native";
import Productos from "./src/views/Productos";
import Clientes from "./src/views/Clientes"
import Promedio  from"./src/views/Promedio"
import SumaNumeros from "./src/views/sumaNumeros";
import Triangulos from "./src/views/Triangulos";



export default function App( ) {

    return (
      <>
    <ScrollView>
      <Productos />
      <Clientes />
     
      </ScrollView>
      </>
      
    );
}