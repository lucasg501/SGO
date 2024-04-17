'use client'
import ParcelaForm from '@/app/components/formParcelas';
import httpClient from "@/app/utils/httpClient";
import { useEffect, useState } from "react";

export default function quitarParcela({params: {numParcela}}) {

    const [parcela, setParcela] = useState(null);

    function carregarParcelas(){
        httpClient.get(`/parcelas/obter/${numParcela}`)
        .then(r=>{
            return r.json();
        })
        .then(r=>{
            setParcela(r);
        })
    }

    useEffect(() =>{
        carregarParcelas();
    },[])

    return(
        <div>
            {parcela != null ? <ParcelaForm parcela={parcela}></ParcelaForm> : <div>Carregando...</div>}
        </div>
    )
}