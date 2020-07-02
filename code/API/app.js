//importing all required libraries
var express    = require('express');
var mysql      = require('promise-mysql');
var cors       = require('cors')
var hash       = require('hash.js')
var app        = express();
var session    = require('express-session');
var MySQLStore = require('express-mysql-session')(session);
var bodyParser = require("body-parser");
var app        = express();
var server     = require('http').Server(app);
var axios      = require("axios")
var socket     = require("socket.io")(server)
module.exports = app.listen(6000);
var options    = {
  host     : '127.0.0.1',    //enter your credentials here!
  user     : 'aliu2',
  password : 'secret',
  database : 'acclimate',
  clearExpired: true,
	checkExpirationInterval: 60000,
	expiration:3600000,
	createDatabaseTable: true,
	connectionLimit: 1,
	endConnectionOnClose: true,
	charset: 'utf8mb4_bin',
};
var now        = new Date();
var time       = now.getTime();
const MATCHING_USERS_QUERY = "select usersInterestTable.id, fname, lname, email, accounttype, gender , cCode ,interest from interests, (select userTable.id, fname, lname, email, gender, cCode ,accounttype, userinterests.interestid from userinterests,(select id,fname,lname,email, gender, cCode ,accounttype from users where accounttype != 'Admin') as userTable where userTable.id = userinterests.userid) as usersInterestTable where usersInterestTable.interestid = interests.id"
let   INSERT_PAIRS_QUERY   = "Insert into pairings (id, mentorID, menteeID, chatlog) VALUES"
time +=  1000 * 60 * 60 * 2; //set the max age of our session to 2 hours
now.setTime(time);
const MAX_AGE = now;
const port = 4000;
var connection;
var connections = {}
//open MySql connection
mysql.createConnection(options)
.then((conn)=>{connection = conn;})
.catch((err) => console.error(err));

//create and configure the SQL session store
var sessionStore = new MySQLStore(options, connection);
app.use(cors({origin: "http://localhost:3000",credentials: true, origin: true, methods: ['GET','POST']}));
app.use(bodyParser.json())

//Tell express to uses these dependancies
app.use(bodyParser.urlencoded({ extended: false }))
app.use(session({
  cookie: {
    maxAge: MAX_AGE,
    httpOnly: false,
    sameSite: true,
    secure: false,
  },
	secret: 'session_cookie_secret',
	store: sessionStore,
  resave: false,
  saveUninitialized: false
}));

//if someone tries to access loclahost:4000 redirect them to the react app homepage
app.get("/", (req,res) => {
  res.send("http://localhost:3000")
})

//log the user in and set their sessionID
app.post("/login",(req,res) => {
  const{email,password} = req.body
  let hashPassword = hash.sha256().update(password).digest("hex");
  connection.query(`SELECT * FROM USERS WHERE email = "${email}"`)
  .then((row) =>{
    if(row[0].password === hashPassword){
        req.session.UserID = row[0].id
        req.session.accountType = row[0].accounttype
        res.status(200).send(true)
      }
      else{
        res.status(401).send("false")
      }
   })
  .catch((err)=>console.log(err))
})

//register the user
app.post("/register", (req,res) =>{
  //console.log(req.body.files.photo)
 console.log(req.body)

  const{studentNumber,fname,lname,email,password,mentor,mentee,photo,interest1,interest2,interest3,gender ,course, year} = req.body
  if(validateFields(studentNumber,fname,lname,gender)){
        let accountType;
        (mentor === "on") ? accountType = "Mentor" : accountType = "Mentee"
        let hashPassword = hash.sha256().update(password).digest("hex");
        connection.query(`INSERT INTO users(id, fname, lname, email, password, accounttype, photo, gender, ccode, year) VALUES (${studentNumber},"${fname}","${lname}","${email}","${hashPassword}","${accountType}",NULL,"${gender}","${course}", ${year})`)
        .then((res)=> {
          req.session.UserID = res.insertId})
        .then(()=>{
          connection.query(`SELECT id from interests where interest = "${interest1}" or interest = "${interest2}" or interest = "${interest3}"`)
          .then(results =>{
             let interest1 = results[0].id
             let interest2 = results[1].id
             let interest3 = results[2].id
             connection.query(`INSERT INTO userinterests (userid, interestid) VALUES (${studentNumber}, ${interest1}), (${studentNumber}, ${interest2}), (${studentNumber}, ${interest3})`)
             res.status(200).send("user inserted!")
           })
      })
     .catch(err=>res.status(500).send("something went wrong"))
  }else{
    res.status(500).send("something went wrong")
  }
})

//logout the User, clear they're session data and redirect to homepage
app.get("/logout",(req,res)=>{
  if(req.session.UserID){
       req.session.destroy((err) => {
         console.error(err)
       })
       res.status(200).send("logged out")
  }else{
    res.status(401).send("not logged in")
  }
})

//get the users info
app.get("/userDetails",(req,res)=>{
 //console.log(req.session)
  if(!req.session.UserID){
     res.status(404).send("Not authorized")}
  else{
    let id = req.session.UserID
    //ADD COLUMN FOR COURSE YEAR HERE
    connection.query("SELECT `id`,`fname`,`lname`,`email`,`accounttype`,`photo`, `ccode`, `year` FROM `users` WHERE id = " + id)
    .then(results =>{

       res.status(200).send(results[0])
     })
    .catch(err => console.log(err))
  }
})

//get the users interests
app.get("/userInterests",(req,res)=>{
  //console.log(req.session)
   if(!req.session.UserID){
      res.status(404).send("Not authorized")}
   else{
     let id = req.session.UserID
     connection.query(`select interest from interests, userinterests where userid=${id} AND interestid = interests.id`)
     .then(results => res.status(200).send(results))
     .catch(err => console.log(error))
   }
})

//get the users info
app.get("/pairedUserDetails",(req,res)=>{
 console.log(req.session.account)
  if(!req.session.UserID){
     res.status(404).send("Not authorized")}
  else{
    let id = req.session.UserID
    let pairedType = "mentor"

    if(req.session.accountType === "Mentor") {
      console.log("MENTOR")
      pairedType = "mentee"
    } else {
      console.log("MENTEE")
      pairedType = "mentor"
    }
  // /  console.log(pairedType)
    connection.query(`select users.id, fname,lname, email, accounttype, ccode, year from users, (SELECT * from pairings where mentorID = ${id} or menteeID = ${id}) as pairing where pairing.${pairedType}ID = users.id`)
    .then(results => {
    //  console.log(results)
      res.status(200).send(results[0])
    })
    .catch(err => console.log(err))
  }
})

app.get("/pairedInterests", (req, res)=>{
  if(!req.session.UserID){
     res.status(404).send("Not authorized")}
  else{
    let id = req.session.UserID
    let pairID
    let pairedType = "mentor"
    if(req.session.accounttype === "Mentor") {pairedType = "mentee"} else {pairedType = "mentor"}
    connection.query(`select users.id from users, (SELECT * from pairings where mentorID = ${id} or menteeID = ${id})  as pairing where pairing.${pairedType}ID = users.id`)
    .then((results) => pairID = results[0].id)
    .then(()=>{
      connection.query(`select interest from interests, userinterests where userid=${pairID} AND interestid = interests.id`)
      .then((results) => {
        res.status(200).send(results)
      })
    })
  }
});


//check to see if a session has a logged in user
app.get("/LoggedIn",(req,res)=>{
  if(req.session.UserID){
     res.status(200).send({authenticated: true, userType:req.session.accountType})
    }else{

    res.status(401).send(false)
    console.log(req.session.UserID)
  }
})

//retrieve course codes and interests for register page
app.get("/RegisterFields",(req,res)=>{
  connection.query("SELECT DISTINCT cCode, interest FROM courses, interests")
            .then(results => res.send(results))
            .catch(err => console.log(err))
})

//retrieve users for matchmaking
app.get("/GetUsers",(req,res)=>{
  if(!req.session.UserID){
    res.status(401).send("not authenticated")
  }else {

    connection.query("SELECT * FROM users WHERE accounttype = 'Mentor' OR accounttype = 'Mentee'")
            .then(results => res.status(200).send(results))
            .catch(err => console.log(err))
   }
})

// app.get("/getBestTime", (req, res)=>{
//   connection.query(`select ccode, year from users where id = 14108140`)
//     .then(results)
// })

//"SELECT `id`,`fname`,`lname`,`email`,`accounttype`,`photo`, `ccode`, `year` FROM `users` WHERE id = " + id
//`select interest from interests, userinterests where userid=${id} AND interestid = interests.id`
//`select ccode, year from users, (SELECT * from pairings where mentorID = ${id} or menteeID = ${id}) as pairing where pairing.${pairedType}ID = users.id`
app.get("/getBestTime", (req, res)=>{
  if(!req.session.UserID) res.status(401)
  let id = req.session.UserID
  let userCCode = ""
  let userYear = 0
  let pairCCode = ""
  let pairYear = 0
  let pairedType = "mentor"
  let test
  let mentor_url = ""
  let mentee_url = ""
  let mentor_timetable
  let mentee_timetable
  if(req.session.accounttype == "Mentor") {pairedType = "mentee"}
  let recommend_string = "hello"
  // if(req.session.accounttype == "Mentor") pairedType = "mentee"
  connection.query(`select ccode, year from users where id = ${id}`)
    .then(results => {
      // console.log(results)
      userCCode = results[0].ccode
      userYear = results[0].year
    })
    .then(()=> {
      console.log(id)
      connection.query(`select ccode, year from users, (SELECT * from pairings where mentorID = ${id} or menteeID = ${id}) as pairing where pairing.${pairedType}ID = users.id`)
      .then(results=> {
        pairCCode = results[0].ccode
        pairYear = results[0].year
        mentor_url = `https://www101.dcu.ie/timetables/feed.php?prog=${userCCode}&per=${userYear}&week1=21&week2=22&hour=1-20&template=student`
        mentee_url = `https://www101.dcu.ie/timetables/feed.php?prog=${pairCCode}&per=${pairYear}&week1=21&week2=22&hour=1-20&template=student`
      })
      //RUN TIMETABLE PARSING ALGORITHM IN HERE
      .then(()=> {
        // test = parse_timetable(userCCode, userYear, pairCCode, pairYear)
        axios.get(mentor_url)
          .then((data)=> {
            mentor_timetable=data
          })
          .then(()=> {
            axios.get(mentee_url)
            .then((data)=> {
              mentee_timetable=data
            })
            .then(()=> {
              // console.log(mentor_timetable)
              // console.log(mentee_timetable)
              console.log(parse_timetable(mentor_timetable, mentee_timetable))
            })
          })
      })
      // console.log(userCCode);
      // console.log(userYear);
      // console.log(pairCCode);
      // console.log(pairYear)
      // console.log(recommend_string)
      // })
      // .then(() => {
        // console.log(mentor_url)
      })
        // mentoee_timetable = axios.get(mentee_url)
      // })
    // })
})

//book a meeting with your mentor or mentee
app.post("/bookAppointment",(req,res)=>{
  if(!req.session.UserID) res.status(401).send("not authorized")
  console.log(req.body)
  const {date,time,description} = req.body
  let id = req.session.UserID
  connection.query(`select id from pairings where mentorID = ${id} or menteeID = ${id}`)
   .then((results)=> id = results[0].id)
   .then(()=>console.log(id))
   .then(()=>{
     connection.query(`INSERT INTO meetings (id,pairing,date,time,description) VALUES (NULL,${id},"${date}","${time}","${description}")`)
     .then(()=> res.status(200).send("inserted!")).catch(err=> console.log(err))
   })
   .catch(err=>console.log("er"))
})

//get any appointments you have with your mentor
app.get("/appointment",(req,res)=>{
  console.log("GET APPOINTMENTS")
   if(!req.session.UserID) res.status(401)
   let id = req.session.UserID
   console.log(req.session)
   connection.query(`select * from meetings where pairing = (SELECT id from pairings where mentorID = ${id} OR menteeID = ${id})`).then((results)=>{
     console.log(results)
     res.send(results)
   })
})

//delete a users appointment
app.post("/deleteAppointment",(req,res)=>{
  if(req.session.UserID){
    const {id} = req.body
    console.log(req.body)
   connection.query(`delete from meetings where id =${id}`).then(results=>res.status(200).send("deleted!")).catch(err => res.status(500).send("wrong credentials!"))
 }else{
   res.status(401).send("not authorized")
 }
})

//retrieve all users and their interests for pairing
app.get("/usersForMatching",(req,res)=>{
  console.log(req.session)
   if(!req.session.UserID){ res.status(401).send("not authenticated")}
   else{
  let data = []
  let user = {id: null, fname: null, lname: null, email: null, gender: null , cCode: null ,interest1: null, interest2: null, interest3: null}
  connection.query(MATCHING_USERS_QUERY)
  .then((results)=>{
    for(var i = 0; i < results.length; i++){
      user.id = results[i].id
      user.fname       = results[i].fname
      user.lname       = results[i].lname
      user.email       = results[i].email
      user.gender      = results[i].gender
      user.cCode       = results[i].cCode
      user.accounttype = results[i].accounttype
      if(user.interest1 === null){
        user.interest1 = results[i].interest
      }else if(user.interest2 === null){
        user.interest2 = results[i].interest
      }else{
        user.interest3 = results[i].interest
      }
      if(user.id && user.fname && user.lname && user.accounttype && user.email && user.interest1 && user.interest3 && user.interest3){
        data.push(user)
        user = {id: null, fname: null, lname: null, email: null, accounttype: null, interest1: null, interest2: null, interest3: null}
      }
    }
    })
  .then(()=> res.send(data))
  .catch(err => res.send(err))}
})

//register pairings
app.post("/insertPairings",(req,res)=>{
  if(!req.session.UserID){
    res.status(401).send("not authorized")
   }else{
      const {id, pId} = req.body
      console.log(req.body)
      connection.query(`INSERT INTO pairings(id, mentorID, menteeID, chatlog) VALUES (NULL,${id},${pId},NULL)`)
      .then(()=>res.send("pairs inserted!"))
      .catch(err => res.status(500).send("wrong credentials"))
    }
})

// get appointments for pairedDashboard pairedPage
app.get("/pairedAppointments",(req,res)=>{
  if(!req.session.UserID){ res.status(401).send("not authenticated")}
  else{
    let id = req.session.UserID
    console.log(id)
    connection.query(`select meetings.id, pairing, meetings.date, meetings.time, description from meetings where pairing = (select id from pairings where mentorID = ${id} or menteeID = ${id})`)
    .then((results)=>{res.send(results)})
    .catch(err=>console.log(err))
  }
})

//get pairs id's for chat purposes
app.get("/getPairIDs",(req,res)=>{
  if(!req.session.UserID){
    res.sendStatus(401)
  }
  else{
      let id = req.session.UserID
      connection.query(`SELECT mentorID, menteeID from pairings, chatlog where mentorID = ${id}  or menteeID = ${id}`)
      .then((results)=>{
        let data = results
        data.push(req.session.accountType)
        console.log(data)
        res.send(data)
      })
      .catch(err=>console.log(err))
  }
})

// Handle the chat feature for paired users
socket.on('connect', function(client) {
  client.on("id",data=>{
    console.log(data)
  })
  client.on("chat",data=>{
    console.log(data)
    //check to see if a dictionary of client id's has an open connection, if not register it
    if(!connections.hasOwnProperty(data.id)) connections[data.id] = client.id
        if(connections.hasOwnProperty(data.id)){
          //if there is a SocketID at the corrosponding student ID, but its different from the current SocketID update it
            if(connections[data.id] != client.id) connections[data.id] = client.id
                //if theres a connection open to a paired user, send a message to that client
                if(connections.hasOwnProperty(data.to)){
                  console.log(connections)
                    socket.to(connections[data.to]).emit("recieved", data.msg)
                }else{
                  console.log("not online")
                    socket.to(connections[data.id]).emit("recieved","The user you're trying to talk to is currently offline, please try messaging them later.")
                }
          }
     })
     socket.on('disconnected', function() {
           console.log('Got disconnect!');})
});

function getMentorTimetable(mentor_url) {
    return axios.get(mentor_url)
  }

function getMenteeTimetable(mentee_url) {
    return axios.get(mentee_url)
  }

function parse_timetable(mentor_timetable, mentee_timetable){
  // console.log(mentor_timetable)

  // let mentor_url = `https://www101.dcu.ie/timetables/feed.php?prog=${userCCode}&per=${userYear}&week1=21&week2=22&hour=1-20&template=student`
  // let mentee_url = `https://www101.dcu.ie/timetables/feed.php?prog=${pairCCode}&per=${pairYear}&week1=21&week2=22&hour=1-20&template=student`

  // axios.all([getMentorTimetable(mentor_url), getMenteeTimetable(mentee_url)])
  //   .then(axios.spread(function (mentor_timetable, mentee_timetable){


      mentor_timetable = mentor_timetable.data.split("\n")
      // console.log(mentor_timetable)
      mentor_timetable = mentor_timetable.splice(150, mentor_timetable.length)
      mentee_timetable = mentee_timetable.data.split("\n")
      mentee_timetable = mentee_timetable.splice(150, mentee_timetable.length)
      //format for how the days of the week are in the timetable
      const days = ["Mon", "Tue", "Wed", "Thu", "Fri"]
      //gets the actual current day of the week
      var d = new Date()
      var current_day = d.getDay()


      //handles the case of the user testing on the weekend
      if (current_day-1 < 0 || current_day-1 > 4){
        var i = 0;
      }
      else {
        var i = current_day-1
      }
      //since Sunday is 0, you need to subtract 1 to have "Mon" be 0
      var found_ideal_meeting = false;
      while (i < days.length && !found_ideal_meeting){
        //run algorithm for each day

        //finding the index of the next day for the mentor's timetable
        var next_day = find_day(mentor_timetable, days[i])
        console.log(mentor_timetable, days[i])
        var mentor_next_day = format_day(mentor_timetable.slice(parseInt(next_day)+3, mentor_timetable.length))
        //finding the index of the next day for the mentee's timetable
        var next_day = find_day(mentee_timetable, days[i])
        var mentee_next_day = format_day(mentee_timetable.slice(parseInt(next_day)+3, mentee_timetable.length))

        //list of meetings for a given day
        var meeting_list = find_meetings(mentor_next_day, mentee_next_day, days[i])

        penalize_meetings(meeting_list)
        sort_meetings(meeting_list)
        //as you go through the meetings, if meeting at the top has a score of 10
        //then it is an ideal meeting time so pick it and exit the loop
        if (meeting_list[0].get_score() == 10){
          // console.log(meeting_list[0].to_string())
          return meeting_list[0].to_string()
        }

        found_ideal_meeting = true;

        i = i + 1;
      }
    }

function find_day(participant_timetable, day){
  for (var i in participant_timetable){
    if (participant_timetable[i].includes(day)){
      return i;
    }
  }
}

//returns a list of free times and busy times
function format_day(participant_timetable){
  var day = new Array(18)
  var i = 0;
  var j = 0;

  while (i < day.length){
    console.log(participant_timetable[j])
    if (participant_timetable[j].includes("http://www.dcu.ie/images/space.gif")){
      day[i] = "Free";
      i = i + 1;
    }
    else if (participant_timetable[j].includes("<!-- START OBJECT-CELL --><TABLE")){
      var line = participant_timetable[j].split(" ")
      var string = reverse_string(line[6])
      var integer = parseInt(string, 10)
      var counter = 0;
      while (counter < integer){
        day[i] = "Busy";
        counter = counter + 1;
      i = i + 1;
      }
    }
    j = j + 1;
  }
  return day;
}

function find_meetings(mentor_day, mentee_day, day){
  var i = 0;
  var times = ["9:00", "9:30", "10:00", "10:30", "11:00", "11:30", "12:00", "12:30", "13:00", "13:30",
               "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00", "17:30", "18:00"]
  var meetings = [];

  while (i < mentor_day.length){
    if (mentor_day[i] == "Free" && mentee_day[i] == "Free"){
      meetings.push(new Meeting(day, times[i], times[i+1]))
    }
    i = i + 2;
  }
  return meetings;
}

function penalize_meetings(meeting_list){
  for (var i in meeting_list){
    if (meeting_list[i].get_start_time() == "9:00"){
      meeting_list[i].penalize(5);
    }

    if (meeting_list[i].get_start_time() == "17:00"){
      meeting_list[i].penalize(3);
    }
  }
}

function sort_meetings(meeting_list){
  meeting_list.sort(function(a, b) {
      return b.get_score() - a.get_score();
  })
}

function reverse_string(string){
  var reverse_string = string.split("");
  reverse_string = reverse_string.reverse();
  reverse_string = reverse_string.join("");
  return reverse_string;
}

class Meeting {
  constructor(day, start_time, end_time){
    this.day = day;
    this.start_time = start_time;
    this.end_time = end_time;
    this.score = 10;
  }

  penalize(amount){
    this.score = this.score - amount;
  }

  get_start_time(){
    return this.start_time
  }

  get_end_time(){
    return this.end_time
  }

  get_score(){
    return this.score
  }

  to_string(){
    return `We recommend a meetup time of ${this.start_time} - ${this.end_time} on ${this.day}.`;
  }
}

function validateFields(id,fname,lname,gender){
  console.log("GENDER IS " + gender)
  if(id === null || fname === null || lname === null || gender === null){
    return false
  }
  else if(id.length < 8 || id.length > 8 || id === ""){
    console.log("id false")
    return false
  }else if(fname === "") {
      console.log("fname false")
    return false
  }else if (lname === ""){
      console.log("lname false")
    return false
  }else if(!(gender != "Male" || gender != "Female" || gender != "Other")){
      console.log("gender false")
    return false
  }
  return true
}
//Listen for connections on port: {data:40}00
server.listen(port, () => console.log(`Example app listening on port ${port}!`))
