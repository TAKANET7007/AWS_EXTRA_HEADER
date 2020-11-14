window.onload = function() {
  chrome.storage.sync.get(null, function(value) {
    var allKeys = Object.keys(value);
    allKeys.forEach(function(val, index, ar) {
      var htmlString = `
      <div id="optionSets` + val + `">
        <tr>
          <td><svg width="50" height="50" data-jdenticon-value="` + value[val].awsid + value[val].awsuser + `"></svg></td>
          <td><div id="awsid` + val + `">` + value[val].awsid + `</div></td>
          <td><div id="awsuser` + val + `">` + value[val].awsuser + `</div></td>
          <td><input id="bgColor` + val + `" type="text" value="` + value[val].bgColor + `"></td>
          <td><input id="fontColor` + val + `" type="text" value="` + value[val].fontColor + `"></td>
          <td><input id="memo` + val + `" type="text" value="` + value[val].memo + `"></td>
          <td><div class="close" id="delete` + val + `"></div></td>
        </tr>
      </div>`
      var table = document.getElementById('optionTable');
      table.insertAdjacentHTML('beforeend', htmlString);
      document.getElementById("delete" + val).addEventListener('click', deleteClick);
    });
    jdenticon();
  });
  document.getElementById('save').addEventListener('click', saveClick);
}

function saveClick() {
  var dataObj = {};
  chrome.storage.sync.clear();
  for (let i = 0; i < 1000; i++) {
    var table = document.getElementById('optionSets' + i);
    if (table != null) {
      var data = {
        "awsid": document.getElementById('awsid' + i).innerHTML,
        "awsuser": document.getElementById('awsuser' + i).innerHTML,
        "bgColor": document.getElementById('bgColor' + i).value,
        "fontColor": document.getElementById('fontColor' + i).value,
        "memo": document.getElementById('memo' + i).value
      }
      dataObj[i] = data;
    }
  }
  chrome.storage.sync.set(dataObj, function() {
    if (chrome.runtime.error) {
      alert('Save Failed');
    } else {
      alert('Saved!');
    }
  });
}

function deleteClick(elem) {
  console.log(elem);
  console.log(elem.srcElement.parentNode.parentNode);

  elem.srcElement.parentNode.parentNode.parentNode.remove();
}
