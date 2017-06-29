/***********************************************************
*                         HOMEPAGE                         *
***********************************************************/
//$("#joinerror").hide();


var currentUser = Parse.User.current();
                if (currentUser) {
                    // do stuff with the user
                    // Replace this with redirect to dashboard
                    console.log("Current User");
                    window.location.href="../dashboard.html"
                    //Parse.User.logOut();
                }

var joinShown = false;
var signInShown = false;



$('#learn, #arrow').click(function(){
     $('html, body').animate({
            scrollTop: $("#what").offset().top
        }, 500);
        return false;
})

$('#updated').click(function(){
     $('html, body').animate({
            scrollTop: $("#subscribe").offset().top
        }, 500);
        return false;
})

//Show registerbox when "register" button clicked
$('#register').click(function(){
     if (joinShown == false) {
          $('#loginform').hide();
          signInShown = false;
          $('#joinform').show();
          joinShown = true;

          //Transfer info from login form to register form.
          //This feels hack-y, theres probably a better way to do it...
          $("#Reg_username").val($("#username").val());
          $("#Reg_password").val($("#password").val());
     }
     else
          $('#joinform').submit();
 });

$('#login').click(function() {
     if (signInShown == false) {
          $('#joinform').hide();
          joinShown = false;
          $('#loginform').show();
          signInShown = true;
     }
     else login();
});

//Verify login and redirect to dashboard
$('#loginform').submit(function(event){

    event.preventDefault();
    login();

});



//Create new user
$('#joinform').submit(function(event){

    event.preventDefault();

    setUpUser();


});

function setUpUser() {

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
            console.log("SIGN UP SUCCESS");

            var params = {
               sports: sportslist,
               userID: user.id
            };

            Parse.Cloud.run('initUser', params, {
               success: function(response) {
                    console.log(response);
                    login();
               },
               error: function(reponse, error) {
                    console.log(error);
               }
            });


        },
        error: function(user,error) {
            //Naa - Put the error.message string on the screen somewhere. Not in an alert box.
            //alert(error.message + "");
            $("#joinerror").html(error.message);
        }
    })
}


function login() {
    //Sets var username equal to value in username field (from HTML page)
    var username = $('#username').val();
    //Sets var password
    var password = $('#password').val();



    //Tries to login with username and password set above
    Parse.User.logIn(username, password, {

        //Executes if username/password are valid

        //HAD TO DO IT LIKE THIS FOR LOCAL BUT SHOULD LINK TO PICKUPBETA.COM/DASHBOARD LATER TO BE LESS PAGE SPECIFIC
        success: function(user) {
            window.location.href="../dashboard.html";
        },

        //Executes if username/password not valid
        error: function(user, error) {
            //Naa - Put the error.message string on the screen somewhere. Not in an alert box.
            $("#loginerror").html(error.message);
            //alert(error.message);
        }
    })
};
