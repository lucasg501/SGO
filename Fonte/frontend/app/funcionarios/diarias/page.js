'use client'

import httpClient from "@/app/utils/httpClient";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export default function Diarias() {

    const [listaDiarias, setListaDiarias] = useState([]);
    const [listaFuncionarios, setListaFuncionarios] = useState([]);
    const idFuncDiarias = useRef(0);

    const formatarData = (data) => {
        const dataObj = new Date(data);
        const ano = dataObj.getUTCFullYear();
        const mes = ('0' + (dataObj.getUTCMonth() + 1)).slice(-2);
        const dia = ('0' + dataObj.getUTCDate()).slice(-2);
        return `${ano}-${mes}-${dia}`;
    };

    function carregarListaFuncionarios() {

        httpClient.get("/funcionarios/listar")
        .then(r => {
            return r.json();
        })
        .then(r => {
            setListaFuncionarios(r);
        });
    }

    function carregarDiarias(idFunc) {

        if (idFunc > 0) {

            httpClient.get(`/diarias/obterDiariasFuncionario/${idFunc}`)
            .then(r => {
                return r.json();
            })
            .then(r => {
                setListaDiarias(r);
            });
        }
        else {
            setListaDiarias([]);
        }
    }

    function cancelarPagamento(idDiaria) {

        if (confirm("Tem certeza que deseja cancelar este pagamento?")) {

            httpClient.put(`/diarias/cancelarPagamento/${idDiaria}`)
            .then(r => {
                return r.json();
            })
            .then(r => {
                alert(r.msg);

                carregarDiarias(idFuncDiarias.current.value);
            });
        }
    }

    useEffect(() => {
        carregarListaFuncionarios();
    }, []);

    return (
        <div>
            <h1>Relatório de Diárias</h1>

            <div style={{width: 250, marginTop: 20, marginBottom: 20}}>
                <label style={{fontWeight: "bold"}}>Selecione um funcionário</label>
                <select className="form-control" onChange={(e) => carregarDiarias(e.target.value)} ref={idFuncDiarias}>
                    <option value={0}>Nenhum</option>
                    {
                        listaFuncionarios.map((funcionario) => {
                            return <option value={funcionario.idFuncionario}>{funcionario.nomeFuncionario}</option>
                        })
                    }
                </select>
            </div>

            <div>
                {
                    idFuncDiarias.current.value > 0 ?
                        listaDiarias.length > 0 ?
                        <table style={{textAlign: "center"}} className="table table-responsive">
                            <thead>
                                <th>Dia</th>
                                <th>Valor</th>
                                <th>Data de Pagamento</th>
                                <th>Marcar como Paga</th>
                                <th>Cancelar Pagamento</th>
                                <th>Dispensar</th>
                            </thead>

                            <tbody>
                                {
                                    
                                    listaDiarias.map((diaria) => {
                                        return (
                                            <tr key={diaria.idDiaria}>
                                                <td>{formatarData(diaria.dia)}</td>
                                                <td>R$ {parseFloat(diaria.valorDiaria).toFixed(2).replace('.', ',')}</td>
                                                <td>
                                                    {
                                                        diaria.dataPgto ?
                                                        formatarData(diaria.dataPgto)
                                                        :
                                                        "Não foi paga"
                                                    }
                                                </td>
                                                <td>
                                                    {
                                                        diaria.dataPgto ?
                                                        <button disabled className="btn btn-success" href={`diarias/alterar/${diaria.idDiaria}`}>
                                                            <i className="fas fa-check"></i>
                                                        </button>
                                                        :
                                                        <Link className="btn btn-success" href={`diarias/alterar/${diaria.idDiaria}`}>
                                                            <i className="fas fa-check"></i>
                                                        </Link>
                                                    }
                                                    
                                                </td>
                                                <td>
                                                    {
                                                        diaria.dataPgto ?
                                                        <button className="btn btn-danger" onClick={() => cancelarPagamento(diaria.idDiaria)}><i className="fas fa-ban"></i></button>
                                                        :
                                                        <button className="btn btn-danger" disabled><i className="fas fa-ban"></i></button>
                                                    }
                                                </td>
                                            </tr>
                                        )
                                    })
                                }
                            </tbody>
                        </table>
                        :
                        <div>Este funcionário não possui diárias.</div>
                    :
                    <></>
                }
                
            </div>
        </div>
    );
}