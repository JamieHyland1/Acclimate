var axios = require("axios")
var mentor_course_code = "EC"
var mentor_year_of_study = 2
var mentee_course_code = "EC"

var mentor_url = `https://www101.dcu.ie/timetables/feed.php?prog=${mentor_course_code}&per=${mentor_year_of_study}&week1=21&week2=22&hour=1-20&template=student`
var mentee_url = `https://www101.dcu.ie/timetables/feed.php?prog=${mentee_course_code}&per=1&week1=21&week2=22&hour=1-20&template=student`

function getMentorTimetable() {
	return axios.get(mentor_url)
}

function getMenteeTimetable() {
	return axios.get(mentee_url)
}

function parseTimetable() {
	axios.all([getMentorTimetable(), getMenteeTimetable()])
		.then(axios.spread(function (mentor_timetable, mentee_timetable){


			mentor_timetable = mentor_timetable.data.split("\n")
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
					console.log(meeting_list[0].to_string())
				}

				found_ideal_meeting = true;

				i = i + 1;
			}
		}));
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
