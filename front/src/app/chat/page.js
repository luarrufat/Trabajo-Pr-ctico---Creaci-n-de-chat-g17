"use client"

import Boton1 from "@/componentes/Boton1"
import Input from "@/componentes/Input"
import Title from "@/componentes/Title"
import React from 'react';
import clsx from 'clsx';
import styles from './input.module.css';

export default function(props){
    return (
        <>
        <div> className={clsx(styles.inputContainer)}</div>
            <Title texto="nombre"></Title>
            <Input type={"text"} ></Input>
    
            <br></br>
            <Input type={"text"} ></Input>
            
        </>
    )
}

