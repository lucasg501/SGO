'use client'
import { useRef, useState, useEffect } from "react"
import httpClient from "../utils/httpClient";
import Link from "next/link";

export default function obraForm(props){

    const idObra = useRef(0);
    const endereco = useRef('');
    const bairro = useRef('');
    const cidade = useRef('');
    const valorTotal = useRef(0);
    const dataInicio = useRef('');
    const dataTermino = useRef('');
    const contrato = useRef('');
    const planta = useRef('');
    const idCliente = useRef(0);

    const [obra, setObra] = props.obra ? useState(props.obra) : useState({idObra:0, endereco:'', bairro:'', cidade:'', valorTotal:0, dataInicio:'', dataTermino:'', contrato:'', planta:'', idCliente:0});

    let [listaClientes, setListaClientes] = useState([]);

    function cadastrarObra(){
        let status = 0;
        if(endereco.current.value != '' && bairro.current.value != '' && cidade.current.value != '' && dataInicio.current.value != '' && dataTermino.current.value != '' && idCliente.current.value > 0){
            httpClient.post('/obras/gravar', {
                endereco: endereco.current.value,
                bairro: bairro.current.value,
                cidade: cidade.current.value,
                valorTotal: valorTotal.current.value,
                dataInicio: dataInicio.current.value,
                dataTermino: dataTermino.current.value,
                contrato: contrato.current.value,
                planta: planta.current.value,
                idCliente: idCliente.current.value
            })
            .then(r=>{
                status = r.status;
                return r.json();
            })
            .then(r=>{
                alert(r.msg);
                if(status == 200){
                    endereco.current.value = '';
                    bairro.current.value = '';
                    cidade.current.value = '';
                    valorTotal.current.value = '';
                    dataInicio.current.value = '';
                    dataTermino.current.value = '';
                    contrato.current.value = '';
                    planta.current.value = '';
                    idCliente.current.value = 0;
                    window.location.href = '/obras';
                }
            })
        }else{
            alert('Preencha todos os campos!');
        }
    }

    function alterarObra(){
        let status = 0;
        if(endereco.current.value != '' && bairro.current.value != '' && cidade.current.value != '' && dataInicio.current.value != '' && dataTermino.current.value != '' && idCliente.current.value > 0){
            httpClient.put('/obras/alterar', {
                idObra: obra.idObra,
                endereco: endereco.current.value,
                bairro: bairro.current.value,
                cidade: cidade.current.value,
                valorTotal: valorTotal.current.value,
                dataInicio: dataInicio.current.value,
                dataTermino: dataTermino.current.value,
                contrato: contrato.current.value,
                planta: planta.current.value,
                idCliente: idCliente.current.value
            })
            .then(r=>{
                return r.json();
            })
            .then(r=>{
                alert(r.msg);
                if(status == 200){
                    endereco.current.value = '';
                    bairro.current.value = '';
                    cidade.current.value = '';
                    valorTotal.current.value = '';
                    dataInicio.current.value = '';
                    dataTermino.current.value = '';
                    contrato.current.value = '';
                    planta.current.value = '';
                    idCliente.current.value = 0;
                    window.location.href = '/obras';
                }
            })
        }else{
            alert('Preencha todos os campos!');
        }
    }


    function carregarCliente(){
        httpClient.get('/clientes/listar')
        .then(r=>{
            return r.json();
        })
        .then(r=>{
            setListaClientes(r);
        })
    }

    useEffect(() =>{
        carregarCliente();
    },[]);

    return(
        <div>
            <h1>{obra.idObra == 0 ? 'Cadastrar Obra' : 'Alterar Obra'}</h1>

            <div className="form-row">
                <div className="form-group col-md-6">
                    <label>Endereço</label>
                    <input type="text" className="form-control" ref={endereco} defaultValue={obra.endereco}/>
                </div>
                <div className="form-group col-md-6">
                    <label>Bairro</label>
                    <input type="text" className="form-control" ref={bairro} defaultValue={obra.bairro}/>
                </div>
            </div>

            <div className="form-row">
                <div className="form-group col-md-6">
                    <label>Cidade</label>
                    <input type="text" className="form-control" ref={cidade} defaultValue={obra.cidade}/>
                </div>
                <div className="form-group col-md-6">
                    <label>Valor Total</label>
                    <input type="text" className="form-control" ref={valorTotal} defaultValue={obra.valorTotal}/>
                </div>
            </div>

            <div className="form-group">
                <label>Data Inicio</label>
                <input type="date" className="form-control" ref={dataInicio} defaultValue={obra.dataInicio}/>
            </div>

            <div className="form-group">
                <label>Data Prevista de Término</label>
                <input type="date" className="form-control" ref={dataTermino} defaultValue={obra.dataTermino}/>
            </div>

            <div className="form-group">
                <label>Contrato</label>
                <input type="file" className="form-control" ref={contrato} defaultValue={obra.contrato}/>
            </div>

            <div className="form-group">
                <label>Planta</label>
                <input type="file" className="form-control" ref={planta} defaultValue={obra.planta}/>
            </div>

            <div className="form-group">
                <label>Cliente</label>
                <select className="form-control" ref={idCliente}>
                    {
                        listaClientes.map(function(value, index){
                            if(obra != null && value.idCli == obra.idCli){
                                return(
                                    <option key={index} value={value.idCli} selected>{value.nomeCli}</option>
                                )
                            }else{
                                return(
                                    <option key={index} value={value.idCli}>{value.nomeCli}</option>
                                )
                            }
                        })
                    }
                </select>
            </div>

            <div>
                <button className="btn btn-primary" onClick={obra.idObra == 0 ? cadastrarObra : alterarObra}>{obra.idObra == 0 ? 'Cadastrar' : 'Alterar'}</button>
                <Link style={{marginLeft: 15}} href={'/obras'}><button className="btn btn-secondary">Voltar</button></Link>
            </div>

        </div>
    )
}
