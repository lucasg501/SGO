'use client'
import { useEffect, useRef, useState } from "react";
import httpClient from "../utils/httpClient";
export default function ServicoForm(props) {
    const descricaoServico = useRef('');
    const valorServico = useRef(0);
    const idAtuacao = useRef('');
    const idParceiro = useRef('');

    const [servico, setServico] = props.servico ? useState(props.servico) : useState({ idServico: 0, descServico: "", valorServico: 0, idObra: 0, idParceiro: 0 });
    const [listaObras, setListaObras] = useState([]);
    const [listaAtuacao, setListaAtuacao] = useState([]);
    const [listaParceiros, setListaParceiros] = useState([]);
    const [bairroObra, setBairroObra] = useState('');
    const [nomeAtuacao, setNomeAtuacao] = useState('');

    const [gravando, setGravando] = useState(false);

    function carregarObras() {
        httpClient.get('/obras/listar')
            .then(r => r.json())
            .then(r => setListaObras(r));
    }
    
    useEffect(() => {
        carregarObras();
        carregarParceiros();
    }, []);

    function carregarParceiros() {
        httpClient.get('/parceiros/listar')
            .then(r => r.json())
            .then(r => setListaParceiros(r));
    }


    useEffect(() => {
        if (props.idObra) {
            const obra = listaObras.find(obra => obra.idObra === props.idObra);
            if (obra) {
                setBairroObra(obra.bairro);
            }
        }
    }, [props.idObra, listaObras]);

    useEffect(() => {
        httpClient.get('/parceiros/listar')
            .then(r => r.json())
            .then(r => setListaParceiros(r))
            .catch(error => console.error("Erro ao obter lista de parceiros:", error));
    }, []);

    function alterarAlocacao() {
        const valor = parseFloat(valorServico.current.value);
        if (idParceiro.current.value > 0 && descricaoServico.current.value !== "" && valor > 0) {

            setGravando(true);
            let status = 0;
            
            httpClient.put('/servicos/alterar', {
                idServico: props.servico.idServico,
                descServico: descricaoServico.current.value,
                valorServico: valor,
                idObra: props.idObra,
                idParceiro: idParceiro.current.value
            })
                .then(r => {
                    status = r.status;
                    return r.json();
                })
                .then(r => {
                    alert(r.msg);
                    setGravando(false);

                    if (status === 200) {
                        window.location.href = '/obras/servicos';
                    }
                });
        } else {
            alert("Preencha todos os campos!");
        }
    }

    return (
        <div>
            <h1>Alocar Parceiro</h1>

            <div>
                <h3>Obra: {bairroObra}</h3>
            </div>

            <div className="form-group">
                <label>Parceiro</label>
                <select disabled={props.servico != null ? true : false} className="form-control" defaultValue={servico.idParceiro} ref={idParceiro}>
                    {
                        listaParceiros.map(function(value,index){
                            if(value.idParceiro == servico.idParceiro){
                                return(
                                    <option key={value.idParceiro} value={value.idParceiro}>
                                        {value.nomeParceiro}
                                    </option>
                                )
                            }
                        })    
                    }
                </select>
            </div>

            <div className="form-group">
                <label>Descrição do Serviço</label>
                <textarea className="form-control" defaultValue={servico.descServico} ref={descricaoServico}></textarea>
            </div>

            <div className="form-group">
                <label>Valor do Serviço</label>
                <input type="number" className="form-control" defaultValue={servico.valorServico} ref={valorServico}></input>
            </div>

            <div>
                {
                    gravando ? <p style={{fontWeight: 'bold'}}>Aguardando gravação...</p> : <></>
                }
            </div>
            <button onClick={alterarAlocacao} className="btn btn-primary" disabled={gravando}>Alterar</button>
            <a href="/obras"><button style={{ marginLeft: 50 }} className="btn btn-danger" disabled={gravando}>Cancelar</button></a>

        </div>
    );
}
