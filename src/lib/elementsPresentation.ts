import { Button, HStack, VStack } from './elements'

const buttons = VStack().child(Button('Click me'))

export const elementsPresentation = HStack().child(buttons)
