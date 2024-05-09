'use client'
import { useEffect, useRef, useState } from "react"
import httpClient from "../utils/httpClient";
import Link from "next/link";

export default function Obras() {

    const [listaObras, setListaObras] = useState([]);
    const [listaClientes, setListaClientes] = useState([]);
    const [busca, setBusca] = useState("");
    const [listaBusca, setListaBusca] = useState([]);
    const termoBusca = useRef("");

    function carregarObras() {
        httpClient.get('/obras/listar')
            .then(r => {
                return r.json();
            })
            .then(r => {
                setListaObras(r);
            })
    }

    function excluirObra(idObra) {
        const confirmacao = window.confirm("Tem certeza que deseja excluir esta obra?");
        if (confirmacao) {
            httpClient.delete(`/obras/excluir/${idObra}`)
                .then(r => {
                    return r.json();
                })
                .then(r => {
                    alert(r.msg);
                    carregarObras();
                })
        }
    }

    function listarClientes() {
        httpClient.get('/clientes/listar')
            .then(r => {
                return r.json();
            })
            .then(r => {
                setListaClientes(r);
            })
    }

    function filtrarBusca() {

        setBusca(termoBusca.current.value.toLowerCase());

        if (busca != "" && listaObras) {

            setListaBusca(listaObras.filter((obra) => 
                obra.bairro.toLowerCase().includes(busca)
            ));
        }
    }

    useEffect(() => {
        carregarObras();
        listarClientes();
    }, []);

    function formatarData(data) {
        const dataObj = new Date(data);
        return dataObj.toLocaleDateString('pt-BR');
    }

    return (
        <div>
            <h1>Obras</h1>

            <div className="card shadow">
                <div className="card-header">
                    <Link href="/obras/gravar"><button className="btn btn-primary">Cadastrar</button></Link>
                </div>

                <div className="card-body">
                    <div className="form-group">
                        <label>Buscar</label>
                        <input type="text" ref={termoBusca} placeholder="Digite o bairro da obra..." className="form-control"
                        onChange={(e) => filtrarBusca()} />
                    </div>

                    <div className="table-responsive">
                        <table className="table table-hover">
                            <thead>
                                <tr>
                                    <th>Nº</th>
                                    <th>Endereço</th>
                                    <th>Bairro</th>
                                    <th>Cidade</th>
                                    <th>CEP</th>
                                    <th>Valor Total</th>
                                    <th>Data Inicio</th>
                                    <th>Data Prevista de Término</th>
                                    <th>Contrato</th>
                                    <th>Planta</th>
                                    <th>Cliente</th>
                                    <th>Editar</th>
                                    <th>Excluir</th>
                                    <th>Alocar</th>
                                </tr>
                            </thead>

                            <tbody>
                                {
                                    busca != "" && listaBusca ?
                                        listaBusca.length > 0 ?
                                        listaBusca.map(function (value, index) {
                                            const cliente = listaClientes.find(cliente => cliente.idCli === value.idCliente);
                                            const nomeCliente = cliente ? cliente.nomeCli : "Cliente desconhecido";
                
                                            return (
                                                <tr key={index}>
                                                    <td>{value.idObra}</td>
                                                    <td>{value.endereco}</td>
                                                    <td>{value.bairro}</td>
                                                    <td>{value.cidade}</td>
                                                    <td>{value.cepObra}</td>
                                                    <td>{parseFloat(value.valorTotal).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                                                    <td>{formatarData(value.dataInicio)}</td>
                                                    <td>{formatarData(value.dataTermino)}</td>
                                                    <td>
                                                        {value.contrato ? (
                                                            <a href={value.contrato} download>{value.contrato}</a>
                                                        ) : (
                                                            "Não possui"
                                                        )}
                                                    </td>
                                                    <td>
                                                        {value.planta ? (
                                                            <a href={value.planta} download>{value.planta}</a>
                                                        ) : (
                                                            "Não possui"
                                                        )}
                                                    </td>
                                                    <td>{nomeCliente}</td>
                                                    <td>
                                                        <Link className="btn btn-primary" href={`/obras/alterar/${value.idObra}`}>
                                                            <i className="fas fa-pen"></i>
                                                        </Link>
                                                    </td>
                
                                                    <td>
                                                        <button style={{ marginLeft: 10, marginRight: 10 }} onClick={() => excluirObra(value.idObra)} className="btn btn-danger"><i className="fas fa-trash"></i></button>
                                                    </td>
                
                                                    <td>
                                                        <Link href={`/obras/servicos/${value.idObra}`}><button className="btn btn-success"><i className="fas fa-users"></i></button></Link>
                                                    </td>
                                                </tr>
                                            )}
                                        )
                                        :
                                        <div style={{margin: 20}}>Obras não encontradas.</div>
                                    :
                                    listaObras.map(function (value, index) {
                                    const cliente = listaClientes.find(cliente => cliente.idCli === value.idCliente);
                                    const nomeCliente = cliente ? cliente.nomeCli : "Cliente desconhecido";

                                    return (
                                        <tr key={index}>
                                            <td>{value.idObra}</td>
                                            <td>{value.endereco}</td>
                                            <td>{value.bairro}</td>
                                            <td>{value.cidade}</td>
                                            <td>{value.cepObra}</td>
                                            <td>{parseFloat(value.valorTotal).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                                            <td>{formatarData(value.dataInicio)}</td>
                                            <td>{formatarData(value.dataTermino)}</td>
                                            <td>
                                                {value.contrato ? (
                                                    <a href={value.contrato} download>{value.contrato}</a>
                                                ) : (
                                                    "Não possui"
                                                )}
                                            </td>
                                            <td>
                                                {value.planta ? (
                                                    <a href={value.planta} download>{value.planta}</a>
                                                ) : (
                                                    "Não possui"
                                                )}
                                            </td>
                                            <td>{nomeCliente}</td>
                                            <td>
                                                <Link className="btn btn-primary" href={`/obras/alterar/${value.idObra}`}>
                                                    <i className="fas fa-pen"></i>
                                                </Link>
                                            </td>

                                            <td>
                                                <button style={{ marginLeft: 10, marginRight: 10 }} onClick={() => excluirObra(value.idObra)} className="btn btn-danger"><i className="fas fa-trash"></i></button>
                                            </td>

                                            <td>
                                                <Link href={`/obras/servicos/${value.idObra}`}><button className="btn btn-success"><i className="fas fa-users"></i></button></Link>
                                            </td>
                                        </tr>
                                    )})
                                }
                            </tbody>

                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}
