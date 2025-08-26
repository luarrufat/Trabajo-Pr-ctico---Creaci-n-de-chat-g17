"use client"

import Boton1 from "@/componentes/Boton1"
import Input from "@/componentes/Input"
import Title from "@/componentes/Title"
import Mensajes from "@/componentes/Mensajes"
import Link from 'next/link';
export default function loginPage() {
    const [nombre, setNombre] = useState("");
    const [contraseña, setContraseña] = useState("");
    function obtenerDatosRegistro(event) {
        setContraseña(event.target.value);
        setNombre(event.target.value);

        let datos = {
            nombre: nombre,
            password: contraseña
        }
        agregarUsuarioRegistro(datos)
    }

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
            <Input color={"registro"} type={"text"} placeholder={"Ingrese su nombre"} id={"usuario_mail"}></Input>
            <br></br>
            <Boton1 type={"text"} texto={"Enviar"} color={"wpp"} > Enviar</Boton1>
            <br></br>
            <br></br>
            <Input color={"registro"} type={"password"} placeholder={"Ingrese su contraseña"} id={"usuario_mail"}></Input>
            <br></br>
            <Boton1 type={"text"} texto={"Enviar"} color={"wpp"}></Boton1>
        </>
    )
} 