// Populate Rankings
var totalRank = 1000;
for (var i in sportslist) {
    var rank = Parse.User.current().get(sportslist[i]);
    totalRank += rank-1000;
    $("#ranking_overview").append("<p>"+sportslist[i]+": "+Math.round(rank));
}
$("#ranking_overview").prepend("<p><b>OVERALL RANK: "+Math.round(totalRank));