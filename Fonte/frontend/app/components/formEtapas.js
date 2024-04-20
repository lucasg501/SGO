'use client'
import { useEffect, useRef, useState } from "react";
import httpClient from "../utils/httpClient";
import Link from "next/link";

export default function FormEtapas(props) {

    const idObra = useRef([]);
    const idEtapa = useRef([]);
    const dataPrevInicio = useRef([]);
    const dataPrevTermino = useRef([]);
    const dataFim = useRef([]);
    const descricaoEtapa = useRef([]);
    const [listaAndamentoEtapas, setListaAndamentoEtapas] = useState([]);

    const formatarData = (data) => {
        const dataObj = new Date(data);
        const ano = dataObj.getUTCFullYear();
        const mes = ('0' + (dataObj.getUTCMonth() + 1)).slice(-2);
        const dia = ('0' + dataObj.getUTCDate()).slice(-2);
        return `${ano}-${mes}-${dia}`;
    };


    const [etapas, setEtapas] = useState(props.etapas ? {
        ...props.etapas,
        dataPrevInicio: props.etapas.dataPrevInicio ? formatarData(props.etapas.dataPrevInicio) : '',
        dataPrevTermino: props.etapas.dataPrevTermino ? formatarData(props.etapas.dataPrevTermino) : '',
        dataFim: props.etapas.dataFim ? formatarData(props.etapas.dataFim) : ''
    } : { idEtapa: 0, idObra: 0, dataPrevInicio: '', dataPrevFim: '', dataFim: '', descricaoEtapa: '' });

    const [listaObras, setListaObras] = useState([]);
    const [listaEtapas, setListaEtapas] = useState([]);

    useEffect(() => {
        listarObras();
        listarEtapas();
    }, []);

    const adicionarCampo = () => {
        setEtapas(prevState => ({
            ...prevState,
            idEtapa: prevState.idEtapa + 1,
            idObra: prevState.idObra || (listaObras.length > 0 ? listaObras[0].idObra : 0)
        }));
    };

    const removerCampo = () => {
        if (etapas.idEtapa > 0) {
            setEtapas(prevState => ({
                ...prevState,
                idEtapa: prevState.idEtapa - 1
            }));
        }
    };

    function listarObras() {
        httpClient.get('/obras/listar')
            .then(r => r.json())
            .then(r => {
                setListaObras(r);
            });
    }

    function listarEtapas() {
        httpClient.get('/etapas/listar')
            .then(r => r.json())
            .then(r => {
                setListaEtapas(r);
            });
    }

    const listarAndamentoEtapas = (idObra) => {
        if (idObra !== 0) {
            httpClient.get(`/andamentoEtapas/obterEtapasPorObra/${idObra}`)
                .then(r => r.json())
                .then(r => {
                    const lista = Array.isArray(r) ? r : [r]; // Garante que r seja uma lista
                    setListaAndamentoEtapas(lista);
                });
        }
    };

    function gravarEtapas() {
        let status = 0;
        let etapasArray = [];
        let hasInvalidDate = false;
    
        const idObraValue = idObra.current[0] ? idObra.current[0].value : null;
    
        for (let i = 0; i < etapas.idEtapa + 1; i++) {
            const idEtapaValue = idEtapa.current[i] ? idEtapa.current[i].value : null;
            const dataPrevInicioValue = dataPrevInicio.current[i] ? dataPrevInicio.current[i].value : null;
            const dataPrevTerminoValue = dataPrevTermino.current[i] ? dataPrevTermino.current[i].value : null;
            const dataFimValue = dataFim.current[i] ? (dataFim.current[i].value !== '' ? dataFim.current[i].value : null) : null;
            const descricaoEtapaValue = descricaoEtapa.current[i] ? descricaoEtapa.current[i].value : null;
    
            if (dataPrevInicioValue && dataPrevTerminoValue && dataPrevInicioValue >= dataPrevTerminoValue) {
                alert("A data de previsão de início deve ser menor do que a data de previsão de término.");
                hasInvalidDate = true;
                break;
            }
    
            if (dataFimValue < dataPrevInicioValue) {
                alert("A data de fim não pode ser anterior à data de início.");
                hasInvalidDate = true;
                break;
            }
    
            if (dataFimValue < dataPrevTerminoValue) {
                alert("A data de fim não pode ser anterior à data de previsão de término.");
                hasInvalidDate = true;
                break;
            }
    
            const etapa = {
                idObra: idObraValue,
                idEtapa: idEtapaValue,
                dataPrevInicio: dataPrevInicioValue,
                dataPrevTermino: dataPrevTerminoValue,
                dataFim: dataFimValue,
                descricaoEtapa: descricaoEtapaValue
            };
            etapasArray.push(etapa);
        }
    
        if (!hasInvalidDate) {
            httpClient.post('/andamentoEtapas/gravar', etapasArray)
                .then(r => {
                    status = r.status;
                    return r.json();
                })
                .then(r => {
                    alert(r.msg);
                    if (status === 200) {
                        window.location.href = '/etapas';
                    }
                });
        }
    }
    

    function alterarEtapas() {
        let status = 0;
        httpClient.put('/andamentoEtapas/alterar', {
            idAndamento: props.etapa.idAndamento,
            idObra: props.etapa.idObra,
            idEtapa: props.etapa.idEtapa,
            dataPrevInicio: formatarData(props.etapa.dataPrevInicio),
            dataPrevTermino: formatarData(props.etapa.dataPrevTermino),
            dataFim: formatarData(dataFim.current[0].value),
            descricaoEtapa: props.etapa.descricaoEtapa
        })
            .then(r => {
                status = r.status;
                return r.json();
            })
            .then(r => {
                alert(r.msg);
                if (status === 200) {
                    window.location.href = '/etapas';
                }
            })

    }

    return (
        <div>
            <h1>{props.etapa != null ? 'Marcar Como Finalizada' : 'Gerenciar Etapas da Obra'}</h1>

            <div>
                <div className="from-group">
                    <label>Obra:</label>
                    <select onChange={() => listarAndamentoEtapas(idObra.current[0].value)} ref={el => idObra.current[0] = el} style={{ width: '10%', textAlign: 'center' }} defaultValue={props.etapa ? props.etapa.idObra : 0} className="form-control" disabled={props.etapa != null}>

                        <option value={0}>Selecione</option>
                        {listaObras.map(function (value, index) {
                            const isSelected = props.etapa && value.idObra === props.etapa.idObra;
                            return (
                                <option key={index} value={value.idObra} selected={isSelected}>
                                    {value.bairro}
                                </option>
                            );
                        })}

                    </select>
                </div>
                <br></br>

                {[...Array(etapas.idEtapa + 1)].map((_, index) => (
                    <div key={index}>
                        <div className="form-group">
                            <label>Etapa {index + 1}:</label>
                            <select defaultValue={props.etapa ? props.etapa.idEtapa : 0} ref={el => idEtapa.current[index] = el} style={{ width: '10%', textAlign: 'center' }} className="form-control" disabled={props.etapa != null}>
                                <option value={0}>Selecione</option>
                                {listaEtapas.map(function (value, index) {
                                    const isSelected = props.etapa && value.idEtapa === props.etapa.idEtapa;
                                    const isDisabled = listaAndamentoEtapas.some(andamentoEtapa => andamentoEtapa.idEtapa === value.idEtapa);
                                    return (
                                        <option style={{ textAlign: 'left' }} key={index} value={value.idEtapa} selected={isSelected} disabled={isDisabled}>
                                            {value.idEtapa} {value.nomeEtapa}
                                        </option>
                                    );
                                })}

                            </select>
                        </div>

                        <div className="form-group" style={{ display: 'inline-block', width: '15%', marginRight: '10px' }}>
                            <label>Início:</label>
                            <input disabled={props.etapa != null} defaultValue={props.etapa ? formatarData(props.etapa.dataPrevInicio) : ''} ref={el => dataPrevInicio.current[index] = el} style={{ width: '80%' }} type="date" className="form-control" placeholder="Início" />
                        </div>
                        <div className="form-group" style={{ display: 'inline-block', width: '25%' }}>
                            <label>Previsão de Término:</label>
                            <input disabled={props.etapa != null} defaultValue={props.etapa ? formatarData(props.etapa.dataPrevTermino) : ''} ref={el => dataPrevTermino.current[index] = el} style={{ width: '40%' }} type="date" className="form-control" placeholder="Previsão de Término" />
                        </div>

                        <div style={{ display: 'flex', alignItems: 'baseline' }}>
                            <div className="form-group" style={{ width: '15%', marginRight: '10px' }}>
                                <label style={{ display: 'block' }}>Fim:</label>
                                <input ref={el => dataFim.current[index] = el} style={{ width: '80%' }} type="date" className="form-control" placeholder="Fim" />
                            </div>
                            <div className="form-group" style={{ width: '25%' }}>
                                <label style={{ display: 'block' }}>Descrição:</label>
                                <textarea defaultValue={props.etapa ? props.etapa.descricaoEtapa : ''} ref={el => descricaoEtapa.current[index] = el} style={{ width: '100%', minHeight: '100px' }} className="form-control" placeholder="Descrição" disabled={props.etapa != null} />
                            </div>
                        </div>
                    </div>
                ))}

                <div className="form-group">
                    <div style={{ display: 'inline-block' }}>
                        <button disabled={props.etapa != null} className="btn btn-danger" onClick={removerCampo}>-</button>
                    </div>

                    <div style={{ display: 'inline-block', marginLeft: 15 }}>
                        <button disabled={props.etapa != null} className="btn btn-primary" onClick={adicionarCampo}>+</button>
                    </div>
                </div>
            </div>

            <br></br>

            <div>
                <Link style={{ marginRight: 25 }} href="/etapas"><button className="btn btn-secondary">Voltar</button></Link>
                <button className="btn btn-primary" onClick={props.etapa == null ? gravarEtapas : alterarEtapas}>Gravar</button>
            </div>

            <br></br><br></br>
            <h3>Etapas já cadastradas</h3>
            <table>
                <tbody>
                    <tr>
                        <th>Nº</th>
                        <th>Descrição</th>
                    </tr>
                    {
                        listaAndamentoEtapas.map(function (value, index) {
                            if (value.idObra == idObra.current[0].value) {
                                return (
                                    <tr key={index}>
                                        <th>{value.idEtapa}</th>
                                        <th>{value.descricaoEtapa}</th>
                                    </tr>
                                );
                            }
                        })
                    }
                </tbody>
            </table>

        </div>
    );
}