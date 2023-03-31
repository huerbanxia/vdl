import { ipcRenderer } from 'electron'

ipcRenderer.on('on-did-finish-load', (event, id) => {
  console.log('开始解析下载链接')
  const downloadDom = document.querySelectorAll('.dropdown__content')[2]
  console.log(downloadDom)
  let liList = downloadDom.childNodes[0].childNodes
  const data = { id: id, list: [] }
  liList.forEach((item) => {
    let aDom = item.firstChild
    let info = {
      id: id,
      downloadUrl: aDom.href,
      type: aDom.innerText
    }
    data.list.push(info)
  })
  console.log('解析到数据 ' + data.list.length + ' 条')
  event.sender.send('on-return-info-list', data)
  // const mutationObserver = new MutationObserver((mutations) => {
  //   mutations.forEach((mutation) => {
  //     console.log(mutation)
  //   })
  //   // console.log(document.querySelector('.page-videoList'))
  // })
  // // mutationObserver.observe(app)
  // // 开始侦听页面的根 HTML 元素中的更改。
  // mutationObserver.observe(downloadDom, {
  //   attributes: false,
  //   characterData: false,
  //   childList: true,
  //   subtree: false,
  //   attributeOldValue: false,
  //   characterDataOldValue: false
  // })
})
