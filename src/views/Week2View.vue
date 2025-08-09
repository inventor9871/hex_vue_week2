<template>
  <h1>註冊帳號</h1>
  EMAIL：<input type="email" v-model="sginupField.email"> <br>
  暱稱：<input type="text" v-model="sginupField.nickname"> <br>
  密碼：<input type="password" v-model="sginupField.password"> <br>
  再次輸入密碼：<input type="password" v-model="password2"> <br>
  <span class="warn" v-if="pass12">{{ passwordIsMatch }} <br></span> 
  <button type="button" @click="signup">註冊帳號</button>
  <hr>
  <h1>登入</h1>
  EMAIL： <input type="email" v-model="signInField.email"> <br>
  密碼： <input type="password" v-model="signInField.password"> <br>
  <button type="button" @click="signIn">登入</button> <br>
  <p v-if="signInres.status==200" class="success">{{ signInres.nickname }} 您好，token = <br> {{ signInres.token }}</p>
  <p v-else-if="signInres.status==400" class="warn">帳號密碼錯誤 </p>
  <p v-else class="warn"> </p>
<hr>
<h1>驗證</h1>
token： <input type="text" v-model="inputToken"> <br>
<button type="button" @click="checkToken">驗證</button> <br>
<p class="success" v-if="checkOk">驗鄭成功，您的UID: <br> {{ uid }}</p>
<hr>
<h1>todoList</h1>
<input type="text" v-model="newTodo">
<button type="button">新增todolist</button>
<div>

</div>

</template>
<script setup>
import { ref } from 'vue';
import axios from 'axios';
const url = 'https://todolist-api.hexschool.io';


const newTodo = ref('');
const showTodo = async()=>{
  const res = await axios.get(`${url}/todos/`);
  console.log(res);
}

const inputToken = ref('');
const uid = ref('')
const checkOk = ref(false)
const checkToken = async ()=>{
  const todoCookie = document.cookie.replace(
  /(?:(?:^|.*;\s*)todoName\s*\=\s*([^;]*).*$)|^.*$/,  "$1",  );
  console.log(todoCookie);
  const res = await axios.get(`${url}/users/checkout`, {
    headers:{
      Authorization: todoCookie,
    }
  })
  // console.log(res);
  if(inputToken.value === todoCookie){
    uid.value = res.data.uid;
    checkOk.value = true;
    showTodo();
  }else{
    checkOk.value = false;
  }
    
}

const signInField = ref({
    email: '',
    password: ''
  })
  const signInres = ref({
    nickname:'',
    token:'',
    status:'',
  })
  const signIn =async ()=>{
    // console.log(signInField.value);
    try {
      // console.log(`${url}/users/sign_in`)
      const res = await axios.post(`${url}/users/sign_in`, signInField.value);
      console.log(res);
      signInres.value.nickname = res.data.nickname;
      signInres.value.token = res.data.token;
      signInres.value.status = res.status;
      document.cookie = `todoName=${res.data.token};`;
    } catch (error) {
      console.log(error);
      signInres.value.status = error.status;
    }
  }
  

  
const pass12 = ref(false)
const passwordIsMatch = ref('密碼不一致');
const password2 = ref('');
const sginupField = ref({
  email: "",
  password: "",
  nickname: ""
});
  const signup = async ()=>{
    try {
      // console.log(`${url}/users/sign_up`)
      if ( sginupField.value.password === password2.value ){
        const res = await axios.post(`${url}/users/sign_up`, sginupField.value);
        console.log(res);
      }else{
        pass12.value = true;
      }
    } catch (error) {
      console.log(error);
    }
    // console.log(sginupField);
  }
</script>
<style>
.warn, .success{
  padding-left: 22px;
  color: red;
  max-width: 250px;
  /* display: inline-block; */
  word-break: break-all;
}
.success{
  color: blue;
}
</style>