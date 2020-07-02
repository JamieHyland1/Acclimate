import unittest

class Mentor(object):

	def __init__(self, gender, course_code, student_id, interests):
		self.gender = gender
		self.course_code = course_code
		self.student_id = student_id
		self.interests = interests

	def __str__(self):
		return f"Mentor: {self.student_id}"

	def get_gender(self):
		return self.gender

	def get_course_code(self):
		return self.course_code

	def get_student_id(self):
		return self.student_id

	def get_interests(self):
		return self.interests


	def mentorPairing(self, mentee_list, gender_weight, course_code_weight, interest_weight):
		gender_score = 1.5 * gender_weight
		course_code_score = 1.5 * course_code_weight
		interest_score = 1 * interest_weight
		best_pairing_score = -1
		best_mentee = mentee_list[0]

		for mentee in mentee_list:
			current_pairing_score = 0
			if self.gender == mentee.get_gender():
				current_pairing_score += gender_score

			if self.course_code == mentee.get_course_code():
				current_pairing_score += course_code_score

			for interest in self.interests:
				if interest in mentee.get_interests():
					current_pairing_score += interest_score

			if current_pairing_score > best_pairing_score:
				best_pairing_score = current_pairing_score
				best_mentee = mentee

		return (best_pairing_score, best_mentee)


class Mentee(object):

	def __init__(self, gender, course_code, student_id, interests):
		self.gender = gender
		self.course_code = course_code
		self.student_id = student_id
		self.interests = interests

	def __str__(self):
		return f"Mentee: {self.student_id}"

	def get_gender(self):
		return self.gender

	def get_course_code(self):
		return self.course_code

	def get_student_id(self):
		return self.student_id

	def get_interests(self):
		return self.interests

	def menteePairing(self, mentor_list, gender_weight, course_code_weight, interest_weight):
		gender_score = 1.5 * gender_weight
		course_code_score = 1.5 * course_code_weight
		interest_score = 1 * interest_weight
		best_pairing_score = -1
		best_mentor = mentor_list[0]

		for mentor in mentor_list:
			current_pairing_score = 0
			if self.gender == mentor.get_gender():
				current_pairing_score += gender_score

			if self.course_code == mentor.get_course_code():
				current_pairing_score += course_code_score

			for interest in self.interests:
				if interest in mentor.get_interests():
					current_pairing_score += interest_score

			if current_pairing_score > best_pairing_score:
				best_pairing_score = current_pairing_score
				best_mentor = mentor

		return (best_pairing_score, best_mentor)


def get_pairs(mentorList, menteeList, gender_weight, course_code_weight, interest_weight):
	pairs = []

	while mentorList and menteeList:
		mentor = mentorList[0]
		mentorPairing = mentor.mentorPairing(menteeList, gender_weight, course_code_weight, interest_weight)
		menteePairing = mentorPairing[1].menteePairing(mentorList, gender_weight, course_code_weight, interest_weight)
		if mentorPairing[0] > menteePairing[0]:
			pairing = (mentor, mentorPairing[1])
		else:
			pairing = (menteePairing[1], mentorPairing[1])

		pairs.append(pairing)
		mentorList.remove(pairing[0])
		menteeList.remove(pairing[1])

	return pairs


def main():
	mentor1 = Mentor("other", "nothing", 1, ["boo", "boo", "boo"])
	mentor2 = Mentor("female", "POPD", 2, ["eating", "skiing", "shoes"])
	mentor3 = Mentor("male", "CASE", 3, ["football", "programming", "pints"])
	mentor4 = Mentor("male", "CASE", 4, ["tennis", "basketball", "pints"])

	mentorList = [mentor1, mentor2, mentor3, mentor4]

	for mentor in mentorList:
		print(mentor)


	print("\n")

	mentee1 = Mentee("male", "CASE", 1, ["sailing", "skiing", "gaming"])
	mentee2 = Mentee("female", "POPD", 2, ["eating", "skiing", "shoes"])
	mentee3 = Mentee("male", "CASE", 3, ["football", "programming", "pints"])
	mentee4 = Mentee("male", "CASE", 4, ["tennis", "basketball", "pints"])

	menteeList = [mentee1, mentee2, mentee3, mentee4]

	for mentee in menteeList:
		print(mentee)


	pairs = get_pairs(mentorList, menteeList, 0.1, 1, 10)

	for pair in pairs:
		print(pair[0], pair[1])

"""
genders: male, female, other
course codes: CASE, POPD, PEPSI, EC
interests: sailing, skiing, gaming, pints, eating, football, tennis, shoes
"""


if __name__ == '__main__':
	main()
