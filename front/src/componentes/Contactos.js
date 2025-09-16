"use client"

import clsx from "clsx"
import styles from "@/componentes/Contactos.module.css"

export default function Contacto(props) {
  const fotoPorDefecto =
    "https://cdn-icons-png.flaticon.com/512/847/847969.png"
  return (
    <div
      onClick={props.onClick}
      className={clsx({
        [styles.contactos]: props.color == "contactos",
      })}
    >
      <img
        src={props.foto ? props.foto : fotoPorDefecto}
        alt={props.nombre}
        className={styles.foto}
      />
      <h3>{props.nombre}</h3>
    </div>
  )
}