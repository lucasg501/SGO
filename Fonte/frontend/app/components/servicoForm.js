'use client'
import { useEffect, useRef, useState } from "react";
import httpClient from "../utils/httpClient";

export default function ServicoForm({ params: { idObra } }) {
    const descricaoServico = useRef('');
    const valorServico = useRef(0);
    const idAtuacao = useRef('');
    const idParceiro = useRef('');
    const dataServ = useRef(null);

    const [listaAtuacao, setListaAtuacao] = useState([]);
    const [listaParceiros, setListaParceiros] = useState([]);
    const [bairroObra, setBairroObra] = useState('');
    const [listaServicos, setListaServicos] = useState([]);
    const [listaTotalParceiros, setListaTotalParceiros] = useState([]);

    function listarAtuacao() {
        httpClient.get('/areaAtuacao/listar')
            .then(r => r.json())
            .then(r => setListaAtuacao(r));
    }

    function carregarTodosParceiros() {
        httpClient.get('/parceiros/listar')
            .then(r => r.json())
            .then(r => setListaTotalParceiros(r));
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
        const valor = parseFloat(valorServico.current.value);
        const parceiroSelecionado = idParceiro.current.value;
        const dataSelecionada = dataServ.current.value;
    
        // Verificar se o parceiro já está na listaServicos para a mesma data
        const mesmoParceiroMesmaData = listaServicos.some(servico => {
            // Verificando se o serviço tem uma data definida
            if (servico.dataServ !== null) {
                // Convertendo a dataServ do serviço para o formato YYYY-MM-DD
                const dataServFormatada = servico.dataServ.split('T')[0];
                // Convertendo a dataSelecionada para o mesmo formato
                const dataSelecionadaFormatada = dataSelecionada.split('T')[0];
                
                // Verificando se o idParceiro e a dataServ do serviço são iguais aos valores selecionados
                return servico.idParceiro == parceiroSelecionado && dataServFormatada === dataSelecionadaFormatada;
            } else {
                return false; // Se a dataServ for nula, não há coincidência de datas
            }
        });
        
        
    
        if (mesmoParceiroMesmaData) {
            alert("Não é possível gravar o mesmo parceiro na mesma data.");
            return;
        }
    
        if (idAtuacao.current.value > 0 && parceiroSelecionado > 0 && descricaoServico.current.value !== "" && valor > 0) {
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
    
    

    useEffect(() => {
        listarAtuacao();
        carregarObra();
        carregarServicos();
        carregarTodosParceiros();
    }, []);

    return (
        <div>
            <h1>Alocar Parceiro</h1>

            <div>
                <h3>Obra: {bairroObra}</h3>
            </div>

            <div style={{ display: 'inline-flex', marginTop: 30 }}>
                <div className="form-group" style={{ marginRight: 30 }}>
                    <label>Área de atuação</label>
                    <select className="form-control" ref={idAtuacao}
                        onChange={(e) => listarParceiros(e.target.value)} style={{ width: 200, textAlign: 'center' }}>
                        <option value="0">Selecione</option>
                        {listaAtuacao.map((value, index) => (
                            <option key={index} value={value.idArea}>{value.nomeAtuacao}</option>
                        ))}
                    </select>
                </div>

                <div className="form-group">
                    <label>Parceiro</label>
                    <select className="form-control" ref={idParceiro} style={{ width: 200, textAlign: 'center' }}>
                        <option value="0">Selecione</option>
                        {listaParceiros.map((value, index) => (
                            <option key={index} value={value.idParceiro}>{value.nomeParceiro}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="form-group">
                <label>Descrição do Serviço</label>
                <textarea className="form-control" ref={descricaoServico}></textarea>
            </div>

            <div style={{ display: 'inline-flex' }}>
                <div className="form-group">
                    <label>Valor do Serviço</label>
                    <input type="number" className="form-control" ref={valorServico} style={{ width: 200, marginRight: 30 }}></input>
                </div>

                <div className="form-group">
                    <label>Data do Serviço</label>
                    <input type="date" className="form-control" ref={dataServ} style={{ width: 200 }}></input>
                </div>
            </div>

            <div style={{ marginTop: 20 }}>
                <button onClick={alocarParceiro} className="btn btn-primary">Alocar</button>
                <a href="/obras"><button style={{ marginLeft: 50 }} className="btn btn-danger">Cancelar</button></a>
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
                            <td>{value.valorServico}</td>
                            <td>{value.dataServ == null ? 'N/A' : new Date(value.dataServ).toLocaleDateString()}</td>
                            <td>
                                <button style={{backgroundColor:'red'}} className="btn btn-danger" onClick={() => {
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
    );
}
