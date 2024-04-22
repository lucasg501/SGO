'use client'
import { useEffect, useState } from "react"
import httpClient from "../utils/httpClient";
import Link from "next/link";

export default function Recebimentos() {

    const [listaAcompParcelas, setListaAcompParcelas] = useState([]);
    const [listaObras, setListaObras] = useState([]);
    const [listaParcelasVencidas, setListaParcelasVencidas] = useState([]);

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

    function procurarParcelasVencidas() {

        httpClient.get(`/parcelas/parcelasVencidas/`)
        .then(r => {
            return r.json();
        })
        .then(r => {
            setListaParcelasVencidas(r);
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

    function haParcelasVencidas(idObra) {

        let achouParcelasVencidas = listaParcelasVencidas.find((parcela) => parcela.idObra === idObra);
        return achouParcelasVencidas;
    }

    function parcelaEstaVencida(numParcela) {

        let parcelaVencida = listaParcelasVencidas.find((parcela) => parcela.numParcela === numParcela);
        return parcelaVencida;
    }

    useEffect(() => {
        carregarAcompParcelas();
        carregarObras();
        procurarParcelasVencidas();
    }, [])

    return (

        <div>
            <h1 style={{marginBottom: 50}}>Recebimentos</h1>

            <div>
                {
                    listaObras.map((obra, index) => (

                        <div key={obra.idObra} style={{ marginBottom: 20 }}>
                            <details style={{ border: '1px solid #ccc', borderRadius: 5, padding: 10 }}>
                                
                                <summary style={{ cursor: 'pointer', fontWeight: 'bold' }}>
                                    <a href={`/recebimentos/gravar/${obra.idObra}`}>
                                        <button style={{marginLeft: 20, marginRight: 20}} className="btn btn-primary">Gerenciar</button>
                                    </a>
                                    Obra: {encontrarBairro(Number(obra.idObra))}
                                    {
                                        haParcelasVencidas(obra.idObra) ? 
                                        <div style={{color: 'red', textAlign: 'center'}}>
                                            Há parcela(s) vencida(s) que não foram pagas para esta obra 
                                        </div>
                                        :
                                        <></>
                                    }
                                </summary>
                                

                                {
                                    listaAcompParcelas[obra.idObra] ?
                                    <table className="table table-hover" style={{textAlign: 'center', marginTop: 20}}>
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
                                                listaAcompParcelas[obra.idObra].map((parcela, index) => {

                                                    return (
                                                        <tr key={index}>
                                                            <td>{index + 1}</td>
                                                            <td>{parcelaEstaVencida(parcela.numParcela) ?
                                                                <div style={{color: 'red', fontWeight: 'bold', textDecoration: 'underline'}}>
                                                                    {formatarData(parcela.dataVencimento)}</div>
                                                                :
                                                                <div>{formatarData(parcela.dataVencimento)}</div>}</td>
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
                                    : 
                                    <div style={{textAlign: 'center'}}><b>Não há parcelas para essa obra</b></div>
                                }
                            </details>
                        </div>
                    ))
                }
            </div>
        </div>
    )
}