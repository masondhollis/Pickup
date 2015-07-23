
var $loginbox = $('#overlay');

$('#register').click(function(){
     $loginbox.show();
 });

$('#overlay').click(function(){
    $loginbox.hide();
})
