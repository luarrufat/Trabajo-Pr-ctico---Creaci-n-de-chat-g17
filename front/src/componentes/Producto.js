/*Crear un componente Producto, que es un componente compuesto formado por los 3 componentes 
del punto anterior. El mismo contará con un título, una descripción y un botón.*/

"use client"

import Button from "./Button";
import Description from "./Description";
import Title1 from "./Title1";
export default function Producto({ title, textoBoton, onClickBoton, textoDescripcion }) {

    return (
        <div className="form-container">
            <Title1 texto={title} />
            <Description texto={textoDescripcion}></Description>
            <Button texto={textoBoton} onClick={onClickBoton} />
        </div>
    );
}