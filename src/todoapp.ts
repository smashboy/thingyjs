import { Element } from './lib//elements/Element'
import { Box } from './lib/elements/Box'
import { Button } from './lib/elements/Button'
import { Form } from './lib/elements/Form'
import { Input } from './lib/elements/Input'
import { Text } from './lib/elements/Text'
import { Title } from './lib/elements/Title'
import { VStack } from './lib/elements/VStack'
import { state } from './lib/state'

interface Todo {
  description: string
}

interface TodoState {
  todos: Todo[]
}

interface User {
  username: string
}

const userStore = state<{ user: User | null }>({ user: null })

const WelcomeScreen = () => {
  const loginStore = state({ username: '' })

  const signin = () => {
    if (loginStore.username) {
      userStore.user = { username: loginStore.username }
    }
  }

  const onInputChange = (event: Event) => {
    loginStore.username = event.target.value
  }

  return VStack()
    .gap('10px')
    .align('center')
    .justify('center')
    .styles({
      width: '100%',
      height: '100%'
    })
    .child(Input(onInputChange))
    .child(Button('Sign in', signin))
}

const UserTodosScreen = () => {
  const todosStore = state<TodoState>({ todos: [] })

  const logout = () => {
    userStore.user = null
  }

  const onNewTodoCreate = (event: SubmitEvent) => {
    event.preventDefault()
    todosStore.todos = [
      ...todosStore.todos,
      { description: event.target[0].value }
    ]
  }

  return VStack()
    .child(
      Title(() => `Welcome back ${userStore.user!.username}`, 1, userStore)
    )
    .child(Button('Sign out', logout))
    .child(Text(() => `Total todos: ${todosStore.todos.length}`, todosStore))
    .child(TodoForm(onNewTodoCreate))
    .child(TodosList(todosStore))
}

const TodoForm = (
  onSubmit: (event: SubmitEvent) => void,
  initialValue = ''
) => {
  return Form(onSubmit)
    .child(
      Element('input')
        .attribute('value', initialValue)
        .attribute('placeholder', 'Your todo...')
    )
    .child(Button('Create').submit())
}

const TodosList = (state: TodoState) => {
  return Box(state).forEachChild(
    () => state.todos,
    (todo, index) => TodoItem(todo, index, state)
  )
}

const TodoItem = (todo: Todo, index: number, todoState: TodoState) => {
  const isEditModeEnabledState = state({ isEditMode: false })

  const toggleEditMode = () =>
    (isEditModeEnabledState.isEditMode = !isEditModeEnabledState.isEditMode)

  const onTodoUpdate = (event: SubmitEvent) => {
    const updatedTodo = event.target[0].value
    todoState.todos = todoState.todos.map((todo, i) =>
      i === index ? { description: updatedTodo } : todo
    )
  }

  const onTodoDelete = () => {
    todoState.todos = todoState.todos.filter((_, i) => i !== index)
  }

  return VStack(isEditModeEnabledState)
    .child(() =>
      isEditModeEnabledState.isEditMode
        ? TodoForm(onTodoUpdate, todo.description).child(
            Button('Cancel', toggleEditMode)
          )
        : Text(() => `${todo.description}`)
    )
    .child(Button('Edit', toggleEditMode))
    .child(Button('Delete', onTodoDelete))
}

export const App = () => {
  return Element('div', userStore)
    .styles({
      width: '100dvw',
      height: '100dvh'
    })
    .child(() => (userStore.user ? UserTodosScreen() : WelcomeScreen()))
}
