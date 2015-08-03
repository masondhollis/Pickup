/***********************************************************
*                         DASHBOARD                        *
***********************************************************/


//Populate all games from database
var newGame = new Game();
var allGames = new Parse.Query(Game);
allGames.include("User");
allGames.find({
    success: function(gamesList) {
        for (var i = 0; i < gamesList.length; i++) {
            game = gamesList[i];
            
            //get Creator name
            var usernameParam = {
                userID: game.get('owner').id
            };
            Parse.Cloud.run('getUsername', usernameParam, {
                success: function(response) {
                    console.log("SUCCESS: " + response);
                },
                error: function(response) {
                    console.log("ERROR: " + response);
                }
            });
            
            var $gameElm;
            $gameElm = ('<tr id="'+game.id+'"><td style="text-align: left">'+game.get('sport')+' @ '+game.get('location')+'</td>'+
                          '<td>'+game.get('player_id').length+'</td>'+
                          '<td>'+game.get('Time')+'</td>'+
                          '<td>'+game.get('intensity')+'</td></tr>');
            
            $('#current_games table').append($gameElm);
            
        }
    },
    error: function(error) {
        
    }
});

//Populate "your games"
var yourGames = new Parse.Query(Game);
yourGames.equalTo("owner", Parse.User.current());
yourGames.find({
    success: function(gamesList) {
        for (var i = 0; i < gamesList.length; i++) {
            game = gamesList[i];
            
            
            
            var $gameElm;
            $gameElm = ('<tr id="'+game.id+'"><td style="text-align: left">'+game.get('sport')+' @ '+game.get('location')+'</td>'+
                          '<td>'+game.get('player_id').length+'</td>'+
                          '<td>'+game.get('Time')+'</td>'+
                          '<td>'+game.get('intensity')+'</td></tr>');
            
            $('#your_games table').append($gameElm);
        }
    },
    error: function(error) {
        
    }
});

//Show User Rank
Parse.User.current().fetch().then(function(user) {
    $('#rank').html(Math.round(user.get('ranking')));
})


//Show form to create new game
$('.new_game').click(function() {
    $('#overlay').show();
});

//Save new game to database
$('#creategameform').submit(function() {
    newGame.set("sport", $('#sport').val());
    newGame.set("location", $('#location').val());
    newGame.set("owner", Parse.User.current());
    newGame.set("Time", $('#time').val());
    newGame.set("intensity", $('#intensity').val());
    newGame.addUnique("player_id", Parse.User.current().id);
    newGame.save(null, null);
});

//Navigate to game page when clicked
$(document).on('click', 'tr', function() {
    if (this.id != "table_titles") {
        window.location.href = "./game.html?gameID="+this.id;
    }
});





