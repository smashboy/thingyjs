import { Component } from './lib/Component'
import { Box } from './lib/elements/Box'
import { Button } from './lib/elements/Button'
import { Element, ElementNode } from './lib/elements/Element'
import { Form } from './lib/elements/Form'
import { HStack } from './lib/elements/HStack'
import { Text } from './lib/elements/Text'
import { VStack } from './lib/elements/VStack'
import { state } from './lib/state'

interface Todo {
  description: string
}

interface TodoState {
  todos: Todo[]
}

class UserTodosScreen extends Component {
  private readonly state = state<TodoState>({ todos: [] }, this)

  onNewTodoCreate(event: SubmitEvent) {
    event.preventDefault()
    if (!event.target[0].value) return

    this.state.todos = [
      ...this.state.todos,
      { description: event.target[0].value }
    ]

    event.target[0].value = ''
  }

  render(): ElementNode {
    const list = Box()

    for (let index = 0; index < this.state.todos.length; index++) {
      const todo = this.state.todos[index]
      list.child(new TodoItem({ todo, index, state: this.state }).render())
    }

    return VStack()
      .child(Text(`Total todos: ${this.state.todos.length}`))
      .child(TodoForm((e) => this.onNewTodoCreate(e)))
      .child(list)
  }
}

const TodoForm = (
  onSubmit: (event: SubmitEvent) => void,
  buttonText = 'Create',
  initialValue = ''
) => {
  return Form(onSubmit)
    .child(
      Element('input')
        .attribute('value', initialValue)
        .attribute('placeholder', 'Your todo...')
    )
    .child(Button(buttonText).submit())
}

interface TodoItemProps {
  todo: Todo
  index: number
  state: TodoState
}

class TodoItem extends Component<TodoItemProps> {
  private readonly state = state({ isEditMode: false }, this)

  constructor(props: TodoItemProps) {
    super(props)
  }

  toggleEditMode() {
    this.state.isEditMode = !this.state.isEditMode
  }

  onTodoUpdate = (event: SubmitEvent) => {
    const updatedTodo = event.target[0].value
    this.props.state.todos = this.props.state.todos.map((todo, i) =>
      i === this.props.index ? { description: updatedTodo } : todo
    )
  }

  render(): ElementNode {
    const body = VStack()

    if (this.state.isEditMode) {
      body.child(
        TodoForm(
          (e) => this.onTodoUpdate(e),
          'Update',
          this.props.todo.description
        )
      )
    }

    body.child(
      HStack()
        .gap('5px')
        .child(
          Button(Text(`Edit ${this.props.todo.description}`), () =>
            this.toggleEditMode()
          )
        )
        .child(Button('Delete'))
    )

    return body
  }
}

export class TodoApp extends Component {
  render(): ElementNode {
    return Box()
      .styles({
        width: '100dvw',
        height: '100dvh'
      })
      .child(new UserTodosScreen().render())
  }
}
