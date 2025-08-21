"use client"

import Boton from "@/componentes/Boton"
import Form from "@/componentes/Form"
import Title from "@/componentes/Title"
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
            <Title texto="Cuestionario del pro"></Title>
            <h3>Elegi al mas pro</h3>
            <Boton pro={imprimir}></Boton>
            <Boton pro={imprimirOtraCosa}></Boton>
            <Boton pro={imprimirOtraCosa2}></Boton>
            <Form></Form>
        </>
    )
}               