'use client'

import { useEffect, useRef, useState } from "react";
import httpClient from "../utils/httpClient";

export default function FuncionarioForm(props) {

    const nomeFuncionario = useRef('');
    const telFuncionario = useRef('');
    const cargoFuncionario = useRef(0);
    const [listaCargos, setListaCargos] = useState([]);

    const [funcionario, setFuncionario] = props.funcionario ? useState(props.funcionario)
    : useState({idFuncionario: 0, nomeFuncionario: '', telFuncionario: '', cargoFuncionario: 0});

    function carregarCargos() {

        httpClient.get('/cargos/listar')
        .then(r => {
            return r.json();
        })
        .then(r => {
            setListaCargos(r);
        });
    }

    function alterarFuncionario() {
        
        if (nomeFuncionario.current.value != '' && telFuncionario.current.value != '' && cargoFuncionario.current.value != '') {

            let status = 0;

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
                    window.location.href = '/funcionarios';
                }
            });
        }
        else {
            alert('Preencha todos os campos!');
        }
    }

    function cadastrarFuncionario() {

        if (nomeFuncionario.current.value != '' && telFuncionario.current.value != '' && cargoFuncionario.current.value > 0) {

            let status = 0;

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
                    window.location.href = '/funcionarios';
                }
            });
        }
        else {
            alert('Preencha todos os campos!');
        }
    }

    useEffect(() => {
        carregarCargos();
    }, []);

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
                <select style={{width: 250, textAlign: 'center'}} defaultValue={funcionario.cargoFuncionario} className="form-control" ref={cargoFuncionario}>
                    <option value={0}>Selecione</option>
                    {
                        listaCargos.map((cargo, index) => {
                            if (funcionario.cargoFuncionario == cargo.idCargo) {
                                return <option value={cargo.idCargo} selected={true}>{cargo.nomeCargo}</option>
                            }
                            else {
                                return <option value={cargo.idCargo}>{cargo.nomeCargo}</option>
                            }
                        })
                    }
                </select>
            </div>

            <div>
                <button onClick={funcionario.idFuncionario != 0 ? alterarFuncionario : cadastrarFuncionario} 
                className="btn btn-primary">{funcionario.idFuncionario != 0 ? 'Alterar' : 'Cadastrar'}</button>
                <a href="/funcionarios"><button style={{marginLeft: 50}} className="btn btn-danger">Cancelar</button></a>
            </div>
        </div>
    )
}