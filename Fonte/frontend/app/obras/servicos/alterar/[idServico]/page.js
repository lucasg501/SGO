'use client'
import ServicoFormAlterar from "@/app/components/servicoFormAlterar";
import httpClient from "@/app/utils/httpClient";
import { useEffect, useState } from "react"

export default function AlterarServico({ params: { idServico } }) {
    const [servico, setServico] = useState(null);

    function carregarServico(){
        httpClient.get(`/servicos/obter/${idServico}`)
        .then(r=>{
            return r.json();
        })
        .then(r=>{
            setServico(r);
        })
    }

    useEffect(() =>{
        carregarServico();
    },[])

    return(
        <div>
            {servico != null ? <ServicoFormAlterar servico={servico} idObra={servico.idObra} /> : <div>Carregando...</div>}
        </div>
    )
}
