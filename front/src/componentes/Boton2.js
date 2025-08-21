"use client"

import clsx from "clsx";
import styles from "@/componentes/Boton2.module.css"

export default function Boton(props) {
    function imprimir(){
        console.log("mati pro");
    }

    return (
        <>
            <button onClick={props.onClick} type={props.type} className={
                clsx(
                    {
                        [styles.sumar]: props.color == "verde",
                        [styles.restar]: props.color == "brown"
                    }
                )
            }>{props.texto}</button>
        </>
    )
}