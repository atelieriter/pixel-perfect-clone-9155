// Mock data for VIGIL dashboard

export interface LaunchEvent {
  name: string;
  vehicle: string;
  pad: string;
  site: string;
  date: string;
  time: string;
  status: 'go' | 'tbd' | 'hold';
  modalKey: string;
}

export interface TimelineEvent {
  h: number;
  label: string;
  sub: string;
  type: 'launch' | 'conjunction' | 'reentry';
  key: string;
}

export interface ModalContent {
  title: string;
  intro: string;
}

export const LAUNCHES: LaunchEvent[] = [
  { name: 'Starlink 6-74', vehicle: 'Falcon 9 · LC-39A · KSC', pad: 'LC-39A', site: 'KSC', date: 'Today', time: '14:30 UTC', status: 'go', modalKey: 'tl-launch-f9b' },
  { name: 'SES-26', vehicle: 'Ariane 6 · ELA-4 · Kourou', pad: 'ELA-4', site: 'Kourou', date: 'Today', time: '21:15 UTC', status: 'go', modalKey: 'tl-launch-a6' },
  { name: 'Resurs-P5', vehicle: 'Soyuz-2.1b · Baikonur', pad: 'Site 31/6', site: 'Baikonur', date: 'Tomorrow', time: '03:45 UTC', status: 'tbd', modalKey: 'track-launch' },
  { name: 'Transporter-12', vehicle: 'Falcon 9 · SLC-4E · VAFB', pad: 'SLC-4E', site: 'VAFB', date: 'Mar 02', time: 'TBD', status: 'hold', modalKey: 'track-launch' },
];

export const TL_EVENTS: TimelineEvent[] = [
  { h: -8.5, label: 'Falcon 9', sub: 'Starlink 6-73 · LC-39A', type: 'launch', key: 'tl-launch-f9' },
  { h: -3.2, label: 'Conjunction', sub: 'ISS / Cosmos fragment', type: 'conjunction', key: 'tl-conj1' },
  { h: 1.75, label: 'Falcon 9', sub: 'Starlink 6-74 · T−1h45', type: 'launch', key: 'tl-launch-f9b' },
  { h: 5.4, label: 'Reentry', sub: 'CZ-3B R/B · Pacific', type: 'reentry', key: 'tl-reentry1' },
  { h: 9.1, label: 'Ariane 6', sub: 'SES-26 · Kourou', type: 'launch', key: 'tl-launch-a6' },
  { h: 14.3, label: 'Conjunction', sub: 'OneWeb-0418 / debris', type: 'conjunction', key: 'tl-conj2' },
];

export const MODAL_CONTENT: Record<string, ModalContent> = {
  'tl-launch-f9': { title: 'Falcon 9 · Starlink 6-73', intro: 'Lancement passé il y a ~8h30. Overlay de trajectoire sur la carte, détail du payload, altitude de dépose des satellites.' },
  'tl-launch-f9b': { title: 'Falcon 9 · Starlink 6-74', intro: 'Lancement dans ~1h45. Overlay trajectoire en temps réel, T-minus, fenêtre de lancement, lien vers le live SpaceX.' },
  'tl-conj1': { title: 'Conjunction · ISS / Cosmos fragment', intro: 'Rapprochement entre l\'ISS et un fragment de Cosmos 2251. Pc, distance minimale d\'approche, altitude, timestamp exact.' },
  'tl-conj2': { title: 'Conjunction · OneWeb-0418 / debris', intro: 'Rapprochement signalé entre un satellite OneWeb et un débris non manœuvrable. Pc 1:2400.' },
  'tl-reentry1': { title: 'Reentry · CZ-3B R/B', intro: 'Rentrée atmosphérique d\'un étage supérieur Long March 3B. Fenêtre prédite ±3h, zone d\'impact Pacifique.' },
  'tl-launch-a6': { title: 'Ariane 6 · SES-26', intro: 'Lancement dans ~9h. Détail du payload SES-26 (GEO, télécom), fenêtre de lancement.' },
  'track-launch': { title: 'Track a Launch', intro: 'Suivre un lancement spécifique — alertes avant lancement, overlay carte en temps réel.' },
  'iss-events': { title: 'ISS — Related Events', intro: 'Événements liés à l\'ISS dans les 72h : passages, amarrages, conjunctions.' },
  'kp-history': { title: 'Kp Index — Historique', intro: 'Courbe 72h, prévision à 48h, corrélation anomalies satellites.' },
  'launch-conditions': { title: 'Launch Conditions', intro: 'Décomposition : vent solaire, Bz, densité, Kp. Fenêtres optimales.' },
  'solar-xray': { title: 'X-Ray Flux', intro: 'Classification (A/B/C/M/X), impact sur les communications HF et GPS.' },
  'solar-wind': { title: 'Solar Wind Speed', intro: 'Tendance 24h, impact sur le freinage atmosphérique des satellites LEO.' },
  'solar-density': { title: 'Particle Density', intro: 'Densité protonique temps réel, impact sur les payloads sensibles aux radiations.' },
  'solar-bz': { title: 'Bz Field', intro: 'Composante sud du champ interplanétaire. Seuil de tempête géomagnétique.' },
  'solar-alert-detail': { title: 'Perturbation géomagnétique', intro: 'Origine, durée prévue, zones affectées, impact opérations satellites.' },
  'active-sats': { title: 'Active Satellites', intro: 'Répartition par pays, opérateur, altitude, usage.' },
  'tracked-objects': { title: 'Tracked Objects', intro: 'Payloads actifs, étages de fusée, débris catalogués.' },
  'debris': { title: 'Debris Catalog', intro: 'Carte de densité par altitude, origines des fragmentations.' },
  'flagged': { title: 'Flagged Events — Today', intro: 'Conjunctions Pc > seuil, manœuvres d\'évitement, objets en rentrée.' },
  'today-activity': { title: 'Today\'s Orbital Activity', intro: 'Feed des événements notables : conjunctions, manœuvres, anomalies.' },
  'search': { title: 'Search', intro: 'Recherche par satellite, constellation, NORAD ID. Filtres avancés.' },
};

// Land mass polygons (simplified)
export const LAND_POLYGONS = [
  [[-125,49],[-95,49],[-80,45],[-65,44],[-60,47],[-60,25],[-80,10],[-90,16],[-105,20],[-115,30],[-125,40]],
  [[-80,12],[-50,5],[-35,-5],[-35,-25],[-55,-35],[-68,-55],[-75,-50],[-80,-35],[-70,-10],[-75,5]],
  [[-10,36],[15,37],[30,36],[40,42],[38,52],[18,58],[0,51],[-5,44],[-10,38]],
  [[-18,16],[52,16],[52,-30],[18,-35],[0,5],[-18,16]],
  [[26,36],[55,22],[105,10],[120,20],[145,42],[140,55],[80,60],[40,38],[26,36]],
  [[114,-22],[154,-22],[154,-38],[136,-38],[114,-28]],
];

export const LAUNCH_SITES: [number, number][] = [
  [-80.6, 28.5],   // KSC
  [-52.8, 5.2],    // Kourou
  [63.3, 45.6],    // Baikonur
  [100.9, 27.5],   // Xichang
  [-120.6, 34.6],  // Vandenberg
];

// Generate constellation satellites
export function makeSats(n: number, latMax: number) {
  const arr: { lon0: number; lat: number; sp: number }[] = [];
  for (let i = 0; i < n; i++) {
    const t = i / n;
    arr.push({ lon0: t * 360 - 180, lat: Math.sin(t * Math.PI * 7) * latMax, sp: 0.003 + t * 0.002 });
  }
  return arr;
}
