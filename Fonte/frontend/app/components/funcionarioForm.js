'use client'

import { useRef, useState } from "react";
import httpClient from "../utils/httpClient";

export default function FuncionarioForm(props) {

    const nomeFuncionario = useRef('');
    const telFuncionario = useRef('');
    const cargoFuncionario = useRef('');

    const [funcionario, setFuncionario] = props.funcionario ? useState(props.funcionario)
    : useState({idFuncionario: 0, nomeFuncionario: '', telFuncionario: '', cargoFuncionario: ''});

    function alterarFuncionario() {
        
        if (nomeFuncionario.current.value != '' && telFuncionario.current.value != '' && cargoFuncionario.current.value != '') {

            httpClient.put('/funcionarios/alterar', {
                idFuncionario: funcionario.idFuncionario,
                nomeFuncionario: nomeFuncionario.current.value,
                telFuncionario: telFuncionario.current.value,
                cargoFuncionario: cargoFuncionario.current.value
            })
            .then(r => {
                status = r.status;
                return r.json();
            })
            .then(r => {
                alert(r.msg);
                
                if (status == 200) {
                    nomeFuncionario.current.value = '';
                    telFuncionario.current.value = '';
                    cargoFuncionario.current.value = '';
                }
            });
        }
        else {
            alert('Preencha todos os campos!');
        }
    }

    function cadastrarFuncionario() {

        if (nomeFuncionario.current.value != '' && telFuncionario.current.value != '' && cargoFuncionario.current.value != '') {

            httpClient.post('/funcionarios/gravar', {

                nomeFuncionario: nomeFuncionario.current.value,
                telFuncionario: telFuncionario.current.value,
                cargoFuncionario: cargoFuncionario.current.value
            })
            .then(r => {
                status = r.status;
                return r.json();
            })
            .then(r => {
                alert(r.msg);
                
                if (status == 200) {
                    nomeFuncionario.current.value = '';
                    telFuncionario.current.value = '';
                    cargoFuncionario.current.value = '';
                }
            });
        }
        else {
            alert('Preencha todos os campos!');
        }
    }

    return (
        <div>
            <h1>{funcionario.idFuncionario == 0 ? 'Cadastrar Novo Funcionário' : 'Alterar Funcionário'}</h1>

            <div className="form-group">
                <label>Nome:</label>
                <input type="text" defaultValue={funcionario.nomeFuncionario} className="form-control" ref={nomeFuncionario}/>
            </div>

            <div className="form-group">
                <label>Telefone:</label>
                <input type="tel" defaultValue={funcionario.telFuncionario} maxLength={14} className="form-control" ref={telFuncionario}/>
            </div>

            <div className="form-group">
                <label>Cargo:</label>
                <input type="text" defaultValue={funcionario.cargoFuncionario} className="form-control" ref={cargoFuncionario}/>
            </div>

            <div>
                <button onClick={funcionario.idFuncionario != 0 ? alterarFuncionario : cadastrarFuncionario} 
                className="btn btn-primary">{funcionario.idFuncionario != 0 ? 'Alterar' : 'Cadastrar'}</button>
                <a href="/funcionarios"><button style={{marginLeft: 50}} className="btn btn-danger">Cancelar</button></a>
            </div>
        </div>
    )
}