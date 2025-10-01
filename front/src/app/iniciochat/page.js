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
    cargarUsuarios();
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
      setContacts(data);
    } catch (error) {
      console.error("Error al traer chats:", error);
    }
  }

  async function traerNombres() {
    try {
      const response = await fetch("http://localhost:4000/traerUsuarios", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id_usuario: parseInt(localStorage.getItem("ID")) }),
      });
      const data = await response.json();
      setNombreChat(data.usuarios ?? []);
    } catch (error) {
      console.error("Error al traer nombres:", error);
      setNombreChat([]);
    }
  }

  async function cargarUsuarios() {
    try {
      const res = await fetch("http://localhost:4000/traerUsuarios", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id_usuario: localStorage.getItem("ID") }),
      });
      const data = await res.json();
      setNombreChat(data ?? []);
    } catch (err) {
      console.error("Error cargarUsuarios:", err);
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
          chatId: m.id_chat,
        }));
        setMensajes([...mensajesFormateados]);
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
    if (!mail.trim()) return;
    const datos = { es_grupo: 0, mail, id_usuario: localStorage.getItem("ID") };
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

  async function crearGrupo() {
    const mailsLimpios = mails.filter((m) => m.trim() !== "");
    const datos = {
      es_grupo: 1,
      nombre: nombreGrupo,
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
    <div className={styles.chatContainer}>
      {/* Panel de contactos */}
      <div className={styles.contactos}>
        <ul>
          {todosLosContactos.map((u, index) => (
            <li key={`${u.id_chat ?? u.ID}-${index}`}>
              <Contacto
                nombre={u.nombre}
                color="contactos"
                onClick={() => {
                  const chatSeleccionado = { ID: u.id_chat ?? u.ID, nombre: u.nombre };
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
          {chatActivo ? <h2>⚪ {chatActivo.nombre}</h2> : <h2>Selecciona un chat</h2>}
        </header>

        {/* Lista de mensajes */}
        <div className={styles.mensajesContainer}>
          {mensajes.map((msg, index) => (
            <Mensajes
              key={`${msg.chatId}-${index}`}
              color="mensajes"
              lado={msg.autor === localStorage.getItem("ID") ? "mensajeyo" : "mensajeotro"}
              texto={msg.texto}
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
              <Boton1 texto="Enviar" color="wpp" onClick={enviarMensajeRoom}/>
            </div>
          </footer>
        )}
      </section>
    </div>
  );
}
