export const CONFEDERATIONS = [
  {
    id: 'CONCACAF',
    name: 'CONCACAF',
    fullName: 'Norte y Centroamerica',
    emoji: '🌎',
    teams: ['Mexico', 'Estados Unidos', 'Canada', 'Panama', 'Haiti', 'Curazao'],
  },
  {
    id: 'CONMEBOL',
    name: 'CONMEBOL',
    fullName: 'Sudamerica',
    emoji: '🌎',
    teams: ['Argentina', 'Brasil', 'Colombia', 'Ecuador', 'Paraguay', 'Uruguay'],
  },
  {
    id: 'UEFA',
    name: 'UEFA',
    fullName: 'Europa',
    emoji: '🌍',
    teams: [
      'Alemania', 'Austria', 'Belgica', 'Croacia', 'Escocia', 'Espana',
      'Francia', 'Inglaterra', 'Noruega', 'Paises Bajos', 'Portugal', 'Suiza',
    ],
  },
  {
    id: 'CAF',
    name: 'CAF',
    fullName: 'Africa',
    emoji: '🌍',
    teams: [
      'Argelia', 'Cabo Verde', 'Costa de Marfil', 'Egipto', 'Ghana',
      'Marruecos', 'Senegal', 'Sudafrica', 'Tunez',
    ],
  },
  {
    id: 'AFC',
    name: 'AFC',
    fullName: 'Asia',
    emoji: '🌏',
    teams: [
      'Arabia Saudita', 'Australia', 'Catar', 'Corea del Sur',
      'Iran', 'Japon', 'Jordania', 'Uzbekistan',
    ],
  },
  {
    id: 'OFC',
    name: 'OFC',
    fullName: 'Oceania',
    emoji: '🌏',
    teams: ['Nueva Zelanda'],
  },
  {
    id: 'PLAYOFF',
    name: 'REPECHAJE',
    fullName: 'Repechaje',
    emoji: '🏟️',
    teams: ['Bolivia', 'Irak', 'Italia', 'Jamaica', 'RD Congo', 'Turquia'],
  },
];

export const FLAGS = {
  // CONCACAF
  'Mexico': '🇲🇽',
  'Estados Unidos': '🇺🇸',
  'Canada': '🇨🇦',
  'Panama': '🇵🇦',
  'Haiti': '🇭🇹',
  'Curazao': '🇨🇼',
  // CONMEBOL
  'Argentina': '🇦🇷',
  'Brasil': '🇧🇷',
  'Colombia': '🇨🇴',
  'Ecuador': '🇪🇨',
  'Paraguay': '🇵🇾',
  'Uruguay': '🇺🇾',
  // UEFA
  'Alemania': '🇩🇪',
  'Austria': '🇦🇹',
  'Belgica': '🇧🇪',
  'Croacia': '🇭🇷',
  'Escocia': '🏴󠁧󠁢󠁳󠁣󠁴󠁿',
  'Espana': '🇪🇸',
  'Francia': '🇫🇷',
  'Inglaterra': '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
  'Noruega': '🇳🇴',
  'Paises Bajos': '🇳🇱',
  'Portugal': '🇵🇹',
  'Suiza': '🇨🇭',
  // CAF
  'Argelia': '🇩🇿',
  'Cabo Verde': '🇨🇻',
  'Costa de Marfil': '🇨🇮',
  'Egipto': '🇪🇬',
  'Ghana': '🇬🇭',
  'Marruecos': '🇲🇦',
  'Senegal': '🇸🇳',
  'Sudafrica': '🇿🇦',
  'Tunez': '🇹🇳',
  // AFC
  'Arabia Saudita': '🇸🇦',
  'Australia': '🇦🇺',
  'Catar': '🇶🇦',
  'Corea del Sur': '🇰🇷',
  'Iran': '🇮🇷',
  'Japon': '🇯🇵',
  'Jordania': '🇯🇴',
  'Uzbekistan': '🇺🇿',
  // OFC
  'Nueva Zelanda': '🇳🇿',
  // Repechaje
  'Bolivia': '🇧🇴',
  'Irak': '🇮🇶',
  'Italia': '🇮🇹',
  'Jamaica': '🇯🇲',
  'RD Congo': '🇨🇩',
  'Turquia': '🇹🇷',
};

export function getFlag(equipo) {
  return FLAGS[equipo] || '🏳️';
}
