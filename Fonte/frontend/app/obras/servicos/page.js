'use client'
import React, { useEffect, useState } from "react";
import httpClient from "@/app/utils/httpClient";
import Link from "next/link";
import Carregando from "@/app/components/carregando";

export default function Servicos() {
    const [listaServicos, setListaServicos] = useState([]);
    const [listaParceiros, setListaParceiros] = useState([]);
    const [listaAtuacao, setListaAtuacao] = useState([]);
    const [listaObra, setListaObra] = useState([]);
    const [idParceiroFiltrado, setIdParceiroFiltrado] = useState(null);
    const [carregando, setCarregando] = useState(true);

    // Funções de carregamento de dados
    useEffect(() => {
        carregarDados();
    }, []);

    function carregarDados() {
        carregarServicos();
        carregarParceiros();
        carregarAtuacao();
        carregarObra();
    }

    function carregarServicos() {
        httpClient.get('/servicos/listar')
            .then(r => r.json())
            .then(r => setListaServicos(r))
            .catch(error => console.error("Erro ao carregar serviços:", error));
    }

    function carregarParceiros() {
        httpClient.get('/parceiros/listar')
            .then(r => r.json())
            .then(r => setListaParceiros(r))
            .catch(error => console.error("Erro ao carregar parceiros:", error));
    }

    function carregarAtuacao() {
        httpClient.get('/areaAtuacao/listar')
            .then(r => r.json())
            .then(r => setListaAtuacao(r))
            .catch(error => console.error("Erro ao carregar áreas de atuação:", error));
    }

    function carregarObra() {
        httpClient.get('/obras/listar')
            .then(r => r.json())
            .then(r => { setListaObra(r); setCarregando(false) })
            .catch(error => console.error("Erro ao carregar obras:", error));
    }

    // Funções de obtenção de dados
    function obterNomeParceiro(idParceiro) {
        const parceiro = listaParceiros.find(parceiro => parceiro.idParceiro === idParceiro);
        return parceiro ? parceiro.nomeParceiro : 'Parceiro não encontrado';
    }

    function obterAreaAtuacao(idParceiro) {
        console.log("ID do parceiro:", idParceiro);
        const parceiro = listaParceiros.find(parceiro => parceiro.idParceiro === idParceiro);
        console.log("Parceiro encontrado:", parceiro);
        const areaAtuacao = parceiro ? listaAtuacao.find(atuacao => atuacao.idArea === parceiro.idAreaAtuacao) : null;
        console.log("Área de atuação encontrada:", areaAtuacao);
        return areaAtuacao ? areaAtuacao.nomeAtuacao : 'Área de atuação não encontrada';
    }
    
    
    function obterBairroObra(idObra) {
        const obra = listaObra.find(obra => obra.idObra === idObra);
        return obra ? obra.bairro : 'Bairro não encontrado';
    }

    // Funções de manipulação de estado
    function filtrarServicosPorParceiro(idParceiro) {
        setIdParceiroFiltrado(idParceiro);
    }

    return (
        <div>
            <h1>Serviços</h1>
            <div className="card">
                <div className="card-header">
                    <select style={{ width: 200 }} className="form-select" onChange={(e) => filtrarServicosPorParceiro(e.target.value)}>
                        <option value="">Mostrar Todos</option>
                        {listaParceiros.map(parceiro => (
                            <option key={parceiro.idParceiro} value={parceiro.idParceiro}>
                                {parceiro.nomeParceiro}
                            </option>
                        ))}
                    </select>
                </div>

                {
                    carregando ?
                    <Carregando />
                    :
                    <div className="card-body">
                        <table className="table table-hover">
                            <thead>
                                <tr>
                                    <th>Parceiro</th>
                                    <th>Descrição</th>
                                    <th>Valor</th>
                                    <th>Obra</th>
                                    <th>Área de Atuação</th>
                                    <th>Data</th>
                                    <th>Alterar</th>
                                    <th>Excluir</th>
                                </tr>
                            </thead>
                            <tbody>
                                {listaServicos
                                    .filter(servico => !idParceiroFiltrado || servico.idParceiro === parseInt(idParceiroFiltrado))
                                    .map((value, index) => (
                                        <tr key={index}>
                                            <td>{obterNomeParceiro(value.idParceiro)}</td>
                                            <td>{value.descServico}</td>
                                            <td>R$ {value.valorServico.toFixed(2)}</td>
                                            <td>{obterBairroObra(value.idObra)}</td>
                                            <td>{obterAreaAtuacao(value.idParceiro)}</td>
                                            <td>{value.dataServ == null ? 'N/A' : new Date(value.dataServ).toLocaleDateString()}</td>
                                            <td>
                                                <Link className="btn btn-primary" href={`servicos/alterar/${value.idServico}`}>< i className="fas fa-pen"></i></Link>
                                            </td>
                                            <td>
                                                <button className="btn btn-danger" onClick={() => {
                                                    if (confirm('Deseja excluir o serviço e todos os dados relacionados a ele?')) {
                                                        httpClient.delete(`/servicos/excluir/${value.idServico}`)
                                                            .then(r => {
                                                                alert('Serviço excluído com sucesso!');
                                                                carregarDados();
                                                            })
                                                            .catch(error => console.error("Erro ao excluir serviço:", error));
                                                    }
                                                }}>
                                                    <i className="fas fa-trash"></i>
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                            </tbody>
                        </table>
                    </div>
                }
            </div>
        </div>
    )
}
