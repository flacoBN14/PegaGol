const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// 48 selecciones del Mundial FIFA 2026 - Plantillas actualizadas 2025-2026
const equipos = [
  // ===== CONCACAF (6) =====
  {
    codigo: "MEX",
    nombre: "Mexico",
    jugadores: [
      "Escudo", "Guillermo Ochoa", "Jorge Sanchez", "Cesar Montes", "Johan Vasquez",
      "Jesus Gallardo", "Edson Alvarez", "Luis Chavez", "Orbelin Pineda", "Carlos Rodriguez",
      "Luis Romo", "Erick Sanchez", "Hirving Lozano", "Alexis Vega", "Roberto Alvarado",
      "Uriel Antuna", "Diego Lainez", "Raul Jimenez", "Henry Martin", "Santiago Gimenez",
    ],
  },
  {
    codigo: "USA",
    nombre: "Estados Unidos",
    jugadores: [
      "Escudo", "Matt Turner", "Sergino Dest", "Chris Richards", "Miles Robinson",
      "Antonee Robinson", "Tyler Adams", "Weston McKennie", "Yunus Musah", "Giovanni Reyna",
      "Brenden Aaronson", "Malik Tillman", "Christian Pulisic", "Timothy Weah", "Josh Sargent",
      "Ricardo Pepi", "Folarin Balogun", "Haji Wright", "Johnny Cardoso", "Luca de la Torre",
    ],
  },
  {
    codigo: "CAN",
    nombre: "Canada",
    jugadores: [
      "Escudo", "Maxime Crepeau", "Alistair Johnston", "Kamal Miller", "Moise Bombito",
      "Sam Adekugbe", "Stephen Eustaquio", "Ismael Kone", "Mark-Anthony Kaye", "Tajon Buchanan",
      "Jonathan David", "Alphonso Davies", "Cyle Larin", "Liam Millar", "Junior Hoilett",
      "Richie Laryea", "Jonathan Osorio", "Jacob Shaffelburg", "Samuel Piette", "Theo Corbeanu",
    ],
  },
  {
    codigo: "PAN",
    nombre: "Panama",
    jugadores: [
      "Escudo", "Orlando Mosquera", "Michael Murillo", "Fidel Escobar", "Andres Andrade",
      "Eric Davis", "Adalberto Carrasquilla", "Cristian Martinez", "Jose Luis Rodriguez", "Edgar Barcenas",
      "Alberto Quintero", "Freddy Gondola", "Jose Fajardo", "Rolando Blackburn", "Cesar Yanis",
      "Ivan Anderson", "Anibal Godoy", "Ernesto Walker", "Jiovany Ramos", "Eduardo Guerrero",
    ],
  },
  {
    codigo: "HAI",
    nombre: "Haiti",
    jugadores: [
      "Escudo", "Alexandre Duval", "Frantzdy Pierrot", "Carlens Arcus", "Kevin LaFrance",
      "Ricardo Ade", "Derrick Etienne Jr", "Melchie Dumornay", "Bryan Alceus", "Duckens Nazon",
      "Leverton Pierre", "Danny Duval", "Stephane Lambese", "Alex Jr Christian", "Ronaldo Damus",
      "Owayne Gordon", "Jean-Ricner Bellegarde", "Steeven Saba", "Zachary Herivaux", "Danley Jean Jacques",
    ],
  },
  {
    codigo: "CUR",
    nombre: "Curazao",
    jugadores: [
      "Escudo", "Eloy Room", "Juninho Bacuna", "Cuco Martina", "Darryl Lachman",
      "Shermaine Martina", "Leandro Bacuna", "Michaell Tirpijn", "Kenji Gorre", "Elson Hooi",
      "Rangelo Janga", "Brandley Kuwas", "Gervane Kastaneer", "Jairzinho Pieter", "Charlison Benschop",
      "Jurien Gaari", "Vurnon Anita", "Shadrach Victora", "Quenten Martinus", "Jeremy de Nooijer",
    ],
  },

  // ===== CONMEBOL (6) =====
  {
    codigo: "ARG",
    nombre: "Argentina",
    jugadores: [
      "Escudo", "Emiliano Martinez", "Nahuel Molina", "Cristian Romero", "Nicolas Otamendi",
      "Nicolas Tagliafico", "Rodrigo De Paul", "Leandro Paredes", "Enzo Fernandez", "Alexis Mac Allister",
      "Giovani Lo Celso", "Exequiel Palacios", "Lionel Messi", "Lautaro Martinez", "Julian Alvarez",
      "Paulo Dybala", "Alejandro Garnacho", "Nicolas Gonzalez", "Thiago Almada", "Giuliano Simeone",
    ],
  },
  {
    codigo: "BRA",
    nombre: "Brasil",
    jugadores: [
      "Escudo", "Alisson", "Danilo", "Marquinhos", "Gabriel Magalhaes",
      "Alex Telles", "Casemiro", "Bruno Guimaraes", "Lucas Paqueta", "Andre",
      "Joao Gomes", "Douglas Luiz", "Vinicius Jr", "Raphinha", "Rodrygo",
      "Richarlison", "Endrick", "Gabriel Martinelli", "Savinho", "Estevao",
    ],
  },
  {
    codigo: "COL",
    nombre: "Colombia",
    jugadores: [
      "Escudo", "Camilo Vargas", "Daniel Munoz", "Davinson Sanchez", "Yerry Mina",
      "Johan Mojica", "Wilmar Barrios", "Mateus Uribe", "James Rodriguez", "Richard Rios",
      "Jefferson Lerma", "Kevin Castaño", "Luis Diaz", "Rafael Santos Borre", "Luis Sinisterra",
      "Jhon Cordoba", "Miguel Borja", "Jhon Arias", "Jorge Carrascal", "Juan Camilo Portilla",
    ],
  },
  {
    codigo: "ECU",
    nombre: "Ecuador",
    jugadores: [
      "Escudo", "Hernan Galindez", "Angelo Preciado", "Felix Torres", "Piero Hincapie",
      "Pervis Estupinan", "Moises Caicedo", "Carlos Gruezo", "Alan Franco", "Kendry Paez",
      "Jeremy Sarmiento", "Gonzalo Plata", "Enner Valencia", "Michael Estrada", "Kevin Rodriguez",
      "John Yeboah", "Willian Pacho", "Jose Cifuentes", "Angel Mena", "Joao Rojas",
    ],
  },
  {
    codigo: "PAR",
    nombre: "Paraguay",
    jugadores: [
      "Escudo", "Carlos Coronel", "Alberto Espinola", "Gustavo Gomez", "Omar Alderete",
      "Junior Alonso", "Andres Cubas", "Mathias Villasanti", "Miguel Almiron", "Julio Enciso",
      "Matias Rojas", "Ramon Sosa", "Angel Romero", "Antonio Sanabria", "Adam Bareiro",
      "Gabriel Avalos", "Alex Arce", "Fabian Balbuena", "Damian Bobadilla", "Hernan Perez",
    ],
  },
  {
    codigo: "URU",
    nombre: "Uruguay",
    jugadores: [
      "Escudo", "Sergio Rochet", "Nahitan Nandez", "Jose Maria Gimenez", "Ronald Araujo",
      "Mathias Olivera", "Federico Valverde", "Rodrigo Bentancur", "Manuel Ugarte", "Nicolas De La Cruz",
      "Giorgian De Arrascaeta", "Facundo Pellistri", "Darwin Nunez", "Luis Suarez", "Maximiliano Araujo",
      "Agustin Canobbio", "Facundo Torres", "Matias Viña", "Sebastian Caceres", "Brian Rodriguez",
    ],
  },

  // ===== UEFA (12) =====
  {
    codigo: "FRA",
    nombre: "Francia",
    jugadores: [
      "Escudo", "Mike Maignan", "Jules Kounde", "Dayot Upamecano", "William Saliba",
      "Theo Hernandez", "N'Golo Kante", "Aurelien Tchouameni", "Eduardo Camavinga", "Antoine Griezmann",
      "Adrien Rabiot", "Youssouf Fofana", "Kylian Mbappe", "Ousmane Dembele", "Marcus Thuram",
      "Randal Kolo Muani", "Bradley Barcola", "Warren Zaire-Emery", "Michael Olise", "Khephren Thuram",
    ],
  },
  {
    codigo: "GER",
    nombre: "Alemania",
    jugadores: [
      "Escudo", "Manuel Neuer", "Joshua Kimmich", "Antonio Rudiger", "Nico Schlotterbeck",
      "David Raum", "Robert Andrich", "Pascal Gross", "Jamal Musiala", "Florian Wirtz",
      "Leon Goretzka", "Aleksandar Pavlovic", "Leroy Sane", "Serge Gnabry", "Kai Havertz",
      "Niclas Fullkrug", "Chris Fuhrich", "Maximilian Beier", "Deniz Undav", "Benjamin Henrichs",
    ],
  },
  {
    codigo: "ESP",
    nombre: "Espana",
    jugadores: [
      "Escudo", "Unai Simon", "Dani Carvajal", "Aymeric Laporte", "Robin Le Normand",
      "Marc Cucurella", "Rodri", "Pedri", "Gavi", "Dani Olmo",
      "Fabian Ruiz", "Mikel Merino", "Lamine Yamal", "Nico Williams", "Alvaro Morata",
      "Ferran Torres", "Alejandro Balde", "Fermin Lopez", "Mikel Oyarzabal", "Pau Cubarsi",
    ],
  },
  {
    codigo: "ENG",
    nombre: "Inglaterra",
    jugadores: [
      "Escudo", "Jordan Pickford", "Kyle Walker", "John Stones", "Marc Guehi",
      "Luke Shaw", "Declan Rice", "Jude Bellingham", "Kobbie Mainoo", "Phil Foden",
      "Cole Palmer", "Angel Gomes", "Bukayo Saka", "Anthony Gordon", "Harry Kane",
      "Ollie Watkins", "Morgan Gibbs-White", "Trent Alexander-Arnold", "Jarrod Bowen", "Noni Madueke",
    ],
  },
  {
    codigo: "POR",
    nombre: "Portugal",
    jugadores: [
      "Escudo", "Diogo Costa", "Joao Cancelo", "Ruben Dias", "Antonio Silva",
      "Nuno Mendes", "Bruno Fernandes", "Vitinha", "Bernardo Silva", "Joao Felix",
      "Joao Palhinha", "Joao Neves", "Cristiano Ronaldo", "Rafael Leao", "Goncalo Ramos",
      "Diogo Jota", "Pedro Neto", "Francisco Conceicao", "Goncalo Inacio", "Renato Sanches",
    ],
  },
  {
    codigo: "NED",
    nombre: "Paises Bajos",
    jugadores: [
      "Escudo", "Bart Verbruggen", "Denzel Dumfries", "Virgil van Dijk", "Nathan Ake",
      "Ian Maatsen", "Frenkie de Jong", "Ryan Gravenberch", "Tijjani Reijnders", "Xavi Simons",
      "Teun Koopmeiners", "Jerdy Schouten", "Cody Gakpo", "Donyell Malen", "Memphis Depay",
      "Brian Brobbey", "Joshua Zirkzee", "Micky van de Ven", "Jurrien Timber", "Jeremie Frimpong",
    ],
  },
  {
    codigo: "BEL",
    nombre: "Belgica",
    jugadores: [
      "Escudo", "Koen Casteels", "Timothy Castagne", "Wout Faes", "Jan Vertonghen",
      "Arthur Theate", "Kevin De Bruyne", "Amadou Onana", "Youri Tielemans", "Arne Engels",
      "Orel Mangala", "Charles De Ketelaere", "Jeremy Doku", "Lois Openda", "Romelu Lukaku",
      "Leandro Trossard", "Johan Bakayoko", "Dodi Lukebakio", "Zeno Debast", "Aster Vranckx",
    ],
  },
  {
    codigo: "CRO",
    nombre: "Croacia",
    jugadores: [
      "Escudo", "Dominik Livakovic", "Josip Stanisic", "Josko Gvardiol", "Duje Caleta-Car",
      "Borna Sosa", "Luka Modric", "Mateo Kovacic", "Marcelo Brozovic", "Mario Pasalic",
      "Lovro Majer", "Martin Baturina", "Ivan Perisic", "Ante Budimir", "Andrej Kramaric",
      "Bruno Petkovic", "Luka Sucic", "Igor Matanovic", "Josip Sutalo", "Marin Pongracic",
    ],
  },
  {
    codigo: "SUI",
    nombre: "Suiza",
    jugadores: [
      "Escudo", "Yann Sommer", "Silvan Widmer", "Manuel Akanji", "Nico Elvedi",
      "Ricardo Rodriguez", "Granit Xhaka", "Denis Zakaria", "Remo Freuler", "Xherdan Shaqiri",
      "Ruben Vargas", "Fabian Rieder", "Dan Ndoye", "Breel Embolo", "Zeki Amdouni",
      "Noah Okafor", "Steven Zuber", "Edimilson Fernandes", "Ardon Jashari", "Filip Ugrinic",
    ],
  },
  {
    codigo: "AUT",
    nombre: "Austria",
    jugadores: [
      "Escudo", "Patrick Pentz", "Stefan Posch", "Kevin Danso", "Maximilian Wober",
      "Phillipp Mwene", "Konrad Laimer", "Nicolas Seiwald", "Florian Grillitsch", "Marcel Sabitzer",
      "Christoph Baumgartner", "Romano Schmid", "Marko Arnautovic", "Michael Gregoritsch", "Kevin Stöger",
      "Patrick Wimmer", "Matthias Seidl", "Flavius Daniliuc", "Phillipp Lienhart", "Alexander Prass",
    ],
  },
  {
    codigo: "SCO",
    nombre: "Escocia",
    jugadores: [
      "Escudo", "Angus Gunn", "Anthony Ralston", "Grant Hanley", "John Souttar",
      "Andrew Robertson", "Scott McTominay", "Callum McGregor", "Billy Gilmour", "John McGinn",
      "Kenny McLean", "Ryan Christie", "Che Adams", "Lyndon Dykes", "Lawrence Shankland",
      "Ben Doak", "James Forrest", "Ryan Jack", "Andy Irving", "Lewis Morgan",
    ],
  },
  {
    codigo: "NOR",
    nombre: "Noruega",
    jugadores: [
      "Escudo", "Orjan Nyland", "Marcus Holmgren Pedersen", "Leo Ostigard", "Andreas Hanche-Olsen",
      "Birger Meling", "Martin Odegaard", "Sander Berge", "Fredrik Aursnes", "Antonio Nusa",
      "Oscar Bobb", "Jens Petter Hauge", "Erling Haaland", "Alexander Sorloth", "Joshua King",
      "Mohamed Elyounoussi", "David Moller Wolfe", "Patrick Berg", "Morten Thorsby", "Julian Ryerson",
    ],
  },

  // ===== CAF (9) =====
  {
    codigo: "MAR",
    nombre: "Marruecos",
    jugadores: [
      "Escudo", "Yassine Bounou", "Achraf Hakimi", "Nayef Aguerd", "Romain Saiss",
      "Noussair Mazraoui", "Sofyan Amrabat", "Azzedine Ounahi", "Hakim Ziyech", "Youssef En-Nesyri",
      "Ilias Akhomach", "Bilal El Khannouss", "Brahim Diaz", "Abde Ezzalzouli", "Soufiane Rahimi",
      "Amine Harit", "Munir El Haddadi", "Zakaria Aboukhlal", "Adam Aznou", "Eliesse Ben Seghir",
    ],
  },
  {
    codigo: "SEN",
    nombre: "Senegal",
    jugadores: [
      "Escudo", "Edouard Mendy", "Kalidou Koulibaly", "Abdou Diallo", "Youssouf Sabaly",
      "Formose Mendy", "Idrissa Gueye", "Nampalys Mendy", "Pape Matar Sarr", "Krepin Diatta",
      "Ismaila Sarr", "Iliman Ndiaye", "Nicolas Jackson", "Sadio Mane", "Habib Diarra",
      "Boulaye Dia", "Lamine Camara", "Mikayil Faye", "El Hadji Malick Diouf", "Cherif Ndiaye",
    ],
  },
  {
    codigo: "EGY",
    nombre: "Egipto",
    jugadores: [
      "Escudo", "Mohamed El Shenawy", "Ahmed Fatouh", "Mohamed Abdel-Moneim", "Mahmoud Hamdy",
      "Ahmed Hegazi", "Mohamed Elneny", "Tarek Hamed", "Emam Ashour", "Ibrahim Adel",
      "Mahmoud Trezeguet", "Mostafa Mohamed", "Mohamed Salah", "Omar Marmoush", "Ahmed Koka",
      "Marwan Hamdi", "Hussein El Shahat", "Karim Fouad", "Mohamed Sherif", "Ahmed Sayed Zizo",
    ],
  },
  {
    codigo: "GHA",
    nombre: "Ghana",
    jugadores: [
      "Escudo", "Lawrence Ati-Zigi", "Tariq Lamptey", "Mohammed Salisu", "Alexander Djiku",
      "Gideon Mensah", "Thomas Partey", "Mohammed Kudus", "Elisha Owusu", "Antoine Semenyo",
      "Ibrahim Sulemana", "Fatawu Issahaku", "Jordan Ayew", "Inaki Williams", "Ernest Nuamah",
      "Abdul Samed", "Osman Bukari", "Kamaldeen Sulemana", "Jerome Opoku", "Edmund Addo",
    ],
  },
  {
    codigo: "CIV",
    nombre: "Costa de Marfil",
    jugadores: [
      "Escudo", "Yahia Fofana", "Serge Aurier", "Odilon Kossounou", "Willy Boly",
      "Ghislain Konan", "Franck Kessie", "Seko Fofana", "Ibrahim Sangare", "Jean-Philippe Krasso",
      "Nicolas Pepe", "Sebastien Haller", "Simon Adingra", "Oumar Diakite", "Karim Konate",
      "Christian Kouame", "Max-Alain Gradel", "Wilfried Singo", "Evan Ndicka", "Jeremie Boga",
    ],
  },
  {
    codigo: "RSA",
    nombre: "Sudafrica",
    jugadores: [
      "Escudo", "Ronwen Williams", "Khuliso Mudau", "Siyanda Xulu", "Mothobi Mvala",
      "Aubrey Modiba", "Teboho Mokoena", "Themba Zwane", "Ethan Brooks", "Elias Mokwana",
      "Percy Tau", "Lyle Foster", "Iqraam Rayners", "Evidence Makgopa", "Oswin Appollis",
      "Bathusi Aubaas", "Thalente Mbatha", "Relebohile Mofokeng", "Rushwin Dortley", "Patrick Maswanganyi",
    ],
  },
  {
    codigo: "TUN",
    nombre: "Tunez",
    jugadores: [
      "Escudo", "Aymen Dahmen", "Mohamed Drager", "Yassine Meriah", "Montassar Talbi",
      "Ali Abdi", "Aissa Laidouni", "Ellyes Skhiri", "Hannibal Mejbri", "Youssef Msakni",
      "Naim Sliti", "Saifeddine Jaziri", "Anis Ben Slimane", "Issam Jebali", "Seifeddine Jaziri",
      "Mohamed Ali Ben Romdhane", "Ferjani Sassi", "Ali Maaloul", "Wajdi Kechrida", "Ghaylane Chaalali",
    ],
  },
  {
    codigo: "ALG",
    nombre: "Argelia",
    jugadores: [
      "Escudo", "Rais M'Bolhi", "Youcef Atal", "Aissa Mandi", "Abdelkader Bedrane",
      "Ramy Bensebaini", "Ismael Bennacer", "Nabil Bentaleb", "Hichem Boudaoui", "Amine Gouiri",
      "Said Benrahma", "Riyad Mahrez", "Islam Slimani", "Baghdad Bounedjah", "Yacine Brahimi",
      "Andy Delort", "Mohamed Amoura", "Adam Ounas", "Ibrahim Maza", "Farhi Amine",
    ],
  },
  {
    codigo: "CPV",
    nombre: "Cabo Verde",
    jugadores: [
      "Escudo", "Vozinha", "Steven Fortes", "Roberto Lopes", "Logan Costa",
      "Dylan Tavares", "Kenny Rocha Santos", "Jamiro Monteiro", "Nuno Borges", "Ryan Mendes",
      "Garry Rodrigues", "Julio Tavares", "Lisandro Semedo", "Gilson Benchimol", "Jovane Cabral",
      "Patrick Andrade", "Willy Semedo", "Djaniny", "Bebeto", "Stopira",
    ],
  },

  // ===== AFC (8) =====
  {
    codigo: "JPN",
    nombre: "Japon",
    jugadores: [
      "Escudo", "Zion Suzuki", "Hiroki Sakai", "Ko Itakura", "Takehiro Tomiyasu",
      "Miki Yamane", "Wataru Endo", "Hidemasa Morita", "Daichi Kamada", "Takefusa Kubo",
      "Ritsu Doan", "Kaoru Mitoma", "Takumi Minamino", "Ayase Ueda", "Kyogo Furuhashi",
      "Daizen Maeda", "Ao Tanaka", "Keito Nakamura", "Koji Miyoshi", "Yuki Soma",
    ],
  },
  {
    codigo: "KOR",
    nombre: "Corea del Sur",
    jugadores: [
      "Escudo", "Kim Seung-gyu", "Kim Moon-hwan", "Kim Min-jae", "Kim Young-gwon",
      "Kim Jin-su", "Hwang In-beom", "Jung Woo-young", "Lee Jae-sung", "Lee Kang-in",
      "Hwang Hee-chan", "Son Heung-min", "Cho Gue-sung", "Lee Seung-woo", "Bae Jun-ho",
      "Jeong Sang-bin", "Hong Hyun-seok", "Park Yong-woo", "Oh Hyeon-gyu", "Yang Hyun-jun",
    ],
  },
  {
    codigo: "AUS",
    nombre: "Australia",
    jugadores: [
      "Escudo", "Mathew Ryan", "Nathaniel Atkinson", "Harry Souttar", "Kye Rowles",
      "Aziz Behich", "Jackson Irvine", "Aaron Mooy", "Cameron Devlin", "Riley McGree",
      "Craig Goodwin", "Keanu Baccus", "Mitch Duke", "Jamie Maclaren", "Kusini Yengi",
      "Garang Kuol", "Marco Tilio", "Aiden O'Neill", "Connor Metcalfe", "Martin Boyle",
    ],
  },
  {
    codigo: "KSA",
    nombre: "Arabia Saudita",
    jugadores: [
      "Escudo", "Mohammed Al Owais", "Sultan Al-Ghanam", "Ali Al-Bulayhi", "Abdulelah Al-Amri",
      "Yasser Al-Shahrani", "Mohamed Kanno", "Abdulellah Al-Malki", "Saud Abdulhamid", "Salem Al-Dawsari",
      "Firas Al-Buraikan", "Abdullah Al-Hamdan", "Saleh Al-Shehri", "Nasser Al-Dawsari", "Nawaf Al-Abed",
      "Hassan Al-Tambakti", "Ali Al-Hassan", "Ayman Yahya", "Abdullah Madu", "Turki Al-Ammar",
    ],
  },
  {
    codigo: "IRN",
    nombre: "Iran",
    jugadores: [
      "Escudo", "Alireza Beiranvand", "Sadegh Moharrami", "Morteza Pouraliganji", "Shoja Khalilzadeh",
      "Ehsan Hajsafi", "Saeid Ezatolahi", "Ahmad Nourollahi", "Ali Gholizadeh", "Mehdi Taremi",
      "Sardar Azmoun", "Alireza Jahanbakhsh", "Karim Ansarifard", "Ali Karimi", "Omid Noorafkan",
      "Milad Sarlak", "Allahyar Sayyadmanesh", "Mehdi Ghayedi", "Vahid Amiri", "Rouzbeh Cheshmi",
    ],
  },
  {
    codigo: "QAT",
    nombre: "Catar",
    jugadores: [
      "Escudo", "Saad Al Sheeb", "Pedro Miguel", "Bassam Al-Rawi", "Abdelkarim Hassan",
      "Homam Ahmed", "Hassan Al-Haydos", "Karim Boudiaf", "Abdulaziz Hatem", "Akram Afif",
      "Almoez Ali", "Mohammed Muntari", "Ismaeel Mohammad", "Yusuf Abdurisag", "Musab Kheder",
      "Ahmed Alaaeldin", "Assim Madibo", "Sultan Al-Brake", "Ali Asad", "Hashim Ali",
    ],
  },
  {
    codigo: "JOR",
    nombre: "Jordania",
    jugadores: [
      "Escudo", "Yazeed Abulaila", "Salem Al-Ajalin", "Anas Bani-Yaseen", "Abdallah Nasib",
      "Ehsan Haddad", "Baha Faisal", "Nizar Al-Rashdan", "Mousa Al-Taamari", "Yazan Al-Naimat",
      "Hamza Al-Dardour", "Musa Mustafa", "Ali Olwan", "Ahmad Ersan", "Oday Dabbagh",
      "Tareq Khattab", "Mahmoud Mardi", "Youssef Rawashdeh", "Mohammed Abu Zraiq", "Amer Shafi",
    ],
  },
  {
    codigo: "UZB",
    nombre: "Uzbekistan",
    jugadores: [
      "Escudo", "Utkir Yusupov", "Husniddin Aliqulov", "Abdukodir Khusanov", "Jermejev Nurmatov",
      "Davron Khashimov", "Oston Urunov", "Jaloliddin Masharipov", "Otabek Shukurov", "Azizbek Turgunboev",
      "Dostonbek Khamdamov", "Eldor Shomurodov", "Igor Sergeev", "Abbos Fayzullaev", "Khusain Norchaev",
      "Nasimjon Khamroev", "Abbosbek Fayzullaev", "Islom Tukhtakhodjaev", "Akmal Shorakhmedov", "Bobur Abdikholikov",
    ],
  },

  // ===== OFC (1) =====
  {
    codigo: "NZL",
    nombre: "Nueva Zelanda",
    jugadores: [
      "Escudo", "Stefan Marinovic", "Michael Boxall", "Tim Payne", "Nando Pijnaker",
      "Liberato Cacace", "Joe Bell", "Marko Stamenic", "Matt Garbett", "Alex Greive",
      "Chris Wood", "Ben Waine", "Sarpreet Singh", "Callum McCowatt", "Kosta Barbarouses",
      "Elijah Just", "Jesse Randall", "Sam Sutton", "Francis de Vries", "Logan Rogerson",
    ],
  },

  // ===== REPECHAJE / PLAYOFF (6) =====
  {
    codigo: "ITA",
    nombre: "Italia",
    jugadores: [
      "Escudo", "Gianluigi Donnarumma", "Giovanni Di Lorenzo", "Alessandro Bastoni", "Riccardo Calafiori",
      "Federico Dimarco", "Nicolo Barella", "Sandro Tonali", "Lorenzo Pellegrini", "Davide Frattesi",
      "Samuele Ricci", "Nicolo Fagioli", "Federico Chiesa", "Giacomo Raspadori", "Gianluca Scamacca",
      "Mateo Retegui", "Moise Kean", "Andrea Cambiaso", "Matteo Darmian", "Daniel Maldini",
    ],
  },
  {
    codigo: "TUR",
    nombre: "Turquia",
    jugadores: [
      "Escudo", "Altay Bayindir", "Zeki Celik", "Merih Demiral", "Samet Akaydin",
      "Ferdi Kadioglu", "Hakan Calhanoglu", "Kaan Ayhan", "Orkun Kokcu", "Arda Guler",
      "Yusuf Yazici", "Kenan Yildiz", "Baris Alper Yilmaz", "Oguz Aydin", "Cenk Tosun",
      "Semih Kilicsoy", "Ismail Yuksek", "Salih Ozcan", "Kerem Akturkoglu", "Irfan Kahveci",
    ],
  },
  {
    codigo: "BOL",
    nombre: "Bolivia",
    jugadores: [
      "Escudo", "Guillermo Viscarra", "Jesus Sagredo", "Jose Sagredo", "Luis Haquin",
      "Roberto Fernandez", "Leonel Justiniano", "Moises Villarroel", "Fernando Saucedo", "Ramiro Vaca",
      "Erwin Saavedra", "Henry Vaca", "Marcelo Martins", "Carmelo Algaranaz", "Victor Abrego",
      "Rodrigo Ramallo", "Boris Cespedes", "Miguel Terceros", "Robson Matheus", "Roberto Dominguez",
    ],
  },
  {
    codigo: "IRQ",
    nombre: "Irak",
    jugadores: [
      "Escudo", "Jalal Hassan", "Ahmed Ibrahim", "Ali Adnan", "Rebin Sulaka",
      "Sherko Kareem", "Ibrahim Bayesh", "Amjad Attwan", "Ali Jasim", "Mohanad Ali",
      "Aymen Hussein", "Ali Al-Hamadi", "Justin Meram", "Alaa Abbas", "Mohammed Dawood",
      "Ahmed Yasin", "Safaa Hadi", "Hussein Ali", "Durgham Ismail", "Ahmad Dhurgham",
    ],
  },
  {
    codigo: "JAM",
    nombre: "Jamaica",
    jugadores: [
      "Escudo", "Andre Blake", "Greg Leigh", "Damion Lowe", "Di'Shon Bernard",
      "Amari'i Bell", "Ravel Morrison", "Bobby Decordova-Reid", "Kasey Palmer", "Joel Latibeaudiere",
      "Leon Bailey", "Michail Antonio", "Shamar Nicholson", "Daniel Johnson", "Demarai Gray",
      "Ethan Pinnock", "Kemar Roofe", "Raheem Sterling", "Miles Lewis-Mayfield", "Kaheim Dixon",
    ],
  },
  {
    codigo: "COD",
    nombre: "RD Congo",
    jugadores: [
      "Escudo", "Lionel Mpasi", "Chancel Mbemba", "Arthur Masuaku", "Ngonda Muzinga",
      "Glody Likonza", "Samuel Moutoussamy", "Gael Kakuta", "Yannick Bolasie", "Cedric Bakambu",
      "Chancel Mangulu", "Silas Katompa", "Dieu-Merci Mbokani", "Fiston Mayele", "Meschak Elia",
      "Theo Bongonda", "Arsene Zola", "Nathan Ngoy", "Arthur Kabath", "Gaius Makouta",
    ],
  },
];

async function main() {
  console.log("Limpiando base de datos...");
  await prisma.message.deleteMany();
  await prisma.trade.deleteMany();
  await prisma.userSticker.deleteMany();
  await prisma.sticker.deleteMany();
  await prisma.user.deleteMany();

  console.log("Creando estampas para 48 selecciones...");
  const stickerData = [];
  for (const equipo of equipos) {
    for (let i = 0; i < equipo.jugadores.length; i++) {
      stickerData.push({
        codigo: `${equipo.codigo}-${String(i + 1).padStart(2, "0")}`,
        equipo: equipo.nombre,
        nombreJugador: equipo.jugadores[i],
        numero: i + 1,
      });
    }
  }

  // Usar createMany para rendimiento
  await prisma.sticker.createMany({ data: stickerData });
  console.log(`${stickerData.length} estampas creadas`);

  console.log("Creando usuarios de ejemplo...");
  const users = await Promise.all([
    prisma.user.create({ data: { nombre: "Carlos", salon: "6-A" } }),
    prisma.user.create({ data: { nombre: "Maria", salon: "6-A" } }),
    prisma.user.create({ data: { nombre: "Diego", salon: "6-B" } }),
    prisma.user.create({ data: { nombre: "Sofia", salon: "5-A" } }),
  ]);

  console.log("Asignando estampas de ejemplo...");
  const allStickers = await prisma.sticker.findMany();

  // Carlos tiene las primeras 60 estampas, 10 repetidas
  const carlosStickers = [];
  for (let i = 0; i < 60; i++) {
    carlosStickers.push({
      userId: users[0].id,
      stickerId: allStickers[i].id,
      cantidad: i < 10 ? 2 : 1,
    });
  }
  await prisma.userSticker.createMany({ data: carlosStickers });

  // Maria tiene estampas 20-120, 15 repetidas
  const mariaStickers = [];
  for (let i = 20; i < 120; i++) {
    mariaStickers.push({
      userId: users[1].id,
      stickerId: allStickers[i].id,
      cantidad: i < 35 ? 2 : 1,
    });
  }
  await prisma.userSticker.createMany({ data: mariaStickers });

  // Diego tiene estampas 50-180, 8 repetidas
  const diegoStickers = [];
  for (let i = 50; i < 180; i++) {
    diegoStickers.push({
      userId: users[2].id,
      stickerId: allStickers[i].id,
      cantidad: i >= 50 && i < 58 ? 2 : 1,
    });
  }
  await prisma.userSticker.createMany({ data: diegoStickers });

  // Sofia tiene estampas 100-250, 12 repetidas
  const sofiaStickers = [];
  for (let i = 100; i < Math.min(250, allStickers.length); i++) {
    sofiaStickers.push({
      userId: users[3].id,
      stickerId: allStickers[i].id,
      cantidad: i >= 100 && i < 112 ? 2 : 1,
    });
  }
  await prisma.userSticker.createMany({ data: sofiaStickers });

  // Crear un intercambio de ejemplo
  await prisma.trade.create({
    data: {
      fromUserId: users[1].id,
      toUserId: users[0].id,
      offerStickerId: allStickers[25].id,
      requestStickerId: allStickers[5].id,
      status: "pending",
    },
  });

  // Crear mensajes de ejemplo
  await prisma.message.create({
    data: {
      senderId: users[1].id,
      receiverId: users[0].id,
      content: "Hola Carlos! Vi que tienes la de Messi repetida, te la cambio?",
    },
  });
  await prisma.message.create({
    data: {
      senderId: users[0].id,
      receiverId: users[1].id,
      content: "Hola Maria! Si, que me ofreces?",
    },
  });

  const stickerCount = await prisma.sticker.count();
  const userCount = await prisma.user.count();
  console.log(`Seed completado: ${stickerCount} estampas (${equipos.length} equipos), ${userCount} usuarios`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
