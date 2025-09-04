"use client"

import { useState, useEffect } from "react"
import Title from "@/componentes/Title"
import Input from "@/componentes/Input"
import Contacto from "@/componentes/Contactos"
import BotonRedondo from "@/componentes/BotonRedondo"
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import Boton1 from "@/componentes/Boton1"

export default function InicioPage() {
  const [es_grupo, setEs_grupo] = useState("")
  const [foto, setFoto] = useState("");
  const [nombre, setNombre] = useState("");
  const [descripcion_grupo, setDescripcion_grupo] = useState("");
  const [contacts, setContacts] = useState([])
  const [esGrupo, setEsGrupo] = useState(false);
  const [idUsuario, setIdUsuario] = useState(1)

  useEffect(() => {
    async function traerChats() {
      try {
        const response = await fetch("http://localhost:4000/chats", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id_usuario: idUsuario })
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

  async function obtenerDatos() {
    let datos = {
      es_grupo: es_grupo,
      foto: foto,
      nombre: nombre,
      descripcion_grupo: descripcion_grupo
    }
    agregarChat(datos)
  }
  async function agregarChat(datos) {
    console.log("Click en botón")
    try {
      response = await fetch("http://localhost:4000/agregarChat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(datos),
      });
      console.log(response)
      let result = await response.json()
      console.log(result)

    } catch (error) {
      console.log("Error", error);
    }
  }

  function handleCheckbox(event){
        setEsGrupo(event.target.checked)
    }

    function checkeado() {
        if (esGrupo) {

        } else {

        } 
    }

  return (
    <>
      <Title texto="Chats" />
      <Input type="text" placeholder="Buscar" id="buscar" color="registro"/>

      <ol>
        {contacts.length != 0 && contacts.map((chat) => (
          <li key={chat.ID}>
            <Contacto nombre={chat.nombre} color="contactos"/>
          </li>
        ))}
      </ol>
      
  
      <Popup trigger={<BotonRedondo texto="+"  />}>
        <div  className="posicionPopUp">
          Añadir nuevo chat
          <Input type={"checkbox"} onChange={handleCheckbox}>Clikee si desea crear un grupo</Input>
          {esGrupo == true ? 
          <>
            <input placeholder="Inserte nombre:"></input>
            <input placeholder="Inserte foto (URL):"></input>
            <input placeholder="Inserte descripcion:"></input>
            <Boton1 onclick={checkeado()} texto={"Agregar"} color={"wpp"}></Boton1>
          </>
          :
          <h1>HOLA</h1>}
        </div>

      </Popup>
  

    </>
  )
}