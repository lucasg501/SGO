'use client'
import { useEffect, useRef, useState } from "react";
import httpClient from "../utils/httpClient";
import Link from "next/link";
import Carregando from "../components/carregando";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export default function Obras() {

    const [listaObras, setListaObras] = useState([]);
    const [listaClientes, setListaClientes] = useState([]);
    const [busca, setBusca] = useState("");
    const [listaBusca, setListaBusca] = useState([]);
    const termoBusca = useRef("");
    const [listaEtapas, setListEtapas] = useState([]);
    const [filtroTerminada, setFiltroTerminada] = useState('0');
    const [carregando, setCarregando] = useState(true);
    const [listaServicos, setListaServicos] = useState([]);
    const [listaParcelas, setListaParcelas] = useState([]);

    useEffect(() => {
        carregarObras();
        listarClientes();
        carregarEtapas();
        carregarParcelas();
        carregarServicos();
    }, []);

    function carregarParcelas() {
        httpClient.get('/parcelas/listar')
            .then(r => {
                return r.json();
            })
            .then(r => {
                setListaParcelas(r);
            })
    }

    function carregarServicos() {
        httpClient.get('/servicos/listar')
            .then(r => {
                return r.json();
            })
            .then(r => {
                setListaServicos(r);
            })
    }

    function carregarEtapas() {
        httpClient.get('/andamentoEtapas/listar')
            .then(r => {
                return r.json();
            })
            .then(r => {
                setListEtapas(r);
            })
    }

    function carregarObras() {
        httpClient.get('/obras/listar')
            .then(r => {
                return r.json();
            })
            .then(r => {
                setListaObras(r);
                filtrarObras('0', r);
                setCarregando(false);
            })
    }

    function excluirObra(idObra) {
        const confirmacao = window.confirm("Tem certeza que deseja excluir esta obra?");
        if (confirmacao) {
            httpClient.delete(`/obras/excluir/${idObra}`)
                .then(r => {
                    return r.json();
                })
                .then(r => {
                    alert(r.msg);
                    carregarObras();
                })
        }
    }

    function listarClientes() {
        httpClient.get('/clientes/listar')
            .then(r => {
                return r.json();
            })
            .then(r => {
                setListaClientes(r);
            })
    }

    function filtrarBusca() {
        setBusca(termoBusca.current.value.toLowerCase());

        if (busca !== "" && listaObras) {
            setListaBusca(listaObras.filter((obra) =>
                obra.bairro.toLowerCase().includes(busca)
            ));
        }
    }

    function filtrarObras(filtro, obras) {
        if (filtro === '0') {
            setListaBusca(obras);
        } else {
            const filteredObras = obras.filter(obra => {
                return obra.terminada === (filtro === 'S' ? 'S' : 'N');
            });
            setListaBusca(filteredObras);
        }
    }

    function formatarData(data) {
        const dataObj = new Date(data);
        return dataObj.toLocaleDateString('pt-BR');
    }

    function gerarPDF(idObra) {
        const obra = listaObras.find(o => o.idObra === idObra);
        const parcelas = listaParcelas.filter(p => p.idObra === idObra);
        const servicos = listaServicos.filter(s => s.idObra === idObra);

        // Calcular a soma dos valores das parcelas
        const somaParcelas = parcelas.reduce((acc, parcela) => acc + parseFloat(parcela.valorParcela), 0);

        // Calcular a soma dos valores dos serviços
        const somaServicos = servicos.reduce((acc, servico) => acc + parseFloat(servico.valorServico), 0);

        const doc = new jsPDF();

        doc.text(`Obra: ${obra.endereco}`, 10, 10);
        doc.text(`Bairro: ${obra.bairro}`, 10, 20);

        doc.text('Parcelas:', 10, 40);
        parcelas.forEach((parcela, index) => {
            doc.text(`Parcela ${index + 1}: R$ ${parcela.valorParcela.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, 10, 50 + (index * 10));
        });

        doc.text('Serviços:', 10, 60 + (parcelas.length * 10));
        servicos.forEach((servico, index) => {
            doc.text(`Serviço ${servico.descServico}: R$ ${servico.valorServico.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, 10, 70 + (parcelas.length * 10) + (index * 10));
        });


        // Adicionar a soma dos valores das parcelas e dos serviços ao final do PDF
        doc.text(`Total das Parcelas: R$ ${somaParcelas.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, 10, 80 + (parcelas.length * 10) + (servicos.length * 10));
        doc.text(`Total dos Serviços: R$ ${somaServicos.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, 10, 90 + (parcelas.length * 10) + (servicos.length * 10));
        const totalObra = somaParcelas + somaServicos;
        doc.text(`Total da obra: R$ ${totalObra.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, 10, 100 + (parcelas.length * 10) + (servicos.length * 10));


        doc.save(`obra_${obra.bairro + '_' + obra.endereco}.pdf`);
    }


    return (
        <div>
            <h1>Obras</h1>

            <div className="card shadow">
                <div style={{ display: 'flex', justifyContent: 'space-between' }} className="card-header">
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <Link href="/obras/gravar"><button className="btn btn-primary">Cadastrar</button></Link>
                    </div>

                    <div className="form-group" style={{ marginTop: 15 }}>
                        <label>Filtrar por:</label>
                        <select
                            className="form-select"
                            style={{ width: 200, }}
                            value={filtroTerminada}
                            onChange={(e) => {
                                setFiltroTerminada(e.target.value);
                                filtrarObras(e.target.value, listaObras);
                            }}
                        >
                            <option value={'0'}>Mostrar Todos</option>
                            <option value={'S'}>Terminadas</option>
                            <option value={'N'}>Em andamento</option>
                        </select>
                    </div>
                </div>

                {carregando ? <Carregando /> : (
                    <div className="card-body">
                        <div className="form-group">
                            <label>Buscar</label>
                            <input
                                type="text"
                                ref={termoBusca}
                                placeholder="Digite o bairro da obra..."
                                className="form-control"
                                onChange={() => filtrarBusca()}
                            />
                        </div>

                        <div className="table-responsive">
                            <table className="table table-hover">
                                <thead>
                                    <tr>
                                        <th>Endereço</th>
                                        <th>Bairro</th>
                                        <th>Cidade</th>
                                        <th>CEP</th>
                                        <th>Valor Total</th>
                                        <th>Data Inicio</th>
                                        <th>Data Prevista de Término</th>
                                        <th>Contrato</th>
                                        <th>Planta</th>
                                        <th>Cliente</th>
                                        <th>Terminada</th>
                                        <th>Editar</th>
                                        <th>Excluir</th>
                                        <th>Alocar</th>
                                        <th>Todos os Custos</th>

                                    </tr>
                                </thead>
                                <tbody>
                                    {listaBusca.map((value, index) => {
                                        const cliente = listaClientes.find(cliente => cliente.idCli === value.idCliente);
                                        const nomeCliente = cliente ? cliente.nomeCli : "Cliente desconhecido";

                                        return (
                                            <tr key={index}>
                                                <td>{value.endereco}</td>
                                                <td>{value.bairro}</td>
                                                <td>{value.cidade}</td>
                                                <td>{value.cepObra}</td>
                                                <td>{parseFloat(value.valorTotal).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                                                <td>{formatarData(value.dataInicio)}</td>
                                                <td>{formatarData(value.dataTermino)}</td>
                                                <td>{value.contrato ? <a href={value.contrato} download>{value.contrato}</a> : "Não possui"}</td>
                                                <td>{value.planta ? <a href={value.planta} download>{value.planta}</a> : "Não possui"}</td>
                                                <td>{nomeCliente}</td>
                                                <td style={{ textAlign: 'center' }}>{value.terminada == 'S' ? 'Sim' : 'Não'}</td>
                                                <td>
                                                    {value.terminada === 'S' ? (
                                                        <span className="btn btn-primary" style={{ pointerEvents: 'none', opacity: 0.5 }}>
                                                            <i className="fas fa-pen"></i>
                                                        </span>
                                                    ) : (
                                                        <Link className="btn btn-primary" href={`/obras/alterar/${value.idObra}`}>
                                                            <i className="fas fa-pen"></i>
                                                        </Link>
                                                    )}
                                                </td>
                                                <td>
                                                    <button disabled={value.terminada == 'S'} style={{ marginLeft: 10, marginRight: 10 }} onClick={() => excluirObra(value.idObra)} className="btn btn-danger"><i className="fas fa-trash"></i></button>
                                                </td>
                                                <td>
                                                    {value.terminada === 'S' ? (
                                                        <span>
                                                            <button className="btn btn-success" disabled>
                                                                <i className="fas fa-users"></i>
                                                            </button>
                                                        </span>
                                                    ) : (
                                                        <Link href={`/obras/servicos/${value.idObra}`}>
                                                            <button className="btn btn-success">
                                                                <i className="fas fa-users"></i>
                                                            </button>
                                                        </Link>
                                                    )}
                                                </td>
                                                <td>
                                                    <button onClick={() => gerarPDF(value.idObra)} className="btn btn-warning">
                                                        <i className="fas fa-file-pdf"></i>
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
