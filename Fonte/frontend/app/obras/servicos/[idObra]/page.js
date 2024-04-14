import ServicoForm from '@/app/components/servicoForm';
export default function servicos({params:{idObra}}){
    return(
        <div>
            <ServicoForm params={{idObra}}></ServicoForm>
        </div>
    )
}