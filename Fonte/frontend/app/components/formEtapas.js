'use client'
import { useEffect, useRef, useState } from "react";
import httpClient from "../utils/httpClient";
import Link from "next/link";
import Modal from 'react-modal';

export default function FormEtapas(props) {

    const idObra = useRef([]);
    const idEtapa = useRef([]);
    const dataPrevInicio = useRef([]);
    const dataPrevTermino = useRef([]);
    const dataFim = useRef([]);
    const descricaoEtapa = useRef([]);
    const [listaAndamentoEtapas, setListaAndamentoEtapas] = useState([]);

    const [obraVazia, setObraVazia] = useState(false);
    const [etapaVazia, setEtapaVazia] = useState(false);
    const [dataPrevInicioVazia, setDataPrevInicioVazia] = useState(false);
    const [dataPrevTerminoVazia, setDataPrevTerminoVazia] = useState(false);

    const [gravando, setGravando] = useState(false);


    function camposVazios() {

        let obraNaoPreenchido = idObra.current[0].value == 0;
        let etapaNaoPreenchido = idEtapa.current[0].value == 0;
        let dataPrevInicioNaoPreenchido = dataPrevInicio.current[0].value == "";
        let dataPrevTerminoNaoPreenchido = dataPrevTermino.current[0].value == "";

        setObraVazia(obraNaoPreenchido);
        setEtapaVazia(etapaNaoPreenchido);
        setDataPrevInicioVazia(dataPrevInicioNaoPreenchido);
        setDataPrevTerminoVazia(dataPrevTerminoNaoPreenchido);

        return obraNaoPreenchido || etapaNaoPreenchido || dataPrevInicioNaoPreenchido || dataPrevTerminoNaoPreenchido;
    }

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

        // Verificações adicionadas para garantir que as referências existam
        if (idEtapa.current && idEtapa.current.length > 0) {
            idEtapa.current.pop(); // Remove a referência do último elemento
        }
        if (dataPrevInicio.current && dataPrevInicio.current.length > 0) {
            dataPrevInicio.current.pop(); // Remove a referência do último elemento
        }
        if (dataPrevTermino.current && dataPrevTermino.current.length > 0) {
            dataPrevTermino.current.pop(); // Remove a referência do último elemento
        }
        if (dataFim.current && dataFim.current.length > 0) {
            dataFim.current.pop(); // Remove a referência do último elemento
        }
        if (descricaoEtapa.current && descricaoEtapa.current.length > 0) {
            descricaoEtapa.current.pop(); // Remove a referência do último elemento
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
        let camposPreenchidos = !camposVazios();
        if (!camposPreenchidos) {
            alert("Preencha todos os campos obrigatórios");
            return;
        }

        // Verificações adicionadas para garantir que as referências não sejam nulas antes de acessar suas propriedades
        if (
            (idObra.current && idObra.current[0] && idObra.current[0].value === "0") ||
            (idEtapa.current && idEtapa.current.some(ref => ref && ref.value === "0")) ||
            (dataPrevInicio.current && dataPrevInicio.current.some(ref => ref && ref.value === "")) ||
            (dataPrevTermino.current && dataPrevTermino.current.some(ref => ref && ref.value === ""))
        ) {
            alert("Preencha todos os campos obrigatórios");
            return;
        }

        let status = 0;
        let etapasArray = [];
        let hasInvalidDate = false;

        const idObraValue = idObra.current && idObra.current[0] ? idObra.current[0].value : null;

        for (let i = 0; i < etapas.idEtapa + 1; i++) {
            const idEtapaValue = idEtapa.current && idEtapa.current[i] ? idEtapa.current[i].value : null;
            const dataPrevInicioValue = dataPrevInicio.current && dataPrevInicio.current[i] ? dataPrevInicio.current[i].value : null;
            const dataPrevTerminoValue = dataPrevTermino.current && dataPrevTermino.current[i] ? dataPrevTermino.current[i].value : null;
            const dataFimValue = dataFim.current && dataFim.current[i] ? (dataFim.current[i].value !== '' ? dataFim.current[i].value : null) : null;
            const descricaoEtapaValue = descricaoEtapa.current && descricaoEtapa.current[i] ? descricaoEtapa.current[i].value : null;

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

            setGravando(true);

            httpClient.post('/andamentoEtapas/gravar', etapasArray)
                .then(r => {
                    status = r.status;
                    return r.json();
                })
                .then(r => {
                    alert(r.msg);
                    setGravando(false);

                    if (status === 200) {
                        window.location.reload();
                    }
                });
        }
    }



    function alterarEtapas() {
        let camposPreenchidos = !camposVazios();
        if (!camposPreenchidos) {
            alert("Preencha todos os campos obrigatórios");
        }

        if (camposPreenchidos) {
            const dataPrevInicioValue = formatarData(props.etapa.dataPrevInicio);
            const dataPrevTerminoValue = formatarData(props.etapa.dataPrevTermino);
            const dataFimValue = formatarData(dataFim.current[0].value);

            if (dataFimValue < dataPrevInicioValue) {
                alert("A data de fim não pode ser anterior à data de início.");
                return; // Retorna sem fazer a solicitação HTTP PUT
            }

            // Se a data de fim for válida, continuar com a solicitação HTTP PUT
            let status = 0;
            httpClient.put('/andamentoEtapas/alterar', {
                idAndamento: props.etapa.idAndamento,
                idObra: props.etapa.idObra,
                idEtapa: props.etapa.idEtapa,
                dataPrevInicio: dataPrevInicioValue,
                dataPrevTermino: dataPrevTerminoValue,
                dataFim: dataFimValue,
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
                });
        }
    }


    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <h1>{props.etapa != null ? 'Marcar Como Finalizada' : 'Gerenciar Etapas da Obra'}</h1>
                <button onClick={openModal} className="btn btn-info" style={{ marginLeft: 10 }}>Ajuda</button>
            </div>

            <div>
                {
                    obraVazia ?
                        <div className="from-group">
                            <label>Obra:*</label>
                            <select onChange={() => listarAndamentoEtapas(idObra.current[0].value)} ref={el => idObra.current[0] = el} style={{ width: 200, textAlign: 'center', border: '2px solid red' }} defaultValue={props.etapa ? props.etapa.idObra : 0} className="form-control" disabled={props.etapa != null}>

                                <option value={0}>Selecione</option>
                                {listaObras.map(function (value, index) {
                                    if (value.terminada !== 'S') { // Verifica se a obra não está terminada
                                        const isSelected = props.etapa && value.idObra === props.etapa.idObra;
                                        return (
                                            <option key={index} value={value.idObra} selected={isSelected}>
                                                {value.bairro}
                                            </option>
                                        );
                                    }
                                    return null; // Retorna null para não renderizar nada se a obra estiver terminada
                                })}

                            </select>
                        </div>
                        :
                        <div className="from-group">
                            <label>Obra:*</label>
                            <select onChange={() => listarAndamentoEtapas(idObra.current[0].value)} ref={el => idObra.current[0] = el} style={{ width: 200, textAlign: 'center' }} defaultValue={props.etapa ? props.etapa.idObra : 0} className="form-control" disabled={props.etapa != null}>

                                <option value={0}>Selecione</option>
                                {listaObras.map(function (value, index) {
                                    if (value.terminada !== 'S') { // Verifica se a obra não está terminada
                                        const isSelected = props.etapa && value.idObra === props.etapa.idObra;
                                        return (
                                            <option key={index} value={value.idObra} selected={isSelected}>
                                                {value.bairro}
                                            </option>
                                        );
                                    }
                                    return null; // Retorna null para não renderizar nada se a obra estiver terminada
                                })}

                            </select>
                        </div>
                }

                <br></br>

                {[...Array(etapas.idEtapa + 1)].map((_, index) => (
                    <div key={index}>
                        {
                            etapaVazia ?
                                <div className="form-group">
                                    <label>Etapa* {index + 1}:</label>
                                    <select defaultValue={props.etapa ? props.etapa.idEtapa : 0} ref={el => idEtapa.current[index] = el} style={{ width: 200, textAlign: 'center', border: '2px solid red' }} className="form-control" disabled={props.etapa != null}>
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
                                :
                                <div className="form-group">
                                    <label>Etapa* {index + 1}:</label>
                                    <select defaultValue={props.etapa ? props.etapa.idEtapa : 0} ref={el => idEtapa.current[index] = el} style={{ width: 200, textAlign: 'center' }} className="form-control" disabled={props.etapa != null}>
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
                        }

                        {
                            dataPrevInicioVazia ?
                                <div className="form-group" style={{ display: 'inline-block', width: '17.5%', marginRight: '10px' }}>
                                    <label>Início:*</label>
                                    <input disabled={props.etapa != null} defaultValue={props.etapa ? formatarData(props.etapa.dataPrevInicio) : ''} ref={el => dataPrevInicio.current[index] = el} style={{ width: '80%', border: '2px solid red' }} type="date" className="form-control" placeholder="Início" />
                                </div>
                                :
                                <div className="form-group" style={{ display: 'inline-block', width: '17.5%', marginRight: '10px' }}>
                                    <label>Início:*</label>
                                    <input disabled={props.etapa != null} defaultValue={props.etapa ? formatarData(props.etapa.dataPrevInicio) : ''} ref={el => dataPrevInicio.current[index] = el} style={{ width: '80%' }} type="date" className="form-control" placeholder="Início" />
                                </div>
                        }
                        {
                            dataPrevTerminoVazia ?
                                <div className="form-group" style={{ display: 'inline-block', width: '35%' }}>
                                    <label>Previsão de Término:*</label>
                                    <input disabled={props.etapa != null} defaultValue={props.etapa ? formatarData(props.etapa.dataPrevTermino) : ''} ref={el => dataPrevTermino.current[index] = el} style={{ width: '40%', border: '2px solid red' }} type="date" className="form-control" placeholder="Previsão de Término" />
                                </div>
                                :
                                <div className="form-group" style={{ display: 'inline-block', width: '35%' }}>
                                    <label>Previsão de Término:*</label>
                                    <input disabled={props.etapa != null} defaultValue={props.etapa ? formatarData(props.etapa.dataPrevTermino) : ''} ref={el => dataPrevTermino.current[index] = el} style={{ width: '40%' }} type="date" className="form-control" placeholder="Previsão de Término" />
                                </div>
                        }

                        <div style={{ display: 'flex', alignItems: 'baseline' }}>
                            <div className="form-group" style={{ width: '17.5%', marginRight: '10px' }}>
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
                {
                    gravando ? <p style={{ fontWeight: 'bold' }}>Aguardando gravação...</p> : <></>
                }
                <Link style={{ marginRight: 25 }} href="/etapas"><button className="btn btn-secondary" disabled={gravando}>Voltar</button></Link>
                <button className="btn btn-primary" onClick={props.etapa == null ? gravarEtapas : alterarEtapas} disabled={gravando}>Gravar</button>
            </div>

            <br></br><br></br>
            <h3>Etapas já cadastradas</h3>
            <table className="table">
                <thead>
                    <tr>
                        <th>Nº</th>
                        <th>Descrição</th>
                        <th>Data Inicio</th>
                        <th>Data Prev. Término</th>
                        <th>Data Fim</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        listaAndamentoEtapas.map(function (value, index) {
                            if (value.idObra == idObra.current[0].value) {
                                return (
                                    <tr key={index}>
                                        <td>{value.idEtapa}</td>
                                        <td>{value.descricaoEtapa}</td>
                                        <td>{new Date(value.dataPrevInicio).toLocaleDateString('pt-BR')}</td>
                                        <td>{new Date(value.dataPrevTermino).toLocaleDateString('pt-BR')}</td>
                                        <td>{value.DataFim == null ? 'N/A' : new Date(value.dataFim).toLocaleDateString('pt-BR')}</td>
                                    </tr>
                                );
                            }
                        })
                    }
                </tbody>
            </table>

            <Modal style={{ content: { width: '500px', margin: 'auto' } }} isOpen={modalIsOpen} onRequestClose={closeModal}>
                <div className="form-group">
                    <label>Obra:</label>
                    <select disabled style={{ width: '100%' }} className="form-control">
                        <option value={0} disabled selected>Clique e selecione a obra desejada</option>
                    </select>
                </div>
                <br />

                {[...Array(etapas.idEtapa + 1)].map((_, index) => (
                    <div key={index}>
                        <div className="form-group">
                            <label>Etapa {index + 1}:</label>
                            <select style={{ width: '100%' }} className="form-control" disabled>
                                <option value={0} disabled selected>Clique e selecione a etapa desejada</option>
                            </select>
                        </div>

                        <div className="form-group" style={{ display: 'inline-block', width: '50%', marginRight: '10px' }}>
                            <label>Início:</label>
                            <input style={{ width: '100%' }} type="date" className="form-control" placeholder="Início" disabled />
                        </div>
                        <div className="form-group" style={{ display: 'inline-block', width: '50%' }}>
                            <label>Previsão de Término:</label>
                            <input style={{ width: '100%' }} type="date" className="form-control" placeholder="Previsão de Término" disabled />
                        </div>

                        <div style={{ display: 'flex', alignItems: 'baseline' }}>
                            <div className="form-group" style={{ width: '50%', marginRight: '10px' }}>
                                <label style={{ display: 'block' }}>Fim:</label>
                                <input style={{ width: '100%' }} type="date" className="form-control" placeholder="Fim" disabled />
                            </div>
                            <div className="form-group" style={{ width: '50%' }}>
                                <label style={{ display: 'block' }}>Descrição:</label>
                                <textarea style={{ width: '100%', minHeight: '100px' }} className="form-control" placeholder="Breve descrição de como será a etapa" disabled />
                            </div>
                        </div>
                    </div>
                ))}

                <div style={{ display: 'flex', alignItems: 'baseline' }} className="form-group">
                    <div style={{ display: 'inline-block' }}>
                        <button disabled className="btn btn-danger">-</button>

                    </div>
                    <p>Clique para diminuir a quantidade de campos para cadastro de etapas</p>
                    <div style={{ display: 'inline-block', marginLeft: 15 }}>
                        <button disabled className="btn btn-primary" >+</button>
                    </div>
                    <p>Clique para aumentar a quantidade de campos para cadastro de etapas</p>
                </div>

                <br /><br />
                <h3>Etapas já cadastradas</h3>
                <table>
                    <p>Etapas já cadastradas apareceram aqui</p>
                </table>
                <button className="btn btn-danger" onClick={closeModal}>Fechar</button>
            </Modal>


        </div>
    );
}
