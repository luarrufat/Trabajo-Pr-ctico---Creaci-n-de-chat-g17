"use client"

import clsx from "clsx"
import styles from "@/componentes/Mensajes.module.css"

export default function Mensajes(props) {
    return (
        <div className={
            clsx(
            {
                [styles.mensajes]: props.color == "mensajes",
                [styles.mensajeyo]: props.lado == "mensajeyo",
            }
        )
        }><h2>{props.texto}</h2>
        </div>
    );
}

 