'use client'
import { useRef, useState, useEffect } from "react";
import httpClient from "../utils/httpClient";
import Link from "next/link";
import InputMask from 'react-input-mask';
import Modal from 'react-modal';

export default function ObraForm(props) {
    const idObra = useRef(0);
    const endereco = useRef('');
    const bairro = useRef('');
    const cidade = useRef('');
    const valorTotal = useRef(0);
    const dataInicio = useRef('');
    const dataTermino = useRef('');
    const contrato = useRef('');
    const planta = useRef('');
    const cepObra = useRef('');
    const idCliente = useRef(props.obra ? props.obra.idCliente : 0); // Inicialize idCliente com o valor da obra, se existir
    const [clienteInput, setClienteInput] = useState('');
    const [selectedCliente, setSelectedCliente] = useState(null);
    const [listaClientes, setListaClientes] = useState([]);
    useEffect(() => {
        carregarClientes();
    }, []);


    const [clienteVazio, setClienteVazio] = useState(false);
    const [enderecoVazio, setEnderecoVazio] = useState(false);
    const [bairroVazio, setBairroVazio] = useState(false);
    const [cidadeVazio, setCidadeVazio] = useState(false);
    const [valorTotalVazio, setValorTotalVazio] = useState(false);
    const [dataInicioVazio, setDataInicioVazio] = useState(false);
    const [dataTerminoVazio, setDataTerminoVazio] = useState(false);
    const [cepVazio, setCepVazio] = useState(false);

    function camposVazios() {

        let clienteNaoPreenchido = idCliente.current == 0;
        let enderecoNaoPreenchido = endereco.current.value == "";
        let bairroNaoPreenchido = bairro.current.value == "";
        let cidadeNaoPreenchido = cidade.current.value == "";
        let valorTotalNaoPreenchido = valorTotal.current.value == 0;
        let dataInicioNaoPreenchido = dataInicio.current.value == "";
        let dataTerminoNaoPreenchido = dataTermino.current.value == "";
        let cepNaoPreenchido = cepObra.current.value == "";

        setClienteVazio(clienteNaoPreenchido);
        setEnderecoVazio(enderecoNaoPreenchido);
        setBairroVazio(bairroNaoPreenchido);
        setCidadeVazio(cidadeNaoPreenchido);
        setValorTotalVazio(valorTotalNaoPreenchido);
        setDataInicioVazio(dataInicioNaoPreenchido);
        setDataTerminoVazio(dataTerminoNaoPreenchido);
        setCepVazio(cepNaoPreenchido);

        return clienteNaoPreenchido || enderecoNaoPreenchido || bairroNaoPreenchido || cidadeNaoPreenchido || valorTotalNaoPreenchido || dataInicioNaoPreenchido || dataTerminoNaoPreenchido || cepNaoPreenchido;
    }

    const [obra, setObra] = useState(props.obra ? props.obra : {
        idObra: 0,
        endereco: '',
        bairro: '',
        cidade: '',
        valorTotal: 0,
        dataInicio: '',
        dataTermino: '',
        contrato: '',
        planta: '',
        idCliente: 0,
        cepObra: ''
    });

    const [modalIsOpen, setModalIsOpen] = useState(false);
    function openModal() {
        setModalIsOpen(true);
    }
    function closeModal() {
        setModalIsOpen(false);
    }

    useEffect(() => {
        if (props.obra) {
            // Preencher os campos do formulário com os dados da obra recebida por props
            idObra.current = props.obra.idObra;
            endereco.current.value = props.obra.endereco;
            bairro.current.value = props.obra.bairro;
            cidade.current.value = props.obra.cidade;
            valorTotal.current.value = props.obra.valorTotal;

            // Remover horário das datas
            dataInicio.current.value = props.obra.dataInicio.split('T')[0];
            dataTermino.current.value = props.obra.dataTermino.split('T')[0];

            contrato.current.value = props.obra.contrato;
            planta.current.value = props.obra.planta;
            cepObra.current.value = props.obra.cepObra;
            setClienteInput(getClienteName(props.obra.idCliente, listaClientes)); // Definir o nome do cliente
        }
    }, [props.obra]);


    function handleClienteInputChange(event) {
        setClienteInput(event.target.value);
    }

    function selectCliente(cliente) {
        setSelectedCliente(cliente);
        setClienteInput(cliente.nomeCli); // Altera para o nome do cliente
        setListaClientes([]);
        idCliente.current = cliente.idCli;
    }

    function cadastrarObra() {
        let camposPreenchidos = !camposVazios();
        if (!camposPreenchidos) {
            alert("Preencha corretamente todos os campos!");
        }
        if (camposPreenchidos) {
            let status = 0;
            const inicio = new Date(dataInicio.current.value);
            const termino = new Date(dataTermino.current.value);

            if (endereco.current.value !== '' && bairro.current.value !== '' && cidade.current.value !== '' && inicio && termino && idCliente.current > 0 && cepObra.current.value !== '') {
                if (termino < inicio) {
                    alert('A data de término não pode ser menor que a data de início.');
                    return;
                }

                httpClient.post('/obras/gravar', {
                    endereco: endereco.current.value,
                    bairro: bairro.current.value,
                    cidade: cidade.current.value,
                    valorTotal: valorTotal.current.value,
                    dataInicio: inicio.toISOString().split('T')[0], // Formata para o formato YYYY-MM-DD
                    dataTermino: termino.toISOString().split('T')[0], // Formata para o formato YYYY-MM-DD
                    contrato: contrato.current.value,
                    planta: planta.current.value,
                    idCliente: idCliente.current,
                    cepObra: cepObra.current.value
                })
                    .then(r => {
                        status = r.status;
                        return r.json();
                    })
                    .then(r => {
                        alert(r.msg);
                        if (status == 200) {
                            window.location.href = '/obras';
                        }
                    })
                    .catch(error => {
                        console.error('Erro ao cadastrar obra:', error);
                        alert('Erro ao cadastrar obra. Por favor, tente novamente.');
                    });
            } else {
                alert('Preencha todos os campos!');
            }
        }
    }

    function alterarObra() {
        let camposPreenchidos = !camposVazios();
        if (!camposPreenchidos) {
            alert("Preencha corretamente todos os campos!");
        }

        if (camposPreenchidos) {
            let status = 0;
            const inicio = new Date(dataInicio.current.value);
            const termino = new Date(dataTermino.current.value);

            if (endereco.current.value !== '' && bairro.current.value !== '' && cidade.current.value !== '' && inicio && termino && idCliente.current > 0 && cepObra.current.value !== '') {
                if (termino < inicio) {
                    alert('A data de término não pode ser menor que a data de início.');
                    return;
                }

                httpClient
                    .put('/obras/alterar', {
                        idObra: obra.idObra,
                        endereco: endereco.current.value,
                        bairro: bairro.current.value,
                        cidade: cidade.current.value,
                        valorTotal: valorTotal.current.value,
                        dataInicio: inicio.toISOString().split('T')[0],
                        dataTermino: termino.toISOString().split('T')[0],
                        contrato: contrato.current.value,
                        planta: planta.current.value,
                        idCliente: idCliente.current,
                        cepObra: cepObra.current.value,
                    })
                    .then((r) => {
                        status = r.status;
                        return r.json();
                    })
                    .then((r) => {
                        alert(r.msg);
                        if (status == 200) {
                            window.location.href = '/obras';
                        }
                    })
                    .catch((error) => {
                        console.error('Erro ao alterar obra:', error);
                        alert('Erro ao alterar obra. Por favor, tente novamente.');
                    });
            } else {
                alert('Preencha todos os campos!');
            }
        }
    }


    function carregarClientes() {
        httpClient.get('/clientes/listar')
            .then(response => response.json())
            .then(data => {
                setListaClientes(data);
                // Atualizar o estado do clienteInput com base no ID do cliente, se disponível
                if (props.obra) {
                    // Definir clienteInput após a lista de clientes ser carregada
                    setClienteInput(getClienteName(props.obra.idCliente, data));
                }
            })
            .catch(error => console.error('Erro ao carregar clientes:', error));
    }

    function getClienteName(clienteId, clientes) {
        if (clientes) {
            const cliente = clientes.find(cliente => cliente.idCli === clienteId);
            return cliente ? cliente.nomeCli : ''; // Retorna o nome do cliente ou uma string vazia se não encontrado
        }
        return ''; // Retorna uma string vazia se a lista de clientes for undefined
    }



    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <h1>{obra.idObra == 0 ? 'Cadastrar Obra' : 'Alterar Obra'}</h1>
                <button onClick={openModal} className="btn btn-info" style={{ marginLeft: 10 }}>Ajuda</button>
            </div>


            {
                clienteVazio ?
                    <div className="form-group">
                        <label>Cliente:*</label>
                        <input style={{ border: "2px solid red" }}
                            type="text"
                            className="form-control"
                            value={clienteInput}
                            onChange={handleClienteInputChange} defaultValue={obra.idCliente}
                        />
                        {clienteInput && listaClientes.length > 0 && (
                            <ul className="list-group">
                                {listaClientes
                                    .filter(cliente => cliente.nomeCli.toLowerCase().includes(clienteInput.toLowerCase()))
                                    .map((cliente, index) => (
                                        <li
                                            key={index}
                                            className="list-group-item"
                                            onClick={() => selectCliente(cliente)}
                                            style={{ cursor: 'pointer' }}
                                        >
                                            {cliente.nomeCli}
                                        </li>
                                    ))}
                            </ul>
                        )}
                    </div>
                    :
                    <div className="form-group">
                        <label>Cliente:*</label>
                        <input
                            type="text"
                            className="form-control"
                            value={clienteInput}
                            onChange={handleClienteInputChange} defaultValue={obra.idCliente}
                        />
                        {clienteInput && listaClientes.length > 0 && (
                            <ul className="list-group">
                                {listaClientes
                                    .filter(cliente => cliente.nomeCli.toLowerCase().includes(clienteInput.toLowerCase()))
                                    .map((cliente, index) => (
                                        <li
                                            key={index}
                                            className="list-group-item"
                                            onClick={() => selectCliente(cliente)}
                                            style={{ cursor: 'pointer' }}
                                        >
                                            {cliente.nomeCli}
                                        </li>
                                    ))}
                            </ul>
                        )}
                    </div>

            }


            <div className="form-row">
                {
                    enderecoVazio ?
                        <div className="form-group col-md-6">
                            <label>Endereço:*</label>
                            <input style={{ border: "2px solid red" }} type="text" className="form-control" ref={endereco} defaultValue={obra.endereco} />
                        </div>
                        :
                        <div className="form-group col-md-6">
                            <label>Endereço:*</label>
                            <input type="text" className="form-control" ref={endereco} defaultValue={obra.endereco} />
                        </div>
                }
                {
                    bairroVazio ?
                        <div className="form-group col-md-6">
                            <label>Bairro:*</label>
                            <input style={{ border: "2px solid red" }} type="text" className="form-control" ref={bairro} defaultValue={obra.bairro} />
                        </div>
                        :
                        <div className="form-group col-md-6">
                            <label>Bairro:*</label>
                            <input type="text" className="form-control" ref={bairro} defaultValue={obra.bairro} />
                        </div>
                }
            </div>

            <div className="form-row">
                {
                    cidadeVazio ?
                        <div className="form-group col-md-6">
                            <label>Cidade:*</label>
                            <input style={{ border: "2px solid red" }} type="text" className="form-control" ref={cidade} defaultValue={obra.cidade} />
                        </div>
                        :
                        <div className="form-group col-md-6">
                            <label>Cidade:*</label>
                            <input type="text" className="form-control" ref={cidade} defaultValue={obra.cidade} />
                        </div>
                }

                {
                    cepVazio ?
                        <div className="form-group col-md-6">
                            <label>CEP:*</label>
                            <InputMask style={{ border: "2px solid red" }} mask='99999-999' type="text" className="form-control" ref={cepObra} defaultValue={obra.cepObra} />
                        </div>
                        :
                        <div className="form-group col-md-6">
                            <label>CEP:*</label>
                            <InputMask mask='99999-999' type="text" className="form-control" ref={cepObra} defaultValue={obra.cepObra} />
                        </div>
                }

            </div>

            <div className="form-row">
                {
                    valorTotalVazio ?
                        <div className="form-group col-md-6">
                            <label>Valor Total:*</label>
                            <input style={{ border: "2px solid red" }} type="text" className="form-control" ref={valorTotal} defaultValue={obra.valorTotal} />
                        </div>
                        :
                        <div className="form-group col-md-6">
                            <label>Valor Total:*</label>
                            <input type="text" className="form-control" ref={valorTotal} defaultValue={obra.valorTotal} />
                        </div>
                }
            </div>

            {
                dataInicioVazio ?
                    <div className="form-group">
                        <label>Data Inicio:*</label>
                        <input style={{ border: "2px solid red" }} type="date" className="form-control" ref={dataInicio} defaultValue={obra.dataInicio} />
                    </div>
                    :
                    <div className="form-group">
                        <label>Data Inicio:*</label>
                        <input type="date" className="form-control" ref={dataInicio} defaultValue={obra.dataInicio} />
                    </div>
            }

            {
                dataTerminoVazio ?
                    <div className="form-group">
                        <label>Data Prevista de Término:*</label>
                        <input style={{ border: "2px solid red" }} type="date" className="form-control" ref={dataTermino} defaultValue={obra.dataTermino} />
                    </div>
                    :
                    <div className="form-group">
                        <label>Data Prevista de Término:*</label>
                        <input type="date" className="form-control" ref={dataTermino} defaultValue={obra.dataTermino} />
                    </div>
            }

            <div className="form-group">
                <label>Contrato:</label>
                <input type="file" className="form-control" ref={contrato} defaultValue={obra.contrato} />
            </div>

            <div className="form-group">
                <label>Planta:</label>
                <input type="file" className="form-control" ref={planta} defaultValue={obra.planta} />
            </div>

            <div>
                <button className="btn btn-primary" onClick={obra.idObra == 0 ? cadastrarObra : alterarObra}>{obra.idObra == 0 ? 'Cadastrar' : 'Alterar'}</button>
                <Link style={{ marginLeft: 15 }} href={'/obras'}><button className="btn btn-secondary">Voltar</button></Link>
            </div>

            <Modal style={{ content: { width: '500px', margin: 'auto' } }} isOpen={modalIsOpen} onRequestClose={closeModal}>
                <div className="form-group">
                    <label>Cliente:*</label>
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Digite o nome do cliente e selecione quando aparecer"
                        disabled
                    />
                    {/* Seção de sugestões de clientes omitida para brevidade */}
                </div>

                <div className="form-row">
                    <div className="form-group col-md-6">
                        <label>Endereço:*</label>
                        <input type="text" className="form-control" placeholder="Endereço do cliente" disabled />
                    </div>
                    <div className="form-group col-md-6">
                        <label>Bairro:*</label>
                        <input type="text" className="form-control" placeholder="Bairro do cliente" disabled />
                    </div>
                </div>

                <div className="form-row">
                    <div className="form-group col-md-6">
                        <label>Cidade:*</label>
                        <input type="text" className="form-control" placeholder="Cidade do cliente" disabled />
                    </div>

                    <div className="form-group col-md-6">
                        <label>CEP:*</label>
                        <InputMask mask='99999-999' type="text" className="form-control" placeholder="99999-999" disabled />
                    </div>
                </div>

                <div className="form-row">
                    <div className="form-group col-md-6">
                        <label>Valor Total:*</label>
                        <input type="text" className="form-control" placeholder="Valor Total da Obra" disabled />
                    </div>
                </div>

                <div className="form-group">
                    <label>Data Inicio:*</label>
                    <input type="date" className="form-control" disabled />
                </div>

                <div className="form-group">
                    <label>Data Prevista de Término:*</label>
                    <input type="date" className="form-control" disabled />
                </div>

                <div className="form-group">
                    <label>Contrato:</label>
                    <input type="file" className="form-control" disabled />
                </div>

                <div className="form-group">
                    <label>Planta:</label>
                    <input type="file" className="form-control" disabled />
                </div>

                <button className="btn btn-danger" onClick={closeModal}>Fechar</button>
            </Modal>

        </div>
    )
}
