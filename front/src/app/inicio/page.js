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


  function handleCheckbox(event) {
    setEsGrupo(event.target.checked);
  }

  async function crearGrupo() {
    const datos = {
      es_grupo: 1,
      nombre: document.getElementById("nombreGrupo").value,
      foto: document.getElementById("fotoGrupo").value,
      descripcion_grupo: document.getElementById("descripcionGrupo").value,
      id_usuario: localStorage.getItem("idUsuario"), // usuario logueado
    };

    const response = await fetch("http://localhost:4000/agregarChat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(datos),
    });

    const result = await response.json();
    console.log(result);
  }

  async function crearChatIndividual() {
    const datos = {
      es_grupo: 0,
      mail: document.getElementById("mailUsuario").value,
      id_usuario: localStorage.getItem("idUsuario"), // usuario logueado
    };

    const response = await fetch("http://localhost:4000/agregarChat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(datos),
    });

    const result = await response.json();
    console.log(result);
  }

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

  function handleCheckbox(event) {
    setEsGrupo(event.target.checked)
  }


  return (
    <>
      <Title texto="Chats" />
      <Input type="text" placeholder="Buscar" id="buscar" color="registro" />

      <ol>
        {contacts.length != 0 && contacts.map((chat) => (
          <li key={chat.ID}>
            <Contacto nombre={chat.nombre} color="contactos" />
          </li>
        ))}
      </ol>
      <Popup trigger={<BotonRedondo texto="+" />}>
        <div className="posicionPopUp">
          <p>Crear un nuevo chat</p>



          {esGrupo ? (
            <>
              <label>
                <Input type="checkbox" onChange={handleCheckbox} />
                Clikee si desea crear un chat individual
              </label>
              <input placeholder="Nombre del grupo" id="nombreGrupo" />
              <input placeholder="Foto (URL)" id="fotoGrupo" />
              <input placeholder="Descripción" id="descripcionGrupo" />
              <Boton1 onClick={crearGrupo} texto="Agregar grupo" color="wpp" />
            </>
          ) : (
            <>
              <label>
                <Input type="checkbox" onChange={handleCheckbox} />
                Clikee si desea crear un grupo
              </label>
              <input placeholder="Mail del contacto" id="mailUsuario" />
              <Boton1 onClick={crearChatIndividual} texto="Agregar chat" color="wpp" />
            </>
          )}
        </div>
      </Popup>



    </>
  )
}