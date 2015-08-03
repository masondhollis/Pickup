/***********************************************************
*                         HOMEPAGE                         *
***********************************************************/



//Show registerbox when "register" button clicked
$('#register').click(function(){
     $('#loginform').hide();
     $('#joinform').show();
     
     //Transfer info from login form to register form.
     //This feels hack-y, theres probably a better way to do it...
     $("#Reg_username").val($("#username").val());
     $("#Reg_password").val($("#password").val());
 });

$('#login').click(function() {
     $('#joinform').hide();
     $('#loginform').show();
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
    user.set("ranking", 1000);
    
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