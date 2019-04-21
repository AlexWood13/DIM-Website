(function(){

    //assign html to work with angular
    var app = angular.module('myQuiz',[]);

    //Controller for application
    app.controller('QuizController',['$scope','$http','$sce',function($scope,$http,$sce){

      //scope transfers data
      $scope.score = 0;
      $scope.activeQuestion = -1;
      $scope.activeQuestionAnswered = 0;
      $scope.percentage = 0;

      //accessing http service to get the json file (quiz data will equal the quizdata from json file)
      $http.get('quiz_data.json').then(function(quizData){
        //Data retrieved will be stored in myQuestions
        $scope.myQuestions = quizData.data;
        //myQuestions is an array which will give a number for all the questions
        $scope.totalQuestions = $scope.myQuestions.length;
      });

      //checks the answer is correct
      $scope.selectAnswer = function(qIndex,aIndex) {

        //setting the variable to the index of the answer that was picked
        var questionState = $scope.myQuestions[qIndex].questionState;

        if(questionState != 'answered'){
          $scope.myQuestions[qIndex].selectedAnswer = aIndex;
          var correctAnswer =  $scope.myQuestions[qIndex].correct;
           $scope.myQuestions[qIndex].correctAnswer = correctAnswer;

          //adding a point to the score if the answer is correct
          if(aIndex === correctAnswer){
              $scope.myQuestions[qIndex].correctness = 'correct';
              $scope.score += 1;
          }else {
            //setting the answer to incorrect
              $scope.myQuestions[qIndex].correctness = 'incorrect';
          }
          //stops someone pressing every answer
          $scope.myQuestions[qIndex].questionState = 'answered';
        }
        //calculating the score for the results
        $scope.percentage = ($scope.score / $scope.totalQuestions)*100;

      }

      //returns true if the selected answer = the index number
      $scope.isSelected = function(qIndex,aIndex) {
        return $scope.myQuestions[qIndex].selectedAnswer === aIndex;
      }
      $scope.isCorrect = function(qIndex,aIndex) {
        return $scope.myQuestions[qIndex].correctAnswer === aIndex;
      }

      //function for the continue button by incrementing activeQuestion by 1
      $scope.selectContinue = function(){
        return $scope.activeQuestion += 1;
      }

      //creating the share button function
      $scope.createShareLinks = function (percentage) {

					//url variable
          var url = 'http://ajempire.co.uk';

					//email share
          var emailLink = '<a class="btn email" href="mailto:?subject=Try to beat my quiz score!&amp;body=I scored '+percentage+'% on this quiz about Saturn. Try to beat my score at '+url+'">Email a friend</a>';

					//twitter share
					var twitterLink = '<a target="blank" class="btn twitter" href="http://twitter.com/share?text=I scored a '+percentage+'%25 on this quiz about Saturn. Try to beat my score at&amp;hashtags=SaturnQuiz&amp;url='+url+'">Tweet your score</a>';

          var newMarkup = emailLink + twitterLink;

          return $sce.trustAsHtml(newMarkup);
      }



    }]);
})();
