class ClashRawView {

  constructor() {
    this._clashJsonObj = null
    this._clashInsJsonObj = null
  }  

  getRawData(mc_container_id, ms_id, ms_v_id) {
    var _this = this
    return new Promise((resolve, reject) => {
      $.ajax({
        url: '/mc/clash/getRawClashData/' + mc_container_id + '/' + ms_id + '/' + ms_v_id,
        type: 'GET',
        success: (data) => {

          const depressedData = new TextDecoder("utf-8").decode(pako.inflate(data))
          const clashData = JSON.parse(depressedData)
          this._clashInsJsonObj = clashData.clashInsJsonObj
          this._clashJsonObj = clashData.clashJsonObj 
          resolve(true)

        }, error: (error) => {
          reject(null)
        }
      });
    })
  }
}
