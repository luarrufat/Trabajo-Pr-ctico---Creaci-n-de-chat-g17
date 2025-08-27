"use client"
import styles from "@/componentes/Usuario.module.css"

export default function Usuario(props) {

    return (
        <>
            <div> className={
                clsx(
                    {
                        [styles]: props.img == "usuario-wpp.img"
                        [styles]: props.nombre == "usuario-wpp"
                    }
            )
            }
        </div >
        </>
    )

}