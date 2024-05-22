'use client'
import { useEffect, useRef, useState } from "react"
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
    const termoBusca = useRef("");
    const filtroObras = useRef("");

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
                setCarregando(false);
            });
    }

    function encontrarBairro(idObra) {
        const obra = listaObras.find(obra => obra.idObra === idObra);
        return obra ? obra.bairro : "Bairro desconhecido";
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
        });
    }

    function carregarObras() {
        httpClient.get('/obras/listar')
            .then(r => r.json())
            .then(r => {
                let lista = [];

                r.map((obra) => {

                    if (termoBusca.current.value == "" ||
                     (termoBusca.current && obra.bairro.toLowerCase().includes(termoBusca.current.value.toLowerCase()))) {

                        if (filtroObras.current.value == "MOSTRAR TODAS") {
                            lista.push(obra);
                        }
                        
                        if (filtroObras.current.value == "MOSTRAR SOMENTE OBRAS NÃO FINALIZADAS" && obra.terminada == 'N') {
                            lista.push(obra);
                        }

                        if (filtroObras.current.value == "MOSTRAR SOMENTE OBRAS FINALIZADAS" && obra.terminada == 'S') {
                            lista.push(obra);
                        }
                    }
                });

                setListaObras(lista);
            });
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
                <div className="card" style={{padding: 20}}>
                    <div className="card-header" style={{marginBottom: 20}}>
                        <div className="form-group">
                            <label style={{fontWeight: 'bold'}}>Buscar</label>
                            <input type="text" ref={termoBusca} placeholder="Digite o bairro da obra..." className="form-control"
                            onChange={carregarObras} />
                        </div>
                        <div className="form-group">
                            <label style={{fontWeight: 'bold'}}>Filtro de Obras</label>
                            <select ref={filtroObras} className="form-select"
                            onChange={carregarObras} style={{width: 500}}>
                                <option value={"MOSTRAR TODAS"}>MOSTRAR TODAS</option>
                                <option value={"MOSTRAR SOMENTE OBRAS NÃO FINALIZADAS"}>MOSTRAR SOMENTE OBRAS NÃO FINALIZADAS</option>
                                <option value={"MOSTRAR SOMENTE OBRAS FINALIZADAS"}>MOSTRAR SOMENTE OBRAS FINALIZADAS</option>
                            </select>
                        </div>
                    </div>
                    <div className="card-body">
                    {
                        listaObras.map((obra, index) => (

                            <div key={obra.idObra} style={{ marginBottom: 20 }}>
                                <details style={{ border: '1px solid #ccc', borderRadius: 5, padding: 10 }}>
                                    
                                    <summary style={{ cursor: 'pointer' }}>
                                        <div style={{display: 'inline-flex', alignItems: 'center'}}>
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
                                            <div>
                                                <span><b>Obra:</b> {obra.bairro}</span><br/>
                                                <span><b>Endereço:</b> {obra.endereco}</span><br/>
                                                {
                                                    obra.terminada == 'S' ?
                                                    <span className="text-primary"><b>Terminada:</b> Sim</span>
                                                    :
                                                    <span><b>Terminada:</b> Não</span>
                                                }
                                            </div>
                                        </div>
                                        {
                                            haParcelasVencidas(obra.idObra) ? 
                                            <div style={{color: 'red', textAlign: 'center', fontWeight: 'bold'}}>
                                                <hr/>
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
                </div>
            }
        </div>
    )
}