"use client";

import React, { useEffect, useState } from "react";
import clsx from "clsx";
import styles from "./page.module.css";
import Boton1 from "@/componentes/Boton1";
import Contacto from "@/componentes/Contactos";
import Mensajes from "@/componentes/Mensajes";
import { useSocket } from "@/hooks/useSocket";

export default function ChatPage() {
    const [nombre, setNombre] = useState("");
    const { socket, isConnected } = useSocket();
    const [nuevoMensaje, setNuevoMensaje] = useState("");
    const [ultimoMensaje, setUltimoMensaje] = useState("");
    const [idChatU, setIdChatU] = useState("");

    useEffect(() => {
        if (!socket) return;

        socket.on("pingAll", (data) => {
            console.log("PING ALL DEL FRONT: ", data);
        });
    }, [socket]);

    useEffect(() => {
        if(socket) {
            socket.emit("joinRoom", {room: idChatU})
        }
    }, [socket])

    function enviarMensaje() {
        if (!nuevoMensaje.trim()) return;
        setUltimoMensaje(nuevoMensaje);
        if (socket) {
            socket.emit("pingAll", { mensaje: nuevoMensaje });
            guardarMensajes()
        }
        setNuevoMensaje("");
    }

    async function obtenerNombre() {
        try {
            const response = await fetch("http://localhost:4000/contacto", {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            });
            return await response.json();
        } catch (err) {
            console.error("Error al obtener nombre:", err);
            return { ok: false };
        }
    }


    useEffect(() => {
        async function contacto() {
            const datos = await obtenerNombre();
            if (datos.ok && datos.contacto) {
                setNombre(datos.contacto.nombre);
                console.log(datos)
            } else {
                console.log("No se pudo obtener el nombre");
            }
        }
        contacto();
    }, []);

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
            const chatResp = await obtenerNombre();
            setIdChatU(chatResp);
            console.log("EL ID USUARIO ES: ", usuarioResp)
            if (!usuarioResp) {
                console.error("Error: no se pudo obtener usuario o chat");
                return;
            }
    
            const id = usuarioResp;
            const idChat = chatResp.contacto.ID;
    
            const datos = {
                contenido: nuevoMensaje,
                fecha_hora: new Date().toISOString().slice(0, 19).replace('T', ' '),
                id_usuario: id,
                id_chat: idChat,
            };
    
            console.log("Datos a enviar:", datos);
            await agregarMensajes(datos);
        } catch (error) {
            console.error("Error al guardar mensaje:", error);
        }
    }
    
    return (
        <div className={styles.chatContainer}>
            {/* Panel de contactos */}
            <div className={styles.contactos}>
                <input
                    type="text"
                    placeholder="Buscar contacto"
                    className={styles.buscador}
                />
                <Contacto color="contactos" texto="Usuario 1" />
                <Contacto color="contactos" texto="Usuario 2" />
                <Contacto color="contactos" texto="Usuario 3" />
            </div>

            {/* Chat principal */}
            <section className={styles.chat}>
                <header className={styles.chatHeader}>
                    <h2>⚪ {nombre}</h2>
                </header>

                {/* Mostrar el último mensaje enviado */}
                {ultimoMensaje && <Mensajes color="mensajes" lado="mensajeyo" texto={ultimoMensaje} />}

                <footer className={styles.chatInput}>
                    <input
                        type="text"
                        placeholder="Escribe tu mensaje..."
                        value={nuevoMensaje}
                        onChange={(e) => setNuevoMensaje(e.target.value)}

                    />
                    <Boton1 texto="Enviar" color="wpp" onClick={enviarMensaje} />
                </footer>
            </section>
        </div>
    );
}