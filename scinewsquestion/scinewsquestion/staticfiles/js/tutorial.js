// variables
$(document).ready(function(){

    console.log("hi")
}); // End of document ready clause 


function firstarticle(upk){
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
    ano=myorder[0]
    return ano    
}

function start(){
    var userpk=Number(document.getElementById('userpk').innerText);
    ano=firstarticle(userpk);
    window.location.replace("../../question/"+String(ano))
}