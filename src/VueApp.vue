
<template>
  <div class="min-h-screen bg-gray-100 flex items-center justify-center">
    <div class="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center">
      <h1 class="text-3xl font-bold text-emerald-600 mb-4">Hello from Vue 3!</h1>
      <p class="text-gray-600 mb-6">这是一个在 React 项目中并存的 Vue 页面。</p>
      <button 
        @click="count++"
        class="bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-2 px-6 rounded-full transition-colors"
      >
        Count is: {{ count }}
      </button>
      <div class="mt-8">
        <a href="/" class="text-indigo-500 hover:underline">返回 React 首页</a>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
const count = ref(0);
</script>
