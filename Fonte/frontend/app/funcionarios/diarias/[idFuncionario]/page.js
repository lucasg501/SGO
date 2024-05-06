'use client'
import Modal from 'react-modal';
import httpClient from "@/app/utils/httpClient";
import { useEffect, useRef, useState } from "react";
import 'react-calendar/dist/Calendar.css';
import { Calendar, DateObject } from "react-multi-date-picker";
import gregorian_pt_br from "react-date-object/locales/gregorian_pt_br";

export default function GerenciarDiarias({ params: { idFuncionario } }) {

    const [funcionario, setFuncionario] = useState(null);
    const [cargo, setCargo] = useState(null);
    const [dias, setDias] = useState([]);
    const [totalDiarias, setTotalDiarias] = useState("0,00");
    const [valorDiarias, setValorDiarias] = useState(0);
    const [diasConvertidos, setDiasConvertidos] = useState([]);

    const [modalIsOpen, setModalIsOpen] = useState(false);
    function openModal() {
        setModalIsOpen(true);
    }
    function closeModal() {
        setModalIsOpen(false);
    }

    const formatarData = (data) => {
        const dataObj = new Date(data);
        const ano = dataObj.getUTCFullYear();
        const mes = ('0' + (dataObj.getUTCMonth() + 1)).slice(-2);
        const dia = ('0' + dataObj.getUTCDate()).slice(-2);
        return `${ano}-${mes}-${dia}`;
    };

    function carregarFuncionario() {

        httpClient.get(`/funcionarios/obter/${idFuncionario}`)
            .then(r => {
                return r.json();
            })
            .then(r => {
                setFuncionario(r);
                carregarCargo(r.cargoFuncionario);
            });
    }

    function carregarDiarias() {

        httpClient.get(`/diarias/obterDiariasFuncionario/${idFuncionario}`)
            .then(r => {
                return r.json();
            })
            .then(r => {

                if (r.length > 0) {

                    let lista = [];

                    for (let i = 0; i < r.length; i++) {

                        if (!r[i].dataPgto) {
                            lista.push(formatarData(r[i].dia));
                        }
                    }

                    setDias(lista);
                    setValorDiarias(r[0].valorDiaria);
                    setTotalDiarias(r[0].valorDiaria * lista.length);
                    converterDias(lista);
                }
            });
    }

    function carregarCargo(idCargo) {

        httpClient.get(`/cargos/obter/${idCargo}`)
            .then(r => {
                return r.json();
            })
            .then(r => {
                setCargo(r.cargoModel);
            });
    }

    function converterDias(diasFormatados) {

        let lista = [];

        diasFormatados.map((dia) => {
            let data = new DateObject({ date: dia, format: "YYYY-MM-DD" });
            lista.push(data);
        })

        setDiasConvertidos(lista);
    }

    function mudarDias(diasSelecionados) {

        let diasTransformados = [];

        diasSelecionados.map((dia, index) => {
            diasTransformados.push(new Date(dia.year, dia.month - 1, dia.day));
            diasTransformados[index] = formatarData(diasTransformados[index]);
        })

        let valorTotal = parseFloat(valorDiarias * diasSelecionados.length).toFixed(2).replace('.', ',');

        setTotalDiarias(valorTotal);
        setDias(diasTransformados);
    }

    function excluirDiariasDoFuncionario() {

        httpClient.delete(`/diarias/excluirDiariasFuncionario/${idFuncionario}`)
            .then(r => {
                return r.json();
            })
            .then(r => {
                console.log(r.msg);
            });
    }

    function gravarDiarias() {

        if (valorDiarias > 0) {

            if (diasConvertidos.length > 0) {
                excluirDiariasDoFuncionario();
            }

            let status = 0;

            let diariasArray = [];

            for (let i = 0; i < dias.length; i++) {

                const diaria = {
                    dia: dias[i],
                    valorDiaria: valorDiarias,
                    dataPgto: null,
                    idFunc: idFuncionario
                }

                diariasArray.push(diaria);
            }

            httpClient.post("/diarias/gravar", diariasArray)
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
            alert("Informe o valor das diárias!");
        }
    }

    useEffect(() => {
        carregarFuncionario();
        carregarDiarias();
    }, [])

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <h1>Gerenciar Diárias do Funcionário</h1>
                <button onClick={openModal} className="btn btn-info" style={{ marginLeft: 10 }}>Ajuda</button>
            </div>

            {
                funcionario && cargo ?
                    <div>
                        <div className="card" style={{ padding: 20 }}>
                            <h3><b>Nome:</b> {funcionario.nomeFuncionario}</h3>
                            <div><b>Telefone:</b> {funcionario.telFuncionario}</div>
                            <div><b>Cargo:</b> {cargo.nomeCargo}</div>
                        </div>

                        <div style={{ margin: 20 }}>
                            <b>ATENÇÃO: Aqui apenas aparecem dias que não foram pagos. Caso queira visualizar todos os dias,
                                consulte o relatório de diárias.
                            </b>
                        </div>

                        <div className="input-group" style={{ margin: 20, display: "flex", alignItems: "center" }}>
                            <label><b>Valor da diária:</b> R$ </label>
                            <div style={{ marginLeft: 10, width: 80 }}>
                                <input type="number" className="form-control"
                                    defaultValue={valorDiarias}
                                    onChange={(e) => {
                                        setValorDiarias(e.target.value);
                                        setTotalDiarias(parseFloat(e.target.value * dias.length).toFixed(2).replace('.', ','));
                                    }} />
                            </div>
                        </div>

                        <div style={{ marginLeft: 20 }}><b>Total: R$ {totalDiarias}</b></div>

                        <div style={{ margin: 20 }}>
                            <Calendar locale={gregorian_pt_br} multiple
                                value={diasConvertidos}
                                onChange={(selecao) => mudarDias(selecao)} />
                        </div>

                        <div style={{ margin: 20, marginTop: 40 }}>
                            <button className="btn btn-primary" onClick={gravarDiarias}>Gravar</button>
                            <a href="/funcionarios" style={{ marginLeft: 40 }}><button className="btn btn-secondary">Voltar</button></a>
                        </div>
                    </div>
                    :
                    <div>Carregando funcionário...</div>
            }
            <Modal style={{ content: { width: '500px', margin: 'auto', height: '600px', overflow: 'hidden' } }} isOpen={modalIsOpen} onRequestClose={closeModal}>
                <div className="input-group" style={{ margin: '20px', display: 'flex', alignItems: 'center' }}>
                    <label><b>Valor da diária:</b> R$ </label>
                    <div style={{ marginLeft: '10px', width: 'auto' }}>
                        <input type="number" placeholder='Digite o valor da diária' className="form-control" disabled />
                    </div>
                </div>

                <div style={{ marginLeft: '20px' }}><b>Total: R$ {totalDiarias}</b><p>O total é atualizado conforme a quantidade de dias é selecionada</p></div>

                <div style={{ margin: '20px' }}>
                    <Calendar locale={gregorian_pt_br} multiple disabled selectable={false} />
                    <p>Selecione os dias que o funcionário trabalhou</p>
                </div>

                <button className="btn btn-danger" onClick={closeModal}>Fechar</button>
            </Modal>


        </div>
    );
}