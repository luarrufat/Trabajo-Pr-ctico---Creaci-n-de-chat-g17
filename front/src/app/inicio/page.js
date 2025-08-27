"use client"

import Input from "@/componentes/Input"
import Title from "@/componentes/Title"
import Usuario from "@/componentes/Usuario"

export default function inicioPage(){

    return(
        <>
        <Title texto="Chats"></Title>
        <Input type={text} placeholder={"Buscar"} id="buscar"></Input>
        <ol>
            <li><Usuario></Usuario> </li>
        </ol>
        </>
    )

}