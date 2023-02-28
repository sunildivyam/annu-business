# Q-bank
Question Bank Module

## Overview
* Question bank module will have screens to create/update/delete/list questions.
* This Will have Quizes sub modules formed from these questions.
* User will have its own progress and result of the quizes attempted.

## Types of questions

| Question Type | No. of Options | No. of Correct Answers | Description|
|---------------|:--------------:|:----------------------:|------------|
| MCQ           | 5              | 1                      | MCQ-SA     |
| MCQ           | 5              | more than 1            | MCQ-MA     |
| MCQ           | 2              | 1                      | MCQ-TF     |

## Question properties

| Property Name                 | Description                           |
|-------------------------------|---------------------------------------|
| id                            | Unique question Id, auto generated    |
| title                         | Question HTML text                    |
| type                          | Question type (MCQ-SA | MCQ-MA | MCQ-TF) |
| categories                    | one or more categories from Categories, [cat1, cat2, ...] |
| features                      | one or more features, [feature1, feature2, ...] |
| options                       | Array of options, [option1, option2, ...], where option = HTML text |
| Correct Answers               | Array of answers, [{ option: 0, weight: 5 }, ...] , where weight is 1 - 10, if more than 1 one answers, total weight should be between 1 - 10 |
| referedArticleId              | Id of the article that explains the correct answer |
| userId                        | userId of the author                  |
| updated                       | updated time stamp                    |
| created                       | created time stamp                    |
| inReview                      | up for review                         |
| isLive                        | published                             |


## Quiz properties

| Property Name                 | Description                           |
|-------------------------------|---------------------------------------|
| id                            | Unique Quiz Id, auto generated        |
| title                         | Question HTML text                    |
| shortTitle                    | text only title                       |
| categories                    | one or more categories from Categories, [cat1, cat2, ...] |
| features                      | one or more features, [feature1, feature2, ...] |
| questions                     | [q_id1, q_id2, ...] and reference of question, only id  |
| userId                        | userId of the author                  |
| updated                       | updated time stamp                    |
| created                       | created time stamp                    |
| inReview                      | up for review                         |
| isLive                        | published                             |


## Quiz Progress for a user

| Property Name                 | Description                           |
|-------------------------------|---------------------------------------|
| id                            | Unique progress Id, auto generated    |
| userId                        | userId of the subscriber              |
| quizId                        | Id of the quiz in progress/completed  |
| questionsAttempted            | Array of [ {questionId: 1001, attemptedAnswers: [{ans1}, {ans2}, ..] | null }], full list of attempted and non attempted questions from the quiz. This needs to be updated when user submits each each question |
| attemptCount                  | number of attempt for the same quiz by the same user, new attempt is allowed only when previous attempt is 100% completed |
| completed                     | true/false, if completed 100% or in progress |
| score                         | weight gain in %                      |
| passingScrore                 | min weight in %, e.g. 50%             |
| updated                       | updated time stamp                    |
| created                       | created time stamp                    |
