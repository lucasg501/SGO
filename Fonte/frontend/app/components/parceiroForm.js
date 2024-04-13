'use client'

import { useEffect, useRef, useState } from "react";
import httpClient from "../utils/httpClient";

export default function ParceiroForm(props) {

    const nomeParceiro = useRef('');
    const telParceiro = useRef('');
    const cargoParceiro = useRef('');
    const salarioParceiro = useRef('');
    const descTrabalho = useRef('');
    const idAreaAtuacao = useRef(0);

    const [parceiro, setParceiro] = props.parceiro ? useState(parceiro) :
    useState({idParceiro: 0, nomeParceiro: '', telParceiro: '', cargoParceiro: '', salarioParceiro: '', descTrabalho: '',
    idAreaAtuacao: 0});
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

    function alterarParceiro() {

    }

    function cadastrarParceiro() {

        if (nomeParceiro.current.value != '' && telParceiro.current.value != '' && cargoParceiro.current.value != '' 
        && salarioParceiro.current.value != '' && descTrabalho.current.value != ''
        && idAreaAtuacao.current.value > 0) {
            
            httpClient.post('/parceiros/gravar', {

                nomeParceiro: nomeParceiro.current.value,
                telParceiro: telParceiro.current.value,
                cargoParceiro: cargoParceiro.current.value,
                salarioParceiro: parseFloat(salarioParceiro.current.value),
                descTrabalho: descTrabalho.current.value,
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
                    cargoParceiro.current.value = '';
                    salarioParceiro.current.value = '';
                    descTrabalho.current.value = '';
                    idAreaAtuacao.current.value = 0;
                }
            });
        }
        else {
            alert('Preencha todos os campos!');
        }
    }

    useEffect(() => {
        carregarAreasAtuacao();
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
                <label>Cargo:</label>
                <input type="text" defaultValue={parceiro.cargoParceiro} className="form-control" ref={cargoParceiro}/>
            </div>

            <div className="form-group">
                <label>Salario:</label>
                <input type="text" defaultValue={parceiro.salarioParceiro} className="form-control" ref={salarioParceiro}/>
            </div>

            <div className="form-group">
                <label>Descrição do Trabalho:</label>
                <textarea defaultValue={parceiro.descTrabalho} className="form-control" ref={descTrabalho}/>
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