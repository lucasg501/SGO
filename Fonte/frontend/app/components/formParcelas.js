'use client'
import Modal from 'react-modal';
import { useEffect, useRef, useState } from "react";
import httpClient from "../utils/httpClient";
import Link from "next/link";

export default function FormParcelas(props) {

    const [totalValores, setTotalValores] = useState(props.obra.valorTotal);
    const dataVencimento = useRef([]);
    const valorParcela = useRef([]);
    const [gravando, setGravando] = useState(false);

    const [modalIsOpen, setModalIsOpen] = useState(false);
    function openModal() {
        setModalIsOpen(true);
    }
    function closeModal() {
        setModalIsOpen(false);
    }

    const formatarData = (data) => {
        const dataObj = new Date(data);
        const ano = dataObj.getUTCFullYear();
        const mes = ('0' + (dataObj.getUTCMonth() + 1)).slice(-2);
        const dia = ('0' + dataObj.getUTCDate()).slice(-2);
        return `${ano}-${mes}-${dia}`;
    };

    const [parcelas, setParcelas] = useState(props.parcelas.length > 0 ? props.parcelas : [{
        numParcela: 1,
        dataVencimento: formatarData(props.obra.dataInicio),
        dataRecebimento: null,
        valorParcela: parseFloat(props.obra.valorTotal).toFixed(2),
        idObra: props.obra.idObra
    }]);

    const incrementarMes = (data) => {
        const dataObj = new Date(data);
        let ano = dataObj.getUTCFullYear();
        let mes = ('0' + (dataObj.getUTCMonth() + 2)).slice(-2);

        if (mes > 12) {
            mes = '01';
            ano++;
        }

        let dia = ('0' + dataObj.getUTCDate()).slice(-2);
        return `${ano}-${mes}-${dia}`;
    };

    function ajustarValoresParcelas(novoValor, novaParcela) {

        let total = 0;
        let listaParcelas = [];

        let arredondado = Math.ceil(novoValor).toFixed(2);

        if (novaParcela) {
            
            listaParcelas = parcelas.map(parcela => {
                
                valorParcela.current[parcela.numParcela].value = arredondado;
                parcela.valorParcela = arredondado;
                total += parseFloat(arredondado);
                return {
                    ...parcela, valorParcela: arredondado
                };
            });

            total += parseFloat(arredondado);
            novaParcela.valorParcela = parseFloat(arredondado) + parseFloat(props.obra.valorTotal - props.valorRecebido) - total;
        }
        else {
            let parcelaExcluir = parcelas[parcelas.length - 1];

            parcelas.map(parcela => {
                if (parcela.numParcela != parcelaExcluir.numParcela) {
                    listaParcelas.push(parcela);
                }
            });

            listaParcelas.map(parcela => {
                
                valorParcela.current[parcela.numParcela].value = arredondado;
                parcela.valorParcela = arredondado;
                total += parseFloat(arredondado);
                return {
                    ...parcela, valorParcela: arredondado
                };
            });

            let valorDiferenca = parseFloat(parseFloat(arredondado) + parseFloat(props.obra.valorTotal - props.valorRecebido) - total).toFixed(2);

            listaParcelas[listaParcelas.length - 1].valorParcela = valorDiferenca;
            // Atualiza ref de acordo com o objeto
            valorParcela.current[listaParcelas[listaParcelas.length - 1].numParcela].value = valorDiferenca;
        }

        return listaParcelas;
    }

    function adicionarCampo() {

        let data = incrementarMes(parcelas[parcelas.length - 1].dataVencimento);

        let valor = parseFloat((props.obra.valorTotal - props.valorRecebido) / (parcelas.length + 1)).toFixed(2);

        let novaParcela = {
            numParcela: parcelas.length + 1,
            dataVencimento: data,
            dataRecebimento: null,
            valorParcela: 0,
            idObra: props.obra.idObra
        };

        let listaAjustada = ajustarValoresParcelas(valor, novaParcela);

        setParcelas([...listaAjustada, novaParcela]);
    };

    function removerCampo() {
        if (parcelas.length > 1) {

            let valor = parseFloat((props.obra.valorTotal - props.valorRecebido) / (parcelas.length - 1)).toFixed(2);

            let listaAjustada = ajustarValoresParcelas(valor);

            setParcelas(listaAjustada);
        }
    };

    function datasPreenchidas() {

        let faltaData = false;

        for (let i = 0; i < parcelas.length; i++) {

            if (parcelas[i].dataVencimento == "") {
                faltaData = true;
            }
        }

        return !faltaData;
    }

    function gravarParcelas() {

        if (datasPreenchidas()) {

            setGravando(true);

            let status = 0;
            let possuiParcelas = props.parcelas.length > 0;
            let parcelasArray = [];

            for (let i = 0; i < parcelas.length; i++) {

                const dataVencimentoValue = parcelas[i].dataVencimento;
                const dataRecebimentoValue = parcelas[i].dataRecebimento;
                const valorParcelaValue = parcelas[i].valorParcela;

                const parcela = {
                    dataVencimento: formatarData(dataVencimentoValue),
                    dataRecebimento: dataRecebimentoValue != "" ? formatarData(dataRecebimentoValue) : null,
                    valorParcela: parseFloat(valorParcelaValue).toFixed(2),
                    idObra: props.obra.idObra
                };

                parcelasArray.push(parcela);
            }

            httpClient.post('/parcelas/gravar', { parcelasArray, possuiParcelas })
                .then(r => {
                    status = r.status;
                    return r.json();
                })
                .then(r => {
                    alert(r.msg);
                    setGravando(false);

                    if (status === 200) {
                        window.location.href = '/recebimentos';
                    }
                });
        }
        else {
            alert("Preencha todas as datas das parcelas!");
        }
    }

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <h1>Gerenciar Parcelas da Obra</h1>
                <button onClick={openModal} className="btn btn-info" style={{ marginLeft: 10 }}>Ajuda</button>
            </div>

            <div className="card" style={{ padding: 20 }}>
                <h2><b>Obra: {props.obra.bairro}</b></h2>
                <div><b>Data de Início:</b> {formatarData(props.obra.dataInicio)}</div>
                <div><b>Data Prevista de Término:</b> {formatarData(props.obra.dataTermino)}</div>
                <div><b>Valor:</b> R$ {parseFloat(props.obra.valorTotal).toFixed(2).replace('.', ',')}</div>
                <div><b>Quantidade de parcelas pagas desta obra:</b> {props.qtdeParcelasPagas}</div>
                <div><b>Total recebido desta obra:</b> R$ {parseFloat(props.valorRecebido).toFixed(2).replace('.', ',')}</div>
            </div>

            <div>
                <br></br>

                {
                    parcelas.map((parcela, index) => (
                        <div key={index} className="card" style={{ marginBottom: 20, width: '37.5%', textAlign: 'center' }}>
                            <div className="form-group card-header">
                                <label><b>Parcela {index + 1}</b></label>
                            </div>

                            <div className="form-group" style={{ display: 'inline-flex', marginTop: 10, padding: 15, }}>

                                <div className="form-group" style={{ textAlign: 'start', fontWeight: 'bold' }}>
                                    <label>Vencimento:</label>
                                    <input
                                        defaultValue={parcela.dataVencimento ? formatarData(parcela.dataVencimento) : ''}
                                        style={{ width: '80%' }}
                                        type="date"
                                        className="form-control"
                                        ref={el => dataVencimento.current[index] = el}
                                        onChange={(e) => {
                                            parcela.dataVencimento = e.target.value
                                        }}
                                    />

                                </div>

                                <div className="form-group" style={{ textAlign: 'start', fontWeight: 'bold', marginLeft: 30 }}>
                                    <label>Valor (R$):</label>
                                    <input type="number" className="form-control" defaultValue={parcela.valorParcela ? 
                                        parseFloat(parcela.valorParcela).toFixed(2) : 0}
                                        style={{ width: '80%' }} ref={el => valorParcela.current[parcela.numParcela] = el}
                                        onChange={(e) => {
                                            parcela.valorParcela = e.target.value;
                                        }}
                                        disabled
                                    />
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

                <div style={{marginTop: 40}}>
                    {
                        gravando ? <p style={{fontWeight: 'bold'}}>Aguardando gravação...</p> : <></>
                    }
                    <Link style={{ marginRight: 25 }} href="/recebimentos"><button className="btn btn-secondary" disabled={gravando}>Cancelar</button></Link>
                    <button className="btn btn-primary" onClick={props.parcela == null ? gravarParcelas : alterarParcela} disabled={gravando}>Gravar</button>
                </div>
            </div>

            <Modal style={{ content: { width: '500px', margin: 'auto', height: '500px' } }} isOpen={modalIsOpen} onRequestClose={closeModal}>
                <div className="card" style={{ marginBottom: '20px', width: '100%', textAlign: 'center' }}>
                    <div className="form-group card-header">
                        <label><b>Parcela 1</b></label>
                    </div>

                    <div className="form-group" style={{ display: 'inline-flex', marginTop: '10px', padding: '15px' }}>
                        <div className="form-group" style={{ textAlign: 'start', fontWeight: 'bold', width: '50%' }}>
                            <label>Vencimento:</label>
                            <input
                                style={{ width: '100%' }}
                                type="date"
                                className="form-control"
                                placeholder="Vencimento"
                                disabled
                            />
                        </div>

                        <div className="form-group" style={{ textAlign: 'start', fontWeight: 'bold', width: '50%', marginLeft: '30px' }}>
                            <label>Valor (R$):</label>
                            <input
                                type="number"
                                className="form-control"
                                style={{ width: '100%' }}
                                placeholder="Valor (R$)"
                                disabled
                            />
                        </div>
                    </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'baseline' }} className="form-group">
                    <div style={{ display: 'inline-block' }}>
                        <button disabled className="btn btn-danger">-</button>
                        
                    </div>
                    <p>Clique para diminuir a quantidade de campos</p>
                    <div style={{ display: 'inline-block', marginLeft: 15 }}>
                        <button disabled className="btn btn-primary" >+</button>
                    </div>
                    <p>Clique para aumentar a quantidade de campos</p>
                </div>

                <button className="btn btn-danger" onClick={closeModal}>Fechar</button>
            </Modal>


        </div>
    );
}