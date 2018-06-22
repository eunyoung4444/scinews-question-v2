// variables
$(document).ready(function(){
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
    $(window).location.replace("../question/"+String(ano))
}