// Use Parse.Cloud.define to define as many cloud functions as you want.
// For example:
Parse.Cloud.define("updateRankings", function(request, response) {
   
   
    Parse.Cloud.useMasterKey();
    var winnerList = request.params.winnerNames;
    var loserList = request.params.loserNames;
     
 
     
    var User = Parse.Object.extend("User");
     
     
    //This seems kind of inefficient but doing it all in one call means I have to make more calls to determine winner/loser
    //Also they run simultaneously so not as big of a problem?
    //Make this better somehow??
     
    //Get avg winner ranks
    var winnerRankSum = 0;
    var winnerAvgRank;
     
    var winnerQuery = new Parse.Query("User");
    winnerQuery.containedIn("username", winnerList);
     
    winnerQuery.find ({
      success: function(winners) {
        for (var i = 0; i < winners.length; i++) {
          winnerRankSum += winners[i].get('ranking');
        }
        winnerAvgRank = winnerRankSum / winners.length;
         
        //Get avg loser ranks
         
        var loserRankSum = 0;
        var loserAvgRank;
        var loserQueryArray = [];
         
        for (var i = 0; i < loserList.length; i++) {
          loserQueryArray[i] = new Parse.Query("User");
          loserQueryArray[i].equalTo("username", loserList[i]);
        }
         
         
        var loserQuery = new Parse.Query("User");
        loserQuery.containedIn("username", loserList);
         
        loserQuery.find ({
          success: function(losers) {
            for (var i = 0; i < losers.length; i++) {
              loserRankSum += losers[i].get('ranking');
            }
            loserAvgRank = loserRankSum / losers.length;
             
            var winnerExpScore = 1 / (1+Math.pow(10, (loserAvgRank - winnerAvgRank)/400));
            var loserExpScore = 1-winnerExpScore;
             
            for (i in winners) {
              //Already getting this above. Look here if we need to speed this up later.. Gotta get it out now though so...
              var newRank = winners[i].get('ranking') + 32*(1-winnerExpScore);
              winners[i].set('ranking', newRank);
              winners[i].save(null, null);
            }
            for (j in losers) {
              var newRank = losers[j].get('ranking') + 32*(0-loserExpScore);
              losers[j].set('ranking', newRank);
              losers[j].save(null, null);
            }
             
            response.success(losers);
             
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
     
     
 
     
     
    // 1v1 SUPPORT ONLY //
    /*//Get winner
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
    })*/
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
  var sportslist = request.params.sports;
  var user = request.user;
      
    console.log(user);
    
    for (var i in sportslist) {
        console.log(sportslist[i]);
        user.set(sportslist[i], 1000);
    }
    
    user.save(null, {
      success: function(user) {
        response.success("RANKINGS UPDATED.");
      },
      error: function(user, error) {
        response.error("There was an error initializing user rankings");
      }
    });
  
});

