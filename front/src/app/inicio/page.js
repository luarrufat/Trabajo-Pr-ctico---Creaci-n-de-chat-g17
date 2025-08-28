"use client"

import Input from "@/componentes/Input"
import Title from "@/componentes/Title"

export default function inicioPage() {
    let contacts = [
        {
            nombre: "Emi",
            apellido: "Gaetani",
            usuario_mail: "egaetani@gmail",
            password: "sarmiento01",
            foto_perfil: "",
            descripción: "hola",
        },
        {
            nombre: "Lu",
            apellido: "Arrufat",
            usuario_mail: "larrufat@gmail",
            password: "juani",
            foto_perfil: "",
            descripción: "chau",
        },
        {
            nombre: "Ju",
            apellido: "Zuran",
            usuario_mail: "jzuran@gmail",
            password: "juju123",
            foto_perfil: "",
            descripción: "adios",

        },
    ]

      function mostrarContactos() {
        let lista = []
        for (let i = 0; i < contacts.length; i++) {
            lista.push(
                <li>
                    {contacts[i].nombre} {contacts[i].apellido}
                </li>
            )
        }
        return lista
    }

    return (
        <>
            <Title texto="Chats" />
            <Input type="text" placeholder="Buscar" id="buscar" />
            <ol>
                {mostrarContactos()}
            </ol>
        </>
    )
}