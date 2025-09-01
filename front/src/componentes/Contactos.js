"use client"

import clsx from "clsx"
import styles from "@/componentes/Contactos.module.css"

export default function Contacto(props) {
  return (
    <div
      onClick={props.onClick}
      className={clsx({
        [styles.contactos]: props.color == "contactos",
      })}
    >
      <h3>{props.nombre} </h3>
    </div>
  )
}
