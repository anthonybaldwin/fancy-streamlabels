/*
  @TODO: Make this a class already... :|
*/

function addElements (responseText, animations, divId) {
  console.log("Creating elements");
  let speed = animations.initial.speed;
  let animation = animations.initial.type;

  let container = document.createElement("div");
  container.classList.add('container');
  document.body.appendChild(container);

  let div = document.createElement("div");
  div.textContent = responseText;
  div.setAttribute('id', divId);
  div.classList.add('content','animated', animation, speed);
  container.appendChild(div);
}

function loadTextFile (textFile, callback, directory = "StreamLabels/") {
  console.log("Loading text file");
  let xmlhttp;
  xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = function()
  {
     if (xmlhttp.readyState==4 && xmlhttp.status==200)
     {
         if ( typeof callback === 'function' )
         {
           callback(xmlhttp.responseText);
         }
     }
 }
  textFile = textFile.replace(/\.[^/.]+$/, "");
  xmlhttp.open("GET", directory+textFile+".txt", true);
  xmlhttp.send(null);
}

function loadAnimationConfig (tickerLocation, callback, file = "/config/animation.json") {
  console.log("Loading animation config")
  let xmlhttp;
  xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = function()
  {
     if (xmlhttp.readyState==4 && xmlhttp.status==200)
     {
         if ( typeof callback === 'function' )
         {
           let animations = JSON.parse(xmlhttp.responseText);
           animations = animations[tickerLocation];
           callback(animations);
         }
     }
  }
  xmlhttp.open("GET", file, true);
  xmlhttp.send(null);
}

function ticker (textFile, tickerLocation, divId = tickerLocation+'Content') {
  loadAnimationConfig(tickerLocation, function(responseJson)
  {
    let animations = responseJson;
    let element = document.getElementById(divId);
    let elementExists = document.body.contains(element);

    if (!elementExists)
    {
      loadTextFile(textFile, function(responseText)
      {
        addElements(responseText, animations, divId);
      });
    }
    else
    {
      loadTextFile(textFile, function(responseText)
      {
        let mainText = document.getElementById(divId);
        mainText.classList = 'content';

        let pageText = mainText.innerHTML.trim().replace(/\n|\r/g, "");
        let newPageText = responseText.trim().replace(/\n|\r/g, "");

        console.log(pageText + " | " + newPageText);
        if (pageText != newPageText)
        {
          console.log("File: '" + textFile + "' has changed")
          let a = animations;
          mainText.classList.add('animated', a.destroy.type, a.destroy.speed);
          mainText.addEventListener('animationend', function()
          {
              mainText.classList.remove('animated', a.destroy.type, a.destroy.speed);
              mainText.innerHTML = newPageText;
              mainText.classList.add('animated', a.new.type, a.new.speed);
          })
        }
      });
    }
  });
}
