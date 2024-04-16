'use client'
import EtapaForm from '@/app/components/formEtapas';
import httpClient from "@/app/utils/httpClient";
import { useEffect, useState } from "react"

export default function marcarFimEtapa({params:{idAndamento}}) {
    const [etapa, setEtapa] = useState(null);

    function carregarEtapas() {
        httpClient.get(`/andamentoEtapas/obter/${idAndamento}`)
        .then(r=>{
            return r.json();
        })
        .then(r=>{
            setEtapa(r);
        })
    }

    useEffect(() =>{
        carregarEtapas();
    },[]);

    return(
        <div>
            {etapa != null ? <EtapaForm etapa={etapa}></EtapaForm> : <div>Carregando...</div>}
        </div>
    )
}