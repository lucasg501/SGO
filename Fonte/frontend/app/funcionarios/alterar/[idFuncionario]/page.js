'use client'

import FuncionarioForm from "@/app/components/funcionarioForm";
import httpClient from "@/app/utils/httpClient";
import { useEffect, useState } from "react";

export default function AlterarFuncionario({params: {idFuncionario}}) {

    const [funcionario, setFuncionario] = useState(null);

    function carregarFuncionario() {

        httpClient.get(`/funcionarios/obter/${idFuncionario}`)
        .then(r => {
            return r.json();
        })
        .then(r => {
            setFuncionario(r);
        });
    }

    useEffect(() => {
        carregarFuncionario();
    }, []);

    return (
        <div>
            {funcionario != null ? <FuncionarioForm funcionario={funcionario}></FuncionarioForm> : <div>Carregando...</div>}
        </div>
    );
}