'use client'
import { useEffect, useState } from "react"
import httpClient from "../utils/httpClient";
import Link from "next/link";

export default function Etapas(){

    const [listaAcompEtapas, setListaAcompEtapas] = useState([]);

    function carregarAcompEtapas(){

        httpClient.get('/andamentoEtapas/listar')
        .then(r=>{
            return r.json();
        })
        .then(r=>{
            const etapasPorObra = {};
            r.forEach(etapa => {
                if(etapasPorObra[etapa.idObra]){
                    etapasPorObra[etapa.idObra].push(etapa);
                } else {
                    etapasPorObra[etapa.idObra] = [etapa];
                }
            });
            setListaAcompEtapas(etapasPorObra);
        })
    }

    useEffect(() =>{
        carregarAcompEtapas();
    },[]);


    return(
        <div>
            <h1>Etapas</h1>

            <div>
                <a href="/etapas/gravar"><button className="btn btn-primary">Cadastrar</button></a>
            </div>

            <div>
                {Object.keys(listaAcompEtapas).map(idObra => (
                    <div key={idObra}>
                        <h2>Obra: {idObra}</h2>
                        <table className="table table-hover">
                            <thead>
                                <tr>
                                    <th>Etapa</th>
                                    <th>Data Inicio</th>
                                    <th>Data Término</th>
                                    <th>Data Fim</th>
                                    <th>Descrição</th>
                                    <th>Marcar como terminada</th>
                                </tr>
                            </thead>

                            <tbody>
                                {listaAcompEtapas[idObra].map((etapa, index) => (
                                    <tr key={index}>
                                        <td>{etapa.idEtapa}</td>
                                        <td>{etapa.dataPrevInicio}</td>
                                        <td>{etapa.dataPrevTermino}</td>
                                        <td>{etapa.dataFim}</td>
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
    )
}
