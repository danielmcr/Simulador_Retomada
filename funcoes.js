

function obterDataAtualFormatada() {
    var dataAtual = new Date();
    var dia = String(dataAtual.getDate()).padStart(2, '0');
    var mes = String(dataAtual.getMonth() + 1).padStart(2, '0'); // Janeiro é 0!
    var ano = dataAtual.getFullYear();
    return dia + '/' + mes + '/' + ano;
};

function formatarComoMoeda(valor) {
    return valor.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    });
}

function parseNumberFromString(entrada) {
    // Remove os pontos dos milhares
    var stringWithoutThousandsSeparator = entrada.replace(/\./g, '');
    // Substitui a vírgula do decimal por um ponto
    var standardDecimalString = stringWithoutThousandsSeparator.replace(',', '.');
    // Converte a string formatada para um número
    var number = parseFloat(standardDecimalString);

    if (isNaN(number)) {
        return 0; // Retorna 0 se a conversão resultar em NaN
    }

    return number;
}

function atualizaValorSNI() {
    var ValorHab = parseNumberFromString($("#ValorHab").val());
    var PercSPG = parseNumberFromString($("#PercSPG").val());
    $("#ValorSPG").text(formatarComoMoeda(ValorHab * PercSPG / 100));
    var ValorSPG = parseFloat(ValorHab * PercSPG / 100);

    var PercFC = parseNumberFromString($("#PercFC").val());
    $("#ValorFC").text(formatarComoMoeda(ValorHab * PercFC / 100));
    var ValorFC = parseFloat(ValorHab * PercFC / 100);

    var PercEB = parseNumberFromString($("#PercEB").val());
    $("#ValorEB").text(formatarComoMoeda(ValorHab * PercEB / 100));
    var ValorEB = parseFloat(ValorHab * PercEB / 100);

    var PercIE = parseNumberFromString($("#PercIE").val());
    $("#ValorIE").text(formatarComoMoeda(ValorHab * PercIE / 100));
    var ValorIE = parseFloat(ValorHab * PercIE / 100);

    var PercCpl = parseNumberFromString($("#PercCpl").val());
    $("#ValorCpl").text(formatarComoMoeda(ValorHab * PercCpl / 100));
    var ValorCpl = parseFloat(ValorHab * PercCpl / 100);

    var somaPercSNI = PercSPG + PercFC + PercEB + PercIE + PercCpl

    return [ValorSPG, ValorFC, ValorEB, ValorIE, ValorCpl, somaPercSNI]

}

async function calcularInvolucao() {

    try {
        let dataInicial = document.getElementById("DtPriRAE").value;
        let dataFinal = document.getElementById("DtUltRAE").value;
        let AnoSimulacao = document.getElementById("cboAnoFinal").value;
        let MesSimulacao = document.getElementById("cboMesFinal").value;
        let dataSimulacao = "01/" + MesSimulacao + "/" + AnoSimulacao

        console.log(dataSimulacao)

        //let totalMesesAtual = await calcularMesesEntreDatas(dataInicial, dataFinal);
        let [totalMeses, totalMesesAtual] = await calcularMesesEntreDatas(dataInicial, dataFinal, dataSimulacao);

        //console.log(totalMeses);
        //console.log(totalMesesAtual);

        document.getElementById("QtdMeses").textContent = totalMeses;

        let involucaoCalculada = await formulaInvolucao(totalMeses, totalMesesAtual);


        let RaeInvolucao = document.getElementById("cboSN").options[document.getElementById("cboSN").selectedIndex].value;

        if (RaeInvolucao === "SIM") {

            involucaoCalculada = 0
            document.getElementById("Involucao").textContent = involucaoCalculada.toFixed(2);
            //console.log(involucaoCalculada);
        }

        else {
            document.getElementById("Involucao").textContent = involucaoCalculada.toFixed(2);
            //console.log(involucaoCalculada);
        }

    } catch (error) {
        console.error('Erro ao executar calcularMesesEntreDatas:', error);
    }
}

function salvaValoresFormulario() {

    let ValorHab = document.getElementById("ValorHab").value;
    ValorHab = parseNumberFromString(ValorHab);
    let ValorEqui = document.getElementById("ValorEqui").value;
    ValorEqui = parseNumberFromString(ValorEqui);
    let ValorInfr = document.getElementById("ValorInfr").value;
    ValorInfr = parseNumberFromString(ValorInfr);
    let ValorOD = document.getElementById("ValorOD").value;
    ValorOD = parseNumberFromString(ValorOD);
    let ValorInfrNI = document.getElementById("ValorInfrNI").value;
    ValorInfrNI = parseNumberFromString(ValorInfrNI);
    let ValorSN = document.getElementById("ValorSN").value;
    ValorSN = parseNumberFromString(ValorSN);

    let PercHab = document.getElementById("PercHab").value;
    PercHab = parseNumberFromString(PercHab);
    let PercEqui = document.getElementById("PercEqui").value;
    PercEqui = parseNumberFromString(PercEqui);
    let PercInfr = document.getElementById("PercInfr").value;
    PercInfr = parseNumberFromString(PercInfr);
    let PercInfrNI = document.getElementById("PercInfrNI").value;
    PercInfrNI = parseNumberFromString(PercInfrNI);
    let PercSN = document.getElementById("PercSN").value;
    PercSN = parseNumberFromString(PercSN);

    let dataInicial = document.getElementById("DtPriRAE").value;
    let dataFinal = document.getElementById("DtUltRAE").value;
    let AnoSimulacao = document.getElementById("cboAnoFinal").value;
    let MesSimulacao = document.getElementById("cboMesFinal").value;
    let dataSimulacao = "1/" + MesSimulacao + "/" + AnoSimulacao
    let RaeInvolucao = document.getElementById("cboSN").options[document.getElementById("cboSN").selectedIndex].value;

    let AEq = document.getElementById("AEq").value;
    AEq = parseNumberFromString(AEq);

    let BDI = parseNumberFromString(document.getElementById("BDI").value);

    return [ValorHab, ValorEqui, ValorOD, ValorInfr, ValorInfrNI, ValorSN, PercHab, PercEqui, PercInfr, PercInfrNI, PercSN, dataInicial, dataFinal, MesSimulacao, AnoSimulacao, RaeInvolucao, AEq, BDI]


}

function calcularMesesEntreDatas(dataInicial, dataFinal, dataSimulacao) {
    // Converte as strings de data "dd/mm/aaaa" para objetos Date
    var dataInicialStr = dataInicial;
    var dataFinalStr = dataFinal;
    var dataAtual = dataSimulacao;

    //console.log(dataInicialStr)

    var partesDataInicial = dataInicialStr.split('/');
    var partesDataFinal = dataFinalStr.split('/');
    var partesDataAtual = dataAtual.split('/');

    // Lembre-se de subtrair 1 do mês porque os meses em JavaScript começam em 0 (janeiro)
    var inicio = new Date(partesDataInicial[2], partesDataInicial[1] - 1, partesDataInicial[0]);
    var fim = new Date(partesDataFinal[2], partesDataFinal[1] - 1, partesDataFinal[0]);
    var Atual = new Date(partesDataAtual[2], partesDataAtual[1] - 1, partesDataAtual[0]);

    // Calcula a diferença em anos e meses
    var anosDeDiferenca = fim.getFullYear() - inicio.getFullYear();
    var mesesDeDiferenca = fim.getMonth() - inicio.getMonth();

    var anosDeDiferencaAtual = Atual.getFullYear() - fim.getFullYear();
    var mesesDeDiferencaAtual = Atual.getMonth() - fim.getMonth();

    // Combina a diferença de anos e meses para obter o total de meses
    var totalMeses = anosDeDiferenca * 12 + mesesDeDiferenca;

    var totalMesesAtual = anosDeDiferencaAtual * 12 + mesesDeDiferencaAtual;

    // Ajusta a diferença de meses se a data final do mês for anterior à data inicial do mês
    if (fim.getDate() < inicio.getDate()) {
        totalMeses--;
    }

    if (Atual.getDate() < fim.getDate()) {
        totalMesesAtual--;
    }

    //console.log(totalMeses);
    //console.log(totalMesesAtual);
    return [totalMeses, totalMesesAtual];

}



async function atualizaValores() {


    try {
        const [varSinapi, valorFinal] = await buscaSinapi();
        let [ValorHab, ValorEqui, ValorOD, ValorInfr, ValorInfrNI, ValorSN, PercHab, PercEqui, PercInfr, PercInfrNI, PercSN, dataInicial, dataFinal, MesSimulacao, AnoSimulacao, RaeInvolucao, AEq, BDI] = await salvaValoresFormulario();
        let dataSimulacao = "1/" + MesSimulacao + "/" + AnoSimulacao
        console.log(dataSimulacao)
        let [totalMeses, totalMesesAtual] = await calcularMesesEntreDatas(dataInicial, dataFinal, dataSimulacao);
        let involucaoCalculada = await formulaInvolucao(totalMeses, totalMesesAtual);

        const [ValorSPG, ValorFC, ValorEB, ValorIE, ValorCpl, somaPercSNI] = await atualizaValorSNI();
        const TotalSNI = ValorSPG + ValorFC + ValorEB + ValorIE + ValorCpl
        involucaoCalculada = Math.round(involucaoCalculada * 100) / 100;

        if (RaeInvolucao === "SIM") {

            involucaoCalculada = 0
            document.getElementById("Involucao").textContent = involucaoCalculada;
            //console.log(involucaoCalculada);
        }

        else {
            document.getElementById("Involucao").textContent = involucaoCalculada;
            // console.log(involucaoCalculada);
        }


        if (varSinapi !== null) {


            let aeHab = (100 - PercHab) + parseFloat(involucaoCalculada);
            if (ValorHab === 0) { aeHab = 0 };
            if (aeHab > 100) { aeHab = 100 };
            let aeEqui = (100 - PercEqui) + parseFloat(involucaoCalculada);
            if (ValorEqui === 0) { aeEqui = 0 };
            if (aeEqui > 100) { aeEqui = 100 };
            let aeInfr = (100 - PercInfr) + parseFloat(involucaoCalculada);
            if (ValorInfr === 0) { aeInfr = 0 };
            if (aeInfr > 100) { aeInfr = 100 };
            let aeSN = (100 - PercSN);
            if (ValorSN === 0) { aeSN = 0 };
            let aeInfrNI = (100 - PercInfrNI) + parseFloat(involucaoCalculada);
            if (ValorInfrNI === 0) { aeInfrNI = 0 };
            if (aeInfrNI > 100) { aeInfrNI = 100 };

            //Metodologia 1

            document.getElementById("%ExecHab1").textContent = aeHab.toFixed(2);
            document.getElementById("%ExecEqui1").textContent = aeEqui.toFixed(2);
            document.getElementById("%ExecInfr1").textContent = aeInfr.toFixed(2);
            document.getElementById("PerServNovosTab1").textContent = aeSN.toFixed(2);
            document.getElementById("PerInfrNITab1").textContent = aeInfrNI.toFixed(2);

            let ValorFinalHab1 = (varSinapi / 100 + 1) * (aeHab / 100) * ValorHab;
            //console.log(ValorFinalHab);
            document.getElementById("ValorCalcHab1").textContent = formatarComoMoeda(ValorFinalHab1);
            let ValorFinalEqui1 = (varSinapi / 100 + 1) * (aeEqui / 100) * ValorEqui;
            document.getElementById("ValorCalcEqui1").textContent = formatarComoMoeda(ValorFinalEqui1);
            let ValorFinalInfr1 = (varSinapi / 100 + 1) * (aeInfr / 100) * ValorInfr;
            document.getElementById("ValorCalcInfr1").textContent = formatarComoMoeda(ValorFinalInfr1);
            let ValorFinalSN1 = (aeSN / 100) * ValorSN;
            document.getElementById("ValorCalcSN1").textContent = formatarComoMoeda(ValorFinalSN1);
            let ValorFinalInfrNI1 = (varSinapi / 100 + 1) * (aeInfrNI / 100) * ValorInfrNI;
            document.getElementById("ValorCalcInfrNI1").textContent = formatarComoMoeda(ValorFinalInfrNI1);

            let ValorFinalTotal1 = ValorFinalHab1 + ValorFinalEqui1 + ValorFinalInfr1 + ValorFinalSN1 + ValorFinalInfrNI1

            document.getElementById("ValorCalcTotal1").textContent = formatarComoMoeda(ValorFinalTotal1)
            document.getElementById("%HabFinal1").textContent = ((ValorFinalHab1 / ValorFinalTotal1) * 100.).toFixed(2);
            document.getElementById("%EquiFinal1").textContent = ((ValorFinalEqui1 / ValorFinalTotal1) * 100.).toFixed(2);
            document.getElementById("%InfrFinal1").textContent = ((ValorFinalInfr1 / ValorFinalTotal1) * 100.).toFixed(2);
            document.getElementById("%InfrNIFinal1").textContent = ((ValorFinalInfrNI1 / ValorFinalTotal1) * 100.).toFixed(2);
            document.getElementById("%SNFinal1").textContent = ((ValorFinalSN1 / ValorFinalTotal1) * 100).toFixed(2);

            let ValorBDI1 = ValorFinalTotal1 * (BDI / 100)
            document.getElementById("ValorBDI1").textContent = formatarComoMoeda(ValorBDI1);

            let ValorFinalTotalBDI1 = ValorFinalTotal1 * (1 + BDI / 100)
            document.getElementById("ValorCalcTotalBDI1").textContent = formatarComoMoeda(ValorFinalTotalBDI1);
            document.getElementById("ValorCalcTotalResumo1").textContent = formatarComoMoeda(ValorFinalTotalBDI1);

            //Metodologia 2

            document.getElementById("%ExecHab2").textContent = aeHab.toFixed(2);
            document.getElementById("%ExecEqui2").textContent = aeEqui.toFixed(2);
            document.getElementById("%ExecInfr2").textContent = aeInfr.toFixed(2);
            document.getElementById("PerServNovosTab2").textContent = aeSN.toFixed(2);
            document.getElementById("PerInfrNITab2").textContent = aeInfrNI.toFixed(2);

            //console.log(somaPercSNI);

            let ValorFinalHab2 = (aeHab / 100) * (parseFloat(valorFinal) * AEq * (100 / (100 - somaPercSNI)));
            //console.log(ValorFinalHab2);
            document.getElementById("ValorCalcHab2").textContent = formatarComoMoeda(ValorFinalHab2);
            let ValorFinalEqui2 = (aeHab / 100) * (parseFloat(valorFinal) * AEq * (100 / (100 - somaPercSNI))) * ValorEqui / ValorHab;
            document.getElementById("ValorCalcEqui2").textContent = formatarComoMoeda(ValorFinalEqui2);
            let ValorFinalInfr2 = (aeHab / 100) * (parseFloat(valorFinal) * AEq * (100 / (100 - somaPercSNI))) * ValorInfr / ValorHab;
            document.getElementById("ValorCalcInfr2").textContent = formatarComoMoeda(ValorFinalInfr2);
            let ValorFinalSN2 = (aeSN / 100) * ValorSN;
            document.getElementById("ValorCalcSN2").textContent = formatarComoMoeda(ValorFinalSN2);
            let ValorFinalInfrNI2 = (varSinapi / 100 + 1) * (aeInfrNI / 100) * ValorInfrNI;
            document.getElementById("ValorCalcInfrNI2").textContent = formatarComoMoeda(ValorFinalInfrNI2);
            let ValorFinalTotal2 = ValorFinalHab2 + ValorFinalEqui2 + ValorFinalInfr2 + ValorFinalSN2 + ValorFinalInfrNI2

            document.getElementById("ValorCalcTotal2").textContent = formatarComoMoeda(ValorFinalTotal2)
            document.getElementById("%HabFinal2").textContent = ((ValorFinalHab2 / ValorFinalTotal2) * 100.).toFixed(2);
            document.getElementById("%EquiFinal2").textContent = ((ValorFinalEqui2 / ValorFinalTotal2) * 100.).toFixed(2);
            document.getElementById("%InfrFinal2").textContent = ((ValorFinalInfr2 / ValorFinalTotal2) * 100.).toFixed(2);
            document.getElementById("%InfrNIFinal2").textContent = ((ValorFinalInfrNI2 / ValorFinalTotal2) * 100.).toFixed(2);
            document.getElementById("%SNFinal2").textContent = ((ValorFinalSN2 / ValorFinalTotal2) * 100).toFixed(2);
            document.getElementById("ValorBDI2").textContent = formatarComoMoeda(ValorFinalTotal2 * (BDI / 100));

            let ValorFinalTotalBDI2 = ValorFinalTotal2 * (1 + BDI / 100)
            document.getElementById("ValorCalcTotalBDI2").textContent = formatarComoMoeda(ValorFinalTotalBDI2);
            document.getElementById("ValorCalcTotalResumo2").textContent = formatarComoMoeda(ValorFinalTotalBDI2);

            return [ValorFinalTotalBDI1, ValorFinalTotalBDI2]

            //console.log(ValorFinalTotalBDI)

        } else {
            // Trate o caso de erro na obtenção do valor de varSinapi
            console.log('Não foi possível obter o valor de varSinapi');
        }
    } catch (error) {
        console.error('Erro ao executar usoDoValorSinapi:', error);
    }

}


async function buscaSinapi() {

    try {

        const apiUrl = 'https://servicodados.ibge.gov.br/api/v3/agregados/{agregado}/periodos/{periodos}/variaveis/51?localidades=N3[{UF}]&classificacao=314[{Tipo}]|41[{Padrao}]';

        const agregado = '647';
        let anoinicial = document.getElementById("cboAnoInicial");
        anoinicial = anoinicial.options[anoinicial.selectedIndex].value;
        let mesinicial = document.getElementById("cboMesInicial");
        mesinicial = mesinicial.options[mesinicial.selectedIndex].value;
        let anofinal = document.getElementById("cboAnoFinal");
        anofinal = anofinal.options[anofinal.selectedIndex].value;
        let mesfinal = document.getElementById("cboMesFinal");
        mesfinal = mesfinal.options[mesfinal.selectedIndex].value;
        let anomesinicial = anoinicial + mesinicial
        let anomesfinal = anofinal + mesfinal
        let periodos = anomesinicial + "|" + anomesfinal

        let UF = document.getElementById("cboUF");
        UF = UF.options[UF.selectedIndex].value;
        let Tipo = document.getElementById("cboTipo");
        Tipo = Tipo.options[Tipo.selectedIndex].value;
        let Padrao = document.getElementById("cboPadrao");
        Padrao = Padrao.options[Padrao.selectedIndex].value;

        // Construir a URL completa substituindo as variáveis no URL base
        const url = apiUrl
            .replace('{agregado}', agregado)
            .replace('{periodos}', periodos)
            .replace('{UF}', UF)
            .replace('{Tipo}', Tipo)
            .replace('{Padrao}', Padrao);

        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        // Manipular os dados recebidos da API
        const dtbaseInicial = document.getElementById('valorMetroInicial');
        //JSON.stringify(data[0].resultados[0].series[0].serie[anomesinicial]).replace('"', '').replace('"', '');
        valorInicial = JSON.stringify(data[0].resultados[0].series[0].serie[anomesinicial]).replace('"', '').replace('"', '');
        dtbaseInicial.textContent = valorInicial

        const dtbaseFinal = document.getElementById('valorMetroFinal');
        // JSON.stringify(data[0].resultados[0].series[0].serie[anomesfinal]).replace('"', '').replace('"', '');
        valorFinal = JSON.stringify(data[0].resultados[0].series[0].serie[anomesfinal]).replace('"', '').replace('"', '');
        dtbaseFinal.textContent = valorFinal

        const VarInicialFinal = document.getElementById('valorVariacao');
        VarInicialFinal.textContent = ((valorFinal / valorInicial - 1) * 100).toFixed(2);
        let varSinapi = ((valorFinal / valorInicial - 1) * 100).toFixed(2)

        //console.log(varSinapi);

        return [varSinapi, valorFinal];

    }
    catch (error) {
        // Lidar com erros da requisição
        console.log('Ocorreu um erro:', error);
    };


}

function calcularInvolucaoGrafico(totalMeses, totalMesesAtual) {
    var resultado = Math.exp((0.0245567 * totalMeses) + (0.0338926 * totalMesesAtual));
    return resultado >= 20 ? 20 : resultado;
}

// Função assíncrona para criar o gráfico
async function criarGraficoAmCharts() {

    try {

        let [MesSimulacao, AnoSimulacao] = await salvaValoresFormulario();
        let dataSimulacao = "1/" + MesSimulacao + "/" + AnoSimulacao

        var partesDataSimulacao = dataSimulacao.split('/');
        // Lembre-se de subtrair 1 do mês porque os meses em JavaScript começam em 0 (janeiro)
        //var dataAtual = new Date(partesDataSimulacao[2], partesDataSimulacao[1] - 1, partesDataSimulacao[0]);

        //console.log(datatAtual)


        // Cria uma instância do gráfico
        var chart = am4core.create("chartdiv", am4charts.XYChart);

        var data = [];
        var dataAtual = new Date();
        //console.log(dataAtual)
        for (var i = 0; i <= 30; i++) {
            var novoMes = new Date(dataAtual.getFullYear(), dataAtual.getMonth() + i, 1);
            console.log(novoMes)

            //var valorInvolucao = calcularInvolucaoGrafico(i, i);
            let valorInicial = await ValoresGrafico(i);
            let valorInicial1 = valorInicial[0]
            let valorInicial2 = valorInicial[1]
            console.log("Passou aqui 1");
            //console.log(valorInicial)
            //console.log(valorInicial1)
            //console.log(valorInicial2)

            //console.log(valorInvolucao)
            data.push({
                date: novoMes,
                value: valorInicial1 //+ valorInvolucao
            });
        }
        chart.data = data;

        // Cria os eixos
        var dateAxis = chart.xAxes.push(new am4charts.DateAxis());
        dateAxis.renderer.minGridDistance = 50;

        var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());

        // Cria a série de linhas
        var series = chart.series.push(new am4charts.LineSeries());
        series.dataFields.valueY = "value";
        series.dataFields.dateX = "date";
        series.stroke = am4core.color("#ff8726");
        series.strokeWidth = 3;
        series.tooltipText = "Valor: {value}";
        dateAxis.renderer.labels.template.fill = am4core.color("#5C5C5C");
        valueAxis.renderer.labels.template.fill = am4core.color("#5C5C5C");

        // Habilita os cursores do gráfico
        chart.cursor = new am4charts.XYCursor();

        // Habilita a animação do gráfico
        chart.animate({
            property: "zoomY",
            to: 1
        }, 1500);

        // Define um tema claro para o gráfico (opcional)
        am4core.useTheme(am4themes_animated);
    }
    catch (error) {
        // Lidar com erros da requisição
        console.log('Ocorreu um erro:', error);
    };
}



function formulaInvolucao(totalMeses, totalMesesAtual) {
    console.log(totalMeses, totalMesesAtual)
    var resultado = Math.exp((0.0245567 * totalMeses) + (0.0338926 * totalMesesAtual));
    console.log(resultado)
    return resultado >= 20 ? 20 : resultado;
}

function atualizaTextoData() {

    const cboMesFinal = document.getElementById("cboMesFinal");
    const cboAnoFinal = document.getElementById("cboAnoFinal");

    // Certifique-se de que ambos os elementos de seleção existam
    if (!cboMesFinal || !cboAnoFinal) {
        console.error("Elementos de seleção de mês ou ano não encontrados.");
        return;
    }

    // Obtenha o texto do mês e o valor do ano selecionados
    const mesEscolhidoTexto = cboMesFinal.options[cboMesFinal.selectedIndex].textContent;
    const anoEscolhidoValor = cboAnoFinal.options[cboAnoFinal.selectedIndex].value;

    // Atualize o conteúdo de texto do elemento que alerta sobre a data
    document.getElementById("AlertaData1").textContent = "Atenção! Valor ESTIMADO apenas para " + mesEscolhidoTexto + " de " + anoEscolhidoValor + ".";
    document.getElementById("AlertaData2").textContent = "Atenção! Valor ESTIMADO apenas para " + mesEscolhidoTexto + " de " + anoEscolhidoValor + ".";
}


document.addEventListener("DOMContentLoaded", function () {
    var toggleButton = document.querySelector('.toggle-button');
    var detalhes = document.getElementById('detalhesValoresCalculados');

    toggleButton.addEventListener('click', function () {
        var isHidden = detalhes.style.display === 'none';
        detalhes.style.display = isHidden ? 'block' : 'none';
        toggleButton.textContent = isHidden ? 'Ocultar Detalhes' : 'Mostrar Detalhes';
    });
});
/*
document.addEventListener("DOMContentLoaded", function () {
    var toggleButton2 = document.querySelector('.toggle-button2');
    var detalhes2 = document.getElementById('detalhesValoresCalculados2');

    toggleButton2.addEventListener('click', function () {
        var isHidden2 = detalhes2.style.display === 'none';
        detalhes2.style.display = isHidden2 ? 'block' : 'none';
        toggleButton2.textContent = isHidden2 ? 'Ocultar Detalhes' : 'Mostrar Detalhes';
    });
});
*/
function imprimirPagina() {
    window.print();
};

async function ValoresGrafico(i) {


    try {
        const [varSinapi, valorFinal] = await buscaSinapi();
        let [ValorHab, ValorEqui, ValorOD, ValorInfr, ValorInfrNI, ValorSN, PercHab, PercEqui, PercInfr, PercInfrNI, PercSN, dataInicial, dataFinal, MesSimulacao, AnoSimulacao, RaeInvolucao, AEq, BDI] = await salvaValoresFormulario();
        let dataSimulacao = "1/" + MesSimulacao + "/" + AnoSimulacao
        let [totalMeses, totalMesesAtual] = await calcularMesesEntreDatas(dataInicial, dataFinal, dataSimulacao);
        let involucaoCalculada = await formulaInvolucao(totalMeses + i, totalMesesAtual + i);

        const [ValorSPG, ValorFC, ValorEB, ValorIE, ValorCpl, somaPercSNI] = await atualizaValorSNI();
        const TotalSNI = ValorSPG + ValorFC + ValorEB + ValorIE + ValorCpl
        involucaoCalculada = Math.round(involucaoCalculada * 100) / 100;


        if (varSinapi !== null) {


            let aeHab = (100 - PercHab) + parseFloat(involucaoCalculada);
            if (ValorHab === 0) { aeHab = 0 };
            if (aeHab > 100) { aeHab = 100 };
            let aeEqui = (100 - PercEqui) + parseFloat(involucaoCalculada);
            if (ValorEqui === 0) { aeEqui = 0 };
            if (aeEqui > 100) { aeEqui = 100 };
            let aeInfr = (100 - PercInfr) + parseFloat(involucaoCalculada);
            if (ValorInfr === 0) { aeInfr = 0 };
            if (aeInfr > 100) { aeInfr = 100 };
            let aeSN = (100 - PercSN);
            if (ValorSN === 0) { aeSN = 0 };
            let aeInfrNI = (100 - PercInfrNI) + parseFloat(involucaoCalculada);
            if (ValorInfrNI === 0) { aeInfrNI = 0 };
            if (aeInfrNI > 100) { aeInfrNI = 100 };

            //Metodologia 1

            let ValorFinalHab1 = (varSinapi / 100 + 1) * (aeHab / 100) * ValorHab;

            let ValorFinalEqui1 = (varSinapi / 100 + 1) * (aeEqui / 100) * ValorEqui;

            let ValorFinalInfr1 = (varSinapi / 100 + 1) * (aeInfr / 100) * ValorInfr;

            let ValorFinalSN1 = (aeSN / 100) * ValorSN;

            let ValorFinalInfrNI1 = (varSinapi / 100 + 1) * (aeInfrNI / 100) * ValorInfrNI;

            let ValorFinalTotal1 = ValorFinalHab1 + ValorFinalEqui1 + ValorFinalInfr1 + ValorFinalSN1 + ValorFinalInfrNI1

            let ValorBDI1 = ValorFinalTotal1 * (BDI / 100)

            let ValorFinalTotalBDI1 = ValorFinalTotal1 * (1 + BDI / 100)


            let ValorFinalHab2 = (aeHab / 100) * (parseFloat(valorFinal) * AEq * (100 / (100 - somaPercSNI)));

            let ValorFinalEqui2 = (aeHab / 100) * (parseFloat(valorFinal) * AEq * (100 / (100 - somaPercSNI))) * ValorEqui / ValorHab;

            let ValorFinalInfr2 = (aeHab / 100) * (parseFloat(valorFinal) * AEq * (100 / (100 - somaPercSNI))) * ValorInfr / ValorHab;

            let ValorFinalSN2 = (aeSN / 100) * ValorSN;

            let ValorFinalInfrNI2 = (varSinapi / 100 + 1) * (aeInfrNI / 100) * ValorInfrNI;

            let ValorFinalTotal2 = ValorFinalHab2 + ValorFinalEqui2 + ValorFinalInfr2 + ValorFinalSN2 + ValorFinalInfrNI2

            let ValorFinalTotalBDI2 = ValorFinalTotal2 * (1 + BDI / 100)


            return [ValorFinalTotalBDI1, ValorFinalTotalBDI2]

            //console.log(ValorFinalTotalBDI)

        } else {
            // Trate o caso de erro na obtenção do valor de varSinapi
            console.log('Não foi possível obter o valor de varSinapi');
        }
    } catch (error) {
        console.error('Erro ao executar usoDoValorSinapi:', error);
    }

}


