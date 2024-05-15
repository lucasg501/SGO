'use client'
import { useEffect, useState } from "react"
import httpClient from "../utils/httpClient";
import Link from "next/link";
import Carregando from "../components/carregando";
import { jsPDF } from "jspdf";
import "jspdf-autotable";

export default function Recebimentos() {

    const [listaAcompParcelas, setListaAcompParcelas] = useState([]);
    const [listaObras, setListaObras] = useState([]);
    const [listaParcelasVencidas, setListaParcelasVencidas] = useState([]);
    const [carregando, setCarregando] = useState(true);

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

    function gerarPDF(idObra) {
        if (!listaAcompParcelas[idObra] || listaAcompParcelas[idObra].length === 0) {
            alert("Não há informações para gerar o PDF.");
            return;
        }
    
        const doc = new jsPDF();
    
        // Título do PDF
        doc.text("Detalhes das Parcelas", 10, 10);
    
        // Nome da obra (bairro)
        const bairroObra = encontrarBairro(idObra);
        doc.text(`Obra: ${bairroObra}`, 10, 20);
    
        // Cabeçalho da tabela
        const headers = ["Parcela", "Data de Vencimento", "Data de Recebimento", "Valor"];
        const data = listaAcompParcelas[idObra].map((parcela, index) => [
            index + 1,
            formatarData(parcela.dataVencimento),
            parcela.dataRecebimento ? formatarData(parcela.dataRecebimento) : "Não foi recebida",
            `R$ ${parseFloat(parcela.valorParcela).toFixed(2)}`
        ]);
    
        // Adiciona a tabela ao PDF
        doc.autoTable({
            head: [headers],
            body: data,
            startY: 30
        });
    
        // Salva o PDF
        doc.save(`detalhes_parcelas_${bairroObra}.pdf`);
    }
    

    function procurarParcelasVencidas() {

        httpClient.get(`/parcelas/parcelasVencidas/`)
        .then(r => {
            return r.json();
        })
        .then(r => {
            setListaParcelasVencidas(r);
            setCarregando(false);
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

    function cancelarRecebimento(numParcela) {

        if (confirm("Tem certeza que deseja cancelar este recebimento?")) {

            httpClient.put(`/parcelas/cancelarRecebimento/${numParcela}`)
            .then(r => {
                return r.json();
            })
            .then(r => {
                alert(r.msg);

                carregarAcompParcelas();
            });
        }
    }

    useEffect(() => {
        carregarAcompParcelas();
        carregarObras();
        procurarParcelasVencidas();
    }, [])

    return (

        <div>
            <h1 style={{marginBottom: 50}}>Recebimentos</h1>

            {
                carregando ?
                <Carregando />
                :
                <div>
                    {
                        listaObras.map((obra, index) => (

                            <div key={obra.idObra} style={{ marginBottom: 20 }}>
                                <details style={{ border: '1px solid #ccc', borderRadius: 5, padding: 10 }}>
                                    
                                    <summary style={{ cursor: 'pointer', fontWeight: 'bold' }}>
                                        <a href={`/recebimentos/gravar/${obra.idObra}`}>
                                            <button style={{marginLeft: 20, marginRight: 20}} className="btn btn-primary">Gerenciar</button>
                                        </a>
                                        <button
                                        style={{ marginLeft: 20, marginRight: 20 }}
                                        className="btn btn-primary"
                                        onClick={() => gerarPDF(obra.idObra)}
                                    >
                                        Gerar PDF
                                    </button>
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
                                                    <th>Cancelar Recebimento</th>
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
                                                                <td>R$ {parseFloat(parcela.valorParcela).toFixed(2)}</td>
                                                                <td>
                                                                    {
                                                                        parcela.dataRecebimento ?
                                                                        <button style={{ margin: 'auto' }} className="btn btn-success" disabled><i className="fas fa-check"></i></button>
                                                                        :
                                                                        <Link style={{ margin: 'auto' }} className="btn btn-success" href={`/recebimentos/alterar/${parcela.numParcela}`}><i className="fas fa-check"></i></Link>
                                                                    }
                                                                </td>
                                                                <td>
                                                                    {
                                                                        parcela.dataRecebimento ?
                                                                        <button style={{ margin: 'auto' }} className="btn btn-danger" onClick={() => {cancelarRecebimento(parcela.numParcela)}}><i className="fas fa-ban"></i></button>
                                                                        :
                                                                        <button style={{ margin: 'auto' }} className="btn btn-danger" disabled><i className="fas fa-ban"></i></button>
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
            }
        </div>
    )
}