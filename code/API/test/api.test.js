var session = require('supertest-session');
var app = require('../app')

var testSession = null;

beforeEach(function () {
  testSession = session(app);
});
//Successful Route unit tests i.e login credentials are fine and data should be returned as expected
describe("GET  logout",()=>{
  var authenticatedSession;

    beforeEach(function (done) {
      testSession.post('/login')
        .send({email:"roman@mail.com", password:"secret"})
        .expect(200)
        .end(function (err) {
          if (err) return done(err);
          authenticatedSession = testSession;
          return done();
        });
    });
    it("Deletes the users session from session storage",(done)=>{
        authenticatedSession.get("/logout")
        .expect(200)
        .expect("logged out",done)
    })
})
describe("GET  LoggedIn",()=>{
  var authenticatedSession;

    beforeEach(function (done) {
      testSession.post('/login')
        .send({email:"roman@mail.com", password:"secret"})
        .expect(200)
        .end(function (err) {
          if (err) return done(err);
          authenticatedSession = testSession;
          return done();
        });
    });
    it("Should return true if the user is logged in",(done)=>{
       authenticatedSession.get("/LoggedIn")
       .expect(200)
       .expect("true",done)
    })
})
describe("GET  userDetails",()=>{
  var authenticatedSession;

    beforeEach(function (done) {
      testSession.post('/login')
        .send({email:"roman@mail.com", password:"secret"})
        .expect(200)
        .end(function (err) {
          if (err) return done(err);
          authenticatedSession = testSession;
          return done();
        });
    });
    it("Should retrieve the users details from the database and send back to client",(done)=>{
       authenticatedSession.get("/userDetails")
       .expect(200)
       .expect({"id":14108140,"fname":"Roman","lname":"Prozackha","email":"roman@mail.com","accounttype":"Mentee","photo":null,"ccode":"CASE","year":1},done)
    })
})
describe("GET  userinterests",()=>{
  var authenticatedSession;

    beforeEach(function (done) {
      testSession.post('/login')
        .send({email:"roman@mail.com", password:"secret"})
        .expect(200)
        .end(function (err) {
          if (err) return done(err);
          authenticatedSession = testSession;
          return done();
        });
    });
    it("Should return an array of interests for the user",(done)=>{
       authenticatedSession.get("/userInterests")
       .expect(200)
       .expect([{interest: 'Listening to music'},{interest: 'Programming'},{interest: 'Puzzles'}],done)
    })
})
describe("GET  pairedUserDetails",()=>{
  var authenticatedSession;

    beforeEach(function (done) {
      testSession.post('/login')
        .send({email:"roman@mail.com", password:"secret"})
        .expect(200)
        .end(function (err) {
          if (err) return done(err);
          authenticatedSession = testSession;
          return done();
        });
    });
    it("Should return the user's paired details",(done)=>{
       authenticatedSession.get("/pairedUserDetails")
       .expect(200)
       .expect('Content-Type', /json/,done)
    })
})
describe("GET  RegisterFields",()=>{
  var authenticatedSession;


    it("Should return an array of interests.",(done)=>{
       testSession.get("/RegisterFields")
       .expect('Content-Type', /json/)
       .expect(200,done)
    })
})
describe("GET  users",()=>{
    var authenticatedSession;
    beforeEach(function (done) {
      testSession.post('/login')
        .send({email:"roman@mail.com", password:"secret"})
        .expect(200)
        .end(function (err) {
          if (err) return done(err);
          authenticatedSession = testSession;
          return done();
        });
    });
    it("Retrieves users from database",(done)=>{
      authenticatedSession.get("/GetUsers")
      .expect('Content-Type', /json/)
      .expect(200,done);
    })
})
describe("GET  usersForMatching",()=>{
  var authenticatedSession;

    beforeEach(function (done) {
      testSession.post('/login')
        .send({email:"roman@mail.com", password:"secret"})
        .expect(200)
        .end(function (err) {
          if (err) return done(err);
          authenticatedSession = testSession;
          return done();
        });
    });
    it("Should retrieve a list of users in the database",(done)=>{
      authenticatedSession
      .get("/usersForMatching")
      .expect('Content-Type', /json/)
      .expect(200,done)
    })
})
describe("GET  pairedAppointments",()=>{
    var authenticatedSession;
    beforeEach(function (done) {
      testSession.post('/login')
        .send({email:"roman@mail.com", password:"secret"})
        .expect(200)
        .end(function (err) {
          if (err) return done(err);
          authenticatedSession = testSession;
          return done();
        });
    });
    it("Should retrieve all paired user's appointments",(done)=>{
      authenticatedSession
      .get("/pairedAppointments")
      .expect('Content-Type', /json/)
      .expect(200,done)
    })
})
describe("GET  pairIDs",()=>{
  var authenticatedSession;
  beforeEach(function (done) {
    testSession.post('/login')
      .send({email:"roman@mail.com", password:"secret"})
      .expect(200)
      .end(function (err) {
        if (err) return done(err);
        authenticatedSession = testSession;
        return done();
      });
  });
  it("Should retieve a pair of user's ID's",(done)=>{
      authenticatedSession.get("/getPairIDs")
      .expect('Content-Type', /json/)
      .expect(200,done)
  })
})
describe("POST deleteAppointment",()=>{
  var authenticatedSession;

    beforeEach(function (done) {
      testSession.post('/login')
        .send({email:"roman@mail.com", password:"secret"})
        .expect(200)
        .end(function (err) {
          if (err) return done(err);
          authenticatedSession = testSession;
          return done();
        });
    });
    it("Should delete an appointment from the database",(done)=>{
      authenticatedSession
      .post("/deleteAppointment")
      .send({ id: 14108140}).expect(200)
      .expect("deleted!",done)
    })
})
describe("POST login",()=>{
    it("returns true if the users credentials are correct",(done)=>{
            testSession
            .post("/login")
            .send({email:"roman@mail.com", password:"secret"})
            .expect(200)
            .expect("true",done)

    })
})
describe("POST register",()=>{
    it("Registers a user to the database assuming the details are correct",(done)=>{
      testSession
        .post("/register")
        .send({studentNumber:"12345678",fname:"test",lname:"user",email:"test@mail.com",password:"secret",mentor:"on",mentee:"",photo:"",interest1:"Anime",interest2:"Art",interest3:"Fishing",gender:"Male",course:"CASE"})
        .expect(200)
        .expect("user inserted!",done)
    })
})
describe("POST Book Appointment",()=>{
  var authenticatedSession;

    beforeEach(function (done) {
      testSession.post('/login')
        .send({email:"roman@mail.com", password:"secret"})
        .expect(200)
        .end(function (err) {
          if (err) return done(err);
          authenticatedSession = testSession;
          return done();
        });
    });
    it("Insert a record of an appointment to the database",(done)=>{
      authenticatedSession.post("/bookAppointment")
      .send({date:"08-11-95",time:"3am",description:"jamie was born"})
      .expect(200)
      .expect("inserted!",done)
    })
})
describe("POST insertPairings",()=>{
   var authenticatedSession;
   beforeEach(function (done) {
      testSession.post('/login')
        .send({email:"roman@mail.com", password:"secret"})
        .expect(200)
        .end(function (err) {
          if (err) return done(err);
          authenticatedSession = testSession;
          return done();
        });
    });
   it("Insert a pair of users into the pairings table in the database",(done)=>{
      authenticatedSession.post("/insertPairings")
      .send({id:"15634237", pId:"14894286"})
      .expect(200)
      .expect("pairs inserted!",done)
   })
})

//Unsecessful Route unit tests i.e not authenticated or wrong credentials
describe("GET  logout",()=>{

    it("Should return a 401 error code as request doesnt have valid session ID",(done)=>{
        testSession.get("/logout")
        .expect(401)
        .expect("not logged in",done)
    })
})
describe("GET  LoggedIn",()=> {

    it("Should return 401 error if user doesnt have proper session ID",(done)=>{
       testSession.get("/LoggedIn")
       .expect(401)
       .expect("false",done)
    })
})
describe("GET  userDetails",()=>{

    it("Return 404 error as user is not authorized",(done)=>{
       testSession.get("/userDetails")
       .expect(404)
       .expect("Not authorized",done)
    })
})
describe("GET  userinterests",()=>{

    it("Should return 404 status for non authenticated user",(done)=>{
       testSession.get("/userInterests")
       .expect(404)
       .expect("Not authorized",done)
    })
})
describe("GET  pairedUserDetails",()=>{

    it("Should return 404 status for non authenticated user",(done)=>{
       testSession.get("/pairedUserDetails")
       .expect(404)
       .expect("Not authorized",done)
    })
})
describe("GET  users",()=>{

    it("Returns 404 error code for non authorized user",(done)=>{
      testSession.get("/GetUsers")
      .expect(401)
      .expect("not authenticated",done);
    })
})
describe("GET  usersForMatching",()=>{

    it("Should return 401 status",(done)=>{
      testSession
      .get("/usersForMatching")
      .expect(401)
      .expect("not authenticated",done)
    })
})
describe("GET  pairedAppointments",()=>{

    it("Return 401 status for non authorized user",(done)=>{
      testSession
      .get("/pairedAppointments")
      .expect(401)
      .expect("not authenticated",done)
    })
})
describe("GET  pairIDs",()=>{

  it("Should return 401 status",(done)=>{
      testSession.get("/getPairIDs")
      .expect(401,done)
  })
})
describe("POST deleteAppointment",()=>{

    it("Should return error message that credentials were wrong for database query",(done)=>{
      testSession
      .post("/deleteAppointment")
      .send({ id: 1108140}).expect(401)
      .expect("not authorized",done)
    })
})
describe("POST login",()=>{
    it("retrieves login data from react app with incorrect password",(done)=>{
            testSession
            .post("/login")
            .send({email:"roman@mail.com", password:"secet"})
            .expect(401)
            .expect("false",done)

    })
})
describe("POST register",()=>{
    it("Returns 500 status code for wrong credentials",(done)=>{
      testSession
        .post("/register")
        .send({studentNumber:null,fname:null,lname:"user",email:"test@mail.com",password:"secret",mentor:"on",mentee:"",photo:"",interest1:"Anime",interest2:"Art",interest3:"Fishing",gender:"Male",course:"CASE"})
        .expect(500)
        .expect("something went wrong",done)
    })
})
describe("POST Book Appointment",()=>{

    it("Insert a record of an appointment to the database",(done)=>{
      testSession.post("/bookAppointment")
      .send({date:"08-11-95",time:"3am",description:"jamie was born"})
      .expect(401)
      .expect("not authorized",done)
    })
})
describe("POST insertPairings",()=>{

   it("Insert a pair of users into the pairings table in the database",(done)=>{
      testSession.post("/insertPairings")
      .send({id:"15634237", pId:"14894286"})
      .expect(401)
      .expect("not authorized",done)
   })
})
