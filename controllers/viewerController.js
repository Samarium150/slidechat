app.controller("viewerController", ['$scope', '$http','$stateParams','$sce', function($scope, $http, $stateParams,$timeout,$sce){

$scope.pageN = 1;
 var uid = $stateParams.uid;
    
    
    $scope.pageNUMBER = 1;
    
    getQuestions(uid); //get all questions  
    
  /************* pdf stuff ********************/
  
   loadPdf();
  
  /************** end pdf stuff *******************/
   
    function loadPdf(link){

  $scope.pdfUrl = link;
  $scope.scroll = 0;
  $scope.loading = 'loading';

  $scope.getNavStyle = function(scroll) {
    if(scroll > 100) return 'pdf-controls fixed';
    else return 'pdf-controls';
  }

  $scope.onError = function(error) {
    console.log(error);
  }

  $scope.onLoad = function() {
    $scope.loading = '';
  }

  $scope.onProgress = function(progress) {
    //console.log(progress);
  }
  
  
    }
    
    
    $http.get('ajax/grabInfo.php?id='+$stateParams.uid).success(function(data){
        loadPdf(data[0].filepath);
        $scope.s = data;
        $scope.downloadlink = data[0].filepath;
        $scope.filena =  data[0].filepath.replace(".pdf", "").replace("slides/","");
    
    }).error(function(){
        $scope.error = 1;
    });
    
    
    $scope.postAnswer = function(answer,id){
        
        var data = {
            answer: answer,
            unqiueId: uid,
            id:id
        }
    
        $http.post('ajax/addAnswer.php', data).success(function(response){
            getQuestions(uid); //get all questions  
    
        });
    }
   
    
    function htmlDecode(input){
  var e = document.createElement('div');
  e.innerHTML = input;
  return e.childNodes.length === 0 ? "" : e.childNodes[0].nodeValue;
}
    
    function getQuestions(uid){
    $http.get("ajax/getquestions.php?id="+uid).success(function(response){
        
       /// console.log(response);
    //    console.log(JSON.stringify(response));
        $scope.questions = response.questions;
        $scope.answers = response.answers;
        
     //   console.log($scope.questions.question);
    });

    }
  
    
    $scope.postQuestion = function(){
        
        console.log("im post question method");
        console.log($scope.pname);
        console.log($scope.quest);
        
        var username = "";
        
        if($scope.pname == undefined){
            username = "anonymous";
        }
        else{
            username = $scope.pname;
        }
        
        
        var data = {
            name : username,
            question: $scope.quest,
            tok: uid
        }

    /*    var pageNumberToGoTo = $scope.quest.match('@.')[0].split("@")[1];
        
        console.log($scope.quest.replace($scope.quest.match('@.')[0], "<a> YOLO </a>"));
      console.log($scope.quest.match('@[0-9]*'));

        */
        $http.post("ajax/addquestion.php", data).success(function(response){
            $scope.ci = response;
            getQuestions(uid);
            $scope.pname = "";
            $scope.quest = "";
            
        }).error(function(error){
            console.log("error: "+erorr);
        });
    }
    
$scope.Yolo = function(a){
    $scope.pageNum = a;
    
    console.log($scope.pageNum);
}
    
  $scope.JumpTo = function(pageNumber){
      $scope.pageN = pageNumber;
      console.log($scope.pageNUMBER);
      console.log("A");
      
  }
  
    
    
    
}]);