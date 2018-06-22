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
