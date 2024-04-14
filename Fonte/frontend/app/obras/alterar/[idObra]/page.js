'use client'
import httpClient from "@/app/utils/httpClient";
import ObraForm from '@/app/components/obraForm';
import { useEffect, useState } from "react"

export default function alterarObra({params:{idObra}}){
    const [obra, setObra] = useState(null);

    function carregarObras(){
        httpClient.get(`/obras/obter/${idObra}`)
        .then(r=>{
            return r.json();
        })
        .then(r=>{
            setObra(r);
        })
    }

    useEffect(() =>{
        carregarObras();
    },[]);

    return(
        <div>
            {obra != null ? <ObraForm obra={obra} /> : <div>Carregando...</div>}
        </div>
    )
}