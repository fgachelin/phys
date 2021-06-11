class Document
{
  constructor(brut, repertoire)
  {      
    this.brut=brut.replace(/\r/g,"");
    this.repertoire=repertoire;
    this.lignes=brut.split("\n\n");
    this.niveaux=[];
    this.affiche_titre();// à partir d'une eventuelle entête ---title: ---
    this.creer_niveaux();// définit this.niveaux. h1=niveau1, h2=niveau2, etc...
    this.creer_html();// cree structure titres - paragraphes à partir de this.niveaux avec data-brut=this.lignes
    this.mise_en_forme();// en insérant data-brut mis en forme md vers html
    this.split_page();// si BG ... MP .... BD    |..     .|.   ..|
  }

  affiche_titre()
  {
    if(this.brut.match(/\-\-\-\n(.*)\n\-\-\-\n/gm)!=null)// si une entete ---metadonnees--- existe
    {
      var meta=this.brut.match(/\-\-\-\n(.*)\n\-\-\-\n/gms)[0];
      var titre="";
      meta.replace(/title:(.*?)(date|author|\-\-\-)/gms,function (c,e){titre=e;})
      titre=titre.replace(/\n|\|/g,"").replace(/\\/g,"<br>");
      var div_titre=document.createElement("div");
      div_titre.innerHTML=titre;
      div_titre.setAttribute("class", "titre")
      div_titre.setAttribute("onclick", "voir_tout()")// voir tous les paragraphes
      document.body.appendChild(div_titre);// ajoute balise pour le titre de la page
      this.lignes=this.brut.split(/\n\-\-\-\n/gms)[1].split("\n\n");// nouvelle definition si entête metadonnees
    }
  }

  creer_niveaux()
  {
    for(var l=0;l<this.lignes.length;l++)
    {
      this.lignes[l]=this.lignes[l].replace(/^\n*/g,"");
      if(this.lignes[l].match(/^#/g)==null)// seulement si commence par #
        {this.niveaux.push(10);}
      else
        {this.niveaux.push(this.lignes[l].match(/#/g).length);}
    }
  }

  creer_html()// cree structure document html sans textContent
  {
    var n=0;
    var n_paragraphe=0;
    while(n<this.lignes.length)
    {
      if(this.niveaux[n]==1)
      {
        if(n_paragraphe==1){
          n_paragraphe=0;
          document.body.appendChild(div);// attention! variable div delà créée si n_paragraphe==1
        }

        var element=document.createElement("h1");
        element.setAttribute('onclick','voir_paragraphe(this)');
        element.setAttribute("data-brut",this.lignes[n]);
        var fleche=document.createElement('span');// flêche titre h2 derouler paragraphe
        fleche.innerHTML="&#9661;";
        fleche.className='fleche_droite';
        element.appendChild(fleche);
        document.body.appendChild(element);// ajoute la div paragraphe au body

        if(n_paragraphe==0)
        {
          n_paragraphe=1;
          var div=document.createElement("div");
          div.setAttribute("class","paragraphe");
          div.setAttribute("style","display:block;");// paragraphe masqué (none) ou non (block) !!!!!!!!!!!!!!!!!!!
        }
      }

      else if(this.niveaux[n]==2)
      {
        if(n_paragraphe==0){var div=document.body;}// paragraphe hors titre h2
        var el_tmp=document.createElement("h2");
        el_tmp.setAttribute("data-brut",this.lignes[n]);
        div.appendChild(el_tmp);
      }
      else if(this.niveaux[n]==3)
      {
        if(n_paragraphe==0){var div=document.body;}// paragraphe hors titre h2
        var el_tmp=document.createElement("h3");
        el_tmp.setAttribute("data-brut",this.lignes[n]);
        div.appendChild(el_tmp);
      }
      else if(this.niveaux[n]==4)
      {
        if(n_paragraphe==0){var div=document.body;}// paragraphe hors titre h2
        var el_tmp=document.createElement("h4");
        el_tmp.setAttribute("data-brut",this.lignes[n]);
        div.appendChild(el_tmp);
      }
      else
      {
        if(n_paragraphe==0){var div=document.body;}// paragraphe hors titre h2
        var el_tmp=document.createElement("p");
        el_tmp.setAttribute("data-brut",this.lignes[n]);
        div.appendChild(el_tmp);
      }
      n++;
    }
    if(n_paragraphe==1)
      {document.body.appendChild(div);}
  }

  /********************************************************
                      MISE EN FORME
  ********************************************************/

  mise_en_forme()// contenu html à partir de data-brut de chaque balise avec contenu document
  {
    var p = document.querySelectorAll('p,h1,h2,h3,h4');// comme getElementsByTagName mais multiple tag possible
    for(var i=0;i<p.length;i++)
    {
      var r=p[i].getAttribute("data-brut");
      this.tag=p[i];

      r=r.replace(/\$\$(.+?)\$\$/g, mathJScentre);// expression math centrée
      r=r.replace(/\$(.+?)\$/g, mathJS);// expression math en ligne incluse dans le texte

      /*******************************************
                        PYTHON
      *******************************************/
      if(r.match(/^```python/g)!=null)
      {
        p[i].setAttribute("style","background-color:black;color:white;padding:0.5em;font-family:Courier;border:1px solid black");
        r=r.replace(/^```python\n(.*)```/gms,this.code_python);
        r=r.replace(/\n\n$/g,"\n");// efface ligne fin de paragraphe
        r=r.replace(/\n/gm,"<br>");
        r=r.replace(/[ ]{2}/gm,"&nbsp;&nbsp;");// tabulation
        r=r.replace(/ # /g," &#9839; ");// commentaire
        r=r.replace(/(def |in |for |while |if |var |return |print)/g,"<span><b style='color:red;'>$1</b></span>");// coloration mots-cles
        r=r.replace(/([0-9]+?)/g,"<span><b style='color:#77f;'>$1</b></span>");// coloration chiffres
      }
      r=r.replace(/`(.*?)`/g,"<span class='python_en_ligne'>$1</span>")// python dans texte


      /*************************************************
                         MARDOWN STANDARD
      ****************************************************/
      if(p[i].tagName!="P"){r=r.replace(/#/g,"");}// efface uniquement les # des titres

      r=r.replace(/!\[(.*?)\]\((.*?)\){(.*?)}/g,"<img src='"+this.repertoire+"/$2' style='$3'></img><br>$1");// image markdown avec {style}
      
      r=r.replace(/!\[(.*?)\]\((.*?)\)/g, "<img src='"+this.repertoire+"/$2'></img><br><center><u>$1</u></center>");// image markdown classique
      r=r.replace(/\[(.*?)\]\((.*?)\)/g, "<a href='index.html?"+this.repertoire+"/$2'>$1</a> ");// lien markdown classique
      r=r.replace(/\?(.*?)\/http/g, "?http")// pour les liens exterieurs, retire this.repertoire (this.lien ne fonctionne pas)
      r=r.replace(/\?\/\//g,"?");// mystere des // dans les liens a...

      r=r.replace(/^\[(.*?)\] /g, this.checkbox(p[i]));// input checkbox formulaire [], code réponse bonne ou non

      r=r.replace(/\*\*(.*?)\*\*/g,"<b>$1</b>");// texte gras

      r=r.replace(/ \\ /g," <br> ");// aller à la ligne

      /*************************************************
                        Bricolage Maison      
      **************************************************/

      r=r.replace(/(Q{0,1}\d+)\.\s/g,"<b class='Qn'>$1.</b> ");// numero de liste en gras
      r=r.replace(/__(.*?)__/gm,"<small>$1</small>")// texte en petit

      /******************************************************
                         TABLEAU
       * *************************************************/
      if(r.match(/^table/gms)!=null)
      {
        r=r.replace(/^table(.*)/gms,this.tableau);
      }

      /* TABULATION */
      if(r.match(/[ ]{4}\*/g)!=null)// liste tabulation = 4 espaces
      {
        p[i].setAttribute("style","padding-left:30px");
        r=r.replace(/\* /g,"<span style='margin-left:-8px'>&#8227;</span> ");// puce liste
      }

      if(r.match(/\*/g)!=null)// liste sans tabulation
      {
        p[i].setAttribute("style","padding-left:10px");
        r=r.replace(/\* /g,"<span style='margin-left:-8px'>&#8226;</span> ");// puce liste
      }
      p[i].innerHTML=r;// insere le code du paragraphe i
    }
  }

  checkbox(c,e)
  {

    if(e=="x")
    {
      this.tag.setAttribute("data-brut", this.tag.getAttribute("data-brut").replace("[x] ","[]"));
      return "<input type='checkbox' data-correction='"+Math.random().toString().substr(2,10)+"' value='"+e+"'/>"
    }
    else 
    {
      return "<input type='checkbox' data-correction='"+Math.random().toString().substr(2,10)+"' value='"+e+"'/>"
    }
  }

  code_python(c,e)// retire les ``` et créé les tabulations
  {
    e=e.replace(/```/g,"");
    e=e.replace(/[ ]{4}\*/g,"<span style='width:10px'>$nbsp;</span>");
    return e;
  }

  tableau(c,exp)
  {
    exp=exp.replace(/\<br\>/g,"");//efface <br> mystère ?!
    var lignes=exp.split("\n");

    var alignements=lignes[0].match(/\((.*)\)/g)[0].replace(/\(|\)/g,"").split(" ");
    var styles={"l":"left", "c":"center", "r":"right"};
    for(var i in alignements){  alignements[i]=styles[alignements[i]];  }
    exp="<table style='border:1px solid black; border-collapse:collapse'>";// début tableau
    for(var l=1;l<lignes.length-1;l++)
    {
      exp+="<tr>";// début de ligne
      var tds=lignes[l].split(" & ")// définit les colonnes
      for(var t=0;t<tds.length;t++)// boucle sur les colonnes
      {
        exp+="<td style='border:1px solid black;padding:6px;text-align:"+alignements[t]+"'>"+tds[t]+"</td>";// contenu de chaque cellule de la ligne
      }
      exp+="<tr>";// fin de ligne
    }
    exp+="</table>\n";// fin tableau
    return exp;
  }

  split_page()
  {
    var PC=document.getElementsByClassName("paragraphe");
    
    for(let u=0;u<PC.length;u++)
    {
      var cote="c";
      //var p=PC[u].getElementsByTagName("P");
      var p=PC[u].querySelectorAll("p, h2, h3, h4, h5");

      for(var r=0;r<PC[u].getElementsByTagName("P").length;r++)// recherche 2 colonnes
      {
        if(p[r].getAttribute("data-brut").substr(0,3)=="|..")// BG 
        {
          cote="g";
          p[r].setAttribute("hidden","true");
          var conteneur=document.createElement("div");
          var gauche=document.createElement("div");
          var droite=document.createElement("div");
          gauche.setAttribute("class","colonne");
          droite.setAttribute("class","colonne");            
          PC[u].insertBefore(conteneur, p[r].nextSibling)
          conteneur.setAttribute("class","split");
          conteneur.setAttribute("data-brut","")
          conteneur.appendChild(gauche);
          conteneur.appendChild(droite); 
          p[r].setAttribute("hidden","true")
        }
        if(p[r].getAttribute("data-brut").substr(0,3)==".|."){cote="d";p[r].setAttribute("hidden","true")}// MP
        if(p[r].getAttribute("data-brut").substr(0,3)=="..|"){cote="c";p[r].setAttribute("hidden","true")}// BD
 
        if(cote=="g"){gauche.appendChild(p[r]);}
        if(cote=="d"){droite.appendChild(p[r]);}
      }
    }
    

    for(let u=0;u<PC.length;u++)// à adapter pour pouvoir le faire dans pages 2 colonnes
    {
      var p=PC[u].getElementsByTagName("P");
      var cadre = false;
      for(var r=0;r<PC[u].getElementsByTagName("P").length;r++)// recherche paragraphe encadré
      {
        console.log(p[r].innerHTML);
        if(p[r].getAttribute("data-brut")==">>>")// debut paragraphe, pas de confusion avec >>> cmd python
        {
          cadre=!cadre;
          if(cadre)
          {
            p[r].setAttribute("hidden","true");
            var div_cadre=document.createElement("div");
            div_cadre.setAttribute("class", "cadre");
            PC[u].insertBefore(div_cadre, p[r].nextSibling);
          }
          else
          {
            p[r].setAttribute("hidden","true")
          }
        }
        if(cadre){div_cadre.appendChild(p[r]);}// ajoute les éléments à div cadre
      }
    }

  }

  export_pdf()// mise en page pour export pdf...à poursuivre
  {
      var win = window.open('','','left=0,top=0,width=552,height=477,toolbar=0,scrollbars=0,status =0');
      win.document.close();
  }

}