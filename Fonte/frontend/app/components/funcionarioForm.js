'use client'
import { useEffect, useRef, useState } from "react";
import httpClient from "../utils/httpClient";
import InputMask from 'react-input-mask';
import Modal from 'react-modal';
import Carregando from "./carregando";
import Link from "next/link";

export default function FuncionarioForm(props) {

    const nomeFuncionario = useRef('');
    const telFuncionario = useRef('');
    const cargoFuncionario = useRef(0);
    const [listaCargos, setListaCargos] = useState([]);
    const [nomeVazio, setNomeVazio] = useState(false);
    const [telVazio, setTelVazio] = useState(false);
    const [cargoVazio, setCargoVazio] = useState(false);
    const [carregando, setCarregando] = useState(true);
    const [gravando, setGravando] = useState(false);


    const [modalIsOpen, setModalIsOpen] = useState(false);
    function openModal() {
        setModalIsOpen(true);
    }
    function closeModal() {
        setModalIsOpen(false);
    }

    const [funcionario, setFuncionario] = props.funcionario ? useState(props.funcionario)
        : useState({ idFuncionario: 0, nomeFuncionario: '', telFuncionario: '', cargoFuncionario: 0 });

    function carregarCargos() {

        httpClient.get('/cargos/listar')
            .then(r => {
                return r.json();
            })
            .then(r => {
                setListaCargos(r);
                setCarregando(false);
            });
    }

    function camposVazios() {

        let nomeNaoPreenchido = nomeFuncionario.current.value == "";
        let telNaoPreenchido = telFuncionario.current.value == "";
        let cargoNaoPreenchido = cargoFuncionario.current.value == 0;

        setNomeVazio(nomeNaoPreenchido);
        setTelVazio(telNaoPreenchido);
        setCargoVazio(cargoNaoPreenchido);

        return nomeNaoPreenchido || telNaoPreenchido || cargoNaoPreenchido;
    }

    function alterarFuncionario() {

        let camposPreenchidos = !camposVazios();

        if (camposPreenchidos) {

            setGravando(true);
            let status = 0;

            httpClient.put('/funcionarios/alterar', {
                idFuncionario: funcionario.idFuncionario,
                nomeFuncionario: nomeFuncionario.current.value,
                telFuncionario: telFuncionario.current.value,
                cargoFuncionario: cargoFuncionario.current.value
            })
                .then(r => {
                    status = r.status;
                    return r.json();
                })
                .then(r => {
                    alert(r.msg);
                    setGravando(false);

                    if (status == 200) {
                        window.location.href = '/funcionarios';
                    }
                });
        }
        else {
            alert('Preencha todos os campos!');
        }
    }

    function cadastrarFuncionario() {

        let camposPreenchidos = !camposVazios();

        if (camposPreenchidos) {

            setGravando(true);
            let status = 0;

            httpClient.post('/funcionarios/gravar', {

                nomeFuncionario: nomeFuncionario.current.value,
                telFuncionario: telFuncionario.current.value,
                cargoFuncionario: cargoFuncionario.current.value
            })
                .then(r => {
                    status = r.status;
                    return r.json();
                })
                .then(r => {
                    alert(r.msg);
                    setGravando(false);

                    if (status == 200) {
                        window.location.href = '/funcionarios';
                    }
                });
        }
        else {
            alert('Preencha todos os campos!');
        }
    }

    useEffect(() => {
        carregarCargos();
    }, []);

    return (
        <div>
            {
                carregando ?
                <Carregando />
                :
                <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <h1>{funcionario.idFuncionario == 0 ? 'Cadastrar Novo Funcionário' : 'Alterar Funcionário'}</h1>
                    <button onClick={openModal} className="btn btn-info" style={{ marginLeft: 10 }}>Ajuda</button>
                </div>

                <div style={{ marginTop: 20, marginBottom: 20 }}><b>* - Obrigatório</b></div>

                {
                    nomeVazio ?
                        <div className="form-group">
                            <label>Nome:*</label>
                            <input type="text" defaultValue={funcionario.nomeFuncionario} className="form-control"
                                ref={el => nomeFuncionario.current = el} style={{ border: "2px solid red" }} />
                            <div style={{ color: "red" }}>Por favor, digite o nome.</div>
                        </div>
                        :
                        <div className="form-group">
                            <label>Nome:*</label>
                            <input type="text" defaultValue={funcionario.nomeFuncionario} className="form-control"
                                ref={el => nomeFuncionario.current = el} />
                        </div>
                }

                {
                    telVazio ?
                        <div className="form-group">
                            <label>Telefone:*</label>
                            <InputMask mask="(99) 99999-9999" defaultValue={funcionario.telFuncionario} className="form-control"
                                ref={el => telFuncionario.current = el} style={{ border: "2px solid red" }} />
                            <div style={{ color: "red" }}>Por favor, digite o telefone.</div>
                        </div>
                        :
                        <div className="form-group">
                            <label>Telefone:*</label>
                            <InputMask mask="(99) 99999-9999" defaultValue={funcionario.telFuncionario} className="form-control"
                                ref={el => telFuncionario.current = el} />
                        </div>
                }

                {
                    cargoVazio ?
                        <div className="form-group">
                            <label>Cargo:*</label>
                            <select style={{ width: 250, textAlign: 'center', border: "2px solid red" }}
                                defaultValue={funcionario.cargoFuncionario} className="form-control" ref={el => cargoFuncionario.current = el}>
                                <option value={0}>Selecione</option>
                                {
                                    listaCargos.map((cargo, index) => {
                                        return <option value={cargo.idCargo}>{cargo.nomeCargo}</option>
                                    })
                                }
                            </select>
                            <div style={{ color: "red" }}>Por favor, selecione o cargo.</div>
                        </div>
                        :
                        <div className="form-group">
                            <label>Cargo:*</label>
                            <select style={{ width: 250, textAlign: 'center' }} defaultValue={funcionario.cargoFuncionario} className="form-select"
                                ref={el => cargoFuncionario.current = el}>
                                <option value={0}>Selecione</option>
                                {
                                    listaCargos.map((cargo, index) => {
                                        if (funcionario.cargoFuncionario == cargo.idCargo) {
                                            return <option value={cargo.idCargo} selected={true}>{cargo.nomeCargo}</option>
                                        }
                                        else {
                                            return <option value={cargo.idCargo}>{cargo.nomeCargo}</option>
                                        }
                                    })
                                }
                            </select>
                        </div>
                }


                <div>
                    {
                        gravando ? <p style={{fontWeight: 'bold'}}>Aguardando gravação...</p> : <></>
                    }
                    <button onClick={funcionario.idFuncionario != 0 ? alterarFuncionario : cadastrarFuncionario}
                        className="btn btn-primary" disabled={gravando}>{funcionario.idFuncionario != 0 ? 'Alterar' : 'Cadastrar'}</button>
                    <Link href="/funcionarios"><button style={{ marginLeft: 50 }} className="btn btn-danger"  disabled={gravando}>Cancelar</button></Link>
                </div>
                </div>
            }
            
            <Modal style={{ content: { width: '500px', margin: 'auto' } }} isOpen={modalIsOpen} onRequestClose={closeModal}>
                <div>
                    <div className="form-group">
                        <label>Nome:*</label>
                        <input type="text" className="form-control" placeholder="Nome Funcionário" disabled />
                    </div>
                    <div className="form-group">
                        <label>Telefone:*</label>
                        <InputMask mask="(99) 99999-9999" className="form-control" placeholder="(99) 99999-9999" disabled />
                    </div>
                    <label>*Cargo:</label>
                    <select style={{ width: 250, textAlign: 'center' }} defaultValue={funcionario.cargoFuncionario} className="form-control"
                        ref={el => cargoFuncionario.current = el} disabled>
                        <option value={0}>Selecione</option>
                    </select>
                    <p>Clique e uma lista de cargos aparecerá, então é so escolher o cargo do funcionário a ser cadastrado</p>
                    <button style={{ marginTop: 20 }} className="btn btn-danger" onClick={closeModal}>Fechar</button>
                </div>
            </Modal>


        </div>
    )
}