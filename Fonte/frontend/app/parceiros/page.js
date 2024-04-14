'use client'
import { useEffect, useState } from "react";
import httpClient from "../utils/httpClient";
import Link from "next/link";

export default function Parceiros() {
    const [listaParceiros, setListaParceiros] = useState([]);
    const [listaAtuacao, setListaAtuacao] = useState([]);

    function carregarParceiros() {
        httpClient.get('/parceiros/listar')
            .then(r => r.json())
            .then(r => setListaParceiros(r));
    }

    function carregarAreaAtuacao() {
        httpClient.get('/areaAtuacao/listar')
            .then(r => r.json())
            .then(r => setListaAtuacao(r))
            .catch(error => console.error('Erro ao carregar áreas de atuação:', error));
    }

    useEffect(() => {
        carregarParceiros();
        carregarAreaAtuacao();
    }, []);

    function getNomeAreaAtuacao(idAreaAtuacao) {
        for (let i = 0; i < listaAtuacao.length; i++) {
            if (listaAtuacao[i].idArea === idAreaAtuacao) {
                return listaAtuacao[i].nomeAtuacao;
            }
        }
        return 'Área de Atuação Desconhecida';
    }

    return (
        <div>
            <h1>Parceiros</h1>
            <a href="/parceiros/criar"><button className="btn btn-primary">Cadastrar</button></a>

            <div style={{marginTop: 30}} className="table-responsive">
                <table className="table table-hover">
                    <thead>
                        <tr>
                            <th>Nome</th>
                            <th>Telefone</th>
                            <th>Área de Atuação</th>
                            <th>Ações</th>
                        </tr>
                    </thead>

                    <tbody>
                        {listaParceiros.map((parceiro, index) => (
                            <tr key={index}>
                                <td>{parceiro.nomeParceiro}</td>
                                <td>{parceiro.telParceiro}</td>
                                <td>{getNomeAreaAtuacao(parceiro.idAreaAtuacao)}</td>
                                <td>
                                    <Link className="btn btn-primary" href={`/parceiros/alterar/${parceiro.idParceiro}`}>
                                        <i className="fas fa-pen"></i>
                                    </Link>
                                    <button
                                        style={{marginLeft: 15}}
                                        className="btn btn-danger"
                                        onClick={() => {
                                            if (confirm(`Deseja excluir o parceiro ${parceiro.nomeParceiro}?`)) {
                                                httpClient.delete(`/parceiros/excluir/${parceiro.idParceiro}`)
                                                    .then(() => {
                                                        alert('Parceiro excluído com sucesso!');
                                                        carregarParceiros();
                                                    });
                                            }
                                        }}
                                    >
                                        <i className="fas fa-trash"></i>
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
