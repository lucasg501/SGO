'use client'
import { useEffect, useRef, useState } from "react";
import httpClient from "../utils/httpClient";

export default function ParceiroForm(props) {

    const nomeParceiro = useRef('');
    const telParceiro = useRef('');
    const idAreaAtuacao = useRef(0);

    const [parceiro, setParceiro] = props.parceiro ? useState(props.parceiro) : useState({idParceiro:0, nomeParceiro: '', telParceiro: '', idAreaAtuacao: 0});
    const [listaAreaAtuacao, setListaAreaAtuacao] = useState([]);

    function carregarAreasAtuacao() {
        httpClient.get('/areaAtuacao/listar')
        .then(r => {
            return r.json();
        })
        .then(r => {
            setListaAreaAtuacao(r);
        });
    }

    function cadastrarParceiro() {
        let status = 0;

        if (nomeParceiro.current.value != '' && telParceiro.current.value != '' && idAreaAtuacao.current.value > 0) {
            
            httpClient.post('/parceiros/gravar', {
                nomeParceiro: nomeParceiro.current.value,
                telParceiro: telParceiro.current.value,
                idAreaAtuacao: idAreaAtuacao.current.value
            })
            .then(r => {
                status = r.status;
                return r.json();
            })
            .then(r => {
                alert(r.msg);
                if (status == 200) {
                    nomeParceiro.current.value = '';
                    telParceiro.current.value = '';
                    idAreaAtuacao.current.value = 0;
                }
            });
        }
        else {
            alert('Preencha todos os campos!');
        }
    }

    function alterarParceiro() {
        let status = 0;
        if(nomeParceiro.current.value != "" && telParceiro.current.value != "" && idAreaAtuacao.current.value > 0){
            httpClient.put('/parceiros/alterar', {

                idParceiro: parceiro.idParceiro,
                nomeParceiro: nomeParceiro.current.value,
                telParceiro: telParceiro.current.value,
                idAreaAtuacao: idAreaAtuacao.current.value
            })
            .then(r => {
                status = r.status;
                return r.json();
            })
            .then(r=>{
                alert(r.msg);
                if (status == 200) {
                    window.location.href = '/parceiros';
                }
            })
        }
        }

    useEffect(() => {
        carregarAreasAtuacao();
        carregarObra();
    }, []);

    return (
        <div>
            <h1>{parceiro.idParceiro == 0 ? 'Cadastrar Novo Parceiro' : 'Alterar Parceiro'}</h1>

            <div className="form-group">
                <label>Nome:</label>
                <input type="text" defaultValue={parceiro.nomeParceiro} className="form-control" ref={nomeParceiro}/>
            </div>

            <div className="form-group">
                <label>Telefone:</label>
                <input type="tel" defaultValue={parceiro.telParceiro} maxLength={14} className="form-control" ref={telParceiro}/>
            </div>

            <div className="form-group">
                <label>Área de Atuação</label>
                <select className="form-control" style={{width: 350, textAlign: 'center'}}
                defaultValue={parceiro.idAreaAtuacao} ref={idAreaAtuacao}>
                    <option value={0}>-- SELECIONE --</option>
                    {
                        listaAreaAtuacao.map((areaAtuacao, index) => {
                            if (parceiro != null && parceiro.idAreaAtuacao == areaAtuacao.idArea){
                                return <option selected value={areaAtuacao.idArea}>{areaAtuacao.nomeAtuacao}</option>
                            }
                            else {
                                return <option value={areaAtuacao.idArea}>{areaAtuacao.nomeAtuacao}</option>
                            }
                        })
                    }
                </select>
            </div>

            <div>
                <button onClick={parceiro.idParceiro != 0 ? alterarParceiro : cadastrarParceiro} 
                className="btn btn-primary">{parceiro.idParceiro != 0 ? 'Alterar' : 'Cadastrar'}</button>
                <a href="/parceiros"><button style={{marginLeft: 50}} className="btn btn-danger">Cancelar</button></a>
            </div>
        </div>
    );
}