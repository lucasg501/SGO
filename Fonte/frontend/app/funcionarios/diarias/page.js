'use client'

import Carregando from "@/app/components/carregando";
import httpClient from "@/app/utils/httpClient";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export default function Diarias() {

    const [listaDiarias, setListaDiarias] = useState([]);
    const [listaFuncionarios, setListaFuncionarios] = useState([]);
    const [carregando, setCarregando] = useState(false);
    const mostrarSomentePagas = useRef(false);
    const mesFiltroDiarias = useRef(0);
    const idFuncDiarias = useRef(0);

    function formatarData(data) {
        return new Date(data).toLocaleDateString('pt-BR');
    }

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

        setCarregando(true);

        if (idFunc > 0) {

            httpClient.get(`/diarias/obterDiariasFuncionario/${idFunc}`)
            .then(r => {
                return r.json();
            })
            .then(r => {

                let listaCarregar = [];

                if (mesFiltroDiarias.current.value && mostrarSomentePagas.current.value) {

                    r.forEach((diaria) => {

                        let dataDiaria = new Date(diaria.dia);
                        let mesDiaria = (dataDiaria.getUTCMonth() + 1).toString();
    
                        if (mesFiltroDiarias.current.value == "0" || mesDiaria === mesFiltroDiarias.current.value) {
    
                            if (!mostrarSomentePagas.current.checked || diaria.dataPgto != null) {
                                listaCarregar.push(diaria);
                            }
                        }
                    });
    
                    setListaDiarias(listaCarregar);
                }
                else {
                    setListaDiarias(r);
                }

                setCarregando(false);
            })
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

            
            <div style={{marginTop: 20, marginBottom: 20}}>
                <label style={{fontWeight: "bold"}}>Selecione um funcionário</label>
                <select className="form-select" style={{width: 250}}
                    onChange={(e) => carregarDiarias(e.target.value)} ref={idFuncDiarias}>
                    <option value={0}>Nenhum</option>
                    {
                        listaFuncionarios.map((funcionario) => {
                            return <option value={funcionario.idFuncionario} key={funcionario.idFuncionario}>
                                    {funcionario.nomeFuncionario}
                                </option>
                        })
                    }
                </select>
            </div>
            {
                idFuncDiarias.current.value > 0 ?
                    <div className="card" style={{padding: 20}}>
                        <p style={{fontWeight: 'bold'}}>Filtros</p>
                        <div style={{marginBottom: 20, display: 'inline-flex', alignItems: 'center'}}>
                            
                            <div className="form-group">
                                <label style={{fontWeight: 'bold'}}>Mês</label>
                                <select className="form-select" style={{width: 250}} onChange={() => carregarDiarias(idFuncDiarias.current.value)} 
                                    ref={mesFiltroDiarias}>
                                    <option value={0}>Todos</option>
                                    <option value={1}>Janeiro</option>
                                    <option value={2}>Fevereiro</option>
                                    <option value={3}>Março</option>
                                    <option value={4}>Abril</option>
                                    <option value={5}>Maio</option>
                                    <option value={6}>Junho</option>
                                    <option value={7}>Julho</option>
                                    <option value={8}>Agosto</option>
                                    <option value={9}>Setembro</option>
                                    <option value={10}>Outubro</option>
                                    <option value={11}>Novembro</option>
                                    <option value={12}>Dezembro</option>
                                </select>
                            </div>
                            <div className="form-check" style={{marginLeft: 10}}>
                                <input type="checkbox" onChange={() => carregarDiarias(idFuncDiarias.current.value)}
                                    ref={mostrarSomentePagas} />
                                <label style={{fontWeight: 'bold', marginLeft: 3}}>Mostrar somente diárias pagas</label>
                            </div>
                        </div>

                        {
                            carregando ?
                            <Carregando />
                            :
                            listaDiarias.length > 0 ?
                            <table style={{textAlign: "center"}} className="table table-responsive">
                                <thead>
                                    <th>Dia</th>
                                    <th>Valor</th>
                                    <th>Data de Pagamento</th>
                                    <th>Marcar como Paga</th>
                                    <th>Cancelar Pagamento</th>
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
                                                            <button className="btn btn-danger" onClick={() => cancelarPagamento(diaria.idDiaria)}>
                                                                <i className="fas fa-ban"></i>
                                                            </button>
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
                            <div>Diárias não encontradas com os critérios especificados.</div>
                        }
                    </div>
                :
                <></>
            }
        </div>
    );
}