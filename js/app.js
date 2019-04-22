var employeeObj = function () {
    return {
        fullName: '',
        role: '',
        startDate: null,
        payRate: 0,
        monthsWorked: function () {
            var dcom = getDateComponents(this.startDate)
            return getTotalMonthsWorked(dcom)
        },
        totalBilled: function () {
            return getTotalBilled(this.startDate,this.payRate)
        },
        dateAdded: null
    }
}
var config = {
    apiKey: "AIzaSyDm_E11k29CUe6qos7aThjYnV4ta08mWc0",
    authDomain: "employeedatamanagement-a2b20.firebaseapp.com",
    databaseURL: "https://employeedatamanagement-a2b20.firebaseio.com",
    projectId: "employeedatamanagement-a2b20",
    storageBucket: "employeedatamanagement-a2b20.appspot.com",
    messagingSenderId: "919538204814"
};
firebase.initializeApp(config)
var employees = []
$(document).ready(function () {
$('.alert').hide()
    
    var database = firebase.database()

   

    $(".submitbttn").on("click", function (event) {
        event.preventDefault();
        $('#errors').empty()
        var employee = getFormData()
        if (employee === false) {
            return false;
        }
        employee.dateAdded = firebase.database.ServerValue.TIMESTAMP
        // Code for handling the push
        database.ref().push({
            empName: employee.fullName,
            role: employee.role,
            startDate: employee.startDate,
            monthlyRate: employee.payRate,
            dateAdded: employee.dateAdded
        });
    });

    database.ref().on("child_added", function (childSnapshot) {

        var snapval = childSnapshot.val();

        console.log(snapval.empName);
        console.log(snapval.role);
        console.log(snapval.monthlyRate);
        console.log(snapval.startDate);
        var employee = new employeeObj()
        employee.fullName = snapval.empName;
        employee.role = snapval.role;
        employee.payRate = snapval.monthlyRate;
        employee.startDate = snapval.startDate;
        employees.push(employee)
        updateTableDisplay(employees)


    }, function (errorObject) {
        console.log("Errors handled: " + errorObject.code);
        $('#errors').text("Errors handled: " + errorObject.code)
    });

})
function updateTableDisplay(_employees) {
    var employeeLength = _employees.length
    //loop thru the employees
    $('#tableBody').empty()
    if (employeeLength > 0) {

        for (let i = 0; i < employeeLength; i++){
        var _employee = _employees[i]
            var row = createRow(_employee)
            $('#tableBody').append(row)
        }
            
    }

}
function getFormData() {
    var employee = new employeeObj()
    employee.fullName = $('#fullName').val().trim()
    employee.role = $('#role').val().trim()
    employee.startDate = $('#startDate').val().trim()
    employee.payRate = $('#payRate').val().trim()
    if(validateInput(employee)){
        return employee
    }
    return false

}
function validateInput(_employeeObj){
    var errors = []
    if(_employeeObj.fullName != ''){
        if(_employeeObj.fullName.split(' ').length < 2){
        errors.push('Full Name enter a first and last name.')
        }
    }else{
        errors.push('Full Name is empty.')
    }
        var checkMoney = /[0-9]+\.*/;
        if(!checkMoney.test(_employeeObj.payRate)){
            errors.push('Please enter only digits (0-9) in the money feild')
        }
        var checkDate = /[0-9]{2}\/[0-9]{2}\/[0-9]{4}/;
        if(!checkDate.test(_employeeObj.startDate)){
            errors.push('Please enter your start date as 01/01/2000')
        }
   
        if(_employeeObj.role == ''){
            errors.push('Please fill in your role.')
        }
        if(errors.length > 0){
            displayErrors(errors)
            return false
        }
        return true
}
function displayErrors(_messages){
    $('#errors').empty()
    if(_messages.length > 0){

    _messages.forEach(
        function(message){
            var p = $('<p>')
            $(p).text(message)
            var dv = $('#errors')
            $(dv).append(p)
        }
    )
    $(".alert").alert();
    $('.alert').show()
    }
}
function validateTime(date) {
    
    return true;



}
function createRow(_employeeObj) {
    var table = $('#employeeTable')
    var row = $('<tr>')
    var cellName = $('<td>')
    cellName.text(_employeeObj.fullName)
    var cellRole = $('<td>')
    cellRole.text(_employeeObj.role)
    var cellStartDate = $('<td>')
    cellStartDate.text(_employeeObj.startDate)
    var cellPayRate = $('<td>')
    cellPayRate.text(_employeeObj.payRate)
    var cellMonthsWored = $('<td>')
    cellMonthsWored.text(_employeeObj.monthsWorked())
    var cellTotalBilled = $('<td>')
    cellTotalBilled.text(_employeeObj.totalBilled())
    row.append(cellName)
        .append(cellRole)
        .append(cellStartDate)
        .append(cellPayRate)
        .append(cellMonthsWored)
        .append(cellTotalBilled)
    
    return row

}
function getTotalBilled(_startDate, _payRate) {

    var dcom = getDateComponents(_startDate) 
    var TotalmonthsWorked = getTotalMonthsWorked(dcom)
    console.log(TotalmonthsWorked)
    return TotalmonthsWorked * _payRate

}
function getTotalMonthsWorked(_dateComponents) {
   return moment().diff(moment([_dateComponents.year, _dateComponents.month, _dateComponents.day]), 'months', true)
}
function getDateComponents(_date) {
    var dateComponents = _date.split("/")
    var year = parseInt(dateComponents[2])
    var day = parseInt(dateComponents[1])
    var month = parseInt(dateComponents[0])
    return {
        day: day,
        year: year,
        month: month
    }
}