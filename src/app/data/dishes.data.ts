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

  'rfissa': {
    id: 'rfissa',
    name: 'Rfissa',
    region: 'Rabat-Salé-Kénitra',
    relatedCityNames: ['Rabat', 'Fès', 'Meknès'],
    description:
      'La rfissa est le plat de fête par excellence au Maroc, servi traditionnellement après l\'accouchement pour aider la jeune maman à récupérer. Ce plat généreux associe des morceaux de poulet mijotés dans un bouillon parfumé au ras el hanout, posés sur un lit de msemen (crêpes feuilletées marocaines) émiettées et de lentilles. Un plat réconfortant à la saveur incomparable.',
    baseServings: 6,
    ingredients: [
      { id: 'rf-01', name: 'poulet fermier coupé en morceaux', amount: 1.5, unit: 'kg' },
      { id: 'rf-02', name: 'msemen (crêpes feuilletées) ou feuilles de dioul', amount: 6 },
      { id: 'rf-03', name: 'lentilles vertes', amount: 200, unit: 'g' },
      { id: 'rf-04', name: 'oignons', amount: 2 },
      { id: 'rf-05', name: 'ras el hanout', amount: 2, unit: 'tbsp' },
      { id: 'rf-06', name: 'fenugrec (helba)', amount: 1, unit: 'tbsp' },
      { id: 'rf-07', name: 'gingembre moulu', amount: 1, unit: 'tsp' },
      { id: 'rf-08', name: 'safran', amount: 1, unit: 'pinch' },
      { id: 'rf-09', name: 'curcuma', amount: 1, unit: 'tsp' },
      { id: 'rf-10', name: 'coriandre fraîche', amount: 1, unit: 'cup' },
      { id: 'rf-11', name: 'huile d\'olive', amount: 60, unit: 'ml' },
      { id: 'rf-12', name: 'sel et poivre', amount: 1, unit: 'tsp' },
    ],
    steps: [
      {
        id: 'rf-s1',
        title: 'Cuire les lentilles',
        content: 'Rincez les lentilles et faites-les cuire dans de l\'eau salée 20 minutes jusqu\'à ce qu\'elles soient tendres mais encore entières. Égouttez et réservez.',
        timerSeconds: 1200,
      },
      {
        id: 'rf-s2',
        title: 'Préparer le bouillon de poulet',
        content: 'Dans une grande cocotte, faites revenir les oignons émincés dans l\'huile d\'olive 5 minutes. Ajoutez le poulet, le ras el hanout, le fenugrec, le gingembre, le safran et le curcuma. Couvrez d\'eau (environ 1,5 l) et portez à ébullition.',
        timerSeconds: 300,
      },
      {
        id: 'rf-s3',
        title: 'Mijoter le poulet',
        content: 'Réduisez le feu, ajoutez la moitié de la coriandre et laissez mijoter à couvert 45 minutes. Le poulet doit être très tendre et le bouillon parfumé. Ajoutez les lentilles cuites dans le bouillon les 10 dernières minutes.',
        timerSeconds: 2700,
      },
      {
        id: 'rf-s4',
        title: 'Préparer le lit de msemen',
        content: 'Déchirez les msemen en morceaux de 3-4 cm et disposez-les dans un grand plat creux. Arrosez-les généreusement de bouillon chaud pour les ramollir et leur permettre d\'absorber les saveurs. Étalez les lentilles par-dessus.',
      },
      {
        id: 'rf-s5',
        title: 'Dresser et servir',
        content: 'Posez les morceaux de poulet sur le lit de msemen et lentilles. Nappez du reste de bouillon. Parsemez de coriandre fraîche ciselée. Servez immédiatement dans le plat de service traditionnel.',
      },
    ],
    notes: 'Le fenugrec (helba) est l\'épice signature de ce plat — ne le supprimez pas, il donne cette saveur légèrement amère caractéristique. Si vous ne trouvez pas de msemen, des crêpes épaisses légèrement grillées peuvent faire l\'affaire.',
    imageUrl: '',
    tags: ['cuisine', 'gastronomie', 'plat principal', 'fête'],
  },

  'mechoui': {
    id: 'mechoui',
    name: 'Méchoui',
    region: 'Marrakech-Safi',
    relatedCityNames: ['Marrakech', 'Ouarzazate', 'Merzouga', 'Zagora'],
    description:
      'Le méchoui est l\'agneau rôti à la broche, symbole de la fête et de l\'hospitalité berbère. Entier ou en épaule, l\'agneau est enduit d\'un mélange de beurre ras el hanout et cuit lentement pendant 4 à 5 heures dans un four traditionnel (tanour) ou sur braise. La chair se détache à la main, croustillante dehors et fondante dedans. Incontournable lors des grandes fêtes comme l\'Aïd el-Kébir.',
    baseServings: 8,
    ingredients: [
      { id: 'mc-01', name: 'épaule d\'agneau entière', amount: 2.5, unit: 'kg' },
      { id: 'mc-02', name: 'beurre mou', amount: 150, unit: 'g' },
      { id: 'mc-03', name: 'ras el hanout', amount: 2, unit: 'tbsp' },
      { id: 'mc-04', name: 'cumin moulu', amount: 1, unit: 'tbsp' },
      { id: 'mc-05', name: 'paprika doux', amount: 1, unit: 'tbsp' },
      { id: 'mc-06', name: 'gousses d\'ail', amount: 6 },
      { id: 'mc-07', name: 'coriandre fraîche', amount: 1, unit: 'cup' },
      { id: 'mc-08', name: 'sel', amount: 2, unit: 'tsp' },
      { id: 'mc-09', name: 'poivre noir', amount: 1, unit: 'tsp' },
      { id: 'mc-10', name: 'jus de citron', amount: 60, unit: 'ml' },
    ],
    steps: [
      {
        id: 'mc-s1',
        title: 'Préparer le chermoula',
        content: 'Écrasez l\'ail en pâte. Mélangez le beurre mou avec l\'ail, le ras el hanout, le cumin, le paprika, la coriandre ciselée, le sel et le poivre. Ajoutez le jus de citron. Travaillez jusqu\'à obtenir une pâte homogène.',
      },
      {
        id: 'mc-s2',
        title: 'Mariner l\'agneau',
        content: 'Incisez profondément la viande en plusieurs endroits avec un couteau pointu. Massez l\'épaule entière avec les deux tiers de la chermoula en insistant dans les incisions. Glissez des morceaux de beurre aux épices dans chaque fente. Enveloppez de film et réfrigérez une nuit minimum.',
        timerSeconds: 28800,
      },
      {
        id: 'mc-s3',
        title: 'Cuisson lente',
        content: 'Préchauffez le four à 160°C. Posez l\'épaule dans un grand plat, enveloppez de papier aluminium hermétiquement. Enfournez pour 4 heures. La cuisson lente est essentielle : c\'est elle qui rend la chair fondante.',
        timerSeconds: 14400,
      },
      {
        id: 'mc-s4',
        title: 'Rôtissage final',
        content: 'Retirez l\'aluminium, montez le four à 220°C. Badigeonnez avec le reste de chermoula et poursuivez 25-30 minutes jusqu\'à ce que la peau soit dorée et croustillante.',
        timerSeconds: 1800,
      },
      {
        id: 'mc-s5',
        title: 'Servir à la main',
        content: 'Posez le méchoui sur un grand plat. Servez avec du cumin salé et du pain marocain. Traditionnellement on mange le méchoui avec les mains, en arrachant la chair — c\'est le geste convivial qui fait toute la magie du plat.',
      },
    ],
    notes: 'Pour un vrai méchoui berbère, la cuisson dans un tanour (four en argile) est incomparable. À défaut, un barbecue couvert avec couvercle pendant 3h donne d\'excellents résultats. Le secret : jamais de feu vif, toujours une cuisson douce et longue.',
    imageUrl: '',
    tags: ['cuisine', 'gastronomie', 'plat principal', 'fête'],
  },

  'sardines-essaouira': {
    id: 'sardines-essaouira',
    name: 'Sardines grillées d\'Essaouira',
    region: 'Marrakech-Safi',
    relatedCityNames: ['Essaouira', 'Agadir', 'Tanger', 'Al Hoceïma'],
    description:
      'Essaouira est la capitale de la sardine au Maroc. Pêchées le matin, grillées au charbon de bois le midi sur le port, les sardines d\'Essaouira sont un incontournable. Marinées au chermoula (coriandre, cumin, paprika, ail, citron), elles grillent sur braise et se mangent avec du pain marocain chaud. Simple, populaire, inoubliable.',
    baseServings: 4,
    ingredients: [
      { id: 'se-01', name: 'sardines fraîches vidées et écaillées', amount: 1, unit: 'kg' },
      { id: 'se-02', name: 'coriandre fraîche ciselée', amount: 1, unit: 'cup' },
      { id: 'se-03', name: 'persil plat ciselé', amount: 0.5, unit: 'cup' },
      { id: 'se-04', name: 'gousses d\'ail', amount: 4 },
      { id: 'se-05', name: 'cumin moulu', amount: 1, unit: 'tsp' },
      { id: 'se-06', name: 'paprika doux', amount: 1, unit: 'tsp' },
      { id: 'se-07', name: 'piment doux', amount: 0.5, unit: 'tsp' },
      { id: 'se-08', name: 'jus de citron', amount: 2 },
      { id: 'se-09', name: 'huile d\'olive', amount: 60, unit: 'ml' },
      { id: 'se-10', name: 'sel', amount: 1, unit: 'tsp' },
    ],
    steps: [
      {
        id: 'se-s1',
        title: 'Préparer le chermoula',
        content: 'Écrasez l\'ail finement. Mélangez la coriandre, le persil, l\'ail, le cumin, le paprika, le piment, le jus de citron, l\'huile d\'olive et le sel. Fouettez jusqu\'à obtenir une marinade homogène et parfumée.',
      },
      {
        id: 'se-s2',
        title: 'Mariner les sardines',
        content: 'Incisez chaque sardine de 2 à 3 entailles en diagonale des deux côtés. Plongez-les dans le chermoula et massez bien pour faire pénétrer les épices dans les entailles. Laissez mariner 30 minutes minimum.',
        timerSeconds: 1800,
      },
      {
        id: 'se-s3',
        title: 'Griller sur braise',
        content: 'Préparez un barbecue avec des braises bien rouges (pas de flammes vives). Huilez légèrement la grille. Posez les sardines et faites griller 3-4 minutes de chaque côté. Elles doivent être bien dorées avec des marques de grille.',
        timerSeconds: 480,
      },
      {
        id: 'se-s4',
        title: 'Servir avec les accompagnements',
        content: 'Servez immédiatement avec du pain marocain chaud, des quartiers de citron et une salade de tomates-concombres au cumin. Sur le port d\'Essaouira, on les mange debout, avec les doigts, dans le vent de l\'Atlantique.',
      },
    ],
    notes: 'La fraîcheur des sardines est absolument cruciale : une sardine fraîche a l\'œil brillant, les écailles adhérentes et ne sent pas fort. Sur les marchés marocains, elles arrivent tôt le matin. En été, les sardines du Maroc atlantique sont particulièrement grasses et savoureuses.',
    imageUrl: '',
    tags: ['cuisine', 'gastronomie', 'poisson', 'mer'],
  },

  'amlou': {
    id: 'amlou',
    name: 'Amlou',
    region: 'Souss-Massa',
    relatedCityNames: ['Agadir', 'Essaouira', 'Taroudant'],
    description:
      'L\'amlou est le trésor gourmand du Souss. Cette pâte à tartiner berbère, préparée à base d\'amandes torréfiées, d\'huile d\'argan et de miel, est le petit-déjeuner royal de la région d\'Agadir. Épaisse et généreuse, elle se tartine sur du pain marocain ou des msemen. L\'argan, produit exclusivement au Maroc dans l\'arganeraie du Souss, lui donne un goût légèrement fumé et noisette totalement unique au monde.',
    baseServings: 4,
    ingredients: [
      { id: 'am-01', name: 'amandes entières émondées', amount: 200, unit: 'g' },
      { id: 'am-02', name: 'huile d\'argan culinaire', amount: 80, unit: 'ml' },
      { id: 'am-03', name: 'miel de thym du Souss', amount: 3, unit: 'tbsp' },
      { id: 'am-04', name: 'sel', amount: 1, unit: 'pinch' },
    ],
    steps: [
      {
        id: 'am-s1',
        title: 'Torréfier les amandes',
        content: 'Préchauffez le four à 170°C. Étalez les amandes sur une plaque et faites-les torréfier 12-15 minutes en remuant à mi-cuisson. Elles doivent être dorées et dégager un arôme de noisette. Laissez tiédir.',
        timerSeconds: 900,
      },
      {
        id: 'am-s2',
        title: 'Mixer en pâte',
        content: 'Versez les amandes tiédies dans un mixeur puissant. Mixez 3-4 minutes en raclant les parois régulièrement jusqu\'à obtenir une pâte lisse. Les amandes vont d\'abord former une farine, puis une pâte grâce à leur huile naturelle. Soyez patient.',
        timerSeconds: 240,
      },
      {
        id: 'am-s3',
        title: 'Incorporer l\'argan et le miel',
        content: 'Ajoutez l\'huile d\'argan en filet tout en mixant, puis le miel et la pincée de sel. Mixez encore 1 minute. La texture doit être onctueuse mais avec un peu de grain — ni trop lisse ni trop épaisse. Goûtez et ajustez le miel selon votre préférence.',
        timerSeconds: 60,
      },
      {
        id: 'am-s4',
        title: 'Conserver et servir',
        content: 'Versez dans un bocal en verre. L\'amlou se conserve 2-3 semaines à température ambiante. Servez au petit-déjeuner avec du pain marocain chaud (khobz) ou des msemen. Au Souss, on le pose au centre de la table dans un petit bol en terre cuite.',
      },
    ],
    notes: 'L\'huile d\'argan culinaire (dorée, légèrement torréfiée) est différente de l\'huile d\'argan cosmétique (inodore). Assurez-vous d\'utiliser la version alimentaire. Le miel de thym du Souss est idéal mais tout miel de qualité convient. Variante : remplacez 50 g d\'amandes par des cacahuètes grillées pour une version plus douce.',
    imageUrl: '',
    tags: ['cuisine', 'gastronomie', 'petit-déjeuner', 'berbère'],
  },

  'briouates': {
    id: 'briouates',
    name: 'Briouates',
    region: 'Fès-Meknès',
    relatedCityNames: ['Fès', 'Meknès', 'Rabat', 'Tanger'],
    description:
      'Les briouates sont les feuilletés marocains par excellence : de petits triangles ou rouleaux de feuilles de brick croustillantes farcis de kefta épicée, de fromage aux fines herbes, de crevettes ou de poulet aux amandes. Servis en entrée ou en amuse-bouche lors des fêtes, ils sont frits à l\'huile d\'olive jusqu\'à être parfaitement dorés. La version sucrée au miel est la plus festive.',
    baseServings: 6,
    ingredients: [
      { id: 'br-01', name: 'feuilles de brick', amount: 12 },
      { id: 'br-02', name: 'viande hachée d\'agneau', amount: 400, unit: 'g' },
      { id: 'br-03', name: 'oignon finement haché', amount: 1 },
      { id: 'br-04', name: 'coriandre fraîche ciselée', amount: 0.5, unit: 'cup' },
      { id: 'br-05', name: 'persil plat ciselé', amount: 0.5, unit: 'cup' },
      { id: 'br-06', name: 'œufs', amount: 2 },
      { id: 'br-07', name: 'ras el hanout', amount: 1, unit: 'tsp' },
      { id: 'br-08', name: 'cannelle moulue', amount: 0.5, unit: 'tsp' },
      { id: 'br-09', name: 'gingembre moulu', amount: 0.5, unit: 'tsp' },
      { id: 'br-10', name: 'sel et poivre', amount: 1, unit: 'tsp' },
      { id: 'br-11', name: 'huile pour friture', amount: 500, unit: 'ml' },
      { id: 'br-12', name: 'miel (pour les sucrées)', amount: 3, unit: 'tbsp' },
    ],
    steps: [
      {
        id: 'br-s1',
        title: 'Préparer la farce',
        content: 'Faites revenir l\'oignon dans un filet d\'huile 3 minutes. Ajoutez la viande hachée et faites cuire en émiettant avec une fourchette 8 minutes. Incorporez le ras el hanout, la cannelle, le gingembre, sel et poivre. Hors du feu, ajoutez la coriandre, le persil et les œufs battus. Mélangez bien et laissez refroidir.',
        timerSeconds: 660,
      },
      {
        id: 'br-s2',
        title: 'Former les triangles',
        content: 'Coupez chaque feuille de brick en deux. Posez une demi-feuille, déposez une cuillère à soupe de farce à une extrémité. Pliez en triangle en rabattant les coins : gauche sur la farce, puis continuez à plier en triangle jusqu\'au bout. Collez avec un peu d\'eau.',
      },
      {
        id: 'br-s3',
        title: 'Frire les briouates',
        content: 'Chauffez l\'huile à 175°C. Plongez les briouates par fournées de 4-5 et faites-les frire 2-3 minutes de chaque côté jusqu\'à ce qu\'ils soient bien dorés et croustillants. Égouttez sur du papier absorbant.',
        timerSeconds: 300,
      },
      {
        id: 'br-s4',
        title: 'Version festive au miel',
        content: 'Pour la version sucrée-salée typique des mariages et fêtes : trempez chaque briouate encore chaud dans le miel tiédi pendant 10 secondes. L\'enrobage de miel caramélise légèrement au contact de la chaleur. Saupoudrez de graines de sésame dorées.',
      },
    ],
    notes: 'Les briouates se préparent très bien à l\'avance : formez-les, congelez-les crus sur une plaque, puis transférez dans un sachet. Frissez-les directement congelés (ajoutez 1-2 minutes). Variante végétarienne : remplacez la viande par du fromage kiri + herbes + citron confit.',
    imageUrl: '',
    tags: ['cuisine', 'gastronomie', 'entrée', 'fête'],
  },
};

export const DISH_IDS: string[] = Object.keys(DISHES);

export function getDishById(id: string): Dish | undefined {
  return DISHES[id];
}
