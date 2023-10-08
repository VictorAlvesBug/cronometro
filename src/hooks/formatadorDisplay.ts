const extrairTrecho = (numero: number, base: number) => {
    const largura = String(base - 1).length
    const trechoMilis = numero % base;
    const valorRestante = (numero - trechoMilis) / base;
    const strTrecho = String(trechoMilis).padStart(largura, '0');
    return [strTrecho, valorRestante] as [string, number];
  };

const useFormatarDisplay = (segundos: number) => {
    let milis = segundos*1000;
    const parteFracionariaDescartar = milis % 1;
    const milisRestantes = milis - parteFracionariaDescartar;

    const [strMilis, segundosRestantes] = extrairTrecho(milisRestantes, 1000);
    const [strSegundos, minutosRestantes] = extrairTrecho(segundosRestantes, 60);
    const [strMinutos, horasRestantes] = extrairTrecho(minutosRestantes, 60);
    const [strHoras] = extrairTrecho(horasRestantes, 24);

    return `${strHoras}:${strMinutos}:${strSegundos}:${strMilis}`;
  }


export default useFormatarDisplay;