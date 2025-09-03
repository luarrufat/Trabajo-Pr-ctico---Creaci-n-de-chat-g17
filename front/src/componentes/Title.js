"use client"
import clsx from "clsx";
import styles from "@/componentes/Title.module.css"

export default function Title(props) {
    return (
        <>
           <h1 className={
             clsx(
                {
                    [styles.titulo]: props.color == "titulo",
                    
                }
            )
           }>
            {props.texto} 
           </h1>
        </>
    )
}