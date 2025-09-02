"use client"

import Boton2 from "@/componentes/Boton2";
import Input from "@/componentes/Input";
import Title from "@/componentes/Title";
import { use, useEffect, useState } from "react";
import clsx from "clsx";
import styles from "@/componentes/Boton2.module.css"
import { useRouter } from "next/navigation";
import BotonRedondo from "@/componentes/BotonRedondo";

export default function loginPage() {
    const [cuenta, setCuenta] = useState(0);
    const [bool, setBool] = useState(false);
    const [color, setcolor] = useState("brown");
    const [nombre, setNombre] = useState("");
    const router = useRouter();
   
    function a(event){
        setBool(event.target.checked)
    }
    function checkeado() {
        if (bool) {
            sumar()
            setcolor("verde")
        } else {
            restar()
            setcolor("brown")
        } 
    }
    function saludo(event){
        setNombre(event.target.value);
    }
    function sumar() {
        setCuenta(cuenta + 1);
    }
    function restar(){
        setCuenta(cuenta - 1);
    }
    function ver(event){
        console.log(event.target.checked)
        return (event.target.checked)
    }
    useEffect(()=>{
        if (cuenta>20) {
            setCuenta(0)
        }
        if (cuenta<-20) {
            router.push("/login")
        }
    }, [cuenta])
    return (
        <>
            <Title texto="Contador"></Title>
            <Boton2 texto="Sumar y restar" onClick={checkeado} color={color}></Boton2>
            <Input type={"checkbox"} respuesta={a}></Input>
            <h2>{cuenta}</h2>
            <br></br>
            <Input type={"text"} respuesta={saludo}></Input>
            {nombre != "" && <h2>Soy:{nombre}</h2>}
            {nombre == "mati" ? <h2> Sos pro {nombre}</h2>:<h2>Escribí mati</h2>}

            
        </>
    )
}