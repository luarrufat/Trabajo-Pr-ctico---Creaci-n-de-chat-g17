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
    useEffect(() => {
        if (!socket) return;

        socket.on("pingAll", (data) => {
            console.log("PING ALL DEL FRONT: ", data);
        });

        return () => {
            socket.off("pingAll");
        };
    }, [socket]);

    {/*
    function enviarMensaje() {
        if (!nuevoMensaje.trim()) return;
        setHistorial(historial + "\n" + nuevoMensaje);
        if (socket) {
            socket.emit("pingAll", { mensaje: nuevoMensaje });
        }
        setNuevoMensaje("");
    }
       */}

    function enviarMensaje() {
        if (!nuevoMensaje.trim()) return;
        setUltimoMensaje(nuevoMensaje);
        if (socket) {
            socket.emit("pingAll", { mensaje: nuevoMensaje });
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
        {ultimoMensaje && <Mensajes color="mensajes" lado= "mensajeyo" texto={ultimoMensaje} />}

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