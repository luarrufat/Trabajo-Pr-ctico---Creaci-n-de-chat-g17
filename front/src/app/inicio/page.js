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
  const [descripcion, setDescripcion] = useState("");
  const [contacts, setContacts] = useState([])
  const [esGrupo, setEsGrupo] = useState(false);
  const [idUsuario, setIdUsuario] = useState(1)
  const [mail, setMail] = useState("")
  const [mails, setMails] = useState(["", ""])


  useEffect(() => {
    traerChats()
  }, [])

  async function traerChats() {
    try {
      const response = await fetch("http://localhost:4000/chats", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id_usuario: parseInt(localStorage.getItem("ID")) })
      })
      const data = await response.json()
      console.log(data)
      setContacts(data)  // guardamos los chats en el estado
    } catch (error) {
      console.error("Error al traer chats:", error)
    }
  }

  function handleCheckbox(event) {
    setEsGrupo(event.target.checked);
  }

  async function crearGrupo() {
    const datos = {
      es_grupo: 1,
      nombre: document.getElementById("nombreGrupo").value,
      foto: document.getElementById("fotoGrupo").value,
      descripcion_grupo: document.getElementById("descripcionGrupo").value,
      id_usuario: localStorage.getItem("ID"), // usuario logueado
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
      mail: mail,
      id_usuario: localStorage.getItem("ID"), // usuario logueado
    };

    const response = await fetch("http://localhost:4000/agregarChat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(datos),
    });

    const result = await response.json();
    if (result.ok == true) {
      traerChats()
    }
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


  function agregarInput() {
    setMails([...mails, ""]); 
  }

  function actualizarMail(index, value) {
    const copia = [...mails];
    copia[index] = value;
    setMails(copia);
  }

  async function crearGrupo() {
  // limpiar mails con un for
  let mailsLimpios = [];
  for (let i = 0; i < mails.length; i++) {
    if (mails[i].trim() !== "") {
      mailsLimpios.push(mails[i]); // agrego solo los que no están vacíos
    }
  }

  const datos = {
    es_grupo: 1,
    nombre,
    foto,
    descripcion_grupo: descripcion,
    id_usuario: localStorage.getItem("ID"),
    mails: mailsLimpios, 
  };

  try { 
    const response = await fetch("http://localhost:4000/agregarChat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(datos),
    });

    const result = await response.json();
    console.log(result);
  } catch (error) {
    console.error("Error al crear grupo:", error);
  }
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

              <Input placeholder="Nombre del grupo" onChange={(event) => { setNombre(event.target.value) }} />
              <Input placeholder="Foto (URL)" onChange={(event) => { setFoto(event.target.value) }} />
              <Input placeholder="Descripción del grupo" onChange={(event) => { setDescripcion(event.target.value) }} />
              <h4>Usuarios del grupo</h4>
              {mails.map((mail, i) => (
                <Input key={i} type="text" placeholder="Correo del usuario" value={mail} onChange={(e) => actualizarMail(i, e.target.value)} color="registro" />
              ))}
              <button onClick={agregarInput}>Añadir otro usuario</button>
              <button onClick={crearGrupo}>Crear grupo</button>

            </>
          ) : (
            <>
              <label>
                <Input type="checkbox" onChange={handleCheckbox} />
                Clikee si desea crear un grupo
              </label>
              <Input placeholder="Mail del contacto" onChange={(event) => { setMail(event.target.value) }} />
              <Boton1 onClick={crearChatIndividual} texto="Agregar chat" color="wpp" />
            </>
          )}
        </div>
      </Popup>

    </>
  )
}