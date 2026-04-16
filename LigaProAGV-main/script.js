// TIMES
const teams = [
  { id: 1, name: 'DS3', group: 'A' },
  { id: 2, name: 'PORTOS2', group: 'A' },
  { id: 3, name: '2B', group: 'A' },
  { id: 4, name: 'BIO1', group: 'A' },
  { id: 5, name: 'ADM2', group: 'A' },
  { id: 6, name: 'PORTOS3', group: 'A' },
  { id: 7, name: '3D', group: 'A' },

  { id: 8, name: 'BIO2', group: 'B' },
  { id: 9, name: 'DS2', group: 'B' },
  { id: 10, name: '2C', group: 'B' },
  { id: 11, name: 'DS1', group: 'B' },
  { id: 12, name: '3A', group: 'B' },
  { id: 13, name: 'BIO3', group: 'B' },
  { id: 14, name: '1A', group: 'B' }
];

// JOGOS
let matches = [
  // GRUPO A
  { round: 1, homeId: 1, awayId: 2, homeScore: 2, awayScore: 1 },
  { round: 1, homeId: 3, awayId: 4, homeScore: 0, awayScore: 0 },

  // GRUPO B
  { round: 1, homeId: 8, awayId: 9, homeScore: 1, awayScore: 1 },
  { round: 1, homeId: 10, awayId: 11, homeScore: 2, awayScore: 0 }
];

// CALCULAR TABELA POR GRUPO
function calcTable(group) {
  const stats = {};

  const groupTeams = teams.filter(t => t.group === group);

  groupTeams.forEach(t => {
    stats[t.id] = {
      pts: 0, pj: 0, v: 0, e: 0, d: 0, gp: 0, gc: 0
    };
  });

  matches.forEach(m => {
    if (!stats[m.homeId] || !stats[m.awayId]) return;

    const h = stats[m.homeId];
    const a = stats[m.awayId];

    h.pj++; a.pj++;
    h.gp += m.homeScore; h.gc += m.awayScore;
    a.gp += m.awayScore; a.gc += m.homeScore;

    if (m.homeScore > m.awayScore) {
      h.pts += 3; h.v++; a.d++;
    } else if (m.homeScore < m.awayScore) {
      a.pts += 3; a.v++; h.d++;
    } else {
      h.pts++; a.pts++; h.e++; a.e++;
    }
  });

  return Object.entries(stats)
    .map(([id, s]) => ({ id: +id, ...s }))
    .sort((a, b) => b.pts - a.pts);
}

// RENDER DOS GRUPOS
function renderGroups() {
  const tbody = document.getElementById('standingsBody');
  tbody.innerHTML = '';

  ['A', 'B'].forEach(group => {
    const data = calcTable(group);

    // TÍTULO DO GRUPO
    tbody.innerHTML += `
      <tr class="group-title">
        <td colspan="10">Grupo ${group}</td>
      </tr>
    `;

    data.forEach((t, i) => {
      const team = teams.find(x => x.id === t.id);

      tbody.innerHTML += `
        <tr>
          <td>${i + 1}</td>
          <td>${team.name}</td>
          <td>${t.pj}</td>
          <td>${t.v}</td>
          <td>${t.e}</td>
          <td>${t.d}</td>
          <td>${t.gp}</td>
          <td>${t.gc}</td>
          <td>${t.gp - t.gc}</td>
          <td><strong>${t.pts}</strong></td>
        </tr>
      `;
    });
  });
}

// RESULTADOS (continua igual)
function renderMatches() {
  const div = document.getElementById('matches');
  div.innerHTML = '';

  // NOMES PERSONALIZADOS (SÓ PARA RESULTADOS)
  const customNames = {
    1: 'DS1°',
    2: 'BIO3°',
    3: 'PORTOS2°',
    4: 'ADM2°',
    8: 'ADM3°',
    9: 'DS2°',
    10: 'DS3°',
    11: 'PORTOS3°'
  };

  const rounds = {};

  matches.forEach(m => {
    if (!rounds[m.round]) rounds[m.round] = [];
    rounds[m.round].push(m);
  });

  Object.keys(rounds).forEach(round => {
    div.innerHTML += `<h3>Rodada ${round}</h3>`;

    rounds[round].forEach(m => {
      const home = customNames[m.homeId] || teams.find(t => t.id === m.homeId).name;
      const away = customNames[m.awayId] || teams.find(t => t.id === m.awayId).name;

      div.innerHTML += `
        <div class="match">
          <span>${home}</span>
          <strong>${m.homeScore} x ${m.awayScore}</strong>
          <span>${away}</span>
        </div>
      `;
    });
  });
}

// NAVEGAÇÃO
function showSection(id, btn) {
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('nav button').forEach(b => b.classList.remove('active'));

  document.getElementById(id).classList.add('active');
  btn.classList.add('active');
}

// INIT

let futureMatches = [
  { round: 3, homeId: 1, awayId: 2, date: '02/04', time: '08:00' },
  { round: 3, homeId: 3, awayId: 4, date: '02/04', time: '09:00' },

  { round: 3, homeId: 8, awayId: 9, date: '03/04', time: '10:00' },
  { round: 3, homeId: 10, awayId: 11, date: '03/04', time: '11:00' }
];

function renderFutureMatches() {
  const div = document.getElementById('futureMatches');
  div.innerHTML = '';

  const customNames = {
    1: 'DS1°',
    2: 'BIO3°',
    3: 'PORTOS2°',
    4: 'ADM2°',
    8: 'ADM3°',
    9: 'DS2°',
    10: 'DS3°',
    11: 'PORTOS3°'
  };

  const rounds = {};

  futureMatches.forEach(m => {
    if (!rounds[m.round]) rounds[m.round] = [];
    rounds[m.round].push(m);
  });

  Object.keys(rounds).forEach(round => {
    div.innerHTML += `<h3>Rodada ${round}</h3>`;

    rounds[round].forEach(m => {
      const home = customNames[m.homeId] || teams.find(t => t.id === m.homeId).name;
      const away = customNames[m.awayId] || teams.find(t => t.id === m.awayId).name;

      div.innerHTML += `
        <div class="match">
          <span>${home}</span>
          <strong>VS</strong>
          <span>${away}</span>

          <small>📅 ${m.date}</small>
          <small>🕒 ${m.time}</small>
          <small>📍 Ginásio Albertina Salmon</small>
        </div>
      `;
    });
  });
}

renderGroups();
renderMatches();
renderFutureMatches();