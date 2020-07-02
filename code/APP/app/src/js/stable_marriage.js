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

		/*
		return [participant, pairing_score];
		made an object instead to make sorting easier
		in ens6 it's easier to sort an object based on an attribute than to
		sort a list based on the second value of the list
		*/
		return new Pair(participant, pairing_score);
	}

	/*
	this method is called on a Mentor/Mentee and given a list of the opposite group of participants
	it generates a preference list for the participant that the method is called on, based on the list of participants
	that it's given
	*/
	set_preferences(participant_list, gender_weight, course_code_weight, interest_weight){
		// calculates scores based on the weights supplied by the admin
		const gender_score = 1.5 * gender_weight;
		const course_code_score = 1.5 * course_code_weight;
		const interest_score = 1.5 * interest_weight;

		/*
		for every participant in the list, it calculates the pairing score for the current participant.
		effectively you'd end up with something like this (after calling something like this: "mentor1.set_preferences(list_of_mentees, 1, 1, 1)"):
		mentor1 {
			preferences: [Pair {mentee1, 7}, Pair {mentee2, 4}, Pair {mentee3, 5}]
		}
		*/
		for (var i in participant_list) {
			var pairing = this.calc_pair_score(participant_list[i], gender_score, course_code_score, interest_score);
			this.preferences.push(pairing);
		}

		/*
		sorts the entire list of Pair pairings from highest score to lowest
		this gives the preference list for a Mentor/Mentee (whomever this method was invoke on)
		so that the preference list is now their most preferred to their least preferred
		*/
		this.preferences.sort(function(a, b) {
			return b.get_score() - a.get_score();
		})

		//unpacks Pair objects so that the preference list is just a list of participants and not their scores as well
		for (var i in this.preferences){
			this.preferences[i] = this.preferences[i].get_participant();
		}
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


// aaand this is where the magic happens :')
function stable_marriage(mentor_list, mentee_list){
	let proposals
	let preferences
	let preferred_index
	// generates the preference lists for the mentors and the mentees
	for (var i in mentee_list){
		mentee_list[i].set_preferences(mentor_list, 1, 1, 1);
	}

	for (var i in mentor_list){
		mentor_list[i].set_preferences(mentee_list, 1, 1, 1);
	}

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
			// THIS IS WHERE THE BUG IS
			mentor_list[i].set_pair(preferences[preferred_index]);
			preferences[preferred_index].set_pair(mentor_list[i]);
		}
	}
}


export default {Mentor, Mentee, Participant, Pair}
