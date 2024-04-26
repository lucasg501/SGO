'use client'

import httpClient from "@/app/utils/httpClient";
import { useEffect, useRef, useState } from "react";
import Calendar from "react-calendar";
import 'react-calendar/dist/Calendar.css';

export default function GerenciarDiarias({params: {idFuncionario}}) {

    const [funcionario, setFuncionario] = useState(null);
    const [cargo, setCargo] = useState(null);
    const valorDiarias = useRef(0);

    function carregarFuncionario() {

        httpClient.get(`/funcionarios/obter/${idFuncionario}`)
        .then(r => {
            return r.json();
        })
        .then(r => {
            setFuncionario(r);
            carregarCargo(r.cargoFuncionario);
        });
    }

    function carregarCargo(idCargo) {

        httpClient.get(`/cargos/obter/${idCargo}`)
        .then(r => {
            return r.json();
        })
        .then(r => {
            setCargo(r.cargoModel);
        });
    }

    useEffect(() => {
        carregarFuncionario();
    }, [])

    return (
        <div>
            <h1>Gerenciar Diárias do Funcionário</h1>

            {
                funcionario && cargo ?
                <div>
                    <div className="card" style={{padding: 20}}>
                        <h3><b>Nome:</b> {funcionario.nomeFuncionario}</h3>
                        <div><b>Telefone:</b> {funcionario.telFuncionario}</div>
                        <div><b>Cargo:</b> {cargo.nomeCargo}</div>
                    </div>

                    <div className="input-group" style={{margin: 20, display: "flex", alignItems: "center"}}>
                        <label><b>Valor da diária:</b> R$ </label>
                        <div style={{marginLeft: 10, width: 80}}>
                            <input type="number" className="form-control" />
                        </div>
                    </div> { /* Será mudado, isto é para testar a interface */ }
                    <div style={{marginLeft: 20}}><b>Total: R$ 10</b></div>
                    <div style={{margin: 20}}>
                        <Calendar />
                    </div>
                    <div style={{margin: 20, marginTop: 40}}>
                        <button className="btn btn-primary">Gravar</button>
                        <a href="/funcionarios" style={{marginLeft: 40}}><button className="btn btn-secondary">Voltar</button></a>
                    </div>
                </div>
                :
                <div>Carregando funcionário...</div>
            }
        </div>
    );
}