const ROLES = {
    GUEST: 'GUEST',
    ENGINEER: 'ENGINEER',
    ADMIN: 'ADMIN'
};

let user = {
    id: '',
    role: ROLES.GUEST,
};

let currentDate = null;



var points = [

    {
        label: 'Измерение 1',
        values: [
            ['grate0-1', 0.40],
            ['grate0-2', 0.13],
            ['grate0-3', 0.32],
            ['grate0-4', 0.14],

            ['grate1-1', 0.01],
            ['grate1-2', 0.00],

            ['grate11-1', 0.2],
            ['grate11-2', 0.19],
            ['grate11-3', 0.11],
            ['grate11-4', 0.39],

            ['grate12-1', 0.06],
            ['grate12-2', 0.23],

            ['grate4-1', 0.30],
            ['grate4-2', 0.24],
            ['grate4-3', 0.01],
            ['grate4-4', 0.29],

            ['grate8-1', 0.19],
            ['grate8-2', 0.19],
            ['grate8-3', 0.19],
            ['grate8-4', 0.22],

        ]
    },
    {
        label: 'Измерение 2',
        values: [
            ['grate0-1', 0.13],
            ['grate0-2', 0.13],
            ['grate0-3', 0.31],
            ['grate0-4', 0.14],

            ['grate1-1', 0.24],
            ['grate1-2', 0.06],

            ['grate11-1', 0.00],
            ['grate11-2', 0.19],
            ['grate11-3', 0.11],
            ['grate11-4', 0.39],

            ['grate12-1', 0.9],
            ['grate12-2', 0.43],

            ['grate4-1', 0.30],
            ['grate4-2', 0.24],
            ['grate4-3', 0.01],
            ['grate4-4', 0.29],

            ['grate8-1', 0.19],
            ['grate8-2', 0.19],
            ['grate8-3', 0.19],
            ['grate8-4', 0.06],

        ]
    },
    {
        label: 'Измерение 3',
        values: [
            ['grate0-1', 0.55],
            ['grate0-2', 0.79],
            ['grate0-3', 0.40],
            ['grate0-4', 0.53],

            ['grate1-1', 0.36],
            ['grate1-2', 0.04],

            ['grate11-1', 0.01],
            ['grate11-2', 0.36],
            ['grate11-3', 0.36],
            ['grate11-4', 0.59],

            ['grate12-1', 0.91],
            ['grate12-2', 0.16],

            ['grate4-1', 0.87],
            ['grate4-2', 0.79],
            ['grate4-3', 0.22],
            ['grate4-4', 0.76],

            ['grate8-1', 0.79],
            ['grate8-2', 0.67],
            ['grate8-3', 0.79],
            ['grate8-4', 0.94],

        ]

    },

];

$(document).ready(function(){
   var options =  [];
   for(var i = 0; i < points.length; i++){
       options.push(points[i].label);
   }

   $('#select-date').html('');
   for(var i = 0; i<options.length; i++){
       $('#select-date').append('<option value="'+options[i]+'">'+options[i]+'</option>');
   }


});




var startReactorTime = localStorage.startReactorTime;

// Main data
$.get('http://95.181.226.169:8000/api/', function(data){
    console.log(data);
}).fail(function(error) {
    user.role = ROLES.GUEST;
});


// Just after start
$(document).ready(function(){
    $('.main-view').addClass('hidden');
    $('.main-view').removeClass('shown');

    $('#logout-block').addClass('hidden');
    $('#logout-block').removeClass('shown');

    if(1 || user.role === ROLES.ENGINEER || user.role === ROLES.ADMIN ){
        $('#reactor-page').addClass('shown');
        $('#logout-block').addClass('shown');
        changeDate();
        drawGraph();
    } else {
        $('#login-page').addClass('shown');
    }
});


const FRAME = 10;
const FETCH_INTERVAL = 2 * 1000;


let step = 0;
let chart;
let currentSensor = 0;



function changeSensor(){
    var selectedDate = $('#select-sensor :selected').val();
    $('#current-sensor').html(selectedDate + ' датчика');

    data = [{
        key: 'Датчик 1',
        values: [
            [Date.now() - 86400*10, 560 + Math.random() * 6 - 3],
            [Date.now() - 86400*8, 560 + Math.random() * 6 - 3],
            [Date.now() - 86400*7, 560 + Math.random() * 6 - 3],
            [Date.now() - 86400*5, 560 + Math.random() * 6 - 3],
            [Date.now() - 86400*4, 560 + Math.random() * 6 - 3],
            [Date.now() - 86400*3, 560 + Math.random() * 6 - 3],
            [Date.now() - 86400*2, 560 + Math.random() * 6 - 3],
            [Date.now() - 86400*2-7200, 560 + Math.random() * 6 - 3],
            [Date.now() - 86400*2-3600, 560 + Math.random() * 6 - 3],

        ],
    }
    ];

    fetchData()

}

function changeDate(){

    var selectedDate = $('#select-date :selected').val();
    currentDate = selectedDate;

    for(var i = 0; i<points.length; i++){
        if(points[i].label === currentDate){

            for(var j = 0; j<points[i].values.length; j++){

                var percent = Math.round(points[i].values[j][1] * 100)
                var id = '#'+points[i].values[j][0];
                $(id).html(percent + '%');
                $(id).removeClass('red green yellow');

                if(percent < 40){
                    $(id).addClass('green');
                } else if(percent < 90){
                    $(id).addClass('yellow');
                } else {
                    $(id).addClass('red');
                }

            }

            break;
        }
    }
}


var setTimeoutFetch = null;
function fetchData(){

    // Update data
    var newData = [Date.now(), 560 + Math.random() * 8 - 4];
    data[0].values.push(newData);   // Push data to our array

    // Update graph
    d3.select('#chart svg')
        .datum(data);
    chart.update();

    // Move the frame
    data[0].values = data[0].values.slice(1);



    // Call again
    clearTimeout(setTimeoutFetch);
    setTimeoutFetch = setTimeout(function(){
        fetchData();
    }, FETCH_INTERVAL);
}


var data = [{
        key: 'Датчик 1',
        values: [
            [Date.now() - 86400*10, 560 + Math.random() * 6 - 3],
                [Date.now() - 86400*8, 560 + Math.random() * 6 - 3],
                [Date.now() - 86400*7, 560 + Math.random() * 6 - 3],
                [Date.now() - 86400*5, 560 + Math.random() * 6 - 3],
                [Date.now() - 86400*4, 560 + Math.random() * 6 - 3],
                [Date.now() - 86400*3, 560 + Math.random() * 6 - 3],
                [Date.now() - 86400*2, 560 + Math.random() * 6 - 3],
                [Date.now() - 86400*2-7200, 560 + Math.random() * 6 - 3],
                [Date.now() - 86400*2-3600, 560 + Math.random() * 6 - 3],

        ],
    }
];

function drawGraph() {
    nv.addGraph(function () {
            chart = nv.models.linePlusBarChart()
                .margin({top: 30, right: 60, bottom: 50, left: 70})
                //We can set x data accessor to use index. Reason? So the bars all appear evenly spaced.
                .x(function (d, i) {
                    return i
                })
                .y(function (d, i) {
                    return d[1]
                }).showLegend(false);

            chart.xAxis.tickFormat(function (d) {
                var dx = data[0].values[d] && data[0].values[d][0] || 0;
                return d3.time.format('%I:%M')(new Date(dx))
            });

            chart.y1Axis
                .tickFormat(d3.format(',f'));

            chart.y2Axis
                .tickFormat(function (d) {
                    return d3.format(',f')(d) + '°'
                });

            chart.bars.forceY([0]);

            d3.select('#chart svg')
                .datum(data)
                .transition()
                .duration(0)
                .call(chart);

            chart.update();

            // Check new data
            fetchData();

            nv.utils.windowResize(chart.update);
            return chart;
        }
    );
}

