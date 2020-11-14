String.prototype.toRGB = function() {
  var hash = 0;
  if (this.length === 0) return hash;
  for (var i = 0; i < this.length; i++) {
    hash = this.charCodeAt(i) + ((hash << 5) - hash);
    hash = hash & hash;
  }
  var rgb = [0, 0, 0];
  for (var i = 0; i < 3; i++) {
    var value = (hash >> (i * 8)) & 255;
    rgb[i] = value;
  }
  return "rgb(" + rgb[0] + ", " + rgb[1] + ", " + rgb[2] + ")";
}


window.onload = function() {
  chrome.storage.sync.get(null, function(value) {
    var userName = "UserName"
    var account = "Account"

    if (document.cookie != '') {
      var tmp = document.cookie.split('; ');
      for (var i = 0; i < tmp.length; i++) {
        var data = tmp[i].split('=');
        if (data[0] == "aws-userInfo") {
          var parsedData = JSON.parse(decodeURIComponent(data[1]));
          userName = decodeURIComponent(parsedData.username);
          account = parsedData.alias;
          console.log(userName);
          var result = userName.match(/\/.+\//);
          console.log(result);

          if(result != null){
            userName = result[0].slice(1).slice(0,-1);
          }
        }
      }
    }

    var htmlString = `
  <div class="aws_custom_header">
    <div class="aws_custom_header__inner">
      <div id="aws_custom_header__logo" class="aws_custom_header__logo">
        <svg width="50" height="50" data-jdenticon-value="` + account + userName + `"></svg>
      </div>
      <div id="aws_custom_header_navi" class="header__navgroup">
        <div class="aws_custom_header__navitem">` + account + `</div>
        <div class="aws_custom_header__navitem">` + userName + `</div>
      </div>
    </div>
  </div>
  `

    var anyMatch = false;
    var bgColor;
    var fontColor;

    var memo = "";
    var allKeys = Object.keys(value);
    allKeys.forEach(function(val, index, ar) {
      if (account == value[val].awsid && userName == value[val].awsuser) {
        bgColor = value[val].bgColor;
        console.log(bgColor);
        fontColor = value[val].fontColor;
        memo = value[val].memo;
        anyMatch = true;
      }
    });

    if (anyMatch == false) {
      for (let i = 0; i < 10; i++) {
        if (value[i] == null) {
          bgColor = (account + userName).toRGB();
          fontColor = "rgb(ff, ff, ff)";
          var data = {
            "awsid": account,
            "awsuser": userName,
            "bgColor": bgColor,
            "fontColor": fontColor,
            "memo": ""
          }

          value[i] = data;
          chrome.storage.sync.set(value, function() {});
          break;
        }
      }
    }

    var headderElement = document.getElementById('h');
    headderElement.insertAdjacentHTML('afterbegin', htmlString);
    if (memo != "") {
      var aws_custom_header_navi = document.getElementById('aws_custom_header_navi');
      var htmlString = `
          <div class="aws_custom_header__navitem">` + memo + `</div>`
      aws_custom_header_navi.insertAdjacentHTML('beforeend', htmlString);
    }

    document.querySelector('.aws_custom_header').style.backgroundColor = bgColor;
    document.querySelector('.aws_custom_header__navitem').style.color = fontColor;
    jdenticon();
  });
}
