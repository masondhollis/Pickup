

/***********************************************************
*                         GAME                             *
***********************************************************/

//Hide owner tools.
//******Quick MVP solution. Major vulnerability.********
$('#reportscore').hide();


//Get game object
var gameID = getQueryVariable("gameID");
var game;

//I'm making a lot of redundant calls to this database but Ill leave it for now. Lets fix it later.
//This one gets the current game
var currentGame = new Parse.Query(Game);
currentGame.equalTo("objectId", gameID);
currentGame.find({
    success: function(games) {
        
        //Hopefully theres only one object in this array but just to avoid weird things later...
        game = games[0];

        $('#sport').html(game.get('sport'));
        $('#location').html(game.get('location'));
        
        //populate other players
        var player = new Parse.Query(User);

        if (game.get('player_id')) for (var i = 0; i < game.get('player_id').length; i++) {
              player.equalTo("objectId", game.get('player_id')[i]);
              player.find({
                     success: function(players) {
                            var $playerElm = $('#playerstemplate').clone(true);
                            $playerElm.html(players[0].get('username'));
                            $playerElm.attr("id", players[0].id);
                            $('#players').append($playerElm);
                     },
                     error: function(e) {
                            console.log(e);
                     }
              });
        }
        
        
        //Check if owner and show owner tools       
        if (game.get('owner').id == Parse.User.current().id) {
            $('#reportscore').show();
        }
        
    }
});

$('#joingame').click(function() {
       game.addUnique("player_id", Parse.User.current().id);
       game.save(null, null);
});

$('#reportscore').click(function() {
    $('#overlay').show();
});

$('#scoreform').submit(function(event) {
    event.preventDefault();
    
    var setRankingParams = {
        winnerName: $('#winner').val(),
        loserName: $('#loser').val()
    };
    
    Parse.Cloud.run('updateRankings', setRankingParams, {
        success: function(response) {
            console.log("SUCCESS: " + response);
        },
        error: function(response) {
            console.log("ERROR: " + response);
        }
    })
    
    
})
