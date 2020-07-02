import React from 'react'
import Request from './Request.js'
import qs from 'qs';
import { Table, Container, Row, Col, Input, Label, Button, Spinner  } from 'reactstrap';
import Navbar    from './navbar.js'
class Matching extends React.Component{
  constructor(){
    super();
    this.state = {
    users: [],
    pairs: [],
    pairsMade: false,
    preferenceOrder: [],
    waiting: false,
    preferencesOrdered: true,
    networkError: null,
    networkSuccess: null
  };
  this.handleEvent   = this.handleEvent.bind(this);
  this.displayUsers  = this.displayUsers.bind(this);
  this.makePairs     = this.makePairs.bind(this);
  this.deletePairs   = this.deletePairs.bind(this);
  this.registerPairs = this.registerPairs.bind(this);
  this.load          = this.load.bind(this);
  }
  handleEvent(event){
    var val= event.target.value
    if(!this.state.preferenceOrder.includes(val)){
      this.state.preferenceOrder.push(val)
    }
    if(this.state.preferenceOrder.length === 3){
      this.setState({preferencesOrdered: false})
    }
    console.log(this.state.preferenceOrder)
  }
  displayUsers(){
   let users = []
   for(var i = 0; i < this.state.users.length; i++){
    users.push(<thead><tr>
                  <th>{this.state.users[i].id}</th>
                  <th>{this.state.users[i].fname}</th>
                  <th>{this.state.users[i].lname}</th>
                  <th>{this.state.users[i].email}</th>
                  <th>{this.state.users[i].gender}</th>
                  <th>{this.state.users[i].cCode}</th>
                  <th>{this.state.users[i].accounttype}</th>
                  <th>{this.state.users[i].interest1}</th>
                  <th>{this.state.users[i].interest2}</th>
                  <th>{this.state.users[i].interest3}</th>
                </tr></thead>)
   }
   return users
 }
  displayPairs(){
    let pairs = []
    for(var i = 0; i < this.state.pairs.length; i++){
     pairs.push(<thead><tr>
                   <th>{this.state.pairs[i].id}</th>
                   <th>{this.state.pairs[i].fname}</th>
                   <th>{this.state.pairs[i].accounttype}</th>
                   <th>{this.state.pairs[i].pId}</th>
                   <th>{this.state.pairs[i].pFname}</th>
                   <th>{this.state.pairs[i].paccounttype}</th>
                 </tr></thead>)
    }
    return pairs
  }
  makePairs(){
    let mentors    = []
    let mentees    = []
    let results    = []
    let users = this.state.users
    let preferenceOrder = this.state.preferenceOrder
  //  console.log(users)
    for(var i = 0; i < users.length; i ++){

        let id          = users[i].id
        let gender      = users[i].gender
        let courseCode  = users[i].cCode
        let interests   = [users[i].interest1,users[i].interest2, users[i].interest3]
        let name        = users[i].fname
        let accountType = users[i].accounttype
      //  console.log(name)
        if(users[i].accounttype === "Mentor"){
          let mentor = new Mentor(gender,courseCode,id,interests, name, accountType)
          results.push(mentor)
          mentors.push(mentor)
        }else{
          let mentee = new Mentee(gender,courseCode,id,interests, name, accountType)
          results.push(mentee)
          mentees.push(mentee)
        }
      //  results[i].set_preferences(preferenceOrder)

    }
    stable_marriage(mentors,mentees, preferenceOrder)
  //  console.log(results)
    for(i = 0; i < mentors.length; i++){
      let pair = {id: null,fname:null,accountType:null,pId:null,pFname:null,paccounttype:null}
      pair.id           = mentors[i].get_student_id()
      pair.fname        = mentors[i].get_name()
      pair.accounttype  = mentors[i].get_account_type()
      pair.pId          = mentors[i].pair.get_student_id()
      pair.pFname       = mentors[i].pair.get_name()
      pair.paccounttype = mentors[i].pair.get_account_type()
      this.state.pairs.push(pair)
      console.log(mentors[i].get_name())
    }
    console.log(this.state.pairs)
    this.setState({pairsMade:true, waiting:true})
  }
  deletePairs(){
    this.setState({pairs: [], pairsMade:false})
  }
  registerPairs(){
    let pairs = this.state.pairs
    let requestBody = {}
    const config = {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  }
    for(var i = 0; i < pairs.length; i++){
      Request.post("/insertPairings", qs.stringify(pairs[i]),config).then((results)=>console.log(results)).catch(err=>console.log(err))
      console.log( {i: pairs[i]})
    }
    console.log(requestBody)
  }
  load(){
    setTimeout(()=>{
      this.setState({waiting:false})
    },2000)
  }
  componentWillMount(){
    //do something
    Request.get("/usersForMatching")
           .then(results => this.setState({users: results.data}))
           .catch(err => console.log(err))
  }
  render(){
      if(!this.state.pairsMade){
        return (
          <div className="Matching">
            <Navbar />
            <Container fluid={false}>
              <Row>
                <Col>
                  <Table>
                    <thead>
                      <tr>
                        <th>Student </th>
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>Email</th>
                        <th>Gender</th>
                        <th>cCode</th>
                        <th>Account Type</th>
                        <th> Interest 1 </th>
                        <th> Interest 2 </th>
                        <th> Interest 3 </th>
                      </tr>
                    </thead>
                    {this.displayUsers()}
                  </Table>
                </Col>
              </Row>
              <br/>
              <Row>
                <Col xs="6">
                  <div className="algorithmDescription">
                    <h3>The matching Algorithim</h3>
                    <hr/>
                    <p> User's can be sorted into pairs with a variety of different weights being taken into consideration. Course Code, gender and a mutual interest all play a part in how Mentors and Mentee's are grouped.
                    </p>
                  </div>
                </Col>
                <Col xs="6">
                  <div className="algorithmMenu">
                    <h3> Weighting the Algorthim </h3>
                    <hr/>
                    <Label for="Weight1">Weight 1:</Label>
                      <Input type="select" id="preferenceOrder"  name="Weight1" onChange={this.handleEvent}>
                        <option> </option>
                        <option> Gender </option>
                        <option> Course </option>
                        <option> Interests </option>
                      </Input>
                        <Label for="Weight2">Weight 2:</Label>
                      <Input type="select" id="preferenceOrder" name="Weight2" onChange={this.handleEvent}>
                        <option> </option>
                        <option> Course </option>
                        <option> Gender </option>
                        <option> Interests </option>
                      </Input>
                      <Label for="Weight1">Weight 3:</Label>
                        <Input type="select" id="preferenceOrder"  name="Weight3" onChange={this.handleEvent}>
                        <option> </option>
                        <option> Interests </option>
                        <option> Gender </option>
                        <option> Course </option>
                      </Input>
                      <br/>
                      <Button color="primary" disabled={this.state.preferencesOrdered} onClick={this.makePairs}>Match Users</Button>
                  </div>
                </Col>
              </Row>
            </Container>
          </div>
        )
     }else if(this.state.waiting){
       return (
         <div >
            <Navbar />
            <Container>
              <div className="loading">
                  <Spinner type="grow" color="primary" />
                  <br/>
                  <h3>Just a moment please </h3>
                  {this.load()}
              </div>
            </Container>
          </div>
       )
     }else{
       return(
       <div className="Matching">
         <Navbar />
         <Container fluid={false}>
           <Row>
             <Col>
               <Table>
                 <thead>
                   <tr>
                     <th>Student id</th>
                     <th>First Name</th>
                     <th>Account Type</th>
                     <th>Paired Student id</th>
                     <th>Paired First Name</th>
                     <th>Paired Account Type</th>
                   </tr>
                 </thead>
                 {this.displayPairs()}
               </Table>
             </Col>
           </Row>
           <br/>
           <Row>
             <Col xs="6">
               <div className="algorithmDescription">
                 <h3>The matching Algorithim</h3>
                 <hr/>
                 <p> If you're happy with the pairs made by the algorithim you can save them now, or go back to the menu and change the weights
                 </p>
               </div>
             </Col>
             <Col xs="6">
               <div className="algorithmMenu">
                 <h3> Save pairs </h3>
                 <hr/>
                    <Button color="primary"  onClick={this.registerPairs}>Register Pairs</Button>
                    <Button color="danger" onClick={this.deletePairs}>Redo Pairs</Button>
               </div>
             </Col>
           </Row>
           </Container>
           </div>
         )
     }
  }
}

class Participant {
	constructor(gender, course_code, student_id, interests, name, accountType){
		this.gender = gender;
		this.course_code = course_code;
		this.student_id = student_id;
		this.interests = interests;
		this.preferences = [];
		this.pair = null;
    this.name = name;
    this.accountType = accountType;
	}
  get_name(){
    return this.name
  }
  get_account_type(){
    return this.accountType
  }
	// setters and getters
	get_gender(){
		return this.gender;
	}

	get_course_code(){
		return this.course_code;
	}

	get_student_id(){
		return this.student_id;
	}

	get_interests(){
		return this.interests;
	}

	get_pair(){
		return this.pair;
	}

	set_pair(partner){
		this.pair = partner;
	}

	is_free(){
		return !Boolean(this.pair);
	}

	add_preference(participant){
		this.preferences.push(participant)
	}

	sort_preferences(){
		this.preferences.sort(function(a, b) {
			return b.get_score() - a.get_score();
		})

		for (var i in this.preferences){
			this.preferences[i] = this.preferences[i].get_participant();
		}
	}

	// this method calculates the score of a pairing between a mentor and a mentee or vice verse
	// based on their gender, their course and their interests
	calc_pair_score(participant, gender_score, course_code_score, interest_score){
		var pairing_score = 0;

		if (this.gender === participant.get_gender()){
			pairing_score += gender_score;
		}

		if (this.course_code === participant.get_course_code()){
			pairing_score += course_code_score;
		}

		this.interests.forEach(function(item, index, array){
			if (participant.get_interests().includes(item)){
				pairing_score += interest_score;
			}
		});

		return pairing_score;
	}

}


class Mentor extends Participant {
	constructor(gender, course_code, student_id, interests, name, accountType){
		super(gender, course_code, student_id, interests, name, accountType);
		this.proposals = [];
	}

	get_proposals(){
		return this.proposals;
	}

	get_preferences(){
		return this.preferences;
	}

	add_proposal(mentee){
		this.proposals.push(mentee);
	}

	to_string(){
		return `Mentor: ${this.student_id}`;
	}
}


class Mentee extends Participant {
	constructor(gender, course_code, student_id, interests, name,accountType){
		super(gender, course_code, student_id, interests, name,accountType)
	}

	// this for a Mentee to make a proposal
	pop_preference(){
		return this.preferences.shift();
	}

	to_string(){
		return `Mentor: ${this.student_id}`;
	}
}


// javascript had to be awkward and not have built-in tuples so I just made a pair object
// so i can group a participant with a score to generate all preference lists
class Pair {
	constructor(participant, score){
		this.participant = participant;
		this.score = score;
	}

	get_participant(){
		return this.participant;
	}

	get_score(){
		return this.score;
	}
}

// just takes a list of mentees and checks to see if anyone is still not paired
// this is how the algorithm actually terminates, when everyone gets paired
function free_mentee(mentee_list){
	for (var i in mentee_list){
		if (mentee_list[i].is_free()){
			return true;
		}
	}
	return false;
}


/*
	this function generates the preference lists for all mentors and mentees
*/
function set_preferences(mentor_list, mentee_list, gender_weight, course_code_weight, interest_weight){
	const gender_score = 1.2 * gender_weight
	const course_code_score = 1.2 * course_code_weight
	const interest_score = 1 * interest_weight

	for (var i in mentor_list){
		for (var j in mentee_list){
			var pairing_score = mentor_list[i].calc_pair_score(mentee_list[j], gender_score, course_code_score, interest_score)

			mentor_list[i].add_preference(new Pair(mentee_list[j], pairing_score))
			mentee_list[j].add_preference(new Pair(mentor_list[i], pairing_score))
		}
	}

	for (var i in mentor_list) {
		mentor_list[i].sort_preferences()
	}

	for (var i in mentee_list) {
		mentee_list[i].sort_preferences()
	}
}


// aaand this is where the magic happens :')
function stable_marriage(mentor_list, mentee_list, weight_list){
	 weight_list = weight_list.reverse()
  let proposals;
  let preferred_index;
  let preferences;

	//calculate weightings based on admin preference
	let gender_weight = weight_list.indexOf("Gender") + 1
	let course_code_weight = weight_list.indexOf("Course") + 1
	let interest_weight = weight_list.indexOf("Interests") + 1


	// generates the preference lists for the mentors and the mentees
	set_preferences(mentor_list, mentee_list, gender_weight, course_code_weight, interest_weight)

	// as stated earlier, it keeps running until all mentees are paired
	// (and because there will be a one to one mapping and each mentor can only have one mentee
	//  this basically means that all mentors will be paired at that point too)
	while (free_mentee(mentee_list)){

		// here every free mentee makes their proposals to their currently most preferred mentor
		for (var i in mentee_list){
			if (mentee_list[i].is_free()){
				var preferred_mentor = mentee_list[i].pop_preference();
				preferred_mentor.add_proposal(mentee_list[i]);
			}
		}

		// here every mentor goes through their list of proposals and checks to see if
		// any of these proposals are better than their current match
		// if they are then they break their current match and pair with the better one (such a fickle algorithm)
		for (var i in mentor_list){
			proposals = mentor_list[i].get_proposals();
			preferences = mentor_list[i].get_preferences();

			// basically preferred index is just how high up on their preference list someone is
			// if the mentor is free then having no pair is the worst possible case so the preferred index is
			// set as low as possible
			if (mentor_list[i].is_free()){
				preferred_index = preferences.length-1;
			}
			// otherwise the preffered index is set to their current pair (wherever the current pair may be on their preference list)
			else {
				preferred_index = preferences.indexOf(mentor_list[i].get_pair());
				mentor_list[i].get_pair().set_pair(null);
			}

			// and then you simply check if any of the proposals in a mentor's proposal list is higher up on their preference list
			// than their current pair
			for (var j in proposals){
				if (preferences.indexOf(proposals[j]) < preferred_index){
					preferred_index = preferences.indexOf(proposals[j]);
				}
			}

			// here you just match the mentor and mentee together based on the preferred index
			mentor_list[i].set_pair(preferences[preferred_index]);
			preferences[preferred_index].set_pair(mentor_list[i]);
		}
	}
}


export default Matching
