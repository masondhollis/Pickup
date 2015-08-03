

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
        $('#time').html(game.get('Time'));
        $('#details').html(game.get('details'));
        
        //populate other players
        var player = new Parse.Query(User);

        if (game.get('player_id')) for (var i = 0; i < game.get('player_id').length; i++) {
              player.equalTo("objectId", game.get('player_id')[i]);
              player.find({
                     success: function(players) {
                            var $playerElm = $('#playerstemplate').clone(true);
                            $playerElm.html(players[0].get('username')+" ("+Math.round(players[0].get('ranking'))+"pts)");
                            $playerElm.attr("id", players[0].id);
                            $('#players').append($playerElm);
                     },
                     error: function(e) {
                            console.log(e);
                     }
              });
              
              //Checks if user is on roster
              if (game.get('player_id')[i] == Parse.User.current().id) {
                $('#joingame').html("LEAVE");
                $('#joingame').attr("id", "leavegame");
              }
              
        }
        
        
        
        
        //Check if owner and show owner tools       
        if (game.get('owner').id == Parse.User.current().id) {
            $('#joingame, #leavegame').css('left', '10%')
            $('#reportscore').show();
        }
        
    }
});

//Get User Rank
Parse.User.current().fetch().then(function(user) {
    $('#rank').html(Math.round(user.get('ranking')));
});

$(document).on('click', '#joingame', function() {
    
        console.log("JOINING GAME")
    
       game.addUnique("player_id", Parse.User.current().id);
       game.save(null, {
        success: function(){
            location.reload();
        },
       });
       
});

$(document).on('click', '#leavegame', function() {
    
    console.log("LEAVING GAME")
    
    var currentPlayers = game.get('player_id');
    
    if (game.get('owner').id == Parse.User.current().id) {
        game.destroy({
            success: function() {
                window.location.href = "./dashboard.html";
            }
        })
    }
    else {
        for (var i = 0; i < currentPlayers.length; i++) {
            if (currentPlayers[i] == Parse.User.current().id) {
                currentPlayers.splice(i,1);
            }
        };
        game.set('player_id', currentPlayers);
        game.save(null, {
            success: function() {
                location.reload();
            }
        })
    }
})

$('#reportscore').click(function() {
    if (game.get('player_id').length == 2) {
        $('#scorebox').show();
        $("html, body").animate({ scrollTop: $(document).height() }, "slow");
    }
    else {
        game.destroy({
            success: function() {
                window.location.href = "./dashboard.html";
            }
        })
    }
});

$('#scoreform').submit(function(event) {
    event.preventDefault();
    
    var setRankingParams = {
        winnerName: $('#winner').val(),
        loserName: $('#loser').val()
    };
    
    //Calls a function in the Parse Cloud (mitigates javascript injection attacks)
    //Text me if you need to change this. You need to have Parse command line tools installed
    Parse.Cloud.run('updateRankings', setRankingParams, {
        success: function(response) {
            currentGame.get(gameID, {
                success: function(tempGame) {
                    tempGame.destroy({});
                    window.location.href="./dashboard.html";
                }
            });
        }
    });  
})

$('#logout').click(function() {
    window.location.href = "./dashboard.html";
})
