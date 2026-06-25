import { FaceSnap } from '../models/snap.model';

// ── Snaps statiques ───────────────────────────────────────────────────────────

export const INITIAL_FACE_SNAPS: FaceSnap[] = [
  // ── VILLES IMPÉRIALES ──
  new FaceSnap(
    'Marrakech',
    'La Ville Rouge, joyau du sud marocain. Sa médina classée à l\'UNESCO, la place Jemaa el-Fnaa qui s\'anime à la nuit tombée, ses palais cachés et ses jardins secrets. Entre traditions et modernité, Marrakech est le cœur battant du Maroc touristique.',
    'https://upload.wikimedia.org/wikipedia/commons/e/e8/Koutoubia_minaret_in_Marrakech%2C_Morocco.jpg',
    new Date('2024-01-15'), 2450, 'marrakech',
  ),
  new FaceSnap(
    'Fès',
    'La capitale spirituelle du Maroc. Fès abrite la plus vieille université du monde (Al Quaraouiyine) et sa médina, la plus grande zone piétonne au monde. Perdez-vous dans les 9000 ruelles de Fès el-Bali, entre tanneries millénaires, souks et mosquées.',
    'https://upload.wikimedia.org/wikipedia/commons/e/ef/Fes_medina_walls_DSCF3737.jpg',
    new Date('2024-02-20'), 1890, 'fes',
  ),
  new FaceSnap(
    'Meknès',
    'La ville aux 40 portes, surnommée le Versailles marocain. Fondée par Moulay Ismail, elle impressionne par ses remparts monumentaux, sa porte Bab Mansour et ses greniers royaux. Une ville impériale souvent méconnue mais fascinante.',
    'https://upload.wikimedia.org/wikipedia/commons/0/06/Meknes-medina-aerial-view.jpg',
    new Date('2024-03-10'), 890, 'meknes',
  ),
  new FaceSnap(
    'Rabat',
    'La capitale moderne du Royaume. Rabat allie patrimoine historique (Tour Hassan, nécropole du Chellah) et vie moderne animée. Ses quartiers branchés de l\'Agdal et ses plages de l\'océan Atlantique en font une ville où il fait bon vivre.',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/Morocco_-_Rabat_%2831387775324%29.jpg/960px-Morocco_-_Rabat_%2831387775324%29.jpg',
    new Date('2024-04-05'), 1200, 'rabat',
  ),

  // ── VILLES CÔTIÈRES ──
  new FaceSnap(
    'Essaouira',
    'L\'ancienne Mogador, cité des vents. Ses remparts portugais, sa médina bleue et blanche, son port de pêche animé et ses plages de surf en font la station balnéaire préférée des artistes et des amateurs de kitesurf.',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/Morocco_-_Essaouira_Part_2_%2831679848385%29.jpg/960px-Morocco_-_Essaouira_Part_2_%2831679848385%29.jpg',
    new Date('2024-05-12'), 1560, 'essaouira',
  ),
  new FaceSnap(
    'Tanger',
    'La porte de l\'Afrique, où la Méditerranée rencontre l\'Atlantique. Tanger a inspiré des artistes du monde entier : Delacroix, Matisse, les Beatniks. Sa médina perchée, ses cafés aux terrasses légendaires et son coucher de soleil sur le détroit.',
    'https://upload.wikimedia.org/wikipedia/commons/1/1f/Cap_Spartel_%2C_Tangier_Morocco.jpg',
    new Date('2024-06-18'), 1780, 'tanger',
  ),
  new FaceSnap(
    'Agadir',
    'La station balnéaire par excellence. Détruite par le séisme de 1960, Agadir renaît de ses cendres avec une magnifique baie en arc de cercle, des plages de sable fin et une promenade animée. Point de départ idéal pour explorer le sud marocain.',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fb/South_view_sea_side_from_Kasbah_of_Agadir_Oufella.jpg/960px-South_view_sea_side_from_Kasbah_of_Agadir_Oufella.jpg',
    new Date('2024-07-22'), 1340, 'agadir',
  ),
  new FaceSnap(
    'Al Hoceïma',
    'La perle de la Méditerranée. Ses plages de sable blanc nichées entre falaises rouges, ses criques aux eaux cristallines et son parc national d\'Al Hoceïma en font un paradis pour les amoureux de nature et de plongée.',
    'https://upload.wikimedia.org/wikipedia/commons/c/c6/Al_Hoceima_Quemado.jpg',
    new Date('2024-08-14'), 670, 'al-hoceima',
  ),

  // ── VILLES DU NORD ──
  new FaceSnap(
    'Chefchaouen',
    'La perle bleue du Rif. Chefchaouen est célèbre pour sa médina peinte en bleu, ses ruelles pittoresques et son atmosphère paisible. Nichée dans les montagnes du Rif, c\'est l\'un des endroits les plus photogéniques du Maroc.',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/2/25/Chefchaouen_%2852189357475%29.jpg/960px-Chefchaouen_%2852189357475%29.jpg',
    new Date('2024-09-01'), 2340, 'chefchaouen',
  ),
  new FaceSnap(
    'Tétouan',
    'La colombe blanche. Sa médina blanche immaculée classée à l\'UNESCO, ses influences andalouses, son artisanat raffiné. Tétouan est un musée à ciel ouvert de l\'architecture hispano-mauresque.',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/View_of_Moulay_el_Mehdi_-_panoramio.jpg/960px-View_of_Moulay_el_Mehdi_-_panoramio.jpg',
    new Date('2024-09-15'), 780, 'tetouan',
  ),
  new FaceSnap(
    'Oujda',
    'La porte de l\'orient. Ville à la frontière algérienne, Oujda est un carrefour culturel unique. Sa médina animée, son université et sa proximité avec les plages de Saïdia en font une étape authentique.',
    'https://upload.wikimedia.org/wikipedia/commons/b/b1/Oujda_city.jpg',
    new Date('2024-10-01'), 560, 'oujda',
  ),

  // ── VILLES DU SUD ──
  new FaceSnap(
    'Ouarzazate',
    'La porte du désert. Ouarzazate est la capitale du cinéma marocain (Atlantis Studios). Ses kasbahs millénaires, dont la célèbre Kasbah Aït Ben Haddou classée à l\'UNESCO, ont servi de décor à Gladiator, Game of Thrones et Lawrence d\'Arabie.',
    'https://upload.wikimedia.org/wikipedia/commons/0/0f/Kasbah_Taourirt_in_Ouarzazate_2011.jpg',
    new Date('2024-10-20'), 1120, 'ouarzazate',
  ),
  new FaceSnap(
    'Zagora',
    'La porte du grand sud. Au bout de la route, le désert du Sahara commence ici. Le célèbre panneau "Tombouctou 52 jours" marque le départ des caravanes. Ses couchers de soleil sur les dunes de Tinfou sont inoubliables.',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fd/Extreme_Environments_-_Desert_and_dunes_outside_Zagora%2C_Morocco_%2833563949946%29.jpg/960px-Extreme_Environments_-_Desert_and_dunes_outside_Zagora%2C_Morocco_%2833563949946%29.jpg',
    new Date('2024-11-05'), 450, 'zagora',
  ),
  new FaceSnap(
    'Merzouga',
    'Les portes du Sahara. Merzouga est le point de départ pour explorer les majestueuses dunes de l\'Erg Chebbi. À dos de dromadaire ou en 4x4, vivez l\'expérience unique du désert marocain, ses nuits étoilées et ses levers de soleil féériques.',
    'https://upload.wikimedia.org/wikipedia/commons/f/fd/Desert_Merzouga_Morocco_groupe_kamels.jpg',
    new Date('2024-11-20'), 1890, 'merzouga',
  ),

  // ── CUISINE MAROCAINE ──
  new FaceSnap(
    'Tajine Marrakchi',
    'Le plat emblématique du Maroc. Poulet au citron confit et olives vertes, tajine d\'agneau aux pruneaux et amandes, tajine de kefta aux œufs… Chaque région a sa recette. Cuit lentement dans un plat en terre cuite, il révèle des saveurs uniques.',
    'https://upload.wikimedia.org/wikipedia/commons/6/6c/Moroccan_Tajin.jpg',
    new Date('2024-01-10'), 3200, 'tajine-marrakchi',
  ),
  new FaceSnap(
    'Couscous',
    'Le plat du vendredi, héritage berbère millénaire. Semoule fine cuite à la vapeur, accompagnée de légumes de saison, de viande (agneau, poulet) et de pois chiches. Le couscous royal, avec ses merguez et son poulet, est un festin à lui seul.',
    'https://upload.wikimedia.org/wikipedia/commons/f/f1/Couscous_in_Morocco.jpg',
    new Date('2024-02-15'), 2800, 'couscous',
  ),
  new FaceSnap(
    'Pastilla',
    'L\'art culinaire marocain dans toute sa splendeur. Tourte feuilletée sucrée-salée à base de pigeon (ou poulet), amandes grillées, cannelle et sucre glace. La pastilla aux fruits de mer est une variante tout aussi délicieuse des villes côtières.',
    'https://upload.wikimedia.org/wikipedia/commons/3/3a/Pastilla_marocaine_recouverte_de_sucre_glace.jpg',
    new Date('2024-03-20'), 2100, 'pastilla',
  ),
  new FaceSnap(
    'Harira',
    'La soupe traditionnelle du ramadan. Tomates, lentilles, pois chiches, viande d\'agneau, coriandre et épices. Servie avec des dattes et du chebakia (pâtisserie au miel), c\'est le repas de rupture du jeûne par excellence.',
    'https://upload.wikimedia.org/wikipedia/commons/6/67/Harira_fyldig_marrokansk_suppe.jpg',
    new Date('2024-04-25'), 1450, 'harira',
  ),
  new FaceSnap(
    'Thé à la menthe',
    'Bien plus qu\'une boisson, un rituel d\'hospitalité. Thé vert Gunpowder, menthe fraîche et sucre, versé de haut pour créer une mousse légère. On dit qu\'au Maroc, le premier verre est doux comme la vie, le deuxième fort comme l\'amour, le troisième amer comme la mort.',
    'https://upload.wikimedia.org/wikipedia/commons/3/38/Mint_tea%2C_Marrakesh.jpg',
    new Date('2024-01-05'), 4500, 'the-a-la-menthe',
  ),
  new FaceSnap(
    'Rfissa',
    'Le plat de fête par excellence, servi pour célébrer les naissances et les grandes occasions. Poulet mijoté au ras el hanout posé sur un lit de msemen émiettés et de lentilles parfumées au fenugrec. Un plat généreux à la saveur incomparable.',
    'https://upload.wikimedia.org/wikipedia/commons/5/5f/Rfissa_marocaine.jpg',
    new Date('2024-03-01'), 1100, 'rfissa',
  ),
  new FaceSnap(
    'Méchoui',
    'L\'agneau rôti à la broche, symbole de l\'hospitalité berbère. Entier ou en épaule, enduit de beurre aux épices, cuit 4 à 5 heures sur braise. La chair se détache à la main, croustillante dehors et fondante dedans. Incontournable à l\'Aïd el-Kébir.',
    'https://upload.wikimedia.org/wikipedia/commons/9/96/Mechoui.jpg',
    new Date('2024-04-01'), 1800, 'mechoui',
  ),
  new FaceSnap(
    'Sardines grillées d\'Essaouira',
    'Pêchées le matin, grillées au charbon de bois le midi sur le port. Marinées au chermoula (coriandre, cumin, paprika, ail, citron), elles grillent sur braise et se mangent avec du pain marocain chaud. Simple, populaire, inoubliable.',
    'https://upload.wikimedia.org/wikipedia/commons/b/b1/Sardines_-_%E9%B0%AF%28%E3%81%95%E3%82%93%E3%81%BE%29.jpg',
    new Date('2024-05-01'), 950, 'sardines-essaouira',
  ),
  new FaceSnap(
    'Amlou',
    'Le trésor gourmand du Souss. Cette pâte à tartiner berbère, préparée à base d\'amandes torréfiées, d\'huile d\'argan et de miel, est le petit-déjeuner royal d\'Agadir. L\'argan lui donne un goût légèrement fumé et noisette totalement unique au monde.',
    'https://upload.wikimedia.org/wikipedia/commons/c/c3/ArganAmlou_Oil_Mill.jpg',
    new Date('2024-06-01'), 720, 'amlou',
  ),
  new FaceSnap(
    'Briouates',
    'Les feuilletés marocains par excellence. Petits triangles de feuilles de brick croustillantes farcis de kefta épicée, dorés à l\'huile d\'olive. La version sucrée au miel est la plus festive, servie lors des mariages et grandes fêtes.',
    'https://upload.wikimedia.org/wikipedia/commons/7/72/Moroccan_food-02.jpg',
    new Date('2024-07-01'), 1350, 'briouates',
  ),

  // ── TRADITIONS ──
  new FaceSnap(
    'Moussem de Tan-Tan',
    'Le plus grand rassemblement nomade du Maroc. Chaque année, plus de 30 tribus du Sahara se réunissent pour célébrer leur culture : courses de dromadaires, musiques gnaoua, contes et artisanat. Classé patrimoine immatériel de l\'UNESCO.',
    'https://upload.wikimedia.org/wikipedia/commons/7/7d/Moroccan_Tbourida_or_Fantasia_in_the_Tan_Tan_Moussem.jpg',
    new Date('2024-06-15'), 890, 'moussem-tan-tan',
  ),
  new FaceSnap(
    'Hammam Marocain',
    'Un rituel de purification ancestral. Le hammam, c\'est l\'art de prendre soin de son corps : vapeur chaude, gommage au savon noir et à l\'huile d\'argan, massage. Un moment de détente et de convivialité qui rythme la vie des Marocains.',
    'https://upload.wikimedia.org/wikipedia/commons/7/76/Hammam_moulay_idris_DSCF5488_crop.jpg',
    new Date('2024-07-30'), 2340, 'hammam-marocain',
  ),
  new FaceSnap(
    'Artisanat du Zellige',
    'L\'art de la mosaïque marocaine. Les maâlems (maîtres artisans) découpent à la main des carreaux de terre cuite émaillée pour créer des motifs géométriques complexes. Une tradition vieille de 10 siècles qui orne les plus beaux palais et mosquées.',
    'https://upload.wikimedia.org/wikipedia/commons/3/3e/Moroccan_Zellij_fountain%2C_Meknes.jpg',
    new Date('2024-08-20'), 1670, 'artisanat-zellige',
  ),
  new FaceSnap(
    'Fantasia',
    'La charge des cavaliers berbères. Lors des fêtes traditionnelles (moussems), des cavaliers en tenue blanche chargent au galop en tirant au mousquet simultanément. Un spectacle impressionnant qui perpétue l\'art équestre ancestral du Maroc.',
    'https://upload.wikimedia.org/wikipedia/commons/f/fb/20170415_173734_Fantasia_Morocco.jpg',
    new Date('2024-09-10'), 780, 'fantasia',
  ),
];

// ── Régions des villes ────────────────────────────────────────────────────────

export const SNAP_LOCATIONS: Record<string, string> = {
  'Marrakech':   'Marrakech-Safi',
  'Fès':         'Fès-Meknès',
  'Meknès':      'Fès-Meknès',
  'Rabat':       'Rabat-Salé-Kénitra',
  'Essaouira':   'Marrakech-Safi',
  'Tanger':      'Tanger-Tétouan-Al Hoceïma',
  'Agadir':      'Souss-Massa',
  'Al Hoceïma':  'Tanger-Tétouan-Al Hoceïma',
  'Chefchaouen': 'Tanger-Tétouan-Al Hoceïma',
  'Tétouan':     'Tanger-Tétouan-Al Hoceïma',
  'Oujda':       'Oriental',
  'Ouarzazate':  'Drâa-Tafilalet',
  'Zagora':      'Drâa-Tafilalet',
  'Merzouga':    'Drâa-Tafilalet',
};

// ── Catégories (pour l'attribution des tags) ──────────────────────────────────

export const SNAP_CATEGORIES: Record<string, string[]> = {
  villes: [
    'Marrakech', 'Fès', 'Meknès', 'Rabat', 'Essaouira', 'Tanger', 'Agadir',
    'Al Hoceïma', 'Chefchaouen', 'Tétouan', 'Oujda', 'Ouarzazate', 'Zagora', 'Merzouga',
  ],
  cuisine: [
    'Tajine Marrakchi', 'Couscous', 'Pastilla', 'Harira', 'Thé à la menthe',
    'Rfissa', 'Méchoui', 'Sardines grillées d\'Essaouira', 'Amlou', 'Briouates',
  ],
  traditions: ['Moussem de Tan-Tan', 'Hammam Marocain', 'Artisanat du Zellige', 'Fantasia'],
};

// ── Tags spécifiques par ville ────────────────────────────────────────────────

export const VILLE_TAGS: Record<string, string[]> = {
  Marrakech:    ['medina', 'souk', 'patrimoine'],
  Fès:          ['medina', 'artisanat', 'patrimoine'],
  Meknès:       ['histoire', 'architecture'],
  Rabat:        ['moderne', 'histoire'],
  Essaouira:    ['mer', 'plage', 'artisanat'],
  Tanger:       ['mer', 'culture', 'moderne'],
  Agadir:       ['mer', 'plage', 'nature'],
  'Al Hoceïma': ['mer', 'plage', 'nature'],
  Chefchaouen:  ['montagne', 'nature'],
  Tétouan:      ['medina', 'architecture'],
  Oujda:        ['culture', 'histoire'],
  Ouarzazate:   ['desert', 'patrimoine'],
  Zagora:       ['desert', 'nature'],
  Merzouga:     ['desert', 'nature'],
};

// ── Relations ville ↔ cuisine / traditions / activités ───────────────────────

export type SnapRelations = { cuisine: string[]; traditions: string[]; activities: string[] };

export const SNAP_RELATED: Record<string, SnapRelations> = {
  Marrakech: {
    cuisine:    ['Tajine Marrakchi', 'Méchoui', 'Pastilla', 'Thé à la menthe', 'Briouates'],
    traditions: ['Hammam Marocain', 'Artisanat du Zellige', 'Fantasia'],
    activities: ['Merzouga', 'Ouarzazate'],
  },
  Fès: {
    cuisine:    ['Pastilla', 'Briouates', 'Rfissa', 'Harira', 'Couscous'],
    traditions: ['Artisanat du Zellige', 'Hammam Marocain'],
    activities: ['Meknès', 'Merzouga'],
  },
  Meknès: {
    cuisine:    ['Couscous', 'Rfissa', 'Briouates', 'Harira'],
    traditions: ['Fantasia', 'Artisanat du Zellige'],
    activities: ['Fès', 'Merzouga'],
  },
  Rabat: {
    cuisine:    ['Rfissa', 'Pastilla', 'Harira', 'Thé à la menthe'],
    traditions: ['Artisanat du Zellige'],
    activities: ['Tanger', 'Essaouira'],
  },
  Essaouira: {
    cuisine:    ['Sardines grillées d\'Essaouira', 'Tajine Marrakchi', 'Pastilla', 'Harira'],
    traditions: ['Hammam Marocain', 'Artisanat du Zellige'],
    activities: ['Marrakech', 'Agadir'],
  },
  Tanger: {
    cuisine:    ['Briouates', 'Sardines grillées d\'Essaouira', 'Thé à la menthe', 'Pastilla'],
    traditions: ['Hammam Marocain'],
    activities: ['Chefchaouen', 'Tétouan'],
  },
  Agadir: {
    cuisine:    ['Amlou', 'Sardines grillées d\'Essaouira', 'Tajine Marrakchi', 'Couscous'],
    traditions: ['Hammam Marocain'],
    activities: ['Essaouira', 'Merzouga'],
  },
  'Al Hoceïma': {
    cuisine:    ['Sardines grillées d\'Essaouira', 'Pastilla', 'Harira'],
    traditions: ['Fantasia'],
    activities: ['Chefchaouen', 'Tétouan'],
  },
  Chefchaouen: {
    cuisine:    ['Couscous', 'Thé à la menthe', 'Harira', 'Briouates'],
    traditions: ['Artisanat du Zellige', 'Hammam Marocain'],
    activities: ['Tanger', 'Tétouan'],
  },
  Tétouan: {
    cuisine:    ['Pastilla', 'Briouates', 'Sardines grillées d\'Essaouira', 'Couscous'],
    traditions: ['Artisanat du Zellige', 'Fantasia'],
    activities: ['Chefchaouen', 'Tanger'],
  },
  Oujda: {
    cuisine:    ['Couscous', 'Rfissa', 'Harira'],
    traditions: ['Fantasia', 'Moussem de Tan-Tan'],
    activities: ['Merzouga'],
  },
  Ouarzazate: {
    cuisine:    ['Méchoui', 'Tajine Marrakchi', 'Thé à la menthe'],
    traditions: ['Fantasia', 'Moussem de Tan-Tan'],
    activities: ['Merzouga', 'Zagora'],
  },
  Zagora: {
    cuisine:    ['Méchoui', 'Tajine Marrakchi', 'Thé à la menthe'],
    traditions: ['Moussem de Tan-Tan', 'Fantasia'],
    activities: ['Merzouga', 'Ouarzazate'],
  },
  Merzouga: {
    cuisine:    ['Méchoui', 'Tajine Marrakchi', 'Thé à la menthe', 'Couscous'],
    traditions: ['Moussem de Tan-Tan', 'Fantasia'],
    activities: ['Zagora', 'Ouarzazate'],
  },
};
