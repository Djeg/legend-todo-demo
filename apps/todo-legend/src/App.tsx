import { ObservableObject, batch, computed, observable } from '@legendapp/state'
import { For, Memo, Show, reactive } from '@legendapp/state/react'
import { Button, Input, NativeBaseProvider, Pressable, View } from 'native-base'
import { Text } from 'react-native'
import { enableReactNativeComponents } from '@legendapp/state/config/enableReactNativeComponents'

enableReactNativeComponents()

export const ReactiveInput = reactive(Input)

export const ReactiveButton = reactive(Button)

export type Todo = {
  label: string
  done: boolean
}

export type TodoList = Todo[]

export type TodoState = {
  newTodo: string
  list: TodoList
}

const todoState = observable<TodoState>({
  newTodo: '',
  list: [],
})

const addTodo = () =>
  batch(() => {
    const newTodo = todoState.newTodo.get()

    if (!newTodo) return

    todoState.list.set(currentTodos => [
      ...currentTodos,
      { label: newTodo, done: false },
    ])

    todoState.newTodo.set('')

    console.warn('todo added ?', todoState.get())
  })

const toggleTodo = (todo: ObservableObject<Todo>) => () =>
  batch(() => {
    const label = todo.label.peek()
    const done = todo.done.peek()

    const matchTodo = todoState.list.find(t => t.label.peek() === label)

    if (!matchTodo) {
      return
    }

    matchTodo.set(oldTodo => ({
      ...oldTodo,
      done: !oldTodo.done,
    }))
  })

export function TodoApp() {
  return (
    <>
      <View>
        <Text>Todo App</Text>
      </View>
      <ReactiveInput
        $value={todoState.newTodo}
        onChangeText={todoState.newTodo.set}
      />
      <View>
        <Text>
          Current new todo: <Memo>{todoState.newTodo}</Memo>
        </Text>
      </View>
      <ReactiveButton onPress={addTodo}>Add Todo 2</ReactiveButton>
      <Show
        if={() => todoState.list.get().length > 0}
        else={
          <View>
            <Text>There is nothing todo yet 😩</Text>
          </View>
        }
      >
        <For<Todo, never> each={todoState.list} optimized>
          {todo => (
            <Pressable onPress={toggleTodo(todo)}>
              <View>
                <Text>
                  <Memo>{todo.label}</Memo>
                  <Show if={todo.done}>☑</Show>
                </Text>
              </View>
            </Pressable>
          )}
        </For>
      </Show>
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
