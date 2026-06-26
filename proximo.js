const SPREADSHEET_ID = '1FDwr9XhrdbMkPKEv5a4qA2Sr0kMUVAe-ZpcEeaNB4CM';
const SHEET_NAME = 'proximos jogos'; 

// URL configurada via API de visualização para evitar qualquer bloqueio de CORS
const url = `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(SHEET_NAME)}`;

async function carregarAgenda() {
    try {
        const resposta = await fetch(url);
        if (!resposta.ok) throw new Error('Erro ao conectar com a planilha.');

        const csvTexto = await resposta.text();
        const linhas = csvTexto.split('\n');

        let temDados = false;
        let htmlCards = '<div class="grid-agenda">';

        linhas.forEach((linha, index) => {
            if (index === 0) return; // Ignora os cabeçalhos da linha 1

            const separador = linha.includes(';') ? ';' : ',';
            const colunas = linha.split(separador).map(celula => celula.replace(/^"|"$/g, '').trim());
            
            // Ignora se os campos essenciais de times estiverem em branco
            if (!colunas[0] || !colunas[1]) return; 

            // Mapeia de acordo com a imagem da planilha:
            // colunas[0]=time 1, colunas[1]=time 2, colunas[2]=hora, colunas[3]=dia, colunas[4]=local
            const time1 = colunas[0];
            const time2 = colunas[1];
            const hora  = colunas[2] || '--:--';
            const dia   = colunas[3] || 'Data a definir';
            const local = colunas[4] || 'Local não informado';

            temDados = true;

            htmlCards += `
                <div class="card-agenda">
                    <div class="info-data">
                        <span>📅dia ${dia}</span>
                        <span>⏰ ${hora}</span>
                    </div>
                    <div class="partida-box">
                        <div class="time time-casa">${time1}</div>
                        <div class="vs-badge">VS</div>
                        <div class="time time-fora">${time2}</div>
                    </div>
                    <div class="info-local">
                        📍 <span>${local}</span>
                    </div>
                </div>
            `;
        });

        htmlCards += '</div>';

        if (temDados) {
            document.getElementById('conteudo-agenda').innerHTML = htmlCards;
        } else {
            document.getElementById('conteudo-agenda').innerHTML = "<div class='loading'>Nenhum próximo jogo agendado na planilha ainda.</div>";
        }

    } catch (erro) {
        console.error("Erro ao carregar dados:", erro);
        document.getElementById('conteudo-agenda').innerHTML = "<div class='loading'>Erro ao atualizar a agenda. Verifique se a planilha continua publicada.</div>";
    }
}

// Inicializa a consulta
carregarAgenda();