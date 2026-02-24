let linhasGlobais;
let colunasGlobais;
let palavrasGlobais = [];

/* ========================================= */
/* ELEMENTOS                                 */
/* ========================================= */
const togglePersonalizado = document.getElementById("modeloPersonalizado");
const toggleMargemResposta = document.getElementById("margemResposta");
const toggleMostrarNomeData = document.getElementById("mostrarNomeData");
const inputPorFolha = document.getElementById("porFolha");
const toggleCores = document.getElementById("coresAleatorias");
const inputCor = document.getElementById("corFundo");
const inputSubtitulo = document.getElementById("subtituloPdf");
const btnVisualizar = document.getElementById("btnVisualizar");
const btnFechar = document.getElementById("btnFechar");
const botaoPdf = document.getElementById("baixarPdf");
const areaVisualizacao = document.getElementById("areaVisualizacao");
const botaoImagem = document.getElementById("baixarImagem");

/* ========================================= */
/* ESTADO INICIAL                            */
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
    inputSubtitulo.disabled = true;
    inputSubtitulo.style.opacity = "0.5";
    btnFechar.style.display = "none";
    areaVisualizacao.style.display = "none";
    toggleMargemResposta.checked = false;
    toggleMargemResposta.disabled = true;
    toggleMargemResposta.parentElement.style.opacity = "0.5";
    toggleMostrarNomeData.checked = true;
    toggleMostrarNomeData.disabled = true;
    toggleMostrarNomeData.parentElement.style.opacity = "0.5";
}
aplicarEstadoInicial();

/* ========================================= */
/* CRIAR GRADE                               */
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
/* EVENTOS DE CONFIGURAÇÃO                   */
/* ========================================= */
togglePersonalizado.addEventListener("change", function(){
    let ativo = this.checked;
    toggleMargemResposta.disabled = !ativo;
    toggleMargemResposta.parentElement.style.opacity = ativo ? "1" : "0.5";
    inputPorFolha.disabled = ativo;
    inputPorFolha.style.opacity = ativo ? "0.5" : "1";
    toggleCores.disabled = !ativo;
    toggleCores.parentElement.style.opacity = ativo ? "1" : "0.5";
    inputCor.disabled = !ativo || toggleCores.checked;
    inputCor.style.opacity = (ativo && !toggleCores.checked) ? "1" : "0.5";
    inputSubtitulo.disabled = !ativo;
    inputSubtitulo.style.opacity = ativo ? "1" : "0.5";
    toggleMostrarNomeData.disabled = !ativo;
    toggleMostrarNomeData.parentElement.style.opacity = ativo ? "1" : "0.5";
});

toggleCores.addEventListener("change", function(){
    inputCor.disabled = this.checked;
    inputCor.style.opacity = this.checked ? "0.5" : "1";
});

/* ========================================= */
/* VISUALIZAÇÃO                              */
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

    for(let i = 0; i < quantidade; i++){
        let palavras = [...palavrasGlobais].sort(() => Math.random() - 0.5);
        let cor = togglePersonalizado.checked 
            ? (toggleCores.checked ? gerarCorAleatoria() : inputCor.value) 
            : "#ffffff";

        const tabelaHTML = gerarTabelaHTML(palavras, cor);
        areaVisualizacao.appendChild(tabelaHTML);

        
        tabelaHTML.querySelectorAll('.texto-celula').forEach(div => {
            ajustarFonteDinamica(div, div.parentElement);
        });
    }
    btnFechar.style.display = "inline-block";
});

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
    let nomeArquivo = document.getElementById("nomeArquivo").value.trim() || "bingo";
    let subtitulo = document.getElementById("subtituloPdf").value.trim() || "Bingo show de bola";

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ format:"a4" });

    let larguraPagina = doc.internal.pageSize.getWidth();
    let alturaPagina = doc.internal.pageSize.getHeight();

    for(let t = 0; t < quantidade; t++){
        if(t > 0) doc.addPage();

        let palavras = [...palavrasGlobais].sort(() => Math.random() - 0.5);
        let corFundo = togglePersonalizado.checked 
            ? (toggleCores.checked ? gerarCorAleatoria() : inputCor.value) 
            : "#d85528";

        let rgb = hexToRgb(corFundo);
        doc.setFillColor(rgb.r, rgb.g, rgb.b);
        doc.rect(0, 0, larguraPagina, alturaPagina, "F");

        let margem = 12;
        doc.setFillColor(240,240,240);
        doc.rect(margem, margem, larguraPagina - margem*2, alturaPagina - margem*2, "F");

        doc.setFont("helvetica","bold");
        doc.setFontSize(50);
        doc.setTextColor(60,40,20);
        doc.text("BINGO", larguraPagina/2, margem + 25, { align:"center" });

        doc.setFontSize(18);
        doc.setTextColor(90);
        doc.text(subtitulo, larguraPagina/2, margem + 38, { align:"center" });

        // Nome e Data
        doc.setFontSize(12);
        doc.setTextColor(0);
        let yInfo = margem + 45;
        if(toggleMostrarNomeData.checked){
        doc.text("Nome: ________________________", margem + 10, yInfo);
        doc.text("Data: ___/___/______", larguraPagina - 60, yInfo);
}
        let areaTopo = margem + 55;
        let areaAltura = alturaPagina - areaTopo - margem - 10;
        gerarGradeNoPdf(doc, palavras, areaTopo, larguraPagina, areaAltura, corFundo);
    }
    doc.save(nomeArquivo + ".pdf");
});

/* ========================================= */
/* FUNÇÕES AUXILIARES */
/* ========================================= */

function gerarTabelaHTML(palavras, corFundo) {
    const pagina = document.createElement("div");
    Object.assign(pagina.style, {
        width: "450px", height: "630px", background: corFundo,
        padding: "12px", margin: "10px", boxShadow: "0 5px 15px rgba(0,0,0,0.3)",
        display: "flex", flexDirection: "column"
    });

    const interna = document.createElement("div");
    Object.assign(interna.style, {
        background: "#f0f0f0", width: "100%", height: "100%",
        padding: "20px", display: "flex", flexDirection: "column", alignItems: "center", boxSizing: "border-box"
    });

    interna.innerHTML = `
    <h1 style="margin:0; font-size:32px; color:#3c2814;">BINGO</h1>
    <div style="font-size:14px; margin-bottom:10px; color: #555;">
        ${document.getElementById("subtituloPdf").value || "Bingo show de bola"}
    </div>
`;
if(toggleMostrarNomeData.checked){
    const info = document.createElement("div");
    Object.assign(info.style,{
        width:"100%",
        display:"flex",
        justifyContent:"space-between",
        marginBottom:"15px",
        fontSize:"12px",
        color:"#555"
    });

    info.innerHTML = `
        <span>Nome: __________</span>
        <span>Data: __/__/__</span>
    `;

    interna.appendChild(info);
}

const tabela = document.createElement("table");
Object.assign(tabela.style, { 
    borderCollapse: "collapse", 
    width: "100%", 
    flexGrow: "1", 
    tableLayout: "fixed",
    boxSizing: "border-box" 
});
    
    let index = 0;
    for (let l = 0; l < linhasGlobais; l++) {
        const tr = document.createElement("tr");
        for (let c = 0; c < colunasGlobais; c++) {
const td = document.createElement("td");
Object.assign(td.style, { 
    border: `2px solid ${corFundo}`, 
    background: "white",
    boxSizing: "border-box",
    padding: "12px",
    verticalAlign: toggleMargemResposta.checked ? "top" : "middle",
    textAlign: "center",
    position: "relative"
});
            
            const txt = document.createElement("div");
            txt.className = "texto-celula";
            txt.innerText = palavras[index];
            Object.assign(txt.style, { 
    width: "100%",
    color: "#555",
    fontWeight: "bold",
    lineHeight: "1.2",
    marginTop: toggleMargemResposta.checked ? "8px" : "0"
});

            td.appendChild(txt);
        if (toggleMargemResposta.checked) {
    const linha = document.createElement("div");
    Object.assign(linha.style, {
        position: "absolute",
        left: "10%",
        width: "80%",
        height: "1px",
        background: "#aaa",
        bottom: "20%"
    });
    td.appendChild(linha);
}
            tr.appendChild(td);
            index++;
        }
        tabela.appendChild(tr);
    }
    interna.appendChild(tabela);
    pagina.appendChild(interna);
    return pagina;
}

function ajustarFonteDinamica(elemento, celula) {
    let larguraPai = celula.clientWidth;
    let alturaPai = celula.clientHeight;
    let fontsize = 20; 
    
    const span = document.createElement("span");
    Object.assign(span.style, { visibility: "hidden", whiteSpace: "nowrap", fontWeight: "bold", fontSize: fontsize + "px" });
    span.innerText = elemento.innerText;
    document.body.appendChild(span);

    while ((span.offsetWidth > larguraPai - 8 || fontsize > alturaPai * 0.4) && fontsize > 6) {
        fontsize -= 0.5;
        span.style.fontSize = fontsize + "px";
    }
    elemento.style.fontSize = fontsize + "px";
    document.body.removeChild(span);
}

function gerarGradeNoPdf(doc, palavras, topo, larguraPagina, alturaArea, corBorda){
    let larguraGrade = larguraPagina - 60;
    let larguraCelula = larguraGrade / colunasGlobais;
    let alturaCelula = alturaArea / linhasGlobais;
    let rgbBorda = hexToRgb(corBorda);
    let index = 0;

    for(let l = 0; l < linhasGlobais; l++){
        for(let c = 0; c < colunasGlobais; c++){
            let x = 30 + (c * larguraCelula);
            let y = topo + (l * alturaCelula);
            let texto = palavras[index];

            doc.setFillColor(255,255,255);
            doc.rect(x, y, larguraCelula, alturaCelula, "F");

            doc.setDrawColor(rgbBorda.r, rgbBorda.g, rgbBorda.b);
            doc.setLineWidth(1);
            doc.rect(x, y, larguraCelula, alturaCelula);

            let margemInterna = 4;
            let larguraMaxima = larguraCelula - (margemInterna * 2);
        

            let fs = 18;
            let linhasTexto;

            while(fs > 6){
                doc.setFontSize(fs);
                linhasTexto = doc.splitTextToSize(texto, larguraMaxima);

                let alturaTextoTotal = linhasTexto.length * (fs * 0.45);

                if(alturaTextoTotal < alturaCelula * (toggleMargemResposta.checked ? 0.55 : 0.85)){
                    break;
                }

                fs -= 0.5;
            }

            doc.setFontSize(fs);
            doc.setTextColor(0);

            let alturaTextoTotal = linhasTexto.length * (fs * 0.45);
            let yTexto;

            if(toggleMargemResposta.checked){
                yTexto = y + alturaCelula * 0.15 + (fs * 0.8);
            } else {
                yTexto = y + (alturaCelula / 2) - (alturaTextoTotal / 2) + fs;
            }

            doc.text(linhasTexto, x + larguraCelula/2, yTexto, {
                align:"center"
            });

            if(toggleMargemResposta.checked){
                doc.line(
                    x + larguraCelula*0.15,
                    y + alturaCelula*0.75,
                    x + larguraCelula*0.85,
                    y + alturaCelula*0.75
                );
            }

            index++;
        }
    }
}

function gerarCorAleatoria(){
    const cores = ["#21c321","#a924ec","#ff5722","#2196f3","#9c27b0","#00bcd4","#4caf50","#e91e63"];
    return cores[Math.floor(Math.random() * cores.length)];
}

function hexToRgb(hex){
    let bigint = parseInt(hex.replace("#",""),16);
    return { r:(bigint>>16)&255, g:(bigint>>8)&255, b:bigint&255 };
}
botaoImagem.addEventListener("click", async function(){

    if(!linhasGlobais || !colunasGlobais || palavrasGlobais.length === 0){
        alert("Configure a grade primeiro.");
        return;
    }

    let quantidade = parseInt(document.getElementById("qtdTabelas").value);
    if(isNaN(quantidade) || quantidade <= 0){
        alert("Digite a quantidade de tabelas.");
        return;
    }

    let nomeArquivo = document.getElementById("nomeArquivo").value.trim() || "bingo";

    const containerTemp = document.createElement("div");
    containerTemp.style.position = "absolute";
    containerTemp.style.left = "-9999px";
    document.body.appendChild(containerTemp);

    for(let i = 0; i < quantidade; i++){

        let palavras = [...palavrasGlobais].sort(() => Math.random() - 0.5);
        let cor = togglePersonalizado.checked 
            ? (toggleCores.checked ? gerarCorAleatoria() : inputCor.value) 
            : "#d85528";

        const tabela = gerarTabelaHTML(palavras, cor);
        containerTemp.appendChild(tabela);

        await html2canvas(tabela, {
            scale: 3, 
            useCORS: true
        }).then(canvas => {

            const link = document.createElement("a");
            link.download = nomeArquivo + "_" + (i+1) + ".png";
            link.href = canvas.toDataURL("image/png");
            link.click();
        });
    }

    document.body.removeChild(containerTemp);
});
