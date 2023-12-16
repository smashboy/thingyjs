import { Box } from './lib/elements/Box'
import { Button } from './lib/elements/Button'
import { Element } from './lib/elements/Element'
import { HStack } from './lib/elements/HStack'
import { Title } from './lib/elements/Title'
import { VStack } from './lib/elements/VStack'
import render from './lib/renderer'
import { state } from './lib/state'
import './style.css'

const myState = state({ counter: 0 })

const app = VStack()
  .child(Title(() => `Count: ${myState.counter}`, 1, myState))
  .child(Title(() => `Another count: ${myState.counter * 2}`, 1, myState))
  .child(
    HStack()
      .child(
        Button('+', () => (myState.counter += 1000)).styles({
          backgroundColor: 'green'
        })
      )
      .child(
        Button('-', () => {
          if (myState.counter > 0) {
            myState.counter -= 1000
          }
        }).styles({ backgroundColor: 'red' })
      )
  )
  .child(Box(myState).child(() => (myState.counter % 2 === 0 ? 'Test' : null)))
  .child(
    Box(myState)
      .styles(() => ({
        width: '100px',
        height: '100px',
        backgroundColor:
          Number(myState.counter.toString().split('')[0]) % 2 === 0
            ? 'green'
            : 'red',
        margin: '10px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }))
      .child(() => `${myState.counter}`)
  )
  .child(
    Element('ul', myState)
      // .forEachChild(
      //   () => Array.from({ length: myState.counter }).fill("Item") as string[],
      //   (item, index) =>
      //     Element("li")
      //       .styles({ backgroundColor: index % 2 === 0 ? "green" : "red" })
      //       .child(`${item}: ${index + 1}`)
      // )
      .forEachChild(
        () => Array.from({ length: myState.counter }).fill('Item') as string[],
        (item, index) =>
          Element('li')
            .styles({
              backgroundColor: index % 2 === 0 ? 'green' : 'red'
            })
            .child(`${item}: ${index + 1}`)
      )
      .child(Element('li', myState).child(() => `Total: ${myState.counter}`))
      .child(
        Element('li', myState).child(
          () => `Yet another total: ${myState.counter}`
        )
      )
  )

render(document.getElementById('app')!, app)
