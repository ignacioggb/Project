
var config = {
  apiKey: "AIzaSyA8ZYrtK---onOLt4LDJSBOgNmU1-rhELg",
  authDomain: "bootcampignacio.firebaseapp.com",
  databaseURL: "https://bootcampignacio.firebaseio.com",
  projectId: "bootcampignacio",
  storageBucket: "bootcampignacio.appspot.com",
  messagingSenderId: "943456383704"
};
firebase.initializeApp(config);

firebase.database().ref().once("value").then(function (snapshot) {
  for (let i = 0; i < 100; i++) {
    if (snapshot.child("Product" + i).exists()) {
      var option = $("<option>")
      option.text(i + ".-" + snapshot.child("Product" + i).val().Name);
      option.appendTo("#item");
    }
  }

  $("select").change(priceDisplay);
  $("#qty").change(priceDisplay);

  function priceDisplay() {
    var text = $("#item").val();
    var place = "Product" + text.split(".")[0];
    $("#unit_price").attr("value", snapshot.child(place).val().Price);
    var unitprice = parseFloat($("#unit_price").val()).toFixed(2);
    var qtyunit = parseFloat($("#qty").val()).toFixed(2);
    $("#net_total").attr("value", unitprice * qtyunit);
    var tax = 1 + parseFloat($("#tax").val()) / 100;
    $("#total_tax").attr("value", (unitprice * qtyunit * tax).toFixed(2));
    $("#available").attr("value", snapshot.child(place).val().Existence);
  }
});

/////////////

var currentdate = new Date();
var sell_date = currentdate.getDate() + "/"
  + (currentdate.getMonth() + 1) + "/"
  + currentdate.getFullYear();

var id;
var counter = 1;
var seller_name;
var seller_tax_no;
var seller_street;
var seller_post_code;
var seller_city;
var seller_bank_account;
var array = [];
var positions = [];

var buyer_name;
var buyer_tax_no;
var buyer_street;
var buyer_post_code;
var buyer_city;
var buyer_email;
var buyer_phone;

var total_price_gross;
var total_price_net;
var total_price_tax;

var currency;
var payment_to;

$(document).ready(function () {
  $(".add").on("click", logobject);
  $(".add-item").on("click", rowadd);

});




function logobject() {
  seller_name = $("#seller_name").val();
  seller_tax_no = $("#seller_tax_no").val();
  seller_street = $("#seller_street").val();
  seller_post_code = $("#seller_post_code").val();
  seller_city = $("#seller_city").val();
  seller_bank_account = $("#seller_bank_account").val();
  buyer_name = $("#buyer_name").val();
  buyer_tax_no = $("#buyer_tax_no").val();
  buyer_street = $("#buyer_street").val();
  buyer_post_code = $("#buyer_post_code").val();
  buyer_city = $("#buyer_city").val();
  buyer_email = $("#buyer_email").val();
  buyer_phone = $("#buyer_phone").val();
  currency = $("#currency").val();
  payment_to = $("#payment_to").val();

  if (buyer_name != "" && buyer_tax_no != "" && buyer_street != "" && buyer_post_code != "" && buyer_city != "" && buyer_email != "") {
    $("#buyer_name").addClass("is-valid");
    $("#buyer_tax_no").addClass("is-valid");
    $("#buyer_street").addClass("is-valid");
    $("#buyer_post_code").addClass("is-valid");
    $("#buyer_city").addClass("is-valid");
    $("#buyer_email").addClass("is-valid");
    $("#buyer_phone").addClass("is-valid");


    var data = {
      "kind": "vat",
      "number": null,
      "payment_to": null,
      "sell_date": sell_date,
      "issue_date": sell_date,
      "seller_name": seller_name,
      "seller_tax_no": seller_tax_no,
      "seller_street": seller_street,
      "seller_post_code": seller_post_code,
      "seller_city": seller_city,
      "seller_bank_account": seller_bank_account,
      "buyer_name": buyer_name,
      "buyer_tax_no": buyer_tax_no,
      "buyer_street": buyer_street,
      "buyer_post_code": buyer_post_code,
      "buyer_city": buyer_city,
      "buyer_email": buyer_email,
      "buyer_phone": buyer_phone,
      "currency": currency,
      "payment_to": payment_to,
      "positions": positions
    }

    var json_params = {
      "api_token": "7836oFnulpNlafyLSkb/ignacioggb",
      "invoice": data
    }
    alert(JSON.stringify(json_params))
    endpoint = 'https://ignacioggb.invoiceocean.com/invoices.json'

    $.ajax({
      type: "POST",
      url: endpoint,
      data: json_params,
      dataType: 'json',
      success: function (data) {
        alert('invoice created! ' + data['id']);
        id = data['id']; console.log(id); send(id);
      },
    });
  }

  else {
     $('#myModal').modal('show');
    if (buyer_name===""){
      $("#buyer_name").addClass("is-invalid");
    }
    if (buyer_tax_no===""){
      $("#buyer_tax_no").addClass("is-invalid");
    }
    if (buyer_street===""){
      $("#buyer_street").addClass("is-invalid");
    }
    if (buyer_post_code===""){
      $("#buyer_post_code").addClass("is-invalid");
    }
    if (buyer_city===""){
      $("#buyer_city").addClass("is-invalid");
    }
    if (buyer_email===""){
      $("#buyer_email").addClass("is-invalid");
    }

  }
}

function send(id) {
  var json_params = {
    "api_token": "7836oFnulpNlafyLSkb/ignacioggb"
  }
  alert(JSON.stringify(json_params))
  endpoint = 'https://ignacioggb.invoiceocean.com/invoices/' + id + '/send_by_email.xml?api_token=7836oFnulpNlafyLSkb/ignacioggb'

  $.ajax({
    type: "POST",
    url: endpoint,
    data: json_params,
    dataType: 'json',
    success: function (data) { alert('invoice sent') }
  });
}


function rowadd() {
  var rest = parseFloat($("#available").val()) - parseInt($("#qty").val());
  var text = $("#item").val();
  var place = "Product" + text.split(".")[0];
  console.log(place);
  firebase.database().ref().child(place).update({ Existence: rest });

  firebase.database().ref().on("value", function (snapshot) {
    $("#available").attr("value", snapshot.child(place).val().Existence);
  });

  var item = $("#item").val();
  var qty = $("#qty").val();
  var qty_unit = $("#qty_unit").val();
  var unit_price = $("#unit_price").val();
  var tax = $("#tax").val();
  var net_total = $("#net_total").val();
  var total_tax = $("#total_tax").val();
  var unit_vat = parseInt(unit_price) * (1 + (parseInt(tax) / 100));
  var only_vat = parseInt(unit_price) * (parseInt(tax) / 100);
  var tax_qty = total_tax - net_total;

  var position = {
    item,
    qty,
    qty_unit,
    unit_price,
    tax,
    net_total,
    total_tax,
    unit_vat,
    only_vat,
    tax_qty
  }

  counter++;

  array.push(position);
  console.log(array);

  $("#tbody").empty();
  for (let i = 0; i < array.length; i++) {
    var row = $("<tr>");
    row.attr("id", "row-" + i);
    $("#tbody").append(row);
    var thead = $("<th>");
    thead.attr("scope", "row");
    thead.text(array[i].item);//need mod
    $(row).append(thead);

    var col1 = $("<td>").text(array[i].qty);
    $(row).append(col1);
    var col2 = $("<td>").text(array[i].qty_unit);
    $(row).append(col2);
    var col3 = $("<td>").text(array[i].unit_price);
    $(row).append(col3);
    var col4 = $("<td>").text(array[i].tax);
    $(row).append(col4);
    var col5 = $("<td>").text(array[i].net_total);
    $(row).append(col5);
    var col6 = $("<td>").text(array[i].total_tax);
    $(row).append(col6);
  }

  var sum = 0; var sum2 = 0;
  for (let i = 0; i < array.length; i++) {
    sum += parseFloat(array[i].net_total);
    $("#net").text(sum);
    sum2 += parseFloat(array[i].total_tax);
    $("#gross").text(sum2.toFixed(2));
    $("#vat").text((sum2 - sum).toFixed(2));

    total_price_gross = sum2.toFixed(2);
    total_price_net = sum;
    total_price_tax = (sum2 - sum).toFixed(2);
  }

  $("tr").dblclick(function () {
    this.remove();
    var id2text = this.id;
    var number = id2text.split("-")[1];
    array.splice($.inArray(array[number], array), 1);
    var sum = 0; var sum2 = 0;
    for (let i = 0; i < array.length; i++) {
      sum += parseFloat(array[i].net_total);
      $("#net").text(sum);
      sum2 += parseFloat(array[i].total_tax);

      $("#gross").text(sum2.toFixed(2));

      $("#vat").text((sum2 - sum).toFixed(2));

      total_price_gross = sum2.toFixed(2);
      total_price_net = sum;
      total_price_tax = (sum2 - sum).toFixed(2);
    }
  });

  for (let i = 0; i < array.length; i++) {
    positions[i] = {
      "name": array[i].item,
      "price_net": array[i].unit_price,
      "quantity": array[i].qty,
      "total_price_gross": array[i].net_total,
      "total_price_net": array[i].total_tax,
      "additional_info": null,
      "quantity_unit": array[i].qty,
      "tax": array[i].tax,
      "price_gross": array[i].unit_vat,
      "price_tax": array[i].only_vat,
      "total_price_tax": array[i].tax_qty,
      "discount": null,
      "discount_percent": null,
      "tax2": "0",
      "code": null
    }
  }
}


