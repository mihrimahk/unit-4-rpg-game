  
// Global variables
var baseAttack = 0; 
var player;
var defender; 
var charArray = []; 
var playerSelected = false; 
var defenderSelected = false; 


// Constructor
function Character(name, hp, ap, counter, pic) {
    this.name = name;
    this.healthPoints = hp;
    this.attackPower = ap;
    this.counterAttackPower = counter;
    this.pic = pic;
}


// Increase the attack strength (this attack strength + original attack strength)
Character.prototype.increaseAttack = function () {
    this.attackPower += baseAttack;
};

// Performs an attack
Character.prototype.attack = function (Obj) {
    Obj.healthPoints -= this.attackPower;
    $("#msg").html("<b>" + player.name + "</b> attacked <b>" +
        Obj.name + "</b> for " + this.attackPower + " damage points.");
    this.increaseAttack();
};

// Performs a counter attack
Character.prototype.counterAttack = function (Obj) {
    Obj.healthPoints -= this.counterAttackPower;
    $("#msg").append(" <b>" + this.name + "</b> counter attacked <b>" + player.name + "</b> for " + this.counterAttackPower + " damage points.");
};


// Initialize all the characters
function initCharacters() {
    var commando = new Character("Commando", 100, 10, 5, "./assets/images/commando.jpg");
    var devestrator = new Character("Devestrator", 200, 50, 30, "./assets/images/devestrator.jpg");
    var highrise = new Character("Highrise", 150, 15, 2, "./assets/images/highrise.jpg");
    var trooper = new Character("Trooper", 180, 30, 12, "./assets/images/trooper.jpg");
    charArray.push(commando, devestrator, highrise, trooper);
}

// "Save" the original attack value
function setBaseAttack(Obj) {
    baseAttack = Obj.attackPower;
}

// Checks if character is alive
function isAlive(Obj) {
    if (Obj.healthPoints > 0) {
        return true;
    }
    return false;
}

// Checks if the player has won
function isWinner() {
    if (charArray.length == 0 && player.healthPoints > 0)
        return true;
    else return false;
}

// Create the character cards onscreen
function characterCards(divID) {
    $(divID).children().remove();
    for (var i = 0; i < charArray.length; i++) {
        $(divID).append("<div />");
        $(divID + " div:last-child").addClass("card");
        $(divID + " div:last-child").append("<img />");
        $(divID + " img:last-child").attr("id", charArray[i].name);
        $(divID + " img:last-child").attr("class", "card-img-top");
        $(divID + " img:last-child").attr("src", charArray[i].pic);
        $(divID + " img:last-child").attr("width", 150);
        $(divID + " img:last-child").addClass("img-thumbnail");
        $(divID + " div:last-child").append("<center><b>" + charArray[i].name + "</b></center>");
        $(divID + " div:last-child").append("<center><b>Power:</b> " + charArray[i].healthPoints + "</center>");
        $(divID + " div:last-child").append();

    }
}

// Update the characters pictures location on the screen (move them between divs)
function updatePics(fromDivID, toDivID) {
    $(fromDivID).children().remove();
}


$(document).on("click", "img", function () {
    // Stores the defender the user has clicked on in the defender variable and removes it from the charArray
    if (playerSelected && !defenderSelected && (this.id != player.name)) {
        for (var j = 0; j < charArray.length; j++) {
            if (charArray[j].name == (this).id) {
                defender = charArray[j];
                 // sets defender
                charArray.splice(j, 1);
                defenderSelected = true;
                $(this).parent('div').remove();
                $("#game").append("<div />");
                $("#game div:last-child").addClass("card");
                $("#msg").html("Click the button to attack!");
            }
        }
        $("#defenderDiv").append(this);
         // appends the selected defender to the div 
        $("#defenderDiv").append("<br>" + defender.name);
        $("#defenderHealthDiv").append("HP: " + defender.healthPoints);
    }
    // Stores the character the user has clicked on in the player variable and removes it from charArray
    if (!playerSelected) {
        for (var i = 0; i < charArray.length; i++) {
            if (charArray[i].name == (this).id) {
                player = charArray[i]; 
                // sets current player
                setBaseAttack(player);
                charArray.splice(i, 1);
                playerSelected = true;
                $(this).parent('div').remove();
                $("#game").append("<div />");
                $("#game div:last-child").addClass("card");
                $("#msg").html("Pick an enemy to fight!");
            }
        }
        //updatePics("#game", "#game");
        $("#playerDiv").append(this); 
        // appends the selected player to the div
        $("#playerDiv").append("<b>" + player.name + "</b>");
        $("#playerHealthDiv").append("<b>Power:</b> " + player.healthPoints);

    }

});

// The attack button functionality
$(document).on("click", "#attackBtn", function () {
    if (playerSelected && defenderSelected) {
        if (isAlive(player) && isAlive(defender)) {
            player.attack(defender);
            defender.counterAttack(player);
            $("#playerHealthDiv").html("HP: " + player.healthPoints);
            $("#defenderHealthDiv").html("HP: " + defender.healthPoints);
            if (!isAlive(defender)) {
                $("#defenderHealthDiv").html("DEFEATED!");
                $("#playerHealthDiv").html("Enemy defeated!");
                $("#msg").html("Pick another enemy to battle...");
            }
            if (!isAlive(player)) {
                $("#playerHealthDiv").html("YOU LOST!");
                $("#msg").html("Try again...");
                $("#attackBtn").html("Restart Game");
                $(document).on("click", "#attackBtn", function () { 
                    // restarts game
                    location.reload();
                });
            }
        }
        if (!isAlive(defender)) {
            $("#defenderDiv").children().remove();
            $("#defenderDiv").html("");
            $("#defenderHealthDiv").html("");
            defenderSelected = false;
            if (isWinner()) {
                $("#gamepage").hide();
                $("#game").hide();
                $("#msg").html("YOU WON: <b>" + player.name + "</b>");
                $("#globalMsg").show();
                $(document).on("click", "#attackBtn", function () { 
                    // restarts game
                    location.reload();
                });
            }
        }
    }
});

// EXECUTE
$(document).ready(function () {
    $("#globalMsg").hide();
    initCharacters();
    characterCards("#game");
});