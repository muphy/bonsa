var util = require('util');
module.exports = {
    setUp: function (callback) {
    	this.json = {  
		   "scheduleId":"C632741228",
		   "programMasterId":"M514013925",
		   "scheduleName":"문화빅뱅 윤건의 더 콘서트",
		   "beginDate":"2015-05-20",
		   "beginTime":"23:40",
		   "endTime":"00:50",
		   "runtime":70,
		   "largeGenreId":"G",
		   "episodeNo":"",
		   "live":false,
		   "rebroadcast":false,
		   "hd":false,
		   "audio":"STEREO",
		   "screenExplain":false,
		   "caption":true,
		   "ageRating":0,
		   "subtitle":"",
		   "signLanguage":false
		};

        callback();
    },
    tearDown: function (callback) {
        // clean up
        callback();
    },
    test1: function (test) {
    	var beginTime = util.format('%sT%s', this.json.beginDate, this.json.beginTime);
		var endTime = util.format('%sT%s', this.json.beginDate, this.json.endTime);
		beginTime = Date.parse(beginTime);
		endTime = Date.parse(endTime);
		if(beginTime > endTime) {
			endTime = endTime + 1000*60*60*24;
		}
		console.log(beginTime);
		console.log(endTime);
		var beginDate = new Date(beginTime);
		var endDate = new Date(endTime);
		console.log(endDate.getDate());
		test.equals(endDate.getDate(),'21','today!!!')
        // test.equals(false,this.json.live, 'live is false');
        test.done();
    }
};