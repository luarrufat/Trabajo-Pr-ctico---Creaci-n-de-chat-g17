"use client";

import React, { useState } from "react";
import clsx from "clsx";
import styles from "./page.module.css";
import Boton1 from "@/componentes/Boton1";
import Contacto from "@/componentes/Contactos";
import Mensajes from "@/componentes/Mensajes";

export default function ChatPage() {
    const [nombre, setNombre] = useState("");
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
                    <h2>⚪ Nombre del contacto</h2>
                </header>
                <footer className={styles.chatInput}>
                    <input
                        type="text"
                        placeholder="Escribe tu mensaje..."
                        /*value={mensaje}
                        onChange={(e) => setMensaje(e.target.value)}*/
                    />
                    <Boton1 texto="Enviar" color="wpp" /*onClick={enviarMensaje}*/ />
                </footer>
            </section>
        </div>
    );
}