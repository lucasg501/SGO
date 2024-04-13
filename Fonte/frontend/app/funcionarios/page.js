'use client'

import { useEffect, useState } from "react"
import httpClient from "../utils/httpClient";

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
            <a href="/clientes/criar"><button className="btn btn-primary">Cadastrar</button></a>

            <div style={{marginTop: 30}} className="table-responsive">
                <table className="table table-hover">
                    <thead>
                        <tr>
                            <th>Nome</th>
                            <th>Telefone</th>
                            <th>Cargo</th>
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