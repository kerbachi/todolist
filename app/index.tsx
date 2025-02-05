import { ScrollView, Text, View, Alert } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import Dialog from "react-native-dialog";
import {s} from './index.style'
import { Header } from '../components/header/header'
import { CardTodo } from "../components/cardtodo/cardtodo";
import { useState, useEffect, useRef } from "react";
import { TabBottomMenu } from "../components/TabBottomMenu/TabBottomMenu";
import { ButtonAdd } from "../components/ButtonAdd/ButtonAdd";
// import { Localization } from "../components/Localization/localization"
import React from "react";
import uuid from 'react-native-uuid';
import AsyncStorage from '@react-native-async-storage/async-storage';


let isFirstRender = true
let isLoadUpdate = false

export default function App() {
  const [todoList, setTodoList] = useState([
    { id: 1, title: "Walk the dog", isCompleted: true },
    { id: 2, title: "Go to the dentist", isCompleted: false },
    { id: 3, title: "Learn React Native", isCompleted: false }
  ])
  
  const scrollViewRef = useRef()

  useEffect(() => {
    loadTodoList()
  }, []) //"do this only when you first open the page."

  useEffect(() => {
    if (!isFirstRender && !isLoadUpdate) {
      saveTodoList()
    } else {
      isFirstRender=false
      isLoadUpdate=false
    }
  }, [todoList])


  const [selectedTabName, setSelectedTabName] = useState("inProgress");
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [InputValue, setInputValue] = useState("")

  async function loadTodoList(){
    console.log('READ')
    try {
      const value = await AsyncStorage.getItem("@todoList");
      if (value !== null) {
        // We have data!!
        console.log('value from AsyncStorage:', value)
        isLoadUpdate = true
        setTodoList(JSON.parse(value) || [] ) //<= send empty array if AyncStorage return an undefined or null 
      }
    } catch (e) {
      // saving error
      console.log('error:', e)
    }
  }

  async function saveTodoList(){
    console.log('SAVE')
    try {
      const jsonValue = JSON.stringify(todoList);
      await AsyncStorage.setItem("@todoList", jsonValue);
    } catch (e) {
      // saving error
      console.log('error:', e)
    }
  }

  function filtredList() {
    switch(selectedTabName){
      case "all":
        return todoList
      case "inProgress":
        return todoList.filter((todo) => !todo.isCompleted )
      case "done":
        return todoList.filter((todo) => todo.isCompleted )
    }
  }

  function deleteTodo(todo) {
    Alert.alert('Delete todo', "Are you sure to delete {todo.title} ?!", [
      {
        text: 'Cancel',
        // onPress: () => console.log('Cancel Pressed' + todo.title),
        style: 'cancel',
      },
      {
        text: 'Delete', 
        style: "destructive", 
        onPress: () => {
          setTodoList(todoList.filter(t => t.id !== todo.id))
          console.log('Delete Pressed, delete:', todo)},
        }
    ])
  }
  
  const renderTodoList = () => {
    // return todoList.map((todo) => (
    return filtredList().map((todo) => (
    <View key={todo.id} style={s.cardItem}>
      <CardTodo onPress={updateTodo} todo={todo} onLongPress={deleteTodo} />
    </View>
  ));
}


  function updateTodo(todo){
    const updatedTodo = {
      ...todo,
      isCompleted: !todo.isCompleted
    };
    const updatedTodoList = [...todoList]
    const indexToUpdate = updatedTodoList.findIndex(
      (t) => t.id === updatedTodo.id
    );
    updatedTodoList[indexToUpdate] = updatedTodo
    setTodoList(updatedTodoList)

    console.log(todo)
  }

  function addTodo(todo){

    const newTodo = {
      id: uuid.v4(),
      title: InputValue,
      isCompleted: false
    }

    // if (InputValue.trim() === "") {
    //   Alert.alert("Error", "Todo name cannot be empty");
    //   return;
    // }
    if (todoList.some((t) => t.title === InputValue)) {
      Alert.alert("Error", "Todo already exists");
      return;
    }

    // Update todoList by adding newTodo
    setTodoList([...todoList, newTodo]);
    setShowAddDialog(false)
    setTimeout(() => {
      scrollViewRef.current.scrollToEnd({ animated: true });
    }, 100)
  
  }

  function renderAddDialog(){
    //  setTodoList([...todoList, newTodo]) 
    return(
      <Dialog.Container visible={showAddDialog} onBackdropPress={() => setShowAddDialog(false)}>
      <Dialog.Title>Add todo</Dialog.Title>
      <Dialog.Description>
        Type a name of your todo.
      </Dialog.Description>
      <Dialog.Input
          onChangeText={setInputValue}
          placeholder="Ex : Go to the dentist"
      />
      <Dialog.Button 
        label="Cancel" 
        color="grey"
        onPress={() => setShowAddDialog(false)}
      />
      <Dialog.Button label="Save" disabled={InputValue.length===0} onPress={addTodo}/>
    </Dialog.Container>
    )
  }



  return (
    <>
    <SafeAreaProvider>
      <SafeAreaView style={s.app}>

        <View>
          <Header />
        </View>

        <View style={s.body}>
          <ScrollView ref={scrollViewRef}>{renderTodoList()}</ScrollView>
        </View>
  
        <View>
          <ButtonAdd onPress={() => setShowAddDialog(true)} />
        </View>
      </SafeAreaView>
    </SafeAreaProvider>

    <View style={s.footer}>
      <TabBottomMenu
          todoList={todoList}
          onPress={setSelectedTabName}
          selectedTabName={selectedTabName}
      />
    </View>
    {renderAddDialog()}
    </>
  );
}
