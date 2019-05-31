function Device (store) {
  const el = window.document.documentElement || window.document.body
  if (!el) return
  let time
  const navInfo = Identification()

  function update () {
    const size = el.offsetWidth > 640 ? 64 : el.offsetWidth / 10
    window.document.documentElement.style.fontSize = size + 'px'
    store.commit('DEVICE_RESIZE', {
      width: el.offsetWidth > 640 ? 640 : el.offsetWidth,
      height: el.offsetHeight,
      navInfo
    })
  }

  window.addEventListener('resize', function () {
    clearTimeout(time)
    time = setTimeout(update, 300)
  }, false)
  window.addEventListener('pageshow', function (n) {
    if (n.persisted) {
      clearTimeout(time)
      time = setTimeout(update, 300)
    }
  }, false)
  window.document.readyState === 'complete' ? window.document.body.style.fontSize = '12px' : window.addEventListener('DOMContentLoaded', function (e) {
    window.document.body.style.fontSize = '12px'
  }, false)
  update()
}

function Identification () {
  const navInfo = { wx: false, ios: false, android: false }
  const userAgent = navigator.userAgent
  if (userAgent.includes('Android') || userAgent.includes('Linux')) {
    navInfo.android = true
  } else if (userAgent.includes('iPhone') || userAgent.includes('iPad') || userAgent.includes('iPod')) {
    navInfo.ios = true
  }
  if ((userAgent.toLowerCase()).includes('micromessenger')) {
    navInfo.wx = true
  }
  return navInfo
}
export default Device
