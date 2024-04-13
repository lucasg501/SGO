'use client'

import { useEffect, useState } from "react"
import httpClient from "../utils/httpClient";
import Link from "next/link";

export default function parceiros() {

    const [listaParceiros, setListaParceiros] = useState([]);

    function carregarParceiros() {

        httpClient.get('/parceiros/listar')
        .then(r => {
            return r.json();
        })
        .then(r => {
            setListaParceiros(r);
        });
    }

    useEffect(() => {
        carregarParceiros();
    })

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
                            <th>Cargo</th>
                            <th>Salario</th>
                            <th>Area de Atuação</th>
                            <th>Ações</th>
                        </tr>
                    </thead>

                    <tbody>
                        {
                            listaParceiros.map((parceiro, index) => {
                                return (
                                    <tr key={index}>
                                        <td>{parceiro.nomeParceiro}</td>
                                        <td>{parceiro.telParceiro}</td>
                                        <td>{parceiro.cargoParceiro}</td>
                                        <td>{parceiro.salarioParceiro}</td>
                                        <td>{parceiro.idAreaAtuacao}</td>

                                        <td>
                                            <Link className="btn btn-primary" href={`/parceiros/alterar/${parceiro.idParceiro}`}>
                                                <i className="fas fa-pen"></i>
                                            </Link>
                                            <button style={{marginLeft: 15}} className="btn btn-danger" onClick={() => {
                                                if (confirm(`Deseja excluir o parceiro ${parceiro.nomeParceiro}?`)) {

                                                    httpClient.delete(`/parceiros/excluir/${parceiro.idParceiro}`)
                                                    .then(r => {
                                                        alert('Parceiro excluído com sucesso!');
                                                        carregarParceiros();
                                                    });
                                                }
                                                }}>
                                                <i className="fas fa-trash"></i>
                                            </button>
                                        </td>
                                    </tr>
                                )
                            })
                        }
                    </tbody>
                </table>
            </div>
        </div>
    )
}