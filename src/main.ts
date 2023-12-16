import { Component } from './lib/Component'
import { Box } from './lib/elements/Box'
import { Button } from './lib/elements/Button'
import { Element, ElementNode } from './lib/elements/Element'
import { HStack } from './lib/elements/HStack'
import { Text } from './lib/elements/Text'
import { Title } from './lib/elements/Title'
import { VStack } from './lib/elements/VStack'
import render from './lib/renderer/renderer'
import { state } from './lib/state'
import './style.css'
import { TodoApp } from './todoapp'

const INC_VALUE = 1000

class PerformanceTest extends Component {
  private readonly myState = state({ counter: 0 }, this)

  private increment() {
    this.myState.counter += INC_VALUE
  }

  private decrement() {
    if (this.myState.counter > 0) {
      this.myState.counter -= INC_VALUE
    }
  }

  render(): ElementNode {
    const body = VStack()
      .child(Title(`Count: ${this.myState.counter}`, 1))
      .child(Title(`Another count: ${this.myState.counter * 2}`, 1))
      .child(
        HStack()
          .child(
            Button('+', () => this.increment()).styles({
              backgroundColor: 'green'
            })
          )
          .child(
            Button('-', () => this.decrement()).styles({
              backgroundColor: 'red'
            })
          )
      )

    const list = Element('ul')

    for (let index = 0; index < this.myState.counter; index++) {
      list.child(
        Element('li')
          .styles({
            backgroundColor: index % 2 === 0 ? 'green' : 'red'
          })
          .child(`Item: ${index + 1}`)
      )
    }

    list.child(
      Element('li').child(`List item counter: ${this.myState.counter}`)
    )
    list.child(
      Element('li').child(
        `Yet another list item counter: ${this.myState.counter}`
      )
    )

    if (Number(this.myState.counter.toString().split('')[0]) % 2 === 0) {
      body.child(Text('Test'))
    }

    body.child(
      Box()
        .styles({
          width: '100px',
          height: '100px',
          backgroundColor:
            Number(this.myState.counter.toString().split('')[0]) % 2 === 0
              ? 'green'
              : 'red',
          margin: '10px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        })
        .child(`${this.myState.counter}`)
    )

    body.child(list)

    return body
  }
}

render(document.getElementById('app')!, new TodoApp())
