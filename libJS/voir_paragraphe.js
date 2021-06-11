function voir_paragraphe(t)// affiche ou cahe paragraphe par click sur titre h1
{
  var paragraphe=t.nextSibling;// div paragraphe
  if(paragraphe.style.display=="none")
    {paragraphe.style.display="block";t.children[0].innerHTML="&#9651;"; }
  else
    {paragraphe.style.display="none"; t.children[0].innerHTML="&#9661;"; }
}

function voir_tout()// à revoir car probleme avec 2 colonnes
{
  /*
  var prg=document.querySelectorAll('p, div, h2, h3, h4, h5')
  for(let i=0; i<prg.length; i++)
  {
    prg[i].style.display="block";
  }
  */
}