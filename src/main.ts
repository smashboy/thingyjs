import { Box } from './lib/elements/Box'
import { Button } from './lib/elements/Button'
import { ElementNode } from './lib/elements/Element'
import { Form } from './lib/elements/Form'
import { HStack } from './lib/elements/HStack'
import { Input } from './lib/elements/Input'
import { Text, TextNode } from './lib/elements/Text'
import { VStack } from './lib/elements/VStack'
import './style.css'

interface Component {
  readonly Body: ElementNode
  onInit?: () => void
  onDestroy?: () => void
}

interface Todo {
  description: string
}

class TodoForm implements Component {
  readonly Body: ElementNode

  private readonly onNewTodo: (todo: Todo) => void
  private readonly buttonText: string
  private readonly initialValue: string

  constructor(
    onNewTodo: (todo: Todo) => void,
    buttonText = 'Create',
    initialValue = ''
  ) {
    this.onNewTodo = onNewTodo
    this.buttonText = buttonText
    this.initialValue = initialValue

    this.Body = Form((e) => this.onFormSubmit(e))
      .child(
        Input()
          .attribute('value', this.initialValue)
          .attribute('placeholder', 'Your todo...')
      )
      .child(Button(this.buttonText).submit())
  }

  onFormSubmit(event: SubmitEvent) {
    if (!event.target[0].value) return

    this.onNewTodo({ description: event.target[0].value })

    event.target[0].value = this.initialValue
  }
}

class UserTodosScreen implements Component {
  private readonly todos: Todo[] = []

  private readonly TodosCounterTitle = Text(`Total todos: ${this.todos.length}`)
  private readonly TodosList = Box()

  readonly Body = VStack()
    .child(this.TodosCounterTitle)
    .child(new TodoForm((e) => this.onNewTodo(e)).Body)
    .child(this.TodosList)

  private onNewTodo(todo: Todo) {
    this.todos.push(todo)

    this.TodosCounterTitle.setValue(`Total todos: ${this.todos.length}`)
    this.TodosList.child(
      new TodoItem(
        this.todos[this.todos.length - 1],
        this.todos.length - 1,
        this.TodosList
      ).Body
    )
  }
}

class TodoItem implements Component {
  private isInEditMode = false

  private readonly todo: Todo
  private readonly listIndex: number

  private readonly TodoItem: TextNode

  private readonly UpdateTodoForm: TodoForm

  private readonly ParentList: ElementNode

  Body: ElementNode

  constructor(todo: Todo, index: number, List: ElementNode) {
    this.todo = todo
    this.listIndex = index
    this.ParentList = List

    this.UpdateTodoForm = new TodoForm(
      (todo) => this.updateTodo(todo),
      'Update',
      this.todo.description
    )
    this.UpdateTodoForm.Body.child(
      Button('Cancel', () => this.toggleEditMode())
    )

    this.TodoItem = Text(`${this.todo.description}`)

    this.Body = VStack()
      .child(this.TodoItem)
      .child(
        HStack()
          .gap('5px')
          .child(Button('Edit', () => this.toggleEditMode()))
      )
  }

  toggleEditMode() {
    this.isInEditMode = !this.isInEditMode

    if (this.isInEditMode) {
      this.Body.replace(
        this.TodoItem._getElement(),
        this.UpdateTodoForm.Body._getElement()
      )
      return
    }

    this.Body.replace(
      this.UpdateTodoForm.Body._getElement(),
      this.TodoItem._getElement()
    )
  }

  updateTodo(todo: Todo) {
    this.toggleEditMode()
    this.TodoItem.setValue(todo.description)
  }
}

document
  .getElementById('app')
  ?.appendChild(new UserTodosScreen().Body._getElement())
