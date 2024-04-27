'use client'

import httpClient from "@/app/utils/httpClient";
import { useEffect, useRef, useState } from "react";
import 'react-calendar/dist/Calendar.css';
import { Calendar } from "react-multi-date-picker";
import gregorian_pt_br from "react-date-object/locales/gregorian_pt_br";

export default function GerenciarDiarias({params: {idFuncionario}}) {

    const [funcionario, setFuncionario] = useState(null);
    const [cargo, setCargo] = useState(null);
    const [dias, setDias] = useState([]);
    const [totalDiarias, setTotalDiarias] = useState("0,00");
    const valorDiarias = useRef(0);

    const formatarData = (data) => {
        const dataObj = new Date(data);
        const ano = dataObj.getUTCFullYear();
        const mes = ('0' + (dataObj.getUTCMonth() + 1)).slice(-2);
        const dia = ('0' + dataObj.getUTCDate()).slice(-2);
        return `${ano}-${mes}-${dia}`;
    };

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

    function mudarDias(diasSelecionados) {

        let diasTransformados = [];

        diasSelecionados.map((dia, index) => {
            diasTransformados.push(new Date(dia.year, dia.month, dia.day));
            diasTransformados[index] = formatarData(diasTransformados[index]);
        })

        let valorTotal = parseFloat(valorDiarias.current.value * diasSelecionados.length).toFixed(2).replace('.', ',');

        setTotalDiarias(valorTotal);
        setDias(diasTransformados);
    }

    function gravarDiarias() {

        if (valorDiarias.current.value > 0) {

            let status = 0;

            let diariasArray = [];

            for (let i = 0; i < dias.length; i++) {
                
                const diaria = {
                    dia: dias[i],
                    valorDiaria: valorDiarias.current.value,
                    dataPgto: null,
                    idFunc: idFuncionario
                }
                
                diariasArray.push(diaria);
            }

            httpClient.post("/diarias/gravar", diariasArray)
            .then(r => {
                status = r.status;
                return r.json();
            })
            .then(r => {
                alert(r.msg);

                if (status == 200) {
                    window.location.href='/funcionarios';
                }
            });
        }
        else {
            alert("Informe o valor das diárias!");
        }
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
                            <input type="number" className="form-control" ref={valorDiarias} 
                            onChange={(e) => {setTotalDiarias(parseFloat(e.target.value * dias.length).toFixed(2).replace('.', ','))}} />
                        </div>
                    </div> { /* Será mudado, isto é para testar a interface */ }
                    
                    <div style={{marginLeft: 20}}><b>Total: R$ {totalDiarias}</b></div>
                    
                    <div style={{margin: 20}}>
                        <Calendar locale={gregorian_pt_br} multiple onChange={(selecao) => mudarDias(selecao)} />
                    </div>
                    
                    <div style={{margin: 20, marginTop: 40}}>
                        <button className="btn btn-primary" onClick={gravarDiarias}>Gravar</button>
                        <a href="/funcionarios" style={{marginLeft: 40}}><button className="btn btn-secondary">Voltar</button></a>
                    </div>
                </div>
                :
                <div>Carregando funcionário...</div>
            }
        </div>
    );
}