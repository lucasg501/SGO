'use client'
import { useEffect, useState } from "react"
import httpClient from "../utils/httpClient";
import Link from "next/link";

export default function Recebimentos() {

    const [listaAcompParcelas, setListaAcompParcelas] = useState([]);
    const [listaObras, setListaObras] = useState([]);

    function carregarAcompParcelas() {

        httpClient.get('/parcelas/listar')
            .then(r => r.json())
            .then(r => {
                const parcelasPorObra = {};

                // Organize as parcelas por obra
                r.forEach(parcela => {
                    if (parcelasPorObra[parcela.idObra]) {
                        parcelasPorObra[parcela.idObra].push(parcela);
                    } else {
                        parcelasPorObra[parcela.idObra] = [parcela];
                    }
                });

                // Atualize as informações das obras
                setListaAcompParcelas(parcelasPorObra);
            });
    }

    function carregarObras() {
        httpClient.get('/obras/listar')
            .then(r => r.json())
            .then(r => {
                setListaObras(r);
            });
    }

    // Função para encontrar o bairro correspondente ao idObra
    function encontrarBairro(idObra) {
        const obra = listaObras.find(obra => obra.idObra === idObra);
        return obra ? obra.bairro : "Desconhecido";
    }

    // Função para formatar a data no formato dd/mm/aaaa
    function formatarData(data) {
        return new Date(data).toLocaleDateString('pt-BR');
    }

    useEffect(() => {
        carregarAcompParcelas();
        carregarObras();
    }, [])

    return (

        <div>
            <h1>Recebimentos</h1>

            <div>
                <a href="/recebimentos/gravar"><button className="btn btn-primary">Agendar</button></a>
            </div>

            <div>
                {
                    Object.keys(listaAcompParcelas).map(idObra => (

                        <div key={idObra} style={{ margin: 30 }}>
                            <h2>Obra: {encontrarBairro(Number(idObra))}</h2>

                            <table className="table table-hover">
                                <thead>
                                    <tr>
                                        <th>Parcela</th>
                                        <th>Data de Vencimento</th>
                                        <th>Data de Recebimento</th>
                                        <th>Valor</th>
                                        <th>Marcar como Recebida</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {
                                        listaAcompParcelas[idObra].map((parcela, index) => {

                                            return (
                                                <tr key={index}>
                                                    <td>{index + 1}</td>
                                                    <td>{formatarData(parcela.dataVencimento)}</td>
                                                    <td>{parcela.dataRecebimento ? formatarData(parcela.dataRecebimento) : "Não foi recebida"}</td>
                                                    <td>{parcela.valorParcela}</td>
                                                    <td style={{ display: 'flex', alignContent: 'center' }}>
                                                        {
                                                            parcela.dataRecebimento ?
                                                                <button style={{ margin: 'auto' }} className="btn btn-success" disabled><i className="fas fa-check"></i></button>
                                                                :
                                                                <Link style={{ margin: 'auto' }} className="btn btn-success" href={`/recebimentos/alterar/${parcela.numParcela}`}><i className="fas fa-check"></i></Link>
                                                        }
                                                    </td>

                                                </tr>
                                            )
                                        })
                                    }
                                </tbody>
                            </table>
                        </div>
                    ))
                }
            </div>
        </div>
    )
}