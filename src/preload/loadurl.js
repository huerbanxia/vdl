import { ipcRenderer } from 'electron'

ipcRenderer.on('on-did-finish-load', () => {
  // page-videoList__item
  const app = document.getElementById('app')
  const mutationObserver = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.addedNodes.length > 0) {
        let className = mutation.addedNodes[0].className
        if (className.includes('page-videoList')) {
          console.log(mutation.addedNodes[0])
          // let videoDomList = mutation.addedNodes[0].getElementsByClassName('page-videoList__item')

          let list =
            mutation.addedNodes[0].childNodes[3].childNodes[0].childNodes[0].childNodes[0]
              .childNodes[0].childNodes

          console.log(list)

          list.forEach((item) => {
            console.log(item)
          })

          // for (let i = 0; i < videoDomList.length; i++) {
          //   let videoDom = videoDomList.item(i)
          //   console.log(videoDom)
          // }
        }
      }
    })
    // console.log(document.querySelector('.page-videoList'))
  })
  // mutationObserver.observe(app)
  // 开始侦听页面的根 HTML 元素中的更改。
  mutationObserver.observe(app, {
    attributes: false,
    characterData: false,
    childList: true,
    subtree: false,
    attributeOldValue: false,
    characterDataOldValue: false
  })
})
