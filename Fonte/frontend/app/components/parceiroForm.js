'use client'
import { useEffect, useRef, useState } from "react";
import httpClient from "../utils/httpClient";
import Modal from 'react-modal';
import InputMask from 'react-input-mask';

export default function ParceiroForm(props) {

    const nomeParceiro = useRef('');
    const telParceiro = useRef('');
    const idAreaAtuacao = useRef(0);

    const [parceiro, setParceiro] = props.parceiro ? useState(props.parceiro) : useState({ idParceiro: 0, nomeParceiro: '', telParceiro: '', idAreaAtuacao: 0 });
    const [listaAreaAtuacao, setListaAreaAtuacao] = useState([]);

    const [nomeVazio, setNomeVazio] = useState(false);
    const [telVazio, setTelVazio] = useState(false);
    const [areaVazio, setAreaVazio] = useState(false);

    function camposVazios() {

        let nomeNaoPreenchido = nomeParceiro.current.value == "";
        let telNaoPreenchido = telParceiro.current.value == "";
        let areaNaoPreenchido = idAreaAtuacao.current.value == 0;

        setNomeVazio(nomeNaoPreenchido);
        setTelVazio(telNaoPreenchido);
        setAreaVazio(areaNaoPreenchido);
        return nomeNaoPreenchido || telNaoPreenchido || areaNaoPreenchido;
    }

    const [modalIsOpen, setModalIsOpen] = useState(false);
    function openModal() {
        setModalIsOpen(true);
    }
    function closeModal() {
        setModalIsOpen(false);
    }

    function carregarAreasAtuacao() {
        httpClient.get('/areaAtuacao/listar')
            .then(r => {
                return r.json();
            })
            .then(r => {
                setListaAreaAtuacao(r);
            });
    }

    function cadastrarParceiro() {
        let camposPreenchidos = !camposVazios();
        if (!camposPreenchidos) {
            alert('Preencha todos os campos!');
        }

        if (camposPreenchidos) {
            let status = 0;

            if (nomeParceiro.current.value != '' && telParceiro.current.value != '' && idAreaAtuacao.current.value > 0) {

                httpClient.post('/parceiros/gravar', {
                    nomeParceiro: nomeParceiro.current.value,
                    telParceiro: telParceiro.current.value,
                    idAreaAtuacao: idAreaAtuacao.current.value
                })
                    .then(r => {
                        status = r.status;
                        return r.json();
                    })
                    .then(r => {
                        alert(r.msg);
                        if (status == 200) {
                            nomeParceiro.current.value = '';
                            telParceiro.current.value = '';
                            idAreaAtuacao.current.value = 0;
                        }
                    });
            }
            else {
                alert('Preencha todos os campos!');
            }
        }
    }

    function alterarParceiro() {
        let status = 0;
        if (nomeParceiro.current.value != "" && telParceiro.current.value != "" && idAreaAtuacao.current.value > 0) {
            httpClient.put('/parceiros/alterar', {

                idParceiro: parceiro.idParceiro,
                nomeParceiro: nomeParceiro.current.value,
                telParceiro: telParceiro.current.value,
                idAreaAtuacao: idAreaAtuacao.current.value
            })
                .then(r => {
                    status = r.status;
                    return r.json();
                })
                .then(r => {
                    alert(r.msg);
                    if (status == 200) {
                        window.location.href = '/parceiros';
                    }
                })
        }
    }

    useEffect(() => {
        carregarAreasAtuacao();
    }, []);

    return (
        <div>

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <h1>{parceiro.idParceiro == 0 ? 'Cadastrar Novo Parceiro' : 'Alterar Parceiro'}</h1>
                <button onClick={openModal} className="btn btn-info" style={{ marginLeft: 10 }}>Ajuda</button>
            </div>


            {
                nomeVazio ?
                    <div className="form-group">
                        <label>Nome:</label>
                        <input style={{ border: '2px solid red' }} type="text" defaultValue={parceiro.nomeParceiro} className="form-control" ref={nomeParceiro} />
                    </div>
                    :
                    <div className="form-group">
                        <label>Nome:</label>
                        <input type="text" defaultValue={parceiro.nomeParceiro} className="form-control" ref={nomeParceiro} />
                    </div>
            }

            {
                telVazio ?
                    <div className="form-group">
                        <label>Telefone:</label>
                        <InputMask mask='(99) 99999-9999' style={{ border: '2px solid red' }} type="text" defaultValue={parceiro.telParceiro}  className="form-control" ref={telParceiro} />
                    </div>
                    :
                    <div className="form-group">
                        <label>Telefone:</label>
                        <InputMask mask='(99) 99999-9999' type="text" defaultValue={parceiro.telParceiro}  className="form-control" ref={telParceiro} />
                    </div>
            }

            {
                areaVazio ?
                    <div className="form-group">
                        <label>Área de Atuação</label>
                        <select className="form-control" style={{ width: 350, textAlign: 'center', border: '2px solid red' }}
                            defaultValue={parceiro.idAreaAtuacao} ref={idAreaAtuacao}>
                            <option value={0}>-- SELECIONE --</option>
                            {
                                listaAreaAtuacao.map((areaAtuacao, index) => {
                                    if (parceiro != null && parceiro.idAreaAtuacao == areaAtuacao.idArea) {
                                        return <option selected value={areaAtuacao.idArea}>{areaAtuacao.nomeAtuacao}</option>
                                    }
                                    else {
                                        return <option value={areaAtuacao.idArea}>{areaAtuacao.nomeAtuacao}</option>
                                    }
                                })
                            }
                        </select>
                    </div>
                    :
                    <div className="form-group">
                        <label>Área de Atuação</label>
                        <select className="form-select" style={{ width: 350, textAlign: 'center' }}
                            defaultValue={parceiro.idAreaAtuacao} ref={idAreaAtuacao}>
                            <option value={0}>-- SELECIONE --</option>
                            {
                                listaAreaAtuacao.map((areaAtuacao, index) => {
                                    if (parceiro != null && parceiro.idAreaAtuacao == areaAtuacao.idArea) {
                                        return <option selected value={areaAtuacao.idArea}>{areaAtuacao.nomeAtuacao}</option>
                                    }
                                    else {
                                        return <option value={areaAtuacao.idArea}>{areaAtuacao.nomeAtuacao}</option>
                                    }
                                })
                            }
                        </select>
                    </div>
            }

            <div>
                <button onClick={parceiro.idParceiro != 0 ? alterarParceiro : cadastrarParceiro}
                    className="btn btn-primary">{parceiro.idParceiro != 0 ? 'Alterar' : 'Cadastrar'}</button>
                <a href="/parceiros"><button style={{ marginLeft: 50 }} className="btn btn-danger">Cancelar</button></a>
            </div>

            <Modal style={{ content: { width: '500px', margin: 'auto' } }} isOpen={modalIsOpen} onRequestClose={closeModal}>
                <div>
                    <div className="form-group">
                        <label>Nome:</label>
                        <input type="text" className="form-control" placeholder="Nome Parceiro" disabled />
                    </div>
                    <div className="form-group">
                        <label>Telefone:</label>
                        <input mask="(99) 99999-9999" className="form-control" placeholder="(99) 99999-9999" disabled />
                    </div>
                    <label>Área de Atuação:</label>
                    <select style={{ width: 250, textAlign: 'center' }} className="form-control" disabled>
                        <option value={0}>Selecione</option>
                    </select>
                    <p>Clique e uma lista das áreas de atuação aparecerá, então é so escolher a que corresponde ao parceiro a ser cadastrado</p>
                    <button style={{ marginTop: 20 }} className="btn btn-danger" onClick={closeModal}>Fechar</button>
                </div>
            </Modal>
        </div>
    );
}