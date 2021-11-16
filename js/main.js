$(document).ready(function () {
    var iscroll;

    for(var page = 1; page <= 4; page++) {
        var img = $('<div>').appendTo('#imgs');
        img.css({
            height: img.width() * 1.414,
            'background-image': 'url("img/' + page + '.jpg")',
            'background-repeat' : 'no-repeat',
            'background-size' : 'cover'
        });
    }

    $('#title-bar ul li a').css({
        'width': $('#title-bar ul').height() * 0.9,
        'height': $('#title-bar ul').height() * 0.9
    });
    $('#title-bar ul li a .fab').css({
        'width': '100%',
        'height': '100%',
        'line-height': $('#title-bar ul').height() - 4 + 'px'
    });

    var isMobile = function(){
        if(navigator.userAgentData) return navigator.userAgentData.mobile;
        else return (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
    }

    iscroll = new IScroll('.iframe-wrap',{
        scrollbars: true,
        zoomMin: 1,
        zoomMax: 4,
        zoom: true,
        scrollX: true,
        scrollY: true,
        mouseWheel: true,
        wheelAction: 'zoom',
        fadeScrollbars: true,
        disablePointer: isMobile(),
        disableTouch: !isMobile()
    });

    var code = ['a', 'b', 'c', 'd', 'e'];
    for(var i = 1; i <= 20; i++) {
        var tr = $('<tr>');
        var td1 = $('<td>')
        $('<strong>').text(i).attr('id','num' + i).appendTo(td1);
        var td2 = $('<td>');
        for (var num = 1; num <= 5; num++) {
            $('<input>').attr({
                type: 'radio',
                name: '_' + i,
                id: '_' + i + code[num - 1],
                value: num
            }).appendTo(td2);
            var label = $('<label>').attr({
                'class': 'bubble',
                'for': '_' + i + code[num - 1]
            });
            $('<div>').addClass('bubble-inner').text(num).appendTo(label)
            label.appendTo(td2);
        }
        td1.appendTo(tr);
        td2.appendTo(tr);
        tr.appendTo('#scantron');
    }
    var sheepWrap;
    $('#sheetBtn').click(function(){
        if(document.getElementById('sheet').style.display == 'none') {
            document.getElementById('sheet').style.display = 'block';
            sheepWrap = new IScroll('#sheet',{
                scrollbars: true,
                fadeScrollbars: true
            });
            iscroll.enabled = false;
            $('#sheetBtn .fab').css('color','rgb(122 209 189)');
        } else {
            document.getElementById('sheet').style.display = 'none';
            sheepWrap.destroy();
            iscroll.enabled = true;
            $('#sheetBtn .fab').css('color','');
        }
    });
    $('#submit').click(function(){
        var data = [];
        var isEmpty = false;
        callbackClass = new CallbackClass();
        for(var test = 1; test <= 20; test++) {
            document.getElementsByName('_' + test).forEach(function (e) {
                if (e.checked) {
                    data[test - 1] = e.value;
                }
                isEmpty = !data[test - 1];
            });
        }
        callbackClass.setValues(data);
        if(!isEmpty || confirm(test + ' 빈 값'))
            query();
    });

    var jsonp = function (url) {
        var script = window.document.createElement('script');
        script.async = true;
        script.src = url;
        script.onerror = function () {
            alert('제출 과정에서 오류가 발생했습니다.')
        };
        var done = false;
        script.onload = script.onreadystatechange = function () {
            if (!done && (!this.readyState || this.readyState === 'loaded' || this.readyState === 'complete')) {
                done = true;
                script.onload = script.onreadystatechange = null;
                if (script.parentNode) {
                    return script.parentNode.removeChild(script);
                }
            }
        };
        window.document.getElementsByTagName('head')[0].appendChild(script);
    };
    var query = function () {

        var myKey = '14BRXHBC9EF9fL8gcD6PZdGsw5GVwBH6m8ELzlaYXfn0';
        var url = 'https://docs.google.com/spreadsheets/d/'+myKey+'/gviz/tq?',
            params = {
                tqx: 'responseHandler:' + 'callbackClass.my_callback'//'my_callback'
            },
            qs = [];
        for (var key in params) {
            qs.push(key + '=' + params[key]);
        }
        url += qs.join('&');
        return jsonp(url); // Call JSONP helper function
    }
});
var callbackClass;
function CallbackClass() {
    var testData = [];
    var parse = function (data) {
        if(!data) {
            alert("서버에 접근할 수 없습니다.");
            return false;
        }
        if(data.status !== 'ok') {
            alert("서버에 접근할 수 없습니다.");
            return false;
        }

        var answers = data.table.rows;
        var score = 0;

        for(var num = 0; num < answers.length; num++) {
            if(testData[num] == answers[num].c[1].v) {
                $('#num' + (num + 1)).css({
                    'border': 'solid red',
                    'border-radius': '50%'
                });
                score += answers[num].c[0].v;
            } else {
                $('#num' + (num + 1)).css({
                    'border': '',
                    'border-radius': ''
                });
            }
        }
        console.log(score);
        alert(score);
        $('#twitter').css('display','block');
    };
    this.setValues = function(data) {
        testData = data;
    };
    this.my_callback = function (data) {
        parse(data); // Call data parser helper function
    };
}
