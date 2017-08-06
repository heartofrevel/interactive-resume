$(function() {

  // Set the command-line prompt to include the user's IP Address
  //$('.prompt').html('[' + codehelper_ip["IP"] + '@HTML5] # ');
  $('.prompt').html('[RESUME OF ANSHUL] # ');

  // Initialize a new terminal object

  document.getElementById("formSubmit").onclick = function(){
    var inName = document.getElementById("inName");
    var inCompany = document.getElementById("inCompany");
    var inEmail = document.getElementById("inEmail");
    var inPosition = document.getElementById("inPosition");
    var errorLabel = document.getElementById("errorLabel");
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if(inName.value.trim() == "" || inCompany.value.trim() == "" || inEmail.value.trim() == ""){
      errorLabel.innerHTML = "Kindly fill all the required fields.(*)";
      errorLabel.style.display='block';
    }
    else if (!re.test(inEmail.value)) {
      errorLabel.innerHTML = "Kindly enter a valid email address.";
      errorLabel.style.display='block';
    }
    else{
      errorLabel.innerHTML = "Working ... "
      errorLabel.style.display='block';
      var formData={};
      formData.name = inName.value;
      formData.company = inCompany.value;
      formData.email = inEmail.value;
      formData.position = inPosition.value;
      formData = JSON.stringify(formData);
      $.ajax({
        url:"backend/mailer.php",
        type:"POST",
        dataType:"text",
        data:formData,
        success:function(data){
          if(data == 'IE'){
            errorLabel.innerHTML = "There is some problem with database. Kindly try again later or mail me at root@anshul.online.";
            errorLabel.style.display='block';
          }
          else if (data == "MSE") {
            errorLabel.innerHTML = "There is some problem with Mail Service. Kindly try again later or mail me at root@anshul.online.";
            errorLabel.style.display='block';
          }
          else if (data == "OK") {
            errorLabel.innerHTML = "To reduce spam emails, I have sent you a verification link on your email. Kindly verify.<br />Note, I will only receive your hire request only if you verify your email id.";
            errorLabel.style.display='block';
          }
          else{
            errorLabel.innerHTML = "Error. Try Again Later.";
            errorLabel.style.display='block';
          }
          inName.value = "";
          inCompany.value = "";
          inEmail.value = "";
          inPosition.value = "";
        },
        error:function(jqXHR, textStatus, errorThrown) {
          console.log(textStatus, errorThrown);
          errorLabel.innerHTML = "Some Error, Kindly Submit Again.";
          errorLabel.style.display='block';
        }
      });
    }
  }
  var term = new Terminal('#input-line .cmdline', '#container output');
  term.init();


  // Update the clock every second
  setInterval(function() {
    function r(cls, deg) {
      $('.' + cls).attr('transform', 'rotate('+ deg +' 50 50)')
    }
    var d = new Date()
    r("sec", 6*d.getSeconds())
    r("min", 6*d.getMinutes())
    r("hour", 30*(d.getHours()%12) + d.getMinutes()/2)
  }, 1000);

});
