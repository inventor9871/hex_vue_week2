<template>
<h1>week1</h1>
<table class="table">
    <thead>
        <tr>
            <th>品項</th>
            <th>描述</th>
            <th>價錢</th>
            <th>數量</th>
        </tr>
    </thead>
    <tbody>
        <tr v-for="(item, index) in data" :key="index">
            <td>
                <button type="button" @click="editD(index)">編輯</button>
                {{ item.name }} <br>
                <div v-if="showi==index">
                    品項： <input type="text" v-model="temp.name"> <br>
                    描述： <input type="text" v-model="temp.description"> <br>
                    價錢： <input type="number" v-model="temp.price"> <br>
                    <button type="button" @click="editOk(index)">確認</button>
                    <button type="button" @click="cancelEdit">取消</button>
                </div>
            </td>
            <td>{{ item.description }}</td>
            <td>{{ item.price }}</td>
            <td>
                <button type="button" @click="item.stock<1?0:item.stock--"> - </button>
                <span class="p10">{{ item.stock }}</span>
                <button type="button" @click="item.stock>39?40:item.stock++"> + </button>
            </td>
        </tr>
    </tbody>
</table>

</template>
<script setup>
import { ref } from 'vue';

const editOk = (index)=>{
    data.value[index] = temp.value;
    showi.value='取消';
}
const cancelEdit = ()=>{
    showi.value='取消';
}
const editD = (index)=>{
    if(showi.value==='取消'){
        showi.value = index;
    }else{
        showi.value= '取消';
    }
    
    temp.value = {...data.value[index]};
}
const showi = ref('取消');
const temp = ref({
    id:'',
    name:'',
    description:'',
    price:0,
    stock:0
})
const data = ref([
       { id: 1,name: '冬瓜檸檬', description: '清新冬瓜配上新鮮檸檬', price: 45, stock: 5 },
      { id: 2,name: '翡翠檸檬', description: '綠茶與檸檬的完美結合', price: 55, stock: 34 },
      { id:3 ,name: '四季春茶', description: '香醇四季春茶，回甘無比', price: 45, stock: 10 },
      { id:4 ,name: '阿薩姆奶茶', description: '阿薩姆紅茶搭配香醇鮮奶', price: 50, stock: 25 },
      { id:5 ,name: '檸檬冰茶', description: '檸檬與冰茶的清新組合', price: 45, stock: 1 },
      { id:6 ,name: '珍珠奶茶', description: '香濃奶茶搭配QQ珍珠', price: 50, stock: 20 },
      { id:7 ,name: '芒果綠茶', description: '芒果與綠茶的獨特風味', price: 55, stock: 18 },
      { id:8 ,name: '抹茶拿鐵', description: '抹茶與鮮奶的絕配', price: 60, stock: 20 }
    ]);

</script>
<style>
.table{
    width: 80%;
    margin: 0 auto;
}
.p10{
    display: inline-block;
    padding: 20px;
}
</style>