// Use Parse.Cloud.define to define as many cloud functions as you want.
// For example:
Parse.Cloud.define("updateRankings", function(request, response) {
   
   
    Parse.Cloud.useMasterKey();
    var winnerList = request.params.winnerNames;
    var loserList = request.params.loserNames;
    var sport = request.params.sport;
     
 
     
    var User = Parse.Object.extend("User");
     
     
     
    //Get avg winner ranks
    var winnerRankSum = 0;
    var winnerAvgRank;
     
    var winnerQuery = new Parse.Query("User");
    winnerQuery.containedIn("username", winnerList);
     
    winnerQuery.find ({
      success: function(winners) {
        var winnerRankArr = [];
        for (var i = 0; i < winners.length; i++) {
          winnerRankArr[i] = winners[i].get(sport);
          winnerRankSum += winnerRankArr[i];
        }
        winnerAvgRank = winnerRankSum / winners.length;
         
         
        //Get avg loser ranks
        var loserRankSum = 0;
        var loserAvgRank;
        
        var loserQuery = new Parse.Query("User");
        loserQuery.containedIn("username", loserList);
         
        loserQuery.find ({
          success: function(losers) {
            var loserRankArr = [];
            for (var i = 0; i < losers.length; i++) {
              loserRankArr[i] = losers[i].get(sport);
              loserRankSum += loserRankArr[i];
            }
            loserAvgRank = loserRankSum / losers.length;
             
             
             //Calculate chance of winning for each
            var winnerExpScore = 1 / (1+Math.pow(10, (loserAvgRank - winnerAvgRank)/400));
            var loserExpScore = 1-winnerExpScore;
             
             //Update rankings
            for (i in winners) {
              var newRank = winnerRankArr[i] + 32*(1-winnerExpScore);
              winners[i].set(sport, newRank);
              winners[i].save(null, null);
            }
            for (j in losers) {
              var newRank = loserRankArr[i] + 32*(0-loserExpScore);
              losers[j].set(sport, newRank);
              losers[j].save(null, null);
            }
             
             //Return success message to client
            response.success("UPDATED RANKINGS");
             
          },
          error: function(error) {
            response.error(error);
          }
        }); 
      },
      error: function(error) {
        response.error(error);
      }
    });
     
     
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

Parse.Cloud.define("initUser", function(request, response) {
  Parse.Cloud.useMasterKey();
  
  //Get list of sports and user from params
  var sportslist = request.params.sports;
  var user = request.user;
      
    //Init all rankings to 1000
    for (var i in sportslist) {
        console.log(sportslist[i]);
        user.set(sportslist[i], 1000);
    }
    user.set('ranking', 1000);
    user.save(null, {
      success: function(user) {
        //Return success to client
        response.success("RANKINGS UPDATED.");
      },
      error: function(user, error) {
        response.error("There was an error initializing user rankings");
      }
    });
  
});

