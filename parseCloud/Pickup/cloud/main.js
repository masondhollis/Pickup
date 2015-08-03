
// Use Parse.Cloud.define to define as many cloud functions as you want.
// For example:
Parse.Cloud.define("updateRankings", function(request, response) {
    Parse.Cloud.useMasterKey();
    //Get winner
    var User = Parse.Object.extend("User");
    var winnerQ = new Parse.Query(User);
    winnerQ.equalTo("username", request.params.winnerName);
    winnerQ.find({
        success: function(winner) {
            //Get loser
            var loserQ = new Parse.Query(User);
            loserQ.equalTo("username", request.params.loserName);
            loserQ.find({
                success: function(loser) {
                    //Calculate new rankings
                    var winnerRank = winner[0].get('ranking');
                    var loserRank = loser[0].get('ranking');
                    var winnerExpScore = 1 / (1+Math.pow(10, (loserRank-winnerRank)/400));
                    var loserExpScore = 1-winnerExpScore;
                    //32 based on chess elo. Experiment with this
                    var winnerNewRank = winnerRank + 32*(1-winnerExpScore);
                    var loserNewRank = loserRank + 32*(0-loserExpScore);
                    
                    winner[0].set("ranking", winnerNewRank);
                    loser[0].set("ranking", loserNewRank);
                    winner[0].save(null, null);
                    loser[0].save(null, null);
                    response.success("yay success");
                }
            })
        },
        error: function(a, e) {
          response.error("Error: " + e);
        }
    })
});

Parse.Cloud.define("getUsername", function(request, response) {  
  Parse.Cloud.useMasterKey();
  var User = Parse.Object.extend("user");
  var userQ = new Parse.Query(User);
  userQ.equalTo("objectID", request.params.userID);
  userQ.find({
    success: function(user) {
      response.success(user[0].id);
    },
    error: function(a, e) {
      response.error("Error: " + e.message);
    }
  })

});
