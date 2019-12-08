var slinks = [document.getElementById("sumlink"),document.getElementById("stateslink"),document.getElementById("comlink")];
var sdivs = [document.getElementById("sumdiv"),document.getElementById("statesdiv"),document.getElementById("comdiv")];
function change_div(count){
    slinks[count].addEventListener("click",function(event){
        event.preventDefault();
        sdivs[count].style.display = "block";
        for(var j = 0;j < sdivs.length;j++){
            if(j === count){
                continue;
            }else{
                sdivs.style.display = "none";
            }
        }
    },false);
}
for(var i = 0; i < slinks.length;i ++){
    change_div(i);
}
sdivs.style.display = "none";
sdivs.style.display = "none";