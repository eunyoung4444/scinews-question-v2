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
        $("#sent"+i.toString()).on({
            mouseenter: function(){
                console.log("enter")
            if(thissent.classList.contains('selectable')){
                console.log("select")
                console.log("hi4");
                this.style.backgroundColor="#FCF3CF";
            }},
            mouseleave: function(){
                if(thissent.classList.contains('selectable')){
                    this.style.backgroundColor="transparent";
                    console.log("hi3");
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
    // Mask design and functionality
    var id = '#dialog';
	var maskHeight = $(document).height();    //Get the screen height and width
    var maskWidth = $(window).width();
    $('#mask').css({'width':maskWidth,'height':maskHeight});     //Set heigth and width to mask to fill up the whole screen
    $('#mask').fadeIn(500);	     //transition effect		
    $('#mask').fadeTo("slow",0.9);	
    var winH = $(window).height();
    var winW = $(window).width();     //Get the window height and width            
    $(id).css('top',  winH/2-$(id).height()/2);     //Set the popup window to the center
    $(id).css('left', winW/2-$(id).width()/2);
    $(id).fadeIn(2000); 	    //transition effect
    // Mask-newquestion
    $('#typeinquestion').submit(function(){
        if($('#typeQ').val().length > 2){
            var newQnode=document.createElement("LI");
            newQnode.setAttribute("class","list-group-item justify-content-between myQs")
            var textSpan=document.createElement("span");
            textSpan.setAttribute("class","questions");
            var textNode=document.createTextNode($('#typeQ').val()+' ');
            textSpan.appendChild(textNode);
            var madebySpan=document.createElement("span");
            madebySpan.setAttribute("class", "questionby");
            var madetextNode=document.createTextNode("by " + document.getElementById('username').innerText);
            madebySpan.appendChild(madetextNode);
            var badgeSpan=document.createElement("span");
            badgeSpan.setAttribute("class","badge newbadge");
            var badgetextNode=document.createTextNode("NEW");
            badgeSpan.appendChild(badgetextNode);
            newQnode.appendChild(textSpan);
            newQnode.appendChild(madebySpan);
            newQnode.appendChild(badgeSpan);
            var Qlist=document.getElementById("myquestions");
            Qlist.appendChild(newQnode);
            $('#typeQ').val('');
        }else {
            $('#typeQ').val('');
        }
    });
    // Remove questions from the list by double click 
    var existQs=document.getElementsByClassName('existQs');
    for (var j=0;j<existQs.length;j++){
        existQs[j].addEventListener('dblclick', function(){
        var inner=this.innerHTML;
        var curlist=document.getElementById('myquestions');
        if(noSuchLi(curlist, inner)){
            var newQnode=document.createElement("LI");
            newQnode.setAttribute("class","list-group-item justify-content-between myQs")
            newQnode.innerHTML=inner;
            var Qlist=document.getElementById("myquestions");
            Qlist.appendChild(newQnode);
        }
    });}
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
    // Add new question to the Question or add count to the existing questions and close the mask 
	$('.window #letsread').click(function (e) {
		//Cancel the link behavior
        e.preventDefault();
        var myquestions=document.getElementById("myquestions");
        var questions=myquestions.getElementsByTagName("li");
        var articleno=Number(document.getElementById("ano").innerText);
        for (var i=0;i<questions.length;i++){
            text=questions[i].firstChild.innerText;
            badgetext=questions[i].children[2].innerText;
            madeby=questions[i].children[1].innerText.split(" ")[1];
            if(badgetext=="NEW"){
                $.ajax({
                    url: 'addquestion',
                    method: 'POST',
                    data: {'text':text, 'articleno':articleno, 'madeby':madeby,
                    csrfmiddlewaretoken: '{{ csrf_token }}'},
                });
            }
            else{
                qpk=questions[i].children[3].innerText;
                $.ajax({
                    url: 'addcount',
                    method: 'POST',
                    data:{'qpk':Number(qpk), 'curcount':Number(badgetext),csrfmiddlewaretoken: '{{ csrf_token }}'}
                });
            }
        }    
		$('#mask').hide();
        $('.window').hide();
        insertQuestions();
        reconSidebar();
	});		
	//if mask is clicked - revise this later
	$('#mask').click(function () {
		$(this).hide();
		$('.window').hide();
    });	    
    // Click Exclamation button Highlight some important text and then click the exclamation button to generate some quizz
    $('#addEbutton').popover({
        html:true,
        content:'<div class="popoverrow">Select one or more sentences with that information.</div><div class="popoverrow"><button class="btn" id="SelectStage" type="button" style="float: right;" disabled="true"; onclick="AfterSelection()">Next</button></div>',
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
        title: 'Click if you found an important information.',
        animation: true,
        delay: {show:200, hide:10}
    })
    $('#addEbutton').click(function(){
        $(this).tooltip('hide'); 
            //// ref button update, save input value
        var addQbtn= document.getElementById("addQbtn");
        $(addQbtn).on("click", function(){
            var questholder=document.getElementById("selected_questions");
            var curinput=document.getElementById("Q_input");
            var parentButton=curinput.parentElement.parentElement.parentElement.parentElement.previousSibling;
            console.log(parentButton)
            if(curinput.value){
                newQ=document.createElement("div");
                newQ.className="bs bs-callout bs-callout-filled question"
                newQ.setAttribute("data-qno",i.toString());
                newQText=document.createElement("h4");
                newtext=document.createTextNode(curinput.value);
                newQText.appendChild(newtext);
                newQ.appendChild(newQText);
                newQ.addEventListener("click", function(){
                    var curfocuses=document.getElementsByClassName("bs-callout-current");
                    if(curfocuses.length>0){
                        if(!(this.classList.contains("bs-callout-current"))){
                            var curfocus=curfocuses[0];
                            curfocus.classList.remove("bs-callout-current");
                            this.classList.add("bs-callout-current");
                        }
                        else{             
                            this.classList.remove("bs-callout-current");}}
                    else{                
                        this.classList.add("bs-callout-current");
                    }
                    
                })
                newQ.addEventListener("blur", function(){
                    console.log("Hi");
                    this.classList.remove("bs-callout-current");
                })
        
                questholder.appendChild(newQ);
        }
        console.log('hihi')
        console.log($(this))
        console.log(parentButton);
        $('#addQbutton').popover('hide');
        });
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
}); // End of document ready clause 
// Move addbuttons along with mouse
$(document).bind('mousemove', function(e){
    mousey=e.pageY
    texttop=document.getElementById('text').offsetTop;
    textheight=document.getElementById('text').offsetHeight;
    addbuttons=document.getElementById("addbuttons");
    if(addbuttons.classList.contains('fixedbutton')){}
    else{
    buttontop=0;
    topmargin=document.getElementById("top-margin").offsetHeight;
    realtexttop=topmargin+texttop;
    if(mousey<realtexttop){
        buttontop=0;
    }else{
        if(mousey>realtexttop+textheight){
            buttontop=textheight;
        }else{
            buttontop=Math.floor((mousey-realtexttop)/100)*100
            }
        }
    addbuttons.style.top=buttontop.toString()+"px";
}})

// Prevent generation of duplicated questions
function noSuchLi(ulist, text){
    var nosuch=true;
    var listlis=ulist.getElementsByTagName("li")
    for(var i=0;i<listlis.length;i++){
        var thisli=listlis[i];
        if(thisli.innerHTML==text){
            return false;
        }
    }
    return true;
}

// Insert question to the right side bar when reader starts to read the text
function insertQuestions(){
    var myquestions=document.getElementById("myquestions");
    var questions=myquestions.getElementsByTagName("li");
    var questholder=document.getElementById("selected_questions");   
    for (var i=0; i<questions.length; i++){ 
        newQholder=document.createElement("button");
        newQholder.className="card";
        newQholder.style.width="100%";
        newQholder.setAttribute("id","beforeq"+i.toString());
        newQ=document.createElement("div");
        newQ.className="row qrow";
        newQcheckbox=document.createElement("div");
        newQcheckbox.setAttribute("class","col-1 checkboxholder")
        newbutton=document.createElement("div");
        newbutton.setAttribute("class","btn");
        newbutton.innerHTML='<i class="fa fa-square-o"></i>';
        newQcheckbox.appendChild(newbutton);

        newQtext=document.createElement("div");
        newQtext.setAttribute("class","qlist col-11");
        newQtext.setAttribute("style","text-align: justify");
        newQtext.innerHTML=questions[i].firstChild.innerText;

        newQ.appendChild(newQcheckbox);
        newQ.appendChild(newQtext);
        newQholder.appendChild(newQ);
        questholder.appendChild(newQholder);

        $('#beforeq'+i.toString()).on({
            mouseenter: function(){
                this.style.border="2px solid rgba(0, 0, 0, 0.125)";
                this.style["box-shadow"]="1px 1px rgba(0, 0, 0, 0.125)";
             },
            mouseleave: function(){
                this.style.border="1px solid rgba(0, 0, 0, 0.125)"
                this.style["box-shadow"]="0px 0px rgba(0, 0, 0, 0.125)";
            }
        });
        $('#beforeq'+i.toString()).popover({
            html:true,
            content:'<div class="popoverrow">Select one or more sentences with information.</div><div class="popoverrow"><button class="btn" id="FindStage" type="button" style="float: right;" disabled="true"; onclick="AfterFinding()">Add</button></div>',
            placement:'right',
        }).on('shown.bs.popover', function(){
            $('#Q_input').focus();
            var sentences=document.getElementsByTagName("sent");
            for (var i =0;i<sentences.length;i++){
                sentence=sentences[i];
                sentence.classList.add('selectable')
            }
        });
    }
}

function reconSidebar(){
 //Floating sidebar
    $("#QtoA")[0].style.display="inline";
    $("#QwithA")[0].style.display="inline";
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
   var questholder=document.getElementById("selected_questions");
   var qrows=document.getElementsByClassName("qrow");
   for (var i=0; i<qrows.length;i++){
       thisqrow=qrows[i];
       thisqrow.style.width=(questholder.offsetWidth-36).toString()+"px";
   }
} // end of sidebar reconstruction 
    window.addEventListener('scroll', function(e){})


function AfterSelection(){
    console.log("Hiiii");
    popoverbody=document.getElementsByClassName("popover-body")[0];
    popoverprompt=popoverbody.childNodes[0];
    popoverbuttonholder=popoverbody.childNodes[1]
    originalwidth=popoverprompt.clientWidth;
    popoverprompt.style.width=originalwidth.toString()+"px";
    popoverprompt.innerHTML="Prompt for Quizz! Prompt for Quizz! Prompt for Quizz! Prompt for Quizz!"
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
    var questholder=document.getElementById("answeredquestions");

    newQholder=document.createElement("button");
    newQholder.className="card";
    newQholder.style.width="100%";
    newQ=document.createElement("div");
    newQ.className="row qrow";
    newQcheckbox=document.createElement("div");
    newQcheckbox.setAttribute("class","col-1 checkboxholder")
    newbutton=document.createElement("div");
    newbutton.setAttribute("class","btn");
    newbutton.innerHTML='<i class="fa fa-check-square-o"></i>';
    newQcheckbox.appendChild(newbutton);

    newQtext=document.createElement("div");
    newQtext.setAttribute("class","qlist col-11");
    newQtext.innerHTML=possiblequestion;
    newQtext.setAttribute("style","text-align: justify");

    newQ.appendChild(newQcheckbox);
    newQ.appendChild(newQtext);
    newQholder.appendChild(newQ);
    questholder.appendChild(newQholder);
    newQ.style.width=(questholder.offsetWidth-36).toString()+"px";
 

    selectedTexts=document.getElementsByClassName("curselected");
    refsentids=[];
    for (var i=0;i<selectedTexts.length;i++){
        selectedText=selectedTexts[i];
        selectedid=selectedText.id;
        refsentids.push(selectedid);
    }
    for (var i =0;i<refsentids.length;i++){
        selectedText=document.getElementById(refsentids[i]);
        selectedText.classList.replace("curselected", "prevselected");
    }
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

function SubmitQ(){
    possiblequestion=document.getElementById("possibleQ").value;
    if(possiblequestion.length>2){
    var questholder=document.getElementById("answeredquestions");
    newQholder=document.createElement("button");
    newQholder.className="card";
    newQholder.style.width="100%";
    newQ=document.createElement("div");
    newQ.className="card-body qlist";
    newQtext=document.createTextNode(possiblequestion);
    newQ.appendChild(newQtext);
    newQholder.appendChild(newQ);
    questholder.appendChild(newQholder);
    selectedTexts=document.getElementsByClassName("curselected");
    console.log(selectedTexts.length)
    refsentids=[];
    for (var i=0;i<selectedTexts.length;i++){
        console.log(i);
        selectedText=selectedTexts[i];
        selectedid=selectedText.id;
        refsentids.push(selectedid);
    }
    for (var i =0;i<refsentids.length;i++){
        selectedText=document.getElementById(refsentids[i]);
        selectedText.classList.replace("curselected", "prevselected");
    }
    $('#addEbutton').popover('hide');
    // remove 'selectable' class for other
    selectableSents=document.getElementsByClassName('selectable');
    len=selectableSents.length
    var i=0;
    while (i<len) {
        console.log(i, len)
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

function AfterFinding(){
    var questholder=document.getElementById("answeredquestions");
    newQholder=document.createElement("button");
    newQholder.className="card";
    newQholder.style.width="100%";
    newQ=document.createElement("div");
    newQ.className="card-body qlist";
    newQtext=document.createTextNode(possiblequestion);
    newQ.appendChild(newQtext);
    newQholder.appendChild(newQ);
    questholder.appendChild(newQholder);
    selectedTexts=document.getElementsByClassName("curselected");
    console.log(selectedTexts.length)
    refsentids=[];
    for (var i=0;i<selectedTexts.length;i++){
        console.log(i);
        selectedText=selectedTexts[i];
        selectedid=selectedText.id;
        refsentids.push(selectedid);
    }
    for (var i =0;i<refsentids.length;i++){
        selectedText=document.getElementById(refsentids[i]);
        selectedText.classList.replace("curselected", "prevselected");
    }
    $('#addEbutton').popover('hide');
    // remove 'selectable' class for other
    selectableSents=document.getElementsByClassName('selectable');
    len=selectableSents.length
    var i=0;
    while (i<len) {
        console.log(i, len)
        selectableSent = selectableSents[0]
        selectableSent.classList.remove('selectable');
        i++;
    }
    document.getElementById("addbuttons").classList.remove('fixedbutton');    
    
};


// Text Selection, at word level
function selectText(inputholder,qno){
    if (document.getElementById("reftext"+qno.toString())){
        var prevref=document.getElementById("reftext"+qno.toString());
        orgtext=prevref.innerText;
        prevref.replaceWith(orgtext);        // If there was reftext but removed now, remove the highlight and return it to normal text 
    }
    var selectionText = "";
    if (document.getSelection) {
        selectionText = document.getSelection();
        selectionRange= selectionText.getRangeAt(0);
    } else if (document.selection) {
        selectionText = document.selection.createRange().text;
    }
    inputholder.value=selectionText;
    var newNode= document.createElement("span");
    selectionRange.surroundContents(newNode);
    newNode.setAttribute("id","reftext"+qno.toString());
    newNode.addEventListener('focus', function(){
        var id=this.getAttribute('id');
        var qno=id.substring(7);

    })
}

function snapSelectionToWord(inputholder, qno) {
    // Check for existence of window.getSelection() and that it has a
    // modify() method. IE 9 has both selection APIs but no modify() method.
    if (window.getSelection && (sel = window.getSelection()).modify) {
        sel = window.getSelection();
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
        }
    } else if ( (sel = document.selection) && sel.type != "Control") {
        var textRange = sel.createRange();
        if (textRange.text) {
            textRange.expand("word");
            // Move the end back to not include the word's trailing space(s),
            // if necessary
            while(/\s$/.text(textRange.text)){
                textRange.moveEnd("character",-1);}
                textRange.select();
        }
    }
    selectText(inputholder, qno);
}

/* // 
function selectToQuestion() {
        var selectionText = "";
        if (document.getSelection) {
            selectionText = document.getSelection();
            selectionRange= selectionText.getRangeAt(0);
        } else if (document.selection) {
            selectionText = document.selection.createRange().text;
        }
        if(selectionText){
            $('#addEbutton')[0].disabled=false;
        }
}
        
function snapSelectToQuestion() {
        var sel;
        // Check for existence of window.getSelection() and that it has a
        // modify() method. IE 9 has both selection APIs but no modify() method.
        if (window.getSelection && (sel = window.getSelection()).modify) {
            sel = window.getSelection();
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
            }
        } else if ( (sel = document.selection) && sel.type != "Control") {
            var textRange = sel.createRange();
            if (textRange.text) {
                textRange.expand("word");
                // Move the end back to not include the word's trailing space(s),
                // if necessary
                while(/\s$/.text(textRange.text)){
                    textRange.moveEnd("character",-1);}
                    textRange.select();
                }}
            selectToQuestion();
} */