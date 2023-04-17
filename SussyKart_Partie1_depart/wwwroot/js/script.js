
let gCourseEnCours = false;
let gNbJoueurs = 0;

let gJoueurs; 
let gOmbres; 
let gVitesseJoueurs = [0, 0, 0, 0];
let gTours = [1, 1, 1, 1];      

let gChronometre = 0; 
let gPlanificateurChrono;

const gNB_DE_TOURS = 4;     
const gVITESSE_MAXIMALE = 12;

// Écouteurs d'événements
function init() {

    // Remplir le tableau des joueurs et des ombres
    gJoueurs = document.querySelectorAll(".joueur");
    gOmbres = document.querySelectorAll(".ombre");

    // Boutons pour préparer, lancer et annuler la partie
    document.querySelector("#one").addEventListener("click", preparerJeuSolo);
    document.querySelector("#two").addEventListener("click", preparerJeuDuo);
    document.querySelector("#three").addEventListener("click", preparerJeuTrio);
    document.querySelector("#four").addEventListener("click", preparerJeuQuatuor);
    document.querySelector("#stop").addEventListener("click", finCourse)
    document.querySelector("#go").addEventListener("click", lancerCourse);
    document.querySelector("#raceChoice1").addEventListener("click", function () { choixCourse(1) });
    document.querySelector("#raceChoice2").addEventListener("click", function () { choixCourse(2) });
    document.querySelector("#raceChoice3").addEventListener("click", function () { choixCourse(3) });
    document.querySelector("#raceChoice4").addEventListener("click", function () { choixCourse(4) });
    document.querySelector("#raceChoice5").addEventListener("click", function () { choixCourse(5) });
    document.querySelector("#raceChoice6").addEventListener("click", function () { choixCourse(6) });
    formScore = document.forms["formJeu"];
    // Autres écouteurs événements et planificateurs (à ignorer)
    planificateurs();
}


function cacherOuAfficherElements(classeCommune, valeurDisplay) {
    let elements = document.querySelectorAll(classeCommune);
    for (let e of elements) {
        e.style.display = valeurDisplay;
    }
}


function preparerCourse(nombreDeJoueurs) {

    for (let index = 0; index < nombreDeJoueurs; index += 1) {
        afficherJoueurEtSonOmbre(index);
        document.querySelector("#controls" + index).style.display = "inline-block";
    }
    document.querySelector("#formJeu").style.display = "none";
    cacherOuAfficherElements(".preparation", "none");

    document.querySelector("#go").style.display = "block";
    document.querySelector("#stop").style.display = "block";

    placerJoueurs(nombreDeJoueurs);
    gNbJoueurs = nombreDeJoueurs;
    gChronometre = 0;
    document.querySelector("#chrono").textContent = affichageChrono();

    document.querySelector("#scores").style.display = "none";

}


function preparerJeuSolo() {
    preparerCourse(1);
}

function preparerJeuDuo() {
    preparerCourse(2);
}

function preparerJeuTrio() {
    preparerCourse(3);
}

function preparerJeuQuatuor() {
    preparerCourse(4);
}

function lancerCourse() {
    document.querySelector("#go").style.display = "none";
    gPlanificateurChrono = setInterval(augmenterChrono, 1000);
    gCourseEnCours = true;
    for (let index = 0; index < gNbJoueurs; index += 1) {
        afficherJoueurEtSonOmbre(index);
        document.querySelector("#controls" + index).style.display = "none";
    }
}

function augmenterChrono() {
    gChronometre += 1;
    document.querySelector("#chrono").textContent = affichageChrono();
}

function courseEstElleFinie() {
    for (let t of gTours) {
        if (t <= races[raceChoice].nbTours) {
            return false;
        }
    }
    return true;
}

function finCourse() {
    for (let index = 0; index < gNbJoueurs; index += 1) {
        cacherJoueurEtSonOmbre(index);
        document.querySelector("#controls" + index).style.display = "none";
    }

    cacherOuAfficherElements(".preparation", "block");
    cacherOuAfficherElements(".tour", "none");
    retirerItems();

    document.querySelector("#go").style.display = "none";
    document.querySelector("#stop").style.display = "none";
    document.querySelector("#formJeu").style.display = "none";
    gCourseEnCours = false;
    clearInterval(gPlanificateurChrono);
}


function ajouterSuffixePosition(p) {
    if (p == 1) {
        return "1er";
    }
    else {
        return p + "e";
    }
}



function scoreDuJoueur(place, chrono) {
    return " " + place + " - " + chrono;
}


function afficherScores(positions, temps) {
    for (let index = 0; index < gNbJoueurs; index += 1) {
        let positionDuJoueur = positions[index];
        let positionAvecSuffixe = ajouterSuffixePosition(positionDuJoueur);
        let score = scoreDuJoueur(positionAvecSuffixe, temps[index]);
        document.querySelector("#scoreJoueur" + index).textContent = score;
        document.querySelector("#score" + index).style.display = "block";
    }

    for (let index = gNbJoueurs; index < 4; index += 1) {
        document.querySelector("#score" + index).style.display = "none";
    }

    document.querySelector("#formJeu").style.display = "block";
    document.querySelector("#scores").style.display = "block";
    formScore.elements["Position"].value = placeJoueur1;
    formScore.elements["NbJoueurs"].value = gNbJoueurs;
    console.log(chronoJoueur1);
    formScore.elements["Chrono"].value = chronoJoueur1;
    formScore.elements["NomCourse"].value = nomCourses[raceChoice];
    
}

function leJoueurRecule(v) {
    if (v < 0) {
        return true;
    }
    else {
        return false;
    }
}

function boosterLeJoueur(indexJoueur, xTapis, yTapis, xJoueur, yJoueur) {
    if (xJoueur > xTapis - 17 && xJoueur < xTapis + 16 &&
        yJoueur > yTapis - 17 && yJoueur < yTapis + 16) {
        let vitesse = gVitesseJoueurs[indexJoueur];
        if (leJoueurRecule(vitesse)) {
            gVitesseJoueurs[indexJoueur] -= 9;
        }
        else {
            gVitesseJoueurs[indexJoueur] += 9;
        }
        gJoueurs[indexJoueur].classList.add("boost");
        setTimeout(finBoost, 500, indexJoueur);
    }

}


function distanceEntreJoueurs(joueurA, joueurB) {
    let xA = parseInt(joueurA.style.left);
    let yA = parseInt(joueurA.style.top);
    let xB = parseInt(joueurB.style.left);
    let yB = parseInt(joueurB.style.top);
    let distance = distanceEntreDeuxPositions(xA, yA, xB, yB);
    return distance;
}


function verifierCollision(index1, index2) {

    let d = distanceEntreJoueurs(gJoueurs[index1], gJoueurs[index2]);
    if (d < 23) {
        joueurAccident(index1);
        joueurAccident(index2);
    }


}

function cacherWow() {

    document.querySelector("#wow").classList.add("invisible");
}

function noScopeWow(indexDuJoueur) {
    if (document.querySelector("#wow").classList.contains("invisible")) {
        let joueur = gJoueurs[indexDuJoueur]
        let x = parseInt(joueur.style.left);
        let y = parseInt(joueur.style.top);
        document.querySelector("#wow").style.left = x - 20 + "px"
        document.querySelector("#wow").style.top = y - 20 + "px"
        document.querySelector("#wow").classList.remove("invisible");
        setTimeout(cacherWow, 800);
    }

}

// Affiche le joueur et l'ombre sous lui
function afficherJoueurEtSonOmbre(n) {
    gJoueurs[n].style.display = "block";
    gOmbres[n].style.display = "block";
}

// Cache le joueur et l'ombre sous lui
function cacherJoueurEtSonOmbre(n) {
    gJoueurs[n].style.display = "none";
    gOmbres[n].style.display = "none";
}

// À partir de gChronometre, retourne une valeur avec le format "03:14"
function affichageChrono() {
    let seconds = gChronometre % 60;
    let minutes = (gChronometre - seconds) / 60;
    return (minutes < 10 ? "0" : "") + minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
}

// Retire la classe qui fait briller le joueur
function finBoost(index) {
    gJoueurs[index].classList.remove("boost");
}

// Retourne la distance en pixels entre deux points (x, y)
function distanceEntreDeuxPositions(x1, y1, x2, y2) {
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}

// Place les joueurs derrière la ligne d'arrivée pour le début de la course
function placerJoueurs(n) {
    for (let index = 0; index < n; index += 1) {
        affichageTours[index].style.display = "block";
        let point = races[raceChoice].spawns[index];
        players[index].place(races[raceChoice].spawnRotation, point.x, point.y);
        players[index].speed = 0; // █???█
        gVitesseJoueurs[index] = 0; // █???█
        players[index].score = 0;
        gTours[index] = 1;
        affichageTourJoueurs[index].textContent = " 1/" + races[raceChoice].nbTours;
        players[index].hasCrashed = false;
        players[index].checkpointMarker = 0;
    }
    for (let index = n; index < 4; index += 1) {
        gTours[index] = races[raceChoice].nbTours + 1;
    }
    places = [0, 0, 0, 0];
    let boxes = races[raceChoice].boxes;
    for (let b of boxes) {
        b.display();
    }
}

// Remplace l'image du joueur par une explosion et le ramène au dernier checkpoint après une seconde
function joueurAccident(i) {
    if (players[i].starCooldown == 0) {
        players[i].crash();
        gVitesseJoueurs[i] = 0; // █???█
    }
}

function retirerItems() {
    for (let p of players) {
        p.item = null;
        document.querySelector("#item" + (p.playerNum - 1)).style.display = "none";
        p.starCooldown = 0;
        p.bananaCooldown = 0;
    }
    for (let i = 0; i < 10; i++) {
        document.querySelector("#banana" + i).style.display = "none";
    }
    bananas = [];
    for (let i = 0; i < 6; i++) {
        document.querySelector("#box" + i).style.display = "none";
    }
    boxes = [];
    for (let i = 0; i < 4; i++) {
        document.querySelector("#rocket" + i).style.display = "none";
    }
    rockets = [];
}

function choixCourse(courseId) {
    finCourse();
    document.querySelector("#formJeu").style.display = "none";
    for (let i = 1; i < 7; i++) {
        if (i == courseId) {
            document.querySelector("#race" + i).style.display = "block";
        }
        else {
            document.querySelector("#race" + i).style.display = "none";
        }
    }
    raceChoice = courseId - 1;
}