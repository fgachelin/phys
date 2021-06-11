/************************
    GESTION DES LIENS
************************/
var url=document.baseURI.split("?");

if(url.length==1)
{
  var source="index.md";
  var repertoire="/";
}
else if(url[1].substr(url[1].length-3)==".md")// si lien explicite vers .md
{
  var source=url[1];
  var repertoire=url[1].match(/(.*)\//gm)[0];
}
else if(url[1].match(/\./g)==null)// si lien implicite vers .md = vers un dossier
{
  var source=url[1]+"/index.md";
  var repertoire=url[1].match(/(.*)/gm)[0];
}
else// lien vers pdf, html, php...
{
  window.location.replace(url[1]);
}

/*********************************** 
     AJAX CHARGE LE MARKDOWN
***********************************/
function loadDoc(source, rep)
{
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function()
  {
    if (this.readyState == 4 && this.status == 200)
    {
      var d=new Document(this.responseText, rep);
    }
  };
  xhttp.open("GET", source, true);
  xhttp.send();
}

loadDoc(source, repertoire);// affichage initial de la page

//setInterval('loadDoc()', 3000);// rafraichissement si cours visio

