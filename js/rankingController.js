//Get game
var currentGame = new Parse.Query(Game);
currentGame.get("q0I1G2mrSd", {
    success: function(game) {
        var roster;
        var numPlayers = game.get('player_id').length;
        if (game.get('player_id')) for (var i = 0; i < numPlayers; i++) {
              var player = new Parse.Query(User);
              player.equalTo("objectId", game.get('player_id')[i]);
              player.find({
                     success: function(players) {
                            var $playerElm = $('#playerstemplate').clone(true);
                            var usern = players[0].get('username').replace(/</g, "&lt;").replace(/>/g, "&gt;");
                            $playerElm.html(usern+" ("+Math.round(players[0].get('ranking'))+"pts)");
                            $playerElm.attr("id", players[0].id);
                            $playerElm.attr("rank",  players[0].get('ranking'));
                            var added = false;
                            
                            $('#players p').each(function(index) {
                                if (added == false) {
                                    console.log($(this).text());
                                    if (index>0) {
                                        if(players[0].get('ranking') > $(this).attr('rank')){
                                            $(this).before($playerElm);
                                            added = true;
                                        }
                                    }
                                }
                            })
                            
                            if (added == false) {
                                $('#players').append($playerElm)
                            }
                     },
                     error: function(e) {
                            console.log(e);
                     }
              });
        }
    }
})