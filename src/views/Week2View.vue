<template>
  <div class="vv">
    <h1>註冊帳號</h1>
    EMAIL：<input type="email" v-model="sginupField.email" /> <br />
    暱稱：<input type="text" v-model="sginupField.nickname" /> <br />
    密碼：<input type="password" v-model="sginupField.password" /> <br />
    再次輸入密碼：<input type="password" v-model="password2" /> <br />
    <span class="warn" v-if="pass12">{{ passwordIsMatch }} <br /></span>
    <button type="button" @click="signup">註冊帳號</button>
  </div>
  <hr />
  <div class="vv">
    <h1>登入</h1>
    EMAIL： <input type="email" v-model="signInField.email" /> <br />
    密碼： <input type="password" v-model="signInField.password" /> <br />
    <button type="button" @click="signIn">登入</button> <br />
    <p v-if="signInres.status == 200" class="success">
      {{ signInres.nickname }} 您好，token = <br />
      {{ signInres.token }}
    </p>
    <p v-else-if="signInres.status == 400" class="warn">帳號密碼錯誤</p>
    <p v-else class="warn"></p>
  </div>
  <hr />
  <div class="vv">
    <h1>驗證</h1>
    token： <input type="text" v-model="inputToken" /> <br />
    <button type="button" @click="checkToken">驗證</button> <br />
    <p class="success" v-if="checkOk">
      驗證成功，您的UID: <br />
      {{ uid }}
    </p>
  </div>
  <hr />
  <div class="vv">
    <h1>todoList</h1>
    <input type="text" v-model="newTodo" />
    <button type="button" @click="addTodo">新增todolist</button>
    <div v-for="(item, index) in showTodores" :key="index">
      {{ item.content }}
    </div>
  </div>
</template>
<script setup>
import { ref } from 'vue'
import axios from 'axios'
const url = 'https://todolist-api.hexschool.io'

const newTodo = ref('')
const addTodo = async () => {
  console.log('newTodo.value', newTodo.value)
  const res = await axios.post(`${url}/todos/`, { content: newTodo.value })
  console.log('newTodo', res)
}

const showTodores = ref({})
const showTodo = async () => {
  const res = await axios.get(`${url}/todos/`, {
    headers: {
      Authorization: inputToken.value,
    },
  })
  console.log('newtodo', res)
  showTodores.value = res.data.data
  console.log(showTodores.value)
}

const inputToken = ref('')
const uid = ref('')
const checkOk = ref(false)
const checkToken = async () => {
  const todoCookie = document.cookie.replace(
    /(?:(?:^|.*;\s*)todoName\s*\=\s*([^;]*).*$)|^.*$/,
    '$1',
  )
  console.log(todoCookie)
  const res = await axios.get(`${url}/users/checkout`, {
    headers: {
      Authorization: todoCookie,
    },
  })
  // console.log(res);
  if (inputToken.value === todoCookie) {
    uid.value = res.data.uid
    checkOk.value = true
    showTodo()
  } else {
    checkOk.value = false
  }
}

const signInField = ref({
  email: '',
  password: '',
})
const signInres = ref({
  nickname: '',
  token: '',
  status: '',
})
const signIn = async () => {
  // console.log(signInField.value);
  try {
    // console.log(`${url}/users/sign_in`)
    const res = await axios.post(`${url}/users/sign_in`, signInField.value)
    console.log(res)
    signInres.value.nickname = res.data.nickname
    signInres.value.token = res.data.token
    signInres.value.status = res.status
    document.cookie = `todoName=${res.data.token};`
  } catch (error) {
    console.log(error)
    signInres.value.status = error.status
  }
}

const pass12 = ref(true)
const passwordIsMatch = ref('')
const password2 = ref('')
const sginupField = ref({
  email: '',
  password: '',
  nickname: '',
})
const signup = async () => {
  passwordIsMatch.value = ''
  try {
    // console.log(`${url}/users/sign_up`)
    if (sginupField.value.password === password2.value) {
      const res = await axios.post(`${url}/users/sign_up`, sginupField.value)
      console.log(res)
      passwordIsMatch.value = '註冊成功'
    } else {
      passwordIsMatch.value = '密碼不一致'
    }
  } catch (error) {
    console.log(error)
  }
  // console.log(sginupField);
}
</script>
<style>
.warn,
.success {
  padding-left: 22px;
  color: red;
  max-width: 250px;
  /* display: inline-block; */
  word-break: break-all;
}
.success {
  color: blue;
}
.vv {
  width: 500px;
  border: 1px solid gray;
  border-radius: 20px;
  padding: 12px;
  margin: 12px;
}
</style>
