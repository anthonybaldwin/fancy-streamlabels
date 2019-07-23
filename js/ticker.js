/*
  @TODO: Make this a class already... :|
*/

function addElement (responseText, animations, divId) {

  let speed = animations.initial.speed;
  let animation = animations.initial.type;

  let div = document.createElement("div");
  div.textContent = responseText;
  div.setAttribute('id', divId);
  div.classList.add('animated', animation, speed);
  document.body.appendChild(div);
}

function loadXMLDoc(textFile, callback){

  let directory = "StreamLabels/";
  let xmlhttp;
  if (window.XMLHttpRequest)
  {
     xmlhttp = new XMLHttpRequest();
  }
  else
  {
     xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
   }
   xmlhttp.onreadystatechange = function() {
      if (xmlhttp.readyState==4 && xmlhttp.status==200) {
          if ( typeof callback === 'function' )
          {
            callback(xmlhttp.responseText);
          }
      }
  }
  textFile = textFile.replace(/\.[^/.]+$/, "");
  xmlhttp.open("GET", directory+textFile+".txt", true);
  xmlhttp.send();
}

function loadConfig(tickerLocation, callback) //top, bottom, stacked
{
  let file = "/config/animation.json";

  let xmlhttp;
  if (window.XMLHttpRequest)
  {
     xmlhttp = new XMLHttpRequest();
  }
  else
  {
     xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
   }
   xmlhttp.onreadystatechange = function() {
      if (xmlhttp.readyState==4 && xmlhttp.status==200) {
          if ( typeof callback === 'function' )
          {
            let animations = JSON.parse(xmlhttp.responseText);
            animations = animations[tickerLocation];
            callback(animations);
          }
      }
  }
  xmlhttp.open("GET", "/config/animation.json", true);
  xmlhttp.send(null);
}

function ticker(textFile, tickerLocation, divId = 'content')
{
  loadConfig(tickerLocation, function(responseJson) {
    let animations = responseJson;

    //start
    let element = document.getElementById(divId);
    let elementExists = document.body.contains(element);

    if (!elementExists)
    {
      console.log("element does not exist yet")
      loadXMLDoc(textFile, function(responseText) {
        addElement(responseText, animations, divId);
      });
    }
    else
    {
      console.log("element exists");
      loadXMLDoc(textFile, function(responseText) {
        let mainText = document.getElementById(divId);
        mainText.className = '';

        let pageText = mainText.innerHTML.trim();
        let newPageText = responseText.trim();

        /*
          holy shit...what a confusing pain in the ass,
          i.e., random fucking white space
        */
        // console.log("pageText length is: " + pageText.length);
        // console.log("newPageText length is: " + newPageText.length);
        pageText = pageText.trim();
        newPageText = newPageText.trim();

        if (pageText != newPageText)
        {
          let a = animations;
          mainText.classList.add('animated', a.destroy.type, a.destroy.speed);
          mainText.addEventListener('animationend', function() {
              mainText.classList.remove('animated', a.destroy.type, a.destroy.speed);
              mainText.innerHTML = newPageText;
              mainText.classList.add('animated', a.new.type, a.new.speed);
          })
        }
      });
    }
    //end
  });
}
