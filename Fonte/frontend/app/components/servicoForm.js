'use client'
import { useEffect, useRef, useState } from "react";
import httpClient from "../utils/httpClient";

export default function ServicoForm({params:{idObra}}) {

    const descricaoServico = useRef('');
    const valorServico = useRef(0);
    const idAtuacao = useRef('');
    const idParceiro = useRef('');

    const [listaAtuacao, setListaAtuacao] = useState([]);
    const [listaParceiros, setListaParceiros] = useState([]);

    function listarAtuacao(){
        httpClient.get('/areaAtuacao/listar')
        .then(r=>{
            return r.json();
        })
        .then(r=>{
            setListaAtuacao(r);
        })
    }

    function listarParceiros(idAreaAtuacao) {
        httpClient.get(`/parceiros/obterParceirosArea/${idAreaAtuacao}`)
        .then(r=>{
            return r.json();
        })
        .then(r=>{
            if (r.length > 0) {
                setListaParceiros(r);
            }
            else {
                idParceiro.current.value = 0;
                setListaParceiros([]);
            }
        })
    }

    function alocarParceiro() {

        let valor = parseFloat(valorServico.current.value);

        if (idAtuacao.current.value > 0 && idParceiro.current.value > 0 && descricaoServico.current.value != "" && valor > 0) {
            
            let status = 0;

            httpClient.post('/servicos/gravar', {
                descServico: descricaoServico.current.value,
                valorServico: valor,
                idObra: idObra,
                idParceiro: idParceiro.current.value
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
            });
        }
        else {
            alert("Preencha todos os campos!");
        }
    }

    useEffect(() => {
        listarAtuacao();
    }, []);

    return(
        <div>
            <h1> Alocar Parceiro</h1>

            <div className="form-group">
                <label>Área de atuação</label>
                <select className="form-control" ref={idAtuacao} onChange={(e) => listarParceiros(e.target.value)}>
                    <option value="0">Selecione</option>
                    {
                        listaAtuacao.map(function(value,index){
                            return(
                                <option key={index} value={value.idArea}>{value.nomeAtuacao}</option>
                            )
                        }) 
                    }
                </select>
            </div>

            <div className="form-group">
                <label>Parceiro</label>
                <select className="form-control" ref={idParceiro}>
                    <option value="0">Selecione</option>
                    {
                        listaParceiros.map(function(value,index){
                            return(
                                <option key={index} value={value.idParceiro}>{value.nomeParceiro}</option>
                            )
                        }) 
                    }
                </select>
            </div>

            <div className="form-group">
                <label>Descrição do Serviço</label>
                <textarea className="form-control" ref={descricaoServico}></textarea>
            </div>

            <div className="form-group">
                <label>Valor do Serviço</label>
                <input type="number" className="form-control" defaultValue={0} ref={valorServico}></input>
            </div>

            <button onClick={alocarParceiro} 
                className="btn btn-primary">Alocar</button>
            <a href="/obras"><button style={{marginLeft: 50}} className="btn btn-danger">Cancelar</button></a>
        </div>
    )
}
