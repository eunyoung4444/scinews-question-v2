// variables
 $(document).ready(function(){
    // Insert body text, reconstruct <p> structure
    var body=document.getElementById("text")
    var bodySents=body.innerText.split("<sent>").filter(function(entry){ return entry.trim() !='';});
    var bodySentsClean=[];
    for (var i=0;i<bodySents.length;i++){
        var newsent=bodySents[i].split("</sent>").filter(function(entry){ return entry.trim() !='';});
        bodySentsClean.push(newsent[0]);
    }
    body.removeChild(body.childNodes[0]);
    for (var i=0;i<bodySentsClean.length;i++){
        if(bodySentsClean[i]=="<br>"){
            asent=document.createElement("br");
            body.appendChild(asent)
            asent=document.createElement("br");
            body.appendChild(asent)
        }
        else{
            if(bodySentsClean[i].startsWith(" ")){
                var asent=document.createElement("SENT");
                asent.classList.add('normal');
                asent.appendChild(document.createTextNode(bodySentsClean[i].substring(1,)));
                body.appendChild(asent);
                var space=document.createTextNode(" ");
                body.insertBefore(space, asent);
            }
            else{
            var asent=document.createElement("SENT");
            asent.classList.add('normal');
            asent.appendChild(document.createTextNode(bodySentsClean[i]));
            body.appendChild(asent);
        }}
    }
    // Give id to each sentence 
    sents=document.getElementById("text").getElementsByTagName("sent");
    for (var i=0;i<sents.length;i++){
        thissent=sents[i];
        thissent.setAttribute("id","sent"+i.toString());
    }
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
 
    //Text select text and add it as a reference.
    var sentences=document.getElementsByTagName("sent");
    for (var i =0;i<sentences.length;i++){
        sentence=sentences[i];
//        sentence.addEventListener
    }
    reconSidebar();
    $("#newQinput").keyup(function(event) {
        if (event.keyCode === 13) {
            $("#newQbutton").click();
        }
    });
/*     .onmouseup = function() {
        //// do something only if one add ref popover is open 
        if(document.getElementById("ref_input")){
            var currefinput=document.getElementById("ref_input");
            var parentButton=currefinput.parentElement.parentElement.parentElement.parentElement.previousSibling;
            var refstat=$(parentButton).find("#refstatus");
            var refno=parentButton.id.substring(6);
            snapSelectionToWord(currefinput, refno);
            ////// reset the selection         
        }
        else{
            snapSelectToQuestion();
        }} */
}); // End of document ready clause 
// Prevent generation of duplicated questions

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
    var floatingDivHeight = $('#floating-div').outerHeight();
    var footerFromTop = $('#footer').offset().top;
    var absPosition = footerFromTop - floatingDivHeight - 20;
    var win = $(window);
    win.scroll(function() {
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
} // end of sidebar reconstruction 

function submitQs(){
    var question_generated=document.getElementById("questions_generated");
    var question_holders=question_generated.getElementsByClassName("card");
    var articleno=Number(document.getElementById("ano").innerText);
    var madeby=document.getElementById('username').innerText;
    console.log(question_holders.length);
    for (var i=0;i<question_holders.length;i++){
        var aquestion=question_holders[i].firstChild.firstChild.innerText;   
        $.ajax({
            url: 'addquestion',
            method: 'POST',
            data:{'text':aquestion, 'articleno':articleno, 'madeby':madeby, 'madeat':"qcol"}
        });
    }
    var quizurl='../../quiz/'+ articleno.toString();
    window.location.replace(quizurl);
}


function addnewQ(){
    newQinputbox=document.getElementById("newQinput");
    newQinput=newQinputbox.value;
    if(newQinput.length>2){

        newQdeletebutton.addEventListener("click", function(){
            var questholder=document.getElementById("questions_generated");
            questholder.removeChild(this.parentElement.parentElement.parentElement);
            document.getElementById("qnumtotal").innerHTML=questholder.childNodes.length-1;   
            showbutton=document.getElementById("showless");
            if((questholder.childNodes.length<6)&&(questholder.childNodes.length>1)){
                $("#submitQbutton")[0].disabled=true;
                $("#submitQbutton")[0].style.backgroundColor="white";
                $("#submitQbutton")[0].style.color="black"; 
                showbutton=document.getElementById("showless");
                showbutton.value="show all"
                ShowLess();    
                $("#showless")[0].style.display="none";             
                }
            else{
                if(showbutton.value=="show all");
                showbutton.value="show less"
                ShowLess();                
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

        newQinputbox.value="";
        document.getElementById("qnumtotal").innerHTML=questholder.childNodes.length-1;
        if(questholder.childNodes.length>5){
            console.log("HI?")
            $("#submitQbutton")[0].disabled=false;
            $("#submitQbutton")[0].style.backgroundColor="#17a2b8";
            $("#submitQbutton")[0].style.color="white";   
            $("#showless")[0].style.display="inline"; 
            showbutton=document.getElementById("showless");
            if(showbutton.innerHTML=="show all"){
                showbutton.innerHTML="show less";
                ShowLess();          
            }
        }
        
    }
}

function ShowLess(){
    showbutton=document.getElementById("showless");
    curstatus=showbutton.innerText;
    wholelist=document.getElementById("questions_generated");
    wholeQs=wholelist.childNodes;
    if(curstatus=="show all"){
        for(var  i=1;i<wholeQs.length;i++) {
            child=wholeQs[i]
            child.style.display="flex";
        }
        showbutton.innerText="show less";
    }
    else{               
        for(var i=1; i<wholeQs.length;i++) {
            child=wholeQs[i];
            child.style.display="none";
        }
        nQs=wholeQs.length-1;
        lastNode=wholeQs[nQs]
        lastlastNode=wholeQs[nQs-1]
        lastNode.style.display="flex";
        lastlastNode.style.display="flex";
        showbutton.innerText="show all";
    }
}
