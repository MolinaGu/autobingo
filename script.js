/* ========================================= */
/* VARIÁVEIS GLOBAIS */
/* ========================================= */

let linhasGlobais;
let colunasGlobais;
let palavrasGlobais = [];

/* ========================================= */
/* ELEMENTOS */
/* ========================================= */

const togglePersonalizado = document.getElementById("modeloPersonalizado");
const inputPorFolha = document.getElementById("porFolha");

const toggleCores = document.getElementById("coresAleatorias");
const inputCor = document.getElementById("corFundo");

const inputSubtitulo = document.getElementById("subtituloPdf"); // NOVO

const btnVisualizar = document.getElementById("btnVisualizar");
const btnFechar = document.getElementById("btnFechar");
const botaoPdf = document.getElementById("baixarPdf");

const areaVisualizacao = document.getElementById("areaVisualizacao");

/* ========================================= */
/* ESTADO INICIAL */
/* ========================================= */

function aplicarEstadoInicial(){

    togglePersonalizado.checked = false;

    inputPorFolha.disabled = false;
    inputPorFolha.style.opacity = "1";

    toggleCores.checked = false;
    toggleCores.disabled = true;
    toggleCores.parentElement.style.opacity = "0.5";

    inputCor.disabled = true;
    inputCor.style.opacity = "0.5";

    inputSubtitulo.disabled = true; // NOVO
    inputSubtitulo.style.opacity = "0.5"; // NOVO

    btnFechar.style.display = "none";
    areaVisualizacao.style.display = "none";
}

aplicarEstadoInicial();

/* ========================================= */
/* CRIAR GRADE */
/* ========================================= */

function criarGrade(){

    linhasGlobais = parseInt(document.getElementById("linhas").value);
    colunasGlobais = parseInt(document.getElementById("colunas").value);

    if(isNaN(linhasGlobais) || isNaN(colunasGlobais)){
        alert("Informe linhas e colunas válidas.");
        return;
    }

    let total = linhasGlobais * colunasGlobais;

    palavrasGlobais = document.getElementById("palavrasInput").value
        .split(",")
        .map(p => p.trim())
        .filter(p => p !== "");

    if(palavrasGlobais.length !== total){
        alert("A quantidade de palavras deve ser igual a " + total);
        return;
    }

    alert("Grade configurada com sucesso!");
}

/* ========================================= */
/* TOGGLE PERSONALIZADO */
/* ========================================= */

togglePersonalizado.addEventListener("change", function(){

    if(this.checked){

        inputPorFolha.disabled = true;
        inputPorFolha.style.opacity = "0.5";

        toggleCores.disabled = false;
        toggleCores.parentElement.style.opacity = "1";

        if(!toggleCores.checked){
            inputCor.disabled = false;
            inputCor.style.opacity = "1";
        }

        // ATIVAR SUBTÍTULO
        inputSubtitulo.disabled = false;
        inputSubtitulo.style.opacity = "1";

    } else {

        inputPorFolha.disabled = false;
        inputPorFolha.style.opacity = "1";

        toggleCores.checked = false;
        toggleCores.disabled = true;
        toggleCores.parentElement.style.opacity = "0.5";

        inputCor.disabled = true;
        inputCor.style.opacity = "0.5";

        // DESATIVAR SUBTÍTULO
        inputSubtitulo.disabled = true;
        inputSubtitulo.style.opacity = "0.5";
    }
});

/* ========================================= */
/* TOGGLE CORES */
/* ========================================= */

toggleCores.addEventListener("change", function(){

    if(this.checked){
        inputCor.disabled = true;
        inputCor.style.opacity = "0.5";
    } else {
        inputCor.disabled = false;
        inputCor.style.opacity = "1";
    }
});

/* ========================================= */
/* VISUALIZAÇÃO */
/* ========================================= */

btnVisualizar.addEventListener("click", () => {

    if(!linhasGlobais || !colunasGlobais || palavrasGlobais.length === 0){
        alert("Configure a grade primeiro.");
        return;
    }

    let quantidade = parseInt(document.getElementById("qtdTabelas").value);

    if(isNaN(quantidade) || quantidade <= 0){
        alert("Digite a quantidade de tabelas.");
        return;
    }

    areaVisualizacao.innerHTML = "";
    areaVisualizacao.style.display = "flex";
    areaVisualizacao.style.flexWrap = "wrap";

    let personalizado = togglePersonalizado.checked;
    let usarAleatoria = toggleCores.checked;

    for(let i = 0; i < quantidade; i++){

        let palavras = [...palavrasGlobais].sort(() => Math.random() - 0.5);

        let cor = "#ffffff";

        if(personalizado){
            if(usarAleatoria){
                cor = gerarCorAleatoria();
            } else {
                cor = inputCor.value;
            }
        }

        const tabela = gerarTabelaHTML(palavras, cor);
        areaVisualizacao.appendChild(tabela);
    }

    btnFechar.style.display = "inline-block";
});

/* ========================================= */
/* FECHAR VISUALIZAÇÃO */
/* ========================================= */

btnFechar.addEventListener("click", () => {
    areaVisualizacao.innerHTML = "";
    areaVisualizacao.style.display = "none";
    btnFechar.style.display = "none";
});

/* ========================================= */
/* GERAR PDF */
/* ========================================= */

botaoPdf.addEventListener("click", function(){

    if(!linhasGlobais || !colunasGlobais || palavrasGlobais.length === 0){
        alert("Configure a grade primeiro.");
        return;
    }

    let quantidade = parseInt(document.getElementById("qtdTabelas").value);
    let nomeArquivo = document.getElementById("nomeArquivo").value.trim();
    let personalizado = togglePersonalizado.checked;
    let usarAleatoria = toggleCores.checked;

    let subtitulo = document.getElementById("subtituloPdf").value.trim();
    if(subtitulo === "") subtitulo = "Bingo show de bola";

    if(isNaN(quantidade) || quantidade <= 0){
        alert("Quantidade inválida.");
        return;
    }

    if(nomeArquivo === "") nomeArquivo = "bingo";

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ format:"a4" });

    let larguraPagina = doc.internal.pageSize.getWidth();
    let alturaPagina = doc.internal.pageSize.getHeight();

    for(let t = 0; t < quantidade; t++){

        if(t > 0){
            doc.addPage();
        }

        let palavras = [...palavrasGlobais].sort(() => Math.random() - 0.5);

        let corFundo = "#d85528";

        if(personalizado){
            if(usarAleatoria){
                corFundo = gerarCorAleatoria();
            } else {
                corFundo = inputCor.value;
            }
        }

        let rgb = hexToRgb(corFundo);

        doc.setFillColor(rgb.r, rgb.g, rgb.b);
        doc.rect(0, 0, larguraPagina, alturaPagina, "F");

        let margem = 12;

        doc.setFillColor(240,240,240);
        doc.rect(
            margem,
            margem,
            larguraPagina - margem*2,
            alturaPagina - margem*2,
            "F"
        );

        doc.setFont("helvetica","bold");
        doc.setFontSize(50);
        doc.setTextColor(60,40,20);
        doc.text("BINGO", larguraPagina/2, margem + 25, { align:"center" });

        // SUBTÍTULO DINÂMICO
        doc.setFont("helvetica","normal");
        doc.setFontSize(18);
        doc.setTextColor(90);
        doc.text(subtitulo, larguraPagina/2, margem + 38, { align:"center" });

        doc.setFontSize(12);
        doc.setTextColor(0);
        doc.text("Cartela nº " + (t+1), larguraPagina - 50, margem + 20);
        doc.setFont("helvetica","normal");
doc.setFontSize(12);
doc.setTextColor(0);

// Área branca interna
let areaInternaInicio = margem;
let areaInternaFim = larguraPagina - margem;
let larguraInterna = areaInternaFim - areaInternaInicio;

// Espaçamento vertical organizado
let nomeDataY = margem + 45; // abaixo do subtítulo com margem visual

// Dividir área em 2 partes
let metade = larguraInterna / 2;

// ---------- NOME ----------
doc.text("Nome:", areaInternaInicio + 10, nomeDataY);

// Linha do nome (ocupa quase metade da área)
doc.line(
    areaInternaInicio + 28,
    nomeDataY + 1,
    areaInternaInicio + metade - 10,
    nomeDataY + 1
);

// ---------- DATA ----------
doc.text("Data:", areaInternaInicio + metade + 10, nomeDataY);

// Linha da data
doc.line(
    areaInternaInicio + metade + 28,
    nomeDataY + 1,
    areaInternaFim - 10,
    nomeDataY + 1
);

        let areaTopo = margem + 50;
        let areaAltura = alturaPagina - areaTopo - margem - 10;

        gerarGradeEstilizada(doc, palavras, areaTopo, larguraPagina, areaAltura, corFundo);
    }

    doc.save(nomeArquivo + ".pdf");
});

/* ========================================= */
/* RESTANTE DO CÓDIGO (GRADE / FUNÇÕES) */
/* ========================================= */

function gerarGradeEstilizada(doc, palavras, topo, larguraPagina, alturaArea, corBorda){

    let larguraGrade = larguraPagina - 60;
    let larguraCelula = larguraGrade / colunasGlobais;
    let alturaCelula = alturaArea / linhasGlobais;

    let inicioX = 30;
    let inicioY = topo;

    let rgbBorda = hexToRgb(corBorda);

    let index = 0;

    for(let l = 0; l < linhasGlobais; l++){
        for(let c = 0; c < colunasGlobais; c++){

            let x = inicioX + (c * larguraCelula);
            let y = inicioY + (l * alturaCelula);

            let texto = palavras[index];

            doc.setFillColor(255,255,255);
            doc.rect(x, y, larguraCelula, alturaCelula, "F");

            doc.setDrawColor(rgbBorda.r, rgbBorda.g, rgbBorda.b);
            doc.setLineWidth(2.75);
            doc.rect(x, y, larguraCelula, alturaCelula);

            let tamanhoFonte = alturaCelula * 0.35;
            doc.setFont("helvetica", "bold");

            while(tamanhoFonte > 6){
                doc.setFontSize(tamanhoFonte);
                let larguraTexto = doc.getTextWidth(texto);
                if(larguraTexto <= larguraCelula - 8){
                    break;
                }
                tamanhoFonte -= 0.5;
            }

            doc.setFontSize(tamanhoFonte);
            doc.setTextColor(0);

            let textoAltura = tamanhoFonte / 2.5;

            doc.text(
                texto,
                x + larguraCelula/2,
                y + alturaCelula/2 + textoAltura/2,
                { align:"center" }
            );

            index++;
        }
    }
}

function gerarTabelaHTML(palavras, corFundo){

    // Página simulando A4
    const pagina = document.createElement("div");
    pagina.style.width = "500px";
    pagina.style.height = "700px";
    pagina.style.background = corFundo;
    pagina.style.padding = "15px";
    pagina.style.boxSizing = "border-box";
    pagina.style.margin = "20px";
    pagina.style.boxShadow = "0 10px 25px rgba(0,0,0,0.3)";
    pagina.style.display = "flex";
    pagina.style.justifyContent = "center";
    pagina.style.alignItems = "center";

    // Área branca interna
    const areaInterna = document.createElement("div");
    areaInterna.style.background = "#f0f0f0";
    areaInterna.style.width = "100%";
    areaInterna.style.height = "100%";
    areaInterna.style.padding = "20px";
    areaInterna.style.boxSizing = "border-box";
    areaInterna.style.display = "flex";
    areaInterna.style.flexDirection = "column";
    areaInterna.style.alignItems = "center";
    areaInterna.style.color="#555";

    // Título
    const titulo = document.createElement("h1");
    titulo.innerText = "BINGO";
    titulo.style.margin = "0";
    titulo.style.fontSize = "40px";
    titulo.style.color = "#3c2814";

    // Subtítulo
    const subtituloInput = document.getElementById("subtituloPdf").value.trim();
    const subtitulo = document.createElement("div");
    subtitulo.innerText = subtituloInput || "Bingo show de bola";
    subtitulo.style.fontSize = "16px";
    subtitulo.style.marginBottom = "20px";
    subtitulo.style.color = "#555";

    // Nome/Data
    const linhaInfo = document.createElement("div");
    linhaInfo.style.width = "100%";
    linhaInfo.style.display = "flex";
    linhaInfo.style.justifyContent = "space-between";
    linhaInfo.style.marginBottom = "25px";
    linhaInfo.style.fontSize = "14px";
    linhaInfo.style.color="#555";

    linhaInfo.innerHTML = `
        <div>Nome: ________________________</div>
        <div>Data: ___ / ___ / ______</div>
    `;

    // Tabela
    const tabela = document.createElement("table");
    tabela.style.borderCollapse = "collapse";
    tabela.style.width = "100%";
    tabela.style.flexGrow = "1";
    tabela.style.color="#555";
    tabela.style.tableLayout = "fixed";
    tabela.style.width = "100%";

    let index = 0;

    for(let l = 0; l < linhasGlobais; l++){

        const linha = document.createElement("tr");

        for(let c = 0; c < colunasGlobais; c++){

            const celula = document.createElement("td");

            celula.style.border = "1px solid " + corFundo;
            celula.style.textAlign = "center";
            celula.style.verticalAlign = "middle";
            celula.style.fontWeight = "bold";
            celula.style.background = "white";
            celula.style.padding = "5px";

            celula.style.width = (100 / colunasGlobais) + "%";
            celula.style.height = (100 / linhasGlobais) + "%";

            celula.style.overflow = "hidden";
            celula.style.wordWrap = "break-word";
            celula.style.fontSize = "14px";

            celula.innerText = palavras[index];
            linha.appendChild(celula);
            index++;
        }

        tabela.appendChild(linha);
    }

    areaInterna.appendChild(titulo);
    areaInterna.appendChild(subtitulo);
    areaInterna.appendChild(linhaInfo);
    areaInterna.appendChild(tabela);

    pagina.appendChild(areaInterna);

    return pagina;
}

function gerarCorAleatoria(){
    const cores = ["#21c321","#a924ec","#ff5722","#2196f3","#9c27b0","#00bcd4","#4caf50","#e91e63"];
    return cores[Math.floor(Math.random() * cores.length)];
}

function hexToRgb(hex){
    let bigint = parseInt(hex.replace("#",""),16);
    return {
        r:(bigint>>16)&255,
        g:(bigint>>8)&255,
        b:bigint&255
    };
}
