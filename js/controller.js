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







/***********************************************************
*                         HOMEPAGE                         *
***********************************************************/



var $registerbox = $('#overlay');
//Show registerbox when "register" button clicked
$('#register').click(function(){
     $registerbox.show();
     
     //Transfer info from login form to register form.
     //This feels hack-y, theres probably a better way to do it...
     $("#Reg_username").val($("#username").val());
     $("#Reg_password").val($("#password").val());
 });

//Hide registerbox when user clicks outside box
$('#overlay').click(function(){
    $registerbox.hide();
});
//Need this to cancel ^that^ hide function if the click is inside the modal
$('.modal').click(function(event){
   event.stopPropagation(); 
});

//Verify login and redirect to dashboard
$('#loginform').submit(function(event){
    
    event.preventDefault();

    login();
    
});

//Create new user
$('#registerform').submit(function(event){
    event.preventDefault();
    
    //Transfer Reg_user to user
    $("#username").val($("#Reg_username").val());
    $("#password").val($("#Reg_password").val());
    
    //Set parse user object with user-provided info
    var user = new Parse.User();
    user.set("username", $('#Reg_username').val());
    user.set("email", $('#Reg_email').val());
    user.set("password", $('#Reg_password').val());
    
    //Call parse sign up function
    user.signUp(null, {
        success: function(user) {
            login();
        },
        error: function(user,error) {
            //Naa - Put the error.message string on the screen somewhere. Not in an alert box.
            alert(error.message + "");
        }
    });
    
    
});

function login() {
    //Sets var username equal to value in username field (from HTML page)
    var username = $('#username').val();
    //Sets var password
    var password = $('#password').val();
    
    //Tries to login with username and password set above
    Parse.User.logIn(username, password, {
        
        //Executes if username/password are valid
        success: function(user) {
            window.location.href="./dashboard.html";
        },
        
        //Executes if username/password not valid
        error: function(user, error) {
            //Naa - Put the error.message string on the screen somewhere. Not in an alert box.
            alert(error.message);
        }
    })
};




/***********************************************************
*                         DASHBOARD                        *
***********************************************************/


//Populate all games from database
var newGame = new Game();
var allGames = new Parse.Query(Game);
allGames.find({
    success: function(gamesList) {
        for (var i = 0; i < 3; i++) {
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
    newGame.save(null, {
        success: function(newGame) {
            
        },
        error: function(newGame, error) {
            
        }
    });
});

//Navigate to game page when clicked
$(document).on('click', 'p', function() {
    window.location.href = "./game.html?gameID="+this.id;
});





/***********************************************************
*                         GAME                             *
***********************************************************/


//Get game object
var gameID = getQueryVariable("gameID");

//I'm making a lot of redundant calls to this database but Ill leave it for now. Lets fix it later.
//This one gets the current game
var currentGame = new Parse.Query(Game);
currentGame.equalTo("objectId", gameID);
currentGame.find({
    success: function(games) {
        
        //Hopefully theres only one object in this array but just to avoid weird things later...
        game = games[0];
        $('#sport').html(game.get('sport'));
        $('#location').html(game.get('location'));
        
    },
    error: function(games, error) {
        
    }
});



