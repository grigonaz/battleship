boatorientation = "vert";
boatsize = 0;
image = new Image();
image.src = "media/boom.svg";

// form 1 to 100
AI = 1;

class Pointposition {
    constructor(x, y){
        this.x = x;
        this.y = y;
    }
}

class Boat {
    constructor(size, orientation, x, y){
        this.size = size;
        this.orientation = orientation;
        this.x = x;
        this.y = y;
    }
}

class Battlemap {
    constructor(){
        this.boats = [];
        this.points = [];
    }

    getboats(){
        return this.boats;
    }

    addboat(boat){
        this.boats.push(boat);
    }

    getpoints(){
        return this.points;
    }

    addpoint(shot){
        this.points.push(shot);
    }

    isboatcollision(boat) {
        let collision = false;
        
        // search for collision for boats
        this.boats.forEach(item => {
            for (let b = 0; b < boat.size; b++) {
                for (let i = 0; i < item.size; i++) {
                    let bx = boat.x;
                    let by = boat.y;
                    let ix = item.x;
                    let iy = item.y;

                    if (boat.orientation == "vert") {
                        by += b;
                    } else {
                        bx += b;
                    }

                    if (item.orientation == "vert") {
                        iy += i;
                    } else {
                        ix += i;
                    }

                    if (Math.sqrt(Math.pow(bx - ix, 2) + Math.pow(by - iy, 2)) < 2) {
                        collision = true;
                    }
                }
            }
        })

        return collision;
    }

    // search for collision for points
    ispointcollision(point) {
        let collision = false;

        this.boats.forEach(item => {
            for (let i = 0; i < item.size; i++) {
                let ix = item.x;
                let iy = item.y;

                if (item.orientation == "vert") {
                    iy += i;
                } else {
                    ix += i;
                }

                if (ix == point.x && iy == point.y) {
                    collision = true;
                }
            }
        });

        return collision;
    }

    checkwin(player2) {
        let count = 0;
        this.points.forEach(point => {
            if (player2.ispointcollision(point)) {
                count++;
            }
        })

        if (count == 20) {
            return true;
        }

        return false;
    }
}

function removelisteners(element) {
    element.replaceWith(element.cloneNode(true));
}

function drawmap(rektor) {
    
    rektor.clearRect(0, 0, 1000, 1000)

    // font settings
    rektor.strokeStyle = 'black';
    rektor.lineWidth = 1.5;
    rektor.font = "25px Arial";
    rektor.textAlign = "center";

    // draw lines
    for (let i = 0; i < 12; i++) {
        rektor.beginPath();
        rektor.moveTo(0, 1 + (i*40));
        rektor.lineTo(442, 1 + (i*40));
        rektor.stroke();
        rektor.closePath();

        if (i > 0  && i < 11){
            rektor.fillText(i, 21, 30 + i*40);
        }
    }

    // draw columns
    for(let i = 0; i < 12; i++) {
        let letters = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"]

        rektor.beginPath();
        rektor.moveTo(1 + (i*40), 0);
        rektor.lineTo(1 + (i*40), 442);
        rektor.stroke();
        rektor.closePath();

        if (i > 0 && i < 11){
            rektor.fillText(letters[i-1], 21 + i*40, 30);
        }
    }
}

function drawbotmap(bot) {
    let boats = [1,1,1,1,2,2,2,3,3,4];
    
    // draw random map for bot
    for (let i = 0; i < 10; i++) {
        let done = false;
        while(!done) {
            let x = Math.round(Math.random()*9+1);
            let y = Math.round(Math.random()*9+1);
            let oriantation = Math.random() > 0.5 ? "vert" : "horiz";

            let boat = new Boat(boats[9 - i], oriantation, x, y);
            
            if (!(bot.isboatcollision(boat)) && bot.canplaceboat(boat)) {
                bot.addboat(boat);
                done = true;
            }
        }
    }

    console.log(bot);
}

function drawboats(ctx, battlemap, e) {
    
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 40;
    
    // draw boats
    let boats = battlemap.getboats();
    boats.forEach(boat => {
        ctx.beginPath();
        if (boat.orientation == "vert") {
            ctx.moveTo(boat.x*40 + 21, boat.y*40 + 1);
            ctx.lineTo(boat.x*40 + 21, (boat.y+boat.size)*40 + 1);
        } else {
            ctx.moveTo(boat.x*40 + 1, boat.y*40 + 21);
            ctx.lineTo((boat.x+boat.size)*40 + 1, boat.y*40 + 21);
        }
        ctx.stroke();
        ctx.closePath();
    });

    if (e == null) {
        return;
    }

    // draw place
    let pos = e.target.getBoundingClientRect()
    const x = e.pageX - pos.x;
    const y = e.pageY - pos.y;
    
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 40;

    // transform coordinates
    let boatx = parseInt(x/40);
    let boaty = parseInt(y/40);
    
    if (boaty > 0 && boatx > 0) {
        console.log(boatorientation);
        if (boatorientation == "vert") {
            if (boaty + boatsize < 12) {
                ctx.beginPath();
                ctx.moveTo(boatx*40 + 21, boaty*40 + 1);
                ctx.lineTo(boatx*40 + 21, (boaty+boatsize)*40 + 1);
                ctx.stroke();
                ctx.closePath();
            }
        } else {
            if (boatx + boatsize < 12) {
                ctx.beginPath();
                ctx.moveTo(boatx*40 + 1, boaty*40 + 21);
                ctx.lineTo((boatx+boatsize)*40 + 1, boaty*40 + 21);
                ctx.stroke();
                ctx.closePath();
            }
        }
    }
}

function drawpoints(player, bot) {
    // draw players's field
    const canvas1 = document.querySelector('#playerfield');
    const ctx1 = canvas1.getContext('2d');
    // ctx1.drawImage(image, 0, 0, 42, 42)

    // draw bot's field
    const canvas2 = document.querySelector('#botfield');
    const ctx2 = canvas2.getContext('2d');

    // draw points on bot's map
    player.getpoints().forEach(point => {
        if (bot.ispointcollision(point)) {
            ctx2.drawImage(image, (point.x)*40, (point.y)*40, 42, 42);
        } else {
            ctx2.beginPath();
            ctx2.arc((point.x)*40 + 21, (point.y)*40 + 21, 10, 0, 2*Math.PI, false);
            ctx2.fillStyle = 'black';
            ctx2.fill();
        }
    });

    // draw point on player's map
    bot.getpoints().forEach(point => {
        if (player.ispointcollision(point)) {
            ctx1.drawImage(image, (point.x)*40, (point.y)*40, 42, 42);
        } else {
            ctx1.beginPath();
            ctx1.arc((point.x)*40 + 21, (point.y)*40 + 21, 10, 0, 2*Math.PI, false);
            ctx1.fillStyle = 'black';
            ctx1.fill();
        }
    });
}

function gameinit() {
    let player = new Battlemap();
    let bot = new Battlemap();

    // draw player's field
    const canvas1 = document.querySelector('#playerfield');
    const ctx1 = canvas1.getContext('2d');
    drawmap(ctx1);

    // draw instruction
    const canvas2 = document.querySelector('#botfield');
    const ctx2 = canvas2.getContext('2d');
    ctx2.font = "25px Arial";
    ctx2.textAlign = "center";
    ctx2.fillText("Use 'R' to change ship orientation", 221, 226);

    // array of boats
    let boats = [1,1,1,1,2,2,2,3,3,4];

    // choosing first boat
    boatsize = boats.pop();
    document.boatorientation = "vert";

    // draw boats
    canvas1.addEventListener('mousemove', e => {
        drawmap(ctx1);
        drawboats(ctx1, player, e);
    })

    // change oriantation
    document.addEventListener('keypress', e => {
        if (e.key == "r") {
            console.log(e);
            if (boatorientation == "vert") {
                boatorientation = "horiz";
            } else {
                boatorientation = "vert";
            }
        }
    })

    // save boat position
    canvas1.addEventListener('click', e => {
        
        // transform coordinates
        let pos = document.getElementById("playerfield").getBoundingClientRect()
        const x = e.pageX - pos.x;
        const y = e.pageY - pos.y;
        let boatx = parseInt(x/40);
        let boaty = parseInt(y/40);
        
        // validate area
        if (boaty > 0 && boatx > 0) {
            if (boatorientation == "vert") {
                if (boaty + boatsize >= 12) {
                    return;
                }
            } else {
                if (boatx + boatsize >= 12) {
                    return;
                }
            }
        } else  {
            return;
        }

        let boat = new Boat(boatsize, boatorientation, boatx, boaty);

        // check collision
        if (player.isboatcollision(boat)) {
            return;
        }

        player.addboat(boat);
        
        // after player's field is ready
        if (boats.length == 0) {
            removelisteners(canvas1);
            
            // bot initialisation
            drawbotmap(bot);
            
            // game starts
            gamecycle(player, bot, null);

            // call gamecycle in mouth click
            canvas2.addEventListener('click', e => {
                gamecycle(player, bot, e);
            })

            return;
        }

        boatsize = boats.pop();
        boatorientation = "vert";

        drawmap(ctx1);
        drawboats(ctx1, player, e);
    })
}

var process = false;

function gamecycle(player, bot, e) {
    if (process) {
        return;
    }

    process = true;

    // draw players's field
    const canvas1 = document.querySelector('#playerfield');
    const ctx1 = canvas1.getContext('2d');
    drawmap(ctx1);
    drawboats(ctx1, player, null);

    // draw bot's field
    let canvas2 = document.querySelector('#botfield');
    let ctx2 = canvas2.getContext('2d');
    drawmap(ctx2);
    // drawboats(ctx2, bot, null);

    drawpoints(player, bot);

    // game iteration after player clicked
    if (e != null) {
        let pos = document.getElementById("botfield").getBoundingClientRect()
        const x = e.pageX - pos.x;
        const y = e.pageY - pos.y;
        let pointx = parseInt(x/40);
        let pointy = parseInt(y/40);

        // check if point is in bounds and not laying on another point
        if (pointy > 0 && pointx > 0) {
            let  alreadyplaced = false;  
            player.getpoints().forEach(point => {
                if (point.x == pointx && point.y == pointy) {
                    alreadyplaced = true;
                }
            })

            if (alreadyplaced) {
                process = false;
                return;
            } else {
                player.addpoint(new Pointposition(pointx, pointy));
            }

        } else {
            process = false;
            return;
        }

        // place point and AI will play
        let point = new Pointposition(pointx, pointy);
        if (bot.ispointcollision(point)) {
            if (player.checkwin(bot)) {
                removelisteners(canvas2);

                canvas2 = document.querySelector('#botfield');
                ctx2 = canvas2.getContext('2d');

                drawmap(ctx1);
                drawboats(ctx1, player, null);

                drawmap(ctx2);
                drawboats(ctx2, bot, null);

                drawpoints(player, bot);

                let winner = document.getElementById("winner");
                winner.innerHTML = "PLAYER";
                let windiv = document.getElementById("windiv");
                windiv.style.opacity = "1";

                return;
            }
            
            drawmap(ctx1);
            drawboats(ctx1, player, null);

            drawmap(ctx2);

            drawpoints(player, bot);

            process = false;
            return;
        }

        // AI logic
        let round = true;
        while (round) {

            let aichoose = [];

            for (let i = 1; i < 11; i++) {
                for (let k = 1; k < 11; k++) {
                    let point2 = new Pointposition(k, i);
                    let checkpointexist = false;

                    bot.getpoints().forEach(p => {
                        if (p.x == point2.x && p.y == point2.y) {
                            checkpointexist = true;
                        }
                    })

                    if (checkpointexist) {
                        continue;
                    }

                    if (player.ispointcollision(point2)) {
                        for (let l = 0; l < AI; l++) {
                            aichoose.push(point2);
                        }
                    } else {
                        aichoose.push(point2);
                    }
                }
            }

            let indexchoose = parseInt(Math.random()*aichoose.length);

            bot.addpoint(aichoose[indexchoose]);

            if (bot.checkwin(player)) {    
                removelisteners(canvas2);

                // cheat for bot canvas (not rendering)
                canvas2 = document.querySelector('#botfield');
                ctx2 = canvas2.getContext('2d');

                drawmap(ctx1);
                drawboats(ctx1, player, null);

                drawmap(ctx2);
                drawboats(ctx2, bot, null);

                drawpoints(player, bot);

                let winner = document.getElementById("winner");
                winner.innerHTML = "BOT";
                let windiv = document.getElementById("windiv");
                windiv.style.opacity = "1";
                
                process = false;
                return;
            }

            if (!(player.ispointcollision(aichoose[indexchoose]))) {
                round = false;
            }
        }
    }

    drawmap(ctx1);
    drawboats(ctx1, player, null);

    drawmap(ctx2);

    drawpoints(player, bot);
    
    process = false;
}

function changeTrack(id) {
    console.log(id);
    let audio = document.getElementById("audio");
    let source = document.getElementById("source");
    source.src = "media/track"+id+".mp3";
    audio.load();
    audio.pause();
}

function changebotlevel(slider, result)  {
    slider.oninput = function() {
        AI = this.value;
        result.innerHTML = slider.value;
    }
}

// script running
window.addEventListener("load", () => {
    
    // check to place boat inside the canvas
    Battlemap.prototype.canplaceboat = function(boat) {
        if(boat.orientation == "vert") {
            return boat.y + boat.size < 10;
        } else {
            return boat.x + boat.size < 10;
        }
    }

    // reset game
    document.getElementById("reset").addEventListener('click', e => {
        const canvas1 = document.querySelector('#playerfield');
        removelisteners(canvas1);

        const canvas2 = document.querySelector('#botfield');
        const ctx2 = canvas2.getContext('2d');
        ctx2.clearRect(0, 0, 1000, 1000);

        let winner = document.getElementById("winner");
        winner.innerHTML = "";
        let windiv = document.getElementById("windiv");
        windiv.style.opacity = "0";

        gameinit();
    })
    
    gameinit();

    // switch tracks
    let tracks = Array.from(document.getElementById("playlist").children);
    tracks.forEach(track => track.addEventListener('click', e => {
        tracks.forEach(el => el.className = "");
        e.target.parentElement.className = "playing";
        changeTrack(e.target.parentElement.id);
    }))

    // bot level
    let slider = document.getElementById("sliderid");
    let result = document.getElementById("result");
    result.innerHTML = "10";
    changebotlevel(slider, result);

    // file API to choose music
    let blob = window.URL || window.webkitURL;
    if (blob) {
        document.getElementById('choosemusic').addEventListener('change', function(e) {
            let file = this.files[0],
            fileURL = blob.createObjectURL(file);
            document.getElementById('audio').src = fileURL;
        });         
    } else {
        console.log('Your browser does not support Blob URLs');
    }
});