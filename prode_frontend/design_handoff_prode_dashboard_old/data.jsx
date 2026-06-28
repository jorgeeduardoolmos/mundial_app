// data.jsx — Mundial 2026 mock data
// Teams, fixture, ranking, current user state.

// 48 teams · code, short name (ES), two flag-ish colors used for the chip.
// Colors are decorative tokens, NOT real flags — we render abstract blocks.
const TEAMS = [
  { code: "ARG", name: "Argentina",   c1: "#7BB4FF", c2: "#F4F5FF" },
  { code: "BRA", name: "Brasil",      c1: "#00C46B", c2: "#FFD23F" },
  { code: "FRA", name: "Francia",     c1: "#3B5BFF", c2: "#FF5C4D" },
  { code: "ESP", name: "España",      c1: "#FF5C4D", c2: "#FFD23F" },
  { code: "ING", name: "Inglaterra",  c1: "#F4F5FF", c2: "#FF5C4D" },
  { code: "ALE", name: "Alemania",    c1: "#1F2330", c2: "#FFD23F" },
  { code: "POR", name: "Portugal",    c1: "#00C46B", c2: "#FF5C4D" },
  { code: "ITA", name: "Italia",      c1: "#3B5BFF", c2: "#F4F5FF" },
  { code: "URU", name: "Uruguay",     c1: "#7BB4FF", c2: "#1F2330" },
  { code: "COL", name: "Colombia",    c1: "#FFD23F", c2: "#3B5BFF" },
  { code: "PAR", name: "Paraguay",    c1: "#FF5C4D", c2: "#3B5BFF" },
  { code: "CHI", name: "Chile",       c1: "#FF5C4D", c2: "#F4F5FF" },
  { code: "ECU", name: "Ecuador",     c1: "#FFD23F", c2: "#3B5BFF" },
  { code: "PER", name: "Perú",        c1: "#FF5C4D", c2: "#F4F5FF" },
  { code: "MEX", name: "México",      c1: "#00C46B", c2: "#FF5C4D" },
  { code: "USA", name: "EE.UU.",      c1: "#3B5BFF", c2: "#FF5C4D" },
  { code: "CAN", name: "Canadá",      c1: "#FF5C4D", c2: "#F4F5FF" },
  { code: "NED", name: "P. Bajos",    c1: "#FF7A1A", c2: "#3B5BFF" },
  { code: "BEL", name: "Bélgica",     c1: "#1F2330", c2: "#FFD23F" },
  { code: "CRO", name: "Croacia",     c1: "#FF5C4D", c2: "#3B5BFF" },
  { code: "DIN", name: "Dinamarca",   c1: "#FF5C4D", c2: "#F4F5FF" },
  { code: "SUI", name: "Suiza",       c1: "#FF5C4D", c2: "#F4F5FF" },
  { code: "AUT", name: "Austria",     c1: "#FF5C4D", c2: "#F4F5FF" },
  { code: "POL", name: "Polonia",     c1: "#F4F5FF", c2: "#FF5C4D" },
  { code: "TUR", name: "Turquía",     c1: "#FF5C4D", c2: "#F4F5FF" },
  { code: "UCR", name: "Ucrania",     c1: "#3B5BFF", c2: "#FFD23F" },
  { code: "SEN", name: "Senegal",     c1: "#00C46B", c2: "#FFD23F" },
  { code: "MAR", name: "Marruecos",   c1: "#C2185B", c2: "#00C46B" },
  { code: "EGI", name: "Egipto",      c1: "#FF5C4D", c2: "#F4F5FF" },
  { code: "TUN", name: "Túnez",       c1: "#FF5C4D", c2: "#F4F5FF" },
  { code: "CIV", name: "C. de Marfil",c1: "#FF7A1A", c2: "#00C46B" },
  { code: "NGA", name: "Nigeria",     c1: "#00C46B", c2: "#F4F5FF" },
  { code: "GHA", name: "Ghana",       c1: "#FF5C4D", c2: "#FFD23F" },
  { code: "CMR", name: "Camerún",     c1: "#00C46B", c2: "#FF5C4D" },
  { code: "SAF", name: "Sudáfrica",   c1: "#00C46B", c2: "#FFD23F" },
  { code: "ARG2",name: "Argelia",     c1: "#00C46B", c2: "#F4F5FF" },
  { code: "JPN", name: "Japón",       c1: "#F4F5FF", c2: "#FF5C4D" },
  { code: "KOR", name: "Corea del Sur",c1:"#F4F5FF", c2: "#3B5BFF" },
  { code: "AUS", name: "Australia",   c1: "#FFD23F", c2: "#00C46B" },
  { code: "IRN", name: "Irán",        c1: "#00C46B", c2: "#FF5C4D" },
  { code: "ARS", name: "Arabia S.",   c1: "#00C46B", c2: "#F4F5FF" },
  { code: "QAT", name: "Qatar",       c1: "#7A1F4A", c2: "#F4F5FF" },
  { code: "IRQ", name: "Irak",        c1: "#FF5C4D", c2: "#1F2330" },
  { code: "JOR", name: "Jordania",    c1: "#1F2330", c2: "#FF5C4D" },
  { code: "UZB", name: "Uzbekistán",  c1: "#3B5BFF", c2: "#00C46B" },
  { code: "NZL", name: "N. Zelanda",  c1: "#1F2330", c2: "#FF5C4D" },
  { code: "HAI", name: "Haití",       c1: "#3B5BFF", c2: "#FF5C4D" },
  { code: "ESC", name: "Escocia",     c1: "#3B5BFF", c2: "#F4F5FF" },
];

const byCode = (code) => TEAMS.find((t) => t.code === code) || TEAMS[0];

// 12 groups of 4 — Mundial 2026 format.
const GROUPS = [
  { id: "A", teams: ["MEX","ARG2","HAI","NZL"] },
  { id: "B", teams: ["CAN","JPN","TUR","AUT"] },
  { id: "C", teams: ["USA","PAR","UZB","ESC"] },
  { id: "D", teams: ["ARG","NED","SEN","CMR"] },
  { id: "E", teams: ["BRA","MAR","KOR","JOR"] },
  { id: "F", teams: ["FRA","DIN","NGA","ARS"] },
  { id: "G", teams: ["ESP","CRO","AUS","ECU"] },
  { id: "H", teams: ["ING","SUI","IRN","TUN"] },
  { id: "I", teams: ["ALE","POL","GHA","QAT"] },
  { id: "J", teams: ["POR","BEL","SAF","IRQ"] },
  { id: "K", teams: ["ITA","UCR","CIV","PER"] },
  { id: "L", teams: ["URU","COL","CHI","EGI"] },
];

// Fixture — 92 group-stage matches with a sprinkle of finished/live/upcoming.
// Status: 'FT' finished, 'LIVE', 'NEXT' upcoming. ko field is kickoff label.
function buildFixture() {
  const all = [];
  let id = 1;
  // Generate 6 matches per group (round-robin)
  for (const g of GROUPS) {
    const [a,b,c,d] = g.teams;
    const pairs = [[a,b],[c,d],[a,c],[b,d],[a,d],[b,c]];
    pairs.forEach(([h,v], idx) => {
      all.push({
        id: id++, group: g.id, home: h, away: v,
        date: 11 + (id % 18),
        time: ["18:00","21:00","23:00","16:00"][id % 4],
        status: "NEXT",
        hg: null, ag: null,
      });
    });
  }
  // Mark the first 4 as finished (with results)
  const finished = [
    { hg: 1, ag: 0 }, { hg: 2, ag: 2 }, { hg: 0, ag: 3 }, { hg: 3, ag: 1 },
  ];
  for (let i = 0; i < 4; i++) {
    all[i].status = "FT";
    all[i].hg = finished[i].hg;
    all[i].ag = finished[i].ag;
  }
  // One live match
  all[4].status = "LIVE";
  all[4].hg = 1; all[4].ag = 1; all[4].minute = 67;

  // Force a known "next match" for the hero card (USA vs PAR · group C)
  const nextIdx = all.findIndex((m) => m.home === "USA" && m.away === "PAR");
  if (nextIdx > 5) {
    const [m] = all.splice(nextIdx, 1);
    m.date = 12; m.time = "23:00"; m.dayLabel = "VIE 12 JUN";
    all.splice(5, 0, m);
  }
  return all;
}

const FIXTURE = buildFixture();

// Friends in your league
const RANKING = [
  { id: "u1", name: "Maca",    initials: "MC", color: "#D4FF3F", points: 64, exact: 3, delta:  0, streak: 4 },
  { id: "u2", name: "Tincho",  initials: "TN", color: "#3B5BFF", points: 58, exact: 2, delta: +1, streak: 2 },
  { id: "u3", name: "Juli",    initials: "JL", color: "#FF5C4D", points: 54, exact: 2, delta: -1, streak: 0 },
  { id: "u4", name: "Lautaro", initials: "LA", color: "#FFD23F", points: 48, exact: 1, delta: +2, streak: 3 },
  { id: "u5", name: "Sofi",    initials: "SF", color: "#FF7A1A", points: 46, exact: 1, delta:  0, streak: 1 },
  { id: "u6", name: "Vos",     initials: "VO", color: "#D4FF3F", points: 42, exact: 1, delta: +3, streak: 2, isYou: true },
  { id: "u7", name: "Nacho",   initials: "NC", color: "#7BB4FF", points: 40, exact: 0, delta: -2, streak: 0 },
  { id: "u8", name: "Caro",    initials: "CR", color: "#00C46B", points: 34, exact: 0, delta: -1, streak: 0 },
  { id: "u9", name: "Fede",    initials: "FD", color: "#C2185B", points: 28, exact: 0, delta:  0, streak: 0 },
];

// Current user / league state
const USER = {
  name: "Maca",       // display name
  handle: "@maca",
  initials: "MC",
  league: "Liga Asado del Domingo",
  totalMatches: 104,
  predicted: 12,
  remaining: 92,
  points: 42,
  position: 6,
  totalPlayers: 9,
  pointsToNext: 4,    // to climb one position
  pointsToLeader: 22,
  exact: 1,
};

// Points system
const SCORING = [
  { label: "Ganador o empate",   pts: "2 pts" },
  { label: "Goles del ganador",  pts: "2 pts" },
  { label: "Goles del perdedor", pts: "2 pts" },
  { label: "Marcador exacto empate", pts: "+4 pts", accent: true },
];

Object.assign(window, { TEAMS, GROUPS, FIXTURE, RANKING, USER, SCORING, byCode });
