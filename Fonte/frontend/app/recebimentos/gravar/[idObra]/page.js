'use client'

import FormParcelas from "@/app/components/formParcelas";
import httpClient from "@/app/utils/httpClient";
import { useEffect, useState } from "react";

export default function CriarParcelas({params: {idObra}}) {

    const [obra, setObra] = useState(null);
    const [listaParcelas, setListaParcelas] = useState(null);

    function carregarObra() {

        httpClient.get(`/obras/obter/${idObra}`)
        .then(r => {
            return r.json();
        })
        .then(r => {
            setObra(r);
        });
    }

    
    function carregarParcelasObra() {

        httpClient.get(`/parcelas/obterParcelasPorObra/${idObra}`)
        .then(r => {
            return r.json();
        })
        .then(r => {
            setListaParcelas(r.listaJson);
        })
    }

    useEffect(() => {
        carregarObra();
        carregarParcelasObra();
    }, [])

    return (
        
        <div>
            {
                obra && listaParcelas ? 
                <FormParcelas obra={obra} parcelas={listaParcelas}></FormParcelas>
                :
                <div>Carregando...</div>
            }
        </div>
    );
}