<template>
  <div class="build">
    <contentmenu ref="contentmenu"></contentmenu>
    <imglist ref="imglist" @change="handleSetimg"></imglist>
    <headers></headers>
    <top ref="top"></top>
    <div class="app" :class="{ 'app--none': !menuFlag }">
      <div
        class="menu"
        v-show="menuFlag && menuShow"
        @click.self="handleMouseDown"
      >
        <p class="title">图层</p>
        <layer ref="layer" :nav="nav"></layer>
      </div>
      <!-- 中间区域 -->
      <div ref="section" class="section">
        <div class="refer-line-img" @click="imgClick">
          <img :src="isShowReferLine ? imgOpenData : imgClose" />
        </div>
        <sketch-rule
          :thick="thick"
          :scale="scale"
          :width="width"
          :height="height"
          :startX="startX"
          :startY="startY"
          :isShowReferLine="isShowReferLine"
          :palette="palette"
          :shadow="shadow"
          :horLineArr="lines.h"
          :verLineArr="lines.v"
        />
        <div
          ref="screensRef"
          id="screens"
          :class="dragSlide ? 'dragghanle' : ''"
          @mousedown.stop="dragMousedown"
          @mouseup="dragMouseup"
          @mousemove="dragMousemove"
          @wheel="handleWheel"
          @scroll="handleScroll"
        >
          <div ref="containerRef" class="screen-container">
            <div class="canvas" ref="canvas" :style="canvasStyle">
              <container ref="container" :wscale="scale"></container>
            </div>
          </div>
        </div>
      </div>
      <div class="menu params" v-show="menuFlag && paramsShow">
        <el-tabs
          class="menu__tabs"
          @tab-click="handleTabClick"
          stretch
          v-model="menuTabs"
        >
          <el-tab-pane name="0">
            <span slot="label"><i class="el-icon-setting"></i>配置</span>
            <el-form label-width="110px" label-position="left" size="small">
              <!-- 组件配置 -->
              <template v-if="!validProp('', [undefined])">
                <p class="title">{{ activeObj.title }}</p>
                <el-form-item label="图层名称">
                  <avue-input v-model="activeObj.name"></avue-input>
                </el-form-item>
                <el-form-item label="隐藏">
                  <avue-switch v-model="activeObj.display"></avue-switch>
                </el-form-item>
                <template v-if="validProp('colorList')">
                  <el-form-item label="系统配色">
                    <avue-switch
                      v-model="activeOption.switchTheme"
                    ></avue-switch>
                  </el-form-item>
                </template>
                <component :is="activeComponent.prop + 'Option'"></component>
                <main-option></main-option>
              </template>
              <!-- 多选配置选项 -->
              <template v-else-if="isSelectActive">
                <el-form-item label="水平方式">
                  <el-tooltip content="左对齐" placement="top">
                    <i
                      class="el-icon-s-fold icon"
                      @click="$refs.container.handlePostionSelect('left')"
                    ></i>
                  </el-tooltip>
                  <el-tooltip content="居中对齐" placement="top">
                    <i
                      class="el-icon-s-operation icon"
                      @click="$refs.container.handlePostionSelect('center')"
                    ></i>
                  </el-tooltip>
                  <el-tooltip content="右对齐" placement="top">
                    <i
                      class="el-icon-s-unfold icon"
                      @click="$refs.container.handlePostionSelect('right')"
                    ></i>
                  </el-tooltip>
                </el-form-item>
                <el-form-item label="垂直方式">
                  <el-tooltip content="顶对齐" placement="top">
                    <i
                      class="el-icon-s-fold icon"
                      @click="$refs.container.handlePostionSelect('top')"
                    ></i>
                  </el-tooltip>
                  <el-tooltip content="中部对齐" placement="top">
                    <i
                      class="el-icon-s-operation icon"
                      @click="$refs.container.handlePostionSelect('middle')"
                    ></i>
                  </el-tooltip>
                  <el-tooltip content="底对齐" placement="top">
                    <i
                      class="el-icon-s-unfold icon"
                      @click="$refs.container.handlePostionSelect('bottom')"
                    ></i>
                  </el-tooltip>
                </el-form-item>
                <el-form-item label-width="0">
                  <el-button
                    type="primary"
                    size="small"
                    class="block"
                    @click="handleFolder"
                    >成组</el-button
                  >
                </el-form-item>
                <el-form-item label-width="0">
                  <el-button
                    type="danger"
                    size="small"
                    class="block"
                    @click="handleDeleteSelect"
                    >删除</el-button
                  >
                </el-form-item>
              </template>
              <!-- 主屏的配置项 -->
              <template v-else>
                <el-form-item label="大屏大小">
                  <div class="flex">
                    <avue-input-number
                      style="width: 130px"
                      v-model="config.width"
                    ></avue-input-number>
                    &nbsp;x&nbsp;
                    <avue-input-number
                      style="width: 130px"
                      v-model="config.height"
                    ></avue-input-number>
                  </div>
                </el-form-item>
                <el-form-item label="大屏简介">
                  <avue-input
                    v-model="config.info"
                    type="textarea"
                    :min-rows="5"
                  ></avue-input>
                </el-form-item>
                <el-form-item label="背景颜色">
                  <avue-input-color
                    v-model="config.backgroundColor"
                  ></avue-input-color>
                </el-form-item>
                <el-form-item label="背景图片">
                  <img
                    :src="config.backgroundImage"
                    @click="
                      handleOpenImg('config.backgroundImage', 'background')
                    "
                    alt=""
                    width="100%"
                  />
                  <el-input clearable v-model="config.backgroundImage">
                    <div
                      @click="
                        handleOpenImg('config.backgroundImage', 'background')
                      "
                      slot="append"
                    >
                      <i class="iconfont icon-img"></i>
                    </div>
                  </el-input>
                </el-form-item>
                <el-form-item label="预览方式">
                  <el-radio-group v-model="config.screen">
                    <el-radio label="x">X轴铺满，Y轴自适应滚动</el-radio>
                    <el-radio label="y">Y轴铺满，X轴自适应滚动</el-radio>
                    <el-radio label="xy">强行拉伸画面，填充所有视图</el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item label-width="0">
                  <el-button
                    size="small"
                    type="primary"
                    class="block"
                    @click="globShow = true"
                    >更多设置</el-button
                  >
                </el-form-item>
              </template>
            </el-form>
          </el-tab-pane>
          <!-- 数据配置 -->
          <el-tab-pane name="1" v-if="validProp('dataList')">
            <span slot="label"><i class="el-icon-document-copy"></i>数据</span>
            <template v-if="menuTabs == 1">
              <el-form label-width="120px" label-position="left" size="small">
                <el-form-item label="数据类型">
                  <avue-select
                    v-model="activeObj.dataType"
                    :dic="dicOption.dataType"
                  ></avue-select>
                </el-form-item>
                <template v-if="isSql">
                  <el-form-item label="数据源选择">
                    <avue-select :dic="DIC.sql" v-model="db"></avue-select>
                  </el-form-item>
                  <el-form-item label="SQL语句" label-position="top">
                    <monaco-editor
                      v-model="sql"
                      language="sql"
                      height="100"
                    ></monaco-editor>
                  </el-form-item>
                </template>
                <template v-else-if="isApi">
                  <!-- <el-form-item label="接口地址">
                    <avue-input v-model="activeObj.url"></avue-input>
                  </el-form-item>
                  <el-form-item label="请求方式">
                    <avue-select
                      v-model="activeObj.dataMethod"
                      :dic="dicOption.dataMethod"
                    ></avue-select>
                  </el-form-item> -->
                  <apiPanel @updateapi="updateApi"></apiPanel>
                </template>
                <template v-else-if="isWs">
                  <el-form-item label="WS地址">
                    <el-input v-model="activeObj.wsUrl"> </el-input>
                  </el-form-item>
                </template>
                <template v-else-if="isRecord">
                  <el-form-item label="数据集选择">
                    <avue-select
                      :dic="DIC.data"
                      v-model="activeObj.record"
                    ></avue-select>
                  </el-form-item>
                </template>
                <el-form-item label="刷新时间" v-if="isApi || isWs || isSql">
                  <avue-input-number
                    v-model="activeObj.time"
                    placeholder="0"
                  ></avue-input-number>
                </el-form-item>
                <el-form-item label-width="0">
                  <el-button
                    size="small"
                    type="primary"
                    class="block"
                    @click="handleSetting"
                    >更多设置</el-button
                  >
                </el-form-item>
                <el-form-item label-width="0">
                  <el-button
                    size="small"
                    type="danger"
                    class="block"
                    @click="openCode('stylesFormatter', '编辑样式')"
                    >编辑样式</el-button
                  >
                </el-form-item>
                <el-form-item label-width="0">
                  <el-button
                    size="small"
                    type="primary"
                    class="block"
                    @click="handleRes"
                    >请求数据</el-button
                  >
                </el-form-item>
                <el-form-item label-width="0">
                  <monaco-editor
                    v-model="dataRes"
                    disabled
                    height="400"
                  ></monaco-editor>
                </el-form-item>
              </el-form>
            </template>
          </el-tab-pane>
          <!-- 交互事件配置 -->
          <el-tab-pane name="2" v-if="validProp('eventList')">
            <span slot="label"><i class="el-icon-thumb"></i>交互</span>
            <el-form label-width="120px" label-position="left" size="small">
              <el-form-item label="子类">
                <avue-select
                  multiple
                  v-model="activeObj.child.index"
                  :dic="childList"
                  :props="childProps"
                >
                </avue-select>
              </el-form-item>
              <el-form-item label="参数名称">
                <avue-input v-model="activeObj.child.paramName"></avue-input>
              </el-form-item>
              <el-form-item label="映射字段">
                <avue-input
                  v-model="activeObj.child.paramValue"
                  placeholder="默认为value"
                ></avue-input>
              </el-form-item>
            </el-form>
          </el-tab-pane>
          <!-- 其他事件配置 -->
          <el-tab-pane name="3" v-if="!validProp('', [undefined])">
            <span slot="label"><i class="el-icon-mouse"></i>事件</span>
            <el-form label-width="120px" label-position="left" size="small">
              <el-form-item label="点击事件">
                <el-button
                  size="small"
                  type="primary"
                  @click="openCode('clickFormatter', '点击事件')"
                  >编辑</el-button
                >
              </el-form-item>
              <template v-if="validProp('labelFormatterList')">
                <el-form-item label="提示事件">
                  <el-button
                    size="small"
                    type="primary"
                    @click="openCode('formatter', '提示事件')"
                    >编辑</el-button
                  >
                </el-form-item>
                <el-form-item label="标题事件">
                  <el-button
                    size="small"
                    type="primary"
                    @click="openCode('labelFormatter', '标题事件')"
                    >编辑</el-button
                  >
                </el-form-item>
              </template>
            </el-form>
          </el-tab-pane>
          <!-- 基本参数配置 -->
          <el-tab-pane name="4" v-if="isActive">
            <span slot="label"><i class="el-icon-folder"></i>参数</span>
            <el-form label-width="90px" label-position="left" size="small">
              <el-form-item label="序号">
                <avue-input
                  @click.native="handleCopyIndex"
                  v-model="activeObj.index"
                  disabled
                >
                </avue-input>
              </el-form-item>
              <el-form-item label="进入动画">
                <avue-select
                  filterable
                  allow-create
                  v-model="activeComponent.animated"
                  :dic="dicOption.animated"
                ></avue-select>
                <div>
                  <a
                    href="https://www.dowebok.com/demo/2014/98/"
                    target="_blank"
                    >点击查看动画类型</a
                  >
                </div>
              </el-form-item>
              <el-form-item label="位置">
                <div class="flex">
                  <avue-input-number
                    style="width: 130px"
                    v-model="activeObj.left"
                  ></avue-input-number>
                  &nbsp;x&nbsp;
                  <avue-input-number
                    style="width: 130px"
                    v-model="activeObj.top"
                  ></avue-input-number>
                </div>
              </el-form-item>
              <el-form-item label="尺寸">
                <div class="flex">
                  <avue-input-number
                    style="width: 130px"
                    v-model="activeComponent.width"
                  ></avue-input-number>
                  &nbsp;x&nbsp;
                  <avue-input-number
                    style="width: 130px"
                    v-model="activeComponent.height"
                  ></avue-input-number>
                </div>
              </el-form-item>
              <el-form-item label="透视">
                <avue-slider
                  v-model="activeComponent.perspective"
                  :max="1000"
                ></avue-slider>
              </el-form-item>
              <el-form-item label="缩放">
                <avue-slider
                  v-model="activeComponent.scale"
                  :max="10"
                ></avue-slider>
              </el-form-item>
              <el-form-item label="透明度">
                <avue-slider
                  :step="0.1"
                  v-model="activeComponent.opacity"
                  :max="1"
                ></avue-slider>
              </el-form-item>
              <el-form-item label="X旋转度">
                <avue-slider
                  v-model="activeComponent.rotateX"
                  :min="-360"
                  :max="360"
                ></avue-slider>
              </el-form-item>
              <el-form-item label="Y旋转度">
                <avue-slider
                  v-model="activeComponent.rotateY"
                  :min="-360"
                  :max="360"
                ></avue-slider>
              </el-form-item>
              <el-form-item label="Z旋转度">
                <avue-slider
                  v-model="activeComponent.rotateZ"
                  :min="-360"
                  :max="360"
                ></avue-slider>
              </el-form-item>
            </el-form>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
    <codeedit
      @submit="closeCode"
      v-if="code.box"
      :title="code.title"
      :type="code.type"
      v-model="code.obj"
      :visible.sync="code.box"
    ></codeedit>
    <el-dialog
      append-to-body
      top="1%"
      title="更多设置"
      :close-on-click-modal="false"
      :visible.sync="globShow"
      width="70%"
    >
      <el-form size="small" label-width="130px">
        <el-form-item label="全局请求地址">
          <avue-input v-model="config.url" placeholder="/"></avue-input>
        </el-form-item>
        <el-form-item label="全局请求参数">
          <monaco-editor
            v-model="config.query"
            language="javascript"
            disabled
            height="100"
          ></monaco-editor>
          <el-button
            type="primary"
            icon="el-icon-edit"
            @click="openCode('query', '全局请求参数')"
            >编辑</el-button
          >
        </el-form-item>
        <el-form-item label="全局请求头">
          <monaco-editor
            v-model="config.header"
            language="javascript"
            disabled
            height="100"
          ></monaco-editor>
          <el-button
            type="primary"
            icon="el-icon-edit"
            @click="openCode('header', '全局请求头')"
            >编辑</el-button
          >
        </el-form-item>
        <el-form-item label="大屏水印">
          <avue-switch v-model="config.mark.show"></avue-switch>
        </el-form-item>
        <template v-if="config.mark.show">
          <el-form-item label="内容">
            <avue-input v-model="config.mark.text"></avue-input>
          </el-form-item>
          <el-form-item label="大小">
            <avue-input-number
              v-model="config.mark.fontSize"
            ></avue-input-number>
          </el-form-item>
          <el-form-item label="颜色">
            <avue-input-color v-model="config.mark.color"></avue-input-color>
          </el-form-item>
          <el-form-item label="角度">
            <avue-input-number v-model="config.mark.degree"></avue-input-number>
          </el-form-item>
        </template>
      </el-form>
    </el-dialog>
    <el-dialog
      append-to-body
      top="1%"
      title="更多设置"
      :close-on-click-modal="false"
      :visible.sync="show"
      width="70%"
    >
      <el-form size="small" label-width="130px">
        <el-form-item label="数据类型">
          <avue-select
            v-model="activeObj.dataType"
            :dic="dicOption.dataType"
          ></avue-select>
        </el-form-item>
        <template v-if="isStatic">
          <el-form-item label="数据值" label-position="top">
            <el-button
              size="small"
              type="primary"
              icon="el-icon-edit"
              @click="openCode('data', '数据值')"
              >编辑数据值</el-button
            >
            &nbsp;
            <el-upload
              :show-file-list="false"
              :auto-upload="false"
              style="display: inline-block"
              accept=".xls,.xlsx"
              :on-change="handleImport"
            >
              <el-button size="small" icon="el-icon-upload" type="success"
                >导入数据(Excel)</el-button
              >
            </el-upload>
          </el-form-item>
        </template>
        <template v-else-if="isSql">
          <el-form-item label="数据源选择">
            <avue-select :dic="DIC.sql" v-model="db"></avue-select>
          </el-form-item>

          <el-form-item label="SQL语句" label-position="top">
            <el-tooltip
              effect="dark"
              content="如果要获取变量，直接写成函数返回sql语句即可"
              placement="top"
            >
              <i class="el-icon-info"></i>
            </el-tooltip>
            <monaco-editor
              v-model="sql"
              language="sql"
              height="100"
            ></monaco-editor>
          </el-form-item>
        </template>
        <template v-else-if="isApi">
          <!-- <el-form-item label="接口地址">
            <avue-input v-model="activeObj.url"></avue-input>
          </el-form-item>
          <el-form-item label="请求方式">
            <avue-select
              v-model="activeObj.dataMethod"
              :dic="dicOption.dataMethod"
            ></avue-select>
          </el-form-item> -->
          <apiPanel @getApi="getApi"></apiPanel>
        </template>
        <template v-else-if="isWs">
          <el-form-item label="WS地址">
            <el-input v-model="activeObj.wsUrl"> </el-input>
          </el-form-item>
        </template>
        <template v-else-if="isRecord">
          <el-form-item label="数据集选择">
            <avue-select
              :dic="DIC.data"
              v-model="activeObj.record"
            ></avue-select>
          </el-form-item>
        </template>
        <el-form-item label="请求配置" v-if="isWs || isApi">
          <el-tabs class="menu__tabs" v-model="dataTabs">
            <el-tab-pane label="请求参数（Body）" name="0">
              <template v-if="dataTabs == 0">
                <el-radio-group
                  v-if="['post', 'put'].includes(activeObj.dataMethod)"
                  v-model="activeObj.dataQueryType"
                >
                  <el-radio label="json">JSON数据</el-radio>
                  <el-radio label="form">FORM表单</el-radio>
                </el-radio-group>
                <monaco-editor
                  v-model="activeObj.dataQuery"
                  language="javascript"
                  disabled
                  height="100"
                ></monaco-editor>
                <el-button
                  size="small"
                  type="primary"
                  icon="el-icon-edit"
                  @click="openCode('dataQuery', '请求参数')"
                  >编辑</el-button
                >
              </template>
            </el-tab-pane>
            <el-tab-pane label="请求头（Headers）" name="1" v-if="isApi">
              <template v-if="dataTabs == 1">
                <monaco-editor
                  v-model="activeObj.dataHeader"
                  language="javascript"
                  disabled
                  height="100"
                ></monaco-editor>
                <el-button
                  size="small"
                  type="primary"
                  icon="el-icon-edit"
                  @click="openCode('dataHeader', '请求头')"
                  >编辑</el-button
                >
              </template>
            </el-tab-pane>
          </el-tabs>
        </el-form-item>
        <el-form-item label="过滤器">
          <monaco-editor
            v-model="activeObj.dataFormatter"
            language="javascript"
            disabled
            height="100"
          ></monaco-editor>
          <el-button
            size="small"
            type="primary"
            icon="el-icon-edit"
            @click="openCode('dataFormatter', '编辑过滤器')"
            >编辑</el-button
          >
        </el-form-item>
        <el-form-item label="响应数据">
          <monaco-editor
            v-model="dataRes"
            disabled
            height="200"
          ></monaco-editor>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button
          size="small"
          type="primary"
          icon="el-icon-refresh"
          @click="handleRes"
          >请求数据</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>
<script>
import MonacoEditor from '@/page/components/editor'
import layer from './group/layer'
import top from './group/top'
import headers from './group/header'
import imglist from './group/imglist'
import contentmenu from './group/contentmenu'
import codeedit from './group/code'
import { dicOption } from '@/option/config'
import init from '@/mixins/'
import { createFile, uuid } from '@/utils/utils'
import components from '@/option/components'
import SketchRule from 'vue-sketch-ruler'
import { getList as getDbList } from '@/api/db'
import { getList as getRecordList } from '@/api/record'
import crypto from '@/utils/crypto'
import apiPanel from '@/page/components/apiPanel'

export default {
  mixins: [init, components],
  data() {
    return {
      currentHistoryIndex: -1,
      copyNav: '',
      menuId: 'avue-data-menu',
      menuShow: true,
      paramsShow: true,
      globShow: false,
      show: false,
      cacheList: {
        copy: null,
        history: [],
      },
      keys: {
        ctrl: false,
      },
      dataRes: '',
      db: '',
      sql: '',
      nav: [],
      DIC: {
        sql: [],
        data: [],
      },
      loading: '',
      childProps: {
        label: 'name',
        value: 'index',
      },
      key: '',
      menuFlag: true,
      code: {
        title: '',
        box: false,
        type: '',
        obj: '',
      },
      form: {},
      dicOption: dicOption,
      menuTabs: 0,
      dataTabs: 0,
      // 标尺
      scale: 0.94, //初始化标尺的缩放
      startX: 0, //x轴标尺开始的坐标数值
      startY: 0,
      lines: {
        //初始化水平标尺上的参考线
        h: [],
        v: [],
      },
      shadow: { x: 0, y: 0 }, // 阴影大小
      thick: 20, //标尺的厚度
      width: 0, // 标尺宽,后面会初始化
      height: 0, // 标尺高,后面会初始化
      isShowReferLine: true, // 显示参考线
      imgOpenData:
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAbCAYAAAAOEM1uAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAIGNIUk0AAHolAACAgwAA+f8AAIDpAAB1MAAA6mAAADqYAAAXb5JfxUYAAAQNSURBVHja7JdvSON1HMdfP126/shSmaZ1ntuZbTLihOnSdJlPhIquB0VR1DZM9En0wCB3qCXKVOh86mmakdGDOqyHityBidYN1HPYZqbhOZprMGTOUk/9/XryWyxvek5NIu4Lg/H+fPj8Xt/P98/n8xUkSeK/PIT7gP8GoCAI8cTQAoWAHkgFRCAA3AKmgeBRA8VkOSZgMvAy8DZQCqQf4OcFRoDPgYmzAnwdaAAuxpFlCbgGfAR4ThUwYhcE4QngExnw71FWVuax2WwBk8mkSE9PV+7t7Ymrq6vbw8PD0uDgYO7CwsK5KPc14ENJkj497FtxAwqCYAK+kvcbANXV1U6Hw6HIyMh4GlAckJHwzMzMrM1my3a5XNoo01XgPUmSdk8MCLwEfAmoAPLz872jo6OrOTk5xVGBQ0tLS575+fnt7OzsRIPBcD4pKelctL2/v3+mtrbWLIpigixfA94BNk8C+JoMlyRn7WZvb68mISEhI+IQCASmKyoq0jweT25EU6lU4aGhoZnKykpzdNzl5eWbRqPxyWAwmCZL3wJvAHeOA/iCPMsHARwOx7jdbi+JXs7t7e3lrKys1LW1NVWsJXa73ZN6vb40WltfX3cbDIZ0r9ebKUv9wLvxAhYC1+V7je7u7rG6urrn9vu1tbWNNzU1lR90KgsLC5emp6cfB5TRejgc9mg0msyoTNYDXfEAjgFmQGxpaZlobm6OBbFrMpl+dTqd+YdcLztbW1ve5ORk7X6D3++f0ul0+aFQKAXYAF6RJOn6UQGDQBrgE0VRJQjCw7EAjUbj8tTUVN4hgLubm5u3lUrlhVjG+vr6ya6ursgWaJck6fJRAW8AzwNia2vrRGNjY8xltNvtEx0dHc8eRKfX62+73W418NB+m8/nm9LpdE+Fw+FHgD+AS/Fk8CJwI7IHe3t7x2pqau7agxsbG/NqtTp3a2tLGQtwcnJyvKSk5K7JhcPhnzQaTXYwGEyVpQ+AK8c5xd9EZt/e3v59Q0ND6f5LeXFx8cfy8vILfr9fHdEUCsVOX1/fhMViqdgfOxQKzRUUFKh9Pt+JTnHk76vyPZgcqR49PT3nExMTM/+x0XZ3fePj47/Mzc2RlZVFVVVVRkpKin5/3JWVFWdRUVFeIBCInN7v5NJ55ySV5EUZ8lEArVb728jIiDcvL++ZONqo0MDAwK2ampoyURQTZXlI7ob+PI1aXAR8AegiutVqdXZ2dt6zFs/OzrosFstjLpcr+iR3A+9LkrRzKs2CrGUCV4C3on3NZrPHarX+Xlxc/MARu5nLkiRdPbVuJsa4BDQCxjj6QRH4GvgY+PksOmqF3FG/KVcc9T066s+AH86y5Y8eOXI282XQyJtkRv6d/pvk/rPz/wT41wBibRrpeMs+PAAAAABJRU5ErkJggg==', // 左上角图片
      imgClose:
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAZCAYAAADE6YVjAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAIGNIUk0AAHolAACAgwAA+f8AAIDpAAB1MAAA6mAAADqYAAAXb5JfxUYAAAPYSURBVHja7JVPTFRXFIe/+96gGRHEhQzBFMJKSKSkLTgtGxemSXcktohW2RBmTAjUClIYZ6Cxi+fQDgOCLJgJhqTSBAtLdjaxaSqQWnDSNp2U0I6FFh0SDdV0oMx7pwuZCUXjnyZNuvBsbnLvufe7555zfleJCP+1qReQfwVRSqWmqoFDIE3A+iZXQDbGlMmmNTatP5xPn/0ohOOgLgNtIB8DOlAKvAzsBTKBP4FF4Dvge1DrzwsBaAAuAJ8CxbpuezU/P397QcFLZGVlcf/+fRYXF1lc/G3VNJM/AJ8Dw8CdZ4QoQI4AIWBXaWkpQ0ND5v79+zW73Z5+n9XVVWZnb8rExIQ2MnKZWCz2M/Dhw1d4eiTngXafz2dmZ2ebPp9P6+vrl5qaI2p8fFyi0aheUlJiHj78tpaTs0sHJB6PW4HAJ3og0I2I+AHPkyAeu91uDA4OmrW1tRpAT09vsr29XXM4ciWZTJKXl2ctLCyoHTsy1ZUro+J0OjNSWR8ZGbFcLpeeSCTOAucfBykDpvr7+7c3NjamS+bevXvJ4uIS4vE7tra2tjW/32+7ffu21Ne7rJmZb7VIJKL27Nmjp0ADAwM0NjauAW+IyM2tkAGn8/WG69e/NjVNS20iHA6vd3Z2qrq6OtMwDFswGLROnz6dcffu3WRRUZEVCARwuVzbUv6WZVmVlZXa9PT0RRFp2gq56na7Dw0ODv6jGc6cOWNdu/Zl8saNb/RgMGi1tLSo7u5uaW5u1srLK8yDBw/aursD2ubmcbtPqnA4dFVE3twKuVBeXv7e5OSkabPZ0pGEQuG/WltbicV+0Xbv3m0LBnvWW1qatbNnvclLl4b0c+c+ErfblcoLa2trptPp1CORSEBEWrdCSoBpwzB2ejyedE6Wl5fNsrIyqaiokFAopBwOh/J4PKbf79/mcDiS0WiUnJwcWyoKr9erDMNYBg6ISOxx1dWg6/pAb2+vtZF8DWBqanr96NEalUgkpKCgQJaWljRN04jH43R1dcmpU6dsgBiGobxer3qoGnz2pD5pBfx1dXWaz+czi4qKNECtrKyYY2NjVjQa1fftK7aqq99hdHRUmpqaVEdHhzU/P58xPDycAN4Hws8iK28B/tzc3LJjx96lqqrKOnCggszMzLRmPHjwQM3MzFj19fX63NwcwDJQBUymK+ApEEDtBDkOnFBKvZafv9deWFhIdnYWKysr3Lr1K0tLvydE5CvgJ1AnQZqBi88DSV1aA0qAV4CCDRX+A1gAZoEfN/w/ALqAEyAjzwvZ8mc8KukblgGqD/gCZOyxkBd//P8G8vcAMK383pmr7aEAAAAASUVORK5CYII=',
      dragSlide: false, // 拖动滚动条标记
    }
  },
  components: {
    MonacoEditor,
    imglist,
    layer,
    codeedit,
    top,
    headers,
    contentmenu,
    SketchRule,
    apiPanel,
  },
  computed: {
    // 能否撤销
    canUndo() {
      return this.currentHistoryIndex > 0
    },
    canRedo() {
      return this.cacheList.history.length > this.currentHistoryIndex + 1
    },
    isKeysCtrl() {
      return this.keys.ctrl == true
    },
    isStatic() {
      return this.activeObj.dataType == 0
    },
    isApi() {
      return this.activeObj.dataType == 1
    },
    isSql() {
      return this.activeObj.dataType == 2
    },
    isWs() {
      return this.activeObj.dataType === 3
    },
    isRecord() {
      return this.activeObj.dataType == 4
    },
    isFolder() {
      return this.activeObj.children
    },
    isActive() {
      return this.activeObj.index
    },
    isSelectActive() {
      return this.active.length > 1
    },
    childList() {
      return this.list.filter((ele) => {
        if (ele.children) return false
        let component = ele.component || {}
        return !['tabs'].includes(component.prop)
      })
    },
    activeComponent() {
      return this.activeObj.component || {}
    },
    activeOption() {
      return this.activeObj.option || {}
    },
    activeObj: {
      get() {
        let item = this.findlist(this.activeIndex) || {}
        if (!item.child) item.child = {}
        return item
      },
    },
    activeList() {
      let result = []
      this.active.forEach((ele) => {
        let item = this.findnav(ele)
        result.push(item.item)
      })
      return result
    },
    /* 标尺用的 */
    palette() {
      return {
        bgColor: '#18181c', // ruler bg color
        longfgColor: '#BABBBC', // ruler longer mark color
        shortfgColor: '#9C9C9C', // ruler shorter mark color
        fontColor: '#fff', // ruler font color
        shadowColor: '#18181c', // ruler shadow color
        lineColor: '#EB5648',
        borderColor: '#B5B5B5',
        cornerActiveColor: '#fff',
      }
    },
    // 画布大小,一定要是computer里面,否则缩放页面会失效
    canvasStyle() {
      return {
        width: window.innerWidth - 530 + 'px',
        transform: `scale(${this.scale})`,
      }
    },
  },
  watch: {
    nav: {
      handler(val, oldval) {
        this.recordMain(val, oldval)
      },
      deep: true,
    },
    activeObj: {
      handler(val) {
        if (this.activeObj.sql && this.isSql) {
          let mode = JSON.parse(crypto.decrypt(this.activeObj.sql))
          this.db = mode.id
          this.sql = mode.sql
        } else {
          this.db = ''
          this.sql = ''
        }
      },
      deep: true,
    },
    'activeObj.dataType'() {
      this.dataTabs = '0'
    },
    overactive(n, o) {
      ;[o, n].forEach((ele, index) => {
        if (!ele) return
        this.setActive(ele, index === 1, 'setOverActive')
      })
    },
    active(n, o) {
      ;[o, n].forEach((ele, index) => {
        ele.forEach((item) => {
          this.setActive(item, index === 1, 'setActive')
        })
      })
      // 初始化选项卡
      this.menuTabs = '0'
    },
  },
  created() {
    this.initDataList()
    window.ths = this
  },
  mounted() {
    setTimeout(() => {
      this.initFun()
      this.initSize()
      this.listenKey()
    })
  },
  methods: {
    handleCopyIndex() {
      this.$Clipboard({
        text: this.activeObj.index,
      })
        .then(() => {
          this.$message.success('复制成功')
        })
        .catch(() => {
          this.$message.error('复制失败')
        })
    },
    handleTabClick(tab) {
      if (tab.name == '1') {
        this.handleRes(false)
      }
    },
    handleImport(file, fileLis) {
      this.$Export.xlsx(file.raw).then((data) => {
        this.activeObj.data = data.results
        this.$message.success('导入成功')
        this.handleRes()
      })
    },
    handleRefresh() {
      return this.$refs.container.handleRefresh()
    },
    handleRes(tip = true) {
      if (this.isSql) {
        this.$set(
          this.activeObj,
          'sql',
          crypto.encrypt(
            JSON.stringify({
              id: this.db,
              sql: this.sql,
            })
          )
        )
      }
      this.handleRefresh().then((res = {}) => {
        if (!this.validatenull(res)) {
          this.dataRes = JSON.stringify(res, null, 4)
        } else {
          this.dataRes = ''
        }
        if (tip) this.$message.success('请求数据成功')
      })
    },
    handleSetting() {
      this.dataTabs = 0
      this.dataRes = ''
      this.handleRes(false)
      this.show = true
    },
    initDataList() {
      getDbList({
        current: 1,
        size: 100,
      }).then((res) => {
        const data = res.data.data
        this.DIC.sql = data.records.map((ele) => {
          return {
            label: ele.name,
            value: ele.id,
          }
        })
      })
      getRecordList({
        current: 1,
        size: 100,
      }).then((res) => {
        const data = res.data.data
        this.DIC.data = data.records.map((ele) => {
          return {
            label: ele.name,
            value: ele.id,
          }
        })
      })
    },
    closeCode(value) {
      if (this.configData.includes(this.code.type)) {
        this.config[this.code.type] = value
      } else {
        this.activeObj[this.code.type] = value
      }
      this.handleRes(false)
    },
    openCode(type, title) {
      this.code.type = type
      this.code.title = title
      if (this.configData.includes(type)) {
        this.code.obj = this.config[type]
      } else {
        this.code.obj = this.activeObj[type]
      }
      this.code.box = true
    },
    initFun() {
      ;['setScale'].forEach((ele) => {
        this[ele] = this.$refs.container[ele]
      })
    },
    // 右键菜单
    handleContextMenu(item = {}, done) {
      if (!item.index || this.isKeysCtrl) return
      else if (!this.isSelectActive) {
        this.active = [item.index]
        this.activeIndex = item.index
      }
      done()
    },
    //监听键盘的按键
    listenKey() {
      let section = this.$refs.section
      section.onkeydown = (e) => {
        const keyCode = e.keyCode
        e.preventDefault()
        if (keyCode == 17) {
          this.keys.ctrl = true
        } else if (keyCode == 67 && this.keys.ctrl) {
          if (!this.activeObj) return
          this.cacheList.copy = this.deepClone(this.activeObj)
          this.$message.success('复制组件成功')
        } else if (keyCode == 86 && this.keys.ctrl) {
          if (!this.cacheList.copy) return
          this.nav.unshift(
            this.deepClone({
              ...this.cacheList.copy,
              ...{
                index: uuid(),
                name: this.cacheList.copy.name + '（复制）',
                left: 0,
                top: 0,
              },
            })
          )
          this.$message.success('粘贴组件成功')
        }
      }
      section.onkeyup = (e) => {
        const keyCode = e.keyCode
        if (keyCode == 17) {
          this.keys.ctrl = false
        }
      }
    },
    setActive(val, result, fun) {
      const obj = this.$refs.container.getDragObj(val)
      if (!this.validatenull(obj)) obj[0][fun](result)
    },
    //批量成组
    handleFolder() {
      let folder = createFile()
      this.active.forEach((index) => {
        let { itemList, itemIndex } = this.findnav(index)
        let obj = itemList.splice(itemIndex, 1)[0]
        folder.children.push(obj)
      })
      this.nav.push(folder)
      this.handleInitActive()
    },
    //批量删除
    handleDeleteSelect() {
      this.$confirm(`是否批量删除所选图层?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        this.active.forEach((index) => {
          let { itemList, itemIndex } = this.findnav(index)
          itemList.splice(itemIndex, 1)
        })
        this.handleInitActive()
      })
    },
    validProp(name, list) {
      if (list)
        return (
          list.includes(this.activeComponent.prop) || this.active.length > 1
        )
      return this.dicOption[name].includes(this.activeComponent.prop)
    },
    formatTooltip(val) {
      return parseInt(val)
    },
    //打开图库
    handleOpenImg(item, type) {
      this.$refs.imglist.openImg(item, type)
    },
    //图库框回调赋值
    handleSetimg(val, type) {
      let params = type.split('.')[1]
      if (type.includes('config')) {
        this.config[params] = val
      } else if (type.includes('activeObj.data.value')) {
        this.activeObj.data.value = val
      } else if (type.includes('activeObj.data')) {
        this.activeObj.data = val
      } else if (type.includes('activeObj')) {
        this.activeObj[params] = val
      } else if (type.includes('activeOption')) {
        this.activeOption[params] = val
      }
    },
    handleScroll() {
      this.$nextTick(() => {
        const screensRect = this.$refs.screensRef.getBoundingClientRect()
        const canvasRect = this.$refs.canvas.getBoundingClientRect()
        // 标尺开始的刻度
        const startX =
          (screensRect.left + this.thick - canvasRect.left) / this.scale
        const startY =
          (screensRect.top + this.thick - canvasRect.top) / this.scale
        this.startX = startX >> 0
        this.startY = startY >> 0
      })
    },
    // 控制缩放值
    handleWheel(e) {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault()
        const nextScale = parseFloat(
          Math.max(0.2, this.scale - e.deltaY / 500).toFixed(2)
        )
        this.scale = nextScale
      }
      this.$nextTick(() => {
        this.handleScroll()
      })
    },
    // 初始化标尺数值
    initSize() {
      const domW = this.$refs.section
      let width = window.innerWidth - 520
      let height = window.innerHeight - 80
      domW.style.width = width + 'px'
      domW.style.height = height + 'px'
      this.width = width
      this.height = height
      // 画布阴影部分
      this.shadow = { x: 0, y: 0, width, height }
      // 滚动居中
      let dom = this.$refs.containerRef.getBoundingClientRect()
      this.$refs.screensRef.scrollLeft = dom.width / 2 - 10
      this.$refs.screensRef.scrollTop = dom.height / 2 - 50
    },
    // 图片点击事件
    imgClick() {
      this.isShowReferLine = !this.isShowReferLine
    },
    // 鼠标按下事件
    dragMousedown(e) {
      // 如果按下了空格键,且按下鼠标左键,那么鼠标变抓手,开启滚动条随鼠标拖动的操作
      this.handleInitActive()
      this.dragSlide = true
      window.stardragEvent = e
      window.startSlideX = this.$refs.screensRef.scrollLeft
      window.startSlideY = this.$refs.screensRef.scrollTop
    },
    //鼠标抬起操作
    dragMouseup() {
      this.dragSlide = false
    },
    // 鼠标移动骚操作
    dragMousemove(e) {
      if (this.dragSlide) {
        let x = e.clientX - window.stardragEvent.clientX
        let y = e.clientY - window.stardragEvent.clientY
        this.$refs.screensRef.scrollLeft = window.startSlideX - x
        this.$refs.screensRef.scrollTop = window.startSlideY - y
      }
    },
    selectNav(item) {
      if (Array.isArray(item)) {
        this.active = this.active.concat(item)
      } else if (this.isKeysCtrl) {
        this.active.push(item)
      } else if (!this.active.includes(item)) {
        this.active = [item]
        this.activeIndex = item
      }
    },
    recordMain(val, oldval) {
      if (JSON.stringify(val) != this.copyNav) {
        let newst = JSON.stringify(val)
        if (newst != this.copyNav) {
          this.copyNav = newst
          this.addHistoryCache(val)
        } else {
          return
        }
      }
    },
    addHistoryCache(val) {
      if (this.currentHistoryIndex + 1 < this.cacheList.history.length) {
        this.cacheList.history.splice(this.currentHistoryIndex + 1)
      }
      this.cacheList.history.push({
        nav: this.deepClone(val),
      })
      this.cacheList.history.splice(100)
      this.currentHistoryIndex++
    },
    editorUndo() {
      if (!this.canUndo) {
        return
      }
      this.currentHistoryIndex--
      this.relapceEditorState()
    },
    editorRedo() {
      if (!this.canRedo) {
        return
      }
      handleRefresh
      this.currentHistoryIndex++
      this.relapceEditorState()
    },
    relapceEditorState() {
      const prevState = this.cacheList.history[this.currentHistoryIndex]
      this.nav = this.deepClone(prevState.nav)
      this.copyNav = JSON.stringify(prevState.nav)
    },
    updateApi(params) {
      const { url, method } = params
      this.$set(this.activeObj, 'url', url)
      this.$set(this.activeObj, 'dataMethod', method)
    },
  },
}
</script>
<style lang="scss">
@import '../styles/style.scss';
.refer-line-img {
  position: absolute;
  left: 0;
  z-index: 5;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  img {
    width: 100%;
  }
}
#screens {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
}

.screen-container {
  position: relative;
  width: 5000px;
  height: 3000px;
  background: url('/img/screen.png') repeat;
}

.dragghanle {
  cursor: pointer;
}
.canvas {
  position: absolute;
  top: 50%;
  left: 50%;
}
.section {
  flex: 1;
  overflow: hidden;
  position: relative;
}
</style>
