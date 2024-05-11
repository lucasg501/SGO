'use client'

import Carregando from "@/app/components/carregando";
import httpClient from "@/app/utils/httpClient";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export default function MarcarPagamentoDiaria({params: {idDiaria}}) {

    const formatarData = (data) => {
        const dataObj = new Date(data);
        const ano = dataObj.getUTCFullYear();
        const mes = ('0' + (dataObj.getUTCMonth() + 1)).slice(-2);
        const dia = ('0' + dataObj.getUTCDate()).slice(-2);
        return `${ano}-${mes}-${dia}`;
    };

    const [diaria, setDiaria] = useState(null);
    const dataPagamento = useRef("");

    function carregarDiaria(){
        httpClient.get(`/diarias/obter/${idDiaria}`)
        .then(r=>{
            return r.json();
        })
        .then(r=>{
            setDiaria(r);
        })
    }

    function alterarDiaria() {

        if (dataPagamento.current.value != "") {

            let status = 0;
            let dia = formatarData(diaria.dia);
            let pagamento = formatarData(dataPagamento.current.value);

            httpClient.put('/diarias/alterar', {
                idDiaria: diaria.idDiaria,
                dia: dia,
                valorDiaria: diaria.valorDiaria,
                dataPgto: pagamento,
                idFuncionario: diaria.idFuncionario
            })
            .then(r => {
                return r.json();
            })
            .then(r => {
                alert(r.msg);

                status = r.status;

                if (status == 200) {
                    window.location.href = '/funcionarios/diarias';
                }
            });
        }
        else {
            alert('Digite uma data de pagamento!');
        }
    }

    useEffect(() =>{
        carregarDiaria();
    },[])

    return(
        <div>
            {
                diaria ? 
                <div>
                    <h1>Marcar Diária como Paga</h1>

                    <div style={{marginTop: 30, marginBottom: 30, display: 'inline-flex'}}>
                        <div className="form-group" style={{textAlign: 'start', fontWeight: 'bold'}}>
                            <label>Dia:</label>
                            <input disabled
                                defaultValue={diaria.dia ? formatarData(diaria.dia) : ''}
                                style={{ width: '80%' }}
                                type="date"
                                className="form-control"
                            />

                        </div>
                        <div className="form-group" style={{textAlign: 'start', fontWeight: 'bold'}}>
                            <label>Data de Pagamento:</label>
                            <input
                                style={{ width: '80%' }}
                                type="date"
                                className="form-control"
                                ref={dataPagamento}
                                defaultValue={formatarData(new Date())}
                            />

                        </div>
                    </div>

                    <div>
                        <Link style={{ marginRight: 25 }} href="/funcionarios/diarias"><button className="btn btn-secondary">Voltar</button></Link>
                        <button className="btn btn-primary" onClick={alterarDiaria}>Marcar</button>
                    </div>
                </div>
                :
                <Carregando />
            }
        </div>
    )
}