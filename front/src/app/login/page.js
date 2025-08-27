"use client"

import Boton1 from "@/componentes/Boton1"
import Input from "@/componentes/Input"
import Title from "@/componentes/Title"
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function LoginPage() {
  const [nombre, setNombre] = useState("")
  const [contraseña, setContraseña] = useState("")
  const [usuarioMail, setUsuarioMail] = useState("")
  const router = useRouter()

  async function agregarUsuarioRegistro(datos) {
    try {
      const response = await fetch("http://localhost:4000/registro", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datos),
      })
      const result = await response.json()
      console.log(result)

      if (result.res === "ok") {
        router.push("/contador")
      }
    } catch (error) {
      console.log("Error", error)
    }
  }

  function obtenerDatosRegistro() {
    let datos = { nombre, password: contraseña, usuario_mail: usuarioMail }
    agregarUsuarioRegistro(datos)
  }

  return (
    <>
      <Title texto="Registro" />
      <h3>Ingresa tus datos</h3>
      <br />
      <Input color={"registro"} type={"text"} placeholder={"Ingrese su mail"} id={"usuario_mail"} onChange={(event) =>setUsuarioMail( event.target.value)}></Input>
      <br /><br />
      <Input color={"registro"} type={"password"} placeholder={"Ingrese su contraseña"} id={"contraseña"} onChange={(event) =>setContraseña( event.target.value)}></Input>
      <br /><br />
      <Input color={"registro"} type={"text"} placeholder={"Ingrese su nombre"} id={"nombre"} onChange={(event) =>setNombre( event.target.value)}></Input>
      <br /><br />
      <Boton1 type={"text"} texto={"Enviar"} color={"wpp"} onClick={obtenerDatosRegistro}>Enviar</Boton1>
    </>
  )
}
