<template>
  <div class="cropper-wrapper">
    <Card class="cropper-card">
      <Row>
        <div class="img-box">
          <img class="cropper-image" :id="imgId" alt="" style="max-width: 100%">
        </div>
        <div class="right-con">
          <Row style="height: 185px;">
            <div class="preview-box preview-lg">
              <div class="img-preview"></div>
            </div>
          </Row>
          <Row style="height: 170px;">
            <div class="preview-box preview-md">
              <div class="img-preview"></div>
            </div>
            <div class="preview-box preview-sm">
              <div class="img-preview"></div>
            </div>
            <div class="preview-box preview-xs">
              <div class="img-preview"></div>
            </div>
          </Row>
          <Row style="margin-top: 33px;display: inline-block;">
            <div style="float: left">
              <Upload action="image/upload" :before-upload="beforeUpload">
                <Button style="width: 150px;" type="primary">{{$t('forms.buttons.upload')}}</Button>
              </Upload>
            </div>
            <div style="float: left;margin-left: 20px;">
              <Button v-show="insideSrc" style="width: 150px;" type="primary" @click="crop">{{ cropButtonText }}
              </Button>
            </div>
          </Row>
        </div>
      </Row>
      <Row v-show="insideSrc" :gutter="16">
        <div class="input-box">
          <Col span="6">
            <Input v-model="X" @on-blur="reSize" @on-enter="reSize">
              <span slot="prepend">X</span>
              <span slot="append">px</span>
            </Input>
          </Col>
          <Col span="6">
            <Input v-model="Y" @on-blur="reSize" @on-enter="reSize">
              <span slot="prepend">Y</span>
              <span slot="append">px</span>
            </Input>
          </Col>
          <Col span="6">
            <Input v-model="width" @on-blur="reSize" @on-enter="reSize">
              <span slot="prepend">{{$t('forms.width')}}</span>
              <span slot="append">px</span>
            </Input>
          </Col>
          <Col span="6">
            <Input v-model="height" @on-blur="reSize" @on-enter="reSize">
              <span slot="prepend">{{$t('forms.height')}}</span>
              <span slot="append">px</span>
            </Input>
          </Col>
        </div>
      </Row>
      <Row v-show="insideSrc">
        <div class="button-box">
          <ButtonGroup shape="circle">
            <Button type="primary" @click="reset">
              <Icon type="md-undo"/>
            </Button>
            <Button type="primary" @click="mode('move')">
              <Icon type="md-move"/>
            </Button>
            <Button type="primary" @click="mode('crop')">
              <Icon type="md-crop"/>
            </Button>
          </ButtonGroup>
          <ButtonGroup shape="circle">
            <Button type="primary" @click="shrink">
              <Icon type="md-remove"/>
            </Button>
            <Button type="primary" @click="magnify">
              <Icon type="md-add"/>
            </Button>
          </ButtonGroup>
          <ButtonGroup shape="circle">
            <Button type="primary" @click="rotate(-1)">
              <Icon type="md-refresh" class="icon-refresh-left"/>
            </Button>
            <Button type="primary" @click="rotate(1)">
              <Icon type="md-refresh"/>
            </Button>
            <Button type="primary" @click="scale('X')">
              <Icon type="md-resize" class="icon-leftAndRight"/>
            </Button>
            <Button type="primary" @click="scale('Y')">
              <Icon type="md-resize" class="icon-upAndDown"/>
            </Button>
          </ButtonGroup>
          <ButtonGroup shape="circle">
            <Button type="primary" @click="move(0, -moveStep)">
              <Icon type="md-arrow-round-up"/>
            </Button>
            <Button type="primary" @click="move(-moveStep, 0)">
              <Icon type="md-arrow-round-back"/>
            </Button>
            <Button type="primary" @click="move(0, moveStep)">
              <Icon type="md-arrow-round-down"/>
            </Button>
            <Button type="primary" @click="move(moveStep, 0)">
              <Icon type="md-arrow-round-forward"/>
            </Button>
          </ButtonGroup>
          <ButtonGroup shape="circle">
            <Button type="primary" @click="aspact(16/9)">16:9</Button>
            <Button type="primary" @click="aspact(4/3)">4:3</Button>
            <Button type="primary" @click="aspact(1)">1:1</Button>
            <Button type="primary" @click="aspact(2/3)">2:3</Button>
            <Button type="primary" @click="aspact(NaN)">{{$t('forms.buttons.free')}}</Button>
          </ButtonGroup>
        </div>
      </Row>
    </Card>
  </div>
</template>

<script>
  import Cropper from 'cropperjs'
  import './index.less'
  import 'cropperjs/dist/cropper.min.css'

  export default {
    name: 'Cropper',
    props: {
      src: {
        type: String,
        default: ''
      },
      moveStep: {
        type: Number,
        default: 1
      },
      cropButtonText: String
    },
    data () {
      return {
        cropper: null,
        insideSrc: '',
        X: '',
        Y: '',
        width: '',
        height: ''
      }
    },
    computed: {
      imgId () {
        return `cropper${this._uid}`
      }
    },
    watch: {
      src (src) {
        this.replace(src)
      },
      insideSrc (src) {
        this.replace(src)
      }
    },
    methods: {
      beforeUpload (file) {
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = (event) => {
          this.insideSrc = event.srcElement.result
        }
        return false
      },
      replace (src) {
        this.cropper.replace(src)
        this.insideSrc = src
      },
      reset () {
        this.cropper.reset()
      },
      mode (value) {
        this.cropper.setDragMode(value)
      },
      rotate (value) {
        if (value > 0) {
          this.cropper.rotate(90)
        } else {
          this.cropper.rotate(-90)
        }
      },
      shrink () {
        this.cropper.zoom(-0.1)
      },
      magnify () {
        this.cropper.zoom(0.1)
      },
      scale (d) {
        this.cropper[`scale${d}`](-this.cropper.getData()[`scale${d}`])
      },
      move (...argu) {
        this.cropper.move(...argu)
      },
      aspact (value) {
        this.cropper.setAspectRatio(value)
      },
      reSize () {
        const data = this.cropper.getData()
        const x = Number(this.X && this.X !== '' ? this.X : data.x)
        const y = Number(this.Y && this.Y !== '' ? this.Y : data.y)
        const width = Number(this.width && this.width !== '' ? this.width : data.width)
        const height = Number(this.height && this.height !== '' ? this.height : data.height)
        this.cropper.setData({
          x: x,
          y: y,
          width: width,
          height: height
        })
      },
      crop () {
        this.$emit('on-crop', this.cropper.getCroppedCanvas().toDataURL())
      }
    },
    mounted () {
      const obj = this
      this.$nextTick(() => {
        let dom = document.getElementById(this.imgId)
        this.cropper = new Cropper(dom, {
          preview: '.img-preview',
          checkCrossOrigin: true,
          crop: function (data) {
            obj.X = data.detail.x.toFixed(0)
            obj.Y = data.detail.y.toFixed(0)
            obj.width = data.detail.width.toFixed(0)
            obj.height = data.detail.height.toFixed(0)
          }
        })
      })
    }
  }
</script>
