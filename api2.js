
   var query;

   var config = {
    apiKey: "AIzaSyA8ZYrtK---onOLt4LDJSBOgNmU1-rhELg",
    authDomain: "bootcampignacio.firebaseapp.com",
    databaseURL: "https://bootcampignacio.firebaseio.com",
    projectId: "bootcampignacio",
    storageBucket: "bootcampignacio.appspot.com",
    messagingSenderId: "943456383704"
  };
  firebase.initializeApp(config);

  $("select").change(function(){
    if($("#choose").val()=="Etsy"){  $("#number").removeAttr("readonly").attr("value","5");}

    else if($("#choose").val()=="Walmart"){ $("#number").attr("readonly", true).removeAttr("value");  }
  })

  var queryURL;

   $("#search").on("click",function(){
    query = $("#query").val();
    var results = $("#number").val();
     if($("#choose").val()=="Walmart"){
     queryURL = "http://api.walmartlabs.com/v1/search?query="+query+"&format=json&apiKey=n6pvngp9s4uv8qpje4u6mw9r";
     $.ajax({
      url: queryURL,
      xhrFields: {
        withCredentials: true
     },
     dataType: "jsonp",
      method: "GET"
    }).then(function(response) {
      $("#cont").empty();
        for (let i = 0; i < response.items.length; i++) {
            $("<div>").addClass("card").attr("id","card"+i).css("width","10rem").css("float","left").css("height","30rem").css("margin","5px").appendTo("#cont");
            $("<img>").attr("src",response.items[i].thumbnailImage).attr("id","img1").addClass("card-img-top").appendTo("#card"+i);
            $("<div>").addClass("card-body").appendTo("#card"+i);
            $("<h5>").addClass("card-title title"+i).text(response.items[i].name).appendTo("#card"+i);
            $("<p>").addClass("card-text text"+i).text("Price: "+response.items[i].salePrice).appendTo("#card"+i);
            $("<label>").attr("for","#qty"+i).text("Quantity").appendTo("#card"+i);
            $("<input>").attr("type","number").attr("id","qty"+i).attr("value","1").attr("min","1").addClass("form-control").appendTo("#card"+i);
            $("<button>").attr("type","submit").addClass("btn btn-primary").attr("id","card"+i).text("Add").appendTo("#card"+i);
        }
add();
      });
    }
     else{
      queryURL = "https://openapi.etsy.com/v2/listings/active.js?keywords=" + query + "&limit="+results+"&includes=Images:1&api_key=162by430c2i7puq76e84bhj5";
      $.ajax({
        url: queryURL,
        dataType: 'jsonp',
        success: function (data) {
            if (data.ok) {
                console.log(data);
                if (data.count > 0) {
                  $("#cont").empty();
                    $.each(data.results, function (i, item) {
                        $("<div>").addClass("card").attr("id","card"+i).css("width","15rem").css("float","left").css("height","30rem").css("margin","5px").appendTo("#cont");
                        $("<div>").addClass("card").attr("id","card"+i).appendTo("#cardgrp");
                        $("<img>").attr("src",item.Images[0].url_170x135).attr("id","img1").appendTo("#card"+i);
                        $("<div>").addClass("card-body").appendTo("#card"+i);
                        $("<h5>").addClass("card-title title"+i).text(item.title).appendTo("#card"+i);
                        $("<p>").addClass("card-text text"+i).text("Price: "+item.price).appendTo("#card"+i);
                        $("<label>").attr("for","#qty"+i).text("Quantity").appendTo("#card"+i);
                        $("<input>").attr("type","number").attr("id","qty"+i).attr("value","1").attr("min","1").addClass("form-control").appendTo("#card"+i);
                        $("<button>").attr("type","submit").addClass("btn btn-primary").attr("id","card"+i).text("Add").appendTo("#card"+i);
            
                    });
                    add();
                } 
            } 
        }
    });
    }
    })



  function add(){
    $(".btn").on("click", function(){
        console.log(this.id);
        var text = this.id; 
        var num = text.split("d")[1];
        var price=$(".text"+num).text().split("Price: ")[1];
        var name=$(".title"+num).text();
        console.log("#qty"+num);
        var qty=$("#qty"+num).val();
        var exists_flag=false;
        firebase.database().ref().once("value").then(function (snapshot) {
            for (let i = 0; i < 100; i++) {
              if(snapshot.child("Product"+i).child("Name")._e.T==name) {
               qty_temp = parseInt(snapshot.child("Product"+i).child("Existence")._e.T)+parseInt(qty);
               console.log(qty_temp);
               firebase.database().ref().child("Product"+i).update({Existence:qty_temp});
               exists_flag=true;break;
              }
            }
         if(exists_flag==false){
            for (let i = 0; i < 100; i++) {
                if(snapshot.child("Product"+i).exists()==false) {
                    firebase.database().ref().child("Product"+i).set({Price:price,Name:name,Existence:qty});
                    ;break;}
                }
            }
        });
});}