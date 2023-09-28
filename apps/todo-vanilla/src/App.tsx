import { Button, Input, NativeBaseProvider } from 'native-base'
import { useState } from 'react'
import { Pressable, Text, View } from 'react-native'

export type Todo = {
  label: string
  done: boolean
}

export type TodoList = Todo[]

export function TodoApp() {
  const [newTodo, setNewTodo] = useState('')
  const [todos, setTodos] = useState<TodoList>([])

  const addTodo = (todo: string) => () =>
    !!todo &&
    setTodos(currentTodos => [...currentTodos, { label: todo, done: false }])

  const pressTodo = (todo: Todo) => () =>
    setTodos(todos =>
      todos.map(currentTodo =>
        currentTodo.label === todo.label
          ? { ...currentTodo, done: !todo.done }
          : currentTodo,
      ),
    )

  return (
    <>
      <View>
        <Text>Todo App ☺️</Text>
      </View>
      <Input
        onChangeText={setNewTodo}
        value={newTodo}
        placeholder="Do something ..."
      />
      <Button onPress={addTodo(newTodo)}>Add Todo</Button>
      {0 === todos.length ? (
        <View>
          <Text>There is nothing todo yet 😩</Text>
        </View>
      ) : (
        todos.map(todo => (
          <Pressable key={`todo-${todo.label}`} onPress={pressTodo(todo)}>
            <View>
              <Text>
                {todo.label}
                {todo.done ? ' ☑' : null}
              </Text>
            </View>
          </Pressable>
        ))
      )}
    </>
  )
}

export default function App() {
  return (
    <NativeBaseProvider>
      <TodoApp />
    </NativeBaseProvider>
  )
}
