'use client'

import { useEffect, useState } from "react";
import httpClient from "../utils/httpClient";

export default function Cargos() {

    const [listaCargos, setListaCargos] = useState([]);

    function carregarCargos() {

        httpClient.get('/cargos/listar')
        .then(r => {
            return r.json();
        })
        .then(r => {
            setListaCargos(r);
        });
    }

    useEffect(() => {
        carregarCargos();
    }, [])

    return (
        <div>
            <h1>Cargos</h1>
    
            <div>
                {
                    listaCargos.length > 0 ?
                    listaCargos.map((cargo, index) => {
                        <div key={cargo.idCargo} style={{ marginBottom: 20 }}>
                            <table className="table table-hover">
                                <thead>
                                    <tr>
                                        <th>Nº</th>
                                        <th>Cargo</th>
                                        <th>Alterar</th>
                                        <th>Excluir</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    <tr key={index}>
                                        <td>{cargo.idCargo}</td>
                                        <td>{cargo.nomeCargo}</td>
                                        <td>{<a href={`/cargos/alterar/${cargo.idCargo}`}></a>}</td>
                                        <td>
                                            <button className="btn btn-danger" onClick={() => {
                                                if (confirm('Tem certeza que deseja excluir este cargo e todos os dados relacionados a ele?')) {
                                                    httpClient.delete(`/cargos/excluir/${cargo.idCargo}`)
                                                        .then(r => {
                                                            carregarCargos();
                                                        })
                                                        .catch(error => console.error('Erro ao excluir cargo:', error));
                                                }
                                            }}><i className="fas fa-trash"></i></button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    })
                    :
                    <div>Não há cargos cadastrados</div>
                }
            </div>
        </div>
    );
}