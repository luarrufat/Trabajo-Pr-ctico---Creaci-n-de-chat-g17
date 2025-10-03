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
  setNuevoMensaje("");
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

  {/*
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

      useEffect(() => {
        async function contacto() {
          const datos = await obtenerNombre();
          if (datos.ok && datos.contacto) {
            setNombreL(datos.contacto.nombre);
            console.log(datos)
          } else {
            console.log("No se pudo obtener el nombre");
          }
        }
        contacto();



      }, []);


      async function traerNombres() {
        try {
          const response = await fetch("http://localhost:4000/traerUsuarios", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id_usuario: parseInt(localStorage.getItem("ID")) })
          });
          const data = await response.json();
          if (data.ok && data.usuarios) setNombreChat(data.usuarios);
          else setNombreChat([]);
        } catch (error) {
          console.error("Error al traer nombres:", error);
          setNombreChat([]);
        }
      }
*/}

    async function traerNombres() {
      try {
        const response = await fetch("http://localhost:4000/traerUsuarios", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id_usuario: parseInt(localStorage.getItem("ID")) }),
        });

        const data = await response.json();

        // Guardamos los usuarios en nombreChat, o array vacío si algo falla
        if (data.ok && data.usuarios) setNombreChat(data.usuarios);
        else setNombreChat([]);

      } catch (error) {
        console.error("Error al traer nombres:", error);
        setNombreChat([]);
      }
    }

    // Obtener el nombre del usuario logueado (nombreL)
    useEffect(() => {
      async function obtenerNombreUsuario() {
        try {
          const datos = await obtenerNombre(); // tu función que trae el nombre
          if (datos.ok && datos.contacto) {
            setNombreL(datos.contacto.nombre);
            console.log("Nombre del usuario logueado:", datos.contacto.nombre);
          } else {
            console.log("No se pudo obtener el nombre del usuario");
          }
        } catch (err) {
          console.error("Error al obtener nombre del usuario:", err);
        }
      }

    obtenerNombreUsuario();
  }, []);
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



  async function crearGrupo() {
    let mailsLimpios = validacionGrupo();

    const datos = {
      es_grupo: 1,
      nombre,
      foto,
      descripcion_grupo: descripcion,
      id_usuario: localStorage.getItem("ID"), // usuario logueado
      mails: mailsLimpios
    };

    console.log("Datos del grupo:", datos);

    if (nombre.trim() == "") {
      alert("Por favor, complete el nombre del grupo.");
    } else if (mailsLimpios.length > 0) {
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

  async function crearChatIndividual() {
    const datos = {
      es_grupo: 0,
      mail: mail,
      id_usuario: localStorage.getItem("ID"), // usuario logueado
    };

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

    return mailsLimpios;
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

      return (
        <>
          <div className={styles.chatContainer}>
            {/* Panel de contactos */}
            <div className={styles.contactos}>
              <Title texto="Chats" color="registro" />
              <ul>
                {todosLosContactos.map((u, i) => (
                  <li key={i}>
                    <Contacto
                      nombre={u.nombre}
                      color="contactos"
                      onClick={() => setChatActivo(u)}
                      foto={u.foto}
                    />
                  </li>
                ))}
              </ul>



            </div>
            <Popup trigger={<BotonRedondo texto="+" />}>
              <div className="popupContainer">
                <p>Crear un nuevo chat</p>
                {esGrupo ? (
                  <>
                    <label>
                      <Input type="checkbox" onChange={handleCheckbox} />
                      Clikee si desea crear un chat individual
                    </label>

                    <Input placeholder="Nombre del grupo" onChange={(event) => { setNombre(event.target.value) }} color="registro" />
                    <Input placeholder="Foto (URL)" onChange={(event) => { setFoto(event.target.value) }} color="registro" />
                    <Input placeholder="Descripción del grupo" onChange={(event) => { setDescripcion(event.target.value) }} color="registro" />
                    <h4>Usuarios del grupo</h4>
                    {mails.map((mail, i) => (
                      <Input key={i} type="text" placeholder="Correo del usuario" value={mail} onChange={(e) => actualizarMail(i, e.target.value)} color="registro" />
                    ))}
                    <Boton1 onClick={agregarInput} texto="Agregar otro usuario" color="wpp" />
                    <Boton1 onClick={crearGrupo} texto="Crear grupo" color="wpp" />

                  </>
                ) : (
                  <>
                    <label>
                      <Input type="checkbox" onChange={handleCheckbox} />
                      Clikee si desea crear un grupo
                    </label>
                    <Input placeholder="Mail del contacto" onChange={(event) => { setMail(event.target.value) }} color="registro" />
                    <Boton1 onClick={crearChatIndividual} texto="Agregar chat" color="wpp" />
                  </>
                )}
              </div>
            </Popup>
            {/* Chat principal */}
            <section className={styles.chat}>
              <header className={styles.chatHeader}>
                {(chatActivo) ? (
                  <>
                    {
                      chatActivo.foto != "" ?
                        <img className={styles.foto} src={chatActivo.foto}></img>
                        :
                        <img className={styles.foto} src={"https://cdn-icons-png.flaticon.com/512/847/847969.png"}></img>
                    }
                    <h2>{chatActivo.nombre}</h2>
                  </>
                ) : (
                  <h2>Selecciona un chat</h2>
                )}
              </header>

              {/* Lista de mensajes */}
              <div className={styles.mensajesContainer}>
                {mensajes.map((msg, index) => (
                  <Mensajes
                    key={index}
                    color="mensajes"
                    lado={msg.autor === localStorage.getItem("ID") ? "mensajeyo" : "mensajeotro"}
                    texto={msg.texto}
                  />
                ))}
              </div>

              {/* Mostrar el último mensaje enviado */}
              {chatActivo && ultimoMensaje && (
                <Mensajes color="mensajes" lado="mensajeyo" texto={ultimoMensaje} />
              )}

              {chatActivo && (
                <footer className={styles.chatInput}>
                  <input
                    type="text"
                    placeholder="Escribe tu mensaje..."
                    value={nuevoMensaje}
                    onChange={(e) => setNuevoMensaje(e.target.value)}
                  />
                  <Boton1 texto="Enviar" color="wpp" onClick={enviarMensajeRoom} />
                </footer>
              )}
            </section>
          </div>
        </>

      );
    }

  }
}
  


{/*
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
*/}

