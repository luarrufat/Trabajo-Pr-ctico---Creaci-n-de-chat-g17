"use client"

import { useEffect, useState } from "react";

export default function prueba() {
    const [usuarios, setUsuarios] = useState([])
    async function obtenerNombre() {
        try {
            const response = await fetch("http://localhost:4000/traerUsuarios", {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            });
            return await response.json();
        } catch (err) {
            console.error("Error al obtener id:", err);
            return { ok: false };
        }
    }

    useEffect(() => {
        async function mostrar() {
            const users = await obtenerNombre();
            setUsuarios(users.usuario)
            console.log("LOS USUARIOS SON: ", usuarios)
            console.log("LOS USERS SON: ", users)
        }
        mostrar()
    }, []);

    useEffect(() => {
        console.log("Usuarios cambió:", usuarios);
    }, [usuarios]);



    return (
        <>
            <h2>Los Usuarios son:</h2>
            {/*{usuarios.map((user, index) => (
                <p key={index}>{user.texto}</p>
            ))}  */}
            {usuarios.length === 0 ? (
                <p>No hay usuarios</p>
            ) : (
                usuarios.map((user, index) => (
                    <p key={index}>{user.nombre}</p>
                ))
            )}
        </>
    )
}

