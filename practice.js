let WebSocketsURL = "wss://wss.tradernet.ru";
let ws = new WebSocket(WebSocketsURL);
const tickersToWatchChanges = ['RSTI', 'GAZP', 'MRKZ', 'RUAL', 'HYDR', 'MRKS', 'SBER', 'FEES', 'TGKA', 'VTBR', 'ANH.US', 'VICL.US', 'BURG.US', 'NBL.US', 'YETI.US', 'WSFS.US', 'NIO.US', 'DXC.US', 'MIC.US', 'HSBC.US', 'EXPN.EU', 'GSK.EU', 'SHP.EU', 'MAN.EU', 'DB1.EU', 'MUV2.EU', 'TATE.EU', 'KGF.EU', 'MGGT.EU', 'SGGD.EU'];
// const tickersToWatchChanges = ['EXPN.EU'];

const result = document.getElementById('result');
let list = {};

/**
 * @param QuoteInfoAnswer[] data
 */

function updateUI(list) {
  result.innerHTML = '';
  Object.keys(list).forEach(listKey => {
    let item = document.createElement('div');
    
    Object.keys(list[listKey]).forEach(listItemKey => {
      let itemSpan = document.createElement('span');
      itemSpan.innerHTML = list[listKey][listItemKey].data;
      list[listKey][listItemKey].class && itemSpan.classList.add(list[listKey][listItemKey].class);
      item.append(itemSpan);
    })

    result.appendChild(item);
  });
}

function updateWatcher(data) {
  console.log(data.c)
  if (list.hasOwnProperty(data.c)) {
    console.log(data.c)
    Object.keys(list[data.c]).forEach(key => {
      if (key === 'chg' || key === 'ltp' || key === 'pcp' || key === 'ltt') {
        if (data[key] && list[data.c][key].data) {
          if (list[data.c][key].data > data[key]) {
            list[data.c][key].class = 'down'
          } else if (list[data.c][key].data < data[key]) {
            list[data.c][key].class = 'up'
          } else {
            list[data.c][key].class === ''
          }

          list[data.c][key].data = data[key]
        }
      }

    })
  } else {
    list[data.c] = {
      c: {
        class: '',
        data: data.c
      },
      pcp: {
        class: '',
        data: data.pcp
      },
      ltr: {
        class: '',
        data: data.ltr
      },
      name: {
        class: '',
        data: data.name
      },
      ltp: {
        class: '',
        data: data.ltp
      },
      chg: {
        class: '',
        data: data.chg
      },
      ltt: {
        class: '',
        data: data.ltt
      }
    }
  }

  updateUI(list)
}

ws.onmessage = function (m) {
  console.log('asdasdasdadsad')
  const [event, data] = JSON.parse(m.data);
  if (event === 'q') {
    updateWatcher(data);
  }
};
ws.onopen = function() {
  ws.send(JSON.stringify(['quotes', tickersToWatchChanges, {
    "type": "stocks",
    "exchange": "russia",
    "gainers": 0,
    "limit": 30
  }]));
}
