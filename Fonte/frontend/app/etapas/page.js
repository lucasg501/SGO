'use client'
import { useEffect, useState } from "react";
import httpClient from "../utils/httpClient";
import Link from "next/link";

export default function Etapas(){

    const [listaAcompEtapas, setListaAcompEtapas] = useState([]);
    const [listaObras, setListaObras] = useState([]);
    const [listaEtapas, setListaEtapas] = useState([]);

    function carregarAcompEtapas(){
        httpClient.get('/andamentoEtapas/listar')
            .then(r => r.json())
            .then(r => {
                const etapasPorObra = {};

                // Organize as etapas por obra
                r.forEach(etapa => {
                    if(etapasPorObra[etapa.idObra]){
                        etapasPorObra[etapa.idObra].push(etapa);
                    } else {
                        etapasPorObra[etapa.idObra] = [etapa];
                    }
                });

                // Atualize as informações das obras
                setListaAcompEtapas(etapasPorObra);
            });
    }

    function carregarObras(){
        httpClient.get('/obras/listar')
            .then(r => r.json())
            .then(r => {
                setListaObras(r);
            });
    }

    function carregarEtapas(){
        httpClient.get('/etapas/listar')
            .then(r => r.json())
            .then(r => {
                setListaEtapas(r);
            });
    }

    useEffect(() =>{
        carregarAcompEtapas();
        carregarObras();
        carregarEtapas();
    },[]);

    // Função para encontrar o bairro correspondente ao idObra
    function encontrarBairro(idObra) {
        const obra = listaObras.find(obra => obra.idObra === idObra);
        return obra ? obra.bairro : "Desconhecido";
    }

    function encontrarEtapa(idEtapa) {
        const etapa = listaEtapas.find(etapa => etapa.idEtapa === idEtapa);
        return etapa ? etapa.nomeEtapa : "Etapa desconhecida";
    }

    // Função para formatar a data no formato dd/mm/aaaa
    function formatarData(data) {
        return new Date(data).toLocaleDateString('pt-BR');
    }

    return(
        <div>
            <h1>Etapas</h1>

            <div>
                <a href="/etapas/gravar"><button className="btn btn-primary">Cadastrar</button></a>
            </div>

            <div>
                {Object.keys(listaAcompEtapas).map(idObra => (
                    <div key={idObra}>
                        <h2>Obra: {encontrarBairro(Number(idObra))}</h2>
                        <table className="table table-hover">
                            <thead>
                                <tr>
                                    <th>Etapa</th>
                                    <th>Data Início</th>
                                    <th>Data Término</th>
                                    <th>Data Fim</th>
                                    <th>Descrição</th>
                                    <th>Marcar como terminada</th>
                                </tr>
                            </thead>

                            <tbody>
                                {listaAcompEtapas[idObra].map((etapa, index) => (
                                    <tr key={index}>
                                        <td>{encontrarEtapa(etapa.idEtapa)}</td>
                                        <td>{formatarData(etapa.dataPrevInicio)}</td>
                                        <td>{formatarData(etapa.dataPrevTermino)}</td>
                                        <td>{etapa.dataFim ? formatarData(etapa.dataFim) : ''}</td>
                                        <td>{etapa.descricaoEtapa}</td>
                                        <td style={{display: 'flex', alignContent: 'center'}}>
                                            <Link style={{margin: 'auto'}} className="btn btn-success" href={`/etapas/alterar/${etapa.idAndamento}`}><i className="fas fa-check"></i></Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ))}
            </div>
        </div>
    );
}
