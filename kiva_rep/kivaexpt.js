var BrowserDetect = {
  init: function () {
    this.browser = this.searchString(this.dataBrowser) || "An unknown browser";
    this.version = this.searchVersion(navigator.userAgent)
      || this.searchVersion(navigator.appVersion)
      || "an unknown version";
    this.OS = this.searchString(this.dataOS) || "an unknown OS";
  },
  searchString: function (data) {
    for (var i=0;i<data.length;i++) {
      var dataString = data[i].string;
      var dataProp = data[i].prop;
      this.versionSearchString = data[i].versionSearch || data[i].identity;
      if (dataString) {
        if (dataString.indexOf(data[i].subString) != -1)
          return data[i].identity;
      }
      else if (dataProp)
        return data[i].identity;
    }
  },
  searchVersion: function (dataString) {
    var index = dataString.indexOf(this.versionSearchString);
    if (index == -1) return;
    return parseFloat(dataString.substring(index+this.versionSearchString.length+1));
  },
  dataBrowser: [
    {
      string: navigator.userAgent,
      subString: "Chrome",
      identity: "Chrome"
    },
    {   string: navigator.userAgent,
      subString: "OmniWeb",
      versionSearch: "OmniWeb/",
      identity: "OmniWeb"
    },
    {
      string: navigator.vendor,
      subString: "Apple",
      identity: "Safari",
      versionSearch: "Version"
    },
    {
      prop: window.opera,
      identity: "Opera",
      versionSearch: "Version"
    },
    {
      string: navigator.vendor,
      subString: "iCab",
      identity: "iCab"
    },
    {
      string: navigator.vendor,
      subString: "KDE",
      identity: "Konqueror"
    },
    {
      string: navigator.userAgent,
      subString: "Firefox",
      identity: "Firefox"
    },
    {
      string: navigator.vendor,
      subString: "Camino",
      identity: "Camino"
    },
    {   // for newer Netscapes (6+)
      string: navigator.userAgent,
      subString: "Netscape",
      identity: "Netscape"
    },
    {
      string: navigator.userAgent,
      subString: "MSIE",
      identity: "Explorer",
      versionSearch: "MSIE"
    },
    {
      string: navigator.userAgent,
      subString: "Gecko",
      identity: "Mozilla",
      versionSearch: "rv"
    },
    {     // for older Netscapes (4-)
      string: navigator.userAgent,
      subString: "Mozilla",
      identity: "Netscape",
      versionSearch: "Mozilla"
    }
  ],
  dataOS : [
    {
      string: navigator.platform,
      subString: "Win",
      identity: "Windows"
    },
    {
      string: navigator.platform,
      subString: "Mac",
      identity: "Mac"
    },
    {
         string: navigator.userAgent,
         subString: "iPhone",
         identity: "iPhone/iPod"
      },
    {
      string: navigator.platform,
      subString: "Linux",
      identity: "Linux"
    }
  ]

};
BrowserDetect.init();

/*
showSlide(id)
Displays each slide
*/




function showSlide(id) {
  $(".slide").hide();
  $("#"+id).show();
};

function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex ;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
};

var imageElement = document.getElementById("imageElement");
var numTrials=20;
var ord=new Array();
var imgs="";
var randInd="";
var i=0;
var images = new Array()

var numComplete = 0;
var trial;


// Condition - call the maker getter to get the cond variable 
try {
    var filename = "kiva_rep"
    var filelist = "kiva_imgids"
    var condCounts = "1"   
    var xmlHttp = null;
    xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", "https://web.stanford.edu/~lctong/cgi-bin/maker_getter_kiva.php?conds=" + 
    condCounts +"&filename=" + filename +"&filelist=" + filelist + "&ntrials=" +numTrials, false );
    xmlHttp.send( null );
    var imgdata = xmlHttp.responseText;
    imgs=imgdata.split(" ");
    ord=shuffle(imgs);
} catch (e) {
    $.get("https://web.stanford.edu/~lctong/cgi-bin/experiment_files/kiva_imgids.txt",{},function(data){
    imgs=data.split("\n");
    ord=shuffle(imgs);
    });
}

// Decrement only if this is an actual turk worker!  
    imgdata= imgdata.split(' ').join(';');
  if (turk.workerId.length > 0){
   var xmlHttp = null;
   xmlHttp = new XMLHttpRequest();
   xmlHttp.open('GET',    
    'https://web.stanford.edu/~lctong/cgi-bin/' + 
    'decrementer_yt.php?filename=' + 
    filename + "&to_decrement=" + imgdata, false);
    xmlHttp.send(null);
  }

// preload images
for (i = 0; i < numTrials; i++) {
    trial = ord[(i)];
    images[i] = new Image()
    url = "https://www.kiva.org/img/s300/" + trial + ".jpg/"
    images[i].src = url
    }

$("#progressBar").hide();
showSlide("instructions");

// Updates the progress bar
$("#trial-num").html(numComplete);
$("#total-num").html(numTrials);


// the main experiment object that 
var experiment = {

  orderArray: ord,
  reactionTimeArray: new Array(numTrials),
  startTime: 0,
  endTime: 0,

  clear: new Array(numTrials),
  valence: new Array(numTrials),
  arousal: new Array(numTrials),
  discrete: new Array(numTrials),
  intensity: new Array(numTrials),
  need: new Array(numTrials),

  // Demographics
  gender: "",
  age:"",
  race:"",
  raceother:"",
  nativeLanguage:"",
  browser: BrowserDetect.browser,
  browserVersion: BrowserDetect.version,
  browserOS: BrowserDetect.OS,
  comments:"",

  afterEA: function() {
    experiment.end();
  },

  end: function() {
    // Records demographics
    experiment.gender = $('input[name="genderButton"]:checked').val();
    //experiment.age = $('select[name="ageRange"]').val();
    experiment.race = $('input[name="raceButton"]:checked').val();
    experiment.raceother = $('#raceOther').val();
    experiment.age = $('#ageRange').val();
    experiment.nativeLanguage = $('input[name="nativeLanguage"]').val();
    experiment.comments = $('textarea[name="commentsTextArea"]').val();

    // Show the finish slide.
    showSlide("finished");

    /*
    Wait 1.5 seconds and then submit the whole experiment object to Mechanical Turk (mmturkey filters out the functions so we know we’re just submitting properties [i.e. data])
    */
    setTimeout(function() { turk.submit(experiment);}, 1500);
  },

  debrief: function() {
      showSlide("debrief");
  },


  next: function() {
    if(numComplete==0){
      $("#progressBar").show();
      experiment.startTime = (new Date()).getTime();}

    if(numComplete>0) {
      $('#nextButton').attr("disabled","true");
      // record variables
      experiment.endTime = (new Date()).getTime();
      experiment.reactionTimeArray[numComplete-1] = experiment.endTime - experiment.startTime;
      experiment.clear[numComplete-1] = parseInt($('input[name="cansee"]:checked').val(),10);
      experiment.valence[numComplete-1] = parseInt($('input[name="val"]:checked').val(),10);
      experiment.arousal[numComplete-1] = parseInt($('input[name="aro"]:checked').val(),10);
      experiment.discrete[numComplete-1] = parseInt($('input[name="emo"]:checked').val(),10);
      experiment.intensity[numComplete-1] = parseInt($('input[name="inten"]:checked').val(),10);
      experiment.need[numComplete-1] = parseInt($('input[name="need"]:checked').val(),10);

    }
    if (numComplete >= numTrials) {
              $('.bar').css('width', (200.0 * numComplete/ (numTrials) ) + 'px');
              $("#trial-num").html(numComplete);
              showSlide("askInfo");
    }else{
      $('.bar').css('width', (200.0 * numComplete/ (numTrials) ) + 'px');
      $("#trial-num").html(numComplete);
      //trial = ord[(numComplete)];
      //impath = "https://www.kiva.org/img/s300/" + trial + ".jpg/";
      imageElement.setAttribute("src", images[(numComplete)].src);
      $('input[name=cansee]').attr('checked',false);
      $('input[name=val]').attr('checked',false);
      $('input[name=aro]').attr('checked',false);
      $('input[name=emo]').attr('checked',false);
      $('input[name=inten]').attr('checked',false);
      $('input[name=need]').attr('checked',false);

      imageElement.onload = function() {
        $('#nextButton').removeAttr("disabled");
        showSlide("stage");
        $('body').scrollTop(0);
      }
      numComplete++;
    }
  },

};


