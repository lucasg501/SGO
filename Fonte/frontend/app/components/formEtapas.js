'use client'
import { useEffect, useRef, useState } from "react";
import httpClient from "../utils/httpClient";
import Link from "next/link";
import { format } from 'date-fns';

export default function FormEtapas(props) {
    const idObra = useRef([]);
    const idEtapa = useRef([]);
    const dataPrevInicio = useRef([]);
    const dataPrevTermino = useRef([]);
    const dataFim = useRef([]);
    const descricaoEtapa = useRef([]);

    const [etapas, setEtapas] = useState({
        idAndamento: props.idAndamento || 0,
        idEtapa: props.idEtapa || 0,
        idObra: props.idObra || 0,
        dataPrevInicio: '',
        dataPrevFim: '',
        dataFim: '',
        descricaoEtapa: ''
    });

    const [listaObras, setListaObras] = useState([]);
    const [listaEtapas, setListaEtapas] = useState([]);

    useEffect(() => {
        if (props.idAndamento) {
            carregarDetalhesAndamento(props.idAndamento);
        }
        listarObras();
        listarEtapas();
    }, []);

    const convertIsoToDateString = (isoDate) => {
        if (!isoDate) return '';
        const date = new Date(isoDate);
        const year = date.getFullYear();
        let month = (date.getMonth() + 1).toString().padStart(2, '0');
        let day = date.getDate().toString().padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const carregarDetalhesAndamento = (idAndamento) => {
        httpClient.get(`/andamento/${idAndamento}`)
            .then(r => r.json())
            .then(r => {
                setEtapas({
                    ...etapas,
                    idObra: r.idObra,
                    dataPrevInicio: convertIsoToDateString(r.dataPrevInicio),
                    dataPrevFim: convertIsoToDateString(r.dataPrevFim),
                    dataFim: convertIsoToDateString(r.dataFim),
                });
            })
            .catch(error => {
                console.error('Erro ao carregar detalhes do andamento:', error);
            });
    };

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

    function gravarEtapas() {
        let status = 0;
        let etapasArray = [];

        const idObraValue = idObra.current[0] ? idObra.current[0].value : null;

        for (let i = 0; i < etapas.idEtapa + 1; i++) {
            const idEtapaValue = idEtapa.current[i] ? idEtapa.current[i].value : null;
            const dataPrevInicioValue = dataPrevInicio.current[i] ? dataPrevInicio.current[i].value : null;
            const dataPrevTerminoValue = dataPrevTermino.current[i] ? dataPrevTermino.current[i].value : null;
            const dataFimValue = dataFim.current[i] ? (dataFim.current[i].value !== '' ? dataFim.current[i].value : null) : null;
            const descricaoEtapaValue = descricaoEtapa.current[i] ? descricaoEtapa.current[i].value : null;

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

        httpClient.post('/andamentoEtapas/gravar', etapasArray)
            .then(r => {
                status = r.status;
                return r.json();
            })
            .then(r => {
                alert(r.msg);
                if (status === 200) {
                    window.location.reload();
                }
            });
    }

    return (
        <div>
            <h1>{props.etapa.idAndamento != null ? <h1>Marcar como finalizada</h1> : <h1>Gerenciar Etapas da Obra</h1>}</h1>

            <div>
                <div className="from-group">
                    <label>Obra:</label>
                    <select ref={el => idObra.current[0] = el} style={{ width: '10%', textAlign: 'center' }} defaultValue={props.etapa.idObra} className="form-control">
                        <option value={0}>Selecione</option>
                        {
                            listaObras.map(function (value, index) {
                                if (props.etapa != null && props.etapa.idObra == value.idObra) {
                                    return <option selected value={value.idObra}>{value.bairro}</option>
                                } else {
                                    return <option value={value.idObra}>{value.bairro}</option>
                                }
                            })
                        }
                    </select>
                </div>
                <br></br>

                {[...Array(etapas.idEtapa + 1)].map((_, index) => (
                    <div key={index}>
                        <div className="form-group">
                            <label>Etapa {index + 1}:</label>
                            <select defaultValue={props.etapa.idEtapa} ref={el => idEtapa.current[index] = el} style={{ width: '10%', textAlign: 'center' }} className="form-control">
                                <option value={0}>Selecione</option>
                                {
                                    listaEtapas.map(function (value, index) {
                                        if (props.etapa != null && props.etapa.idEtapa == value.idEtapa) {
                                            return <option selected value={value.idEtapa}>{value.nomeEtapa}</option>
                                        } else {
                                            return <option value={value.idEtapa}>{value.nomeEtapa}</option>
                                        }
                                    })
                                }
                            </select>
                        </div>

                        <div className="form-group" style={{ display: 'inline-block', width: '15%', marginRight: '10px' }}>
                            <label>Início:</label>
                            <input defaultValue={props.etapa.dataPrevInicio} value={convertIsoToDateString(etapas.dataPrevInicio)} onChange={(e) => setEtapas({ ...etapas, dataPrevInicio: e.target.value })} style={{ width: '80%' }} type="date" className="form-control" />
                        </div>
                        <div className="form-group" style={{ display: 'inline-block', width: '25%' }}>
                            <label>Previsão de Término:</label>
                            <input defaultValue={props.etapa.dataPrevTermino} value={convertIsoToDateString(etapas.dataPrevTermino)} onChange={(e) => setEtapas({ ...etapas, dataPrevTermino: e.target.value })} style={{ width: '40%' }} type="date" className="form-control" />
                        </div>

                        <div style={{ display: 'flex', alignItems: 'baseline' }}>
                            <div className="form-group" style={{ width: '15%', marginRight: '10px' }}>
                                <label style={{ display: 'block' }}>Fim:</label>
                                <input defaultValue={props.etapa.dataFim} value={convertIsoToDateString(etapas.dataFim)} onChange={(e) => setEtapas({ ...etapas, dataFim: e.target.value })} style={{ width: '80%' }} type="date" className="form-control" placeholder="Fim" />
                            </div>
                            <div className="form-group" style={{ width: '25%' }}>
                                <label style={{ display: 'block' }}>Descrição:</label>
                                <textarea defaultValue={props.etapa.descricaoEtapa} ref={el => descricaoEtapa.current[index] = el} style={{ width: '100%', minHeight: '100px' }} className="form-control" placeholder="Descrição" />
                            </div>
                        </div>
                    </div>
                ))}


                <div className="form-group">
                    <div style={{ display: 'inline-block' }}>
                        <button className="btn btn-danger" onClick={removerCampo}>-</button>
                    </div>

                    <div style={{ display: 'inline-block', marginLeft: 15 }}>
                        <button className="btn btn-primary" onClick={adicionarCampo}>+</button>
                    </div>
                </div>
            </div>

            <br></br>

            <div>
                <Link style={{ marginRight: 25 }} href="/etapas"><button className="btn btn-secondary">Voltar</button></Link>
                <button className="btn btn-primary" onClick={gravarEtapas}>Gravar</button>
            </div>
        </div>
    );
}
