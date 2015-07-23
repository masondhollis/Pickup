Parse.initialize("IG0JX8VC6EzA4iBHYO7Lwx50yFUzyRHlX0xBRGyO", "qOP039WAxBznV5RhnL6AWpkSbmhXu5CUAf4mHEFU");




/***********************************************************
*                         HOMEPAGE                         *
***********************************************************/



var $registerbox = $('#overlay');
//Show registerbox when "register" button clicked
$('#register').click(function(){
     $registerbox.show();
 });

//Hide registerbox when user clicks outside box
$('#overlay').click(function(){
    $registerbox.hide();
});
//Need this to cancel ^that^ hide function if the click is inside the modal
$('#register_modal').click(function(event){
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
    
    var user = new Parse.User();
    user.set("username", $('#Reg_username').val());
    user.set("email", $('#Reg_email').val());
    user.set("password", $('#Reg_password').val());
    
    user.signUp(null, {
        success: function(user) {
            //Need to transfer Reg_username to username
            login();
        },
        error: function(user,error) {
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
}


