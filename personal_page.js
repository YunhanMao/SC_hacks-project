//Stores JSON-parsed objects
var response;

//Stores food.foodName and food.calorie into array separated by meal
var meal_cate0=[]; var meal_cal_cate0=[];
var meal_cate1=[]; var meal_cal_cate1=[];
var meal_cate2=[]; var meal_cal_cate2=[];
var meal_cate3=[]; var meal_cal_cate3=[];

//Stores food.foodName and food.calorie into array, depreciated
var food_array = [];
var calorie_array = [];

//Loads JSON or JS file into array separate by meal
function loadJSIntoArray(data){
    var meal=data.meal;
    for(var i=0;i<meal.length;i++){
        for (var j=0;j<meal[i].counter.length;j++){
            for(var k=0;k<meal[i].counter[j].food.length;k++){
                //Push foodName and calorie into each meal_array
                if(i==0){
                    meal_cate0.push(meal[i].counter[j].food[k].foodName);
                    meal_cal_cate0.push(meal[i].counter[j].food[k].calorie);
                }else if(i==1){
                    meal_cate1.push(meal[i].counter[j].food[k].foodName);
                    meal_cal_cate1.push(meal[i].counter[j].food[k].calorie);
                }else if(i==2){
                    meal_cate2.push(meal[i].counter[j].food[k].foodName);
                    meal_cal_cate2.push(meal[i].counter[j].food[k].calorie);
                }else if(i==3){
                    meal_cate3.push(meal[i].counter[j].food[k].foodName);
                    meal_cal_cate3.push(meal[i].counter[j].food[k].calorie);
                }
            }
        }
    }

}

window.onload = function(){

    //Load JSON
    /*
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function(){
        if(this.readyState == 4 && this.status == 200){

            response = JSON.parse(xhttp.responseText);

            loadJSIntoArray(response);
        }//if
        xhttp.open("GET", "usc_hospitality.json", true);
        xhttp.send();
        //JSON loaded
    };*/

    this.loadJSIntoArray(this.dataJSON);

    //Clone option element of .form-diet-select
    function cloneOption(foodName, foodCalorie){
        //Append to each parent
        var parent = document.querySelectorAll(".form-diet-select");
        for(var i=0; i<parent.length; i++){

            //Clone and set attribute
            var optionClone = 
            document.querySelector(".form-diet-select").options[0].cloneNode(false);
            optionClone.disabled = false;
            optionClone.selected = false;
            optionClone.text = foodName;
            optionClone.value = foodCalorie;

            //A clone can only be appended once, need to re-clone for each parent
            parent[i].appendChild(optionClone);
        }
    }

    //Invoke clone option
    for(var fn_i=0; fn_i<this.meal_cate1.length; fn_i++){
        cloneOption(this.meal_cate1[fn_i], this.meal_cal_cate1[fn_i]);
    }
};




document.querySelector("#form-diet-button").onclick = function(){

    //Allows user to update preferences
    var sum = 0;
    var restriction = document.querySelector("#form-diet-text").value;
    if(!/^[0-9]+$/.test(restriction)){
        restriction = 2000;
    }
    
    var selected = document.querySelectorAll(".form-diet-select");
    var selectedText = [];
    for(var i=0; i<selected.length; i++)
    {
        sum += parseInt(selected[i].value);
        selectedText.push(selected[i].options[selected[i].selectedIndex].text);
    }

    console.log(sum);
    console.log(restriction);
    
    if((sum >= (restriction - 100)) && (sum <= (restriction + 100))){
        document.querySelector("#form-diet-output").innerHTML = 
            "Well Done! Your choice is about your target.<br>"
            + selectedText[0] + " : " + selected[0].value + "<br>"
            + selectedText[1] + " : " + selected[1].value + "<br>"
            + selectedText[2] + " : " + selected[2].value + "<br>";
    }else if(sum <= (restriction - 100)){
        for(var i = 0; i < meal_cate1.length; i++){
            if((sum + meal_cal_cate1[i]) <= restriction){
                document.querySelector("#form-diet-output").innerHTML = 
                    "Your current diet has " + sum + " calories.<br>"
                    + "Why not try some " + meal_cate1[i] + "?<br>"
                    + "It has " + meal_cal_cate1[i] + " calories.";
            }
        }
    }else if(sum >= (restriction + 100)){
        var largestChoice = selected[0].value>selected[1].value ?
            (selected[0].value>selected[2].value ? 0 : 2) :
            (selected[1].value>selected[2].value ? 1 : 2);
        for(var i = 0; i < meal_cate1.length; i++){
            if((sum-selected[largestChoice].value+calorie_array[i]) >= (restriction - 100)
                    && (sum-selected[largestChoice]+calorie_array[i]) <= (restriction + 75)){
                document.querySelector("#form-diet-output").innerHTML = 
                    "Your current diet has " + sum + " calories.<br>"
                    + "Why not try some " + meal_cate1[i] + "?<br>"
                    + "It has "
                    + (parseInt(selected[largestChoice].value)-parseInt(meal_cal_cate1[i]))
                    + " few calories than " + selectedText[largestChoice] + ".<br>";
            }
        }
    }
};