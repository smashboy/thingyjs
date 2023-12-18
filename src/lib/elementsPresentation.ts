import {
  Button,
  ButtonSize,
  ButtonStyle,
  ButtonVariant,
  HStack,
  VStack
} from './elements'

const primaryButton = HStack()
  .gap('10px')
  .child(Button('Primary filled'))
  .child(Button('Primary tinted').style(ButtonStyle.tinted))
  .child(Button('Primary plain').style(ButtonStyle.plain))

const normalButton = HStack()
  .gap('10px')
  .child(Button('Normal filled').variant(ButtonVariant.normal))
  .child(
    Button('Normal tinted')
      .variant(ButtonVariant.normal)
      .style(ButtonStyle.tinted)
  )
  .child(
    Button('Normal plain')
      .variant(ButtonVariant.normal)
      .style(ButtonStyle.plain)
  )

const buttonSize = HStack()
  .gap('10px')
  .child(Button('Small').size(ButtonSize.sm))
  .child(Button('Medium'))
  .child(Button('Large').size(ButtonSize.lg))

export const elementsPresentation = VStack()
  .gap('10px')
  .child(primaryButton)
  .child(normalButton)
  .child(buttonSize)
