<template>
  <div class="container ">
    <h1 class="title">会员卡详情</h1>
    <div class="baseMsg">
      <div class="content">
        <div class="item">
          <div class="item-label">类型</div>
          <div class="item-value">{{instructorName}}</div>
        </div>
        <div class="item">
          <div class="item-label">有效期限</div>
          <div class="item-value">私教</div>
        </div>
        <div class="item-price">
          <div class="item-label">会员续费</div>
          <div class="item-value">
            <radio-group class="radio-group" @change="radioChange">
              <label class="radio" v-for="(item, index) in SectionDiscount" :key="index">
                <radio :value="[item.number, item.fee]" />{{item.number}} 节课/ {{item.fee}} 元
              </label>
            </radio-group>
          </div>
        </div>
      </div>
    </div>
    <div class="footer">
      <div class="book pay" >
        <div class="left">合计：<span>{{fee}}&nbsp;元</span></div>
        <div class="right" @click="_payInstructorCourse(openId, number, fee, instructorId, id)" aria-disabled="true">支付</div>
      </div>
    </div>
  </div>
</template>

<script>
import {ERR_OK} from '@/http/config'
import {getInstructorSectionCost} from '@/http/instructors'
import {payInstructorCourse} from '@/http/pay'
export default {
  data () {
    return {
      SectionDiscount: [],
      instructorName: [],
      id: '',
      openId: '',
      instructorId: '',
      number: '',
      fee: ''

    }
  },
  mounted () {
    // 获取openID
    // this.member.openId = this.openId
    // 根据id获取教练课程节数价格
    this._getInstructorSectionCost(this.instructorId)
  },
  onLoad (options) {
    this.id = options.id
    this.openId = options.openId
    this.instructorId = options.instructorId
    console.log('member', this.openId)
  },
  methods: {
    radioChange (e) {
      console.log('radio发生change事件，携带value值为：', e.target.value)
      let selectedData = e.target.value.split(',')
      this.number = selectedData[0]
      this.fee = selectedData[1]
    },
    _getInstructorSectionCost (instructorId) {
      getInstructorSectionCost(instructorId).then((res) => {
        console.log('...', res)
        if (res.data.code === ERR_OK) {
          this.instructorName = res.data.data.name
          let sectionData = res.data.data.SectionDiscount
          let newArray = []
          this.SectionDiscount = sectionData.map(function (item, index) {
            newArray.push(Object.assign({}, {
              number: item.section,
              fee: item.discount
            }))
          })
          this.SectionDiscount = newArray
          console.log('是我', newArray)
        }
      })
    },
    _payInstructorCourse (openId, number, fee, instructorId, id) {
      payInstructorCourse(openId, number, fee, instructorId, id).then((res) => {
        if (res.data.code === ERR_OK) {
          wx.requestPayment({
            timeStamp: res.data.data.timeStamp,
            nonceStr: res.data.data.nonceStr,
            package: res.data.data.package,
            signType: res.data.data.signType,
            paySign: res.data.data.paySign,
            success: function (res) {
              console.log('成功后的', res)
              wx.showToast({
                title: '支付成功',
                success: function () {
                  console.log('准备跳转')
                  wx.switchTab({
                    url: '/pages/user/main'
                  })
                }
              })
            },
            fail: function (res) {
              console.log('失败后的', res)
              // wx.showToast({titlt: '支付失败' + res})
            }
          })
        } else {
          wx.showToast({title: '服务器忙' + res.data.code + res.data.msg})
        }
      })
    }
  }
}
</script>

<style lang="stylus" scoped>
  @import '~common/stylus/variable.styl'
  @import '~common/stylus/mixin.styl'
  

  .container
    background $color-background
    width 100%
    height 100vh
    .title
      font-size $font-size-large-lg
      font-weight 900
      color #000
      padding px2rem(20) px2rem(60)
      background #FFFFFF
      box-shadow 0 px2rem(6) px2rem(26) 0 rgba(0,0,0,0.10)
    .baseMsg
      padding 0 px2rem(60)
      margin-bottom px2rem(20)
      box-sizing content-box
      .content
        .item
          display flex
          justify-content space-between
          align-items center
          height px2rem(60)
          padding px2rem(40) 0
          border-bottom px2rem(2) solid $color-border
          .item-label
            font-size $font-size-medium-x
            color #000
            font-weight 900
          .item-value
            font-size $font-size-medium-x
            color $color-text1
        .item-price
          height px2rem(60)
          padding px2rem(40) 0
          .item-label
            font-size $font-size-medium-x
            color #000
            font-weight 900
          .item-value
            padding px2rem(40) 0
            font-size $font-size-medium-x
            color $color-text1
            .radio-group
              display flex
              flex-direction column
              .radio
                margin px2rem(20) 0
                flex 1

    .footer
      background $color-background-d
      .pay
        display flex
        display -ms-flexbox
        padding 0
        font-size $font-size-medium-x
        box-shadow 0 px2rem(6) px2rem(26) 0 rgba(0,0,0,0.10),
            0 px2rem(6) px2rem(26) 0 rgba(0,0,0,0.10)
        .left, .right
          display flex
          display -ms-flexbox
          -moz-justify-content center
          -ms-justify-content center
          justify-content center
          -ms-flex-align center
          align-items center
          height px2rem(80)
        .left
          -ms-flex 2
          flex 2
          border-top-left-radius px2rem(100)
          border-bottom-left-radius px2rem(100)
          background #fff
          color $color-text1
          font-size $font-size-medium
          span
            color red
            font-weight 900
            font-size $font-size-large
        .right
          -ms-flex 1
          flex 1
  radio
    transform scale(0.8)
</style>