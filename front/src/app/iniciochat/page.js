"use client";

import React, { useEffect, useState } from "react";
import clsx from "clsx";
import styles from "./page.module.css";
import Boton1 from "@/componentes/Boton1";
import Contacto from "@/componentes/Contactos";
import Mensajes from "@/componentes/Mensajes";
import { useSocket } from "@/hooks/useSocket";
import Title from "@/componentes/Title"
import Input from "@/componentes/Input"
import BotonRedondo from "@/componentes/BotonRedondo"
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';

export default function ChatPage() {
    const [nombre, setNombre] = useState("");
    const [nombreL, setNombreL] = useState("");
    const { socket, isConnected } = useSocket();
    const [nuevoMensaje, setNuevoMensaje] = useState("");
    const [ultimoMensaje, setUltimoMensaje] = useState("");
    const [idChatU, setIdChatU] = useState("");
    const [es_grupo, setEs_grupo] = useState("")
    const [foto, setFoto] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [contacts, setContacts] = useState([])
    const [esGrupo, setEsGrupo] = useState(false);
    const [mail, setMail] = useState("")
    const [mails, setMails] = useState(["", ""])
    const [chatActivo, setChatActivo] = useState(null);
    const [mensajes, setMensajes] = useState([]);
    const [nombreChat, setNombreChat] = useState([]);
    const [nombreChat2, setNombreChat2] = useState([]);
    const todosLosContactos = [...contacts, ...nombreChat];



    useEffect(() => {
        if (!socket) return;

        socket.on("pingAll", (data) => {
            console.log("PING ALL DEL FRONT: ", data);
        });
    }, [socket]);
    /*
        useEffect(() => {
            if (!socket) return;
            socket.on("newMessage", (data) => {
                console.log("📩 Mensaje recibido:", data);
    
                if (chatActivo && data.room === chatActivo.ID) {
                    setMensajes((actual) => [
                        ...actual,
                        {
                            texto: data.message.texto ?? data.message,
                            autor: data.message.autor ?? "otro",
                            chatId: data.room
                        }
                    ]);
                }
            });
    
            return () => {
                socket.off("newMessage");
            };
        }, [socket, chatActivo]);
    */
   /*
    useEffect(() => {
        if (!socket) return;

        const handler = (data) => {
            console.log("📩 Mensaje recibido:", data);

            // me aseguro de que sea del chat abierto
            if (chatActivo && data.room === chatActivo.ID) {
                const nuevoMensaje = {
                    texto: data.message.texto,   // solo el texto
                    autor: data.message.autor,   // quien lo mandó
                    chatId: data.room
                };

                // lo agrego a la lista de mensajes
                setMensajes((mensajes) => [...mensajes, nuevoMensaje]);
            }
        };

        socket.on("newMessage", handler);

        return () => {
            socket.off("newMessage", handler);
        };
    }, [socket, chatActivo]);
*/
    useEffect(() => {
        if (!socket) return;

        const handler = ({ room, message }) => {
            console.log("📩 Mensaje recibido:", { room, message });

            if (chatActivo && room === chatActivo.ID) {
                setMensajes((prev) => [...prev, message]);
            }
        };

        socket.on("newMessage", handler);

        return () => socket.off("newMessage", handler);
    }, [socket, chatActivo]);



    useEffect(() => {
        if (chatActivo != undefined) {
            socket.emit("joinRoom", { room: idChatU })
        }
    }, [chatActivo])

    //TRABAJANDO
    useEffect(() => {
        const id_usuario = localStorage.getItem("ID");
        traerChats();
        traerNombres();
    }, []);

    useEffect(() => {
        console.log("CONTACTS:", contacts);
        console.log("NOMBRECHAT:", nombreChat);
    }, [contacts, nombreChat]);

    useEffect(() => {
        async function cargar() {
            try {
                const res = await fetch("http://localhost:4000/traerUsuarios", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ id_usuario: localStorage.getItem("ID") }),
                });

                const data = await res.json();
                console.log("📩 traerUsuarios ->", data);

                setNombreChat(data);
            } catch (err) {
                console.error("Error traerUsuarios:", err);
            }
        }

        cargar();
    }, []);


    function enviarMensaje() {
        if (!nuevoMensaje.trim()) return;
        setUltimoMensaje(nuevoMensaje);

        if (socket) {
            socket.emit("pingAll", { mensaje: nuevoMensaje });
            guardarMensajes()

        }
        setNuevoMensaje("");
    }
    /*
        function enviarMensajeRoom() {
            if (!nuevoMensaje.trim()) return;
            setUltimoMensaje(nuevoMensaje);
    
            if (socket && chatActivo) {
                socket.emit("sendMessage", {
                    room: chatActivo.ID,   // el ID del chat que abriste
                    message: nuevoMensaje,
                    usuario: localStorage.getItem("ID")
                });
    
                guardarMensajes(); // guardás en la BD
            }
            setNuevoMensaje("");
        }
    */
    /*  function enviarMensajeRoom() {
          if (!nuevoMensaje.trim() || !chatActivo) return;
          setUltimoMensaje(nuevoMensaje);
      
          if (socket) {
              socket.emit("sendMessage", { room: chatActivo.ID, message: nuevoMensaje });
              guardarMensajes();
          }
      
          setNuevoMensaje("");
      }*/

    /*
    function enviarMensajeRoom() {
    if (!nuevoMensaje.trim() || !chatActivo) return;
    setUltimoMensaje(nuevoMensaje);
    
    if (socket) {
        socket.emit("sendMessage", { room: chatActivo.ID, message: nuevoMensaje });
        guardarMensajes();
    }
    
    setNuevoMensaje("");
    }
    */

    function enviarMensajeRoom() {
        if (!nuevoMensaje.trim() || !chatActivo) return;

        const mensaje = {
            texto: nuevoMensaje,
            autor: localStorage.getItem("ID"),
            chatId: chatActivo.ID,
        };

        setMensajes((prev) => [...prev, mensaje]);


        if (socket) {
            socket.emit("sendMessage", {
                room: chatActivo.ID,
                message: mensaje,
            });
            guardarMensajes();
        }

        setNuevoMensaje("");
    }



    async function obtenerNombre() {
        try {
            const response = await fetch("http://localhost:4000/contacto", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id_usuario: localStorage.getItem("ID") })
            });
            return await response.json();
        } catch (err) {
            console.error("Error al obtener nombre:", err);
            return { ok: false };
        }

    }

    //LUCIA CHAT
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

    async function traerNombres() {
        try {
            const response = await fetch("http://localhost:4000/traerUsuarios", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id_usuario: parseInt(localStorage.getItem("ID")) })
            });
            const data = await response.json();
            console.log("traerUsuarios ->", data);
            if (data.ok && data.usuarios) setNombreChat(data.usuarios);
            else setNombreChat([]);
        } catch (error) {
            console.error("Error al traer nombres:", error);
            setNombreChat([]);
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

    {/*SUBIR MENSAJES A BBDD*/ }

    async function obtenerIdUsuario() {
        try {
            const response = await fetch("http://localhost:4000/infoUsuario", {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            });
            return await response.json();
        } catch (err) {
            console.error("Error al obtener id:", err);
            return { ok: false };
        }
    }

    async function agregarMensajes(datos) {
        try {
            const response = await fetch("http://localhost:4000/mensajes", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(datos),
            })
            const result = await response.json()
            console.log(result)

            if (result.res === "ok") {

            }
        } catch (error) {
            console.log("Error", error)
        }
    }

    async function guardarMensajes() {
        try {
            const usuarioResp = localStorage.getItem('ID');
            setIdChatU(chatActivo.ID);
            console.log("EL ID USUARIO ES: ", usuarioResp)
            if (!usuarioResp) {
                console.error("Error: no se pudo obtener usuario o chat");
                return;
            }
            const idChat = chatActivo.ID;
            console.log("id del usuario: ", usuarioResp)
            console.log("id del chat: ", idChat)
            const datos = {
                contenido: nuevoMensaje,
                fecha_hora: new Date().toISOString().slice(0, 19).replace('T', ' '),
                id_usuario: usuarioResp,
                id_chat: idChat,
            };

            console.log("Datos a enviar:", datos);
            await agregarMensajes(datos);
        } catch (error) {
            console.error("Error al guardar mensaje:", error);
        }
    }

    return (
        <>
            <div className={styles.chatContainer}>
                {/* Panel de contactos */}
                <div className={styles.contactos}>
                    {/* <input
                    type="text"
                    placeholder="Buscar contacto"
                    className={styles.buscador}
                    id="buscar"
                    />*/}

                    <ul>
                        {todosLosContactos.map((u) => (
                            <li key={u.ID}>
                                <Contacto
                                    nombre={u.nombre}
                                    color="contactos"
                                    onClick={() => setChatActivo(u)}
                                />
                            </li>
                        ))}
                    </ul>
                    <ul>
                        {nombreChat.map((u, index) => (
                            <li key={index}>
                                <Contacto
                                    nombre={u.nombre}
                                    color="contactos"
                                    onClick={() => {
                                        const chatId = u.id_chat;
                                        setChatActivo({ ID: chatId, nombre: u.nombre });
                                    }}
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
                        {chatActivo ? (
                            <h2>⚪ {chatActivo.nombre}</h2>
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
