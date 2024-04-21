'use client'

import { useEffect, useRef, useState } from "react"
import httpClient from "../utils/httpClient";
import Link from "next/link";

export default function clientes({children}){

    const [listaClientes, setListaClientes] = useState([]);
    const [busca, setBusca] = useState("");
    const [listaBusca, setListaBusca] = useState([]);
    const termoBusca = useRef("");

    function carregarClientes(){
        httpClient.get('/clientes/listar')
        .then(r=>{
            return r.json();
        })    
        .then(r=>{
            setListaClientes(r);
        })
    }

    function filtrarBusca() {

        setBusca(termoBusca.current.value.toLowerCase());

        if (busca != "" && listaClientes) {

            setListaBusca(listaClientes.filter((cliente) => 
                cliente.nomeCli.toLowerCase().includes(busca)
            ));
        }
    }

    useEffect(()=>{
        carregarClientes();
    },[])

    return (
        <div>
            <h1>Clientes</h1>

            <div className="form-group">
                <label>Buscar</label>
                <input type="text" ref={termoBusca} placeholder="Digite o nome do cliente..." className="form-control"
                onChange={(e) => filtrarBusca()} />
            </div>

            <a href="/clientes/criar"><button className="btn btn-primary">Cadastrar</button></a>
    
            <div style={{marginTop: 30, overflowX: 'auto'}} className="table-responsive">
                <table className="table table-hover">
                    <thead>
                        <tr>
                            <th>Nome</th>
                            <th>Telefone</th>
                            <th>Email</th>
                            <th>RG</th>
                            <th>CPF</th>
                            <th>Endereço</th>
                            <th>Bairro</th>
                            <th>Cidade</th>
                            <th>CEP</th>
                            <th>Editar</th>
                            <th>Excluir</th>
                        </tr>
                    </thead>
    
                    <tbody>
                        {
                            busca != "" && listaBusca ?
                                listaBusca.length > 0 ?
                                listaBusca.map(function(value,index){
                                    return(
                                        <tr key={index}>
                                            <td>{value.nomeCli}</td>
                                            <td>{value.telCli}</td>
                                            <td>{value.emailCli}</td>
                                            <td>{value.rgCli}</td>
                                            <td>{value.cpfCli}</td>
                                            <td>{value.enderecoCli}</td>
                                            <td>{value.bairroCli}</td>
                                            <td>{value.cidadeCli}</td>
                                            <td>{value.cepCli}</td>
                                            <td>
                                                <Link className="btn btn-primary" href={`/clientes/alterar/${value.idCli}`}><i className="fas fa-pen"></i></Link>
                                            </td>
                                            <td>
                                            <button style={{marginLeft: 15}} className="btn btn-danger" onClick={()=>{
                                                    if(confirm(`Deseja excluir o cliente ${value.nomeCli} e todos os seus dados relacionados: "Serviços, Parcelas e Obras"?`)){
                                                        httpClient.delete(`/clientes/excluir/${value.idCli}`)
                                                        .then(r=>{
                                                            alert('Cliente excluído com sucesso!');
                                                            carregarClientes();
                                                        })
                                                    }
                                                }}><i className="fas fa-trash"></i></button>
                                            </td>
                                        </tr>
                                    )
                                })
                                :
                                <div style={{margin: 20}}>Clientes não encontrados.</div>
                            :
                            listaClientes.map(function(value,index){
                                return(
                                    <tr key={index}>
                                        <td>{value.nomeCli}</td>
                                        <td>{value.telCli}</td>
                                        <td>{value.emailCli}</td>
                                        <td>{value.rgCli}</td>
                                        <td>{value.cpfCli}</td>
                                        <td>{value.enderecoCli}</td>
                                        <td>{value.bairroCli}</td>
                                        <td>{value.cidadeCli}</td>
                                        <td>{value.cepCli}</td>
                                        <td>
                                            <Link className="btn btn-primary" href={`/clientes/alterar/${value.idCli}`}><i className="fas fa-pen"></i></Link>
                                        </td>
                                        <td>
                                        <button style={{marginLeft: 15}} className="btn btn-danger" onClick={()=>{
                                                if(confirm(`Deseja excluir o cliente ${value.nomeCli} e todos os seus dados relacionados: "Serviços, Parcelas e Obras"?`)){
                                                    httpClient.delete(`/clientes/excluir/${value.idCli}`)
                                                    .then(r=>{
                                                        alert('Cliente excluído com sucesso!');
                                                        carregarClientes();
                                                    })
                                                }
                                            }}><i className="fas fa-trash"></i></button>
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