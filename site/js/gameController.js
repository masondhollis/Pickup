

/***********************************************************
*                         GAME                             *
***********************************************************/


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

        var sport = game.get('sport').replace(/</g, "&lt;").replace(/>/g, "&gt;");
        var location = game.get('location').replace(/</g, "&lt;").replace(/>/g, "&gt;");
        var time = game.get('Time').replace(/</g, "&lt;").replace(/>/g, "&gt;");
        var details = game.get('details').replace(/</g, "&lt;").replace(/>/g, "&gt;");
        
        $('#sport').html(sport);
        $('#location').html(location);
        $('#time').html(time);
        $('#details').html(details);
        
        var sport = game.get('sport').replace(/</g, "&lt;").replace(/>/g, "&gt;");
        var location = game.get('location').replace(/</g, "&lt;").replace(/>/g, "&gt;");
        var time = game.get('Time').replace(/</g, "&lt;").replace(/>/g, "&gt;");
        var intensity = game.get('intensity').replace(/</g, "&lt;").replace(/>/g, "&gt;");
        
        //populate other players
        var player = new Parse.Query(User);

        var numPlayers = game.get('player_id').length;
        

        var roster;
        if (game.get('player_id')) for (var i = 0; i < numPlayers; i++) {
              player.equalTo("objectId", game.get('player_id')[i]);
              player.find({
                     success: function(players) {
                            var $playerElm = $('#playerstemplate').clone(true);
                            var usern = players[0].get('username').replace(/</g, "&lt;").replace(/>/g, "&gt;");
                            $playerElm.html(usern+" ("+Math.round(players[0].get(sport))+"pts)");
                            $playerElm.attr("id", players[0].id);
                            $playerElm.attr("rank",  players[0].get(sport));
                            $playerElm.attr("name", players[0].get('username'));
                            
                            var added = false;
                            
                            $('#players p').each(function(index) {
                                if (added == false) {
                                    if (index>0) {
                                        if(players[0].get(sport) > $(this).attr('rank')){
                                            $(this).before($playerElm);
                                            
                                            $('input[value="'+$(this).attr('name')+'"]').before('<input type="checkbox" value="'+usern+'">'+usern);
                                            
                                            added = true;
                                        }
                                    }
                                }
                            })
                            
                            if (added == false) {
                                $('#players').append($playerElm);
                                $('#scoreform #names').append('<input type="checkbox" value="'+usern+'">'+usern);
                            }
                     },
                     error: function(e) {
                            console.log(e);
                     }
              });
              
              //Checks if user is on roster
              if (game.get('player_id')[i] == Parse.User.current().id) {
                $('#joingame').html("LEAVE");
                $('#joingame').attr("id", "leavegame");
                
                //REMOVE TOMORROW
                $('#tournamentjoingame').html("LEAVE");
                $('#tournamentjoingame').attr("id", "tournamentleavegame");
                
              }
              
        }
        
        
        
        
        //Check if owner and show owner tools       
        if (game.get('owner').id == Parse.User.current().id || game.id == "q0I1G2mrSd") {
            $('#joingame, #leavegame, #tournamentjoingame, #tournamentleavegame').css('left', '10%')
            $('#reportscore').show();
        }
        
    }
});

//Get User Rank
Parse.User.current().fetch().then(function(user) {
    $('#rank').html(sport+" Rank: "+Math.round(user.get(sport)));
});

$(document).on('click', '#joingame, #tournamentjoingame', function() {
    
        console.log("JOINING GAME")
    
       game.addUnique("player_id", Parse.User.current().id);
       game.save(null, {
        success: function(){
            location.reload();
        },
       });
       
});




$(document).on('click', '#leavegame, #tournamentleavegame', function() {
    
    
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
    //if (game.get('player_id').length == 2) {
        $('#scorebox').show();
        $("html, body").animate({ scrollTop: $(document).height() }, "slow");
    //}
    /*else {
        game.destroy({
            success: function() {
                window.location.href = "./dashboard.html";
            }
        })
    }*/
});

//REMOVE
$('#tournamentreportscore').click(function() {
    $('#scorebox').show();
    $("html, body").animate({ scrollTop: $(document).height() }, "slow");
});

$('#scoreform').submit(function(event) {
    event.preventDefault();
    
    var winners = $("#names input:checkbox:checked").map(function(){
        return $(this).val();
    }).get();
    
    var losers = $("#names input:checkbox:not(:checked)").map(function(){
        return $(this).val();
    }).get();
    
    var setRankingParams = {
        winnerNames: winners,
        loserNames: losers,
        sport: game.get('sport')
    };
    
    //Calls a function in the Parse Cloud (mitigates javascript injection attacks)
    //Text me if you need to change this. You need to have Parse command line tools installed
    Parse.Cloud.run('updateRankings', setRankingParams, {
        success: function(response) {
            
            console.log(response);
            
            if (gameID != "LGh0hcssxG" && gameID !="LQuySIsTZO") {
                currentGame.get(gameID, {
                    success: function(tempGame) {
                        tempGame.destroy({});
                        window.location.href="./dashboard.html";
                    }
                });
            }
            else location.reload();
        },
        error: function(a) {
            console.log(a);
        }
    }); 
})

$('#logout').click(function() {
    window.location.href = "./dashboard.html";
})
