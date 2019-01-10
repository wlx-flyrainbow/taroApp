import Taro, { Component } from '@tarojs/taro'
import { View, Button, Canvas,Image } from '@tarojs/components'
import { connect } from '@tarojs/redux'

import { add, minus, asyncAdd } from '../../actions/counter'

import './index.scss'

@connect(({ counter }) => ({
  counter
}), (dispatch) => ({
  add () {
    dispatch(add())
  },
  dec () {
    dispatch(minus())
  },
  asyncAdd () {
    dispatch(asyncAdd())
  }
}))

class Index extends Component {

  config = {
    navigationBarTitleText: '首页'
  }
  state = {
    touches: [],
    ctx: null,
    signImage: 'https://camo.githubusercontent.com/3e1b76e514b895760055987f164ce6c95935a3aa/687474703a2f2f73746f726167652e333630627579696d672e636f6d2f6d74642f686f6d652f6c6f676f2d3278313531333833373932363730372e706e67'
  }

  componentWillReceiveProps (nextProps) {
    console.log(this.props, nextProps)
  }

  componentWillMount () { 
    Taro.getSystemInfo({
      success:function(res){
        console.log(res)
      }
    })
    const ctx = wx.createCanvasContext('canvas')
    ctx.setStrokeStyle('#00ff00')
    ctx.setLineWidth(5)
    ctx.setLineCap('round')
    ctx.setLineJoin('round')
    this.setState({
      ctx: ctx
    })

  }

  componentDidMount () {}
  start(event) {
    // console.log("触摸开始", event)
    let point={
      x:event.changedTouches[0].x,
      y:event.changedTouches[0].y,
    }
    var touches = this.state.touches
    touches.push(point)
    this.setState({
      touches
    }, ()=>{
      console.log(this.state.touches)
    })
  }
  move(event) {
    // console.log('move', event)
    let point={
      x:event.touches[0].x,
      y:event.touches[0].y,
    }
    let touches = this.state.touches
    touches.push(point)
    this.setState({
      touches
    })
    this.draw(touches)
    if(touches.length >= 2) {
      this.draw(touches)
    }
  }
  end() {
    // console.log("触摸结束", e)
    //清空轨迹数组
    let touches = this.state.touches
    for (let i = 0 ;i < touches.length;i++ ){
      touches.pop()
    }
    this.setState({
      touches
    })
  }
  draw(touches) {
    // console.log('draw', touches)
    let point1 = touches[0]
    let point2 = touches[1]
    touches.shift()
    this.setState({
      touches
    })
    let ctx = this.state.ctx
    ctx.moveTo(point1.x, point1.y)
    ctx.lineTo(point2.x, point2.y)
    ctx.stroke()
    ctx.draw(true)
    this.setState({
      ctx
    })
  }
  saveImage() {
    const that = this
    wx.canvasToTempFilePath({
      canvasId: 'canvas',
      success: function(res){
        console.log(res.tempFilePath)
        that.setState({
          signImage: res.tempFilePath
        })
      }
    })
  }
  clear() {
    //清除画布
    let ctx = this.state.ctx
    ctx.clearRect(0,0,750,300)
    ctx.draw(true)
    this.setState({
      ctx
    })
  }

  componentDidShow () { }

  componentDidHide () { }

  render () {
    return (
      <View className='index'>
        <Canvas
          className='canvas'
          canvasId='canvas' 
          onTouchMove={this.move}
          onTouchStart={this.start}
          onTouchEnd={this.end}
          onLongTap={this.tap}
          disable-scroll='true'
        />
        <Button type='warn' className='' onClick={this.clear}>清除</Button>
        <Button type='primary' className='' onClick={this.saveImage}>保存图片</Button>
        <Image
          style='width: 300px;height: 100px;background: #fff;'
          src={this.state.signImage}
        />
      </View>
    )
  }
}

export default Index
