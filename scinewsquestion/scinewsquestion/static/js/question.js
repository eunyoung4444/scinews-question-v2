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
        document.getElementById('youmay').style.display="inline";
        if(curorder>2){
            document.getElementById("art2").style.display="inline";    
        }
    }

    reconSidebar();
    addevents();
}); // End of document ready clause 

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
        data:{'articleno':articleno, 'user':madeby, 'order':curorder, 'mode':'question'}
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
        $('#popoverdiv').css('display','none');  
    }else{
        var selection=window.getSelection();
        range       = selection.getRangeAt(0),
        clientRects = range.getClientRects();
        selen=clientRects.length;
        endline=clientRects[selen-1];

        xoffset=endline.right;
        yoffset=endline.bottom;
        yscreen=window.scrollY;
        transform='translate3d('+String(xoffset-110)+'px,'+String(yoffset+yscreen-60)+'px,'+String(10)+'px)'
      $('#popoverdiv').css('display','inline');
      $('#popoverdiv').css('position','absolute');
      $('#popoverdiv').css('transform',transform)
      $('#popoverdiv').css('left',+'0px');
      $('#popoverdiv').css('top',+'0px');  
    }
    
  }
} // end of sidebar reconstruction 

function newQmodal(textref, qrefno){
    document.getElementById("modalQreftext").value=textref;
    $("#modalQreftext").attr("disabled",true);
    $('#modalQ').modal();
    if(qrefno==-1){}
    else{
        $('#modalQclose').attr('data-ref',qrefno);
    }
    document.getElementById('modalQquestioninput').focus();
}

function newHmodal(textref,hrefno){
    document.getElementById("modalHreftext").value=textref;
    $("#modalHreftext").attr("disabled",true);
    $("#modalH").modal();
    if(hrefno==-1){}
    else{
        $('#modalHclose').attr('data-ref',hrefno);
    }
    document.getElementById('modalHquestioninput').focus();

}

function newrefH(){
    var selectionText = "";
    if (document.getSelection) {
        selectionText = document.getSelection();
        selectionRange= selectionText.getRangeAt(0);
    } else if (document.selection) {
        selectionText = document.selection.createRange().text;
    }
    reftext=selectionText.toString();
    var newNode=document.createElement("Href");
    selectionRange.surroundContents(newNode);
    newNode.classList.add('Hrefed');
    hrefno=Number(document.getElementById("hgens").innerText);
    hrefno=hrefno+1;
    var hrefid='href'+String(hrefno);
    newNode.setAttribute('id',hrefid);  
    newHmodal(reftext,hrefno);
    $('#popoverdiv').css('display','none');
}

function newrefQ(){
    var selectionText = "";
    if (document.getSelection) {
        selectionText = document.getSelection();
        selectionRange= selectionText.getRangeAt(0);
    } else if (document.selection) {
        selectionText = document.selection.createRange().text;
    }
    reftext=selectionText.toString();
    var newNode=document.createElement("Qref");
    selectionRange.surroundContents(newNode);
    newNode.classList.add('Qrefed');
    qrefno=Number(document.getElementById("qgens").innerText);
    qrefno=qrefno+1;
    var qrefid='qref'+String(qrefno);
    newNode.setAttribute('id',qrefid);    
    newQmodal(reftext, qrefno);
    $('#popoverdiv').css('display','none');
}

function resetSelection(status){
    if (window.getSelection) {
        if (window.getSelection().empty) {  // Chrome
        window.getSelection().empty();
        } else if (window.getSelection().removeAllRanges) {  // Firefox
        window.getSelection().removeAllRanges();
        }
    } else if (document.selection) {  // IE?
        document.selection.empty();
    }
    if(status=="q"){
        qref=document.getElementById('modalQclose').getAttribute('data-ref');
        if(qref!=''){
        qrefid='qref'+String(qref);
        if(document.getElementById(qrefid)){
        orgtext=document.getElementById(qrefid).innerHTML;
        $('#'+qrefid).replaceWith(orgtext);
        }}
        $('#modalQclose').attr('data-ref','');
        document.getElementById('modalQreftext').value='';
        document.getElementById('modalQquestioninput').value='';
        description=document.getElementById('modalQwhy').value='';
        var Qradios=document.getElementsByName('likertQ');
        for (var i=0,length=Qradios.length; i<length; i++){
            Qradios[i].checked=false;
        }
    }
    else{
        if(status=="h"){
            href=document.getElementById('modalHclose').getAttribute('data-ref');
            if(href!=''){
            hrefid='href'+String(href);
            if(document.getElementById(hrefid)){
                orgtext=document.getElementById(hrefid).innerHTML;
                $('#'+hrefid).replaceWith(orgtext);
                }
            }
            $('#modalHclose').attr('data-ref','');
            document.getElementById('modalHreftext').value='';
            document.getElementById('modalHquestioninput').value='';
            description=document.getElementById('modalHwhy').value='';
            var Hradios=document.getElementsByName('likertH');
            for (var i=0,length=Hradios.length; i<length; i++){
                Hradios[i].checked=false;
               }
        }
    } 

}

function submitQ(){
    selectedtext=document.getElementById('modalQreftext').value;
    newquestion=document.getElementById('modalQquestioninput').value;
    description=document.getElementById('modalQwhy').value;
    imp=0;
    var Qradios=document.getElementsByName('likertQ');
    for (var i=0,length=Qradios.length; i<length; i++){
        if(Qradios[i].checked){
            imp=Qradios[i].value;
            break;
        }
    }
    if(newquestion.length<3){
        window.alert('Please write a question with more than 3 characters.')
    }
    else{
        if(description.length<3){
            window.alert('Please make your blank has more than 3 characters.')
        }
        else{
            if(imp==0){
                window.alert('Please anwer the question "How do you agree with the following statement?"')
            }
            else{
                $('#modalQ').modal('hide');

                addnewQ(selectedtext,newquestion, description, imp);
                document.getElementById('modalQreftext').value='';
                document.getElementById('modalQquestioninput').value='';
                description=document.getElementById('modalQwhy').value='';
                $('#modalQclose').attr('data-ref','');
                Qradios[i].checked=false;
            }
        }
    }
}

function submitH(){
    selectedtext=document.getElementById('modalHreftext').value;
    newquestion=document.getElementById('modalHquestioninput').value;
    description=document.getElementById('modalHwhy').value;
    imp=0;
    var Hradios=document.getElementsByName('likertH');
    for (var i=0,length=Hradios.length; i<length; i++){
        if(Hradios[i].checked){
            imp=Hradios[i].value;
            break;
        }
    }
    if(newquestion.length<3){
        window.alert('Please write a question with more than 3 characters.')
    }
    else{
        if(description.length<3){
            window.alert('Please make your blank has more than 3 characters.')
        }
        else{
            if(imp==0){
                window.alert('Please anwer the question "How do you agree with the following statement?"')
            }
            else{
                $('#modalH').modal('hide');
                addnewH(selectedtext,newquestion, description, imp);
                document.getElementById('modalHreftext').value='';
                document.getElementById('modalHquestioninput').value='';
                description=document.getElementById('modalHwhy').value='';
                $('#modalHclose').attr('data-ref','');
                Hradios[i].checked=false;
            }
        }
    }
}


function addnewQ(selectedtext,newquestion, description, imp){
    newQinput=newquestion

    var articleno=Number(document.getElementById("ano").innerText);
    var madeby=document.getElementById('username').innerText;

    qno=Number(document.getElementById("qgens").innerText);
    qno=qno+1;
    var questholder=document.getElementById("questions_generated");
    curlen=questholder.childNodes.length-1;
    newQholder=document.createElement("div");
    newQholder.className="card";
    newQholder.style.width="100%";
    var genid='qgen'+String(qno);
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
        questholder.removeChild(question);
        $.ajax({
            url: 'deletequestion',
            method: 'POST',
            data:{'text':qtext, 'articleno':articleno, 'madeby':madeby, 'genid':genid}
        });
        qno=genid.substring(4,genid.length);
        qrefid='qref'+qno
        if(document.getElementById(qrefid)){
            orgtext=document.getElementById(qrefid).innerHTML;
            $('#'+qrefid).replaceWith(orgtext);  
        }
        qnum=questholder.childNodes.length;
        ShowLessQ();
        ShowLessQ();
        if(qnum<1){ShowLessQ();
        }
        if(qnum<5){
            document.getElementById('submitQbutton').disabled=true;
            document.getElementById('submitQbutton').style.color='lightgray';

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
        url: 'addquestion',
        method: 'POST',
        data:{'reftext':selectedtext,'text':newQinput,'description':description,'importance':imp, 'articleno':articleno, 'madeby':madeby,'genid':genid}
    });
    document.getElementById("qgens").innerText=String(qno)
    if(questholder.childNodes.length>4){
        document.getElementById('submitQbutton').disabled=false;
        document.getElementById('submitQbutton').style.color='black';
    }
    
}

function addnewH(selectedtext,newquestion, description, imp){
    newQinput=newquestion

    var articleno=Number(document.getElementById("ano").innerText);
    var madeby=document.getElementById('username').innerText;

    hno=Number(document.getElementById("hgens").innerText);
    hno=hno+1;
    var questholder=document.getElementById("highlights_generated");
    curlen=questholder.childNodes.length-1;
    newQholder=document.createElement("div");
    newQholder.className="card";
    newQholder.style.width="100%";
    var genid='hgen'+String(hno);
    newQholder.id=genid;
    newQ=document.createElement("div");
    newQ.className="row qrow";
    newQdelete=document.createElement("div");
    newQdelete.setAttribute("class","col-1 deleteholder")
    newQdeletebutton=document.createElement("button");
    newQdeletebutton.setAttribute("class","btn deletebutton");
    newQdeletebutton.innerHTML='<i class="fa fa-times-circle"></i>';

    newQdeletebutton.addEventListener("click", function(){
        var questholder=document.getElementById("highlights_generated");
        qtext=this.parentElement.parentElement.childNodes[0].innerText;
        question=this.parentElement.parentElement.parentElement
        var genid=question.id;
        questholder.removeChild(question);
        $.ajax({
            url: 'deletehighlight',
            method: 'POST',
            data:{'text':qtext, 'articleno':articleno, 'madeby':madeby, 'genid':genid}
        });
        hno=genid.substring(4,genid.length);
        hrefid='href'+qno
        if(document.getElementById(hrefid)){
            orgtext=document.getElementById(hrefid).innerHTML;
            $('#'+hrefid).replaceWith(orgtext);  
        }
        hnum=questholder.childNodes.length;
        ShowLessH();
        ShowLessH();
        if(hnum<1){ShowLessH();
        } 
        if(qnum<5){
            document.getElementById('submitHbutton').disabled=true;
            document.getElementById('submitHbutton').style.color='lightgray';

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
        url: 'addhighlight',
        method: 'POST',
        data:{'reftext':selectedtext,'text':newQinput,'description':description,'importance':imp, 'articleno':articleno, 'madeby':madeby,'genid':genid}
    });
    document.getElementById("hgens").innerText=String(hno)
    if(questholder.childNodes.length>0){
        document.getElementById('submitHbutton').disabled=false;
        document.getElementById('submitHbutton').style.color='black';
    }
}

function ShowLessQ(){
    showbutton=document.getElementById("showless_q");
    curstatus=showbutton.innerText;
    wholelist=document.getElementById("questions_generated");
    wholeQs=wholelist.childNodes;
    if(wholeQs.length>0){
        if(curstatus=="show all"){
            for(var  i=0;i<wholeQs.length;i++) {
                child=wholeQs[i]
                child.style.display="flex";
            }
            showbutton.innerText="show less";
            lastadd=document.getElementById("lastlyaddedq");
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
            lastadd=document.getElementById("lastlyaddedq");
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

function ShowLessH(){
    showbutton=document.getElementById("showless_h");
    curstatus=showbutton.innerText;
    wholelist=document.getElementById("highlights_generated");
    wholeQs=wholelist.childNodes;
    if(wholeQs.length>0){
        if(curstatus=="show all"){
            for(var  i=0;i<wholeQs.length;i++) {
                child=wholeQs[i]
                child.style.display="flex";
            }
            showbutton.innerText="show less";
            lastadd=document.getElementById("lastlyaddedh");
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
            lastadd=document.getElementById("lastlyaddedh");
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
    var curhtml=$('html')[0].innerHTML;   
    $.ajax({
        url: 'sessionend',
        method: 'POST',
        data:{'articleno':articleno, 'user':madeby, 'order':curorder, 'mode':'question', 'htmlresult':curhtml}
    });
    curord=curorder;

    highlighturl='highlight';
    window.location.replace(highlighturl);

    /* if(curord<3){//go to next article
        nextano=nextarticle(upk, curord);
        var newurl='../'+ nextano.toString();
        window.location.replace(newurl);        
    }
    else{ // go to survey
        window.location.replace('../survey/0');
    }     */
}


function submitHs(){
    var upk=Number(document.getElementById('userpk').innerText);
    var articleno=Number(document.getElementById("ano").innerText);
    var madeby=document.getElementById('username').innerText;
    var curorder=Number(document.getElementById("order").innerHTML);
    var curhtml=$('html')[0].innerHTML;
 

    $.ajax({
        url: 'sessionend',
        method: 'POST',
        data:{'articleno':articleno, 'user':madeby, 'order':curorder, 'mode':'highlight','htmlresult':curhtml}
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
