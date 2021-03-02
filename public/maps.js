$('tr').click(function () {
  var n=$(this).index();
  if(n>1)
  {
    n=n-1;
  }
  var str="singlerow";
    var c="Cooperation";
    var p="Panchayat";
    var s="State";
    var d="District";
    var t="Taluk";
    var l="Landmark";
  var row=str.concat(n);
  var coop=c.concat(n);
    var panc=p.concat(n);
      var state=s.concat(n);
        var district=d.concat(n);
          var taluk=t.concat(n);
            var land=l.concat(n);


  var cooperation=document.getElementById("myTable").rows.namedItem(row).cells.namedItem(coop).innerHTML;
  var panchayat=document.getElementById("myTable").rows.namedItem(row).cells.namedItem(panc).innerHTML;
  var state=document.getElementById("myTable").rows.namedItem(row).cells.namedItem(state).innerHTML;
  var district=document.getElementById("myTable").rows.namedItem(row).cells.namedItem(district).innerHTML;
  var taluk=document.getElementById("myTable").rows.namedItem(row).cells.namedItem(taluk).innerHTML;
  var landmark=document.getElementById("myTable").rows.namedItem(row).cells.namedItem(land).innerHTML;
  var link=landmark+taluk+cooperation+panchayat+district+state;
    link = link.trim();
  link=link.replace(/\s/g,"+");

  var str2=link;
  var str1="https://www.google.com/maps/place/";
  var str3 = "/data=!3m1!4b1";
  var res = str1.concat(str2, str3);
  window.open(res)
});
