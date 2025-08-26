"use client"

import Boton1 from "@/componentes/Boton1"
import Title from "@/componentes/Title"
import Mensajes from "@/componentes/Mensajes"
export default function loginPage(){
    
    function imprimir() {
        console.log("Mati pro")
    }

    function imprimirOtraCosa() {
        console.log("Lu pro")
    }

    function imprimirOtraCosa2() {
        console.log("Ju pro")
    }

    return (
        <>
            <Title texto="Registrate"></Title>
            <h3>Ingesa tus datos</h3>
            <Boton1 type={"text"} color={"wpp"}></Boton1>
        </>
    )
}               