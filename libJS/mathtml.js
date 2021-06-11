/************************

Exemples

E_c = 1/2 mv^2

E = h&nu;

a= y_B-y_A/x_B-x_A

_6^12C

**************************/


function mathJS(c,e)
{
  e=e.split(" ");// sépare les termes et facteurs 'principaux'
  r="";
  var jsm = document.createElement("div");
  jsm.innerHTML=r;
  jsm.setAttribute("class","JSmath");

  for(var n in e)
  {
    t=e[n];

    // Chimie
    t=t.replace(/([\+|\-])_aq/g,"$1(aq)");// en solution
    t=t.replace(/_s/g,"(s)");// etat solide
    t=t.replace(/_g/g,"(g)");// etat gazeux
    t=t.replace(/_l/g,"(l)");// etat liquide

    // fraction a/b
    t=t.replace(/(.+?)\/(.+)/g,"<span style='display:inline'><span class='fraction'><sup class='num'>$1</sup><sub class='den'>$2</sub></span></span>");
    t=t.replace(/\\frac{(.+?)}{(.+)}/g,"<span style='display:inline'><span class='fraction'><sup class='num'>$1</sup><sub class='den'>$2</sub></span></span>");

    // Chimie, charge des ions
    t=t.replace(/\^(\d?[\+|\-])\(/g,"<sup>$1</sup>(");// type n?+/-
    t=t.replace(/\^(\d?)\-$/g,"<sup>$1&minus;</sup>"); // charge des anions -1
    t=t.replace(/\^(\d?)\+$/g,"<sup>$1&plus;</sup>"); // charge des cations +1

    // vecteur AB>
    t=t.replace(/^([A-Za-z]{1,2})\>/g,"<span style='display:inline'><span class='vecteur'><sup class='flecheVecteur'>&rarr;</sup><sub class='nomVecteur'>$1</sub></span></span>");

    // colonne indice exposant, debut de balise, espace obligatoire avant
    t=t.replace(/^_(\S+)\^(\S+)/g,"<span style='display:inline'><span class='fraction'><sup>$2</sup><sub>$1</sub></span></span>");

    // indices bas
    t=t.replace(/_{(.*?)}/g,"<sub>$1</sub>"); // indice général
    t=t.replace(/_(\d+)/g,"<sub>$1</sub>"); // indice plusieurs chiffres
    t=t.replace(/_(\D)/g,"<sub>$1</sub>"); // indice une seule lettre
    t=t.replace(/~/g,"&nbsp");// pour faire des espaces dans sub le plus souvent

    // indices haut
    t=t.replace(/\^{(.*?)}/g,"<sup>$1</sup>"); // exposant général {} toujours avant ligne suivante
    t=t.replace(/\^([\d|\.]+)/g,"<sup>$1</sup>"); // indice numérique entier ou decimal
    t=t.replace(/\^([\+|\-]\d)/g,"<sup>$1</sup>");// type .G^n

    // notation scientifique
    t=t.replace(/(\d)\.(\d)/g,"$1,$2"); // remplace point par virgule entre deux nombres
    t=t.replace(/(\d)\e[\+]*(\d+)/g,"$1&times;10<sup>$2</sup>"); // notation scientifique e+
    t=t.replace(/(\d)\e(\-\d+)/g,"$1&times;10<sup>$2</sup>"); // notation scientifique e-

    // opérateurs et symboles
    t=t.replace(/--\>/g,"<span class='operateur'>&rarr;</span>");
    t=t.replace(/\<--/g,"<span class='operateur'>&larr;</span>");
    t=t.replace(/\*/g,"<span class='operateur'>&times;</span>");

    t=t.replace(/\+(?!\<)/g,"<span class='operateur'>&plus;</span>");// pas de span dans exposants +
    t=t.replace(/\-(?!\<)/g,"<span class='operateur'>&minus;</span>");// pas de span dans exposants -

    //t=t.replace(/\-\</g,"&minus;<");// signe - dans exposant pour anions

    // creation balise pour expression math
    var span=document.createElement("span");
    span.className="element";
    span.innerHTML=t;
    jsm.appendChild(span);
  }

  var qsd=jsm.children;
  for(var q in qsd)// met les variables en italique dans les balises $
  {
    if(qsd[q].nodeType==1)
    {
      qsd[q].innerHTML=qsd[q].innerHTML.replace(/([A-Za-zéèà]+)\</g, "<i>$1</i><");
      qsd[q].innerHTML=qsd[q].innerHTML.replace(/\>([A-Za-zéèà]+)/g, "><i>$1</i>");
      if(qsd[q].innerHTML.match(/\>/g)==null)// si element sans enfant, seulement noeud texte
      {
        qsd[q].innerHTML=qsd[q].innerHTML.replace(/([A-Za-zéèà]+)/g, "<i>$1</i>");
      }
    }
  }
  return jsm.outerHTML;// retourne le html avec la balise principale jsm et ses enfants
}

function mathJScentre(c,exp){ return "<center style='padding:5px 0 0 0 '>"+mathJS(c,exp)+"</center>";}