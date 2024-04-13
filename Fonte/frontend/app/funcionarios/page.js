'use client'

import { useEffect, useState } from "react"
import httpClient from "../utils/httpClient";
import Link from "next/link";

export default function funcionarios() {

    const [listaFuncionarios, setListaFuncionarios] = useState([]);

    function carregarFuncionarios() {

        httpClient.get('/funcionarios/listar')
        .then(r => {
            return r.json();
        })
        .then(r => {
            setListaFuncionarios(r);
        });
    }

    useEffect(() => {
        carregarFuncionarios();
    })

    return (
        <div>
            <h1>Funcionários</h1>
            <a href="/funcionarios/criar"><button className="btn btn-primary">Cadastrar</button></a>

            <div style={{marginTop: 30}} className="table-responsive">
                <table className="table table-hover">
                    <thead>
                        <tr>
                            <th>Nome</th>
                            <th>Telefone</th>
                            <th>Cargo</th>
                            <th>Ações</th>
                        </tr>
                    </thead>

                    <tbody>
                        {
                            listaFuncionarios.map((funcionario, index) => {
                                return (
                                    <tr key={index}>
                                        <td>{funcionario.nomeFuncionario}</td>
                                        <td>{funcionario.telFuncionario}</td>
                                        <td>{funcionario.cargoFuncionario}</td>

                                        <td>
                                            <Link className="btn btn-primary" href={`/funcionarios/alterar/${funcionario.idFuncionario}`}>
                                                <i className="fas fa-pen"></i>
                                            </Link>
                                            <button style={{marginLeft: 15}} className="btn btn-danger" onClick={() => {
                                                if (confirm(`Deseja excluir o funcionário ${funcionario.nomeFuncionario}?`)) {

                                                    httpClient.delete(`/funcionarios/excluir/${funcionario.idFuncionario}`)
                                                    .then(r => {
                                                        alert('Funcionário excluído com sucesso!');
                                                        carregarFuncionarios();
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