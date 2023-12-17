import { Component } from './lib/Component'
import { Box } from './lib/elements/Box'
import { Button } from './lib/elements/Button'
import { ElementNode } from './lib/elements/Element'
import { Form } from './lib/elements/Form'
import { HStack } from './lib/elements/HStack'
import { Input } from './lib/elements/Input'
import { Text, TextNode } from './lib/elements/Text'
import { VStack } from './lib/elements/VStack'
import './style.css'

interface Todo {
  description: string
}

class TodoForm extends Component {
  private initialValue: string
  private readonly onNewTodo: (todo: Todo) => void

  private readonly ButtonText = Text('')
  private readonly NewTodoInput = Input().attribute(
    'placeholder',
    'Your todo...'
  )

  readonly Body = Form((e) => this.onFormSubmit(e))
    .child(this.NewTodoInput)
    .child(Button(this.ButtonText).submit())

  constructor(
    onNewTodo: (todo: Todo) => void,
    buttonText = 'Create',
    initialValue = ''
  ) {
    super()

    this.initialValue = initialValue
    this.onNewTodo = onNewTodo

    this.NewTodoInput.value(initialValue)
    this.ButtonText.setValue(buttonText)
  }

  private onFormSubmit(event: SubmitEvent) {
    if (!event.target[0].value) return

    this.onNewTodo({ description: event.target[0].value })

    this.NewTodoInput.value(this.initialValue)
  }

  setInitialValue(value: string) {
    this.initialValue = value
    this.NewTodoInput.value(value)
  }
}

class UserTodosScreen extends Component {
  private readonly todos: Todo[] = []

  private readonly TodosCounterTitle = Text(`Total todos: ${this.todos.length}`)
  private readonly TodosList = Box()

  readonly Body = VStack()
    .child(this.TodosCounterTitle)
    .child(new TodoForm((e) => this.onNewTodo(e)))
    .child(this.TodosList)

  private onNewTodo(todo: Todo) {
    this.todos.push(todo)

    this.TodosCounterTitle.setValue(`Total todos: ${this.todos.length}`)
    this.TodosList.child(
      new TodoItem(this.todos[this.todos.length - 1], this.TodosList)
    )
  }
}

class TodoItem extends Component {
  private isInEditMode = false

  private readonly todo: Todo

  private readonly TodoItemText: TextNode = Text('')
  private readonly UpdateTodoForm = new TodoForm(
    (todo) => this.updateTodo(todo),
    'Update',
    ''
  )
  private readonly ParentList: ElementNode

  Body = VStack()
    .child(this.TodoItemText)
    .child(
      HStack()
        .gap('5px')
        .child(Button('Edit', () => this.toggleEditMode()))
        .child(Button('Delete', () => this.deleteTodo()))
    )

  constructor(todo: Todo, List: ElementNode) {
    super()

    this.todo = todo
    this.ParentList = List

    this.UpdateTodoForm.setInitialValue(todo.description)
    this.UpdateTodoForm.Body.child(
      Button('Cancel', () => this.toggleEditMode())
    )

    this.TodoItemText.setValue(this.todo.description)
  }

  toggleEditMode() {
    this.isInEditMode = !this.isInEditMode

    if (this.isInEditMode) {
      this.Body.replace(this.TodoItemText, this.UpdateTodoForm)
      return
    }

    this.Body.replace(this.UpdateTodoForm, this.TodoItemText)
  }

  updateTodo(todo: Todo) {
    this.UpdateTodoForm.setInitialValue(todo.description)
    this.toggleEditMode()
    this.TodoItemText.setValue(todo.description)
  }

  deleteTodo() {
    this.ParentList.removeChild(this)
  }
}

document
  .getElementById('app')
  ?.appendChild(new UserTodosScreen().Body._getElement())
