'use client'
import { useEffect, useState } from "react"
import httpClient from "../utils/httpClient";

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
                    if(parcelasPorObra[parcela.idObra]){
                        parcelasPorObra[parcela.idObra].push(parcela);
                    } else {
                        parcelasPorObra[parcela.idObra] = [parcela];
                    }
                });

                // Atualize as informações das obras
                setListaAcompParcelas(parcelasPorObra);
            });
    }

    function carregarObras(){
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
                        
                        <div key={idObra}>
                            <h2>Obra: {encontrarBairro(Number(idObra))}</h2>

                            <table className="table table-hover">
                                <thead>
                                    <tr>
                                        <th>Parcela</th>
                                        <th>Data de Vencimento</th>
                                        <th>Data de Recebimento</th>
                                        <th>Valor</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {
                                        listaAcompParcelas[idObra].map((parcela, index) => {
                                            <tr key={index}>
                                                <td>{index + 1}</td>
                                                <td>{formatarData(parcela.dataVencimento)}</td>
                                                <td>{formatarData(parcela.dataRecebimento)}</td>
                                                <td>{formatarValor(parcela.valorParcela)}</td>
                                            </tr>
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