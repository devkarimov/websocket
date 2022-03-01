const WebSocketsURL = "wss://wss.tradernet.ru";
const ws = new WebSocket(WebSocketsURL);

const tickersToWatchChanges = ['RSTI', 'GAZP', 'MRKZ', 'RUAL', 'HYDR', 'MRKS', 'SBER', 'FEES', 'TGKA', 'VTBR', 'ANH.US', 'VICL.US', 'BURG.US', 'NBL.US', 'YETI.US', 'WSFS.US', 'NIO.US', 'DXC.US', 'MIC.US', 'HSBC.US', 'EXPN.EU', 'GSK.EU', 'SHP.EU', 'MAN.EU', 'DB1.EU', 'MUV2.EU', 'TATE.EU', 'KGF.EU', 'MGGT.EU', 'SGGD.EU'];

const result = document.getElementById('result');
let list = {};

function updateUI(list) {
  result.innerHTML = '';
  Object.keys(list).forEach(listKey => {
    let item = document.createElement('div');
    
    Object.keys(list[listKey]).forEach((listItemKey, index) => {
      let itemSpan = document.createElement('span');

      itemSpan.innerHTML = list[listKey][listItemKey].data + (listItemKey === 'pcp' ? '%' : '' );
      list[listKey][listItemKey].class && itemSpan.classList.add(list[listKey][listItemKey].class);

      if (index === 0) {
        let div = document.createElement('div');
        
        div.append(itemSpan);

        item.append(div);

        return;
      }

      if (index === 1) {
        item.querySelector('div').append(itemSpan);

        return;
      }

      
      item.append(itemSpan);
    })

    result.appendChild(item);
  });
}

function updateWatcher(data) {
  if (list.hasOwnProperty(data.c)) {
    Object.keys(list[data.c]).forEach(key => {
      if (key === 'chg' || key === 'ltp' || key === 'pcp') {
        if (data[key] && list[data.c][key].data) {
          if (list[data.c][key].data > data[key]) {
            list[data.c][key].class = 'down'
          } else if (list[data.c][key].data < data[key]) {
            list[data.c][key].class = 'up'
          } else {
            list[data.c][key].class = ''
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
      ltp: {
        class: '',
        data: data.ltp
      },
      ltr: {
        class: '',
        data: data.ltr
      },
      name: {
        class: '',
        data: data.name
      },
      chg: {
        class: '',
        data: data.chg
      },
      pcp: {
        class: '',
        data: data.pcp
      }
    }
  }

  updateUI(list)
}

ws.onmessage = function (m) {
  const [event, data] = JSON.parse(m.data);
  if (event === 'q') {
    updateWatcher(data);
  }
};

ws.onopen = function() {
  ws.send(JSON.stringify(['quotes', tickersToWatchChanges]));
}
