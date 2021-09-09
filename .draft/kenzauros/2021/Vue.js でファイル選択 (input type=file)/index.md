---
title: Vue.js でファイル選択 (input type=file)
date: 2021-05-31
author: kenzauros
tags: [その他, ライフハック]
---

<template>
  <div class="visible overlay">
    <div :class="classObject">
      <div class="header">{{ title }}</div>
      <div class="content">
        <p>{{ content }}</p>
        <div class="grid form" style="width:400px;">
          <div class="row">
            <div class="seventeen wide"><input type="text" readonly="readonly" :value="selectedFilename"></div>
            <button class="three wide" @click="selectFile">選択</button>
          </div>
        </div>
        <input ref="fileSelector" type="file" id="file_selector_file_input" style="display:none" @change="fileSelected">
      </div>
      <div class="buttons">
        <button
          ref="buttonElements"
          v-for="(b, index) in buttons"
          :disabled="buttonsDisabled[index]"
          :tabindex="1000 + index"
          :key="index"
          :class="b.classes"
          @click="b.callback()">{{ b.label }}</button>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        state: 'info',
        title: '',
        content: '',
        selectedFilename: '',
        buttons: null,
        buttonsDisabled: [],
      }
    },
    computed: {
      classObject: (d) => {
        const classes = {
          dialog: true
        }
        classes[d.state] = true
        return classes
      },
    },
    methods: {
      selectFile() {
        this.$refs.fileSelector.click()
      },
      fileSelected() {
        const file = this.$refs.fileSelector.files[0]
        this.selectedFilename = file ? file.name : ''
        this.buttonsDisabled[0] = !file
      }
    },
    mounted() {
      this.buttonsDisabled[0] = true
    },
  }
</script>
