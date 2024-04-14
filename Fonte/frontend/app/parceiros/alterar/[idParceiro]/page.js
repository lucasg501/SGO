'use client'
import ParceiroForm from "@/app/components/parceiroForm";
import httpClient from "@/app/utils/httpClient";
import { useEffect, useState } from "react"

export default function AlterarParceiro({params: {idParceiro}}) {
    const [parceiro, setParceiro] = useState(null);

    function carregarParceiro() {
        httpClient.get(`/parceiros/obter/${idParceiro}`)
        .then( r=>{
            return r.json();
        })
        .then(r=>{
            setParceiro(r);
        })
    }

    useEffect(() =>{
        carregarParceiro();
    },[]);

    return(
        <div>
            {parceiro != null ? <ParceiroForm parceiro={parceiro}></ParceiroForm> : <div>Carregando...</div>}
        </div>
    )
}