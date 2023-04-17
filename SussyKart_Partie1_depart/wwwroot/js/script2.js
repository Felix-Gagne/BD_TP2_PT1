let players = [];
let bananas = [];
let bananaIndex = 0;
let rockets = [];
let rocketIndex = 0;
let races = [];
let raceChoice = 0;
let formScore;
let nomCourses = ["Donut", "8 Classique", "Détours Confondants", "Bébé Circuit", "Sentier Couronne", "Bretzel Anguleux"]

let affichageTours;
let affichageTourJoueurs;
let places = [0, 0, 0, 0], times = ["", "", "", ""];
let chronoJoueur1 = 0;
let placeJoueur1 = 1;

function planificateurs() {
    document.addEventListener("keydown", appuyerTouches);
    document.addEventListener("keyup", relacherTouches);
    affichageTours = document.querySelectorAll(".tour");
    affichageTourJoueurs = document.querySelectorAll(".tourJoueur");
    setInterval(deplacements, 75);
    createPlayers();
    prepareRaces();
    hideBoxes();
}

function verifierCheckpoints() {
    for (let index = 0; index < gNbJoueurs; index += 1) {
        let player = players[index];
        let c = races[raceChoice].checkpoints[(player.checkpointMarker + 1) % races[raceChoice].checkpoints.length];
        if (c.rectangleArea.isPointInRectangle(player.getLocation())) {
            player.checkpointMarker = c.milestone;
            player.score++;
            if (c.milestone == 0) {
                gTours[index] += 1;
                affichageTourJoueurs[index].textContent = " " + (gTours[index] <= races[raceChoice].nbTours ? gTours[index] + "/" + races[raceChoice].nbTours : "Fini !");
                if (gTours[index] > races[raceChoice].nbTours) {
                    cacherJoueurEtSonOmbre(index);
                    players[index].item = null;
                    gJoueurs[index].style.left = "0px";
                    document.querySelector("#item" + index).style.display = "none";
                    gVitesseJoueurs[index] = 0;
                    player.speed = 0; // ██???██
                    player.keyControls.deactivateAll();
                    places[index] = Math.max(...places) + 1;
                    times[index] = affichageChrono();
                    if (index == 0) {
                        console.log(gChronometre);
                        chronoJoueur1 = gChronometre;
                        placeJoueur1 = places[index];
                    }
                    if (courseEstElleFinie()) {
                        trierScores();
                        finCourse();
                        afficherScores(places, times);
                        console.log("Le joueur " + (index + 1) + " a fait son dernier tour et la course est terminée ! 🏁")
                    }
                    else {
                        console.log("Le joueur " + (index + 1) + " a terminé la course ! 🛸");
                    }
                }
            }
        }
    }
}

function verifierItems() {
    for (let index = 0; index < gNbJoueurs; index += 1) {
        let player = players[index];
        let race = races[raceChoice];
        if (player.item != null && player.itemCooldown > 0) {
            player.itemCooldown -= 1;
            if (player.itemCooldown == 0) {
                switch (getPosition(index)) {
                    case 1:
                        player.item = "banana";
                        break;
                    case 2:
                        player.item = Math.random() < 0.5 ? "mushroom" : "rocket";
                        break;
                    default:
                        player.item = Math.random() < 0.5 ? "mushroom" : "star";
                }
                document.querySelector("#item" + index).src = "/images/" + player.item + ".png";
            }
        }
        for (let boxIndex = 0; boxIndex < race.boxes.length; boxIndex++) {
            let box = race.boxes[boxIndex];
            if (!box.isBroken && box.circleArea.isPointInCircle(player.getLocation())) {
                box.break();
                if (player.item == null) {
                    player.item = "wait";
                    player.itemCooldown = 20;
                    // Item au-dessus de la tête
                    document.querySelector("#item" + index).style.display = "block";
                    document.querySelector("#item" + index).src = "/images/itemWait.gif";
                }
            }
        }
    }
}

function verifierBananes() {
    for (let index = 0; index < gNbJoueurs; index += 1) {
        for (let i = bananas.length - 1; i >= 0; i--) {
            if (bananas[i].circleArea.isPointInCircle(players[index].getLocation())) {
                let banana = document.querySelector("#banana" + bananas[i].num);
                banana.style.display = "none";
                bananas.splice(i, 1);
                if (players[index].starCooldown == 0) {
                    players[index].disturb();
                }
                break;
            }
        }
    }
}

function verifierFusees() {
    for (let i = rockets.length - 1; i >= 0; i--) {
        rockets[i].move();
        if (rockets[i].rocketHealth <= 0 || !rockets[i].positionValide) {
            let rocket = document.querySelector("#rocket" + rockets[i].num);
            rocket.style.display = "none";
            rockets.splice(i, 1);
            continue;
        }
        for (let index = 0; index < gNbJoueurs; index += 1) {
            if (rockets[i].circleArea.isPointInCircle(players[index].getLocation())) {
                let rocket = document.querySelector("#rocket" + rockets[i].num);
                rocket.style.display = "none";
                rockets.splice(i, 1);
                if (players[index].starCooldown == 0) {
                    players[index].crash();
                }
                break;
            }
        }
    }
}

function getPosition(index) {
    let playerScore = players[index].score;
    let scores = [players[0].score, players[1].score, players[2].score, players[3].score];
    let min = 100;
    let max = 0;
    for (let i = 0; i < scores.length; i++) {
        if (scores[i] > max) {
            max = scores[i];
        }
        if (scores[i] < min) {
            min = scores[i];
        }
    }
    return playerScore == min ? 3 : (playerScore == max ? 1 : 2);
}

function trierScores() {
    let playerNums = [1, 2, 3, 4];
    for (let i = 0; i < gNbJoueurs - 1; i++) {
        let minIndex = i;
        for (let j = i + 1; j < gNbJoueurs; j++) {
            if (places[minIndex] > places[j]) {
                minIndex = j;
            }
        }
        invertDataInArray(places, i, minIndex);
        invertDataInArray(times, i, minIndex);
        invertDataInArray(playerNums, i, minIndex);
    }
    let elements = document.querySelectorAll("[id^=score] img");
    for (let i = 0; i < gNbJoueurs; i++) {
        elements[i].src = "/images/p" + playerNums[i] + "Down.png";
    }
}

function invertDataInArray(array, index1, index2) {
    let temp = array[index1];
    array[index1] = array[index2];
    array[index2] = temp;
}

function horsCourse() {
    for (let index = 0; index < gNbJoueurs; index += 1) {
        let player = players[index];
        let point = new Point(player.getLocation().x + 14, player.getLocation().y + 18)
        if (gTours[index] <= races[raceChoice].nbTours && !player.hasCrashed && !races[raceChoice].isPointSafe(point)) {
            player.crash();
            console.log("Accident !");
        }
    }
}

function appuyerTouches(e) {
    if (e.key == "ArrowUp" || e.key == "ArrowDown" || e.key == "ArrowLeft" || e.key == "ArrowRight")
        e.preventDefault();
    gererTouches(e.key, true);
}

function relacherTouches(e) {
    gererTouches(e.key, false);
}

function gererTouches(touche, bool) {
    if (!gCourseEnCours)
        return;
    for (let index = 0; index < gNbJoueurs; index += 1) {
        players[index].updateKeys(touche, bool);
    }
}

function deplacements() {
    if (!gCourseEnCours)
        return;
    verifierCheckpoints();
    verifierItems();
    verifierBananes();
    verifierFusees();
    horsCourse();
    for (let index = 0; index < gNbJoueurs; index += 1) {
        if (players[index].hasCrashed)
            continue;
        let vitesse = gVitesseJoueurs[index]; // ██???██
        vitesse = players[index].speed;
        vitesse = players[index].getNewSpeed(vitesse);
        players[index].rotate();
        players[index].activateItem();
        players[index].moveForward(vitesse);
        for (let i = index + 1; i < gNbJoueurs; i++) {
            if (!players[i].isImmune && !players[index].isImmune && gTours[i] <= gNB_DE_TOURS && gTours[index] <= gNB_DE_TOURS)
                verifierCollision(index, i);
        }
    }
}

function prepareRaces() {
    let offSets = [new Point(175, 150)];
    races = [
        new Race(
            // Safe circle areas
            [new CircleArea(new Point(153 + offSets[0].x, 152 + offSets[0].y), 149), new CircleArea(new Point(302 + offSets[0].x, 152 + offSets[0].y), 149)], // Two big circles
            // Safe triangle areas
            [],
            // Safe rectangle areas
            [new RectangleArea(new Point(143 + offSets[0].x, 3 + offSets[0].y), new Point(312 + offSets[0].x, 302 + offSets[0].y))], // Big rectangle
            // Circle holes
            [new CircleArea(new Point(153 + offSets[0].x, 152 + offSets[0].y), 25), new CircleArea(new Point(302 + offSets[0].x, 152 + offSets[0].y), 25)], // Two small circle holes
            // Triangle holes
            [],
            // Rectangle holes
            [new RectangleArea(new Point(149 + offSets[0].x, 126 + offSets[0].y), new Point(302 + offSets[0].x, 177 + offSets[0].y))], // Small rectangle hole
            // Checkpoints
            [
                new CheckPoint(new Point(258 - 14 + offSets[0].x, 62 - 14 + offSets[0].y), new RectangleArea(new Point(211 + offSets[0].x, -15 + offSets[0].y), new Point(292 + offSets[0].x, 127 + offSets[0].y)), 0, 12),
                new CheckPoint(new Point(389 - 14 + offSets[0].x, 149 - 14 + offSets[0].y), new RectangleArea(new Point(306 + offSets[0].x, 125 + offSets[0].y), new Point(454 + offSets[0].x, 186 + offSets[0].y)), 1, 0),
                new CheckPoint(new Point(209 - 14 + offSets[0].x, 235 - 14 + offSets[0].y), new RectangleArea(new Point(169 + offSets[0].x, 155 + offSets[0].y), new Point(248 + offSets[0].x, 304 + offSets[0].y)), 2, 4),
                new CheckPoint(new Point(69 - 14 + offSets[0].x, 150 - 14 + offSets[0].y), new RectangleArea(new Point(0 + offSets[0].x, 126 + offSets[0].y), new Point(148 + offSets[0].x, 179 + offSets[0].y)), 3, 8)
            ],
            // Spawns
            [new Point(196 + offSets[0].x - 14, 20 + offSets[0].y - 14), new Point(171 + offSets[0].x - 14, 45 + offSets[0].y - 14), new Point(146 + offSets[0].x - 14, 70 + offSets[0].y - 14), new Point(121 + offSets[0].x - 14, 95 + offSets[0].y - 14)],
            // Spawn rotation (Right)
            12,
            // Speed pads
            [],
            // Race HTML <img>
            document.querySelector("#race1"),
            // Item boxes
            [
                new ItemBox(new CircleArea(new Point(380 + 11, 330 + 14), 20), document.querySelector("#box0")),
                new ItemBox(new CircleArea(new Point(380 + 11, 380 + 14), 20), document.querySelector("#box1")),
                new ItemBox(new CircleArea(new Point(188 + 11, 270 + 14), 20), document.querySelector("#box2")),
                new ItemBox(new CircleArea(new Point(573 + 11, 270 + 14), 20), document.querySelector("#box3"))
            ],
            5
        ),
        new Race(
            // Safe circle areas
            [new CircleArea(new Point(300, 400), 150), new CircleArea(new Point(500, 200), 150)],
            // Safe triangle areas
            [],
            // Safe rectangle areas
            [new RectangleArea(new Point(350, 200), new Point(449, 399)), new RectangleArea(new Point(300, 250), new Point(499, 349))],
            // Circle holes
            [new CircleArea(new Point(300, 400), 50), new CircleArea(new Point(500, 200), 50)],
            // Triangle holes
            [new TriangleArea(new Point(300, 350), new Point(349, 350), new Point(349, 399)), new TriangleArea(new Point(450, 200), new Point(450, 249), new Point(499, 249))],
            // Rectangle holes
            [],
            // Checkpoints
            [
                new CheckPoint(new Point(463, 262), new RectangleArea(new Point(462, 232), new Point(518, 369)), 0, 12),
                new CheckPoint(new Point(600, 180), new RectangleArea(new Point(531, 167), new Point(664, 223)), 1, 8),
                new CheckPoint(new Point(485, 65), new RectangleArea(new Point(470, 29), new Point(528, 168)), 2, 4),
                new CheckPoint(new Point(365, 210), new RectangleArea(new Point(334, 190), new Point(463, 245)), 3, 0),
                new CheckPoint(new Point(400, 385), new RectangleArea(new Point(338, 362), new Point(459, 417)), 4, 0),
                new CheckPoint(new Point(285, 500), new RectangleArea(new Point(271, 423), new Point(325, 558)), 5, 4),
                new CheckPoint(new Point(165, 385), new RectangleArea(new Point(138, 359), new Point(268, 423)), 6, 8),
                new CheckPoint(new Point(290, 260), new RectangleArea(new Point(278, 229), new Point(331, 362)), 7, 12)
            ],
            // Spawns
            [new Point(434, 300), new Point(406, 285), new Point(378, 270), new Point(350, 253)],
            // Spawn rotation
            12,
            // Speed pads
            [],
            // Race HTML <img>
            document.querySelector("#race2"),
            // Item boxes
            [
                new ItemBox(new CircleArea(new Point(527 + 11, 103 + 14), 20), document.querySelector("#box0")),
                new ItemBox(new CircleArea(new Point(557 + 11, 73 + 14), 20), document.querySelector("#box1")),
                new ItemBox(new CircleArea(new Point(220 + 11, 415 + 14), 20), document.querySelector("#box2")),
                new ItemBox(new CircleArea(new Point(190 + 11, 445 + 14), 20), document.querySelector("#box3"))
            ],
            3
        ),
        new Race(
            // Safe circle areas
            [new CircleArea(new Point(200, 260), 100), new CircleArea(new Point(600, 340), 100)],
            // Safe triangle areas
            [],
            // Safe rectangle areas
            [new RectangleArea(new Point(200, 240), new Point(599, 359))],
            // Circle holes
            [new CircleArea(new Point(200, 260), 25), new CircleArea(new Point(600, 340), 25)],
            // Triangle holes
            [],
            // Rectangle holes
            [],
            // Checkpoints
            [
                new CheckPoint(new Point(384, 267), new RectangleArea(new Point(383, 221), new Point(425, 365)), 0, 12),
                new CheckPoint(new Point(580, 254), new RectangleArea(new Point(579, 217), new Point(621, 331)), 1, 12),
                new CheckPoint(new Point(585, 390), new RectangleArea(new Point(579, 332), new Point(621, 450)), 2, 4),
                new CheckPoint(new Point(475, 315), new RectangleArea(new Point(475, 220), new Point(509, 364)), 3, 4),
                new CheckPoint(new Point(290, 315), new RectangleArea(new Point(288, 220), new Point(325, 365)), 4, 4),
                new CheckPoint(new Point(182, 312), new RectangleArea(new Point(181, 251), new Point(219, 369)), 5, 4),
                new CheckPoint(new Point(183, 168), new RectangleArea(new Point(182, 142), new Point(220, 251)), 6, 12)
            ],
            // Spawns
            [new Point(343, 266), new Point(343, 294), new Point(355, 238), new Point(355, 322)],
            // Spawn rotation
            12,
            // Speed pads
            [],
            // Race HTML <img>
            document.querySelector("#race3"),
            // Item boxes
            [
                new ItemBox(new CircleArea(new Point(209 + 11, 257 + 14), 20), document.querySelector("#box0")),
                new ItemBox(new CircleArea(new Point(544 + 11, 281 + 14), 20), document.querySelector("#box1")),
                new ItemBox(new CircleArea(new Point(115 + 11, 171 + 14), 20), document.querySelector("#box2")),
                new ItemBox(new CircleArea(new Point(633 + 11, 363 + 14), 20), document.querySelector("#box3"))
            ],
            4
        ),
        new Race(
            // Safe circle areas
            [],
            // Safe triangle areas
            [],
            // Safe rectangle areas
            [
                new RectangleArea(new Point(300, 200), new Point(499, 399))
            ],
            // Circle holes
            [],
            // Triangle holes
            [],
            // Rectangle holes
            [
                new RectangleArea(new Point(378, 278), new Point(421, 321))
            ],
            // Checkpoints
            [
                new CheckPoint(new Point(400, 220), new RectangleArea(new Point(384, 179), new Point(415, 288)), 0, 12),
                new CheckPoint(new Point(400, 360), new RectangleArea(new Point(380, 300), new Point(420, 410)), 1, 4)
            ],
            // Spawns
            [
                new Point(346, 230),
                new Point(358, 201),
                new Point(329, 201),
                new Point(317, 230)
            ],
            // Spawn rotation
            12,
            // Speed pads
            [],
            // Race HTML <img>
            document.querySelector("#race4"),
            // Item boxes
            [
                new ItemBox(new CircleArea(new Point(453 + 11, 190 + 14), 20), document.querySelector("#box0")),
                new ItemBox(new CircleArea(new Point(303 + 11, 343 + 14), 20), document.querySelector("#box1"))
            ],
            10
        ),
        new Race(
            // Safe circle areas
            [
                new CircleArea(new Point(287, 190), 100),
                new CircleArea(new Point(287, 415), 100),
                new CircleArea(new Point(512, 415), 100),
                new CircleArea(new Point(512, 190), 100)
            ],
            // Safe triangle areas
            [],
            // Safe rectangle areas
            [
                new RectangleArea(new Point(188, 200), new Point(262, 414)),
                new RectangleArea(new Point(288, 441), new Point(511, 515)),
                new RectangleArea(new Point(313, 216), new Point(511, 290)),
                new RectangleArea(new Point(413, 191), new Point(487, 390)),
                new RectangleArea(new Point(413, 316), new Point(511, 390)),
                new RectangleArea(new Point(313, 191), new Point(386, 290))
            ],
            // Circle holes
            [
                new CircleArea(new Point(287, 190), 25),
                new CircleArea(new Point(287, 415), 25),
                new CircleArea(new Point(512, 415), 25),
                new CircleArea(new Point(512, 190), 25)
            ],
            // Triangle holes
            [],
            // Rectangle holes
            [
                new RectangleArea(new Point(263, 191), new Point(312, 414)),
                new RectangleArea(new Point(288, 391), new Point(511, 440)),
                new RectangleArea(new Point(313, 291), new Point(412, 390)),
                new RectangleArea(new Point(488, 191), new Point(511, 215))
            ],
            // Checkpoints
            [
                new CheckPoint(new Point(412, 471), new RectangleArea(new Point(411, 415), new Point(460, 521)), 0, 12),
                new CheckPoint(new Point(584, 399), new RectangleArea(new Point(521, 396), new Point(625, 431)), 1, 8),
                new CheckPoint(new Point(422, 289), new RectangleArea(new Point(407, 277), new Point(497, 313)), 2, 8),
                new CheckPoint(new Point(495, 94), new RectangleArea(new Point(487, 63), new Point(530, 177)), 3, 12),
                new CheckPoint(new Point(582, 170), new RectangleArea(new Point(520, 169), new Point(619, 224)), 4, 0),
                new CheckPoint(new Point(393, 248), new RectangleArea(new Point(391, 191), new Point(436, 293)), 5, 4),
                new CheckPoint(new Point(274, 94), new RectangleArea(new Point(266, 62), new Point(309, 181)), 6, 4),
                new CheckPoint(new Point(195, 385), new RectangleArea(new Point(182, 365), new Point(267, 413)), 7, 0),
            ],
            // Spawns
            [
                new Point(385, 471),
                new Point(357, 443),
                new Point(357, 471),
                new Point(329, 443)
            ],
            // Spawn rotation
            12,
            // Speed pads
            [],
            // Race HTML <img>
            document.querySelector("#race5"),
            // Item boxes
            [
                new ItemBox(new CircleArea(new Point(429, 343), 20), document.querySelector("#box0")),
                new ItemBox(new CircleArea(new Point(455, 317), 20), document.querySelector("#box1")),
                new ItemBox(new CircleArea(new Point(328, 244), 20), document.querySelector("#box2")),
                new ItemBox(new CircleArea(new Point(354, 218), 20), document.querySelector("#box3")),
                new ItemBox(new CircleArea(new Point(213, 447), 20), document.querySelector("#box4")),
                new ItemBox(new CircleArea(new Point(240, 422), 20), document.querySelector("#box5"))
            ],
            3
        ),
        new Race(
            // Safe circle areas
            [],
            // Safe triangle areas
            [],
            // Safe rectangle areas
            [
                new RectangleArea(new Point(100, 100), new Point(699, 199)),
                new RectangleArea(new Point(100, 300), new Point(399, 400)),
                new RectangleArea(new Point(300, 399), new Point(699, 499)),
                new RectangleArea(new Point(396, 300), new Point(603, 329)),
                new RectangleArea(new Point(100, 100), new Point(199, 399)),
                new RectangleArea(new Point(600, 100), new Point(699, 499)),
                new RectangleArea(new Point(271, 196), new Point(301, 303))
            ],
            // Circle holes
            [],
            // Triangle holes
            [],
            // Rectangle holes
            [
                new RectangleArea(new Point(200, 200), new Point(270, 299)),
                new RectangleArea(new Point(300, 200), new Point(599, 299)),
                new RectangleArea(new Point(400, 330), new Point(599, 399))
            ],
            // Checkpoints
            [
                new CheckPoint(new Point(532, 109), new RectangleArea(new Point(530, 73), new Point(578, 202)), 0, 12),
                new CheckPoint(new Point(666, 300), new RectangleArea(new Point(584, 266), new Point(705, 340)), 1, 0),
                new CheckPoint(new Point(417, 448), new RectangleArea(new Point(417, 274), new Point(466, 506)), 2, 4),
                new CheckPoint(new Point(112, 224), new RectangleArea(new Point(89, 223), new Point(309, 275)), 3, 8),
                new CheckPoint(new Point(338, 104), new RectangleArea(new Point(337, 71), new Point(386, 206)), 4, 12)
            ],
            // Spawns
            [
                new Point(502, 101),
                new Point(474, 119),
                new Point(446, 138),
                new Point(418, 156)
            ],
            // Spawn rotation
            12,
            // Speed pads
            [],
            // Race HTML <img>
            document.querySelector("#race6"),
            // Item boxes
            [
                new ItemBox(new CircleArea(new Point(618, 211), 20), document.querySelector("#box0")),
                new ItemBox(new CircleArea(new Point(660, 211), 20), document.querySelector("#box1")),
                new ItemBox(new CircleArea(new Point(317, 378), 20), document.querySelector("#box2")),
                new ItemBox(new CircleArea(new Point(360, 378), 20), document.querySelector("#box3")),
                new ItemBox(new CircleArea(new Point(224, 150), 20), document.querySelector("#box4")),
                new ItemBox(new CircleArea(new Point(224, 110), 20), document.querySelector("#box5"))
            ],
            3
        )
    ];

}

function createPlayers() {
    players = [
        new PlayerData(new KeyControls("ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"), gJoueurs[0], gOmbres[0], 1),
        new PlayerData(new KeyControls("a", "d", "w", "s"), gJoueurs[1], gOmbres[1], 2),
        new PlayerData(new KeyControls("j", "l", "i", "k"), gJoueurs[2], gOmbres[2], 3),
        new PlayerData(new KeyControls("4", "6", "8", "5"), gJoueurs[3], gOmbres[3], 4)
    ];
}

function hideBoxes() {
    let boxes = races[raceChoice].boxes;
    for (let i = boxes.length; i < 6; i++) {
        document.querySelector("#box" + i).style.display = "none";
        document.querySelector("#box" + i).style.left = "0px";
        document.querySelector("#box" + i).style.ltop = "0px";
    }
}