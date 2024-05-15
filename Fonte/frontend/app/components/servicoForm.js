'use client'
import { useEffect, useRef, useState } from "react";
import httpClient from "../utils/httpClient";
import Carregando from "./carregando";
import Modal from 'react-modal';
import { jsPDF } from "jspdf";
import "jspdf-autotable";

export default function ServicoForm({ params: { idObra } }) {
    const descricaoServico = useRef('');
    const valorServico = useRef(0);
    const idAtuacao = useRef('');
    const idParceiro = useRef('');
    const dataServ = useRef(null);

    const [idAtuacaoVazio, setIdAtuacaoVazio] = useState(false);
    const [idParceiroVazio, setIdParceiroVazio] = useState(false);
    const [descricaoServicoVazio, setDescricaoServicoVazio] = useState(false);
    const [valorServicoVazio, setValorServicoVazio] = useState(false);
    const [dataServVazio, setDataServVazio] = useState(false);

    const [listaAtuacao, setListaAtuacao] = useState([]);
    const [listaParceiros, setListaParceiros] = useState([]);
    const [bairroObra, setBairroObra] = useState('');
    const [listaServicos, setListaServicos] = useState([]);
    const [listaTotalParceiros, setListaTotalParceiros] = useState([]);

    const [carregando, setCarregando] = useState(true);
    const [gravando, setGravando] = useState(false);

    const [modalIsOpen, setModalIsOpen] = useState(false);
    function openModal() {
        setModalIsOpen(true);
    }
    function closeModal() {
        setModalIsOpen(false);
    }

    function carregarBairroObra() {
        return httpClient.get(`/obras/obter/${idObra}`)
            .then(r => r.json())
            .then(r => r.bairro); // Retorna apenas o bairro
    }

    async function handleGerarPDF() {
        const bairroObra = await carregarBairroObra();
        gerarPDF(bairroObra);
    }

    function gerarPDF(bairroObra) {
        const doc = new jsPDF();

        // Título do PDF
        doc.text("Relatório de serviços externos", 10, 10);

        // Nome da obra (bairro)
        doc.text(`${bairroObra}`, 10, 20); // Aqui estamos exibindo o bairro diretamente

        // Cabeçalho da tabela
        const headers = ["Parceiro", "Serviço", "Valor do Serviço", "Data"];
        const data = listaServicos.map((servico) => [
            getNomeParceiro(servico.idParceiro),
            servico.descServico,
            `R$ ${servico.valorServico.toFixed(2)}`,
            servico.dataServ ? new Date(servico.dataServ).toLocaleDateString() : 'N/A'
        ]);

        // Adiciona a tabela ao PDF
        doc.autoTable({
            head: [headers],
            body: data,
            startY: 30
        });

        // Salva o PDF
        doc.save("lista_parceiros_alocados.pdf");
    }


    function camposVazios() {
        let descricaoServicoNaoPreenchido = descricaoServico.current.value == "";
        let valorServicoNaoPreenchido = valorServico.current.value == 0;
        let idAtuacaoNaoPreenchido = idAtuacao.current.value == 0;
        let idParceiroNaoPreenchido = idParceiro.current.value == 0;
        let dataServNaoPreenchido = dataServ.current.value == "";

        setDescricaoServicoVazio(descricaoServicoNaoPreenchido);
        setValorServicoVazio(valorServicoNaoPreenchido);
        setIdAtuacaoVazio(idAtuacaoNaoPreenchido);
        setIdParceiroVazio(idParceiroNaoPreenchido);
        setDataServVazio(dataServNaoPreenchido);

        return descricaoServicoNaoPreenchido || valorServicoNaoPreenchido || idAtuacaoNaoPreenchido || idParceiroNaoPreenchido || dataServNaoPreenchido;
    }

    function listarAtuacao() {
        httpClient.get('/areaAtuacao/listar')
            .then(r => r.json())
            .then(r => setListaAtuacao(r));
    }

    function carregarTodosParceiros() {
        httpClient.get('/parceiros/listar')
            .then(r => r.json())
            .then(r => { setListaTotalParceiros(r); setCarregando(false) });
    }

    function carregarServicos() {
        httpClient.get('/servicos/listar')
            .then(r => r.json())
            .then(r => {
                console.log("Dados obtidos:", r);
                const servicosFiltrados = r.filter(servico => servico.idObra == idObra); // Usamos == para comparar números com strings
                console.log("Serviços filtrados:", servicosFiltrados);
                setListaServicos(servicosFiltrados);
            });
    }


    function carregarObra() {
        httpClient.get(`/obras/obter/${idObra}`)
            .then(r => r.json())
            .then(r => setBairroObra(r.bairro));
    }

    function listarParceiros(idAreaAtuacao) {
        httpClient.get(`/parceiros/obterParceirosArea/${idAreaAtuacao}`)
            .then(r => r.json())
            .then(r => {
                if (r.length > 0) {
                    setListaParceiros(r);
                } else {
                    idParceiro.current.value = 0;
                    setListaParceiros([]);
                }
            });
    }

    const parceirosNomes = listaTotalParceiros.reduce((map, parceiro) => {
        map[parceiro.idParceiro] = parceiro.nomeParceiro;
        return map;
    }, {});

    const getNomeParceiro = (idParceiro) => {
        return parceirosNomes[idParceiro] || '';
    };

    function alocarParceiro() {
        let camposPreenchidos = !camposVazios();
        if (!camposPreenchidos) {
            alert("Preencha corretamente todos os campos!");
        }
        if (camposPreenchidos) {
            const valor = parseFloat(valorServico.current.value);
            const parceiroSelecionado = idParceiro.current.value;
            const dataSelecionada = dataServ.current.value;

            const mesmoParceiroMesmaData = listaServicos.some(servico => {
                if (servico.dataServ !== null) {
                    const dataServFormatada = servico.dataServ.split('T')[0];
                    const dataSelecionadaFormatada = dataSelecionada.split('T')[0];
                    return servico.idParceiro == parceiroSelecionado && dataServFormatada === dataSelecionadaFormatada;
                } else {
                    return false;
                }
            });



            if (mesmoParceiroMesmaData) {
                alert("Não é possível gravar o mesmo parceiro na mesma data.");
                return;
            }

            if (idAtuacao.current.value > 0 && parceiroSelecionado > 0 && descricaoServico.current.value !== "" && valor > 0) {

                setGravando(true);
                let status = 0;

                httpClient.post('/servicos/gravar', {
                    descServico: descricaoServico.current.value,
                    valorServico: valor,
                    idObra: idObra,
                    idParceiro: parceiroSelecionado,
                    dataServ: dataSelecionada
                })
                    .then(r => {
                        status = r.status;
                        return r.json();
                    })
                    .then(r => {
                        alert(r.msg);
                        setGravando(false);

                        if (status === 200) {
                            descricaoServico.current.value = "";
                            valorServico.current.value = 0;
                            idParceiro.current.value = 0;
                            window.location.reload();
                        }
                    });
            } else {
                alert("Preencha todos os campos!");
            }
        }
    }



    useEffect(() => {
        listarAtuacao();
        carregarObra();
        carregarServicos();
        carregarTodosParceiros();
    }, []);

    return (
        <div>
            <div style={{ display: 'inline-flex', alignItems: 'center'}}>
                <h1>Alocar Parceiro</h1>
                <button onClick={openModal} className="btn btn-info" style={{ marginLeft: 10 }}>Ajuda</button>
                <button style={{ marginLeft: 10 }} onClick={handleGerarPDF} className="btn btn-primary">Gerar PDF</button>
            </div>
            {
                carregando ?
                    <Carregando />
                    :
                    <div>

                        <div>
                            <h3>Obra: {bairroObra}</h3>
                        </div>

                        <div style={{ display: 'inline-flex', marginTop: 30 }}>
                            {
                                idAtuacaoVazio ?
                                    <div className="form-group" style={{ marginRight: 30 }}>
                                        <label>Área de atuação</label>
                                        <select className="form-select" ref={idAtuacao}
                                            onChange={(e) => listarParceiros(e.target.value)} style={{ width: 200, textAlign: 'center', border: '2px solid red' }}>
                                            <option value="0">Selecione</option>
                                            {listaAtuacao.map((value, index) => (
                                                <option key={index} value={value.idArea}>{value.nomeAtuacao}</option>
                                            ))}
                                        </select>
                                    </div>
                                    :
                                    <div className="form-group" style={{ marginRight: 30 }}>
                                        <label>Área de atuação</label>
                                        <select className="form-select" ref={idAtuacao}
                                            onChange={(e) => listarParceiros(e.target.value)} style={{ width: 200, textAlign: 'center' }}>
                                            <option value="0">Selecione</option>
                                            {listaAtuacao.map((value, index) => (
                                                <option key={index} value={value.idArea}>{value.nomeAtuacao}</option>
                                            ))}
                                        </select>
                                    </div>
                            }

                            {
                                idParceiroVazio ?
                                    <div className="form-group">
                                        <label>Parceiro</label>
                                        <select className="form-select" ref={idParceiro} style={{ width: 200, textAlign: 'center', border: '2px solid red' }}>
                                            <option value="0">Selecione</option>
                                            {listaParceiros.map((value, index) => (
                                                <option key={index} value={value.idParceiro}>{value.nomeParceiro}</option>
                                            ))}
                                        </select>
                                    </div>
                                    :
                                    <div className="form-group">
                                        <label>Parceiro</label>
                                        <select className="form-select" ref={idParceiro} style={{ width: 200, textAlign: 'center' }}>
                                            <option value="0">Selecione</option>
                                            {listaParceiros.map((value, index) => (
                                                <option key={index} value={value.idParceiro}>{value.nomeParceiro}</option>
                                            ))}
                                        </select>
                                    </div>
                            }
                        </div>

                        {
                            descricaoServicoVazio ?
                                <div className="form-group">
                                    <label>Descrição do Serviço</label>
                                    <textarea style={{ border: "2px solid red" }} className="form-control" ref={descricaoServico}></textarea>
                                </div>
                                :
                                <div className="form-group">
                                    <label>Descrição do Serviço</label>
                                    <textarea className="form-control" ref={descricaoServico}></textarea>
                                </div>
                        }

                        <div style={{ display: 'inline-flex' }}>
                            {
                                valorServicoVazio ?
                                    <div className="form-group">
                                        <label>Valor do Serviço</label>
                                        <input type="number" className="form-control" ref={valorServico} style={{ width: 200, marginRight: 30, border: "2px solid red" }}></input>
                                    </div>
                                    :
                                    <div className="form-group">
                                        <label>Valor do Serviço</label>
                                        <input type="number" className="form-control" ref={valorServico} style={{ width: 200, marginRight: 30 }}></input>
                                    </div>
                            }

                            {
                                dataServVazio ?
                                    <div className="form-group">
                                        <label>Data do Serviço</label>
                                        <input type="date" className="form-control" ref={dataServ} style={{ width: 200, border: "2px solid red" }}></input>
                                    </div>
                                    :
                                    <div className="form-group">
                                        <label>Data do Serviço</label>
                                        <input type="date" className="form-control" ref={dataServ} style={{ width: 200 }}></input>
                                    </div>
                            }
                        </div>

                        <div style={{ marginTop: 20 }}>
                            {
                                gravando ? <p style={{ fontWeight: 'bold' }}>Aguardando gravação...</p> : <></>
                            }
                            <button onClick={alocarParceiro} className="btn btn-primary" disabled={gravando}>Alocar</button>
                            <a href="/obras"><button style={{ marginLeft: 50 }} className="btn btn-danger" disabled={gravando}>Cancelar</button></a>
                        </div>

                        <br />
                        <hr />
                        <h3>Parceiros já alocados para esta obra</h3>
                        <div>
                            <table className="table table-hover">
                                <thead>
                                    <tr>
                                        <th>Parceiro</th>
                                        <th>Serviço</th>
                                        <th>Valor do Serviço</th>
                                        <th>Data</th>
                                        <th>Excluir</th>
                                    </tr>
                                </thead>
                                {listaServicos.map((value, index) => (
                                    <tr key={index}>
                                        <td>{getNomeParceiro(value.idParceiro)}</td>
                                        <td>{value.descServico}</td>
                                        <td>R$ {value.valorServico.toFixed(2)}</td>
                                        <td>{value.dataServ == null ? 'N/A' : new Date(value.dataServ).toLocaleDateString()}</td>
                                        <td>
                                            <button style={{ backgroundColor: 'red' }} className="btn btn-danger" onClick={() => {
                                                if (confirm('Deseja excluir o serviço e todos os dados relacionados a ele?')) {
                                                    httpClient.delete(`/servicos/excluir/${value.idServico}`)
                                                        .then(r => {
                                                            alert('Serviço excluído com sucesso!');
                                                            window.location.reload();
                                                        })
                                                        .catch(error => console.error("Erro ao excluir serviço:", error));
                                                }
                                            }}>
                                                <i className="fas fa-trash"></i>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </table>
                        </div>
                    </div>
            }
            <Modal style={{ content: { width: '500px', margin: 'auto', height: '550px' } }} isOpen={modalIsOpen} onRequestClose={closeModal}>
                <div style={{ display: 'inline-flex', marginTop: 30 }}>
                    <div className="form-group" style={{ marginRight: 30 }}>
                        <label>Área de atuação</label>
                        <select className="form-select" disabled>
                            <option value="0">Selecione</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Parceiro</label>
                        <select className="form-select" ref={idParceiro} style={{ width: 200, textAlign: 'center' }} disabled>
                            <option value="0">Selecione</option>
                            {listaParceiros.map((value, index) => (
                                <option key={index} value={value.idParceiro}>{value.nomeParceiro}</option>
                            ))}
                        </select>
                    </div>
                </div>
                <p>Selecione uma área de atuação e após isso selecione o parceiro daquela área selecionada</p>

                <div className="form-group">
                    <label>Descrição do Serviço</label>
                    <textarea className="form-control" placeholder="Digite o trabalho que será feito por esse parceiro" disabled></textarea>
                </div>

                <div style={{ display: 'inline-flex' }}>
                    <div className="form-group">
                        <label>Valor do Serviço</label>
                        <input type="number" className="form-control" placeholder="Digite o valor do serviço a ser realizado" style={{ width: 200, marginRight: 30 }} disabled></input>
                    </div>

                    <div className="form-group">
                        <label>Data do Serviço</label>
                        <input type="date" className="form-control" ref={dataServ} style={{ width: 200 }} disabled></input>
                        <p>Selecione a data que o serviço será realizado</p>
                    </div>
                </div>
                <button className="btn btn-danger" onClick={closeModal}>Fechar</button>
            </Modal>
        </div>
    );
}
