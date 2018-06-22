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
    var maxcount=maxcountnumber();
    var refc=refcounter();
    var refcount=refc[0];
    var qnumholders=refc[1];
    console.log(qnumholders)
    var numbins=5;
    var colorpal=['','','#f0f8fe','#dff1fe','#cfe9fd'];
    //'#dbeffe','#b4defc','#87cefa'
    //'#e4f2fe','#c8e7fd','#a9dafb','#87cefa'
    //'#ffffff','#e3f3fa','#c7e6f5','#a9daf0','#87ceeb'
    //'#ffffff','#ecf6fe','#dbeffe','#c8e7fd','#b4defc','#9ed6fb','#87cefa'
    //https://gka.github.io/palettes/#colors=white,lightskyblue|steps=4|bez=1|coL=1
    var threshs=thresholds(refcount, numbins);

    // Give id to each sentence 
    sents=document.getElementById("text").getElementsByTagName("sent");
    for (var i=0;i<sents.length;i++){
        thissent=sents[i];
        thissent.setAttribute("id","sent"+i.toString());
        corlor=getcolor(colorpal,threshs,refcount[i]);
        if(color!=''){
            thissent.classList.add('selectable');
        }
        thissent.style.backgroundColor=color;
        $("#sent"+i.toString()).on({
            mouseenter: function(){
            if(this.classList.contains('selectable')){
                this.style.border="1px dashed rgb(151, 167, 189)";
            }},
            mouseleave: function(){
                if(this.classList.contains('selectable')){
                    this.style.border="";
                 }
            }
        });
        $("#sent"+i.toString()).click(function(){
            if(this.classList.contains('curselected')){
                this.classList.remove("curselected");
                this.classList.add("selectable");
            }else{
                if(this.classList.contains('selectable')){
                this.classList.replace("selectable","curselected");
            }}
            // Enable or Disable Next button
            if(document.getElementsByClassName("curselected").length>0){
                if($("#SelectStage").length>0){
                    $("#SelectStage")[0].disabled=false;}
                else{
                    if($("#FindStage").length>0){
                        $("#FindStage")[0].disabled=false;
                    }
                }
            }else{
                if($("#SelectStage").length>0){
                    $("#SelectStage")[0].disabled=true;}
                else{
                    if($("#FindStage").length>0){
                        $("#FindStage")[0].disabled=true;
                    }
                }
            }
        });
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
  

    // Click Exclamation button Highlight some important text and then click the exclamation button to generate some quizz
    $('#addEbutton').popover({
        html:true,
        content:'<div class "popoverrow" style="float:right"><button class="btn" id="popoverclose" onclick="popoverclose()" ><i class="fa fa-times" style="color:grey"></i></button></div><div class="popoverrow">Select one or more sentences with important/useful information.</div><div class="popoverrow"><button class="btn" id="SelectStage" type="button" style="float: right;" disabled="true"; onclick="AfterSelection()">Next</button></div>',
        placement:'right',
    }).on('shown.bs.popover', function(){
        $('#Q_input').focus();
        var sentences=document.getElementsByTagName("sent");
        for (var i =0;i<sentences.length;i++){
            sentence=sentences[i];
            sentence.classList.add('selectable')
        }
        document.getElementById("addbuttons").classList.add('fixedbutton')  
    })
    $('#addEbutton').tooltip({
        placement: 'right',
        title: 'Click to make a quiz question.',
        animation: true,
        delay: {show:200, hide:10}
    })
    $('#addEbutton').click(function(){
        $(this).tooltip('hide'); 
            //// ref button update, save input value
    });
    //Text select text and add it as a reference.
    var sentences=document.getElementsByTagName("sent");
    for (var i =0;i<sentences.length;i++){
        sentence=sentences[i];
//        sentence.addEventListener
    }
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
        reconSidebar();

        
}); 

function maxcountnumber(){
    refs=refcounter();
    ref=refs[0];
    maxcount=Math.max.apply(Math, ref);
    return maxcount
}

function refcounter(){
    maxcount=0;
    quizs=document.getElementById("generated_quiz").getElementsByClassName("card"); // Number of questions 
    var sentences=document.getElementsByTagName("sent");
    sentnum=sentences.length;
    ref=Array.apply(null, Array(sentnum)).map(Number.prototype.valueOf,0);
    qnumholders=[]
    for(i=0;i<sentnum;i++){
        qnumholders.push([]);
    }
    refs=[]
    for (i=0;i<quizs.length;i++){
        reftexts=quizs[i].getAttribute("dataref").split(",");
        for(k=0;k<reftexts.length;k++){
            qrefpair=[i, reftexts[k]];
            refs.push(qrefpair);}
    }
    for (j=0;j<refs.length;j++){
        aqrefpair=refs[j];
        qnum=aqrefpair[0];
        aref=aqrefpair[1];
        sentno=Number(aref.substring(4));
        ref[sentno]=ref[sentno]+1;
        qnumholders[sentno]=qnumholders[sentno].concat(qnum);
    }
    return [ref, qnumholders]
}

function thresholds(refcountinput, numbins){
    refcount=refcountinput.concat();
    refcount.sort();
    var len=refcount.length;
    thresholds=Array.apply(null, Array(numbins-1)).map(Number.prototype.valueOf,0);
    for(i=0;i<thresholds.length;i++){
        thresholds[i]=refcount[Math.floor(len*(i+1)/numbins)-1];
    }
    return thresholds
}

function getcolor(colorpal,threshs,refcount){
    nbins=colorpal.length;
    color=colorpal[0];
    i=0;
    while((refcount>threshs[i])&&(i<4)){
        color=colorpal[i+1]
        i++;
    }
    return color
}

function popoverclose(){
    $('#addEbutton').popover('hide');
    var sentences=document.getElementsByTagName("sent");
        for (var i =0;i<sentences.length;i++){
            sentence=sentences[i];
            sentence.classList.remove('selectable');
            if(sentence.classList.contains('curselected')){
                sentence.classList.remove('curselected');
            }
        }
    document.getElementById("addbuttons").classList.remove('fixedbutton');    

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


function AfterSelection(){
    console.log("Hiiii");
    popoverbody=document.getElementsByClassName("popover-body")[0];
    popoverprompt=popoverbody.childNodes[1];
    popoverbuttonholder=popoverbody.childNodes[2]
    originalwidth=popoverprompt.clientWidth;
    popoverprompt.style.width=originalwidth.toString()+"px";
    popoverprompt.innerHTML="Make a question that can be answered by the selected sentence(s)."
    // insert input box
    
    newQanswered=document.createElement("input");
    newQanswered.setAttribute('type', 'text');
    newQanswered.setAttribute('id', 'possibleQ');
    newQanswered.setAttribute('style', 'width:75%');
    popoverbuttonholder.removeChild(popoverbuttonholder.firstChild);
    popoverbuttonholder.appendChild(newQanswered);
    newQansAdd=document.createElement("button");
    newQansAdd.setAttribute('class', 'btn');
    newQansAdd.setAttribute('id', 'newQansAdd');
    newQansAdd.setAttribute('style', 'float: right;');
    newQansAdd.setAttribute('onclick', 'SubmitQWithA()');
    newQansAdd.innerHTML="Add";
    popoverbuttonholder.appendChild(newQansAdd);
    newQanswered.addEventListener("keyup", function(event){
        event.preventDefault();
        if(event.keyCode===13){
            newQansAdd.click();
        }
    })
}

function SubmitQWithA(){
    possiblequestion=document.getElementById("possibleQ").value;
    if(possiblequestion.length>2){
        var questholder=document.getElementById("generated_quiz");
        curlen=questholder.childNodes.length-1;
        newQholder=document.createElement("div");
        newQholder.className="card";
        newQholder.style.width="100%";
        newQ=document.createElement("div");
        newQ.className="row qrow";
        newQdelete=document.createElement("div");
        newQdelete.setAttribute("class","col-1 deleteholder")
        newQdeletebutton=document.createElement("button");
        newQdeletebutton.setAttribute("class","btn deletebutton");
        newQdeletebutton.innerHTML='<i class="fa fa-times-circle"></i>';

        newQdeletebutton.addEventListener("click", function(){
            var questholder=document.getElementById("generated_quiz");
            referredsents=this.parentElement.parentElement.parentElement.getAttribute("dataref");
            referredsentslist=referredsents.split(',');
            for(var i=0;i<referredsentslist.length;i++){
                currefsentid=referredsentslist[i];
                currefsent=document.getElementById(currefsentid);
                currefno=currefsent.getAttribute("dataref");
                newrefno=currefno-1;
                currefsent.setAttribute("dataref",newrefno);
                if(newrefno==0){
                    currefsent.classList.remove("prevselected");
                }
            }
            questholder.removeChild(this.parentElement.parentElement.parentElement);
            document.getElementById("qnumtotal").innerHTML=questholder.childNodes.length;   
            showbutton=document.getElementById("showless");
            
            if((questholder.childNodes.length<6)&&(questholder.childNodes.length>1)){
                $("#submitQuizbutton")[0].disabled=true;
                $("#submitQuizbutton")[0].style.backgroundColor="white";
                $("#submitQuizbutton")[0].style.color="black";            
                }
        });

        newQdelete.appendChild(newQdeletebutton);

    
        newQtext=document.createElement("div");
        newQtext.setAttribute("class","qlist col-11");
        newQtext.innerHTML=possiblequestion;
    
        newQ.appendChild(newQtext);
        newQ.appendChild(newQdelete);
        newQholder.appendChild(newQ);
        questholder.appendChild(newQholder);

        document.getElementById("qnumtotal").innerHTML=questholder.childNodes.length;
        if(questholder.childNodes.length>4){
            $("#submitQuizbutton")[0].disabled=false;
            $("#submitQuizbutton")[0].style.backgroundColor="#17a2b8";
            $("#submitQuizbutton")[0].style.color="white";   
        }

        selectedTexts=document.getElementsByClassName("curselected");
        refsentids=[];
        for (var i=0;i<selectedTexts.length;i++){
            selectedText=selectedTexts[i];
            curdataref=selectedText.getAttribute("dataref");
            newdataref=Number(curdataref)+1
            selectedText.setAttribute("dataref",newdataref);
            selectedid=selectedText.id;
            refsentids.push(selectedid);
        }
        for (var i =0;i<refsentids.length;i++){
            selectedText=document.getElementById(refsentids[i]);
            selectedText.classList.replace("curselected", "prevselected");
        }
        newQholder.setAttribute('dataref',refsentids);
        $('#addEbutton').popover('hide');
        // remove 'selectable' class for other
        selectableSents=document.getElementsByClassName('selectable');
        len=selectableSents.length
        var i=0;
        while (i<len) {
            selectableSent = selectableSents[0]
            selectableSent.classList.remove('selectable');
            i++;
        }
        document.getElementById("addbuttons").classList.remove('fixedbutton');    
    }
    else{
        document.getElementById("possibleQ").value='';
    };
};

function submitQuiz(){
    var question_generated=document.getElementById("generated_quiz");
    var question_holders=question_generated.getElementsByClassName("card");
    var articleno=Number(document.getElementById("ano").innerText);
    var madeby=document.getElementById('username').innerText;
    console.log(question_holders.length);
    for (var i=0;i<question_holders.length;i++){
        var aquestion=question_holders[i].firstChild.firstChild.innerText;   
        var refsentids=question_holders[i].getAttribute('dataref');
        console.log(refsentids);
        $.when( $.ajax({
            url: 'addquestionwithref',
            method: 'POST',
            data:{'text':aquestion, 'articleno':articleno, 'madeby':madeby, 'madeat':"quizcol", 'refsentids':refsentids}
        })).done(console.log(refsentids));
    }
        uid=Number(document.getElementById("submitQuizbutton").getAttribute("dataref"));
        console.log(uid)
        if(uid%2==1){ // then group A
            if(articleno>3){                              // then 2nd task
                window.location.replace('../../survey/2');
            }else{
                window.location.replace('../../survey/0');
            }
        }else{ // then group B
            if(articleno>3){                              // then 2nd task
                window.location.replace('../../survey/2');
            }else{
                window.location.replace('../../survey/1');
            }
        }; 
}