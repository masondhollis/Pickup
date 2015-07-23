Parse.initialize("IG0JX8VC6EzA4iBHYO7Lwx50yFUzyRHlX0xBRGyO", "qOP039WAxBznV5RhnL6AWpkSbmhXu5CUAf4mHEFU");




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
var Game = Parse.Object.extend("Game");
var newGame = new Game();
var allGames = new Parse.Query(Game);
allGames.find({
    success: function(gamesList) {
        for (var i = 0; i < gamesList.length; i++) {
            game = gamesList[i];
            $('#current_games').append('<p>'+game.get('sport')+' at '+game.get('location')+'</p>');
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
            $('#your_games').append('<p>'+game.get('sport')+' at '+game.get('location')+'</p>');
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


