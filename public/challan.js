$(".button-style").click(function(){
location.href = "newchallan.html";
});
$("#inlineRadio1").click(function()
{
  $(".userinputtitle").text("Enter the Challan Number: ");
document.getElementById('inlineRadio2').checked = false;
});
$("#inlineRadio2").click(function()
{
  $(".userinputtitle").text("Enter the Vehicle Plate Number: ");
  document.getElementById('inlineRadio1').checked = false;
});
