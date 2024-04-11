'use client'
import { useContext, useEffect, useState } from "react"
import Link from "next/link";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function AdminLayout({children}){

    const [isClient, setIsClient] = useState(false);

    function logout() {
        let status = 0;
        httpClient.get('/login/logout')
        .then(r=> {
            status = r.status;
        })
        .then(r=> {
            if(status == 200){
                setUser(null);
                localStorage.removeItem("usuarioLogado")
                window.location.href = '/login';
            }
        })
    }

    return (
        <div>
            <div id="wrapper">
                
                <ul className="navbar-nav bg-gradient-primary sidebar sidebar-dark accordion" id="accordionSidebar">

                    <a className="sidebar-brand d-flex align-items-center justify-content-center" href="index.html">
                        <div className="sidebar-brand-icon rotate-n-15">
                          <i class="fas fa-solid fa-trowel-bricks"></i>
                        </div>
                        <div className="sidebar-brand-text mx-3">
                            <sup>Painel Administrativo</sup>
                        </div>
                    </a>

                    <hr className="sidebar-divider my-0" />

                    <li className="nav-item active">
                        <Link className="nav-link" href="/">
                            <i className="fas fa-home"></i>
                            <span>Início</span></Link>
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
                        <button className="btn btn-outline" onClick={logout} >Sair</button>
                    </li>

                </ul>

                <div id="content-wrapper" className="d-flex flex-column">

                    <div id="content">

                        <nav className="navbar navbar-expand navbar-light bg-white topbar mb-4 static-top shadow">

                            <button id="sidebarToggleTop" className="btn btn-link d-md-none rounded-circle mr-3">
                                <i className="fa fa-bars"></i>
                            </button>

                        </nav>
                        

                        
                        <div className="container-fluid">

                        <div style={{minHeight: 800}}>
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



            <a className="scroll-to-top rounded" href="#page-top">
                <i className="fas fa-angle-up"></i>
            </a>


            <div className="modal fade" id="logoutModal" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel"
                aria-hidden="true">
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">Ready to Leave?</h5>
                            <button className="close" type="button" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">×</span>
                            </button>
                        </div>
                        <div className="modal-body">Select "Logout" below if you are ready to end your current session.</div>
                        <div className="modal-footer">
                            <button className="btn btn-secondary" type="button" data-dismiss="modal">Cancel</button>
                            <a className="btn btn-primary" href="login.html">Logout</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    
    )
}