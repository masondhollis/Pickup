/***********************************************************
*                         DASHBOARD                        *
***********************************************************/


//Populate all games from database
var newGame = new Game();

var allGames = new Parse.Query(Game);
allGames.include("User");
allGames.find({
    success: function(gamesList) {
        if (gamesList.length == 0) {
            $('#gametemplate').hide();
            $('#current_games .nogames').show();
        }
        $('#your_games .nogames').show();
        $('#your_games table').hide();
        for (var i = 0; i < gamesList.length; i++) {
            game = gamesList[i];
            

            var $gameElm;
            var sport = game.get('sport').replace(/</g, "&lt;").replace(/>/g, "&gt;");
            var location = game.get('location').replace(/</g, "&lt;").replace(/>/g, "&gt;");
            var time = game.get('Time').replace(/</g, "&lt;").replace(/>/g, "&gt;");
            var intensity = game.get('intensity').replace(/</g, "&lt;").replace(/>/g, "&gt;");
            
            
            
            
            $gameElm = ('<tr id="'+game.id+'" class="'+game.id+'"><td style="text-align: left">'+sport+' @ '+location+'</td>'+
                          '<td>'+game.get('player_id').length+'</td>'+
                          '<td>'+time+'</td>'+
                          '<td>'+intensity+'</td></tr>');
            
            if (game.id == "q0I1G2mrSd") {
                $('#table_titles').after($gameElm);
                $('#q0I1G2mrSd').css('color', 'red');
            }
            else $('#current_games table').append($gameElm);
            
            //If user is in game, add to "Your Games"
            for (var j = 0; j < game.get('player_id').length; j++)
            if (game.get('player_id')[j] == Parse.User.current().id) {
                $('#your_games table').append($gameElm);
                $('#your_games .nogames').hide();
                $('#your_games table').show();
            }
            
            //Change color of created games
            var createdGames = new Parse.Query(Game);
            createdGames.equalTo("owner", Parse.User.current());
            createdGames.find({
                success: function(gamesList) {
                    
                    for (var i = 0; i < gamesList.length; i++) {
                        game = gamesList[i];
                        $('.'+game.id).css('color', '#12b8fe');
                    }
                },
            });
            
            
            
        }
    },
    error: function(error) {
        
    }
});


//Populate sports list in create game
for (var i in sportslist) {
    $('#create_game #sport').append("<option value='"+sportslist[i]+"'>"+sportslist[i]+"</option>");
}


//Show User Rank
/*
Parse.User.current().fetch().then(function(user) {
    $('#rank').html(Math.round(user.get('ranking')));
})
*/


//Show form to create new game
$('.new_game').click(function() {
    $('#create_game').show();
    $("html, body").animate({ scrollTop: $(document).height() }, "slow");
});

//Save new game to database
$('#creategameform').submit(function(event) {
    event.preventDefault();
    newGame.set("sport", $('#sport').val());
    newGame.set("location", $('#location').val());
    newGame.set("owner", Parse.User.current());
    newGame.set("Time", $('#time').val());
    newGame.set("intensity", $('#intensity').val());
    newGame.set("details", $('#details').val());
    newGame.addUnique("player_id", Parse.User.current().id);
    newGame.save(null, {
        success: function() {
            location.reload();
        }
    });
});



//Navigate to game page when clicked
$('body').on('vclick', 'tr', function() {
    if (this.id != "table_titles") {
        //Temp Tournament Logic. Remove tomorow
        if (this.id == ["q0I1G2mrSd"]) {
            window.location.href = "./tournament.html?gameID=q0I1G2mrSd";
        }
        else window.location.href = "./game.html?gameID="+this.id;
    }
    return false;
});

$('#logout').click(function() {
    Parse.User.logOut();
    window.location.href = "./index.html";
})





