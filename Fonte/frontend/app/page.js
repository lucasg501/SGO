'use client'
import { useEffect, useState } from "react";
import httpClient from "./utils/httpClient"
import Link from "next/link";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function AdminLayout({ children }) {
    const [listaAcompEtapas, setListaAcompEtapas] = useState([]);
    const [listaObras, setListaObras] = useState([]);
    const [listaEtapas, setListaEtapas] = useState([]);
    const [obrasNotificadas, setObrasNotificadas] = useState([]);
    const [haParcelasVencidas, setHaParcelasVencidas] = useState(false);

    function procurarParcelasVencidas() {

        httpClient.get(`/parcelas/parcelasVencidas/`)
        .then(r => {
            return r.json();
        })
        .then(r => {
            let achouParcelasVencidas = r.length > 0;
            setHaParcelasVencidas(achouParcelasVencidas);
        });
    }

    function carregarAcompEtapas() {
        httpClient.get('/andamentoEtapas/listar')
            .then(r => r.json())
            .then(r => {
                const etapasPorObra = {};

                // Organize as etapas por obra
                r.forEach(etapa => {
                    if (etapasPorObra[etapa.idObra]) {
                        etapasPorObra[etapa.idObra].push(etapa);
                    } else {
                        etapasPorObra[etapa.idObra] = [etapa];
                    }
                });

                // Atualize as informações das obras
                setListaAcompEtapas(etapasPorObra);
            });
    }

    function carregarObras() {
        httpClient.get('/obras/listar')
            .then(r => r.json())
            .then(r => {
                setListaObras(r);
            });
    }

    function carregarEtapas() {
        httpClient.get('/etapas/listar')
            .then(r => r.json())
            .then(r => {
                setListaEtapas(r);
            });
    }

    useEffect(() => {
        carregarAcompEtapas();
        carregarObras();
        carregarEtapas();
        procurarParcelasVencidas();
    }, []);

    // Função para encontrar o bairro correspondente ao idObra
    function encontrarBairro(idObra) {
        const obra = listaObras.find(obra => obra.idObra === idObra);
        return obra ? obra.bairro : "Desconhecido";
    }

    function encontrarEtapa(idEtapa) {
        const etapa = listaEtapas.find(etapa => etapa.idEtapa === idEtapa);
        return etapa ? etapa.nomeEtapa : "Etapa desconhecida";
    }

    // Função para formatar a data no formato dd/mm/aaaa
    function formatarData(data) {
        return new Date(data).toLocaleDateString('pt-BR');
    }

    // Função para notificar sobre as etapas perto de expirar
    function notificarEtapasPertoExpirar(obras) {
        obras.forEach(idObra => {
            if (!obrasNotificadas.includes(idObra)) {
                const bairro = encontrarBairro(Number(idObra));
                const mensagem = `Há etapas perto de expirar!!`;
                toast.info(mensagem, {
                    position: 'bottom-right',
                    autoClose: 5000
                });
                setObrasNotificadas([...obrasNotificadas, idObra]);
            }
        });
    }

    return (
        <div>
            <h1>Início</h1>

            {
                haParcelasVencidas ?
                <div style={{marginTop: 20, marginBottom: 20}}>
                    <div style={{color: 'red', fontWeight: 'bold'}}>AVISO: Você possui obras com parcelas vencidas.</div>
                    <a href='/recebimentos'><button className="btn btn-danger">Ir para página de recebimentos</button></a>
                </div>
                :
                <></>
            }
            <div className="card" style={{padding: 20, marginTop: 20, marginBottom: 20}}>
                <div>
                    <h1>Obras em andamento:</h1>
                </div>
                <div>
                    {Object.keys(listaAcompEtapas).map(idObra => {
                        const obrasFiltradas = listaAcompEtapas[idObra].filter(etapa => etapa.dataFim === '' || etapa.dataFim === null);

                        // Verifica se há obras para exibir após o filtro
                        if (obrasFiltradas.length > 0) {
                            return (
                                <div key={idObra} style={{ marginBottom: 20 }}>
                                    <details style={{ border: '1px solid #ccc', borderRadius: 5, padding: 10 }}>
                                        <summary style={{ cursor: 'pointer', fontWeight: 'bold' }}>Obra: {encontrarBairro(Number(idObra))}</summary>
                                        <table className="table table-hover">
                                            <thead>
                                                <tr>
                                                    <th>Etapa</th>
                                                    <th>Data Início</th>
                                                    <th style={{ color: 'red' }}>Data Término</th>
                                                    <th>Descrição</th>
                                                    <th>Ver Obra</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {obrasFiltradas.map((etapa, index) => (
                                                    <tr key={index}>
                                                        <td>{encontrarEtapa(etapa.idEtapa)}</td>
                                                        <td>{formatarData(etapa.dataPrevInicio)}</td>
                                                        <td style={{ color: 'red' }}>{formatarData(etapa.dataPrevTermino)}</td>
                                                        <td>{etapa.descricaoEtapa}</td>
                                                        <td style={{ display: 'flex', alignContent: 'center' }}>
                                                            <Link style={{ margin: 'auto' }} className="btn btn-success" href={`/etapas`}>Ver Obras</Link>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </details>
                                </div>
                            );
                        } else {
                            return null; // Se não há obras a serem exibidas, retorna null
                        }
                    })}
                </div>
            </div>

            {/*-----------------------------------------------------------------------------------------------------------------------*/}

            <div className="card" style={{padding: 20, marginTop: 20, marginBottom: 20}}>
                <div style={{ width: '100%' }}>
                    <h1>Etapas perto de expirar:</h1>
                    <div style={{ display: 'flex', flexDirection: 'row', alignContent: 'space-around' }}>
                        {Object.keys(listaAcompEtapas).map(idObra => {
                            const etapasFiltradas = listaAcompEtapas[idObra].filter(etapa => {
                                const tresDiasDepois = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000); // Hoje + 3 dias
                                const dataPrevistaTermino = new Date(etapa.dataPrevTermino);
                                const dataFim = etapa.dataFim || ''; // Garante que dataFim seja uma string para a comparação
                                return (dataPrevistaTermino.getTime() <= tresDiasDepois.getTime()) && (dataFim === null || dataFim === '');
                            });

                            if (etapasFiltradas.length > 0) {
                                // Notifica sobre as etapas perto de expirar
                                notificarEtapasPertoExpirar([idObra]);

                                // Renderiza as etapas filtradas
                                return (
                                    <div key={idObra} style={{ marginBottom: 20, border: '1px solid #ccc', borderRadius: 5, padding: 10, width: '50%' }}>
                                        <summary style={{ cursor: 'pointer', fontWeight: 'bold', listStyle: 'none' }}>Obra: {encontrarBairro(Number(idObra))}</summary>
                                        <table className="table table-hover">
                                            <thead>
                                                <tr>
                                                    <th style={{ color: 'red' }}>Data Término</th>
                                                    <th>Ver Etapa</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {etapasFiltradas.map((etapa, index) => (
                                                    <tr key={index}>
                                                        <td style={{ color: 'red' }}>{formatarData(etapa.dataPrevTermino)}</td>
                                                        <td style={{ display: 'flex', alignContent: 'center' }}>
                                                            <Link style={{ margin: 'auto' }} className="btn btn-success" href={`/etapas/alterar/${etapa.idAndamento}`}>Ver Etapa</Link>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                );
                            } else {
                                return null;
                            }
                        })}
                    </div>
                    <ToastContainer />
                </div>
            </div>
        </div>

    )
}
