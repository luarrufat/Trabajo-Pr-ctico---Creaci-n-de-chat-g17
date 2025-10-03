import clsx from "clsx"
import styles from "@/componentes/Mensajes.module.css"

export default function Mensajes({ lado, texto, hora }) {
    return (
        <div
            className={clsx(styles.mensajes, {
                [styles.mensajeyo]: lado == "mensajeyo",
                [styles.mensajeotro]: lado == "mensajeotro",
            })}
        >
            {lado === "mensajeotro" && (
                <strong className={styles.nombre}>{nombre}</strong>
            )}
            <p>{texto}</p>
            {hora && <h5 className={styles.hora}>{hora}</h5>}
        </div>
    );
}