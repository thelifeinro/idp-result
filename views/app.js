var app = angular.module('catsvsdogs', []);
var socket = io.connect({transports:['polling']});

console.log('this is app js');

app.controller('statsCtrl', function($scope){
  var updateScores = function(){
    socket.on('teme', function (json) {
      console.log('Received teme from server js');
      //clearing table to re-add stuff
      tabBody=document.getElementById("tabel");
      tabHead=document.getElementById("table-head");
      tabBody.innerHTML='';
      tabBody.appendChild(tabHead);

       data = JSON.parse(json);
       console.log('Data:' + data);
       //data is an array of homeworks
       for(let i = 0; i<data.length; i++){
          let hw = data[i];
          console.log(hw);
          let nume = hw.nume;
          let grupa = hw.grupa;
          let tema = hw.tema;

          addRow(nume, grupa, tema);

       }
/*       var a = parseInt(data.a || 0);
       var b = parseInt(data.b || 0);

       var percentages = getPercentages(a, b);

       $scope.$apply(function () {
         $scope.aPercent = percentages.a;
         $scope.bPercent = percentages.b;
         $scope.total = a + b;
       });*/
    });
  };

  var init = function(){
    document.body.style.opacity=1;
    updateScores();
  };
  socket.on('message',function(data){
    init();
  });
});

function addRow(nume , grupa, tema)
{
         tabBody=document.getElementById("tabel");
         row=document.createElement("tr");
         cell1 = document.createElement("td");
         cell2 = document.createElement("td");
         cell3 = document.createElement("td");
         textnode1=document.createTextNode(nume);
         textnode2=document.createTextNode(grupa);
         textnode3=document.createTextNode(tema);
         cell1.appendChild(textnode1);
         cell2.appendChild(textnode2);
         cell3.appendChild(textnode3);
         row.appendChild(cell1);
         row.appendChild(cell2);
         row.appendChild(cell3);
         tabBody.appendChild(row);
}

function getPercentages(a, b) {
  var result = {};

  if (a + b > 0) {
    result.a = Math.round(a / (a + b) * 100);
    result.b = 100 - result.a;
  } else {
    result.a = result.b = 50;
  }

  return result;
}