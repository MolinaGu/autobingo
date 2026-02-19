// =============================
// VARIÁVEIS GLOBAIS
// =============================
let palavrasGlobais = [];
let colunasGlobais = 0;
let linhasGlobais = 0;
let totalCelulas = 0;


// =============================
// ETAPA 1 - RECEBER LINHAS E COLUNAS
// =============================

document.getElementById("enviar").addEventListener("click", function(e){
    e.preventDefault();

    let colunas = parseInt(document.getElementById("colunas").value);
    let linhas = parseInt(document.getElementById("linhas").value);

    if(isNaN(colunas) || isNaN(linhas) || colunas <= 0 || linhas <= 0){
        alert("Digite valores válidos!");
        return;
    }

    colunasGlobais = colunas;
    linhasGlobais = linhas;
    totalCelulas = colunas * linhas;

    document.getElementById("form").classList.add("hide");
    document.getElementById("palavrasBox").classList.remove("hide");
});


// =============================
// ETAPA 2 - RECEBER PALAVRAS
// =============================

document.getElementById("confirmarPalavras").addEventListener("click", function(){

    let texto = document.getElementById("listaPalavras").value.trim();

    let palavras = texto
        .split("\n")
        .map(p => p.trim())
        .filter(p => p !== "");

    if(palavras.length !== totalCelulas){
        alert(`Você precisa digitar exatamente ${totalCelulas} palavras.`);
        return;
    }

    palavrasGlobais = palavras;

    document.getElementById("palavrasBox").classList.add("hide");

    criarGradeAleatoria();
    document.getElementById("downloadBox").classList.remove("hide");
});


// =============================
// CRIAR GRADE ALEATÓRIA
// =============================

function criarGradeAleatoria(){

    const grade = document.querySelector(".grade");
    grade.innerHTML = "";

    grade.style.gridTemplateColumns = `repeat(${colunasGlobais}, 1fr)`;

    let palavrasEmbaralhadas = [...palavrasGlobais]
        .sort(() => Math.random() - 0.5);

    palavrasEmbaralhadas.forEach(palavra => {
        let celula = document.createElement("div");
        celula.classList.add("celula");
        celula.textContent = palavra;
        grade.appendChild(celula);
    });
}



// =============================
// GERAR PDF COM VÁRIAS TABELAS
// =============================

document.getElementById("baixarPdf").addEventListener("click", function(){

    let quantidade = parseInt(document.getElementById("qtdTabelas").value);
    let porFolha = parseInt(document.getElementById("porFolha").value);
    let nomeArquivo = document.getElementById("nomeArquivo").value.trim();

    if(isNaN(quantidade) || quantidade <= 0){
        alert("Digite uma quantidade válida de tabelas.");
        return;
    }

    if(isNaN(porFolha) || porFolha <= 0){
        alert("Digite uma quantidade válida de tabelas por folha.");
        return;
    }

    if(nomeArquivo === ""){
        nomeArquivo = "bingo";
    }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    let contadorNaPagina = 0;

    for(let t = 0; t < quantidade; t++){

        if(t > 0 && contadorNaPagina === porFolha){
            doc.addPage();
            contadorNaPagina = 0;
        }

        let palavras = [...palavrasGlobais]
            .sort(() => Math.random() - 0.5);

        // Cálculo automático de altura por tabela
        let margemX = 15;
        let margemYBase = 20;
        let alturaDisponivel = 260; // altura útil da folha
        let alturaPorTabela = alturaDisponivel / porFolha;

        let larguraTotal = 180;
        let alturaTotal = alturaPorTabela - 10;

        let larguraCelula = larguraTotal / colunasGlobais;
        let alturaCelula = alturaTotal / linhasGlobais;

        let yInicial = margemYBase + (contadorNaPagina * alturaPorTabela);

        let index = 0;

        for(let l = 0; l < linhasGlobais; l++){
            for(let c = 0; c < colunasGlobais; c++){

                let x = margemX + (c * larguraCelula);
                let y = yInicial + (l * alturaCelula);

                doc.rect(x, y, larguraCelula, alturaCelula);

                doc.text(
                    palavras[index],
                    x + larguraCelula/2,
                    y + alturaCelula/2,
                    {
                        align: "center",
                        maxWidth: larguraCelula - 4
                    }
                );

                index++;
            }
        }

        contadorNaPagina++;
    }

    doc.save(nomeArquivo + ".pdf");
});