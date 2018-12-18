<template>
  <div class="hello">
    <h1 v-text="title"></h1>
    <input type="text" v-model="newItem" @keyup.enter="addNewItem">
    <ul>
      <li v-for="item in items"  v-bind:class="{finished: item.isFinished}" v-on:click="toggleFinish(item)">
      {{item.label}}
      </li>
    </ul>
  </div>

</template>

<script>
import Store from '../store'
export default {
  name: 'hello',
  data () {
    return {
      title: 'to-do-list',
      items: Store.fetch(),
      newItem : 'new'
    }
  },
  watch: {
    items: {
      handler: function(val, oldVal){
        Store.save(val)
      },
      deep: true
    }
  },
  methods: {
    toggleFinish: function(item){
      item.isFinished = !item.isFinished
    },
    addNewItem: function(){
      this.items.push({label: this.newItem, isFinished: false})
      this.newItem = ''
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: block;
  margin: 0 10px;
}

a {
  color: #42b983;
}
.finished{
  color: green;
}
input{height: 30px; margin: 10px;}
</style>
