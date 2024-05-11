'use client'
import Carregando from "@/app/components/carregando";
import ClienteForm from "@/app/components/clientesForm";
import httpClient from "@/app/utils/httpClient";
import { useEffect, useState } from "react"

export default function AlterarCliente({params: {idCli}}){
    const [cliente, setCliente] = useState(null);

    function carregarCliente(){
        httpClient.get(`/clientes/obter/${idCli}`)
        .then(r=>{
            return r.json();
        })
        .then(r=>{
            setCliente(r);
        })
    }

    useEffect(()=>{
        carregarCliente();
    },[])

    return(
        <div>
            {cliente != null ? <ClienteForm cliente={cliente}></ClienteForm>: <Carregando />}
        </div>
    )
}