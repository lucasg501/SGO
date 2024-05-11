'use client'
import { useEffect, useState } from "react";
import httpClient from "../utils/httpClient";
import Link from "next/link";
import Carregando from "../components/carregando";

export default function Etapas(){

    const [listaAcompEtapas, setListaAcompEtapas] = useState([]);
    const [listaObras, setListaObras] = useState([]);
    const [listaEtapas, setListaEtapas] = useState([]);
    const [carregando, setCarregando] = useState(true);

    function carregarAcompEtapas(){
        httpClient.get('/andamentoEtapas/listar')
            .then(r => r.json())
            .then(r => {
                const etapasPorObra = {};

                // Organize as etapas por obra
                r.forEach(etapa => {
                    if(etapasPorObra[etapa.idObra]){
                        etapasPorObra[etapa.idObra].push(etapa);
                    } else {
                        etapasPorObra[etapa.idObra] = [etapa];
                    }
                });

                // Atualize as informações das obras
                setListaAcompEtapas(etapasPorObra);
            });
    }

    function carregarObras(){
        httpClient.get('/obras/listar')
            .then(r => r.json())
            .then(r => {
                setListaObras(r);
            });
    }

    function carregarEtapas(){
        httpClient.get('/etapas/listar')
            .then(r => r.json())
            .then(r => {
                setListaEtapas(r);
                setCarregando(false);
            });
    }

    useEffect(() =>{
        carregarAcompEtapas();
        carregarObras();
        carregarEtapas();
    },[]);

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

    return (
        <div>
            <h1>Etapas</h1>
    
            <div style={{ marginBottom: 25 }}>
                <a href="/etapas/gravar"><button className="btn btn-primary">Cadastrar</button></a>
            </div>

            {
                carregando ?
                <Carregando />
                :
                <div>
                    {Object.keys(listaAcompEtapas).map(idObra => {
                        // Verificar se todas as etapas da obra têm uma data de término
                        const todasEtapasConcluidas = listaAcompEtapas[idObra].every(etapa => etapa.dataFim);
        
                        // Se todas as etapas estiverem concluídas, não renderizar a obra na lista
                        if (todasEtapasConcluidas) {
                            return null;
                        }
        
                        // Caso contrário, renderizar a obra e suas etapas
                        return (
                            <div key={idObra} style={{ marginBottom: 20 }}>
                                <details style={{ border: '1px solid #ccc', borderRadius: 5, padding: 10 }}>
                                    <summary style={{ cursor: 'pointer', fontWeight: 'bold' }}>Obra: {encontrarBairro(Number(idObra))}</summary>
                                    <table className="table table-hover">
                                        <thead>
                                            <tr>
                                                <th>Etapa</th>
                                                <th>Data Início</th>
                                                <th>Data Término</th>
                                                <th>Data Fim</th>
                                                <th>Descrição</th>
                                                <th>Marcar como terminada</th>
                                                <th>Excluir</th>
                                            </tr>
                                        </thead>
        
                                        <tbody>
                                            {listaAcompEtapas[idObra].map((etapa, index) => (
                                                <tr key={index}>
                                                    <td>{encontrarEtapa(etapa.idEtapa)}</td>
                                                    <td>{formatarData(etapa.dataPrevInicio)}</td>
                                                    <td>{formatarData(etapa.dataPrevTermino)}</td>
                                                    <td>{etapa.dataFim ? formatarData(etapa.dataFim) : ''}</td>
                                                    <td>{etapa.descricaoEtapa}</td>
                                                    <td style={{ display: 'flex', alignContent: 'center' }}>
                                                        {etapa.dataFim ? (
                                                            <button disabled style={{ margin: 'auto' }} className="btn btn-success"><i className="fas fa-check"></i></button>
                                                        ) : (
                                                            <Link style={{ margin: 'auto' }} className="btn btn-success" href={`/etapas/alterar/${etapa.idAndamento}`}><i className="fas fa-check"></i></Link>
                                                        )}
                                                    </td>
                                                    <td>
                                                        <button className="btn btn-danger" onClick={() => {
                                                            if (confirm('Tem certeza que deseja excluir esta etapa e todos os dados relacionados a ela?')) {
                                                                httpClient.delete(`/andamentoEtapas/excluir/${etapa.idAndamento}`)
                                                                    .then(r => {
                                                                        carregarEtapas();
                                                                        carregarAcompEtapas();
                                                                    })
                                                                    .catch(error => console.error('Erro ao excluir etapa:', error));
                                                            }
                                                        }}><i className="fas fa-trash"></i></button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </details>
                            </div>
                        );
                    })}
                </div>
            }
            
        </div>
    );
    
}
