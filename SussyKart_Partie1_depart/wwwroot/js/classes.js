class Banana {
    constructor(point, num, rotation) {
        let r = Math.floor(rotation / 2);
        switch (r) {
            case 0:
                point.y -= 28;
                break;
            case 1:
                point.y -= 19;
                point.x += 19;
                break;
            case 2:
                point.x += 28;
                break;
            case 3:
                point.y += 19;
                point.x += 19;
                break;
            case 4:
                point.y += 28;
                break;
            case 5:
                point.y += 19;
                point.x -= 19;
                break;
            case 6:
                point.x -= 28;
                break;
            default:
                point.y -= 19;
                point.x -= 19;
        }
        if (races[raceChoice].isPointSafe(new Point(point.x, point.y))) {
            bananas.push(this);
            this.num = num;
            let banana = document.querySelector("#banana" + this.num);
            banana.style.display = "block";
            banana.style.left = point.x + "px";
            banana.style.top = point.y + "px";
            banana.style.zIndex = point.y;
            this.circleArea = new CircleArea(new Point(point.x, point.y), 20);
        }
    }
}

class Rocket {
    constructor(point, num, rotation) {
        let r = Math.floor(rotation / 2);
        this.rotation = r;
        this.positionValide = true;
        let direction = "Up";
        this.rocketHealth = 30;
        switch (r) {
            case 0:
                point.y += 28;
                direction = "Down";
                break;
            case 1:
                point.y += 19;
                point.x -= 19;
                direction = "DownLeft";
                break;
            case 2:
                point.x -= 28;
                direction = "Left";
                break;
            case 3:
                point.y -= 19;
                point.x -= 19;
                direction = "UpLeft";
                break;
            case 4:
                point.y -= 28;
                direction = "Up";
                break;
            case 5:
                point.y -= 19;
                point.x += 19;
                direction = "UpRight";
                break;
            case 6:
                point.x += 28;
                direction = "Right";
                break;
            default:
                point.y += 19;
                point.x += 19;
                direction = "DownRight";
        }

        rockets.push(this);
        this.num = num;
        let rocket = document.querySelector("#rocket" + this.num);
        rocket.src = "/images/rocket" + direction + ".png";
        rocket.style.display = "block";
        rocket.style.left = point.x + "px";
        rocket.style.top = point.y + "px";
        rocket.style.zIndex = point.y;
        this.circleArea = new CircleArea(new Point(point.x, point.y), 20);
    }

    move() {
        this.rocketHealth -= 1;
        let rocket = document.querySelector("#rocket" + this.num);
        let x = parseInt(rocket.style.left);
        let y = parseInt(rocket.style.top);
        switch (this.rotation) {
            case 0:
                y += 20;
                break;
            case 1:
                x -= 13;
                y += 13;
                break;
            case 2:
                x -= 20;
                break;
            case 3:
                x -= 13;
                y -= 13;
                break;
            case 4:
                y -= 20;
                break;
            case 5:
                y -= 13;
                x += 13;
                break;
            case 6:
                x += 20;
                break;
            default:
                x += 13;
                y += 13;
        }
        this.circleArea.centerPoint.x = x;
        this.circleArea.centerPoint.y = y;
        rocket.style.left = x + "px";
        rocket.style.top = y + "px";
        if (x > 770 || x < 30 || y > 570 || y < 30) {
            this.positionValide = false;
        }
    }
}

class TriangleArea {
    constructor(p1, p2, p3) {
        this.p1 = p1;
        this.p2 = p2;
        this.p3 = p3;
    }

    isPointInTriangle(p) {
        let d1 = this.sign(p, this.p1, this.p2);
        let d2 = this.sign(p, this.p2, this.p3);
        let d3 = this.sign(p, this.p3, this.p1);
        let neg = d1 < 0 || d2 < 0 || d3 < 0;
        let pos = d1 > 0 || d2 > 0 || d3 > 0;
        return !(neg && pos);
    }

    areCoordinatesInTriangle(x, y) {
        return this.isPointInTriangle(new Point(x, y));
    }

    sign(p1, p2, p3) {
        return (p1.x - p3.x) * (p2.y - p3.y) - (p2.x - p3.x) * (p1.y - p3.y);
    }
}

class RectangleArea {
    constructor(p1, p2) {
        this.p1 = p1;
        this.p2 = p2;
    }

    isPointInRectangle(p) {
        return p.x > this.p1.x && p.x < this.p2.x && p.y > this.p1.y && p.y < this.p2.y;
    }

    areCoordinatesInRectangle(x, y) {
        return this.isPointInRectangle(new Point(x, y));
    }
}

class CircleArea {
    constructor(centerPoint, radius) {
        this.centerPoint = centerPoint;
        this.radius = radius;
    }

    isPointInCircle(p) {
        let distance = Math.pow(p.x - this.centerPoint.x, 2) + Math.pow(p.y - this.centerPoint.y, 2);
        return distance < Math.pow(this.radius, 2);
    }

    areCoordinatesInCircle(x, y) {
        return this.isPointInCircle(new Point(x, y));
    }
}

class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

class ItemBox {
    constructor(circleArea, image) {
        this.circleArea = circleArea;
        this.isBroken = false;
        this.image = image;
    }

    display() {
        this.image.style.left = this.circleArea.centerPoint.x + "px";
        this.image.style.top = this.circleArea.centerPoint.y + "px";
        this.image.style.display = "block";
        this.image.style.zIndex = parseInt(this.image.style.top);
    }

    break() {
        this.isBroken = true;
        this.image.style.display = "none";
        setTimeout(this.respawn.bind(this), 3000);
    }

    respawn() {
        this.isBroken = false;
        this.image.style.display = "block";
    }
}

class CheckPoint {
    constructor(spawnPoint, rectangleArea, milestone, rotation) {
        this.spawnPoint = spawnPoint;
        this.rectangleArea = rectangleArea;
        this.milestone = milestone;
        this.rotation = rotation;
    }
}

class PlayerData {
    constructor(keyControls, imgElement, shadowElement, playerNum) {
        this.keyControls = keyControls;
        this.rotation = 12;
        this.scopeBuildUp = 0;
        this.imgElement = imgElement;
        this.shadowElement = shadowElement;
        this.checkpointMarker = 0;
        this.isImmune = false;
        this.immunityPlanificator = null;
        this.playerNum = playerNum;
        this.hasCrashed = false;
        this.speed = 0;
        this.item = null;
        this.itemCooldown = 0;
        this.score = 0;
        this.bananaCooldown = 0;
        this.starCooldown = 0;
    }

    // get left and top styles in a Point
    getLocation() {
        return new Point(parseInt(this.imgElement.style.left + 14), parseInt(this.imgElement.style.top + 14));
    }

    // Turn left or right depending on active keys
    rotate() {
        if (this.keyControls.leftKeyActive) {
            this.rotation = (this.rotation + 15) % 16;
            this.scopeBuildUp += 1;
        }
        else if (this.keyControls.rightKeyActive) {
            this.rotation = (this.rotation + 1) % 16;
            this.scopeBuildUp += 1;
        }
        else {
            this.scopeBuildUp = 0;
        }
        if (this.scopeBuildUp > 15) {
            noScopeWow(this.playerNum - 1);
            this.scopeBuildUp = 0;
        }
    }

    disturb() {
        this.bananaCooldown = 15;
    }

    activateItem() {
        if (this.keyControls.downKeyActive && this.item != null && this.item != "wait") {
            switch (this.item) {
                case "mushroom":
                    this.speed = gVITESSE_MAXIMALE + 15;
                    gJoueurs[(this.playerNum - 1)].classList.add("boost");
                    setTimeout(finBoost, 500, (this.playerNum - 1));
                    break;
                case "banana":
                    let banana = document.querySelector("#banana" + bananaIndex);
                    if (banana.style.display == "block") {
                        bananas.splice(banana.num, 1);
                    }
                    new Banana(this.getLocation(), bananaIndex, this.rotation);
                    bananaIndex = (bananaIndex + 1) % 10;
                    break;
                case "star":
                    this.starCooldown = 50;
                    break;
                case "rocket":
                    let rocket = document.querySelector("#rocket" + rocketIndex);
                    if (rocket.style.display == "block") {
                        rockets.splice(rocket.num, 1);
                    }
                    new Rocket(this.getLocation(), rocketIndex, this.rotation);
                    rocketIndex = (rocketIndex + 1) % 4;
                    break;
            }
            this.item = null;
            document.querySelector("#item" + (this.playerNum - 1)).style.display = "none";
        }
    }

    // reset 360° build up
    resetScopeBuildUp() {
        this.scopeBuildUp = 0;
    }

    // get new speed depending on active keys
    getNewSpeed(speed) {
        if (this.keyControls.upKeyActive) {
            this.speed = speed > (gVITESSE_MAXIMALE + (this.starCooldown > 0 ? 3 : 0)) ? speed - 1 : Math.min((gVITESSE_MAXIMALE + (this.starCooldown > 0 ? 3 : 0)), speed + 1);
        }
        /*else if(this.keyControls.downKeyActive){
            this.speed = speed < gVITESSE_MAXIMALE / -2 ? speed + 1 : Math.max(-1 * gVITESSE_MAXIMALE / 2, speed - 2);
        }*/
        else {
            this.speed = Math.max(0, speed - 1);
        }
        return this.speed;
    }

    // Changes and moves image depending speed and rotation
    moveForward(vitesse) {
        switch (this.rotation) {
            case 0: this.updatePlayer("Down", 0, vitesse); break;
            case 1: vitesse = Math.round(vitesse * 0.85); this.updatePlayer("DownDownLeft", -vitesse / 2, vitesse); break;
            case 2: vitesse = Math.round(vitesse * 0.7); this.updatePlayer("DownLeft", -vitesse, vitesse); break;
            case 3: vitesse = Math.round(vitesse * 0.85); this.updatePlayer("DownLeftLeft", -vitesse, vitesse / 2); break;
            case 4: this.updatePlayer("Left", -vitesse, 0); break;
            case 5: vitesse = Math.round(vitesse * 0.85); this.updatePlayer("UpLeftLeft", -vitesse, -vitesse / 2); break;
            case 6: vitesse = Math.round(vitesse * 0.7); this.updatePlayer("UpLeft", -vitesse, -vitesse); break;
            case 7: vitesse = Math.round(vitesse * 0.85); this.updatePlayer("UpUpLeft", -vitesse / 2, -vitesse); break;
            case 8: this.updatePlayer("Up", 0, -vitesse); break;
            case 9: vitesse = Math.round(vitesse * 0.85); this.updatePlayer("UpUpRight", vitesse / 2, -vitesse); break;
            case 10: vitesse = Math.round(vitesse * 0.7); this.updatePlayer("UpRight", vitesse, -vitesse); break;
            case 11: vitesse = Math.round(vitesse * 0.85); this.updatePlayer("UpRightRight", vitesse, -vitesse / 2); break;
            case 12: this.updatePlayer("Right", vitesse, 0); break;
            case 13: vitesse = Math.round(vitesse * 0.85); this.updatePlayer("DownRightRight", vitesse, vitesse / 2); break;
            case 14: vitesse = Math.round(vitesse * 0.7); this.updatePlayer("DownRight", vitesse, vitesse); break;
            default: vitesse = Math.round(vitesse * 0.85); this.updatePlayer("DownDownRight", vitesse / 2, vitesse);
        }
    }

    // Changes player image and position
    updatePlayer(directionImage, vitesseX, vitesseY) {
        if (this.bananaCooldown > 0) {
            this.rotation = (this.rotation + 3) % 16;
            this.speed = Math.max(0, this.speed - 2);
            this.bananaCooldown -= 1;
        }
        if (this.starCooldown > 0) {
            this.starCooldown -= 1;
        }
        let point = this.getLocation();
        point.x += vitesseX;
        point.y += vitesseY;
        if (this.starCooldown > 0) {
            this.imgElement.src = "/images/p" + directionImage + ".png";
        }
        else {
            this.imgElement.src = "/images/p" + this.playerNum + directionImage + ".png";
        }
        this.imgElement.style.left = point.x + "px";
        this.imgElement.style.top = point.y + "px";
        this.shadowElement.style.left = point.x + "px";
        this.shadowElement.style.top = point.y + 10 + "px";
        this.imgElement.style.zIndex = point.y;
        let item = document.querySelector("#item" + (this.playerNum - 1));
        item.style.left = parseInt(gJoueurs[this.playerNum - 1].style.left) + "px";
        let topValue = parseInt(gJoueurs[this.playerNum - 1].style.top);
        item.style.top = topValue - 18 + "px";
        item.style.zIndex = topValue;
    }

    // Place player and shadow
    place(rotation, x, y) {
        this.rotation = rotation;
        this.imgElement.style.left = x + "px";
        this.imgElement.style.top = y + "px";
        this.imgElement.style.display = "block";
        this.shadowElement.style.left = x + "px";
        this.shadowElement.style.top = y + 10 + "px";
        this.shadowElement.style.display = "block";
        let rotationName = "";
        switch (rotation) {
            case 0: rotationName = "Down"; break;
            case 1: rotationName = "DownDownLeft"; break;
            case 2: rotationName = "DownLeft"; break;
            case 3: rotationName = "DownLeftLeft"; break;
            case 4: rotationName = "Left"; break;
            case 5: rotationName = "UpLeftLeft"; break;
            case 6: rotationName = "UpLeft"; break;
            case 7: rotationName = "UpUpLeft"; break;
            case 8: rotationName = "Up"; break;
            case 9: rotationName = "UpUpRight"; break;
            case 10: rotationName = "UpRight"; break;
            case 11: rotationName = "UpRightRight"; break;
            case 12: rotationName = "Right"; break;
            case 13: rotationName = "DownRightRight"; break;
            case 14: rotationName = "DownRight"; break;
            default: rotationName = "DownDownRight"; break;
        }
    }

    // Updates on / off keys
    updateKeys(keyValue, onOrOff) {
        if (keyValue == this.keyControls.upKey) this.keyControls.upKeyActive = onOrOff;
        if (keyValue == this.keyControls.downKey) this.keyControls.downKeyActive = onOrOff;
        if (keyValue == this.keyControls.leftKey) this.keyControls.leftKeyActive = onOrOff;
        if (keyValue == this.keyControls.rightKey) this.keyControls.rightKeyActive = onOrOff;
    }

    crash() {
        this.bananaCooldown = 0;
        this.starCooldown = 0;
        this.hasCrashed = true;
        this.speed = 0;
        this.stopImmunity();
        this.imgElement.src = "/images/explosion.png";
        this.shadowElement.style.display = "none";
        this.isImmune = true;
        this.itemCooldown = 0;
        this.item = null;
        let item = document.querySelector("#item" + (this.playerNum - 1));
        item.style.display = "none";
        let c = races[raceChoice].checkpoints[this.checkpointMarker];
        setTimeout(this.place.bind(this), 1000, c.rotation, c.spawnPoint.x, c.spawnPoint.y);
        setTimeout(this.startImmunity.bind(this), 1000);
    }

    // Triggers immunity frames for 1 second
    startImmunity() {
        this.hasCrashed = false;
        this.immunityPlanificator = setInterval(this.flash.bind(this), 100);
        setTimeout(this.stopImmunity.bind(this), 1000);
    }

    // Flash visual effect used during imunity
    flash() {
        this.imgElement.style.display = this.imgElement.style.display == "block" ? "none" : "block";
        this.shadowElement.style.display = this.imgElement.style.display;
    }

    // Ends immunity
    stopImmunity() {
        clearInterval(this.immunityPlanificator);
        this.isImmune = false;
        this.imgElement.style.display = gCourseEnCours ? "block" : "none";
        this.shadowElement.style.display = gCourseEnCours ? "block" : "none";
    }
}

class KeyControls {
    constructor(leftKey, rightKey, upKey, downKey) {
        this.leftKey = leftKey;
        this.leftKeyActive = false;
        this.rightKey = rightKey;
        this.rightKeyActive = false;
        this.upKey = upKey;
        this.upKeyActive = false;
        this.downKey = downKey;
        this.downKeyActive = false;
    }

    deactivateAll() {
        this.leftKeyActive = false;
        this.rightKeyActive = false;
        this.upKeyActive = false;
        this.downKeyActive = false;
    }
}

class Race {
    constructor(safeC, safeT, safeR, unsafeC, unsafeT, unsafeR, checkpoints, spawns, spawnRotation, speedPad, image, boxes, nbTours) {
        this.safeC = safeC;
        this.safeT = safeT;
        this.safeR = safeR;
        this.unsafeC = unsafeC;
        this.unsafeT = unsafeT;
        this.unsafeR = unsafeR;
        this.checkpoints = checkpoints;
        this.spawns = spawns;
        this.spawnRotation = spawnRotation;
        this.image = image;
        this.speedPad = speedPad;
        this.boxes = boxes;
        this.nbTours = nbTours;
    }

    isPointSafe(p) {
        for (let c of this.unsafeC) {
            if (c.isPointInCircle(p)) {
                //console.log("Point is unsafe in circle");
                return false;
            }
        }
        for (let r of this.unsafeR) {
            if (r.isPointInRectangle(p)) {
                //console.log("Point is unsafe in rectangle");
                return false;
            }
        }
        for (let t of this.unsafeT) {
            if (t.isPointInTriangle(p)) {
                //console.log("Point is unsafe in triangle");
                return false;
            }
        }
        for (let c of this.safeC) {
            if (c.isPointInCircle(p)) {
                return true;
            }
        }
        for (let r of this.safeR) {
            if (r.isPointInRectangle(p)) {
                return true;
            }
        }
        for (let t of this.safeT) {
            if (t.isPointInTriangle(p)) {
                return true;
            }
        }
    }
}