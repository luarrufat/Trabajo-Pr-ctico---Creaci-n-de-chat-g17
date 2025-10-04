"use client";

import React, { useEffect, useState, useRef } from "react";
import styles from "./page.module.css";
import Boton1 from "@/componentes/Boton1";
import Contacto from "@/componentes/Contactos";
import Mensajes from "@/componentes/Mensajes";
import { useSocket } from "@/hooks/useSocket";
import Input from "@/componentes/Input";
import BotonRedondo from "@/componentes/BotonRedondo";
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";

export default function ChatPage() {
  const { socket } = useSocket();
  const [chatActivo, setChatActivo] = useState(null);
  const [mensajes, setMensajes] = useState([]);
  const [nuevoMensaje, setNuevoMensaje] = useState("");
  const [contacts, setContacts] = useState([]);
  const [nombreChat, setNombreChat] = useState([]);
  const [mail, setMail] = useState("");
  const [mails, setMails] = useState(["", ""]);
  const [esGrupo, setEsGrupo] = useState(false);
  const [nombreGrupo, setNombreGrupo] = useState("");
  const [foto, setFoto] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const mensajesEndRef = useRef(null);
  const [nombreAutor, setNombreAutor] = useState([]);


  const todosLosContactos = [...contacts, ...nombreChat];

  // SOCKET: recibir mensajes
  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (data) => {
      if (
        chatActivo &&
        data.room === chatActivo.ID &&
        data.message &&
        data.message.texto?.trim()
      ) {
        setMensajes((actual) => [
          ...actual,
          {
            texto: data.message.texto,
            autor: data.message.autor ?? "otro",
            chatId: data.room,
            nombre: data.message.nombre,
          },
        ]);
      }
    };

    socket.on("newMessage", handleNewMessage);
    return () => socket.off("newMessage", handleNewMessage);
  }, [socket, chatActivo]);

  // Unirse a room cuando chatActivo cambie
  useEffect(() => {
    if (!chatActivo || !socket) return;
    socket.emit("joinRoom", { room: chatActivo.ID });
  }, [chatActivo, socket]);

  // Traer chats y usuarios al inicio
  useEffect(() => {
    traerChats();
    traerNombres();
    cargar();
  }, []);

  // Scroll automático al último mensaje
  useEffect(() => {
    if (mensajesEndRef.current) {
      mensajesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [mensajes]);

  async function traerChats() {
  try {
    const response = await fetch("http://localhost:4000/chats", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id_usuario: parseInt(localStorage.getItem("ID")) }),
    });
    const data = await response.json();
    console.log("traerChats ->", data);

    // 👇 si data no es array, guardamos [] para no romper
    setContacts(Array.isArray(data) ? data : []);
  } catch (error) {
    console.error("Error al traer chats:", error);
    setContacts([]); // así nunca queda undefined
  }
}

async function traerNombres() {
  try {
    const response = await fetch("http://localhost:4000/traerUsuarios", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id_usuario: parseInt(localStorage.getItem("ID")) })
    });
    const data = await response.json();
    console.log("traerUsuarios ->", data);

    // 👇 acá miramos si data.usuarios es array
    if (data && Array.isArray(data.usuarios)) {
      setNombreChat(data.usuarios);
    } else if (Array.isArray(data)) {
      // por si directamente devuelve array
      setNombreChat(data);
    } else {
      setNombreChat([]);
    }
  } catch (error) {
    console.error("Error al traer nombres:", error);
    setNombreChat([]);
  }
}



  async function cargar() {
  try {
    const res = await fetch("http://localhost:4000/traerUsuarios", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id_usuario: localStorage.getItem("ID") }),
    });

    let data = await res.json();
    console.log("📩 traerUsuarios (cargar) ->", data);

    // 👇 elegimos array correcto
    let usuarios = Array.isArray(data)
      ? data
      : Array.isArray(data.usuarios)
      ? data.usuarios
      : [];

    for (let i = 0; i < usuarios.length; i++) {
      for (let j = 0; j < usuarios.length; j++) {
        if (usuarios[i].nombre == usuarios[j].nombre && i != j) {
          usuarios.splice(j, 1);
        }
      }
    }
    console.log("Filtrado: ", usuarios);
    setNombreChat(usuarios);
  } catch (err) {
    console.error("Error traerUsuarios:", err);
    setNombreChat([]);
  }
}



  async function traerMensajesChat(chatId) {
    try {
      const response = await fetch("http://localhost:4000/encontrarMensajesChat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chatSeleccionadoId: chatId }),
      });
      const data = await response.json();
      if (data.ok) {
        const mensajesFormateados = data.mensajes.map((m) => ({
          texto: m.contenido ?? "",
          autor: m.id_usuario.toString(),
          nombre: m.nombre,
          chatId: m.id_chat,
        }));
        setMensajes(mensajesFormateados);
        setNombreAutor(mensajesFormateados.nombre)
      }
    } catch (error) {
      console.error("Error al traer mensajes del chat:", error);
    }
  }



  // Enviar mensaje
  function enviarMensajeRoom() {
    if (!nuevoMensaje.trim() || !chatActivo || !socket) return;

    const mensaje = {
      texto: nuevoMensaje,
      autor: localStorage.getItem("ID"),
      chatId: chatActivo.ID,
      nombre: nombreAutor,
    };

    socket.emit("sendMessage", { room: chatActivo.ID, message: mensaje });
    guardarMensajeEnBBDD(mensaje);
    setNuevoMensaje("");
  }

  async function guardarMensajeEnBBDD(mensaje) {
    try {
      const datos = {
        contenido: mensaje.texto,
        fecha_hora: new Date().toISOString().slice(0, 19).replace("T", " "),
        id_usuario: mensaje.autor,
        id_chat: mensaje.chatId,
      };
      await fetch("http://localhost:4000/mensajes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datos),
      });
    } catch (error) {
      console.error("Error al guardar mensaje:", error);
    }
  }

  // --- Crear chats / grupos ---
  async function crearChatIndividual() {
    const datos = {
      es_grupo: 0,
      mail: mail,
      id_usuario: localStorage.getItem("ID"), // usuario logueado
    };

    if (mail.trim() == "") {
      alert("Por favor, complete el mail del contacto.");
      return;
    }
    try {
      const response = await fetch("http://localhost:4000/agregarChat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datos),
      });
      const result = await response.json();
      if (result.ok) traerChats();
    } catch (error) {
      console.error(error);
    }
  }

   function validacionGrupo() {
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
   } 
  

  async function crearGrupo() {
    let mailsLimpios = validacionGrupo();
    const datos = {
      es_grupo: 1,
      foto,
      nombre: nombreGrupo,   // 👈 acá usás nombreGrupo
      descripcion_grupo: descripcion,
      id_usuario: localStorage.getItem("ID"),
      mails: mailsLimpios
    };
  
    console.log("Datos del grupo:", datos);
  
    if (nombreGrupo.trim() === "") {
      alert("Por favor, complete el nombre del grupo.");
      return;
    }
  
    if (mailsLimpios.length > 0) {
      const response = await fetch("http://localhost:4000/agregarChat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datos),
      });
  
      const result = await response.json();
      console.log(result);
    } else {
      alert("Por favor, agregue al menos un usuario al grupo.");
    }
  }
  


  function eliminarUsuario() {
    const datos = {
      id_chat: chatActivo.ID,
      id_usuario: localStorage.getItem("ID")
    };
    borrarUsuario(datos);
  }
  async function borrarUsuario(datos) {
    try {
      const res = await fetch("http://localhost:4000/eliminarContacto", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datos)
      });
      const result = await res.json();
      console.log(result);

      if (result.ok) {
        // lo saco del estado local, así no vuelve a aparecer en UI
        setContacts((prev) =>
          prev.filter((c) => c.ID !== chatActivo.ID)
        );
        setChatActivo(null); // cierro el chat actual
      }
    } catch (error) {
      console.error("Error al eliminar contacto:", error);
    }
  }

  function agregarInput() {
    setMails([...mails, ""]);
  }

  function actualizarMail(index, value) {
    const copia = [...mails];
    copia[index] = value;
    setMails(copia);
  }

  function toggleGrupo() {
    setEsGrupo(!esGrupo);
  }

  return (
    <>
    <div className={styles.chatContainer}>
      {/* Panel de contactos */}
      <div className={styles.contactos}>
        <ul>
          {todosLosContactos.map((u, index) => (
            <li key={`${u.id_chat ?? u.ID}-${index}`}>
              <Contacto
                nombre={u.nombre}
                foto={u.foto}
                color="contactos"
                onClick={() => {
                  const chatSeleccionado = { ID: u.id_chat ?? u.ID, nombre: u.nombre, foto: u.foto};
                  setChatActivo(chatSeleccionado);
                  traerMensajesChat(chatSeleccionado.ID);
                }}
              />
            </li>
          ))}
        </ul>
      </div>

      {/* Popup para crear chat o grupo */}
      <Popup trigger={<BotonRedondo texto="+" />} modal>
        <div className="popupContainer">
          <p>{esGrupo ? "Crear un nuevo grupo" : "Crear un nuevo chat"}</p>
          <label>
            <Input type="checkbox" onChange={toggleGrupo} />
            {esGrupo ? "Desea crear un chat individual?" : "Desea crear un grupo?"}
          </label>

          {esGrupo ? (
            <>
              <Input
                placeholder="Nombre del grupo"
                onChange={(e) => setNombreGrupo(e.target.value)}
                color="registro"
              />
              <Input
                placeholder="Foto (URL)"
                onChange={(e) => setFoto(e.target.value)}
                color="registro"
              />
              <Input
                placeholder="Descripción"
                onChange={(e) => setDescripcion(e.target.value)}
                color="registro"
              />
              {mails.map((m, i) => (
                <Input
                  key={`mail-${i}`}
                  type="text"
                  placeholder="Correo del usuario"
                  value={m}
                  onChange={(e) => actualizarMail(i, e.target.value)}
                  color="registro"
                />
              ))}
              <Boton1 onClick={agregarInput} texto="Agregar otro usuario" color="wpp" />
              <Boton1 onClick={crearGrupo} texto="Crear grupo" color="wpp" />
            </>
          ) : (
            <>
              <Input
                placeholder="Mail del contacto"
                onChange={(e) => setMail(e.target.value)}
                color="registro"
              />
              <Boton1 onClick={crearChatIndividual} texto="Agregar chat" color="wpp" />
            </>
          )}
        </div>
      </Popup>

      {/* Chat principal */}
      <section className={styles.chat}>
        <header className={styles.chatHeader}>
          {/*{chatActivo ? <h2>⚪ {chatActivo.nombre}</h2> && <Boton1 texto="ELiminar" color="wpp"></Boton1> : <h2>Selecciona un chat</h2>}*/}
          {chatActivo ? (<> <h2>⚪ {chatActivo.nombre}</h2> <Boton1 texto="Eliminar" color="eliminar" onClick={eliminarUsuario} /></>) : <h2>Selecciona un chat</h2>}

        </header>

        {/* Lista de mensajes */}
        <div className={styles.mensajesContainer}>
          {mensajes.map((msg, index) => (
            <Mensajes
              key={index}
              lado={msg.autor === localStorage.getItem("ID") ? "mensajeyo" : "mensajeotro"}
              texto={msg.texto}
              nombre={msg.nombre}
              hora={msg.hora}
            />
          ))}
          <div ref={mensajesEndRef} />
        </div>

        {/* Input de mensaje */}
        {chatActivo && (
          <footer className={styles.chatInput}>
            <div className={styles.inputContainer}>
              <input
                type="text"
                placeholder="Escribe tu mensaje..."
                value={nuevoMensaje}
                onChange={(e) => setNuevoMensaje(e.target.value)}
              />
              <Boton1 texto="Enviar" color="wpp" onClick={enviarMensajeRoom} />
            </div>
          </footer>
        )}
      </section>
    </div>
  </>
  )
}