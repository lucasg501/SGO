'use client'
import { useState } from 'react';
import { Nunito } from 'next/font/google';
import Link from 'next/link';
import Modal from 'react-modal';
import '../public/template/css/styles.css'
import '../public/template/css/fontawesome-free/css/all.min.css'
import '../public/template/css/styles.css'
import '../public/template/css/sb-admin-2.min.css'

// Estilo para o modal
const modalStyle = {
    overlay: {
        backgroundColor: 'rgba(0, 0, 0, 0.5)'
    },
    content: {
        width: '50%',
        height: '50%',
        margin: 'auto',
        border: 'none',
        background: '#fff',
        borderRadius: '8px',
        padding: '20px'
    }
};

const nunito = Nunito({ subsets: ['latin'] });

export default function RootLayout({ children }) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <html lang="en">
            <body className={nunito.className}>
                <div>
                    <div id="wrapper">
                        <ul className="navbar-nav bg-gradient-primary sidebar sidebar-dark accordion" id="accordionSidebar">
                            <a className="sidebar-brand d-flex align-items-center justify-content-center" href="index.html">
                                <div className="sidebar-brand-icon rotate-n-15">
                                    <i className="fas fa-solid fa-trowel-bricks"></i>
                                </div>
                                <div className="sidebar-brand-text mx-3">
                                    <sup>Painel Administrativo</sup>
                                </div>
                            </a>

                            <hr className="sidebar-divider my-0" />

                            <li className="nav-item active">
                                <Link className="nav-link" href="/">
                                    <i className="fas fa-home"></i>
                                    <span>Início</span>
                                </Link>
                            </li>

                            <hr className="sidebar-divider" />

                            <div className="sidebar-heading">
                                Menu
                            </div>

                            <li className="nav-item">
                                <Link className="nav-link" href="/clientes">
                                    <span>Clientes</span>
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" href="/funcionarios">
                                    <span>Funcionários</span>
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" href="/parceiros">
                                    <span>Parceiros</span>
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" href="/obras">
                                    <span>Obras</span>
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" href="/obras/servicos">
                                    <span>Serviços</span>
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" href="/etapas">
                                    <span>Etapas</span>
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" href="/recebimentos">
                                    <span>Recebimentos</span>
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" href="/funcionarios/diarias">
                                    <span>Diarias</span>
                                </Link>
                            </li>

                        </ul>

                        <div id="content-wrapper" className="d-flex flex-column">

                            <div id="content">
                                <nav className="navbar navbar-expand navbar-light bg-white topbar mb-4 static-top shadow">
                                    <button style={{justifyContent:'flex-end'}} className="btn btn-secondary" onClick={() => setIsModalOpen(true)}>
                                        <span>Ajuda</span>
                                    </button>
                                </nav>
                                <div className="container-fluid">
                                    <div style={{ minHeight: 800 }}>
                                        {children}
                                    </div>
                                </div>
                            </div>

                            <footer className="sticky-footer bg-white">
                                <div className="container my-auto">
                                    <div className="copyright text-center my-auto">
                                        <span>Copyright &copy;SGO</span>
                                    </div>
                                </div>
                            </footer>
                        </div>
                    </div>
                </div>

                <Modal isOpen={isModalOpen} style={modalStyle} onRequestClose={() => setIsModalOpen(false)}>
                    <div>
                        <button disabled className='btn btn-primary'><i className='fas fa-pen'></i></button>
                        <p>Clique nesse ícone quando quiser alterar dados</p>
                    </div>
                    <div>
                        <button disabled className='btn btn-danger'><i className='fas fa-trash'></i></button>
                        <p>Clique nesse ícone quando quiser apagar dados</p>
                    </div>
                    <div>
                        <button disabled className='btn btn-success'><i className='fas fa-dollar-sign'></i></button>
                        <p>Clique nesse ícone quando quiser gerenciar diárias *Localizado somente na tela de listagem de funcionários*</p>
                    </div>
                    <div>
                        <button disabled className='btn btn-success'><i className='fas fa-users'></i></button>
                        <p>Clique nesse ícone quando quiser alocar parceiros *Localizado somente na tela de listagem de obras*</p>
                    </div>
                    <div>
                        <button disabled className='btn btn-success'><i className='fas fa-check'></i></button>
                        <p>Clique nesse ícone quando quiser marcar o fim de uma etapa *Localizado somente na tela de listagem de etapas*</p>
                    </div>
                    <div>
                        <button disabled className='btn btn-danger'><i className='fas fa-ban'></i></button>
                        <p>Clique nesse ícone quando quiser cancelar um recebimento ou pagamento *Localizado na tela de listagem de recebimentos e diárias*</p>
                    </div>
                    <button className='btn btn-danger' style={{ marginTop: 10 }} onClick={() => setIsModalOpen(false)}>Fechar</button>
                </Modal>
            </body>
        </html>
    );
}
