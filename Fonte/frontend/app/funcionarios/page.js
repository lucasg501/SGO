'use client'

import { useEffect, useRef, useState } from "react"
import httpClient from "../utils/httpClient";
import Link from "next/link";
import Carregando from "../components/carregando";

export default function funcionarios() {

    const [listaFuncionarios, setListaFuncionarios] = useState([]);
    const [listaCargos, setListaCargos] = useState([]);
    const [busca, setBusca] = useState("");
    const [listaBusca, setListaBusca] = useState([]);
    const termoBusca = useRef("");
    const [carregando, setCarregando] = useState(true);

    function carregarFuncionarios() {

        httpClient.get('/funcionarios/listar')
        .then(r => {
            return r.json();
        })
        .then(r => {
            setListaFuncionarios(r);
            setCarregando(false);
        });
    }

    function carregarCargos() {

        httpClient.get('/cargos/listar')
        .then(r => {
            return r.json();
        })
        .then(r => {
            setListaCargos(r);
        });
    }

    function filtrarBusca() {

        setBusca(termoBusca.current.value.toLowerCase());

        if (busca != "" && listaFuncionarios) {

            setListaBusca(listaFuncionarios.filter((funcionario) => 
                funcionario.nomeFuncionario.toLowerCase().includes(busca)
            ));
        }
    }

    function encontrarCargo(idCargo) {

        const cargo = listaCargos.find(cargo => cargo.idCargo == idCargo);
        return cargo ? cargo.nomeCargo : "Desconhecido";
    }

    useEffect(() => {
        carregarFuncionarios();
        carregarCargos();
    })

    return (
        <div>
            <h1>Funcionários</h1>
            
            <div className="card shadow">
                <div className="card-header">
                    <Link href="/funcionarios/criar"><button className="btn btn-primary">Cadastrar</button></Link>
                </div>
                {
                    carregando ?
                    <Carregando />
                    :
                    <div className="card-body">
                        <div className="form-group">
                            <label>Buscar</label>
                            <input type="text" ref={termoBusca} placeholder="Digite o nome do funcionário..." className="form-control"
                            onChange={(e) => filtrarBusca()} />
                        </div>
                        <div style={{marginTop: 30}} className="table-responsive">
                            <table className="table table-hover" style={{textAlign: "center"}}>
                                <thead>
                                    <tr>
                                        <th>Nome</th>
                                        <th>Telefone</th>
                                        <th>Cargo</th>
                                        <th>Ações</th>
                                        <th>Gerenciar Diárias</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {
                                        busca != "" && listaBusca ?
                                            listaBusca.length > 0 ?
                                            listaBusca.map((funcionario, index) => {
                                                return (
                                                    <tr key={index}>
                                                        <td>{funcionario.nomeFuncionario}</td>
                                                        <td>{funcionario.telFuncionario}</td>
                                                        <td>{encontrarCargo(funcionario.cargoFuncionario)}</td>
                
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
                                            :
                                            <div style={{margin: 20}}>Funcionários não encontrados.</div>
                                        :
                                        listaFuncionarios.map((funcionario, index) => {
                                            return (
                                                <tr key={index}>
                                                    <td>{funcionario.nomeFuncionario}</td>
                                                    <td>{funcionario.telFuncionario}</td>
                                                    <td>{encontrarCargo(funcionario.cargoFuncionario)}</td>

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
                                                    <td>
                                                        <Link className="btn btn-success" href={`/funcionarios/diarias/${funcionario.idFuncionario}`}>
                                                            <i className="fas fa-dollar-sign"></i>
                                                        </Link>
                                                    </td>
                                                </tr>
                                            )
                                        })
                                    }
                                </tbody>
                            </table>
                        </div>
                    </div>
                }
            </div>
        </div>
    )
}