"use client"

export default function Boton(props) {
    function imprimir(){
        console.log("mati pro");
    }

    return (
        <>
            <button onClick={props.pro} type={props.type}>Elegi al pro</button>

        </>
    )
}