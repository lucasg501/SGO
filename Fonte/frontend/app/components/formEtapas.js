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

    const [etapas, setEtapas] = useState(props.etapas ? props.etapas : { idEtapa: 0, idObra: 0, dataPrevInicio: '', dataPrevFim: '', dataFim: '', descricaoEtapa: '' });
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
            idObra: prevState.idObra || (listaObras.length > 0 ? listaObras[0].idObra : 0) // Definindo um valor padrão para idObra
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

    function gravarEtapas(){
        let status = 0;
        let etapasArray = [];
    
        // Verifique se o idObra do primeiro elemento não é undefined
        const idObraValue = idObra.current[0] ? idObra.current[0].value : null;
    
        // Use etapas.length para percorrer todos os elementos presentes em etapas
        for(let i = 0; i < etapas.idEtapa + 1; i++){
            const idEtapaValue = idEtapa.current[i] ? idEtapa.current[i].value : null;
            const dataPrevInicioValue = dataPrevInicio.current[i] ? dataPrevInicio.current[i].value : null;
            const dataPrevTerminoValue = dataPrevTermino.current[i] ? dataPrevTermino.current[i].value : null;
            const dataFimValue = dataFim.current[i] ? (dataFim.current[i].value !== '' ? dataFim.current[i].value : null) : null;
            const descricaoEtapaValue = descricaoEtapa.current[i] ? descricaoEtapa.current[i].value : null;
            
            const etapa = {
                idObra: idObraValue, // Use o idObra do primeiro elemento
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
                if(status === 200){
                    window.location.reload();
                }
            });
    }

    function alterarEtapas(){
        let status = 0;
        httpClient.put('/andamentoEtapas/alterar',{
            idObra: props.etapa.idObra,
            idEtapa: props.etapa.idEtapa,
            dataPrevInicio: props.etapa.dataPrevInicio,
            dataPrevTermino: props.etapa.dataPrevTermino,
            dataFim: dataFim.current[i].value,
            descricaoEtapa: props.etapa.descricaoEtapa
        })
        .then(r=>{
            status = r.status;
            return r.json();
        })
        .then(r=>{
            alert(r.msg);
            if(status === 200){
                window.location.reload();
            }
        })
    }
    
    
    return (
        <div>
            <h1>Gerenciar Etapas da Obra</h1>

            <div>
                <div className="form-group">
                    <label>Obra:</label>
                    <select ref={el => idObra.current[0] = el} style={{ width: '10%', textAlign: 'center' }} defaultValue={props.etapa.idObra} className="form-control">
                        <option value={0}>Selecione</option>
                        {
                            listaObras.map(function(value,index){
                                if(value.idObra === props.etapa.idObra){
                                    return <option key={index} value={value.idObra} selected>{value.bairro}</option>
                                }else{
                                    return <option key={index} value={value.idObra}>{value.bairro}</option>
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
                                    listaEtapas.map(function(value,index){
                                        if(value.idEtapa === props.etapa.idEtapa){
                                            return <option key={index} value={value.idEtapa} selected>{value.nomeEtapa}</option>
                                        }else{
                                            return <option key={index} value={value.idEtapa}>{value.nomeEtapa}</option>
                                        }
                                    })
                                }
                            </select>
                        </div>

                        <div className="form-group" style={{ display: 'inline-block', width: '15%', marginRight: '10px' }}>
                            <label>Início:</label>
                            <input defaultValue={props.etapa ? props.etapa.dataPrevInicio : ''} ref={el => dataPrevInicio.current[index] = el} style={{ width: '80%' }} type="date" className="form-control" placeholder="Início" />
                        </div>
                        <div className="form-group" style={{ display: 'inline-block', width: '25%' }}>
                            <label>Previsão de Término:</label>
                            <input defaultValue={props.etapa ? props.etapa.dataPrevTermino : ''} ref={el => dataPrevTermino.current[index] = el} style={{ width: '40%' }} type="date" className="form-control" placeholder="Previsão de Término" />
                        </div>

                        <div style={{ display: 'flex', alignItems: 'baseline' }}>
                            <div className="form-group" style={{ width: '15%', marginRight: '10px' }}>
                                <label style={{ display: 'block' }}>Fim:</label>
                                <input defaultValue={props.etapa ? props.etapa.dataFim : ''} ref={el => dataFim.current[index] = el} style={{ width: '80%' }} type="date" className="form-control" placeholder="Fim" />
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
