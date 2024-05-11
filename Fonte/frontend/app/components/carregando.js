export default function Carregando() {

    return (
        <div style={{margin: 20, display: 'inline-flex', alignItems: 'center'}}>
            <div className="spinner-border text-primary" role="status">
                <span className="sr-only">Loading...</span>
            </div>
            <div style={{marginLeft: 10}}>Carregando...</div>
        </div>
    );
}