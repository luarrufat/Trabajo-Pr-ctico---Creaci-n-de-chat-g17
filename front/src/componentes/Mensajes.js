"use client"

import clsx from "clsx"
import styles from "@/componentes/Mensajes.module.css"

export default function Mensajes({ lado, texto, hora }) {
    return (
        <div className={clsx(
            styles.mensajes,
            {
                [styles.mensajeyo]: lado === "mensajeyo",
                [styles.mensajeotro]: lado === "mensajeotro"
            }
        )}>
            <p>{texto}</p>
            {hora && <h5 className={styles.hora}>{hora}</h5>}
        </div>
    );
}

/*  ASI SE PRUEBA:
            <Mensajes lado="mensajeotro" texto="Holaaaaaa" hora="10:45" />
            <Mensajes lado="mensajeyo" texto="¿Cómo estás?" hora="10:46" />

*/