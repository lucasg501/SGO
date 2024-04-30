import { Nunito } from 'next/font/google'
import '../public/template/css/styles.css'
import '../public/template/css/fontawesome-free/css/all.min.css'
import '../public/template/css/styles.css'
import '../public/template/css/sb-admin-2.min.css'
import Link from 'next/link'
const nunito = Nunito({ subsets: ['latin'] })

export const metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
}

export default function RootLayout({ children }) {

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
        <script src="/template/js/jquery.min.js"></script>
        <script src="/template/js/bootstrap.bundle.min.js"></script>
        <script src="/template/js/sb-admin-2.min.js"></script>
        <script src='/template/js/scripts.js'></script>
        <script src='/template/js/tehem-map.js'></script>
    
        
      </body>
    
    </html>
  )
}
