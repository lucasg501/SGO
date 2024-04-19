'use client'

import { useEffect, useRef, useState } from "react";
import httpClient from "../utils/httpClient";
import Link from "next/link";

export default function FormParcelas(props) {

    const dataVencimento = useRef([]);
    const valorParcela = useRef([]);
    const dataRecebimento = useRef([]);

    const [parcelas, setParcelas] = useState(props.parcelas ? props.parcelas : [{
        numParcela: 0,
        dataVencimento: "",
        dataRecebimento: "",
        valorParcela: 0,
        idObra: props.obra.idObra
    }]);

    const formatarData = (data) => {
        const dataObj = new Date(data);
        const ano = dataObj.getUTCFullYear();
        const mes = ('0' + (dataObj.getUTCMonth() + 1)).slice(-2);
        const dia = ('0' + dataObj.getUTCDate()).slice(-2);
        return `${ano}-${mes}-${dia}`;
    };

    function adicionarCampo() {

        let novaParcela = {
            numParcela: 0,
            dataVencimento: "",
            dataRecebimento: "",
            valorParcela: 0,
            idObra: props.obra.idObra
        };

        setParcelas((parcelas) => [
            ...parcelas, novaParcela
        ]);
    };

    function removerCampo() {
        if (parcelas.length > 1) {
            
            let parcelaExcluir = parcelas[parcelas.length - 1];

            setParcelas((parcelas) => 
                parcelas.filter((parcela) => parcela != parcelaExcluir)
            );
        }
    };

    function datasPreenchidas() {

        for (const parcela of parcelas) {

            return parcela.dataVencimento != "";
        }
    }

    function datasPreenchidas() {

        for (const parcela of parcelas) {

            return parcela.valorParcela != "";
        }
    }

    function gravarParcelas() {

        if (datasPreenchidas() && valoresPreenchidos()) {

            let status = 0;
            let parcelasArray = [];

            for (let i = 0; i < parcelas.length; i++) {
                const dataVencimentoValue = dataVencimento.current[i] ? dataVencimento.current[i].value : null;
                const valorParcelaValue = valorParcela.current[i] ? valorParcela.current[i].value : null;

                const parcela = {
                    dataVencimento: formatarData(dataVencimentoValue),
                    valorParcela: valorParcelaValue,
                    idObra: props.obra.idObra
                };

                parcelasArray.push(parcela);
            }

            httpClient.post('/parcelas/gravar', parcelasArray)
                .then(r => {
                    status = r.status;
                    return r.json();
                })
                .then(r => {
                    alert(r.msg);

                    if (status === 200) {
                        window.location.href = '/recebimentos';
                    }
                });
        }
        else {
            alert("Preencha todos os dados das parcelas!");
        }
    }

    return (
        <div>
            <h1>Gerenciar Parcelas da Obra</h1>
            <h2>Obra: {props.obra.bairro}</h2>

            <div>
                <br></br>

                {
                    parcelas.map((parcela, index) => (
                        <div key={index} className="card" style={{padding: 20, marginBottom: 10, width: '55%', textAlign: 'center'}}>
                            <div className="form-group card-header">
                                <label><b>Parcela {index + 1}</b></label>
                            </div>

                            <div className="form-group" style={{ display: 'inline-flex' }}>

                                <div className="form-group" style={{textAlign: 'start', fontWeight: 'bold'}}>
                                    <label>Vencimento:</label>
                                    <input
                                        defaultValue={parcela.dataVencimento ? formatarData(parcela.dataVencimento) : ''}
                                        onChange={(e) => setParcelas({ ...parcelas, dataVencimento: e.target.value })}
                                        style={{ width: '80%' }}
                                        type="date"
                                        className="form-control"
                                        ref={el => dataVencimento.current[index] = el}
                                    />

                                </div>

                                <div className="form-group" style={{textAlign: 'start', fontWeight: 'bold'}}>
                                    <label>Recebimento:</label>
                                    <input type="date" ref={el => dataRecebimento.current[index] = el} className="form-control"></input>
                                </div>

                                <div className="form-group" style={{textAlign: 'start', fontWeight: 'bold', marginLeft: 30}}>
                                    <label>Valor:</label>
                                    <input type="number" className="form-control" defaultValue={parcela.valorParcela} onChange={(e) =>
                                        setParcelas({ ...parcelas, valorParcela: e.target.value })} style={{ width: '80%' }}
                                        ref={el => valorParcela.current[index] = el}></input>
                                </div>
                            </div>
                        </div>
                    ))
                }

                <div className="form-group">
                    <div style={{ display: 'inline-block' }}>
                        <button className="btn btn-danger" onClick={removerCampo}>-</button>
                    </div>

                    <div style={{ display: 'inline-block', marginLeft: 15 }}>
                        <button className="btn btn-primary" onClick={adicionarCampo}>+</button>
                    </div>
                </div>

                <div>
                    <Link style={{ marginRight: 25 }} href="/recebimentos"><button className="btn btn-secondary">Voltar</button></Link>
                    <button className="btn btn-primary" onClick={props.parcela == null ? gravarParcelas : alterarParcela}>Gravar</button>
                </div>
            </div>
        </div>
    );
}