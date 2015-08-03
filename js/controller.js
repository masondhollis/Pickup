Parse.initialize("IG0JX8VC6EzA4iBHYO7Lwx50yFUzyRHlX0xBRGyO", "qOP039WAxBznV5RhnL6AWpkSbmhXu5CUAf4mHEFU");

/***********************************************************
*                    General Services                      *
***********************************************************/


//Parses queryString. Like a GET request
function getQueryVariable(variable)
{
       var query = window.location.search.substring(1);
       var vars = query.split("&");
       for (var i=0;i<vars.length;i++) {
               var pair = vars[i].split("=");
               if(pair[0] == variable){return pair[1];}
       }
       return(false);
}

//Needed to call Game object from Parse.
var Game = Parse.Object.extend("Game");

var User = Parse.Object.extend("User");

//Hide registerbox when user clicks outside box
$('#overlay').click(function(){
    $('#overlay').hide();
});
//Need this to cancel ^that^ hide function if the click is inside the modal
$('.modal').click(function(event){
   event.stopPropagation(); 
});


//Log Out
$('#logout').click(function() {
    Parse.User.logOut();
    window.location.href="./index.html"
})