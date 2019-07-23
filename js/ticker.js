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

function loadTextFile(textFile, callback, directory = "StreamLabels/")
{
  let xmlhttp;
  if (window.XMLHttpRequest)
  {
     xmlhttp = new XMLHttpRequest();
  }
  else
  {
     xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
   }
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
  xmlhttp.send();
}

function loadConfig(tickerLocation, callback, file = "/config/animation.json") //top, bottom, stacked
{
  let xmlhttp;
  if (window.XMLHttpRequest)
  {
     xmlhttp = new XMLHttpRequest();
  }
  else
  {
     xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
   }
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

function ticker(textFile, tickerLocation, divId = 'content')
{
  loadConfig(tickerLocation, function(responseJson)
  {
    let animations = responseJson;
    let element = document.getElementById(divId);
    let elementExists = document.body.contains(element);

    if (!elementExists)
    {
      loadTextFile(textFile, function(responseText)
      {
        addElement(responseText, animations, divId);
      });
    }
    else
    {
      loadTextFile(textFile, function(responseText)
      {
        let mainText = document.getElementById(divId);
        mainText.className = '';

        let pageText = mainText.innerHTML;
        pageText = pageText.trim();
        let newPageText = responseText;
        newPageText = newPageText.trim();

        if (pageText != newPageText)
        {
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
