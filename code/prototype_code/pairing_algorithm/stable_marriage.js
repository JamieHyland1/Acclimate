// super class of Mentor and Mentee classes
class Participant {
	constructor(gender, course_code, student_id, interests){
		this.gender = gender;
		this.course_code = course_code;
		this.student_id = student_id;
		this.interests = interests;
		this.preferences = [];
		this.pair = null;
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

		if (this.gender == participant.get_gender()){
			pairing_score += gender_score;
		}

		if (this.course_code == participant.get_course_code()){
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
	constructor(gender, course_code, student_id, interests){
		super(gender, course_code, student_id, interests);
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

	reset_proposal_list(){
		this.proposals = []
	}
}


class Mentee extends Participant {
	constructor(gender, course_code, student_id, interests){
		super(gender, course_code, student_id, interests)
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
	const gender_score = 1.5 * gender_weight
	const course_code_score = 1.5 * course_code_weight
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

	//calculate weightings based on admin preference
	gender_weight = weight_list.indexOf("gender") + 1
	course_code_weight = weight_list.indexOf("course_code") + 1
	interest_weight = weight_list.indexOf("interests") + 1


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

			//reset proposal lists
			// for (var i in mentor_list){
			// 	mentor_list[i].reset_proposal_list()
			// }
		}
	}
}

// var mentor1 = new Mentor("male", "CASE", 1, ["sailing", "skiing", "gaming"])
// var mentor2 = new Mentor("other", "nothing", 2, ["boo", "boo", "boo"])
// var mentor3 = new Mentor("male", "CASE", 3, ["football", "programming", "pints"])
// var mentor4 = new Mentor("male", "CASE", 4, ["tennis", "basketball", "pints"])

var mentor1 = new Mentor("male", "CASE", 1, ["sailing", "skiing", "gaming"])
var mentor2 = new Mentor("female", "nothing", 2, ["boo", "boo", "boo"])
var mentor3 = new Mentor("male", "CASE", 3, ["football", "programming", "pints"])
var mentor4 = new Mentor("male", "CASE", 4, ["tennis", "basketball", "pints"])

var mentor_list = [mentor1, mentor2, mentor3, mentor4]

var mentee1 = new Mentee("male", "CASE", 1, ["boo", "boo", "boo"])
var mentee2 = new Mentee("female", "CASE", 2, ["sailing", "skiing", "gaming"])
var mentee3 = new Mentee("male", "CASE", 3, ["football", "programming", "pints"])
var mentee4 = new Mentee("male", "CASE", 4, ["tennis", "basketball", "pints"])

// var mentee1 = new Mentee("helicopter", "JOV", 1, ["weird", "things", "here"])
// var mentee2 = new Mentee("female", "CASE", 2, ["eating", "skiing", "gaming"])
// var mentee3 = new Mentee("male", "CASE", 3, ["football", "programming", "pints"])
// var mentee4 = new Mentee("male", "CASE", 4, ["tennis", "basketball", "pints"])

var mentee_list = [mentee1, mentee2, mentee3, mentee4]

// just an example of a weight preference list
// this needs to be generated depending on what the admin's preferences are
var weight_list = ["gender", "course_code", "interests"]


// run the algorithm
stable_marriage(mentor_list, mentee_list, weight_list);

// check the output
for (var i in mentor_list){
	console.log(mentor_list[i].to_string(), mentor_list[i].get_pair().to_string());
}