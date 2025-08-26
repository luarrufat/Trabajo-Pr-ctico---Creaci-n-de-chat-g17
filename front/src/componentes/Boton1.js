"use client";
import clsx from "clsx";
import styles from "@/componentes/Boton1.module.css"
export default function Boton1(props) {
    return (
        <button onClick={props.onClick} type={props.type}  className={
            clsx(
                {
                    [styles.wpp]: props.color == "wpp",  
                }
            )
        }>{props.texto}</button>
    );
}







