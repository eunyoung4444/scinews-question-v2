// variables
 $(document).ready(function(){
    // Insert body text, reconstruct <p> structure
    var body=document.getElementById("text")
    bodytext=body.innerText;
    body.innerHTML=bodytext;

    body.style.display="inline";
    // jQuery AJAX set up
    function getCookie(name) {
        var cookieValue = null;
        if (document.cookie && document.cookie != '') {
            var cookies = document.cookie.split(';');
            for (var i = 0; i < cookies.length; i++) {
                var cookie = jQuery.trim(cookies[i]);
                // Does this cookie string begin with the name we want?
                if (cookie.substring(0, name.length + 1) == (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }
    var csrftoken = getCookie('csrftoken');
    function csrfSafeMethod(method) {
        // these HTTP methods do not require CSRF protection
        return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
    }
    $.ajaxSetup({
        beforeSend: function(xhr, settings) {
            if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
                xhr.setRequestHeader("X-CSRFToken", csrftoken);
            }
        }
    });
    
    var articleno=Number(document.getElementById("ano").innerText);
    var userpk=Number(document.getElementById('userpk').innerText);
    
    var curorder=currentorder(articleno, userpk);
    document.getElementById("order").innerHTML=String(curorder);
    if(curorder>1){
        document.getElementById("prevholder").style.display="inline";
        document.getElementById("art1").style.display="inline";
        if(curorder>2){
            document.getElementById("art2").style.display="inline";    
        }
    }

    reconSidebar();
    addevents();
}); // End of document ready clause 


function reconSidebar(){
 //Floating sidebar
    var topPosition = $("#floating-div").offset().top - 10;
    var parentwidth = $('#sidebar-container').width();
    var floatingDiv = $('#floating-div')[0];
    window.onresize = function(){
    parentwidth=$('#sidebar-container').width();
    floatingDiv.style.width=parentwidth.toString()+"px"    
    }
    floatingDiv.style.width=parentwidth.toString()+"px"    
    var win = $(window);
    win.scroll(function() {
        var floatingDivHeight = $('#floating-div').outerHeight();
        var footerFromTop = $('#footer').offset().top;
        var absPosition = footerFromTop - floatingDivHeight - 20;
        if ((win.scrollTop() > topPosition) && (win.scrollTop() < absPosition)) {
        floatingDiv.style.position="fixed";
        floatingDiv.style.width=parentwidth.toString()+"px";
        } else if ((win.scrollTop() > topPosition) && (win.scrollTop() > absPosition)) {
        floatingDiv.style.position="absolute";
        floatingDiv.style.width=parentwidth.toString()+"px";
        } else {
        floatingDiv.style.position=""
        floatingDiv.style.width=parentwidth.toString()+"px";
        }
    
    });
    var articleno=Number(document.getElementById("ano").innerText);
    var madeby=document.getElementById('username').innerText;
    var curorder=Number(document.getElementById("order").innerHTML);

    $.ajax({
        url: 'sessionstart',
        method: 'POST',
        data:{'articleno':articleno, 'user':madeby, 'order':curorder}
    });
}/*    var questholder=document.getElementById("selected_questions");
   var qrows=document.getElementsByClassName("qrow");
   for (var i=0; i<qrows.length;i++){
       thisqrow=qrows[i];
       thisqrow.style.width=(questholder.offsetWidth-36).toString()+"px";
   }
    */
function addevents(){

    var leftsection=document.getElementById("article");
    leftsection.onmouseup = function(e) {
        var noselec=true;
        if (window.getSelection) {
            if(window.getSelection().toString().length>2){
                noselec=false;
            }
        } else if (document.selection) {  // IE?
            if(document.selection.createRange().text.length>2){
                noselec=false;
            }
        }
        if(noselec){
            if(document.getElementById('newAnnotQinput')!=null){
                et=e.target;
                if(et.classList.contains('popoverrow')||et.id=='newQbutton'||et.id=='newAnnotQinput'){}
                 else{
                    input=document.getElementById('newAnnotQinput');
                    annots= $('#newAnnotQinput').attr('data-annotid');
                    annot=document.getElementById(annots)
                    $('#'+annots).popover('hide')
                    annottext=annot.innerText;
                    $('#'+annots).replaceWith(annottext)
                }
            }

        }
        else{
            if(document.getElementById('newAnnotQinput')!=null){
                et=e.target;
                if(et.classList.contains('popoverrow')||et.id=='newQbutton'||et.id=='newAnnotQinput'){}
                 else{
                    input=document.getElementById('newAnnotQinput');
                    annots= $('#newAnnotQinput').attr('data-annotid');
                    annot=document.getElementById(annots)
                    $('#'+annots).popover('hide')
                    annottext=annot.innerText;
                    $('#'+annots).replaceWith(annottext)
            }
        }   
        snapSelectionToWord();}
        ////// reset the selection 
        
    //}
  }



} // end of sidebar reconstruction 


function addAnnotQ(annotid){
    newQinputbox=document.getElementById('newAnnotQinput');
    annot=document.getElementById(annotid);
    annottext=annot.innerText;
    newQinput=newQinputbox.value;
    newpopover=document.make
    console.log($('#'+annotid))
    deleteid="delete"+annotid;
    if(newQinput.length>2){
        $('#'+annotid).attr('data-content','<div class="popoverrow row qrow"><div class="qlist col-11">'+newQinput+'</div><div class="col-1 deleteholder"><button id="'+deleteid+'" class="btn deletebutton"><i class="fa fa-trash" style="color:#9b9b9b;"></i></button></div></div>');
        $('#'+annotid).popover('hide',500)
        var articleno=Number(document.getElementById("ano").innerText);
        var madeby=document.getElementById('username').innerText;
    
        $.ajax({
            url: 'addannotquestion',
            method: 'POST',
            data:{'text':newQinput, 'articleno':articleno, 'madeby':madeby, 'reftexts':annottext,'annotid':annotid}
        });
        /* ({
            html:true,
            content:newQinput,
            placement:'right',
        }) */
        $('#'+annotid).popover().on('shown.bs.popover', function(){
            document.getElementById(annotid).classList.add('selectedannotation');
            deleteid="delete"+annotid;
            newAnnotdeletebutton=document.getElementById(deleteid);
            newAnnotdeletebutton.addEventListener("click", function(){
                annot=document.getElementById(annotid)
                $('#'+annotid).popover('hide')
                annottext=annot.innerText;
                annothtml=annot.innerHTML;
                $('#'+annotid).replaceWith(annothtml)
                console.log(annotid)
                $.ajax({
                    url: 'deleteannotquestion',
                    method: 'POST',
                    data:{'text':newQinput, 'articleno':articleno, 'madeby':madeby, 'reftexts':annottext, 'annotid':annotid}
                });
       });
                
        }).on('hidden.bs.popover',function(){
            document.getElementById(annotid).classList.remove('selectedannotation');  
        })
        qannots=Number(document.getElementById('qannots').innerText)
        newq=qannots+1;
        document.getElementById('qannots').innerHTML=String(newq);
            
    }



    else{
        newQinputbox.value='';
    }

}

function addnewQ(){
    newQinputbox=document.getElementById("newQinput");
    newQinput=newQinputbox.value;

    var articleno=Number(document.getElementById("ano").innerText);
    var madeby=document.getElementById('username').innerText;
    if(newQinput.length>2){
        genno=Number(document.getElementById("qgens").innerText);
        genno=genno+1;
        var questholder=document.getElementById("questions_generated");
        curlen=questholder.childNodes.length-1;
        newQholder=document.createElement("div");
        newQholder.className="card";
        newQholder.style.width="100%";
        var genid='gen'+String(genno);
        newQholder.id=genid;
        newQ=document.createElement("div");
        newQ.className="row qrow";
        newQdelete=document.createElement("div");
        newQdelete.setAttribute("class","col-1 deleteholder")
        newQdeletebutton=document.createElement("button");
        newQdeletebutton.setAttribute("class","btn deletebutton");
        newQdeletebutton.innerHTML='<i class="fa fa-times-circle"></i>';

        newQdeletebutton.addEventListener("click", function(){
            var questholder=document.getElementById("questions_generated");
            qtext=this.parentElement.parentElement.childNodes[0].innerText;
            question=this.parentElement.parentElement.parentElement
            var genid=question.id;
            console.log(qtext, genid)
            questholder.removeChild(question);
            $.ajax({
                url: 'deletegenquestion',
                method: 'POST',
                data:{'text':qtext, 'articleno':articleno, 'madeby':madeby, 'genid':genid}
            });
            qnum=questholder.childNodes.length;
            ShowLess();
            ShowLess();
            if(qnum<1){ShowLess();
            }     
        });

        newQdelete.appendChild(newQdeletebutton);

    
        newQtext=document.createElement("div");
        newQtext.setAttribute("class","qlist col-11");
        newQtext.innerHTML=newQinput
//        newQtext.setAttribute("style","text-align: justify");
    
        newQ.appendChild(newQtext);
        newQ.appendChild(newQdelete);
        newQholder.appendChild(newQ);
        questholder.appendChild(newQholder);
    

        $.ajax({
            url: 'addgenquestion',
            method: 'POST',
            data:{'text':newQinput, 'articleno':articleno, 'madeby':madeby,'genid':genid}
        });
        document.getElementById("qgens").innerText=String(genno)


        newQinputbox.value="";
        
    }
}



// Text Selection, at word level
function selectText() {
    var selectionText = "";
    if (document.getSelection) {
        selectionText = document.getSelection();
        selectionRange= selectionText.getRangeAt(0);
    } else if (document.selection) {
        selectionText = document.selection.createRange().text;
    }
    var newNode= document.createElement("annot");
    selectionRange.surroundContents(newNode);
    newNode.classList.add('annotated')
// clear text selection 
    if (window.getSelection) {
        if (window.getSelection().empty) {  // Chrome
        window.getSelection().empty();
        } else if (window.getSelection().removeAllRanges) {  // Firefox
        window.getSelection().removeAllRanges();
        }
    } else if (document.selection) {  // IE?
        document.selection.empty();
    }
    qannots=Number(document.getElementById('qannots').innerText)
    thisnum=qannots+1
    thisid='annot'+String(thisnum)
    newNode.setAttribute('id',thisid)
    $('#'+thisid).popover({
        html:true,
        content:'<div class="popoverrow">What is your question? Or what do you want to know?</div><div class="popoverrow"><div id="newQ"><input type="text" data-annotid="'+thisid+'"id="newAnnotQinput" placeholder="Type in your question"style="width:75%;height:30px"><button class="btn" id="newQbutton" onclick="addAnnotQ(thisid)">Add</button></div></div>',
        placement:'right',
    }).on('shown.bs.popover', function(){
        $('#newAnnotQinput').focus();        
    })
    $('#'+thisid).popover('show');
  }

  function snapSelectionToWord() {
    var sel;
    // Check for existence of window.getSelection() and that it has a
    // modify() method. IE 9 has both selection APIs but no modify() method.
    if (window.getSelection && (sel = window.getSelection()).modify) {
        sel = window.getSelection();
        if(sel.toString().length>1){ 
        if (!sel.isCollapsed) {

            // Detect if selection is backwards
            var range = document.createRange();
            range.setStart(sel.anchorNode, sel.anchorOffset);
            range.setEnd(sel.focusNode, sel.focusOffset);
            var backwards = range.collapsed;
            range.detach();

            // modify() works on the focus of the selection
            var endNode = sel.focusNode, endOffset = sel.focusOffset;
            sel.collapse(sel.anchorNode, sel.anchorOffset);
            
            var direction = [];
            if (backwards) {
                direction = ['backward', 'forward'];
            } else {
                direction = ['forward', 'backward'];
            }

            sel.modify("move", direction[0], "character");
            sel.modify("move", direction[1], "word");
            sel.extend(endNode, endOffset);
            sel.modify("extend", direction[1], "character");
            sel.modify("extend", direction[0], "word");

            selectText();

        }
        else{
            if (window.getSelection) {
                if (window.getSelection().empty) {  // Chrome
                window.getSelection().empty();
                } else if (window.getSelection().removeAllRanges) {  // Firefox
                window.getSelection().removeAllRanges();
                }
            } else if (document.selection) {  // IE?
                document.selection.empty();
            }
        }
    }
    } else if ( (sel = document.selection) && sel.type != "Control") {
        var textRange = sel.createRange();
        if(textRange.text.length> 1){ 
        if (textRange.text) {
            textRange.expand("word");
            // Move the end back to not include the word's trailing space(s),
            // if necessary
            while(/\s$/.text(textRange.text)){
              textRange.moveEnd("character",-1);}
              textRange.select();
            }}
            selectText();
        }
        else{
            if (window.getSelection) {
                if (window.getSelection().empty) {  // Chrome
                window.getSelection().empty();
                } else if (window.getSelection().removeAllRanges) {  // Firefox
                window.getSelection().removeAllRanges();
                }
            } else if (document.selection) {  // IE?
                document.selection.empty();
            }
        }
        
    }

    function ShowLess(){
    showbutton=document.getElementById("showless");
    curstatus=showbutton.innerText;
    wholelist=document.getElementById("questions_generated");
    wholeQs=wholelist.childNodes;
    if(wholeQs.length>0){
        if(curstatus=="show all"){
            for(var  i=0;i<wholeQs.length;i++) {
                child=wholeQs[i]
                child.style.display="flex";
            }
            lastadd.style.display="none";
            showbutton.innerText="show less";
            lastadd=document.getElementById("lastlyadded");
            lastadd.style.display="none";
     
        }
        else{               
            for(var i=0; i<wholeQs.length;i++) {
                child=wholeQs[i];
                child.style.display="none";
            }
            nQs=wholeQs.length;
            lastNode=wholeQs[nQs-1]
            lastNode.style.display="flex";
            showbutton.innerText="show all";
            lastadd=document.getElementById("lastlyadded");
            lastadd.style.display="inline";
        }}
    else{
        if(curstatus=="show all"){
            showbutton.innerText="show less";
        }
        else{               
            showbutton.innerText="show all";
        }

    }
}

function submitQs(){
    var upk=Number(document.getElementById('userpk').innerText);
    var articleno=Number(document.getElementById("ano").innerText);
    var madeby=document.getElementById('username').innerText;
    var curorder=Number(document.getElementById("order").innerHTML);

    $.ajax({
        url: 'sessionend',
        method: 'POST',
        data:{'articleno':articleno, 'user':madeby, 'order':curorder}
    });
    curord=curorder;

    if(curord<3){//go to next article
        nextano=nextarticle(upk, curord);
        var newurl='../'+ nextano.toString();
        window.location.replace(newurl);        
    }
    else{ // go to survey
        window.location.replace('../survey/0');
    }    
}

function currentorder(ano, upk){
    var orders=[
        [1,2,3],
        [1,3,2],
        [2,3,1],
        [2,1,3],
        [3,1,2],
        [3,2,1]
    ];
    group=upk%6;
    myorder=orders[group]
    ord=myorder.indexOf(ano)+1 //1,2,3
    return ord    
}

function nextarticle(upk, curord){
    //curord = 1 or 2
    var orders=[
        [1,2,3],
        [1,3,2],
        [2,3,1],
        [2,1,3],
        [3,1,2],
        [3,2,1]
    ];
    group=upk%6;
    myorder=orders[group]
    nextorder=curord
    nextano=myorder[nextorder]
    return nextano
}

function article1(upk, curord){
    var orders=[
        [1,2,3],
        [1,3,2],
        [2,3,1],
        [2,1,3],
        [3,1,2],
        [3,2,1]
    ];
    group=upk%6;
    myorder=orders[group]
    prevano=myorder[0]
    return prevano 
}

function article2(upk, curord){
    var orders=[
        [1,2,3],
        [1,3,2],
        [2,3,1],
        [2,1,3],
        [3,1,2],
        [3,2,1]
    ];
    group=upk%6;
    myorder=orders[group]
    prevprevano=myorder[1]
    return prevprevano 
}

function opena1(){
    var articleno=Number(document.getElementById("ano").innerText);
    var userpk=Number(document.getElementById('userpk').innerText);
    var curorder=currentorder(articleno, userpk);
    a1no=article1(userpk,curorder);
    window.open('http://4cb16589.ngrok.io/question/'+String(a1no), '_blank')//http://4cb16589.ngrok.io/question/login/
}

function opena2(){
    var articleno=Number(document.getElementById("ano").innerText);
    var userpk=Number(document.getElementById('userpk').innerText);
    var curorder=currentorder(articleno, userpk);
    a2no=article2(userpk,curorder);
    window.open('http://4cb16589.ngrok.io/question/'+String(a2no), '_blank')
}

