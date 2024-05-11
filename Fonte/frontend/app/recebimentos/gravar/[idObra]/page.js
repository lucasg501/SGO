'use client'

import Carregando from "@/app/components/carregando";
import FormParcelas from "@/app/components/formParcelas";
import httpClient from "@/app/utils/httpClient";
import { useEffect, useState } from "react";

export default function CriarParcelas({params: {idObra}}) {

    const [obra, setObra] = useState(null);
    const [listaParcelas, setListaParcelas] = useState(null);
    const [totalRecebido, setTotalRecebido] = useState(0);
    const [qtdeParcelasPagas, setQtdeParcelasPagas] = useState(0);
    const [carregando, setCarregando] = useState(true);

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

            if (r.listaJson) {

                let lista = r.listaJson;
                let recebido = 0;
                let qtdePaga = 0;

                let listaFinal = [];

                lista.map((parcela) => {
                    if (parcela.dataRecebimento != null) {
                        recebido += parseFloat(parcela.valorParcela);
                        qtdePaga++;
                    }
                    else {
                        listaFinal.push(parcela);
                    }
                });

                setListaParcelas(listaFinal);
                setTotalRecebido(recebido);
                setQtdeParcelasPagas(qtdePaga);
            }
            else {
                setListaParcelas([]);
            }

            setCarregando(false);
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
                <FormParcelas obra={obra} parcelas={listaParcelas} valorRecebido={totalRecebido} qtdeParcelasPagas={qtdeParcelasPagas}></FormParcelas>
                :
                <Carregando />
            }
        </div>
    );
}