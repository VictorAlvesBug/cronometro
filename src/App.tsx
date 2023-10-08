import useFormatarDisplay from './hooks/formatadorDisplay';
import useCronometroMachine from './hooks/cronometroMachine';

function App() {
  const [contexto, enviar] = useCronometroMachine();

  let botaoEsquerdo = null;

  switch (contexto.estado) {
    case 'zerado':
      botaoEsquerdo = (
        <button className="botao-verde" onClick={() => enviar('RODAR')}>
          START
        </button>
      );
      break;

    case 'rodando':
      botaoEsquerdo = (
        <button className="botao-vermelho" onClick={() => enviar('PARAR')}>
          STOP
        </button>
      );
      break;

    case 'pausado':
      botaoEsquerdo = (
        <button className="botao-verde" onClick={() => enviar('RODAR')}>
          RESUME
        </button>
      );
      break;
  }

  return (
    <div className="w-full h-screen flex flex-col justify-center items-center bg-gray-950">
      <div className="rounded-full w-96 h-96 border-8 border-gray-100 flex flex-col justify-end items-center overflow-hidden">
        <div className="display text-gray-100 text-6xl pb-16">
          {useFormatarDisplay(contexto.segundos)}
        </div>
        <div className="botoes bg-gray-100 w-full h-1/3 flex flex-row justify-center gap-1 pt-1">
          {botaoEsquerdo}
          <button className="botao-cinza" onClick={() => enviar('ZERAR')}>
            CLEAR
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
