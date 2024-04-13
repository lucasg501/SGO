'use client'

import { useRef, useState } from "react";
import httpClient from "../utils/httpClient";

export default function FuncionarioForm(props) {

    const idFunc = useRef('');
    const nomeFunc = useRef('');
    const telFunc = useRef('');
    const cargoFunc = useRef('');

    const [funcionario, setFuncionario] = props.funcionario ? useState(props.funcionario)
    : useState({idFunc: 0, nomeFunc: '', telFunc: '', cargoFunc: ''});

    function alterarFuncionario() {
        
    }

    function cadastrarFuncionario() {

        if (nomeFunc.current.value != '' && telFunc.current.value != '' && cargoFunc.current.value != '') {

            httpClient.post('/funcionarios/gravar', {

                nomeFuncionario: nomeFunc.current.value,
                telFuncionario: telFunc.current.value,
                cargoFuncionario: cargoFunc.current.value
            })
            .then(r => {
                status = r.status;
                return r.json();
            })
            .then(r => {
                alert(r.msg);
                
                if (status == 200) {
                    nomeFunc.current.value = '';
                    telFunc.current.value = '';
                    cargoFunc.current.value = '';
                }
            });
        }
        else {
            alert('Preencha todos os campos!');
        }
    }

    return (
        <div>
            <h1>{funcionario.idFunc == 0 ? 'Cadastrar Novo Funcionário' : 'Alterar Funcionário'}</h1>

            <div className="form-group">
                <label>Nome:</label>
                <input type="text" defaultValue={funcionario.nomeFunc} className="form-control" ref={nomeFunc}/>
            </div>

            <div className="form-group">
                <label>Telefone:</label>
                <input type="tel" defaultValue={funcionario.telFunc} maxLength={14} className="form-control" ref={telFunc}/>
            </div>

            <div className="form-group">
                <label>Cargo:</label>
                <input type="text" defaultValue={funcionario.cargoFunc} className="form-control" ref={cargoFunc}/>
            </div>

            <div>
                <button onClick={funcionario.idFunc != 0 ? alterarFuncionario : cadastrarFuncionario} 
                className="btn btn-primary">{funcionario.idFunc != 0 ? 'Alterar' : 'Cadastrar'}</button>
                <a href="/funcionarios"><button style={{marginLeft: 50}} className="btn btn-danger">Cancelar</button></a>
            </div>
        </div>
    )
}