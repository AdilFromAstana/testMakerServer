var fs = require('fs');
var formidable = require('formidable');
var filereader = require('./filereader');
exports.readFilesHandler = async (req, res) => {
    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
        var filecontent = '';
        fs.readFile(files.file.path, (err, data) => {
            let filePath = files.file.path;
            let filename = files.file.name;
            var fileextension = filereader.getFileExtension(filename);
            switch (fileextension) {
                case '.doc' || '.docx':
                    filereader.extract(filePath).then(function (res, err) {
                        if (err) {
                        }
                        filecontent = res;
                    });
                case '.txt' || '.csv':
                    filecontent = data;
                default:
                    filecontent = filename;
            }
            console.log(`This is file content ==> ${filecontent}`);
        });
    });
};
