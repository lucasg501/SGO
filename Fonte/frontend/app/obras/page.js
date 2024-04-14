'use client'
import { useEffect, useState } from "react"
import httpClient from "../utils/httpClient";
import Link from "next/link";

export default function Obras(){

    const [listaObras, setListaObras] = useState([]);
    const [listaClientes, setListaClientes] = useState([]);

    function carregarObras(){
        httpClient.get('/obras/listar')
        .then(r=>{
            return r.json();
        })
        .then(r=>{
            setListaObras(r);
        })
    }

    function excluirObra(idObra){
        httpClient.delete(`/obras/excluir/${idObra}`)
        .then(r=>{
            return r.json();
        })
        .then(r=>{
            alert(r.msg);
            carregarObras();
        })
    }

    function carregarCliente(){
        httpClient.get('/clientes/listar')
        .then(r=>{
            return r.json();
        })
        .then(r=>{
            setListaClientes(r);
        })
    }

    useEffect(() =>{
        carregarObras();
        carregarCliente();
    },[]);

    function formatarData(data) {
        const dataObj = new Date(data);
        return dataObj.toLocaleDateString('pt-BR');
    }

    return(
        <div>
            <h1>Obras</h1>

            <div>
                <a href="/obras/gravar"><button className="btn btn-primary">Cadastrar</button></a>
            </div>

            <div className="table-responsive">
                <table className="table table-hover">
                    <thead>
                        <tr>
                            <th>Nº</th>
                            <th>Endereço</th>
                            <th>Bairro</th>
                            <th>Cidade</th>
                            <th>Valor Total</th>
                            <th>Data Inicio</th>
                            <th>Data Prevista de Término</th>
                            <th>Contrato</th>
                            <th>Planta</th>
                            <th>Cliente</th>
                            <th>Ações</th>
                        </tr>
                    </thead>

                    <tbody>
                        {
                            listaObras.map(function(value, index){
                                return(
                                    <tr key={index}>
                                        <td>{value.idObra}</td>
                                        <td>{value.endereco}</td>
                                        <td>{value.bairro}</td>
                                        <td>{value.cidade}</td>
                                        <td>{parseFloat(value.valorTotal).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                                        <td>{formatarData(value.dataInicio)}</td>
                                        <td>{formatarData(value.dataTermino)}</td>
                                        <td>{value.contrato ? value.contrato : "Não possui"}</td>
                                        <td>{value.planta ? value.planta : "Não possui"}</td>
                                        <td>{value.idCli}</td>
                                        <td>
                                            <Link className="btn btn-primary" href={`/obras/alterar/${value.idObra}`}>
                                                <i className="fas fa-pen"></i>
                                            </Link>

                                            <button style={{marginLeft: 10, marginRight: 10}} onClick={()=>excluirObra(value.idObra)} className="btn btn-danger"><i className="fas fa-trash"></i></button>
                                            <Link href={`/obras/servicos/${value.idObra}`}><button className="btn btn-success"><i class="fas fa-users"></i></button></Link>
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
