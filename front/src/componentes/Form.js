"use client"

import Input from "./Input"
import BotonInput from "@/componentes/BotonInput"

export default function Form(props) {
    function mensaje() {
        console.log("Completo")
    }
    function respuesta() {
        console.log("Cambio 1")
    }
    function respuesta2() {
        console.log("Cambio 2")
    }
    return (
        <>
            <h3>Nombre</h3>
            <Input respuesta={respuesta}></Input><BotonInput mensaje={mensaje}></BotonInput>
            <h3>Apellido</h3>
            <Input respuesta={respuesta2}></Input><BotonInput mensaje={mensaje}></BotonInput>
        </>
    )
}