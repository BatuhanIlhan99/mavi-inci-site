var failed = false;

function readFile(path) {
  var stream = new ActiveXObject('ADODB.Stream');
  stream.Type = 2;
  stream.Charset = 'utf-8';
  stream.Open();
  stream.LoadFromFile(path);
  var text = stream.ReadText();
  stream.Close();
  if (text.charCodeAt(0) === 65279) {
    text = text.substr(1);
  }
  return text;
}

for (var i = 0; i < WScript.Arguments.length; i += 1) {
  var file = WScript.Arguments.Item(i);
  try {
    new Function(readFile(file));
    WScript.Echo('OK ' + file);
  } catch (error) {
    failed = true;
    WScript.Echo('ERROR ' + file + ' :: ' + error.message);
  }
}

WScript.Quit(failed ? 1 : 0);
