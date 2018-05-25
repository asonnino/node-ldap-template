/////////////////////////////////////////////////////////////////////////////////////////////////////
// Load Modules
/////////////////////////////////////////////////////////////////////////////////////////////////////
var path       = require('path');
var fileSystem = require('fs');
var os         = require('os');


/////////////////////////////////////////////////////////////////////////////////////////////////////
// Responses
/////////////////////////////////////////////////////////////////////////////////////////////////////
// =================================================================================================
// Send bad request
// =================================================================================================
module.exports.badRequest = function (req, res) {
	res.sendStatus(400);
};
// =================================================================================================
// Send unauthorised
// =================================================================================================
module.exports.unauthorised = function (req, res) {
	res.sendStatus(401);
};
// =================================================================================================
// Send forbidden
// =================================================================================================
module.exports.forbidden = function (req, res) {
	res.sendStatus(403);
};
// =================================================================================================
// Send not found
// =================================================================================================
module.exports.notFound = function (req, res) {
	res.sendStatus(404);
};
// =================================================================================================
// Send i'm a teapot
// =================================================================================================
module.exports.imATeapot = function (req, res) {
	res.sendStatus(418);
};
// =================================================================================================
// Send too many request
// =================================================================================================
module.exports.tooManyRequests = function (req, res) {
	res.sendStatus(429);
};
// =================================================================================================
// Send unavailable for legal reasons
// =================================================================================================
module.exports.unavailableForLegalReasons = function (req, res) {
	res.sendStatus(451);
};
// =================================================================================================
// Send internal server error
// =================================================================================================
module.exports.internalServerError = function (req, res) {
	res.sendStatus(500);
};
// =================================================================================================
// Send service unavailable
// =================================================================================================
module.exports.serviceUnavailable = function (req, res) {
	res.sendStatus(503);
};


/////////////////////////////////////////////////////////////////////////////////////////////////////
// Files server utils
/////////////////////////////////////////////////////////////////////////////////////////////////////
// =================================================================================================
// Download large file
// =================================================================================================
module.exports.download = function (req, res, filepath, type, desiredFilename) {
	if (! fileSystem.existsSync(filepath)) {require('./util').notFound(req, res);}
	else {
		fileSystem.stat(filepath, function(err, stat) {
			if (err) {require('./util').internalServerError(req, res);}
			else {
				// check type
				var contentType = 'application/octet-stream';
				if (type == 'MP4')      {contentType = 'video/mp4';}
				else if (type == 'MP3') {contentType = 'music/mp3';}
				// send file
				res.writeHead(200, {
					'Content-Type' : contentType,
					'Content-Disposition' : 'attachment; filename="' +desiredFilename+ '"',
					'Content-Length' : stat.size
				});
				var stream = fileSystem.createReadStream(filepath);
				stream.pipe(res);
			}
		});		
	}
};
// =================================================================================================
// Stream image
// =================================================================================================
module.exports.streamImage = function (fileURI, req, res) {
	var img;
	try {
		// NOTE : readFileSync auto encode for unix
		var path = decodeURIComponent(fileURI);
		img = fileSystem.readFileSync(path);
		res.writeHead(200, {'Content-Type': 'image/jpg' });
	}
	catch (err) {
		// if cover not found
		if (err.code == 'ENOENT') {
			img = fileSystem.readFileSync(__dirname + '/images/logo/logo_128x128.png');
			res.writeHead(200, {'Content-Type': 'image/png' });
		}
		else {return res.sendStatus(500);}
	}
	// end request
	res.end(img, 'binary');
};
// =================================================================================================
// Stream video
// =================================================================================================
module.exports.streamVideo = function (fileURI, req, res) {
	// get file path
	var file = decodeURIComponent(fileURI);
	// stream
	fileSystem.stat(file, function(err, stats) {
		if (err) {
			if (err.code === 'ENOENT') {
				// 404 Error if file not found
				return res.sendStatus(404);
			}
			res.end(err);
		}
		var range = req.headers.range;
		if (!range) {
			// 416 Wrong range
			return res.sendStatus(416);
		}
		var positions = range.replace(/bytes=/, "").split("-");
		var start = parseInt(positions[0], 10);
		var total = stats.size;
		var end = positions[1] ? parseInt(positions[1], 10) : total - 1;
		var chunksize = (end - start) + 1;

		res.writeHead(206, {
			"Content-Range": "bytes " + start + "-" + end + "/" + total,
			"Accept-Ranges": "bytes",
			"Content-Length": chunksize,
			"Content-Type": "video/mp4"
		});

		var stream = fileSystem.createReadStream(file, { start: start, end: end })
		.on("open", function() {
			stream.pipe(res);
		})
		.on("error", function(err) {
			res.end(err);
		});
	});
};


/////////////////////////////////////////////////////////////////////////////////////////////////////
// Other
/////////////////////////////////////////////////////////////////////////////////////////////////////
// =================================================================================================
// Get all directories inside a src directory
// =================================================================================================
module.exports.getDirectories = function (srcpath) {
	return fileSystem.readdirSync(srcpath)
		.filter(file => fileSystem.statSync(path.join(srcpath, file)).isDirectory());
};

/////////////////////////////////////////////////////////////////////////////////////////////////////
// Status
/////////////////////////////////////////////////////////////////////////////////////////////////////
module.exports.getStatus = function () {
	return {
		cpus     	: os.cpus(),
		arch		: os.arch(),
		freemem		: os.freemem(),
		hostname	: os.hostname(),
		loadavg		: os.loadavg(),
		networkInt	: os.networkInterfaces(),
		platform	: os.platform(),
		release		: os.release(),
		totalmem	: os.totalmem(),
		ostype		: os.type(),
		uptime		: os.uptime()
	};
};




/////////////////////////////////////////////////////////////////////////////////////////////////////