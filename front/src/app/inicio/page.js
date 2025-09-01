"use client"

import { useState, useEffect } from "react"
import Title from "@/componentes/Title"
import Input from "@/componentes/Input"
import Contacto from "@/componentes/Contactos"

export default function InicioPage() {
  const [contacts, setContacts] = useState([])

  // por ahora el id lo ponemos fijo (ej: usuario con id 1)
  const usuarioId = 1  

  useEffect(() => {
    async function traerChats() {
      try {
        const response = await fetch("http://localhost:4000/chats", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id_usuario: usuarioId })
        })
        const data = await response.json()
        console.log(data)
        setContacts(data)  // guardamos los chats en el estado
      } catch (error) {
        console.error("Error al traer chats:", error)
      }
    }

    traerChats()
  }, [])

  return (
    <>
      <Title texto="Chats" />
      <Input type="text" placeholder="Buscar" id="buscar" />

      <ol>
        {contacts.map((chat) => (
          <li key={chat.ID}>
            <Contacto nombre={chat.nombre} color="contactos" />
          </li>
        ))}
      </ol>
    </>
  )
}