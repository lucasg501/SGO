'use client'
import httpClient from "@/app/utils/httpClient";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Servicos(){

    const [listaServicos, setListaServicos] = useState([]);
    const [listaParceiros, setListaParceiros] = useState([]);
    const [listaObra, setListaObra] = useState([]);
    const [idParceiroFiltrado, setIdParceiroFiltrado] = useState(null);

    function carregarServicos(){
        httpClient.get('/servicos/listar')
        .then(r=>{
            return r.json();
        })
        .then(r=>{
            setListaServicos(r);
        })
    }

    function carregarParceiros(){
        httpClient.get('/parceiros/listar')
        .then(r=>{
            return r.json();
        })
        .then(r=>{
            setListaParceiros(r);
        })
    }

    function carregarObra(){
        httpClient.get('/obras/listar')
        .then(r=>{
            return r.json();
        })
        .then(r=>{
            setListaObra(r);
        })
    }

    useEffect(()=>{
        carregarServicos();
        carregarParceiros();
        carregarObra();
    },[]);

    // Função para obter o nome do parceiro pelo ID
    function obterNomeParceiro(idParceiro) {
        const parceiro = listaParceiros.find(parceiro => parceiro.idParceiro === idParceiro);
        return parceiro ? parceiro.nomeParceiro : 'Parceiro não encontrado';
    }

    // Função para obter o bairro da obra pelo ID
    function obterBairroObra(idObra) {
        const obra = listaObra.find(obra => obra.idObra === idObra);
        return obra ? obra.bairro : 'Bairro não encontrado';
    }

    // Função para filtrar os serviços pelo idParceiro
    function filtrarServicosPorParceiro(idParceiro) {
        setIdParceiroFiltrado(idParceiro);
    }

    return(
        <div>
            <h1>Serviços</h1>

            <div>
                <select style={{width: 200}} className="form-select" onChange={(e) => filtrarServicosPorParceiro(e.target.value)}>
                    <option value="">Mostrar Todos</option>
                    {
                        listaParceiros.map(parceiro => (
                            <option key={parceiro.idParceiro} value={parceiro.idParceiro}>
                                {parceiro.nomeParceiro}
                            </option>
                        ))
                    }
                </select>

                <table className="table table-hover">
                    <thead>
                        <tr>
                            <th>Nº</th>
                            <th>Descrição</th>
                            <th>Valor</th>
                            <th>Obra</th>
                            <th>Parceiro</th>
                            <th>Alterar</th>
                            <th>Excluir</th>
                        </tr>
                    </thead>

                    <tbody>
                        {
                            listaServicos
                                .filter(servico => !idParceiroFiltrado || servico.idParceiro === parseInt(idParceiroFiltrado))
                                .map((value, index) => (
                                    <tr key={index}>
                                        <td>{value.idServico}</td>
                                        <td>{value.descServico}</td>
                                        <td>{value.valorServico.toFixed(2)}</td>
                                        <td>{obterBairroObra(value.idObra)}</td>
                                        <td>{obterNomeParceiro(value.idParceiro)}</td>
                                        <td>
                                            <Link className="btn btn-primary" href={`servicos/alterar/${value.idServico}`}>< i className="fas fa-pen"></i></Link>
                                        </td>
                                        <td>
                                            <button className="btn btn-danger" onClick={() => {
                                                if(confirm('Deseja excluir o serviço e todos os dados relacionados a ele?')){
                                                    httpClient.delete(`/servicos/excluir/${value.idServico}`)
                                                    .then(r=>{
                                                        alert('Serviço excluido com sucesso!');
                                                        carregarServicos();
                                                    })
                                                }
                                            }}>
                                                <i className="fas fa-trash"></i>
                                            </button>
                                        </td>
                                    </tr>
                                ))
                        }
                    </tbody>
                </table>
            </div>
        </div>
    )
}
