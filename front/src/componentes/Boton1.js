"use client";

export default function Boton(props) {
    return (
        <button className="boton-wpp" onClick={props.onClick} type={props.type} color={props.color}>
        </button>
    );
}
