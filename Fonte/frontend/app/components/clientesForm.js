'use client'
import httpClient from "@/app/utils/httpClient";
import { useRef, useState } from "react";
import InputMask from 'react-input-mask';
import Modal from 'react-modal';

export default function ClienteForm(props) {
    const idCli = useRef('');
    const nomeCli = useRef('');
    const telCli = useRef('');
    const emailCli = useRef('');
    const rgCli = useRef('');
    const cpfCli = useRef('');
    const enderecoCli = useRef('');
    const bairroCli = useRef('');
    const cidadeCli = useRef('');
    const cepCli = useRef('');

    const [nomeVazio, setNomeVazio] = useState(false);
    const [telVazio, setTelVazio] = useState(false);
    const [emailVazio, setEmailVazio] = useState(false);
    const [rgVazio, setRgVazio] = useState(false);
    const [cpfVazio, setCpfVazio] = useState(false);
    const [enderecoVazio, setEnderecoVazio] = useState(false);
    const [bairroVazio, setBairroVazio] = useState(false);
    const [cidadeVazio, setCidadeVazio] = useState(false);
    const [cepVazio, setCepVazio] = useState(false);

    function camposVazios() {

        let nomeNaoPreenchido = nomeCli.current.value == "";
        let telNaoPreenchido = telCli.current.value == "";
        let emailNaoPreenchido = emailCli.current.value == "";
        let rgNaoPreenchido = rgCli.current.value == "";
        let cpfNaoPreenchido = cpfCli.current.value == "";
        let enderecoNaoPreenchido = enderecoCli.current.value == "";
        let bairroNaoPreenchido = bairroCli.current.value == "";
        let cidadeNaoPreenchido = cidadeCli.current.value == "";
        let cepNaoPreenchido = cepCli.current.value == "";

        setNomeVazio(nomeNaoPreenchido);
        setTelVazio(telNaoPreenchido);
        setEmailVazio(emailNaoPreenchido);
        setRgVazio(rgNaoPreenchido);
        setCpfVazio(cpfNaoPreenchido);
        setEnderecoVazio(enderecoNaoPreenchido);
        setBairroVazio(bairroNaoPreenchido);
        setCidadeVazio(cidadeNaoPreenchido);
        setCepVazio(cepNaoPreenchido);

        return nomeNaoPreenchido || telNaoPreenchido || emailNaoPreenchido || rgNaoPreenchido || cpfNaoPreenchido || enderecoNaoPreenchido || bairroNaoPreenchido || cidadeNaoPreenchido || cepNaoPreenchido;
    }

    const [cliente, setCliente] = props.cliente ? useState(props.cliente) : useState({ idCli: 0, nomeCli: '', telCli: '', emailCli: '', rgCli: '', cpfCli: '', enderecoCli: '', bairroCli: '', cidadeCli: '', cepCli: '' });

    const [modalIsOpen, setModalIsOpen] = useState(false);

    function cadastrarCliente() {

        let camposPreenchidos = !camposVazios();
        if(!camposPreenchidos){
            alert("Preencha corretamente todos os campos!");
        }
        if (camposPreenchidos) {
            let status = 0;
            if (nomeCli.current.value !== '' && telCli.current.value !== '' && emailCli.current.value !== '' && rgCli.current.value !== '' && cpfCli.current.value !== '' && enderecoCli.current.value !== '' && bairroCli.current.value !== '' && cidadeCli.current.value !== '' && cepCli.current.value !== '') {
                httpClient.post('/clientes/gravar', {
                    nomeCli: nomeCli.current.value,
                    telCli: telCli.current.value,
                    emailCli: emailCli.current.value,
                    rgCli: rgCli.current.value,
                    cpfCli: cpfCli.current.value,
                    enderecoCli: enderecoCli.current.value,
                    bairroCli: bairroCli.current.value,
                    cidadeCli: cidadeCli.current.value,
                    cepCli: cepCli.current.value
                })
                    .then(r => {
                        status = r.status;
                        return r.json();
                    })
                    .then(r => {
                        alert(r.msg);
                        if (status === 200) {
                            window.location.href = '/clientes';
                        }
                    })
            } else {
                alert('Preencha todos os campos!');
            }
        }
    }

    function alterarCliente() {
        let camposPreenchidos = !camposVazios();

        if(!camposPreenchidos){
            alert("Preencha corretamente todos os campos!");
        }

        if (camposPreenchidos) {
            let status = 0;
            if (nomeCli.current.value !== '' && telCli.current.value !== '' && emailCli.current.value !== '' && rgCli.current.value !== '' && cpfCli.current.value !== '' && enderecoCli.current.value !== '' && bairroCli.current.value !== '' && cidadeCli.current.value !== '' && cepCli.current.value !== '') {
                httpClient.put('/clientes/alterar', {
                    idCli: cliente.idCli,
                    nomeCli: nomeCli.current.value,
                    telCli: telCli.current.value,
                    emailCli: emailCli.current.value,
                    rgCli: rgCli.current.value,
                    cpfCli: cpfCli.current.value,
                    enderecoCli: enderecoCli.current.value,
                    bairroCli: bairroCli.current.value,
                    cidadeCli: cidadeCli.current.value,
                    cepCli: cepCli.current.value
                })
                    .then(r => {
                        status = r.status;
                        return r.json();
                    })
                    .then(r => {
                        alert(r.msg);
                        if (status === 200) {
                            window.location.href = '/clientes';
                        }
                    })
            }
        }
    }

    function openModal() {
        setModalIsOpen(true);
    }

    function closeModal() {
        setModalIsOpen(false);
    }
    function applyRedBorder(ref) {
        return ref.current.value === '' ? 'red-border' : '';
    }

    function getClienteData() {
        return [
            { label: 'Nome', value: cliente.nomeCli },
            { label: 'Telefone', value: cliente.telCli },
            { label: 'E-mail', value: cliente.emailCli },
            { label: 'RG', value: cliente.rgCli },
            { label: 'CPF', value: cliente.cpfCli },
            { label: 'Endereço', value: cliente.enderecoCli },
            { label: 'Bairro', value: cliente.bairroCli },
            { label: 'Cidade', value: cliente.cidadeCli },
            { label: 'CEP', value: cliente.cepCli },
        ];
    }

    return (<div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <h1>{cliente.idCli === 0 ? 'Cadastrar Novo Cliente' : 'Alterar Cliente'}</h1>
            <button onClick={openModal} className="btn btn-info" style={{ marginLeft: 10 }}>Ajuda</button>
        </div>

        <div style={{ marginTop: 30 }}>
            {
                nomeVazio ?
                    <div className="form-group">
                        <label>Nome:*</label>
                        <input type="text" defaultValue={cliente.nomeCli} className={`form-control ${applyRedBorder(nomeCli)}`} ref={nomeCli} style={{ border: "2px solid red" }}/>
                    </div>
                    :
                    <div className="form-group">
                        <label>Nome:*</label>
                        <input type="text" defaultValue={cliente.nomeCli} className={`form-control ${applyRedBorder(nomeCli)}`} ref={nomeCli}  />
                    </div>

            }

            {/* Adicione a classe CSS condicional aos outros campos obrigatórios */}
            <div style={{ display: 'inline-flex' }}>
                {
                    telVazio ?
                        <div className="form-group">
                            <label>Telefone:*</label>
                            <InputMask mask="(99) 99999-9999" defaultValue={cliente.telCli} className={`form-control ${applyRedBorder(telCli)}`} ref={telCli}
                                style={{ width: 400, marginRight: 40 , border: "2px solid red"}} />
                        </div>
                        :
                        <div className="form-group">
                            <label>Telefone:*</label>
                            <InputMask mask="(99) 99999-9999" defaultValue={cliente.telCli} className={`form-control ${applyRedBorder(telCli)}`} ref={telCli}
                                style={{ width: 400, marginRight: 40 }} />
                        </div>

                }
                {
                    emailVazio ?
                        <div className="form-group">
                            <label>E-mail:*</label>
                            <input type="text" defaultValue={cliente.emailCli} className={`form-control ${applyRedBorder(emailCli)}`} ref={emailCli}
                                style={{ width: 400, border: "2px solid red" }} />
                        </div>
                        :
                        <div className="form-group">
                            <label>E-mail:*</label>
                            <input type="text" defaultValue={cliente.emailCli} className={`form-control ${applyRedBorder(emailCli)}`} ref={emailCli}
                                style={{ width: 400 }} />
                        </div>
                }
            </div>

            {/* Adicione a classe CSS condicional aos outros campos obrigatórios */}
            <div style={{ display: 'inline-flex' }}>
                {
                    rgVazio ?
                        <div className="form-group">
                            <label>RG:*</label>
                            <InputMask mask='99.999.999-9' type="text" defaultValue={cliente.rgCli} className={`form-control ${applyRedBorder(rgCli)}`} ref={rgCli}
                                style={{ width: 400, marginRight: 40, border: "2px solid red"  }} />
                        </div>
                        :
                        <div className="form-group">
                            <label>RG:*</label>
                            <InputMask mask='99.999.999-9' type="text" defaultValue={cliente.rgCli} className={`form-control ${applyRedBorder(rgCli)}`} ref={rgCli}
                                style={{ width: 400, marginRight: 40}} />
                        </div>
                }

                {
                    cpfVazio ?
                        <div className="form-group">
                            <label>CPF:*</label>
                            <InputMask mask="999.999.999-99" defaultValue={cliente.cpfCli} className={`form-control ${applyRedBorder(cpfCli)}`} ref={cpfCli}
                                style={{ width: 400, border: "2px solid red" }} />
                        </div>
                        :
                        <div className="form-group">
                            <label>CPF:*</label>
                            <InputMask mask="999.999.999-99" defaultValue={cliente.cpfCli} className={`form-control ${applyRedBorder(cpfCli)}`} ref={cpfCli}
                                style={{ width: 400 }} />
                        </div>
                }
            </div>

            {/* Adicione a classe CSS condicional aos outros campos obrigatórios */}
            <div style={{ display: 'inline-flex' }}>
                {
                    enderecoVazio ?
                        <div className="form-group">
                            <label>Endereço:*</label>
                            <input type="text" defaultValue={cliente.enderecoCli} className={`form-control ${applyRedBorder(enderecoCli)}`} ref={enderecoCli}
                                style={{ width: 400, marginRight: 40, border: "2px solid red" }} />
                        </div>
                        :
                        <div className="form-group">
                            <label>Endereço:*</label>
                            <input type="text" defaultValue={cliente.enderecoCli} className={`form-control ${applyRedBorder(enderecoCli)}`} ref={enderecoCli}
                                style={{ width: 400, marginRight: 40 }} />
                        </div>
                }

                {
                    bairroVazio ?
                        <div className="form-group">
                            <label>Bairro:*</label>
                            <input type="text" defaultValue={cliente.bairroCli} className={`form-control ${applyRedBorder(bairroCli)}`} ref={bairroCli}
                                style={{ width: 200, marginRight: 30, border: "2px solid red"  }} />
                        </div>
                        :
                        <div className="form-group">
                            <label>Bairro:*</label>
                            <input type="text" defaultValue={cliente.bairroCli} className={`form-control ${applyRedBorder(bairroCli)}`} ref={bairroCli}
                                style={{ width: 200, marginRight: 30}} />
                        </div>
                }

                {
                    cidadeVazio ?
                        <div className="form-group">
                            <label>Cidade:*</label>
                            <input type="text" defaultValue={cliente.cidadeCli} className={`form-control ${applyRedBorder(cidadeCli)}`} ref={cidadeCli}
                                style={{ width: 200, marginRight: 30, border: "2px solid red" }} />
                        </div>
                        :
                        <div className="form-group">
                            <label>Cidade:*</label>
                            <input type="text" defaultValue={cliente.cidadeCli} className={`form-control ${applyRedBorder(cidadeCli)}`} ref={cidadeCli}
                                style={{ width: 200, marginRight: 30 }} />
                        </div>
                }

                {
                    cepVazio ?
                        <div className="form-group">
                            <label>CEP:*</label>
                            <InputMask mask="99999-999" defaultValue={cliente.cepCli} className={`form-control ${applyRedBorder(cepCli)}`} ref={cepCli}
                                style={{ width: 200, border: "2px solid red" }} />
                        </div>
                        :
                        <div className="form-group">
                            <label>CEP:*</label>
                            <InputMask mask="99999-999" defaultValue={cliente.cepCli} className={`form-control ${applyRedBorder(cepCli)}`} ref={cepCli}
                                style={{ width: 200 }} />
                        </div>
                }
            </div>
        </div>

        <div style={{ marginTop: 30 }}>
            <button onClick={cliente.idCli !== 0 ? alterarCliente : cadastrarCliente} className="btn btn-primary">{cliente.idCli !== 0 ? 'Alterar' : 'Cadastrar'}</button>
            <a href="/clientes"><button style={{ marginLeft: 50 }} className="btn btn-danger">Cancelar</button></a>
        </div>

        <Modal style={{ content: { width: '500px', margin: 'auto' } }} isOpen={modalIsOpen} onRequestClose={closeModal}>
            <h2>Informações do Cliente</h2>
            <div className="form-group">
                <label>Nome:*</label>
                <input type="text" className="form-control" placeholder="Nome do cliente" disabled />
            </div>

            <div className="form-group">
                <label>Telefone:*</label>
                <InputMask mask="(99) 99999-9999" className="form-control" placeholder="99999-9999" disabled />
            </div>

            <div className="form-group">
                <label>E-mail:*</label>
                <input type="email" className="form-control" placeholder="cliente@email.com" disabled />
            </div>

            <div className="form-group">
                <label>RG:*</label>
                <InputMask mask='99.999.999-9' type="text" className="form-control" placeholder="123456789" disabled />
            </div>

            <div className="form-group">
                <label>CPF:*</label>
                <InputMask mask="999.999.999-99" className="form-control" placeholder="12345678901" disabled />
            </div>

            <div className="form-group">
                <label>Endereço:*</label>
                <input type="text" className="form-control" placeholder="Rua X" disabled />
            </div>

            <div className="form-group">
                <label>Bairro:*</label>
                <input type="text" className="form-control" placeholder="Bairro X" disabled />
            </div>

            <div className="form-group">
                <label>Cidade:*</label>
                <input type="text" className="form-control" placeholder="Cidade X" disabled />
            </div>

            <div className="form-group">
                <label>CEP:*</label>
                <InputMask mask="99999-999" className="form-control" placeholder="99999-999" disabled />
            </div>

            <button className="btn btn-danger" onClick={closeModal}>Fechar</button>
        </Modal>

    </div>
    )
}
