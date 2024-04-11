'use client'

import { useEffect, useState } from "react"
import httpClient from "../utils/httpClient";
import Link from "next/link";

export default function clientes({children}){

    const [listaClientes, setListaClientes] = useState([]);

    function carregarClientes(){
        httpClient.get('/clientes/listar')
        .then(r=>{
            return r.json();
        })    
        .then(r=>{
            setListaClientes(r);
        })
    }

    useEffect(()=>{
        carregarClientes();
    },[])

    return(
        <div>
            <h1>Clientes</h1>
            <a href="/clientes/criar"><button className="btn btn-primary">Cadastrar</button></a>

            <div style={{marginTop: 30}} className="table-responsive">
                <table className="table table-hover">
                    <thead>
                        <tr>
                            <th>Nome</th>
                            <th>Telefone</th>
                            <th>Email</th>
                            <th>RG</th>
                            <th>CPF</th>
                            <th>Endereço</th>
                            <th>Ações</th>
                        </tr>
                    </thead>

                    <tbody>
                        {
                            listaClientes.map(function(value,index){
                                return(
                                    <tr key={index}>
                                        <td>{value.nomeCli}</td>
                                        <td>{value.telCli}</td>
                                        <td>{value.emailCli}</td>
                                        <td>{value.rgCli}</td>
                                        <td>{value.cpfCli}</td>
                                        <td>{value.enderecoCli}</td>
                                        <td>
                                            <Link className="btn btn-primary" href={`/clientes/alterar/${value.idCli}`}><i className="fas fa-pen"></i></Link>
                                            <button style={{marginLeft: 15}} className="btn btn-danger" onClick={()=>{
                                                if(confirm(`Deseja excluir o cliente ${value.nomeCli}?`)){
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