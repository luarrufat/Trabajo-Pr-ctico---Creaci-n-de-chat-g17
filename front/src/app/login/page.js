"use client"

import Boton1 from "@/componentes/Boton1"
import Form from "@/componentes/Form"
import Input from "@/componentes/Input"
import Title from "@/componentes/Title"
import Mensajes from "@/componentes/Mensajes"
export default function loginPage(){

    return (
        <>
            <Title texto="Registro"></Title>
            <h3>Ingresa tus datos</h3>
            <Input color={"registro"}></Input>
            <br></br>
            <Boton1 type={"text"} texto={"Enviar"} color={"wpp"}>Enviar</Boton1>
            <br></br>
            <br></br>
            <Input color={"registro"}></Input>
            <br></br>
            <Boton1 type={"text"} texto={"Enviar"} color={"wpp"}></Boton1>
        </>
    )
} 