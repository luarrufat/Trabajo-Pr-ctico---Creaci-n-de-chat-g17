"use client"

import Boton1 from "@/componentes/Boton1"
import Input from "@/componentes/Input"
import Title from "@/componentes/Title"
import Mensajes from "@/componentes/Mensajes"
import Link from 'next/link';
import { useEffect, useState } from "react"
export default function loginPage() {
    const [nombre, setNombre] = useState("");
    const [contraseña, setContraseña] = useState("");
    const [usuarioMail, setUsuario] = useState("");
    function obtenerDatosRegistro(event) {
        setContraseña(event.target.value);
        setNombre(event.target.value);
        

        let datos = {
            nombre: nombre,
            contraseña: contraseña,
            usuario_mail: usuarioMail
        }
        agregarUsuarioRegistro(datos)
    }

    /*
    useEffect(
        ()=>{
            console.log(usuarioMail)
        }, [usuarioMail]
    )
     */

    async function agregarUsuarioRegistro(datos) {
        try {
            response = await fetch("http://localhost:4000/registro", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(datos),
            });
            console.log(response)
            let result = await response.json()
            console.log(result)

            if (result.res == "ok") {
                <Link href={"/contador"}></Link>
            }

        } catch (error) {
            console.log("Error", error);
        }
    }
    return (
        <>  
            <Title texto="Registro"></Title>
            <h3>Ingresa tus datos</h3>
            <br></br>
            {/*Puse en el onChange una funcion de una sola linea para cambiar el usuario cuando cambie el valor del input*/}
            <Input color={"registro"} type={"text"} placeholder={"Ingrese su mail"} id={"usuario_mail"} onChange={(event) =>setUsuario( event.target.value)}></Input>
            <br></br>
            <br></br>
            <Input color={"registro"} type={"password"} placeholder={"Ingrese su contraseña"} id={"contraseña"}></Input>
            <br></br>
            <br></br>
            <Input color={"registro"} type={"text"} placeholder={"Ingrese su nombre"} id={"nombre"}></Input>
            <br></br>
            <br></br>
            <Boton1 type={"text"} texto={"Enviar"} color={"wpp"} onClick={obtenerDatosRegistro}>Enviar</Boton1>
        </>
    )
} 
