<template>
  <div class="container">
    <div class="left">
      <div class="vv">
    <h1>註冊帳號</h1>
    <!-- EMAIL： -->
    <input type="email" v-model="sginupField.email" class="form-control" placeholder="請輸入EMAIL"/> <br />
    <!-- 暱稱： -->
    <input type="text" v-model="sginupField.nickname" class="form-control" placeholder="請輸入暱稱"/> <br />
    <!-- 密碼： -->
    <input type="password" v-model="sginupField.password" class="form-control" placeholder="請輸入密碼" /> <br />
    <!-- 再次輸入密碼： -->
    <input type="password" v-model="password2" class="form-control" placeholder="請再次輸入密碼" /> <br />
    <span class="warn" v-if="pass12">{{ passwordIsMatch }} <br /></span>
    <button type="button" @click="signup"   class="btn btn-info" >註冊帳號</button>
  </div>
  <hr />

  <div class="vv">
    <h1>登入</h1>
    <!-- EMAIL：  -->
    <input type="email" v-model="signInField.email" class="form-control" placeholder="請輸入EMAIL" /> <br />
    <!-- 密碼：  -->
    <input type="password" v-model="signInField.password" class="form-control" placeholder="請輸入密碼" /> <br />
    <button type="button" @click="signIn"  class="btn btn-info">登入</button> <br />
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
    <!-- token： -->
    <input type="text" v-model="inputToken" class="form-control" placeholder="請輸入token" /> <br />
    <button type="button" @click="checkToken"  class="btn btn-info">驗證</button> <br />
    <p class="success" v-if="checkOk">
      驗證成功，您的UID: <br />
      {{ uid }}
    </p>
  </div>
  <hr />
    </div>
    <div class="right">

      <div class="vv">
    <h1>todoList</h1>
    <input type="text" v-model="newTodo.content" class="form-control" placeholder="請輸入todo" />
    <button type="button" @click="addTodo"  class="btn btn-info">新增todolist</button>　　
    <button type="button" @click="refreshTodo" class="btn btn-success">重新取得Todo</button>
    <div class="todo" v-for="(item, index) in showTodores" :key="index">
      {{ new Date(item.createTime * 1000).toLocaleString('zh-TW') }} <br>
      {{ item.content }} <br>
      <input type="text" class="form-control" v-model="tempTodo.content" v-if="showi == index">
      <br>
      <button class="btn btn-warning" type="button" @click="editTodo(index)" v-if="editBut" >修改</button>　
      <div v-if="showi == index">
        <button type="button" @click="confirmTodo(index)">確認</button>　
        <button type="button" @click="canTodo"> 取消</button>
      </div>
      <button class="btn btn-danger" type="button" @click="delTodo(item.id, index)" v-else>刪除</button>

    </div>
  </div>
    </div>
  </div>


</template>
<script setup>
import { ref } from 'vue'
import axios from 'axios'
const url = 'https://todolist-api.hexschool.io'



const refreshTodo = async()=>{
  await showTodo()
}
const delTodo = async (id, index)=>{
  console.log('id=',id, ' todo=', showTodores.value[index].id)
  const res = await axios.delete(`${url}/todos/${id}`, {
    headers:{ Authorization: inputToken.value},
  })
  console.log('delTodo', res.data)
  await showTodo()
}

const confirmTodo = (index)=>{
  showTodores.value[index].content = tempTodo.value.content;
  showi.value = '取消';
  editBut.value = true;
  // tempTodo.value = {};
}

const canTodo = ()=>{
  tempTodo.value = {};
  showi.value = '取消';
  editBut.value = true;
}

const tempTodo = ref({});
const showi = ref('取消');
const editBut = ref(true);

const editTodo = (index)=>{
  if (showi.value ==='取消'){
    showi.value = index;
    editBut.value = false;
    tempTodo.value = {...showTodores.value[index]};
  }else{
    showi.value ='取消'
  }
}

const newTodo = ref({
  content: '',
})
const addTodo = async () => {
  try {
    console.log('newTodo.value', newTodo.value)
    const res = await axios.post(`${url}/todos/`, {content: newTodo.value.content},{
      headers:{
        Authorization: inputToken.value,
      }
    })
    console.log('newTodo', res)
    showTodo()
  } catch (error) {
    console.log('addTodo_error:', error)
  }
}

const showTodores = ref({})
const showTodo = async () => {
  console.log('token:', inputToken.value)
  const res = await axios.get(`${url}/todos/`, {
    headers: {
      Authorization: inputToken.value,
    },
  })
  console.log('showtodo', res)
  showTodores.value = {...res.data.data}
  console.log('showTodores', showTodores.value)
}

const inputToken = ref('')
const uid = ref('')
const checkOk = ref(false)
const checkToken = async () => {
  const todoCookie = document.cookie.replace(
    /(?:(?:^|.*;\s*)todoName\s*\=\s*([^;]*).*$)|^.*$/, '$1',  )

  const res = await axios.get(`${url}/users/checkout`, {
    headers: {
      Authorization: todoCookie,
    },
  })

  console.log('checkToken ',res);
  if (inputToken.value === todoCookie) {
    uid.value = res.data.uid
    checkOk.value = true
    showTodo()
    console.log(todoCookie)

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
    console.log(res);
    signInres.value.nickname = res.data.nickname;
    signInres.value.token = res.data.token;
    signInres.value.status = res.status;
    const expireDate = new Date(res.data.exp * 1000);
     expireDate.setDate(expireDate.getDate() -1);
    document.cookie = `todoName=${res.data.token}; expires=${expireDate.toUTCString()}; path=/`
    console.log('expireDate= ', expireDate)
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
  max-width: 333px;
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
.todo{
  border: 1px solid gray;
  border-radius: 20px;
  padding: 12px;
  margin: 12px;
  word-break: break-all;
}
/* .container{
  display: flex;
max-width: 987px;;
}
.left, .right{
  max-width: 500px;
} */
</style>
