const SPREADSHEET_ID = '1FDwr9XhrdbMkPKEv5a4qA2Sr0kMUVAe-ZpcEeaNB4CM';

// Esta URL usa o endpoint de visualização que não sofre bloqueio de CORS pelo Live Server
const url = `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/gviz/tq?tqx=out:csv&sheet=resultados`;

async function carregarResultados() {
    try {
        const resposta = await fetch(url);
        if (!resposta.ok) throw new Error('Erro ao conectar com a planilha.');

        const csvTexto = await resposta.text();
        const linhas = csvTexto.split('\n');

        let temDados = false;
        let htmlCards = '<div class="grid-resultados">';

        linhas.forEach((linha, index) => {
            if (index === 0) return; // Ignora o cabeçalho

            // Trata se o separador for vírgula ou ponto e vírgula
            const separador = linha.includes(';') ? ';' : ',';
            const colunas = linha.split(separador).map(celula => celula.replace(/^"|"$/g, '').trim());
            
            if (!colunas[0] || !colunas[1]) return; 
            if (colunas[0].toLowerCase().includes("time vencedor")) return;

            const timeVencedor = colunas[0];
            const timePerdedor = colunas[1];
            const golsVencedor = colunas[2] !== "" ? colunas[2] : 0;
            const golsPerdedor = colunas[3] !== "" ? colunas[3] : 0;

            temDados = true;

            htmlCards += `
                <div class="card-placar">
                    <div class="confronto">
                        <div class="time-box time-vencedor">${timeVencedor}</div>
                        <div class="placar-numeros">${golsVencedor} - ${golsPerdedor}</div>
                        <div class="time-box time-perdedor">${timePerdedor}</div>
                    </div>
                    <div class="status-partida">Fim de jogo</div>
                </div>
            `;
        });

        htmlCards += '</div>';

        if (temDados) {
            document.getElementById('conteudo-resultados').innerHTML = htmlCards;
        } else {
            document.getElementById('conteudo-resultados').innerHTML = "<div class='loading'>Nenhum jogo cadastrado na aba de resultados ainda.</div>";
        }

    } catch (erro) {
        console.error("Erro capturado pelo script:", erro);
        document.getElementById('conteudo-resultados').innerHTML = "<div class='loading'>Erro de CORS ou Permissão. Verifique se a planilha está 'Publicada na Web'.</div>";
    }
}

carregarResultados();