/*Cuando se abra la página por primera vez, se debe realizar un pedido FETCH para obtener el
 listado de los productos. Este será un pedido tipo GET que devuelve un objeto con el vector 
 de productos. Una vez obtenido el vector, mostrar en la página todos los productos, llamando 
 al componente Producto creado en el punto 2. La dirección IP será proporcionada por los docentes. 
 El puerto será el 4000. La URL del pedido GET es “/productos”. Al mostrar todos los productos, 
 deberá mostrar tantos componentes Producto como elementos traiga el vector.*/

"use client"

import React, { useEffect, useState } from "react";
import Producto from "@/componentes/Producto";

export default function pruebaRivu() {

    const [products, setProducts] = useState([])

    useEffect(() => {
        async function mostrar() {
            const prod = await traerProductos();
            setProducts(prod.productos)
            console.log("LOS products SON: ", products)
            console.log("LOS prod SON: ", prod)
        }
        mostrar()
    }, []);

    async function traerProductos() {
        try {
            const response = await fetch("http://4000:4000/productos", {
                method: "GET",
                headers: { "Content-Type": "application/json" }
            })

            const result = await response.json()
            console.log(result)

        } catch (error) {
            console.log("Error al traer productos:", error)
        }
    }
    return (
        <>
            <Producto title={"Productos"} textoBoton={"traer productos"} onClickBoton={traerProductos()} textoDescripcion={""}></Producto>
            {
                products.length == 0 ? (
                    <p>No hay productos</p>
                ) : (
                    products.map((prod, i) => (
                        <p key={i}><Producto title={prod.productos}></Producto>{prod.productos}</p>
                    ))
                )

            }
        </>


    )
}

