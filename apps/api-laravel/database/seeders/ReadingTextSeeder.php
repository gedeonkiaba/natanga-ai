<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ReadingTextSeeder extends Seeder
{
    /**
     * Intérêts tournants, 5 textes par intérêt et par niveau (15 au total).
     */
    public const INTERESTS = ['animaux', 'espace', 'contes', 'dinosaures', 'nature', 'musique'];

    /**
     * Nœud pédagogique rattaché à chaque niveau de lecture : mots simples, phrases, textes.
     */
    public const NODE_BY_LEVEL = ['1' => 'n-mot-maman', '2' => 'n-phrase-1', '3' => 'n-textes-courts'];

    /**
     * Âge minimum par niveau de lecture.
     */
    public const AGE_MIN = ['1' => 6, '2' => 7, '3' => 8];

    /**
     * Durée indicative (minutes) par niveau de lecture.
     */
    public const DURATION = ['1' => 1, '2' => 2, '3' => 3];

    /**
     * Seeder idempotent : 90 leçons de lecture, 30 par niveau, réparties
     * sur les 6 centres d'intérêt (5 chacun, par niveau).
     */
    public function run(): void
    {
        foreach (array_keys(self::NODE_BY_LEVEL) as $level) {
            foreach ($this->texts($level) as $index => $entry) {
                $position = $index + 1;

                DB::table('lessons')->updateOrInsert(
                    ['id' => "text-l{$level}-{$position}"],
                    [
                        'node_id' => self::NODE_BY_LEVEL[$level],
                        'title' => $entry['title'],
                        'kind' => 'lecture',
                        'phonemes' => json_encode($entry['phonemes']),
                        'age_min' => self::AGE_MIN[$level],
                        'duration_min' => self::DURATION[$level],
                        'text' => $entry['text'],
                        'order' => $position,
                        'interest' => self::INTERESTS[$index % 6],
                        'reading_level' => $level,
                    ]
                );
            }
        }
    }

    /**
     * @return array<int, array{title: string, phonemes: array<int, string>, text: string}>
     */
    private function texts(string $level): array
    {
        return match ($level) {
            '1' => $this->levelOne(),
            '2' => $this->levelTwo(),
            default => $this->levelThree(),
        };
    }

    /**
     * Niveau 1 : phrases très courtes, 2 à 6 phrases par texte.
     *
     * @return array<int, array{title: string, phonemes: array<int, string>, text: string}>
     */
    private function levelOne(): array
    {
        return [
            [
                'title' => 'Le chat de Léa',
                'phonemes' => ['ch', 'ou', 'è'],
                'text' => 'Le chat de Léa dort au soleil. Il ronronne doucement. Léa lui caresse la tête. Le chat sourit et bâille.',
            ],
            [
                'title' => 'La grande fusée',
                'phonemes' => ['ou', 'é', 'an'],
                'text' => 'Une fusée attend sur le pas de tir. Léa compte jusqu\'à trois. Boum ! La fusée part vers les étoiles.',
            ],
            [
                'title' => 'La roue qui tourne',
                'phonemes' => ['ou', 'in', 'è'],
                'text' => 'Le petit vélo roule dans la cour. La roue droite tourne bien. La roue gauche tourne aussi. Il fait beau.',
            ],
            [
                'title' => 'Le lion dort',
                'phonemes' => ['ou', 'on', 'an'],
                'text' => 'Le gros lion dort sous un grand arbre. Il rêve de la savane. Une mouche lui chatouille le nez. Le lion roule et ronronne.',
            ],
            [
                'title' => 'Le loup sent la neige',
                'phonemes' => ['ou', 'in', 'è'],
                'text' => 'Le loup sent la neige. Il marche doucement sur la colline. Ses pattes font crac crac. La nuit tombe, il rentre au chaud.',
            ],
            [
                'title' => 'La ferme de Paul',
                'phonemes' => ['an', 'ou', 'in'],
                'text' => 'Paul va à la ferme. Il voit une poule et deux canards. La vache fait meuh. Paul donne du pain aux poules.',
            ],
            [
                'title' => 'Le train des dunes',
                'phonemes' => ['ou', 'in', 'an'],
                'text' => 'Le petit train roule le long de la mer. Il traverse les dunes et les pins. Les enfants saluent les mouettes. Chouette vue !',
            ],
            [
                'title' => 'Le dino qui tousse',
                'phonemes' => ['ou', 'in', 'on'],
                'text' => 'Le petit dinosaure tousse doucement. Il boit un jus de fruits. Sa queue remue de joie. Il se rendort sous la lampe.',
            ],
            [
                'title' => 'Le secret du chêne',
                'phonemes' => ['é', 'an', 'ou'],
                'text' => 'Sous le vieux chêne, une carte est cachée. Elle montre un chemin rouge. Léa et Paul suivent le chemin. Ils trouvent un trésor de noisettes.',
            ],
            [
                'title' => 'Le tam-tam de Nour',
                'phonemes' => ['ou', 'an', 'a'],
                'text' => 'Nour frappe son tam-tam tout doux. Un oiseau se pose et écoute. Puis un autre oiseau chante. Ensemble, ils font de la musique.',
            ],
            [
                'title' => 'Le renard roux',
                'phonemes' => ['ou', 'an', 'in'],
                'text' => 'Le petit renard roux joue dans les feuilles. Il saute et rit. Sa maman l\'appelle pour le dîner. Il rentre vite au terrier.',
            ],
            [
                'title' => 'La fusée bleue',
                'phonemes' => ['é', 'ou', 'in'],
                'text' => 'Dans la fusée bleue, tout luit. L\'équipage compte les étoiles. La Terre devient toute petite. Ils font coucou à la Lune.',
            ],
            [
                'title' => 'Le cartable de Marie',
                'phonemes' => ['ou', 'an', 'é'],
                'text' => 'Marie range son cartable. Elle met son livre et son crayon. Demain, elle lira à voix haute. Elle a hâte !',
            ],
            [
                'title' => 'Le mouton blanc',
                'phonemes' => ['ou', 'in', 'on'],
                'text' => 'Le mouton blanc broute dans le pré. Il bêle tout bas. Le ciel est bleu. Un agneau saute près de lui.',
            ],
            [
                'title' => 'Le buffet de bois',
                'phonemes' => ['ou', 'è', 'in'],
                'text' => 'Sur le buffet de bois, il y a trois pommes. Papa prend une pomme. Maman prend une pomme. Il en reste une pour Léa.',
            ],
            [
                'title' => 'Le chat perché',
                'phonemes' => ['ch', 'é', 'an'],
                'text' => 'Le chat est perché sur l\'armoire. Il regarde partout. On lui tend une corde. Il descend tout doucement.',
            ],
            [
                'title' => 'Le potager de Léa',
                'phonemes' => ['ou', 'in', 'è'],
                'text' => 'Léa arrose son potager. Les carottes sont vertes. Les radis sont rouges. Elle goûte un radis, il est fort !',
            ],
            [
                'title' => 'Le bricolage de Théo',
                'phonemes' => ['ou', 'an', 'é'],
                'text' => 'Théo dessine un bateau rouge. Il découpe un mât en carton. Son bateau tient debout. Il applaudit tout seul.',
            ],
            [
                'title' => 'L\'ourson qui joue',
                'phonemes' => ['ou', 'on', 'in'],
                'text' => 'L\'ourson roule dans la mousse. Il rit et bouscule les baies. Sa maman surveille la rivière. L\'ourson revient d\'un trot rapide.',
            ],
            [
                'title' => 'Le bonhomme de neige',
                'phonemes' => ['in', 'an', 'ou'],
                'text' => 'Un bonhomme de neige rit dans la cour. Il a un chapeau bleu. Sa carotte brille au soleil. La cloche sonne, on entre à l\'école.',
            ],
            [
                'title' => 'Le jardin des lucioles',
                'phonemes' => ['ou', 'in', 'é'],
                'text' => 'Le soir, des lucioles brillent au jardin. Elles font de petites lampes. Léa les compte : une, deux, trois. La nuit est douce.',
            ],
            [
                'title' => 'Le poisson curieux',
                'phonemes' => ['ou', 'in', 'an'],
                'text' => 'Le petit poisson nage près du pont. Il voit des pierres et des algues. Une bulle monte, puis une autre. Il suit les bulles en chantonnant.',
            ],
            [
                'title' => 'Le hamster gourmand',
                'phonemes' => ['an', 'ou', 'in'],
                'text' => 'Le hamster range une graine dans sa joue. Il court dans sa roue. Il boit une goutte d\'eau. Puis il fait la sieste.',
            ],
            [
                'title' => 'Le coq du matin',
                'phonemes' => ['ou', 'an', 'é'],
                'text' => 'Le coq chante le matin. La lumière entre par la fenêtre. Les poules se lèvent. Tout le monde s\'étire.',
            ],
            [
                'title' => 'La carte au trésor',
                'phonemes' => ['ou', 'an', 'é'],
                'text' => 'Sous le lit, une carte attend. Elle montre des cercles rouges. Paul et Léa suivent les cercles. Un cerf les salue au bout du chemin.',
            ],
            [
                'title' => 'Le cerf de la forêt',
                'phonemes' => ['è', 'in', 'ou'],
                'text' => 'Le cerf boit à la rivière. Ses grandes oreilles bougent. Un écureuil l\'observe. Le cerf remue sa queue et part en courant.',
            ],
            [
                'title' => 'Le toboggan d\'eau',
                'phonemes' => ['ou', 'in', 'an'],
                'text' => 'Le toboggan est mouillé et glissant. Léa descend en riant. Plouf ! Elle retombe dans l\'eau. Elle veut le refaire.',
            ],
            [
                'title' => 'Le hibou qui parle',
                'phonemes' => ['ou', 'in', 'è'],
                'text' => 'Le hibou attend la nuit sur sa branche. Il ouvre un grand œil. Il dit coucou à la Lune. La Lune sourit en retour.',
            ],
            [
                'title' => 'Le ballon rouge',
                'phonemes' => ['ou', 'an', 'in'],
                'text' => 'Le ballon rouge saute sur le mur. Paul le frappe doucement. Il roule dans l\'herbe. Les deux équipes crient victoire !',
            ],
            [
                'title' => 'La chenille verte',
                'phonemes' => ['an', 'ou', 'in'],
                'text' => 'La chenille verte marche sur la feuille. Elle mange un petit coin. Elle se repose, puis elle ronge encore. Bientôt, elle fera une surprise.',
            ],
        ];
    }

    /**
     * Niveau 2 : phrases simples, 3 à 5 phrases par texte.
     *
     * @return array<int, array{title: string, phonemes: array<int, string>, text: string}>
     */
    private function levelTwo(): array
    {
        return [
            [
                'title' => 'Le renard et la Lune',
                'phonemes' => ['ou', 'in', 'an'],
                'text' => 'Le petit renard roux sort de son terrier. Il lève la tête et voit la Lune. Il croit que c\'est une grosse poire lumineuse. Il aboie doucement, et la Lune ne répond pas. Alors il la suit des yeux jusqu\'au matin.',
            ],
            [
                'title' => 'Adama sur Mars',
                'phonemes' => ['an', 'a', 'é'],
                'text' => 'Adama est un astronaute courageux. Il atterrit sur Mars avec son robot Tito. Le sol est rouge et couvert de poussière. Il y trouve une petite pierre qui brille. Il la glisse dans sa poche pour la montrer aux enfants.',
            ],
            [
                'title' => 'Le chevalier timide',
                'phonemes' => ['ou', 'in', 'an'],
                'text' => 'Le chevalier Timidotte n\'aime pas les dragons. Un jour, il rencontre un petit dragon qui tremble. Le dragon a peur du noir, lui aussi. Ils allument une lanterne et marchent ensemble. Depuis, ils sont meilleurs amis.',
            ],
            [
                'title' => 'Le tricératops grognon',
                'phonemes' => ['ou', 'in', 'an'],
                'text' => 'Le tricératops est toujours de mauvaise humeur. Il grogne contre les feuilles et contre les fleurs. Un matin, il perd sa corne préférée dans la boue. Ses amis l\'aident à la retrouver. Alors il leur offre le plus beau ragoût de fougères.',
            ],
            [
                'title' => 'La rivière qui chante',
                'phonemes' => ['ou', 'in', 'an'],
                'text' => 'La rivière descend des montagnes en chantant. Elle glisse entre les pierres grises. Un canard noir s\'y baigne et la suit un long moment. Le soir, la rivière devient calme et reflète les étoiles. Elle promet de rechanter demain.',
            ],
            [
                'title' => 'Le tambour de Samba',
                'phonemes' => ['an', 'ou', 'am'],
                'text' => 'Samba rêve de jouer du tambour comme son grand-père. Il tape doucement au début, puis de plus en plus fort. Les poules de la cour dansent malgré elles. Samba rit et garde le rythme. Tout le village vient écouter sa chanson.',
            ],
            [
                'title' => 'Le chat et la baleine',
                'phonemes' => ['ch', 'ou', 'in'],
                'text' => 'Minou le chat n\'a jamais vu la mer. Un jour, une baleine bleue s\'approche du port. Elle crache un jet d\'eau qui mouille Minou de la tête aux pattes. La baleine lui offre un poisson d\'argent. Minou devient le chat le plus heureux du quai.',
            ],
            [
                'title' => 'Les étoiles filantes',
                'phonemes' => ['é', 'in', 'an'],
                'text' => 'Ce soir, les étoiles filantes traversent le ciel. Léa et Théo font un vœu très vite avant qu\'elles ne disparaissent. Léa veut un vélo rouge, Théo veut une table à dessin. Une dernière étoile brille plus longtemps que les autres. Les deux enfants sourient et rentrent se coucher.',
            ],
            [
                'title' => 'Le cheval de Paul',
                'phonemes' => ['ou', 'an', 'è'],
                'text' => 'Paul nourrit son cheval Faucon chaque matin. Faucon hennit en le voyant arriver. Il pose sa tête sur l\'épaule de Paul. Ensemble, ils font un tour de piste au pas. Paul lui parle tout bas pendant la promenade.',
            ],
            [
                'title' => 'Le secret des grenouilles',
                'phonemes' => ['ou', 'in', 'è'],
                'text' => 'Au bord de l\'étang, les grenouilles préparent une fête. Elles rangent les nénuphars et gonflent les bulles. La plus petite grenouille hésite à chanter. Ses amies lui font de la place. Elle ose, et sa voix résonne sur tout l\'étang.',
            ],
            [
                'title' => 'Le dinosaure peintre',
                'phonemes' => ['ou', 'in', 'an'],
                'text' => 'Bronto le dinosaure peint les rochers avec ses pattes. Il aime le jaune et le rouge. Un jour, il dessine un soleil énorme. Les autres dinosaures viennent se mettre à l\'ombre de son tableau. Bronto est fier de son œuvre.',
            ],
            [
                'title' => 'Le lac gelé',
                'phonemes' => ['ou', 'in', 'an'],
                'text' => 'L\'hiver a gelé le lac cette nuit. Les patineurs glissent en faisant des ronds. Un garçon trébuche et rit avec ses amis. Personne n\'a peur, le froid est joyeux. Au bord, un thermos de chocolat chaud attend tout le monde.',
            ],
            [
                'title' => 'Le faucon de la cathédrale',
                'phonemes' => ['ou', 'an', 'é'],
                'text' => 'Un faucon niche au sommet de la cathédrale. Il observe la place et les drapeaux. Les passants lèvent la tête pour le voir. L\'oiseau plonge d\'un coup et revient avec une plume. Il la laisse tomber au pied d\'un enfant.',
            ],
            [
                'title' => 'Le chant de la baleine',
                'phonemes' => ['ou', 'an', 'in'],
                'text' => 'Au fond de l\'océan, une baleine chante une longue mélodie. Les poissons s\'arrêtent pour écouter. Les tortues lèvent la tête vers la surface. Le chant traverse des kilomètres d\'eau bleue. Même les dauphins se mettent à danser.',
            ],
            [
                'title' => 'Le violon de Nour',
                'phonemes' => ['ou', 'in', 'an'],
                'text' => 'Nour accorde son violon avant le concert. Ses doigts tremblent un peu sur la première corde. Elle joue une berceante pour se calmer. Le public devient très silencieux. À la fin, toute la salle applaudit à qui mieux mieux.',
            ],
            [
                'title' => 'La piste des loups',
                'phonemes' => ['ou', 'in', 'an'],
                'text' => 'La meute de loups suit la piste dans la neige. Le chef marche devant, le museau en l\'air. Un loupiot glisse et se relève aussitôt. Ils trouvent un ravin rempli de vent. Le chef aboie doucement pour les guider autre part.',
            ],
            [
                'title' => 'Le jardin de pluie',
                'phonemes' => ['ou', 'in', 'è'],
                'text' => 'La pluie tombe doucement sur le jardin. Les limaces sortent de leurs abris. Les vers de terre remontent la terre molle. Léa ouvre son parapluie jaune et compte les gouttes. À la fin, un arc-en-ciel traverse la cour.',
            ],
            [
                'title' => 'Le vaisseau fantôme du professeur',
                'phonemes' => ['ou', 'in', 'an'],
                'text' => 'Le professeur Allain raconte l\'histoire d\'un vaisseau fantôme. Les enfants ont les yeux ronds. On entend le vent siffler dans la cour. Alors il allume une bougie et sourit. Ce n\'était que le vent, rassure-t-il tout le monde.',
            ],
            [
                'title' => 'L\'écureuil et la noix',
                'phonemes' => ['ou', 'in', 'an'],
                'text' => 'L\'écureuil Grimmy cache une noix sous la mousse. Il marque l\'endroit d\'un petit coup de patte. Un jour, il ne retrouve plus où il l\'a mise. Il part à la recherche avec son cousin. Ensemble, ils trouvent deux noix au lieu d\'une.',
            ],
            [
                'title' => 'Le concert des oiseaux',
                'phonemes' => ['ou', 'in', 'é'],
                'text' => 'Chaque matin, les oiseaux du parc donnent un concert. Le merle chante la première chanson. Le rouge-gorge répond avec un trille. Les moineaux battent la mesure sur les branches. Les passants s\'arrêtent pour écouter avant de partir travailler.',
            ],
            [
                'title' => 'Le chevalier dragon',
                'phonemes' => ['ou', 'an', 'è'],
                'text' => 'Le chevalier Roland n\'a jamais eu peur des dragons. Il rencontre pourtant un dragon tout jeune qui tousse. Roland lui prépare une tisane de plantes. Le dragon lui offre une bague de pierre. Ils jurent de devenir alliés pour toujours.',
            ],
            [
                'title' => 'La chauve-souris éclair',
                'phonemes' => ['ou', 'in', 'è'],
                'text' => 'La chauve-souris Éclair vole entre les arbres. Elle voit la nuit grâce à ses grandes oreilles. Elle repère une luciole qui brille. Elle la suit jusqu\'à la clairière. Là, elle danse dans les airs comme un petit papier noir.',
            ],
            [
                'title' => 'Les secrets du corail',
                'phonemes' => ['ou', 'an', 'é'],
                'text' => 'Sous la mer, le corail construit une ville rose. Chaque petit animal travaille à son tour. Un poisson-clown garde la porte de l\'anémone. Les algues font de l\'ombre aux habitants. Un plongeur prend une photo pour montrer ce monde aux enfants.',
            ],
            [
                'title' => 'Le hamac de la sieste',
                'phonemes' => ['an', 'ou', 'in'],
                'text' => 'Le hamac est suspendu entre deux cocotiers. Yasmine s\'y allonge après le bain. Elle fredonne une petite chanson. Le vent soulève doucement le tissu. Elle s\'endort en regardant les crabes marcher sur le sable.',
            ],
            [
                'title' => 'La tortue voyageuse',
                'phonemes' => ['ou', 'in', 'an'],
                'text' => 'La tortue Marée part voyager chaque année. Elle longe les côtes et les récifs. Un jour, elle aide un petit crabe égaré à rentrer. Marée repart ensuite vers son île. Elle sait toujours où aller, sans carte ni boussole.',
            ],
            [
                'title' => 'Le carnaval des fleurs',
                'phonemes' => ['ou', 'an', 'é'],
                'text' => 'Le samedi, la ville organise un carnaval de fleurs. Les enfants portent des couronnes de pâquerettes. Un char immense traverse la grande place. On jette des pétales roses dans l\'air. Le défilé finit par une grande danse.',
            ],
            [
                'title' => 'Le satellite gourmand',
                'phonemes' => ['ou', 'an', 'é'],
                'text' => 'Le satellite Farine tourne autour de la Terre. Il envoie des photos des champs et des villes. Un jour, il repère le plus grand gâteau du pays. Il prévient les enfants par radio : le goûter commence ! Farine aime les bonnes nouvelles.',
            ],
            [
                'title' => 'Le grillon musicien',
                'phonemes' => ['ou', 'in', 'an'],
                'text' => 'Le grillon chante sous la fenêtre de Léa. Il fait vibrer ses ailes très vite. Une fourmi s\'arrête pour écouter. Le grillon lui dédie sa prochaine chanson. Tout le champ devient un petit orchestre.',
            ],
            [
                'title' => 'Le bateau de papier',
                'phonemes' => ['ou', 'an', 'é'],
                'text' => 'Théo plie un bateau de papier bleu. Il le pose dans la flaque de pluie. Le bateau part tout seul avec le vent. Une feuille morte devient un pirate à bord. Théo raconte leur long voyage jusqu\'à la rigole.',
            ],
            [
                'title' => 'Le phare qui veille',
                'phonemes' => ['ou', 'in', 'è'],
                'text' => 'Le phare tourne sa lumière toute la nuit. Il guide les bateaux loin des rochers. Le gardien monte les escaliers avec un café. Il salue les mouettes qui passent. Au matin, la lumière s\'éteint et tout le monde dort.',
            ],
        ];
    }

    /**
     * Niveau 3 : petits paragraphes, 5 à 7 phrases par texte.
     *
     * @return array<int, array{title: string, phonemes: array<int, string>, text: string}>
     */
    private function levelThree(): array
    {
        return [
            [
                'title' => 'La meute de loups',
                'phonemes' => ['ou', 'in', 'an'],
                'text' => 'Dans la forêt gelée, la meute de loups avance en silence. Le chef lève la tête pour sentir le vent, il cherche un passage sûr. Les loups plus jeunes glissent sur la glace et rient entre eux. Soudain, un criquet de frimas résonne sous leurs pattes. La meute se resserre et poursuit sa route vers la clairière. À la nuit tombée, elles trouvent enfin un abri couvert de mousses. Le chef aboie une fois, et chacun se cale contre son voisin pour dormir.',
            ],
            [
                'title' => 'Titan, la lune de Saturne',
                'phonemes' => ['ou', 'in', 'an'],
                'text' => 'Titan est la plus grande lune de Saturne, plus grosse que Mercure. Sa surface est couverte d\'une brume orange qui cache le sol. Les scientifiques y ont trouvé des lacs d\'un liquide froid, semblable à de l\'essence. Un rover nommé Vagabond est envoyé pour analyser ces rives. Il roule lentement entre les rochers noirâtres. Sur son passage, il cartographie des dunes de méthane gelé. Chaque échantillon ramené raconte un peu mieux l\'histoire du système solaire.',
            ],
            [
                'title' => 'Le royaume sous la glace',
                'phonemes' => ['ou', 'in', 'è'],
                'text' => 'Sous une banquise épaisse, un royaume de glace bleue attend les explorateurs. Le soleil rase la surface et fait scintiller les arêtes. Des phoques se reposent en famille sur un banc de neige compacte. L\'eau amère suinte doucement des crevasses et nourrit de minuscules crevettes roses. Une équipe de scientifiques installe ses tents au bord du polynie. Elle mesure la fonte jour après jour pour protéger les animaux. Ici, chaque silence raconte la patience du vivant.',
            ],
            [
                'title' => 'Le secret des lucioles',
                'phonemes' => ['ou', 'in', 'é'],
                'text' => 'Quand la nuit tombe, les lucioles allument leurs petites lanternes. Chaque éclat vert est un message, une façon de dire « me voici ». Les mâles dessinent des lignes lumineuses au-dessus des fougères. Les femelles répondent depuis l\'herbe haute. Une luciole hésitante éclaire trop fort et attire toute la bande. Elle apprend alors à moduler sa lumière, un peu comme on baisse la voix. Avant l\'aube, elles rangent leurs lampes et se cachent sous une feuille.',
            ],
            [
                'title' => 'Le tam-tam du village',
                'phonemes' => ['ou', 'an', 'am'],
                'text' => 'Au centre du village, un immense tam-tam de bois repose sous un hangar. Les anciens racontent qu\'il battait autrefois pour avertir des orages. Amadou, le plus jeune tambourinaire, s\'entraîne chaque soir après l\'école. Il frappe doucement d\'abord, puis il accélère jusqu\'à faire trembler les calebasses. Un soir, sa grand-mère joint ses mains au rythme et chante une berceante. Le tam-tam semble alors respirer à nouveau. Tout le village se rassemble pour écouter cette mémoire qui ne s\'éteint pas.',
            ],
            [
                'title' => 'Le grand bleu des tortues',
                'phonemes' => ['ou', 'in', 'an'],
                'text' => 'La tortue verte nage depuis des millions d\'années dans l\'océan. Elle traverse des milliers de kilomètres pour retrouver la plage où elle est née. Sur ce chemin, elle confond parfois les sacs plastiques avec des méduses. Des bénévoles nettoient alors les récifs pour lui rendre un chemin sûr. Après la ponte, la mère regarde l\'horizon et repart vers le large. Ses petits, eux, partent de leur côté dès la nuit. Ils suivent la lueur des vagues pour apprendre à vivre seuls.',
            ],
            [
                'title' => 'Le village perché des oiseaux',
                'phonemes' => ['ou', 'in', 'é'],
                'text' => 'Au sommet d\'un vieux chêne vit un village d\'oiseaux très organisé. Chaque matin, le merle sonne le réveil et les mésanges ouvrent la cantine. Les rouges-gorges balayent les branches, tandis que les pies gardent le sentier. Un moineau peintre décore les entrées des nids avec des pétales. Quand la pluie arrive, tout le monde range le linge dehors et se regroupe sous les feuilles. Le soir, on partage les graines trouvées dans le champ voisin. Ici, personne ne travaille seul.',
            ],
            [
                'title' => 'Le secret des dinosaures à plumes',
                'phonemes' => ['ou', 'in', 'an'],
                'text' => 'Longtemps, on a cru que les dinosaures étaient tous couverts d\'écailles. Les fossiles ont raconté une autre histoire : certains portaient des plumes. Le microraptor glissait d\'un arbre à l\'autre avec quatre ailes noires. En Mongolie, on a trouvé un nid de oviraptors gardé par un parent. Ses pattes étaient couvertes d\'un duvet doux comme celui des poussins. Les scientifiques comparent aujourd\'hui ces os à ceux des oiseaux. Grâce à eux, la frontière entre reptiles et volailles s\'estompe.',
            ],
            [
                'title' => 'La nuit des étoiles filantes',
                'phonemes' => ['é', 'in', 'an'],
                'text' => 'Chaque été, la Terre traverse un nuage de poussière comète. Les grains brûlent dans le ciel et dessinent des traits de lumière. Léa s\'installe avec sa couverture sur la terrasse et compte les étoiles filantes. Elle marque un point sur son carnet à chaque vœu réalisé. Son petit frère, lui, s\'endort dès la seconde. Une pleine lune dorée veille au-dessus des toits. Avant de rentrer, Léa s\'assure que toutes les étoiles ont bien reçu ses messages.',
            ],
            [
                'title' => 'Le chevalier qui avait peur du noir',
                'phonemes' => ['ou', 'in', 'an'],
                'text' => 'Gautier était un chevalier respecté, mais il avouait rarement sa peur du noir. Chaque nuit, il gardait une bougie allumée au bord de son lit. Un soir, un incendie ravagea la grange et tout devint enfumé. Gautier marcha à tâtons, guidé par la lueur d\'une lanterne cassée. Il sauva les chevaux un par un sans penser à sa peur. Au matin, il comprit que le courage n\'est pas l\'absence de peur. Depuis, il éteint sa bougie sans rien dire à personne.',
            ],
            [
                'title' => 'Le corail, ville du récif',
                'phonemes' => ['ou', 'an', 'é'],
                'text' => 'Le corail ressemble à une forêt pierreuse au fond de la mer. En réalité, il est bâti par des milliers de petits animaux transparents. Chacun dépose une parcelle de calcaire et agrandit la cité. Les poissons-perroquets creusent des tunnels entre les branches. Les crevettes-mitres nettoient les passages et gardent l\'eau claire. Quand la température monte trop haut, le corail blanchit et s\'affaiblit. Les plongeurs reviennent alors planter de jeunes pousses pour aider la ville à repousser.',
            ],
            [
                'title' => 'Le concert du marais',
                'phonemes' => ['ou', 'an', 'é'],
                'text' => 'Au crépuscule, le marais devient une salle de concert. Les grenouilles ouvrent le bal avec leur croassement mesuré. Les rainettes répondent depuis les roseaux, un peu plus aiguës. Un héron gris s\'approche sans un bruit, mais personne ne perd le fil. La lune se lève et pose une lumière argentée sur l\'eau noire. Un battement d\'ailes se joint au chœur, c\'est une chouette qui passe. Le dernier couplet finit quand le premier rayon du soleil paraît.',
            ],
            [
                'title' => 'Le train fantôme des collines',
                'phonemes' => ['ou', 'in', 'an'],
                'text' => 'Sur la petite ligne des collines, un train fantôme a disparu depuis trente ans. Les habitants racontent qu\'il s\'arrêtait pour saluer les fermes. Julien, le mécanicien retraité, garde encore sa casquette et son sifflet. Un jour, des enfants découvrent la vieille locomotive sous des ronces. Ils nettoient les vitres et repeignent le numéro en jaune. Le dimanche, le train roule à nouveau jusqu\'au verger. Tout le village monte à bord avec des paniers de pommes.',
            ],
            [
                'title' => 'La baleine à bosse chanteuse',
                'phonemes' => ['ou', 'an', 'in'],
                'text' => 'La baleine à bosse passe tout l\'hiver dans les eaux chaudes du Sud. Elle y apprend des chansons complètes, pleines de soupirs et de glissades. Au printemps, elle part vers le Nord avec son baleineau. La maman chante pendant des heures pour garder le contact dans la brume. Les requins évitent ce convoi bruyant qui avance sans s\'arrêter. En août, la baleine atteint le cercle polaire et se nourrit de krill. Elle repart ensuite vers le Sud, avec une chanson un peu plus longue.',
            ],
            [
                'title' => 'Le jardin partagé du quartier',
                'phonemes' => ['ou', 'an', 'é'],
                'text' => 'Derrière la boulangerie, un terrain vague est devenu un jardin partagé. Chaque famille y possède un carré de terre et un panneau peint. Fatou y plante des tomates, tandis que Monsieur Brel cultive des courges. Les enfants construisent une cabane avec des palettes et des cordes. En été, on organise une soupe géante avec toutes les récoltes. En hiver, on plante des fèves pour que la terre ne dorme pas vide. Le jardin a même réussi à rapprocher deux voisins qui ne se saluaient plus.',
            ],
            [
                'title' => 'Les jumeaux de la station spatiale',
                'phonemes' => ['ou', 'in', 'an'],
                'text' => 'À bord de la station spatiale, deux jumeaux observent la Terre à travers le dôme. L\'un mesure la croissance des plantes dans la serre, l\'autre cartographie les nuages. Ils parlent chaque soir avec leur classe restée sur Terre. Un orage tropical traverse l\'Afrique et ils le filment image par image. Lors d\'une sortie spatiale, l\'un des deux perd son tournevis et le rattrape au vol. L\'équipe au sol applaudit malgré les protocoles. Au retour, ils rapporteront les premières fleurs cultivées sans gravité.',
            ],
            [
                'title' => 'Le secret des fourmis rouges',
                'phonemes' => ['ou', 'in', 'an'],
                'text' => 'Sous une pierre plate vit une colonie de fourmis rouges très travailleuses. Les ouvrières partent chaque matin chercher des graines et des insectes. Elles communiquent en se touchant les antennes avec des messages chimiques. Quand la pluie menace, des éclaireurs referment l\'entrée du nid avec de la terre. Les gardiennes vérifient alors la réserve de nourriture mois après mois. Une fourmi isolée reste parfois sur le sentier, mais une patrouille vient toujours la chercher. Leur force, c\'est de ne jamais avancer seules.',
            ],
            [
                'title' => 'Le carrousel des orgues',
                'phonemes' => ['ou', 'an', 'é'],
                'text' => 'Dans la vieille église, l\'orgue possède un clavier caché sous le banc du chantre. Émile, l\'organiste, fait monter les notes une à une. Les tuyaux de bois murmurent d\'abord comme un vent léger. Puis le grand jeu gronde et fait vibrer les vitraux. Les enfants du chœur ferment les yeux, éblouis. À la dernière messe de l\'année, Émile joue une chanson de voyage. Même le chat du sacristain s\'installe alors au pied de l\'échelle.',
            ],
            [
                'title' => 'L\'expédition du colibri',
                'phonemes' => ['ou', 'in', 'an'],
                'text' => 'Le colibri survole les Andes sans jamais s\'arrêter longtemps. Ses ailes battent si vite qu\'on croit voir une brume. Il butine les fleurs rouges du versant puis traverse un col enneigé. Là, le vent le renvoie deux fois en arrière. Il attend patiemment un souffle plus calme et reprend sa route. De l\'autre côté, un jardin de tubérose l\'attend pour le festin. Chaque nuit, il se cloue à une branche et s\'endort, les ailes repliées.',
            ],
            [
                'title' => 'Le phare de la baie noire',
                'phonemes' => ['ou', 'in', 'è'],
                'text' => 'Le phare de la baie noire tourne sa lumière depuis cent ans. Une tempête arracha jadis le toit et emporta la lampe. Solange, la gardienne, remonta seule dans la tour avec des clous et du goudron. Elle ralluma le feu à temps pour qu\'un bateau de pêche évite les récifs. Les marins racontent encore cette nuit-là autour d\'un café. Depuis, Solange grave une encoche sur la porte à chaque navire sauvé. La baie n\'a plus jamais été aussi silencieuse.',
            ],
            [
                'title' => 'Le dragon du lac gelé',
                'phonemes' => ['ou', 'in', 'an'],
                'text' => 'Sur le lac gelé, les enfants ont bâti un dragon de neige. Il a des yeux de charbon et une queue qui longe la rive. Quand le dégel arrive, le dragon fond goutte à goutte. Les enfants remettent alors des briques de glace pour le soigner. Un matin, ils trouvent une carte dans sa bouche ouverte. Elle indique un tunnel sous la cabane de bois. Ils y découvrent des skis anciens et une réserve de chocolat oubliée.',
            ],
            [
                'title' => 'Le secret des pierres parlantes',
                'phonemes' => ['ou', 'in', 'é'],
                'text' => 'Au musée, une pierre noire reste toujours sous verre. Elle porte des signes bizarres, gravés par des humains très anciens. Maëlis, la guide, raconte qu\'ils racontaient les crues et les récoltes. Un jour, un visiteur reconnaît un signe dans le jardin de son grand-père. Il s\'agit d\'un ancien relevé de la rivière. Les chercheurs comparent alors les deux pierres et reconstituent un calendrier. Depuis, Maëlis termine toujours sa visite devant cette pierre muette mais bavarde.',
            ],
            [
                'title' => 'Le ballon qui a voyagé',
                'phonemes' => ['ou', 'an', 'é'],
                'text' => 'Le ballon rouge s\'échappa des mains de Théo pendant la fête. Il monta droit dans le ciel, au-dessus des toits et des clochers. Une nuée d\'étourneaux l\'escorta un moment avant de se disperser. Le ballon franchit une rivière et atterrit près d\'un champ de lavande. Une bergère le ramassa et l\'attacha à une clôture pour les moutons. Des semaines plus tard, Théo le retrouva sur une photo de vacances. Depuis, il garde la ficelle nouée autour de son poignet.',
            ],
            [
                'title' => 'La chanson de la cabane',
                'phonemes' => ['ou', 'an', 'é'],
                'text' => 'Dans la cabane au bout du jardin, Nour range ses partitions. Elle a écrit une chanson pour sa grand-mère qui habille loin. Le refrain parle du jardin en été et du vent sur les volets. Elle hésite encore sur la dernière note, trop haute pour sa voix. Son père propose d\'y aller à deux, chacun son tour. Le soir même, ils répètent devant la fenêtre ouverte. Une voisine toque à la porte pour demander le refrain un peu plus fort.',
            ],
            [
                'title' => 'Le safari des phoques',
                'phonemes' => ['ou', 'in', 'è'],
                'text' => 'Au printemps, des milliers de phoques remontent sur la plage grise. Les bébés naissent tout d\'abord, couverts d\'un duvet soyeux. Ils apprennent à nager pendant que les mères jeûnent à côté. Un éleveur surveille la colonie sans jamais s\'approcher trop près. Si un bébé reste seul, il le guide vers l\'eau avec une planche. Les orques attendent au large, patiemment, le moment de la mise à l\'eau. Chaque printemps, c\'est la même course entre la vie et la faim.',
            ],
            [
                'title' => 'L\'étoile de Noël du train',
                'phonemes' => ['ou', 'in', 'an'],
                'text' => 'Chaque hiver, un train de nuit traverse la montagne avec une étoile à bord. L\'étoile est en papier doré, offerte par les écoles du pays. Elle voyage de gare en gare et change de mains à chaque halte. Ce soir-là, la neige tombe si fort que le train doit s\'arrêter. Les voyageurs descendent et forment une chaîne pour porter l\'étoile jusqu\'au village. Les cloches sonnent alors plus fort que d\'habitude. Au matin, le train repart, et l\'étoile brille déjà dans la vitrine de la mairie.',
            ],
            [
                'title' => 'Le jardin d\'hiver des abeilles',
                'phonemes' => ['ou', 'in', 'an'],
                'text' => 'En hiver, la ruche se resserre autour de la reine pour tenir au chaud. Les ouvrières forment une grappe et se relaient pour dégager les cellules. Elles consomment le miel stocké et vibrent pour produire un peu de chaleur. Un apiculteur vérifie la porte d\'envol et déneige le toit. Si le ciel se dégage, une brave abeille sort faire un court repérage. Elle revient avec du pollen de noyer, un signe prometteur. Dans la ruche, le printemps commence déjà à s\'organiser.',
            ],
            [
                'title' => 'Le secret du vieux moulin',
                'phonemes' => ['ou', 'in', 'é'],
                'text' => 'Le vieux moulin penche au-dessus du ruisseau depuis des générations. Ses ailes se sont arrêtées après qu\'un orage en ait cassé une. Pablo, le meunier, a remis la machine en route avec des poutres neuves. Il pousse le levier et le vent attrape enfin la toile. Les meules tournent et la farine sent le blé chaud. Les enfants du village montent acheter leur pain de la semaine. Sur la roue, une famille de cormorans a installé son nid pour l\'été.',
            ],
            [
                'title' => 'Le navire des enfants de la mer',
                'phonemes' => ['ou', 'in', 'an'],
                'text' => 'Le navire escolaire appareille chaque été pour une semaine de mer. Les enfants apprennent à tenir la barre, à lire la carte et à faire les nœuds. Chacun a un poste : vigie, cuisine ou pont. Un soir, la vigie annonce une baleine à l\'horizon. Tout le monde monte sur le pont en silence. Le commandant coupe le moteur pour l\'écouter respirer. Au retour, les enfants racontent ce voyage à leurs parents avec des mots de marins.',
            ],
            [
                'title' => 'L\'orchestre de la rue marchande',
                'phonemes' => ['ou', 'an', 'é'],
                'text' => 'Chaque samedi, un orchestre s\'installe au milieu de la rue marchande. Le guitariste accorde sa corde cassée avec une pince empruntée. La clarinettiste joue une chanson que tout le monde reconnaît aussitôt. Les marchands de fruits battent la mesure avec des cageots vides. Un chien très calme aboie juste aux bons endroits. Les passants s\'arrêtent avec leurs paniers pour écouter le refrain. À midi, l\'orchestre range ses instruments et promet de revenir le week-end prochain.',
            ],
        ];
    }
}
