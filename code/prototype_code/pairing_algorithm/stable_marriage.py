import time
from random import randint

class Participant:

	def __init__(self, gender, course_code, student_id, interests):
		self.gender = gender
		self.course_code = course_code
		self.student_id = student_id
		self.interests = interests
		self.preferences = []
		self.pair = None

	def get_gender(self):
		return self.gender

	def get_course_code(self):
		return self.course_code

	def get_student_id(self):
		return self.student_id

	def get_interests(self):
		return self.interests

	def get_pair(self):
		return self.pair

	def set_pair(self, partner):
		self.pair = partner

	def is_free(self):
		return not bool(self.pair)

	def add_preference(self, participant):
		self.preferences.append(participant)

	def sort_preferences(self):
		self.preferences.sort(key=lambda x: x[1], reverse=True)
		#unpacks tuples
		for i, participant in enumerate(self.preferences):
			self.preferences[i] = participant[0]



	def calc_pair_score(self, participant, gender_score, course_code_score, interest_score):
		pairing_score = 0

		if self.gender == participant.get_gender():
			pairing_score += gender_score

		if self.course_code == participant.get_course_code():
			pairing_score += course_code_score

		for interest in self.interests:
			if interest in participant.get_interests():
				pairing_score += interest_score

		return pairing_score


	# def set_preferences(self, participant_list, gender_weight, course_code_weight, interest_weight):
	# 	gender_score = 1.5 * gender_weight
	# 	course_code_score = 1.5 * course_code_weight
	# 	interest_score = 1 * interest_weight

	# 	for participant in participant_list:
	# 		pairing = self.calc_pair_score(participant, gender_score, course_code_score, interest_score)
	# 		self.preferences.append(pairing)

	# 	#sort preferences list
	# 	self.preferences.sort(key=lambda x: x[1], reverse=True)

	# 	#unpack preference tuples
	# 	for i, participant in enumerate(self.preferences):
	# 		self.preferences[i] = participant[0]



class Mentor(Participant):

	def __init__(self, gender, course_code, student_id, interests):
		Participant.__init__(self, gender, course_code, student_id, interests)
		self.proposals = []

	def __str__(self):
		return f"Mentor: {self.student_id}"

	def get_preferences(self):
		return self.preferences

	def add_proposal(self, mentee):
		self.proposals.append(mentee)

	def get_proposals(self):
		return self.proposals


class Mentee(Participant):

	def __init__(self, gender, course_code, student_id, interests):
		Participant.__init__(self, gender, course_code, student_id, interests)

	def __str__(self):
		return f"Mentee: {self.student_id}"

	def pop_preference(self):
		return self.preferences.pop(0)


def free_mentee(mentee_list):
	for mentee in mentee_list:
		if mentee.is_free():
			return True
	return False



def set_preferences(mentor_list, mentee_list, gender_weight, course_code_weight, interest_weight):
	gender_score = 1.5 * gender_weight
	course_code_score = 1.5 * course_code_weight
	interest_score = 1 * interest_weight

	#generate all preferences
	for mentor in mentor_list:
		for mentee in mentee_list:
			pairing_score = mentor.calc_pair_score(mentee, gender_score, course_code_score, interest_score)

			mentor.add_preference((mentee, pairing_score))
			mentee.add_preference((mentor, pairing_score))

	#sort preferences
	for mentor in mentor_list:
		mentor.sort_preferences()

	for mentee in mentee_list:
		mentee.sort_preferences()


#ACTUAL STABLE MARRIAGE ALGORITHM
def stable_marriage(mentor_list, mentee_list):
	
	set_preferences(mentor_list, mentee_list, 1, 1, 1)

	while free_mentee(mentee_list):
		for mentee in mentee_list:
			if mentee.is_free():
				preferred_mentor = mentee.pop_preference()
				preferred_mentor.add_proposal(mentee)

		# for each mentor, you're looking to see if any of the proposals in the proposal list are better than what you currently have
		# basically, if they're higher up on your preference list then they're better than what you currently have
		for mentor in mentor_list:
			proposals = mentor.get_proposals()
			preferences = mentor.get_preferences()
			if mentor.is_free():
				# if the mentor doesn't have a pair, then all mentees in their proposal list are better than what they have
				# so set preferred_index to their worst case
				preferred_index = len(preferences)-1
			else:
				# if the mentor does have a pair, then preferred_index starts at their current pair
				preferred_index = preferences.index(mentor.get_pair())
				mentor.get_pair().set_pair(None)

			for proposal in proposals:
				if preferences.index(proposal) < preferred_index:
					preferred_index = preferences.index(proposal)

			mentor.set_pair(preferences[preferred_index])
			preferences[preferred_index].set_pair(mentor)


def main():
	# mentor1 = Mentor("male", "CASE", 1, ["sailing", "skiing", "gaming"])
	# # mentor1 = Mentor("other", "nothing", 1, ["boo", "boo", "boo"])
	# mentor2 = Mentor("other", "nothing", 2, ["boo", "boo", "boo"])
	# # mentor2 = Mentor("female", "POPD", 2, ["eating", "skiing", "shoes"])
	# mentor3 = Mentor("male", "CASE", 3, ["football", "programming", "pints"])
	# mentor4 = Mentor("male", "CASE", 4, ["tennis", "basketball", "pints"])

	# mentor_list = [mentor1, mentor2, mentor3, mentor4]

	# # mentee1 = Mentee("male", "CASE", 1, ["sailing", "skiing", "gaming"])
	# mentee1 = Mentee("helicopter", "JOV", 1, ["weird", "things", "here"])
	# # mentee2 = Mentee("female", "POPD", 2, ["eating", "skiing", "shoes"])
	# mentee2 = Mentee("female", "CASE", 2, ["eating", "skiing", "gaming"])
	# mentee3 = Mentee("male", "CASE", 3, ["football", "programming", "pints"])
	# mentee4 = Mentee("male", "CASE", 4, ["tennis", "basketball", "pints"])

	# mentee_list = [mentee1, mentee2, mentee3, mentee4]

	# # RUN THE ALGORITHM
	# start = time.time()

	# stable_marriage(mentor_list, mentee_list)

	# end = time.time()
	# print(end - start)

	# # PRINT ALL MENTOR PAIRS TO SEE IF THE ALGORITHM WORKED
	# for mentor in mentor_list:
	# 	print(mentor, mentor.get_pair())

	genders = ["male", "female", "other"]
	course_codes = ["CASE", "POPD", "JOV", "EC", "FISH", "JON"]
	interests = ["sailing", "skiing", "gaming", "boo", "eating", "shoes", "tennis", "basketball", "pints", "football", "programming"]

	mentor_list = [Mentor(genders[randint(0,2)], course_codes[randint(0,5)], i, [interests[randint(0,10)] for j in range(3)]) for i in range(1,25)]

	mentee_list = [Mentee(genders[randint(0,2)], course_codes[randint(0,5)], i, [interests[randint(0,10)] for j in range(3)]) for i in range(1,25)]

	start = time.time()

	stable_marriage(mentor_list, mentee_list)

	end = time.time()

	print(end - start)



if __name__ == '__main__':
	main()