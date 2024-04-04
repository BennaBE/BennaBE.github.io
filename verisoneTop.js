//dichiarazioni costanti
let WIDTH = 800//larghezza schermo
let HEIGHT = 800//altezza schermo
let WIDTHTASTO = 80//larghezza tasto
let YNOTA = 30//y di default della nota
let XPARTENZA = 50//tutto il gioco è disegnato partendo da questo valore
let NUMTASTI = 7
let DISTANZATASTI = 10//distanza tra un tasto e l'altro
let YTASTO = 400//y di default del tasto
let YLINE = 340//y della linea che indica un aumento di punteggio maggiore
let DISTANZANOTE = 20//distanza delle note(in altezza)

let mode//per capire in che situazione sono(0:schermata start, 1: gioco, 2: game over)
let listaRandom = [] //lista con le posizioni X per le note che possono essere scelte in modo randomico
let gameOver = false
let speed //velocità della discesa delle note
let punteggio
let vita
let cont // contatore che permette di mantenere le note lontane
let imgLivelli; //immagine di livelli
let imgStart; //immagine di pagina iniziale
let imgHome;//immagine del tasto per tornare alla home

function setup() {
    createCanvas(WIDTH, HEIGHT);
    imgStart = loadImage('./img/start.png')
    imgHome = loadImage('./img/home.png')
    imgLivelli = loadImage('./img/livelli.png')
    tastiera = new Tastiera();
    n = new Nota(speed);
    vita = 3
    speed = 1;
    punteggio = 0
    cont = 0;
    mode = 0
    //carico la lista random
    caricaListaRandom(listaRandom, NUMTASTI, DISTANZATASTI, WIDTHTASTO)
}

function draw() {
    frameRate(40);
    
    switch (mode) {
        case 0:
            rect(110, 545, 580, 220)
            background(imgStart)
            break;
        case 1:
            gioco()
            break;
        case 2:
            background(0);
            fill('white');
            rect(150, 100, 500, 220) 
            fill('red'); // Imposta il colore del testo
            textSize(60);
            textAlign(CENTER, CENTER);
            text("RESTART", WIDTH / 2, 200);
            fill('white');
            textSize(80);
            textAlign(CENTER, CENTER);
            text("Game Over!\n Punti: " + punteggio, WIDTH/2, 500);
            break;
        case 4:
            background(imgLivelli)
            break;
    }

    
}

function gioco() {
    n.aggiornaSpeed(speed);
    mode = 1;
    background(15);
    stroke('green');
    line(0, YLINE, WIDTH, YLINE);
    stroke('black');
    if (vita > 0) {
        
        // Disegna gli oggetti
        n.draw();  // Aggiunto il disegno della nota
        tastiera.draw();

        n.down(tastiera.getY()); // Passa la posizione y del tasto a n.down()
        if (tastiera.collisione(n.getX(), n.getY(), n.isVisibile())) {
            n.setColor('green');
            n.kill();
            n = new Nota(speed)
            cont ++
        }

        textSize(32);
        textAlign(CENTER, CENTER);
        text("Punti: " + punteggio, WIDTH / 2, HEIGHT - 33);
        text("Vite: " + vita, WIDTH - 200, HEIGHT - 33);

        if(cont != 0 && cont % 10 ==0 ){
            speed ++
            cont = 0
        }

        tastiera.allNew(); // Imposta tutti i tasti a non premuto
    } else {
        mode = 2;
    }
    image(imgHome, 20, 750); // Immagine per tornare alla home e ricominciare
}



function mousePressed() {
    switch (mode) {
        case 0:
            // Se siamo nella schermata di start e viene cliccata l'area per iniziare il gioco
            if (mouseX >= 110 && mouseX <= 110 + 580 &&
                mouseY >= 545 && mouseY <= 545 + 220) {
                    
                console.log("mode")
                mode=4
                vita = 3
                punteggio = 0
            }
            break;
        case 1:
            rect(20,750,30,30)
            if (mouseX >= 20 && mouseX <= 20+30 &&
                mouseY >= 750 && mouseY <= 750 + 30){
                    mode = 0
                }
            tastiera.mousePressed(n.getX(), n.getY()); // Gestisce il clic della tastiera durante il gioco
            break;
        case 2:
            // Se siamo nella schermata di Game Over e viene cliccato il testo "RESTART"
            if (mouseX >= 150 && mouseX <= 150 + 500 &&
                mouseY >= 100 && mouseY <= 100 + 220) {
                mode = 0; // Imposta la modalità a 0 per tornare alla schermata di start
            }
            break;
        
            case 4:
                if (mouseX >= 70 && mouseX <= 70 + 650 && mouseY >= 45 && mouseY <= 45 + 200) {
                    speed = 5; // Livello facile
                } else if (mouseX >= 70 && mouseX <= 70 + 650 && mouseY >= 300 && mouseY <= 300 + 200) {
                    speed = 8; // Livello medio
                } else {
                    speed = 10; // Livello difficile
                }
                mode = 1; // Imposta la modalità a 1 per avviare il gioco
                break;
            
    }
}


function caricaListaRandom(listaRandom, numTasti, distanzaTasti, widthTasto) {
    /*carico la lista dei possibili valori della x delle note
    i valori sono scelti tramite dei calcoli per mantenere la nota centrale al tasto*/

    let val = XPARTENZA + 15;//val è il valore che può assumere la x(la somma di 15 serve per mantenere il rettangolo della nota centrale)
    //calcolo un numero di possibili valori pari al numero dei tasti
    for (let k = 0; k < numTasti; k++) {
        listaRandom.push(val)//aggiungo il valore alla lista
        val += distanzaTasti + widthTasto
    }
}


//Classe tasto
class Tasto {
    constructor(x) {
        this.x = x;//x del tasto
        this.y = YTASTO;//y del tasto
        this.width = WIDTHTASTO;//larghezza del tasto
        this.height = 4 * this.width;//altezza del tasto
        this.premuto = false; //variabile che indica lo stato del tasto
    }

    draw() {
        // Cambia il colore del tasto in base allo stato
        if (this.premuto) {
            fill(0, 0, 0);
        }
        else
            fill(255, 255, 255);
        //disegno il rettangolo per il tasto
        rect(this.x, this.y, this.width, this.height);
    }

    notPremuto() {
        this.premuto = false//il tasto torna ad avere lo stato "non premuto"
    }

    getWidth() {
        return this.width;
    }

    getX() {
        return this.x;
    }

    getY() {
        return this.y;
    }

    fillTasto() {//imposta lo stato del tasto a premuto
        this.premuto = true;
    }

    isPremuto() {
        return this.premuto;
    }

    verificaCollisioneNota(xNota, yNota) {//verifica se è presente la collisione con il rettangolo di una nota
        return (xNota >= this.x && xNota <= this.x + this.width &&
            yNota >= this.y && yNota <= this.y + this.height);
    }

}


//Classe tastiera
class Tastiera {
    constructor() {
        this.DIM = NUMTASTI;//quantità di tasti
        this.xNewTasto = XPARTENZA;//variabile per modificare le x dei tasti aggiunti
        this.piano = [];//lista di tasti che compongono la tastiera
        this.creaPiano();
    }

    creaPiano() {
        //crea una tastiera settando la 
        for (let k = 0; k < this.DIM; k++) {
            this.piano[k] = new Tasto(this.xNewTasto);
            this.xNewTasto = this.xNewTasto + this.piano[k].getWidth() + DISTANZATASTI;//aggiorna la variabile per mantenere i tasti distanti
        }
    }

    draw() {
        //disegno ogni tasto
        for (let k = 0; k < this.DIM; k++) {
            this.piano[k].draw();
        }
    }

    allNew() {
        for (let k = 0; k < this.DIM; k++) {
            this.piano[k].notPremuto();
        }
    }

    mousePressed(x, y) {
        for (let k = 0; k < this.DIM; k++) {
            //verifica se è stato premuto un tasto e chiama fillTasto se lo è
            if (mouseX >= this.piano[k].getX() && mouseX <= this.piano[k].getX() + this.piano[k].getWidth() &&
                mouseY >= this.piano[k].y && mouseY <= this.piano[k].y + this.piano[k].height) {
                this.piano[k].fillTasto();
            }
        }
    }


    collisione(x, y, stato) {
        if (stato) {
            for (let k = 0; k < this.DIM; k++) {
                //se il piano e il tasto sono allineati gestisco i punti 
                if (x >= this.piano[k].getX() && x <= this.piano[k].getX() + this.piano[k].getWidth()) {
                    if (this.piano[k].isPremuto()) {
                        if ((YLINE - y) < 0) {//la nota è stata premuta sotto la linea
                            punteggio += 5;//più difficile quindi più punti

                        }
                        else {
                            punteggio += 1;
                        }
                        return true
                    }
                    else {
                        //se la y del piano e la y della nota coincidono vuol dire che non è statopremuto il tasto in tempo
                        if (this.piano[k].getY() <= y + 1)
                            vita -= 1//diminuisce una vita
                    }
                }
            }
        }
        return false
    }

    getY() {
        return this.piano[0].getY();
    }
}

//Classe Nota
class Nota {
    constructor(speed) {
        this.width = WIDTHTASTO / 1.5;//larghezza della nota
        this.height = this.width / 2;//altezza della nota
        this.x = random(listaRandom);//la x della nota è scelta in modo casuale
        this.y = YNOTA;//y della nota
        this.speed = speed;//velocità con cui scende la nota
        this.show = true//indica se la nota deve essere mostrata o no
        this.color = 'white'
    }

    draw() {//disegna la nota
        if (this.show) {
            fill(this.color)
            rect(this.x, this.y, this.width, this.height);
        }
    }

    down(pianoY) {
        if (this.show) {
            //pianoY è la variabile che indica la posizione della tastiera
            if (this.y < pianoY)
                //la nota scende
                this.y += this.speed;

            else {
                this.y = YNOTA;//y della nota torna al valore iniziale
                this.setX(random(listaRandom));//x della nota viene impostata in maniera casuale
                this.color = 'white'
            }
        }


    }

    setColor(color) {
        this.color = color
    }
    setX(x) {
        this.x = x;
    }

    getX() {
        return this.x;
    }

    getY() {
        return this.y;
    }

    getWidth() {
        return this.width;
    }

    aggiornaSpeed(speed) {
        this.speed = speed
    }

    kill() {
        this.show = false
    }

    isVisibile() {
        return this.show;
    }
}