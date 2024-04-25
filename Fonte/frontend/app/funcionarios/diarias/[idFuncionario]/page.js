'use client'

import httpClient from "@/app/utils/httpClient";
import { useEffect, useState } from "react";

export default function GerenciarDiarias({params: {idFuncionario}}) {

    const [funcionario, setFuncionario] = useState(null);
    const [cargo, setCargo] = useState(null);

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
                        <div><b>Cargo</b>: {cargo.nomeCargo}</div>
                    </div>
                </div>
                :
                <div>Carregando funcionário...</div>
            }
        </div>
    );
}