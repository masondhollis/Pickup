/***********************************************************
*                         DASHBOARD                        *
***********************************************************/


//Populate all games from database
var newGame = new Game();
var allGames = new Parse.Query(Game);
allGames.find({
    success: function(gamesList) {
        for (var i = 0; i < gamesList.length; i++) {
            game = gamesList[i];
            var $gameElm = $('#gametemplate').clone(true);
            $gameElm.html(game.get('sport')+' at '+game.get('location'));
            $gameElm.attr("id", game.id);
            $('#current_games').append($gameElm);
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
            var $gameElm = $('#yourgametemplate').clone(true);
            $gameElm.html(game.get('sport')+' at '+game.get('location'));
            $gameElm.attr("id", game.id);
            $('#your_games').append($gameElm);
        }
    },
    error: function(error) {
        
    }
});

//Show form to create new game
$('#create_game').click(function() {
    $('#overlay').show();
});

//Save new game to database
$('#creategameform').submit(function() {
    newGame.set("sport", $('#sport').val());
    newGame.set("location", $('#location').val());
    newGame.set("owner", Parse.User.current());
    newGame.addUnique("player_id", Parse.User.current().id);
    newGame.save(null, null);
});

//Navigate to game page when clicked
$(document).on('click', 'p', function() {
    window.location.href = "./game.html?gameID="+this.id;
});
