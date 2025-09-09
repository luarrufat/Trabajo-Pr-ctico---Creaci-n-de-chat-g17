"use client"

import styles from "@/componentes/BotonRedondo.module.css"

export default function BotonRedondo(props) {
  return (
    <button 
      onClick={props.onClick} 
      className={styles.botonRedondo}
    >
      {props.texto}
    </button>
  )
}
