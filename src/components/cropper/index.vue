<template>
  <div class="cropper-wrapper">
    <el-card class="cropper-card">
      <div class="img-box">
        <img :id="imgId" alt="" class="cropper-image" src="" style="max-width: 100%">
      </div>
      <div class="right-con">
        <el-row style="height: 185px;">
          <el-col :span="24">
            <div class="preview-box preview-lg">
              <div class="img-preview"></div>
            </div>
          </el-col>
        </el-row>
        <el-row style="height: 170px;">
          <div class="preview-box preview-md">
            <div class="img-preview"></div>
          </div>
          <div class="preview-box preview-sm">
            <div class="img-preview"></div>
          </div>
          <div class="preview-box preview-xs">
            <div class="img-preview"></div>
          </div>
        </el-row>
        <el-row style="margin-top: 33px;display: inline-block;">
          <div style="float: left">
            <el-upload :before-upload="beforeUpload" action="image/upload">
              <el-button size="small" style="width: 150px;" type="primary">
                {{ $t('forms.buttons.upload') }}
              </el-button>
            </el-upload>
          </div>
          <div style="float: left;margin-left: 20px;">
            <el-button v-show="insideSrc" size="small" style="width: 150px;" type="primary" @click="crop">
              {{ cropButtonText }}
            </el-button>
          </div>
        </el-row>
      </div>
      <div v-show="insideSrc">
        <el-row :gutter="16">
          <div class="input-box">
            <el-col :span="6">
              <el-input v-model="X" size="small" @blur="reSize" @keyup.enter.native="reSize">
                <template #prepend>X</template>
                <template #append>px</template>
              </el-input>
            </el-col>
            <el-col :span="6">
              <el-input v-model="Y" size="small" @on-blur="reSize" @keyup.enter.native="reSize">
                <template #prepend>Y</template>
                <template #append>px</template>
              </el-input>
            </el-col>
            <el-col :span="6">
              <el-input v-model="width" size="small" @on-blur="reSize" @keyup.enter.native="reSize">
                <template #prepend>{{ $t('forms.width') }}</template>
                <template #append>px</template>
              </el-input>
            </el-col>
            <el-col :span="6">
              <el-input v-model="height" size="small" @on-blur="reSize" @keyup.enter.native="reSize">
                <template #prepend>{{ $t('forms.height') }}</template>
                <template #append>px</template>
              </el-input>
            </el-col>
          </div>
        </el-row>
      </div>
      <div v-show="insideSrc">
        <div class="button-box">
          <el-button-group style="margin-right: 10px">
            <el-button size="small" type="primary" @click="reset">
              <el-icon>
                <el-icon-refresh/>
              </el-icon>
            </el-button>
            <el-button size="small" type="primary" @click="mode('move')">
              <el-icon>
                <el-icon-rank/>
              </el-icon>
            </el-button>
            <el-button size="small" type="primary" @click="mode('crop')">
              <el-icon>
                <el-icon-crop/>
              </el-icon>
            </el-button>
          </el-button-group>
          <el-button-group style="margin-right: 10px">
            <el-button size="small" type="primary" @click="shrink">
              <el-icon>
                <el-icon-zoom-out/>
              </el-icon>
            </el-button>
            <el-button size="small" type="primary" @click="magnify">
              <el-icon>
                <el-icon-zoom-in/>
              </el-icon>
            </el-button>
          </el-button-group>
          <el-button-group style="margin-right: 10px">
            <el-button size="small" type="primary" @click="rotate(-1)">
              <el-icon>
                <el-icon-refresh-left/>
              </el-icon>
            </el-button>
            <el-button size="small" type="primary" @click="rotate(1)">
              <el-icon>
                <el-icon-refresh-right/>
              </el-icon>
            </el-button>
            <el-button size="small" type="primary" @click="scale('X')">
              <el-icon>
                <el-icon-d-caret/>
              </el-icon>
            </el-button>
            <el-button size="small" type="primary" @click="scale('Y')">
              <el-icon>
                <el-icon-d-caret/>
              </el-icon>
            </el-button>
          </el-button-group>
          <el-button-group style="margin-right: 10px">
            <el-button size="small" type="primary" @click="move(0, -moveStep)">
              <el-icon>
                <el-icon-caret-top/>
              </el-icon>
            </el-button>
            <el-button size="small" type="primary" @click="move(-moveStep, 0)">
              <el-icon>
                <el-icon-caret-left/>
              </el-icon>
            </el-button>
            <el-button size="small" type="primary" @click="move(0, moveStep)">
              <el-icon>
                <el-icon-caret-bottom/>
              </el-icon>
            </el-button>
            <el-button size="small" type="primary" @click="move(moveStep, 0)">
              <el-icon>
                <el-icon-caret-right/>
              </el-icon>
            </el-button>
          </el-button-group>
          <el-button-group>
            <el-button size="small" type="primary" @click="aspact(16/9)">16:9</el-button>
            <el-button size="small" type="primary" @click="aspact(4/3)">4:3</el-button>
            <el-button size="small" type="primary" @click="aspact(1)">1:1</el-button>
            <el-button size="small" type="primary" @click="aspact(2/3)">2:3</el-button>
            <el-button size="small" type="primary" @click="aspact(NaN)">{{ $t('forms.buttons.free') }}</el-button>
          </el-button-group>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
import {nextTick} from 'vue'
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
  data() {
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
    imgId() {
      return `cropper-${this._.uid}`
    }
  },
  watch: {
    src(src) {
      this.replace(src)
    },
    insideSrc(src) {
      this.replace(src)
    }
  },
  methods: {
    beforeUpload(file) {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = (event) => {
        this.insideSrc = event.target.result
      }
      return false
    },
    replace(src) {
      this.cropper.replace(src)
      this.insideSrc = src
    },
    reset() {
      this.cropper.reset()
    },
    mode(value) {
      this.cropper.setDragMode(value)
    },
    rotate(value) {
      if (value > 0) {
        this.cropper.rotate(90)
      } else {
        this.cropper.rotate(-90)
      }
    },
    shrink() {
      this.cropper.zoom(-0.1)
    },
    magnify() {
      this.cropper.zoom(0.1)
    },
    scale(d) {
      this.cropper[`scale${d}`](-this.cropper.getData()[`scale${d}`])
    },
    move(...args) {
      this.cropper.move(...args)
    },
    aspact(value) {
      this.cropper.setAspectRatio(value)
    },
    reSize() {
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
    crop() {
      this.$emit('on-crop', this.cropper.getCroppedCanvas().toDataURL())
    }
  },
  mounted() {
    const obj = this
    nextTick(() => {
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
