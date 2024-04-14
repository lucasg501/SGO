'use client'
import httpClient from "@/app/utils/httpClient";
import { useRef, useState } from "react";

export default function ClienteForm(props){
    const idCli = useRef('');
    const nomeCli = useRef('');
    const telCli = useRef('');
    const emailCli = useRef('');
    const rgCli = useRef('');
    const cpfCli = useRef('');
    const enderecoCli = useRef('');

    const [cliente, setCliente] = props.cliente ? useState(props.cliente) : useState({idCli:0, nomeCli:'', telCli:'', emailCli:'', rgCli:'', cpfCli:'', enderecoCli:''});

    function cadastrarCliente(){
        let status = 0;
        if(nomeCli.current.value != '' && telCli.current.value != '' && emailCli.current.value != '' && rgCli.current.value != '' && cpfCli.current.value != '' && enderecoCli.current.value != ''){
            httpClient.post('/clientes/gravar',{
                nomeCli: nomeCli.current.value,
                telCli: telCli.current.value,
                emailCli: emailCli.current.value,
                rgCli: rgCli.current.value,
                cpfCli: cpfCli.current.value,
                enderecoCli: enderecoCli.current.value
            })
            .then(r=>{
                status = r.status;
                return r.json();
            })
            .then(r=>{
                alert(r.msg);
                if(status == 200){
                    nomeCli.current.value = '';
                    telCli.current.value = '';
                    emailCli.current.value = '';
                    rgCli.current.value = '';
                    cpfCli.current.value = '';
                    enderecoCli.current.value = '';
                }
            })
        }else{
            alert('Preencha todos os campos!');
        }
    }

    function alterarCliente(){
        let status = 0;
        if(nomeCli.current.value != '' && telCli.current.value != '' && emailCli.current.value != '' && rgCli.current.value != '' && cpfCli.current.value != '' && enderecoCli.current.value != ''){
            httpClient.put('/clientes/alterar',{
                idCli: cliente.idCli,
                nomeCli: nomeCli.current.value,
                telCli: telCli.current.value,
                emailCli: emailCli.current.value,
                rgCli: rgCli.current.value,
                cpfCli: cpfCli.current.value,
                enderecoCli: enderecoCli.current.value
            })
            .then(r=>{
                status = r.status;
                return r.json();
            })
            .then(r=>{
                alert(r.msg);
                if(status == 200){
                    window.location.href = '/clientes';
                }
            })
        }
    }



    return(
        <div>
            <h1>{cliente.idCli == 0 ? 'Cadastrar Novo Cliente' : 'Alterar Cliente'}</h1>
            <div className="form-group">
                <label>Nome:</label>
                <input type="text" defaultValue={cliente.nomeCli} className="form-control" ref={nomeCli}/>
            </div>

            <div className="form-group">
                <label>Telefone:</label>
                <input type="text" defaultValue={cliente.telCli} className="form-control" ref={telCli}/>
            </div>

            <div className="form-group">
                <label>E-mail:</label>
                <input type="email" defaultValue={cliente.emailCli} className="form-control" ref={emailCli}/>
            </div>

            <div className="form-group">
                <label>RG:</label>
                <input type="text" defaultValue={cliente.rgCli} className="form-control" ref={rgCli}/>
            </div>

            <div className="form-group">
                <label>CPF:</label>
                <input type="text" defaultValue={cliente.cpfCli} className="form-control" ref={cpfCli}/>
            </div>

            <div className="form-group">
                <label>Endereço:</label>
                <input type="text" defaultValue={cliente.enderecoCli} className="form-control" ref={enderecoCli}/>
            </div>

            <div>
                <button onClick={cliente.idCli != 0 ? alterarCliente : cadastrarCliente} className="btn btn-primary">{cliente.idCli != 0 ? 'Alterar' : 'Cadastrar'}</button>
                <a href="/clientes"><button style={{marginLeft: 50}} className="btn btn-danger">Cancelar</button></a>
            </div>
        </div>
    )
}