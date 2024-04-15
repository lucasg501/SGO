'use client'
import { useEffect, useRef, useState } from "react";
import httpClient from "../utils/httpClient";
import Link from "next/link";

export default function FormEtapas(props) {

    const idObra = useRef(0);
    const idEtapa = useRef(0);
    const dataPrevInicio = useRef('');
    const dataPrevTermino = useRef('');
    const dataFim = useRef('');
    const descricaoEtapa = useRef('');

    const [etapas, setEtapas] = props.etapas ? useState(props.etapas) : useState({ idEtapa: 0, idObra: 0, dataPrevInicio: '', dataPrevFim: '', dataFim: '', descricaoEtapa: '' });
    const [listaObras, setListaObras] = useState([]);
    const [listaEtapas, setListaEtapas] = useState([]);

    useEffect(() => {
        listarObras();
        listarEtapas();
    }, []);

    const adicionarCampo = () => {
        setEtapas(prevState => ({
            ...prevState,
            idEtapa: prevState.idEtapa + 1
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
            .then(r => {
                return r.json();
            })
            .then(r => {
                setListaObras(r);
            });
    }

    function listarEtapas() {
        httpClient.get('/etapas/listar')
            .then(r => {
                return r.json();
            })
            .then(r => {
                setListaEtapas(r);
            });
    }

    function gravarEtapas(){
        let status = 0;
        const dataFimValue = dataFim.current.value !== '' ? dataFim.current.value : null;
    
        if(idObra.current.value > 0 && idEtapa.current.value > 0 && dataPrevInicio.current.value !== '' && dataPrevTermino.current.value !== '' && descricaoEtapa.current.value !== ''){
            httpClient.post('/andamentoEtapas/gravar',{
                idObra: idObra.current.value,
                idEtapa: idEtapa.current.value,
                dataPrevTermino: dataPrevTermino.current.value,
                dataPrevInicio: dataPrevInicio.current.value,
                dataFim: dataFimValue,
                descricaoEtapa: descricaoEtapa.current.value
            })
            .then(r=>{
                status = r.status;
                return r.json();
            })
            .then(r=>{
                alert(r.msg);
                if(status == 200){
                    window.location.href = '/etapas';
                }
            })
        }
    }
    

    return (
        <div>
            <h1>Gerenciar Etapas da Obra</h1>

            <div>
                <div className="from-group">
                    <label>Obra:</label>
                    <select ref={idObra} style={{ width: '10%', textAlign: 'center' }} defaultValue={etapas.idObra} className="form-control">
                        <option value={0}>Selecione</option>
                        {listaObras.map((value, index) => (
                            <option key={index} value={value.idObra}>{value.bairro}</option>
                        ))}
                    </select>
                </div>
                <br></br>

                {[...Array(etapas.idEtapa + 1)].map((_, index) => (
                    <div key={index}>
                        <div className="form-group">
                            <label>Etapa {index + 1}:</label>
                            <select ref={idEtapa} style={{ width: '10%', textAlign: 'center' }} className="form-control">
                                <option value={0}>Selecione</option>
                                {listaEtapas.map((value, index) => (
                                    <option key={index} value={value.idEtapa}>{value.nomeEtapa}</option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group" style={{ display: 'inline-block', width: '15%', marginRight: '10px' }}>
                            <label>Início:</label>
                            <input ref={dataPrevInicio} style={{ width: '80%' }} type="date" className="form-control" placeholder="Início" />
                        </div>
                        <div className="form-group" style={{ display: 'inline-block', width: '25%' }}>
                            <label>Previsão de Término:</label>
                            <input ref={dataPrevTermino} style={{ width: '40%' }} type="date" className="form-control" placeholder="Previsão de Término" />
                        </div>

                        <div style={{ display: 'flex', alignItems: 'baseline' }}>
                            <div className="form-group" style={{ width: '15%', marginRight: '10px' }}>
                                <label style={{ display: 'block' }}>Fim:</label>
                                <input ref={dataFim} style={{ width: '80%' }} type="date" className="form-control" placeholder="Fim" />
                            </div>
                            <div className="form-group" style={{ width: '25%' }}>
                                <label style={{ display: 'block' }}>Descrição:</label>
                                <textarea ref={descricaoEtapa} style={{ width: '100%', minHeight: '100px' }} className="form-control" placeholder="Descrição" />
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
