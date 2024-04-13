'use client'

export default function funcionarios() {

    return (
        <div>
            <h1>Funcionários</h1>
            <a href="/clientes/criar"><button className="btn btn-primary">Cadastrar</button></a>

            <div style={{marginTop: 30}} className="table-responsive">
                <table className="table table-hover">
                    
                </table>
            </div>
        </div>
    )
}