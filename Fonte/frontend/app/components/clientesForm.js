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

    const [cliente, setCliente] = props.cliente ? useState(props.cliente) : useState({ idCli: 0, nomeCli: '', telCli: '', emailCli: '', rgCli: '', cpfCli: '', enderecoCli: '', bairroCli: '', cidadeCli: '', cepCli: '' });

    const [modalIsOpen, setModalIsOpen] = useState(false);

    function cadastrarCliente() {
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

    function alterarCliente() {
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

    function openModal() {
        setModalIsOpen(true);
    }

    function closeModal() {
        setModalIsOpen(false);
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

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <h1>{cliente.idCli === 0 ? 'Cadastrar Novo Cliente' : 'Alterar Cliente'}</h1>
                <button onClick={openModal} className="btn btn-info" style={{ marginLeft: 10 }}>Ajuda</button>
            </div>
            <div className="form-group">
                <label>Nome:*</label>
                <input type="text" defaultValue={cliente.nomeCli} className="form-control" ref={nomeCli} />
            </div>

            <div className="form-group">
                <label>Telefone:*</label>
                <InputMask mask="(99) 99999-9999" defaultValue={cliente.telCli} className="form-control" ref={telCli} />
            </div>

            <div className="form-group">
                <label>E-mail:*</label>
                <input type="email" defaultValue={cliente.emailCli} className="form-control" ref={emailCli} />
            </div>

            <div className="form-group">
                <label>RG:*</label>
                <InputMask mask='99.999.999-9' type="text" defaultValue={cliente.rgCli} className="form-control" ref={rgCli} />
            </div>

            <div className="form-group">
                <label>CPF:*</label>
                <InputMask mask="999.999.999-99" defaultValue={cliente.cpfCli} className="form-control" ref={cpfCli} />
            </div>

            <div className="form-group">
                <label>Endereço:*</label>
                <input type="text" defaultValue={cliente.enderecoCli} className="form-control" ref={enderecoCli} />
            </div>

            <div className="form-group">
                <label>Bairro:*</label>
                <input type="text" defaultValue={cliente.bairroCli} className="form-control" ref={bairroCli} />
            </div>

            <div className="form-group">
                <label>Cidade:*</label>
                <input type="text" defaultValue={cliente.cidadeCli} className="form-control" ref={cidadeCli} />
            </div>

            <div className="form-group">
                <label>CEP:*</label>
                <InputMask mask="99999-999" defaultValue={cliente.cepCli} className="form-control" ref={cepCli} />
            </div>

            <div>
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
