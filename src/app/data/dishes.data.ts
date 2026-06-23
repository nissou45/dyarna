import { Dish } from '../models/dish.model';

export const DISHES: Record<string, Dish> = {
  'tajine-marrakchi': {
    id: 'tajine-marrakchi',
    name: 'Tajine Marrakchi',
    region: 'Marrakech-Safi',
    relatedCityNames: ['Marrakech', 'Essaouira', 'Agadir'],
    description:
      'Le tajine est le plat convivial par excellence au Maroc. Ce plat emblématique, cuit lentement dans un plat en terre cuite conique, tire son nom du récipient lui-même. La version marrakchie au poulet, citron confit et olives vertes est la plus célèbre, mais chaque famille garde jalousement sa propre recette transmise de génération en génération.',
    baseServings: 4,
    ingredients: [
      { id: 'tj-01', name: 'poulet fermier coupé en morceaux', amount: 1, unit: 'kg' },
      { id: 'tj-02', name: 'oignons moyens', amount: 2 },
      { id: 'tj-03', name: 'gousses d\'ail', amount: 4 },
      { id: 'tj-04', name: 'coriandre fraîche', amount: 1, unit: 'cup' },
      { id: 'tj-05', name: 'persil plat', amount: 1, unit: 'cup' },
      { id: 'tj-06', name: 'cure de citrons confits', amount: 2 },
      { id: 'tj-07', name: 'olives vertes dénoyautées', amount: 150, unit: 'g' },
      { id: 'tj-08', name: 'huile d\'olive', amount: 60, unit: 'ml' },
      { id: 'tj-09', name: 'safran en pistils', amount: 1, unit: 'pinch' },
      { id: 'tj-10', name: 'gingembre moulu', amount: 1, unit: 'tsp' },
      { id: 'tj-11', name: 'curcuma', amount: 1, unit: 'tsp' },
      { id: 'tj-12', name: 'sel', amount: 1, unit: 'tsp' },
      { id: 'tj-13', name: 'poivre noir', amount: 0.5, unit: 'tsp' },
      { id: 'tj-14', name: 'cannelle en bâton', amount: 1 },
    ],
    steps: [
      {
        id: 'tj-s1',
        title: 'Préparer la marinade',
        content:
          'Dans un grand saladier, mélangez l\'huile d\'olive avec le safran émietté, le gingembre, le curcuma, le sel et le poivre. Écrasez l\'ail et ajoutez-le. Hachez finement la coriandre et le persil, réservez-en une poignée pour la décoration, incorporez le reste à la marinade.',
      },
      {
        id: 'tj-s2',
        title: 'Mariner le poulet',
        content:
          'Enduisez les morceaux de poulet de marinade sur toutes les faces. Couvrez et laissez reposer au réfrigérateur au moins 2 heures (idéalement une nuit pour plus de saveurs).',
        timerSeconds: 7200,
      },
      {
        id: 'tj-s3',
        title: 'Dorer le poulet',
        content:
          'Dans un tajine ou une cocotte large, faites chauffer un filet d\'huile d\'olive à feu moyen. Saisissez les morceaux de poulet 3-4 minutes par face jusqu\'à ce qu\'ils soient dorés. Retirez et réservez.',
        timerSeconds: 480,
      },
      {
        id: 'tj-s4',
        title: 'Cuire les oignons',
        content:
          'Émincez les oignons finement et faites-les revenir dans la même cocotte 5 minutes à feu doux. Ajoutez le bâton de cannelle, les citrons confits coupés en quartiers, et les olives vertes.',
        timerSeconds: 300,
      },
      {
        id: 'tj-s5',
        title: 'Mijoter lentement',
        content:
          'Replacez le poulet dans la cocotte. Ajoutez 200 ml d\'eau tiède. Couvrez et laissez mijoter à feu très doux 1h15. Retournez les morceaux à mi-cuisson. Le tajine est prêt quand la chair se détache facilement de l\'os.',
        timerSeconds: 4500,
      },
      {
        id: 'tj-s6',
        title: 'Réduire la sauce',
        content:
          'Découvrez les 15 dernières minutes de cuisson pour permettre à la sauce de réduire légèrement et de napper les morceaux.',
        timerSeconds: 900,
      },
      {
        id: 'tj-s7',
        title: 'Dresser et servir',
        content:
          'Parsemez du mélange coriandre-persil réservé. Servez directement dans le tajine (ou la cocotte), accompagné de pain marocain pour saucer. Le tajine se mange traditionnellement en famille, chacun piochant dans le plat commun avec du pain.',
      },
    ],
    notes:
      'Pour un tajine d\'agneau aux pruneaux, remplacez le poulet par 800 g d\'épaule d\'agneau et ajoutez 200 g de pruneaux dénoyautés et 2 cuillères à soupe de graines de sésame grillées 30 minutes avant la fin de cuisson.',
    imageUrl: '',
    tags: ['cuisine', 'gastronomie', 'plat principal'],
  },

  'couscous': {
    id: 'couscous',
    name: 'Couscous',
    region: 'Fès-Meknès',
    relatedCityNames: ['Fès', 'Meknès', 'Marrakech', 'Tanger'],
    description:
      'Le couscous est le plat national du Maroc, héritage ancestral des Berbères. Chaque vendredi, les familles marocaines se réunissent autour de ce plat généreux. La semoule fine cuite à la vapeur est couronnée de légumes de saison et de viande confite. Le couscous royal, avec ses merguez et son poulet rôti, est le choix des grandes occasions.',
    baseServings: 6,
    ingredients: [
      { id: 'cs-01', name: 'semoule moyenne de blé dur', amount: 500, unit: 'g' },
      { id: 'cs-02', name: 'épaule d\'agneau en morceaux', amount: 600, unit: 'g' },
      { id: 'cs-03', name: 'poulet coupé en morceaux', amount: 400, unit: 'g' },
      { id: 'cs-04', name: 'merguez', amount: 6 },
      { id: 'cs-05', name: 'carottes', amount: 4 },
      { id: 'cs-06', name: 'courgettes', amount: 2 },
      { id: 'cs-07', name: 'navets', amount: 3 },
      { id: 'cs-08', name: 'tomates fraîches', amount: 3 },
      { id: 'cs-09', name: 'oignons', amount: 2 },
      { id: 'cs-10', name: 'pois chiches trempés la veille', amount: 200, unit: 'g' },
      { id: 'cs-11', name: 'cœur de chou blanc', amount: 0.25 },
      { id: 'cs-12', name: 'huile d\'olive', amount: 80, unit: 'ml' },
      { id: 'cs-13', name: 'beurre', amount: 50, unit: 'g' },
      { id: 'cs-14', name: 'ras el-hanout', amount: 2, unit: 'tbsp' },
      { id: 'cs-15', name: 'curcuma', amount: 1, unit: 'tsp' },
      { id: 'cs-16', name: 'gingembre moulu', amount: 1, unit: 'tsp' },
      { id: 'cs-17', name: 'safran', amount: 1, unit: 'pinch' },
      { id: 'cs-18', name: 'sel et poivre', amount: 1 },
    ],
    steps: [
      {
        id: 'cs-s1',
        title: 'Préparer la viande',
        content:
          'Dans un grand couscoussier, faites chauffer l\'huile d\'olive. Faites revenir l\'oignon émincé, puis ajoutez l\'agneau et le poulet. Faites dorer 5 minutes de chaque côté. Ajoutez le ras el-hanout, le curcuma, le gingembre, le safran, du sel et du poivre.',
        timerSeconds: 300,
      },
      {
        id: 'cs-s2',
        title: 'Démarrer la cuisson de la viande',
        content:
          'Couvrez la viande d\'eau (environ 1,5 l). Portez à ébullition, écumez, puis couvrez et laissez cuire 30 minutes à feu moyen.',
        timerSeconds: 1800,
      },
      {
        id: 'cs-s3',
        title: 'Préparer la semoule',
        content:
          'Pendant ce temps, versez la semoule dans un grand plat. Arrosez de 200 ml d\'eau froide salée et mélangez du bout des doigts pour faire gonfler les grains sans les agglomérer. Laissez reposer 10 minutes.',
        timerSeconds: 600,
      },
      {
        id: 'cs-s4',
        title: 'Première cuisson vapeur',
        content:
          'Placez la semoule dans le panier vapeur du couscoussier (sans tasser). Dès que la viande bout, installez le panier au-dessus du bouillon et cuisez 20 minutes.',
        timerSeconds: 1200,
      },
      {
        id: 'cs-s5',
        title: 'Égreiner et relâcher la semoule',
        content:
          'Versez la semoule dans le plat, égreinez à la fourchette en incorporant progressivement 200 ml d\'eau tiède salée. Laissez reposer 5 minutes, puis ajoutez le beurre en parcelles et mélangez.',
        timerSeconds: 300,
      },
      {
        id: 'cs-s6',
        title: 'Ajouter les légumes',
        content:
          'Coupez les carottes, courgettes, navets en tronçons, les tomates en quartiers, le chou en lanières. Ajoutez les pois chiches égouttés et les légumes dans le bouillon autour de la viande. Replacez le panier de semoule au-dessus et cuisez 30 minutes.',
        timerSeconds: 1800,
      },
      {
        id: 'cs-s7',
        title: 'Deuxième égrainage',
        content:
          'Versez à nouveau la semoule dans le plat, égreinez avec 100 ml d\'eau. Replacez dans le panier pour les 15 dernières minutes.',
        timerSeconds: 900,
      },
      {
        id: 'cs-s8',
        title: 'Griller les merguez',
        content:
          'Pendant ce temps, faites griller les merguez à la poêle 8-10 minutes, elles doivent être bien colorées.',
        timerSeconds: 600,
      },
      {
        id: 'cs-s9',
        title: 'Dressage',
        content:
          'Dressez la semoule en monticule sur un grand plat. Disposez la viande et les merguez au sommet, les légumes tout autour. Arrosez de quelques louches de bouillon. Servez le reste du bouillon en soupière à part.',
      },
    ],
    notes:
      'Le secret d\'un bon couscous est dans le triple égrainage : la semoule doit être légère et aérienne, jamais pâteuse. Le bouillon peut être relevé avec un peu de harissa selon les goûts.',
    imageUrl: '',
    tags: ['cuisine', 'gastronomie', 'plat principal'],
  },

  'pastilla': {
    id: 'pastilla',
    name: 'Pastilla',
    region: 'Fès-Meknès',
    relatedCityNames: ['Fès', 'Marrakech', 'Rabat', 'Essaouira'],
    description:
      'La pastilla est le joyau de la cuisine marocaine, un chef-d\'œuvre sucré-salé qui incarne tout le raffinement de l\'art culinaire marocain. Traditionnellement préparée au pigeon (aujourd\'hui souvent remplacé par du poulet), elle marie la tendreté de la viande confite aux amandes grillées, le tout enveloppé dans des feuilles de brick croustillantes saupoudrées de cannelle et de sucre glace.',
    baseServings: 8,
    ingredients: [
      { id: 'pa-01', name: 'pigeon (ou poulet)', amount: 1, unit: 'kg' },
      { id: 'pa-02', name: 'feuilles de brick', amount: 12 },
      { id: 'pa-03', name: 'amandes mondées', amount: 300, unit: 'g' },
      { id: 'pa-04', name: 'oignons moyens', amount: 4 },
      { id: 'pa-05', name: 'œufs', amount: 6 },
      { id: 'pa-06', name: 'persil plat', amount: 1, unit: 'cup' },
      { id: 'pa-07', name: 'coriandre fraîche', amount: 0.5, unit: 'cup' },
      { id: 'pa-08', name: 'cannelle moulue', amount: 3, unit: 'tbsp' },
      { id: 'pa-09', name: 'sucre glace', amount: 4, unit: 'tbsp' },
      { id: 'pa-10', name: 'gingembre moulu', amount: 1, unit: 'tsp' },
      { id: 'pa-11', name: 'safran', amount: 1, unit: 'pinch' },
      { id: 'pa-12', name: 'huile d\'olive', amount: 60, unit: 'ml' },
      { id: 'pa-13', name: 'beurre fondu', amount: 100, unit: 'g' },
      { id: 'pa-14', name: 'sel et poivre', amount: 1 },
    ],
    steps: [
      {
        id: 'pa-s1',
        title: 'Cuire la viande',
        content:
          'Coupez le poulet en morceaux. Dans une grande cocotte, faites revenir les oignons émincés dans l\'huile d\'olive 5 minutes. Ajoutez le poulet, le persil, la coriandre, 2 c. à soupe de cannelle, le gingembre, le safran, du sel et du poivre. Couvrez d\'eau à hauteur et cuisez 45 minutes à couvert.',
        timerSeconds: 2700,
      },
      {
        id: 'pa-s2',
        title: 'Griller les amandes',
        content:
          'Pendant la cuisson, faites griller les amandes dans une poêle sèche à feu moyen 5-6 minutes en remuant. Hachez-les grossièrement au couteau (pas au mixer, elles doivent rester croquantes). Mélangez avec 1 c. à soupe de cannelle et 2 c. à soupe de sucre glace.',
        timerSeconds: 360,
      },
      {
        id: 'pa-s3',
        title: 'Préparer la farce aux œufs',
        content:
          'Quand le poulet est cuit, retirez-le, désossez-le et effilochez la chair. Filtrez le bouillon de cuisson. Reversez le bouillon dans la cocotte, faites réduire à feu vif 5 minutes. Battez les œufs et versez-les en filet dans le bouillon frémissant en remuant sans arrêt jusqu\'à obtenir une crème épaisse.',
        timerSeconds: 600,
      },
      {
        id: 'pa-s4',
        title: 'Monter la pastilla',
        content:
          'Beurrez un moule rond de 30 cm. Disposez 6 feuilles de brick en éventail, en les superposant et en les laissant déborder. Étalez la moitié de la préparation aux œufs, puis le poulet effiloché, puis les amandes sucrées, et le reste d\'œufs. Rabattez les feuilles de brick par-dessus. Couvrez avec les 6 feuilles restantes, beurrez-les, et repliez les bords vers l\'intérieur.',
        timerSeconds: 600,
      },
      {
        id: 'pa-s5',
        title: 'Cuire la pastilla',
        content:
          'Enfournez à 180°C (chaleur tournante) pour 25-30 minutes, jusqu\'à ce que la pastilla soit bien dorée et croustillante. Démoulez délicatement.',
        timerSeconds: 1800,
      },
      {
        id: 'pa-s6',
        title: 'Décorer et servir',
        content:
          'Saupoudrez généreusement de cannelle et de sucre glace. Décorez de croisillons avec de la cannelle en poudre. Servez chaude ou tiède, en entrée ou en plat principal. La pastilla se marie parfaitement avec un thé à la menthe.',
      },
    ],
    notes:
      'La pastilla aux fruits de mer (crevettes, calamars, poisson) est une variante populaire des villes côtières comme Essaouira. Remplacez simplement la viande par 800 g de fruits de mer et omettez la cannelle et le sucre pour une version salée.',
    imageUrl: '',
    tags: ['cuisine', 'gastronomie', 'plat principal', 'fête'],
  },

  'harira': {
    id: 'harira',
    name: 'Harira',
    region: 'Fès-Meknès',
    relatedCityNames: ['Fès', 'Marrakech', 'Meknès', 'Rabat'],
    description:
      'La harira est bien plus qu\'une soupe : c\'est le plat du ramadan par excellence, celui qui attend chaque soir les familles marocaines après le coucher du soleil. Cette soupe riche et nourrissante aux tomates, lentilles, pois chiches et viande d\'agneau est servie avec des dattes, du chebakia et du pain. Chaque région, chaque famille a sa variante.',
    baseServings: 6,
    ingredients: [
      { id: 'ha-01', name: 'collier d\'agneau (ou bœuf)', amount: 300, unit: 'g' },
      { id: 'ha-02', name: 'tomates fraîches bien mûres', amount: 6 },
      { id: 'ha-03', name: 'concentré de tomate', amount: 2, unit: 'tbsp' },
      { id: 'ha-04', name: 'lentilles blondes', amount: 100, unit: 'g' },
      { id: 'ha-05', name: 'pois chiches cuits', amount: 200, unit: 'g' },
      { id: 'ha-06', name: 'oignons', amount: 2 },
      { id: 'ha-07', name: 'céleri branche', amount: 2 },
      { id: 'ha-08', name: 'coriandre fraîche', amount: 2, unit: 'cup' },
      { id: 'ha-09', name: 'persil plat', amount: 1, unit: 'cup' },
      { id: 'ha-10', name: 'farine', amount: 3, unit: 'tbsp' },
      { id: 'ha-11', name: 'huile d\'olive', amount: 50, unit: 'ml' },
      { id: 'ha-12', name: 'curcuma', amount: 1, unit: 'tbsp' },
      { id: 'ha-13', name: 'gingembre moulu', amount: 1, unit: 'tsp' },
      { id: 'ha-14', name: 'cannelle', amount: 0.5, unit: 'tsp' },
      { id: 'ha-15', name: 'safran', amount: 1, unit: 'pinch' },
      { id: 'ha-16', name: 'sel et poivre', amount: 1 },
      { id: 'ha-17', name: 'jus de citron', amount: 3, unit: 'tbsp' },
      { id: 'ha-18', name: 'vermicelle (optionnel)', amount: 50, unit: 'g' },
    ],
    steps: [
      {
        id: 'ha-s1',
        title: 'Préparer la base',
        content:
          'Coupez la viande en petits morceaux. Hachez finement l\'oignon, le céleri, la coriandre et le persil. Râpez les tomates et retirez la peau.',
      },
      {
        id: 'ha-s2',
        title: 'Cuire la viande et les légumes',
        content:
          'Dans une grande marmite, faites chauffer l\'huile d\'olive. Faites revenir l\'oignon et la viande 5 minutes. Ajoutez la coriandre, le persil, le céleri, le curcuma, le gingembre, la cannelle, le safran, du sel et du poivre. Mélangez 2 minutes.',
        timerSeconds: 300,
      },
      {
        id: 'ha-s3',
        title: 'Ajouter les tomates et les lentilles',
        content:
          'Ajoutez les tomates râpées, le concentré de tomate, les lentilles rincées et 1,5 l d\'eau. Portez à ébullition, couvrez et cuisez 45 minutes à feu moyen.',
        timerSeconds: 2700,
      },
      {
        id: 'ha-s4',
        title: 'Ajouter les pois chiches',
        content:
          'Ajoutez les pois chiches égouttés et poursuivez la cuisson 15 minutes.',
        timerSeconds: 900,
      },
      {
        id: 'ha-s5',
        title: 'Lier la soupe',
        content:
          'Dans un bol, délayez la farine dans 200 ml d\'eau froide en fouettant pour éviter les grumeaux. Versez en filet dans la soupe bouillonnante en remuant. La soupe doit épaissir légèrement. Laissez frémir 10 minutes.',
        timerSeconds: 600,
      },
      {
        id: 'ha-s6',
        title: 'Ajouter le vermicelle (optionnel)',
        content:
          'Si vous utilisez du vermicelle, ajoutez-le maintenant et cuisez 5 minutes.',
        timerSeconds: 300,
      },
      {
        id: 'ha-s7',
        title: 'Finaliser et servir',
        content:
          'Hors du feu, ajoutez le jus de citron. Rectifiez l\'assaisonnement. Servez très chaud dans des bols, accompagné de dattes, de chebakia et de pain marocain. Au Maroc, la harira est traditionnellement servie au crépuscule pendant le ramadan pour rompre le jeûne.',
      },
    ],
    notes:
      'Pour une version végétarienne, remplacez la viande par 2 carottes et 1 navet coupés en dés. La harira se conserve très bien au réfrigérateur 3 jours et se réchauffe parfaitement.',
    imageUrl: '',
    tags: ['cuisine', 'gastronomie', 'soupe', 'ramadan'],
  },

  'the-a-la-menthe': {
    id: 'the-a-la-menthe',
    name: 'Thé à la menthe',
    region: 'Maroc',
    relatedCityNames: ['Marrakech', 'Fès', 'Tanger', 'Chefchaouen'],
    description:
      'Le thé à la menthe est bien plus qu\'une boisson au Maroc : c\'est un rituel d\'hospitalité, un art de vivre. Offrir un thé à son invité est le premier geste d\'accueil dans toute maison marocaine. Préparé avec du thé vert Gunpowder, de la menthe fraîche et une généreuse quantité de sucre, il se verse de haut pour créer une mousse légère en surface — signe d\'un thé bien préparé.',
    baseServings: 6,
    ingredients: [
      { id: 'tm-01', name: 'thé vert Gunpowder', amount: 3, unit: 'tbsp' },
      { id: 'tm-02', name: 'bouquet de menthe fraîche', amount: 2 },
      { id: 'tm-03', name: 'sucre en pain (ou sucre semoule)', amount: 6, unit: 'tbsp' },
      { id: 'tm-04', name: 'eau bouillante', amount: 1, unit: 'l' },
    ],
    steps: [
      {
        id: 'tm-s1',
        title: 'Rincer le thé',
        content:
          'Mettez le thé vert dans une théière en métal (traditionnellement en argent ou en étain). Versez un peu d\'eau bouillante, juste assez pour couvrir le thé. Laissez infuser 30 secondes, puis jetez cette première eau de rinçage. Cela permet d\'ôter l\'amertume et d\'ouvrir les feuilles.',
        timerSeconds: 30,
      },
      {
        id: 'tm-s2',
        title: 'Première infusion',
        content:
          'Remplissez la théière d\'eau bouillante aux deux tiers. Ajoutez le sucre. Laissez infuser 3-4 minutes.',
        timerSeconds: 240,
      },
      {
        id: 'tm-s3',
        title: 'Ajouter la menthe',
        content:
          'Lavez et effeuillez la menthe (gardez quelques tiges pour la décoration). Ajoutez les feuilles dans la théière. Remettez un peu d\'eau bouillante pour compléter. Laissez infuser 2 minutes supplémentaires sans remuer.',
        timerSeconds: 120,
      },
      {
        id: 'tm-s4',
        title: 'Verser le thé en rituel',
        content:
          'Versez un premier verre de thé, puis reversez-le dans la théière pour mélanger. Servez ensuite en versant de haut (30-40 cm au-dessus du verre) pour créer une mousse — c\'est le signe d\'un thé de qualité. Remplissez chaque verre aux deux tiers.',
      },
      {
        id: 'tm-s5',
        title: 'Déguster',
        content:
          'Traditionnellement, on sert trois verres à chaque convive. Le premier est doux comme la vie, le deuxième fort comme l\'amour, le troisième amer comme la mort. Servez accompagné de dattes ou de pâtisseries marocaines.',
      },
    ],
    notes:
      'La proportion sucre/thé peut sembler excessive, mais c\'est essentiel à l\'équilibre de la boisson. Ajustez selon vos goûts. En été, le thé à la menthe se sert aussi glacé : préparez-le de la même façon, versez sur des glaçons et ajoutez quelques feuilles de menthe fraîche.',
    imageUrl: '',
    tags: ['cuisine', 'gastronomie', 'boisson', 'tradition'],
  },
};

export const DISH_IDS: string[] = Object.keys(DISHES);

export function getDishById(id: string): Dish | undefined {
  return DISHES[id];
}
