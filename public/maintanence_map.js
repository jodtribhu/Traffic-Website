$("tr").click(function(){
    location.href = "map";
    var x = document.getElementById("myTable").rows.length;

      var cooperaton=document.getElementById("myTable").rows.namedItem("myRow").cells.namedItem("Cooperation").innerHTML;
        var panchayat=document.getElementById("myTable").rows.namedItem("myRow").cells.namedItem("Panchayat").innerHTML;
        var state=document.getElementById("myTable").rows.namedItem("myRow").cells.namedItem("State").innerHTML;
        var district=document.getElementById("myTable").rows.namedItem("myRow").cells.namedItem("District").innerHTML;
        var taluk=document.getElementById("myTable").rows.namedItem("myRow").cells.namedItem("Taluk").innerHTML;
        var landmark=document.getElementById("myTable").rows.namedItem("myRow").cells.namedItem("Landmark").innerHTML;
        localStorage.setItem("Cooperation",cooperaton);
        
});
