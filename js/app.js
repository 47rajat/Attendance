/* This is modified version of the code provided by 
Udacity. Here I implemented the sepration of concern using
the MVC architecture
*/
var model = {
    init: function() {
        if (!localStorage.attendance) {
            console.log('Creating attendance records...');
            function getRandom() {
                return (Math.random() >= 0.5);
            }

            var nameColumns = $('tbody .name-col'),
                attendance = {};

            nameColumns.each(function() {
                var name = this.innerText;
                attendance[name] = [];

                for (var i = 0; i <= 11; i++) {
                    attendance[name].push(getRandom());
                }
            });

            localStorage.attendance = JSON.stringify(attendance);
        }
    },
    getAllAttendance: function(){
        return JSON.parse(localStorage.attendance);
    },
    updateAttendance: function(){
        var studentRows = $('tbody .student'),
            newAttendance = {};

        studentRows.each(function() {
            var name = $(this).children('.name-col').text(),
                $allCheckboxes = $(this).children('td').children('input');

            newAttendance[name] = [];

            $allCheckboxes.each(function() {
                newAttendance[name].push($(this).prop('checked'));
            });
        });

        // countMissing();
        localStorage.attendance = JSON.stringify(newAttendance);
    }
};

var controller = {
    init: function(){
        model.init();
        view.init();
    },
    updateModel: function(){
        model.updateAttendance();
    },
    getAttendance : function(){
        return model.getAllAttendance();
    }
}

var view = {
    init: function(){
        this.$allCheckboxes = $('tbody input');
        this.$allMissed = $('tbody .missed-col');
        // When a checkbox is clicked, update localStorage
        this.$allCheckboxes.on('click', function() {
            controller.updateModel();
            view.countMissing();
        });
        view.render();
    },
    render: function(){
        var attendance = controller.getAttendance();

        // Check boxes, based on attendace records
        $.each(attendance, function(name, days) {
            var studentRow = $('tbody .name-col:contains("' + name + '")').parent('tr'),
                dayChecks = $(studentRow).children('.attend-col').children('input');

            dayChecks.each(function(i) {
                $(this).prop('checked', days[i]);
            });
        });

        view.countMissing();
    },
    countMissing: function(){
        this.$allMissed.each(function() {
            var studentRow = $(this).parent('tr'),
                dayChecks = $(studentRow).children('td').children('input'),
                numMissed = 0;

            dayChecks.each(function() {
                if (!$(this).prop('checked')) {
                    numMissed++;
                }
            });

            $(this).text(numMissed);
            if (numMissed == 0){
                $(this).css('background-color', 'rgba(76, 175, 80, 0.23)');
            } else{
                $(this).css('background-color', 'rgba(255, 236, 236, 1)')
            }
        });
    }
}

controller.init();
