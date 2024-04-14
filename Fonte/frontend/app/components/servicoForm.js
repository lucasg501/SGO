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

        if (idAtuacao.current.value > 0 && idParceiro.current.value > 0) {


        }
        else {
            alert("Por favor, selecione uma área de atuação e um parceiro.");
        }
    }

    useEffect(() => {
        listarAtuacao();
    }, []);

    return(
        <div>
            <h1> Alocar Parceiro na obra de Nº:{idObra}</h1>

            <div>
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

            <div>
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

                <button onClick={alocarParceiro} 
                className="btn btn-primary">Alocar</button>
                <a href="/obras"><button style={{marginLeft: 50}} className="btn btn-danger">Cancelar</button></a>
            </div>
        </div>
    )
}
