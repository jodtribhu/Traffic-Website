const express = require('express');
const app = express();
const bodyParser = require("body-parser");
const mysql = require('mysql');
const moment=require('moment');
const session=require('express-session');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static('public'));

var connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  database: "traffic_db",
  multipleStatements: true
});
connection.connect((err) => {
  if (!err) {
    console.log("Connected");
  } else {
    console.log("Conection Failed");
  }
});

app.set("view engine", "ejs");

app.get("/", function(req, res) {
  res.render('login');
  // res.sendFile(__dirname+"home.ejs")
});
/*routes*/
app.get("/login", function(req, res) {
  res.render('login');

});
app.get("/challan", function(req, res) {
  res.render('challan');
});
app.get("/maintanence_details_map", function(req, res) {
  res.render('maintanence_details_map');
});
app.get("/home", function(req, res) {
  res.render('home');
});
app.get("/maintanence", function(req, res) {
  res.render('maintanence');
});
app.get("/cameraincident", function(req, res) {
  res.render('cameraincident');
});
app.get("/insurance", function(req, res) {
  res.render('insurance');
});
app.get("/newInsurance", function(req, res) {
  res.render('newInsurance');
});
app.get("/newInsurance", function(req, res) {
  res.render('newInsurance');
});
app.get("/licence", function(req, res) {
  res.render('licence');
});
app.get("/newlicence", function(req, res) {
  res.render('newlicence');
});
app.get("/tolltransaction", function(req, res) {
  res.render('tolltransaction');
});
app.get("/registration", function(req, res) {
  res.render('registration');
});
app.get("/case", function(req, res) {
  res.render('case');
});
app.get("/learners", function(req, res) {
  res.render('learners');
});
/*end*/

//login
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));
app.post('/login', function(request, response) {
    var username = request.body.username;
    var password = request.body.password;



    if (username && password) {
// check if user exists
        connection.query('SELECT * FROM user WHERE username = ? AND password = ?', [username, password], function(error, results, fields) {
            if (results.length > 0) {
              request.session.loggedin = true;
                request.session.username = username;
                response.render('home');
            } else {
                response.send('Incorrect Username and/or Password!');

            }
            response.end();
        });
    } else {
        response.send('Please enter Username and Password!');
        response.end();
    }
});
/*Toll Transaction */
app.post('/tolltransaction', function(req, res) {
  const regno = req.body.regno;

  var tolltransactionsql="Select * from (((tollbooth_transaction natural join registered_vehicle) inner join tollbooth ON tollbooth_transaction.Toll_Booth_Id=tollbooth.Tollbooth_Id) inner join location On location.Location_Id=tollbooth.Location_Id)  where Vehicle_Reg_No= ? ";

  connection.query(tolltransactionsql,[regno], function(error, results, fields) {
    if (error) throw error;
    if(results.length>0)
    {
    var transactions_vehicle=results;
    let tot_tran=results.length;
    console.log(transactions_vehicle);
    res.render('transaction_details', {
        all_vehicles_passed:transactions_vehicle,
        tot:tot_tran
    });
  }
  });
});


/*Camera Incidents */
app.post('/cameraincident', function(req, res) {
  const plateno = req.body.PlateNo;

  var camincidentsql="Select * from incident natural join location where  Vehicle_Reg_No = ?";

  connection.query(camincidentsql ,[plateno], function(error, results, fields) {
    if (error) throw error;
    if(results.length>0)
    {
    var cam_incidents=results;
    var countincident=results.length;
    console.log(cam_incidents);
    console.log(countincident);
    res.render('camera_incident_details', {
        total_cam_incidents:cam_incidents,
        totalno:countincident
    });
  }
  });
});

/*Learners*/
app.post('/learners', function(req, res) {
  const learnersid = req.body.learnersid;

var learnerssql="Select * from leaners where Leaners_Id =?";
  connection.query(learnerssql,[learnersid], function(error, results, fields) {
    if (error) throw error;
    if(results.length>0)
    {
    let learnersid= results[0].Leaners_Id;
    let firstname=results[0].Leaners_First_Name;
    let midname = results[0].Leaners_Middle_Name;
    let lastname = results[0].Leaners_Last_Name;
    let status = results[0].Leaners_Status;
    let doi = results[0].Leaners_Date_Of_Issue;
    let noa = results[0].Number_Of_Attempts;
    let bgroup = results[0].Blood_Group;
    let address = results[0].Leaners_Address;
    let dob = results[0].Leaners_DOB;

    res.render('learners_details', {
      lid: learnersid,
      fn: firstname,
      mn: midname,
      ln: lastname,
      status: status,
      doi: doi,
      noa: noa,
      bgroup: bgroup,
      address: address,
      dob: dob,
    });
  }
  });
});

app.post('/newlearners', function(req, res) {
        res.render('newlearners')
});

app.post('/insertlearners', function(req, res) {
  let learnersid= req.body.learnersid;
  let firstname=req.body.firstname;
  let midname = req.body.midname;
  let lastname = req.body.lastname;
  let status = req.body.status;
  let doi = req.body.doi;
  let noa = req.body.noa;
  let bgroup = req.body.bgroup;
  let address = req.body.address;
  let dob = req.body.dob;
  console.log("Starts Here"+learnersid+firstname+midname+lastname+status+doi+noa+bgroup+address+dob);
  var learnerssql="Insert into leaners(Leaners_Id,Leaners_First_Name,Leaners_Middle_Name,Leaners_Last_Name,Leaners_Status,Leaners_Date_Of_Issue,No_Of_Attempts,Blood_Group,Leaners_Address,Leaners_DOB) values(?,?,?,?,?,?,?,?,?,?)";
  connection.query( learnerssql,[learnersid,firstname,midname,lastname,status,doi,noa,bgroup,address,dob], function(error, results, fields) {
    if (error) throw error;
    res.redirect('learners');
  });
});


/*Registration */
app.post('/registration', function(req, res) {
  const regno = req.body.regno;

  connection.query('Select * from registered_vehicle where Vehicle_Reg_No = ?' ,[regno], function(error, results, fields) {
    if (error) throw error;
    if(results.length>0)
    {
    let chassisno = results[0].Chassis_No;
    let platecolor = results[0].PlateColor;
    let type = results[0].Type_Of_Vehicle;
    let fasttag = results[0].Fast_tag_id;
    let licenceno = results[0].Licence_No;
    let place = results[0].Place_Of_Registration;
    let insuranceno = results[0].Insurance_Id;

    res.render('registration_details', {
      cn: chassisno,
      pc: platecolor,
      type: type,
      ftid: fasttag,
      lno: licenceno,
      poi: place,
      insuno: insuranceno
    });
  }
  });
});

app.post('/newregistration', function(req, res) {
        res.render('newregistration')
});

app.post('/insertregistration', function(req, res) {
  let regno = req.body.regno
  let chassisno = req.body.chassisno;
  let platecolor = req.body.platecolor;
  let type = req.body.type;
  let fasttag = req.body.fasttag;
  let licenceno = req.body.licenceno;
  let place = req.body.place;
  let insuranceno = req.body.insuranceno;

  connection.query('Insert into registered_vehicle values(?,?,?,?,?,?,?,?)' ,[regno,chassisno,platecolor,type,fasttag,licenceno,place,insuranceno], function(error, results, fields) {
    if (error) throw error;
    res.redirect('registration');
  });
});


app.post('/newregistration', function(req, res) {
        res.render('newregistration')
});



/*maintanence*/
app.post('/maintanence', function(req, res) {
  const location = req.body.locationstate;

  var maintanencesql="Select * from maintenance natural join location where Location_Id IN  (Select l.Location_Id from location l where State=? OR District=? OR Taluk =? OR Landmark=?) ";

  connection.query(maintanencesql,[location,location,location,location], function(error, results, fields) {
    if (error) throw error;
    if(results.length>0)
    {
    var maintanence_areas=results;
    console.log(results);
    console.log(maintanencesql);
    res.render('maintanence_details', {
        under_maintanence:maintanence_areas
    });
  }
  });
});



app.post('/insertmaintanence', function(req, res) {
  let sdate = req.body.maintanencestartdate;
  let edate = req.body.maintanenceenddate;
  let type = req.body.maintanencetype;
  let reason = req.body.reasonformaintanence;
  let lid = req.body.locationID;


  connection.query('Insert into maintenance(Maintenance_Start_Time,Maintenance_End_Time,Maintenance_Type,Reason_For_Maintenance,Location_Id) values(?,?,?,?,?)' ,[sdate,edate,type,reason,lid], function(error, results, fields) {
    if (error) throw error;
    res.redirect('maintanence');
  });
});


app.post('/newmaintenance', function(req, res) {
        res.render('newmaintenance')
});

/*Challan*/

app.post('/challan', function(req, res) {

  var check1='option1';
  var check2='option2';

if(req.body.inlineRadioOption2===check2)
{
  const vehicleregno = req.body.regno;
  var vehicleregchallansql="Select * from challan natural join location where Vehicle_Reg_No= ?";
  connection.query(vehicleregchallansql,[vehicleregno], function(error, results, fields) {
    if (error) throw error;
    if(results.length>0)
    {
    var challanlist=results;
    var countchallan=results.length;
    var challan_percentage=countchallan *10
    res.render('vehicle_reg_challan_details', {
        total_challan:challanlist,
        total_no:countchallan,
        challan_percentage:challan_percentage

    });
  }
  });
}
else if(req.body.inlineRadioOption1===check1)
{
  const challanid = req.body.regno;
  if(isNaN(challanid)!=true)
  {
  connection.query('Select * from challan natural join location where Challan_Id=' + challanid, function(error, results, fields) {
    if (error) throw error;

    if(results.length>0)
    {
    let vehicleregno = results[0].Vehicle_Reg_No;
    let fine = results[0].Fine;
    let offence = results[0].Offence;
    let cooperation = results[0].Cooperation;
    let panchayat = results[0].Panchayat;
    let state = results[0].State;
    let district = results[0].District;
    let taluk = results[0].Taluk;
    let landmark = results[0].Landmark;

    res.render('challandetails', {
      vehicleregno:vehicleregno,
      fine:fine,
      offence:offence,
      cooperation:cooperation,
      panchayat:panchayat,
      state:state,
      district:district,
      taluk:taluk,
      landmark:landmark
    });
  }
  });
}

}
});

app.post('/insertchallan', function(req, res) {
  let regno = req.body.regno
  let fine = req.body.fine;
  let offence = req.body.offence;
  let locationid = req.body.locationid;


  connection.query('Insert into challan(Vehicle_Reg_No,Fine,Offence,Location_Id) values(?,?,?,?)',[regno,fine,offence,locationid], function(error, results, fields) {
    if (error) throw error;
    res.redirect('challan');
  });
});


app.post('/newchallan', function(req, res) {
        res.render('newchallan')
});




/*Feaures*/
app.post('/accidentpronearea', function(req, res) {
  connection.query("Select Cooperation,Panchayat,State,District,Taluk,Landmark,count(*) AS cnt from case_t natural join location group by Location_Id having cnt>=2 ", function(error, results, fields) {
    if (error) throw error;
    var accidentpronearea=results;
    res.render('accidentpronearea', {
      accidentpronearea: accidentpronearea
    });
  });

});

app.post('/currentroad_maintanence', function(req, res) {
  connection.query("Select * from maintenance natural join location where maintenance.Maintenance_End_Time >= CURDATE()  ", function(error, results, fields) {
    if (error) throw error;
    let maintanence=results
    var stdate=moment(results.Maintenance_Start_Time).format('YYYY-MM-DD');
    var eddate=moment(results.Maintenance_End_Time).format('YYYY-MM-DD');
    console.log(results);
    res.render('currentroad_maintanence_details', {
        under_maintanence:maintanence
    });
  });

});

app.post('/speedbumper', function(req, res) {
  const challanid = req.body.regno;

  connection.query("Select Cooperation,Panchayat,State,District,Taluk,Landmark,count(*) AS cnt from incident natural join location group by Location_Id,Description having cnt>=2 And incident.Description='Over Speeding' ", function(error, results, fields) {
    if (error) throw error;
    var speedbumperarea=results;
    console.log(speedbumperarea);

    res.render('speedbumper', {
      speedbumperareas: speedbumperarea
    });
  });

});
/*Insurance*/
app.post('/insurance', function(req, res) {
  const insuranceid = req.body.insuranceid;

  connection.query('Select * from insurance where Insurance_Id = ?' ,[insuranceid], function(error, results, fields) {
    if (error) throw error;
    if(results.length>0)
    {
    let insuissuedate = results[0].Insurance_Issue_Date;
    let insuexpdate = results[0].Insurance_Exp_Date;
    let fname = results[0].Insurance_First_Name;
    let mname = results[0].Insurance_Middle_Name;
    let lname = results[0].Insurance_Last_Name;

    res.render('insurance_details', {
      iid: insuissuedate,
      ied: insuexpdate,
      fn: fname,
      mn: mname,
      ln: lname
    });
  }
  });
});


app.post('/insertInsurance', function(req, res) {
  const insuranceid = req.body.insuranceid;
  const insuranceissuedate = req.body.insuranceissuedate;
  const insuranceexpirydate = req.body.insuranceexpirydate;
  const insuranceholderfirstname = req.body.insuranceholderfirstname;
  const insuranceholdersecondname = req.body.insuranceholdersecondname;
  const insuranceholderlastname = req.body.insuranceholderlastname;

  connection.query('Insert into insurance values(?,?,?,?,?,?)' ,[insuranceid,insuranceissuedate,insuranceexpirydate,insuranceholderfirstname,insuranceholdersecondname,insuranceholderlastname], function(error, results, fields) {
    if (error) throw error;
    res.redirect('insurance');
  });
});


app.post('/newInsurance', function(req, res) {
        res.render('newInsurance')
});


/*Licence*/

app.post('/licence', function(req, res) {
  const licenceno = req.body.licenceno;

  connection.query('Select * from licence where Licence_No = ?',[licenceno], function(error, results, fields) {
    if (error) throw error;
if(results.length>0)
{
    let licencedoi=results[0].Licence_Date_Of_Issue;
    let licencecat = results[0].Licence_Category;
    let phoneno = results[0].Phone_No;
    let bloodgroup = results[0].Blood_Group;
    let place = results[0].Place_Of_Issue;
    let fname = results[0].Licence_Holder_First_Name;
    let mname = results[0].Licence_Holder_Middle_Name;
    let lname = results[0].Licence_Holder_Last_Name;
    let expiry = results[0].Licence_Expiry_Date;
    let address = results[0].Licence_Holder_Address;



    res.render('licence_details', {
      lno: licenceno,
      ldoi: licencedoi,
      lc: licencecat,
      pn: phoneno,
      bg: bloodgroup,
      poi: place,
      fn: fname,
      mn: mname,
      ln: lname,
      ed: expiry,
      address: address
    });
  }
  });

});

app.post('/insertLicence', function(req, res) {
  let licenceno= req.body.licenceno;
  let licencedoi=req.body.licencedoi;
  let licencecat = req.body.licencecat;
  let phoneno = req.body.phoneno;
  let bloodgroup = req.body.bloodgroup;
  let place = req.body.place;
  let fname = req.body.fname;
  let mname = req.body.mname;
  let lname = req.body.lname;
  let expiry = req.body.expiry;
  let address = req.body.address;

  connection.query("Insert into licence(Licence_No,Licence_Date_Of_Issue,Licence_Category,Phone_No,Blood_Group,Place_Of_Issue,Licence_Holder_First_Name,Licence_Holder_Middle_Name,Licence_Holder_Last_Name,Licence_Expiry_Date,Licence_Holder_Address) values(?,?,?,?,?,?,?,?,?,?,?)",[licenceno,licencedoi,licencecat,phoneno,bloodgroup,place,fname,mname,lname,expiry,address], function(error, results, fields) {
    if (error) throw error;
    res.redirect('licence');
  });
});

app.post('/newlicence', function(req, res) {
        res.render('newlicence')
});


/*case */
app.post('/case', function(req, res) {

  const caseid = req.body.caseid;

  connection.query("Select * from case_t natural join location where Case_Id = ?", [caseid], function(error, results, fields) {
    if (error) throw error;
    if(results.length>0)
    {
    let status = results[0].Status;
    let startdate = results[0].Case_Start_Date;
    let enddate = results[0].Case_End_Date;
    let casuality = results[0].Casualty;
    let desc = results[0].Description;
    let compensation = results[0].Compensation;
    let locationid = results[0].Location_Id;
    let psid = results[0].PoliceStation_Id;
    let cooperation = results[0].Cooperation;
    let panchayat = results[0].Panchayat;
    let state = results[0].State;
    let district = results[0].District;
    let taluk = results[0].Taluk;
    let landmark = results[0].Landmark;


    res.render('case_details', {
      caseid:caseid,
      status: status,
      sd: startdate,
      ed: enddate,
      cas: casuality,
      desc: desc,
      comp: compensation,
      loc: locationid,
      psid: psid,
      cooperation:cooperation,
      panchayat:panchayat,
      state:state,
      district:district,
      taluk:taluk,
      landmark:landmark
    });
  }
  });
});

app.post('/insertcase', function(req, res) {
  let status = req.body.status;
  let startdate = req.body.startdate;
  let enddate = req.body.enddate;
  let casuality = req.body.casuality;
  let desc = req.body.desc;
  let compensation = req.body.compensation;
  let locationid = req.body.locationid;
  let psid = req.body.psid;


  connection.query('Insert into case_t(Status,Case_Start_Date,Case_End_Date,Casualty,Description,Compensation,Location_Id,PoliceStation_Id) values(?,?,?,?,?,?,?,?)' ,[status,startdate,enddate,casuality,desc,compensation,locationid,psid], function(error, results, fields) {
    if (error) throw error;
    res.redirect('case');
  });
});


app.post('/newcase', function(req, res) {
        res.render('newcase')
});


app.post('/changecase', function(req, res) {

  const caseid = req.body.caseid;

  connection.query("Select * from case_t natural join location where Case_Id = ?", [caseid], function(error, results, fields) {
    if (error) throw error;
    if(results.length>0)
    {
    let status = results[0].Status;
    var startdate = results[0].Case_Start_Date;
    startdate=moment(startdate).format('YYYY-MM-DD');
    var enddate = results[0].Case_End_Date;
      enddate=moment(enddate).format('YYYY-MM-DD');
    let casuality = results[0].Casuality;
    let desc = results[0].Description;
    let compensation = results[0].Compensation;
    let locationid = results[0].Location_Id;
    let psid = results[0].PoliceStation_Id;
    let cooperation = results[0].Cooperation;
    let panchayat = results[0].Panchayat;
    let state = results[0].State;
    let district = results[0].District;
    let taluk = results[0].Taluk;
    let landmark = results[0].Landmark;

    console.log(results);
    res.render('form_update_case', {
      caseid:caseid,
      status: status,
      sd: startdate,
      ed: enddate,
      cas: casuality,
      desc: desc,
      comp: compensation,
      loc: locationid,
      psid: psid,
      cooperation:cooperation,
      panchayat:panchayat,
      state:state,
      district:district,
      taluk:taluk,
      landmark:landmark
    });
  }
  });
});

app.post('/updatecase', function(req, res) {
  let caseid = req.body.caseid;
  let status = req.body.status;
  let startdate = req.body.startdate;
  let enddate = req.body.enddate;
  let casuality = req.body.casuality;
  let desc = req.body.desc;
  let compensation = req.body.compensation;
  let locationid = req.body.locationid;
  let psid = req.body.psid;


  connection.query("UPDATE case_t SET Status=?,Case_Start_Date=?,Case_End_Date=?,Casualty=?,Description=?,Compensation=?,Location_Id=?,PoliceStation_Id=? where Case_Id= ?" ,[status,startdate,enddate,casuality,desc,compensation,locationid,psid,caseid], function(error, results, fields) {
    if (error) throw error;
    res.redirect('case');
  });
});


app.post('/newcase', function(req, res) {
        res.render('newcase')
});







app.listen(3000, function() {
  console.log('App listening on port 8080!')
});
