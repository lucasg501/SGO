'use client'

import { useEffect, useRef, useState } from "react";
import httpClient from "../utils/httpClient";
import Link from "next/link";

export default function FormParcelas(props) {

    const idObra = useRef([]);
    const numParcela = useRef([]);
    const dataVencimento = useRef([]);
    const valorParcela = useRef([]);

    const [parcelas, setParcelas] = useState({
        numParcela: 0,
        dataVencimento: '',
        valorParcela: 0,
        idObra: 0
    });

    const [listaObras, setListaObras] = useState([]);

    const convertIsoToDateString = (isoDate) => {
        if (!isoDate) return '';
        const date = new Date(isoDate);
        const year = date.getFullYear();
        let month = (date.getMonth() + 1).toString().padStart(2, '0');
        let day = date.getDate().toString().padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    function listarObras() {
        httpClient.get('/obras/listar')
            .then(r => r.json())
            .then(r => {
                setListaObras(r);
            });
    }

    const adicionarCampo = () => {
        setParcelas(prevState => ({
            ...prevState,
            numParcela: prevState.numParcela + 1,
            idObra: prevState.idObra || (listaObras.length > 0 ? listaObras[0].idObra : 0)
        }));
    };

    const removerCampo = () => {
        if (parcelas.idEtapa > 0) {
            setEtapas(prevState => ({
                ...prevState,
                numParcela: prevState.numParcela - 1
            }));
        }
    };

    function gravarParcelas() {

        let status = 0;
        let parcelasArray = [];

        const idObraValue = idObra.current[0] ? idObra.current.value : null;

        for (let i = 0; i < parcelas.numParcela + 1; i++) {
            const numParcelaValue = numParcela.current[i] ? numParcela.current[i].value : null;
            const dataVencimentoValue = dataVencimento.current[i] ? dataVencimento.current[i].value : null;
            const valorParcelaValue = valorParcela.current[i] ? valorParcela.current[i].value : null;

            const parcela = {
                numParcela: numParcelaValue,
                dataVencimento: convertIsoToDateString(dataVencimentoValue),
                dataPagamento: null,
                valorParcela: valorParcelaValue,
                idObra: idObraValue
            };

            parcelasArray.push(parcela);
        }

        httpClient.post('/parcelas/gravar', parcelasArray)
            .then(r => {
                status = r.status;
                return r.json();
            })
            .then(r => {
                alert(r.json);

                if (status === 200) {
                    window.location.reload();
                }
            });
    }

    useEffect(() => {
        listarObras();
    }, [])

    return (
        <div>
            <h1>Gerenciar Parcelas da Obra</h1>

            <div>
                <div className="form-group">
                    <label>Obra:</label>
                    <select style={{width: '25%', textAlign: 'center'}} ref={idObra} className="form-control" >
                        <option value={0}>Selecione</option>
                        {
                            listaObras.map(function(value, index) {
                                return <option value={value.idObra}>{value.bairro}</option>
                            })
                        }
                    </select>
                </div>

                <br></br>

                {
                    [...Array(parcelas.numParcela + 1)].map((_, index) => (
                        <div key={index}>
                            <div className="form-group">
                                <label><b>Parcela {index + 1}</b></label>
                            </div>

                            <div className="form-group" style={{ display: 'inline-flex', width: '45%', marginRight: '10px' }}>
                                
                                <div className="form-group">
                                    <label>Vencimento:</label>
                                    <input onChange={(e) => setParcelas({ ...parcelas, dataVencimento: e.target.value })} 
                                    style={{ width: '80%' }} type="date" className="form-control" />
                                </div>
                                <div className="form-group">
                                    <label>Valor:</label>
                                    <input type="number" className="form-control" defaultValue={0} onChange={(e) =>
                                    setParcelas({...parcelas, valorParcela: e.target.value})} style={{ width: '80%' }}></input>
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
                    <button className="btn btn-primary" onClick={gravarParcelas}>Gravar</button>
                </div>
            </div>
        </div>
    );
}