'use client'

import httpClient from "@/app/utils/httpClient";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export default function quitarParcela({params: {numParcela}}) {

    const formatarData = (data) => {
        const dataObj = new Date(data);
        const ano = dataObj.getUTCFullYear();
        const mes = ('0' + (dataObj.getUTCMonth() + 1)).slice(-2);
        const dia = ('0' + dataObj.getUTCDate()).slice(-2);
        return `${ano}-${mes}-${dia}`;
    };

    const [parcela, setParcela] = useState(null);
    const dataRecebimento = useRef("");

    function carregarParcela(){
        httpClient.get(`/parcelas/obter/${numParcela}`)
        .then(r=>{
            return r.json();
        })
        .then(r=>{
            setParcela(r);
        })
    }

    function alterarParcela() {

        if (dataRecebimento.current.value != "") {

            let status = 0;
            let vencimento = formatarData(parcela.dataVencimento);
            let recebimento = formatarData(dataRecebimento.current.value);

            httpClient.put('/parcelas/alterar', {
                numParcela: parcela.numParcela,
                dataVencimento: vencimento,
                dataRecebimento: recebimento,
                valorParcela: parcela.valorParcela,
                idObra: parcela.idObra
            })
            .then(r => {
                return r.json();
            })
            .then(r => {
                alert(r.msg);

                status = r.status;

                if (status == 200) {
                    window.location.href = '/recebimentos';
                }
            });
        }
        else {
            alert('Digite uma data de recebimento!');
        }
    }

    useEffect(() =>{
        carregarParcela();
    },[])

    return(
        <div>
            {parcela != null ? 
            <div>
                <h1>Marcar Parcela como Paga</h1>

                <div style={{marginTop: 30, marginBottom: 30, display: 'inline-flex'}}>
                    <div className="form-group" style={{textAlign: 'start', fontWeight: 'bold'}}>
                        <label>Vencimento:</label>
                        <input disabled
                            defaultValue={parcela.dataVencimento ? formatarData(parcela.dataVencimento) : ''}
                            style={{ width: '80%' }}
                            type="date"
                            className="form-control"
                        />

                    </div>
                    <div className="form-group" style={{textAlign: 'start', fontWeight: 'bold'}}>
                        <label>Data de Recebimento:</label>
                        <input
                            style={{ width: '80%' }}
                            type="date"
                            className="form-control"
                            ref={dataRecebimento}
                            defaultValue={formatarData(new Date())}
                        />

                    </div>
                </div>

                <div>
                    <Link style={{ marginRight: 25 }} href="/recebimentos"><button className="btn btn-secondary">Voltar</button></Link>
                    <button className="btn btn-primary" onClick={alterarParcela}>Marcar</button>
                </div>
            </div>
            :
            <div>Carregando...</div>}
        </div>
    )
}