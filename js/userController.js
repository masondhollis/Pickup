// Populate Rankings

for (var i in sportslist) {
    
    console.log(sportslist[i]);
    console.log(Parse.User.current().get(sportslist[0]));
    
    $("#ranking_overview").append("<p>"+sportslist[i]+": "+Parse.User.current().get(sportslist[i]));
}