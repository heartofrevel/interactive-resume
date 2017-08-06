var util = util || {};
util.toArray = function(list) {
  return Array.prototype.slice.call(list || [], 0);
};

var hiremeFlag = false;

var Terminal = Terminal || function(cmdLineContainer, outputContainer) {
  window.URL = window.URL || window.webkitURL;
  window.requestFileSystem = window.requestFileSystem || window.webkitRequestFileSystem;

  var cmdLine_ = document.querySelector(cmdLineContainer);
  var output_ = document.querySelector(outputContainer);

  const CMDS_ = {
    'education':"Print education qualifications.",
    'date':"Print today's date.",
    'clear':"Clear Screen",
    'help':"Print Help.",
    'experience':"Print experience details.",
    'projects':"Print details of projects I have worked on.",
    'certifications':"Print details of certifications I have passed.",
    'honors':"Print details of competitions I have won.",
    'skills':"Print details of skills that I have.",
    'personal':"Print my personal details.",
    'download':"Download my resume in PDF format.",
    'hireme':"This will automatically send me a mail that you want to hire me.",
    'github':"Open up my GitHub profile in new tab/window.",
    'linkedin':"Open up my LinkedIN prfoile in new tab/window.",
    'facebook':"Opens up my Facebook Profile in new tab/window.",
    'insta':"Opens up my Instagram profile in new tab/window.",
    'goodreads':"Opens up my Goodreads Profile in new tab/window.",
    'blog':"Open my blog in new tab/window.",
    'dob':"Print my Date of Birth.",
    'hobbies': "Print some of my hobbies apart from coding.",
    'home':"Go back to Home Page."
  }

  var commands = Object.keys(CMDS_);

  var fs_ = null;
  var cwd_ = null;
  var history_ = [];
  var histpos_ = 0;
  var histtemp_ = 0;

  window.addEventListener('click', function(e) {
    if (!hiremeFlag){
      cmdLine_.focus();
    }
  }, false);

  cmdLine_.addEventListener('click', inputTextClick_, false);
  cmdLine_.addEventListener('keydown', historyHandler_, false);
  cmdLine_.addEventListener('keydown', processNewCommand_, false);

  //
  function inputTextClick_(e) {
    this.value = this.value;
  }

  //
  function historyHandler_(e) {
    if (history_.length) {
      if (e.keyCode == 38 || e.keyCode == 40) {
        if (history_[histpos_]) {
          history_[histpos_] = this.value;
        } else {
          histtemp_ = this.value;
        }
      }

      if (e.keyCode == 38) { // up
        histpos_--;
        if (histpos_ < 0) {
          histpos_ = 0;
        }
      } else if (e.keyCode == 40) { // down
        histpos_++;
        if (histpos_ > history_.length) {
          histpos_ = history_.length;
        }
      }

      if (e.keyCode == 38 || e.keyCode == 40) {
        this.value = history_[histpos_] ? history_[histpos_] : histtemp_;
        this.value = this.value; // Sets cursor to end of input.
      }
    }
  }

  function parseData(cmd, data){
    if(cmd==='education'){
      var outputString = "<table><tr><th>School</th><th>Place</th><th>Passing Year</th><th>Description</th></tr>"
      for(var i=0; i<data.length;i++){
        var obj = data[i];
        outputString = outputString+"<tr><td>"+obj.name+"</td><td>"+obj.place+"</td><td>"+obj.year+"</td><td>"+obj.description+"</td></tr>"
      }
      outputString = outputString+"</table>";
      output(outputString)
    }
    else if (cmd==='experience') {
      var outputString = "<table><tr><th>Company</th><th>Role</th><th>Place</th><th>From</th><th>To</th><th>Description</th></tr>"
      for(var i=0; i<data.length;i++){
        var obj = data[i];
        outputString = outputString+"<tr><td>"+obj.name+"</td><td>"+obj.role+"</td><td>"+obj.place+"</td><td>"+obj.fromTime+"</td><td>"+obj.toTime+"</td><td>"+obj.description+"</td></tr>"
      }
      outputString = outputString+"</table>";
      output(outputString)
    }
    else if(cmd === 'projects'){
      var outputString = "<table><tr><th>Name</th><th>Platform</th><th>Programming Languages and Framework</th><th>Tools Used</th><th>Link</th><th>Description</th></tr>"
      for(var i=0; i<data.length;i++){
        var obj = data[i];
        outputString = outputString+"<tr><td>"+obj.name+"</td><td>"+obj.platform+"</td><td>"+obj.progLang+"</td><td>"+obj.tools+"</td><td><a style='text-decoration:none;color:inherit;' href='" +obj.link+"' target='_blank'>"+obj.link+"</a></td><td>"+obj.description+"</td></tr>"
      }
      outputString = outputString+"</table>";
      output(outputString)
    }
    else if(cmd==='certifications'){
      var outputString = "<table><tr><th>Code</th><th>Name</th><th>Certification Date</th></tr>"
      for(var i=0; i<data.length;i++){
        var obj = data[i];
        outputString = outputString+"<tr><td>"+obj.code+"</td><td>"+obj.name+"</td><td>"+obj.time+"</td></tr>"
      }
      outputString = outputString+"</table>";
      output(outputString)
    }
    else if(cmd==='honors'){
      var outputString = "<table><tr><th>Achievement</th><th>When</th><th>Description</th></tr>"
      for(var i=0; i<data.length;i++){
        var obj = data[i];
        outputString = outputString+"<tr><td>"+obj.achievement+"</td><td>"+obj.when+"</td><td>"+obj.description+"</td></tr>"
      }
      outputString = outputString+"</table>";
      output(outputString)
    }
    else if(cmd==='skills'){
      var outputString = "<table><tr><th>Skill</th><th>Proficiency</th></tr>"
      for(var i=0; i<data.length;i++){
        var obj = data[i];
        outputString = outputString+"<tr><td>"+obj.skill+"</td><td>"+obj.proficiency+"</td></tr>"
      }
      outputString = outputString+"</table>";
      output(outputString)
    }
  }

  function duplicateCurrentInput(context) {
    var line = context.parentNode.parentNode.cloneNode(true);
    line.removeAttribute('id')
    line.classList.add('line');
    var input = line.querySelector('input.cmdline');
    input.autofocus = false;
    input.readOnly = true;
    output_.appendChild(line);
  }


  function processNewCommand_(e) {

    if (e.keyCode == 9) { // tab
      e.preventDefault();

      var args = this.value.split(' ').filter(function(val, i) {
        return val;
      });
      var cmd = args[0].toLowerCase();
      var cmdPossible = [];
      for(var i=0; i < commands.length ; i++ ){
        if(commands[i].indexOf(cmd) == 0){
          cmdPossible.push(commands[i]);
        }
      }
      if(cmdPossible.length>1){
        duplicateCurrentInput(this)
        for(var i = 0; i < cmdPossible.length; i++){
          var spC = 18-cmdPossible[i].length;
          output(cmdPossible[i]+Array(spC).join("&nbsp;")+":&emsp;&emsp;"+CMDS_[cmdPossible[i]])
        }
      }
      else if(cmdPossible.length == 1){
        this.value = cmdPossible[0];
      }
      window.scrollTo(0, getDocHeight_());
    } else if (e.keyCode == 13) { // enter
      // Save shell history.
      if (this.value) {
        history_[history_.length] = this.value;
        histpos_ = history_.length;
      }

      duplicateCurrentInput(this)

      if (this.value && this.value.trim()) {
        var args = this.value.split(' ').filter(function(val, i) {
          return val;
        });
        var cmd = args[0].toLowerCase();
        if(args[1] != undefined){
          var option = args[1].toLowerCase();
          args = args.splice(1);
        }
        args = args.splice(1); // Remove cmd from arg list.
      }

      switch (cmd) {
        case 'clear':
          output_.innerHTML = '';
          this.value = '';
          return;
        case 'date':
          output( new Date() );
          break;
        case 'help':
          // output('<div class="ls-files">' + CMDS_.join('<br /> <br />') + '</div>');
          for (var key in CMDS_){
            var spC = 18-key.length;
            output(key+Array(spC).join("&nbsp;")+":&emsp;&emsp;"+CMDS_[key])
          }
          break;
        case 'download':
          var fileext;
          if(option == "pdf" || option == undefined){
            fileext = ".pdf"
          }
          else if(option == "doc"){
            fileext = ".docx"
          }
          else{
            output("Unknown File Format, default file format(.pdf) is selected.")
            fileext = ".pdf"
          }
          $.ajax({
            url:"backend/download.php?ext="+fileext,
            type:"GET",
            success:function(){
                window.location = "backend/download.php?ext="+fileext;
            },
            error:function(jqXHR, textStatus, errorThrown) {
              console.log(textStatus, errorThrown);
            }
          });
          output("The download will start shortly.")
          break;
        case 'hireme':
          hiremeFlag = true;
          var modal = document.getElementById('myModal');
          var span = document.getElementsByClassName("close")[0];
          modal.style.display = "block";
          var errorLabel = document.getElementById("errorLabel");
          errorLabel.innerHTML = "";

          span.onclick = function() {
            modal.style.display = "none";
            hiremeFlag = false;
          }
          window.onclick = function(event) {
            if (event.target == modal) {
              modal.style.display = "none";
              hiremeFlag = false;
              cmdLine_.focus();
            }

          }

          break;
        case 'github':
          window.open("https://github.com/k3rn3l-",'_blank');
          break;
        case 'linkedin':
          window.open("https://www.linkedin.com/in/k3rn3l/",'_blank');
          break;
        case 'facebook':
          window.open("https://facebook.com/thisisanshulgupta",'_blank');
          break;
        case 'blog':
          window.open("https://anshul.online/blog/",'_blank');
          break;
        case 'insta':
          window.open("https://www.instagram.com/thisisanshulgupta/",'_blank');
          break;
        case 'goodreads':
          window.open("https://www.goodreads.com/user/show/50162218-anshul-gupta",'_blank');
          break;
        case 'dob':
          output('4th October 1993');
          break;
        case 'hobbies':
          output('Reading, Table Tennis, Travel, Binge Watching, Listening Music ....... and the list goes on.........');
          break;
        case 'home':
          window.open("https://anshul.online", "_self");
          break;
        default:
          if($.inArray(cmd, commands) != -1){
            $.ajax({
              url:"backend/server.php",
              type:"POST",
              dataType:"json",
              data:{command:cmd},
              async:false,
              success:function(data){
                if(data.msg == "NR")
                {
                  output(cmd+ " fetched no results.")
                }
                else{
                  parseData(cmd, data);
                }
              },
              error:function(jqXHR, textStatus, errorThrown) {
                console.log(textStatus, errorThrown);
              }
            });
          }
          else if (cmd) {
              output(cmd + ': command not found');
          }
          break;

      };

      window.scrollTo(0, getDocHeight_());
      this.value = ''; // Clear/setup line for next input.
    }
  }

  //
  function formatColumns_(entries) {
    var maxName = entries[0].name;
    util.toArray(entries).forEach(function(entry, i) {
      if (entry.name.length > maxName.length) {
        maxName = entry.name;
      }
    });

    var height = entries.length <= 3 ?
        'height: ' + (entries.length * 15) + 'px;' : '';

    // 12px monospace font yields ~7px screen width.
    var colWidth = maxName.length * 7;

    return ['<div class="ls-files" style="-webkit-column-width:',
            colWidth, 'px;', height, '">'];
  }

  //
  function output(html) {
    output_.insertAdjacentHTML('beforeEnd',"<p>" + html + "</p>");
  }

  // Cross-browser impl to get document's height.
  function getDocHeight_() {
    var d = document;
    return Math.max(
        Math.max(d.body.scrollHeight, d.documentElement.scrollHeight),
        Math.max(d.body.offsetHeight, d.documentElement.offsetHeight),
        Math.max(d.body.clientHeight, d.documentElement.clientHeight)
    );
  }

  //
  return {
    init: function() {
      output('Welcome to Anshul\'s Resume')
      output('This interactive resume also supports tab completion. :)')
      output('<p>Enter "help" for more information.</p>');
    },
    output: output
  }
};
