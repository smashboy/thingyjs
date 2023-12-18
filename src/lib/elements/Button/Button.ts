import { ElementNode } from '../Element'
import { createNodeFunction } from '../../utils'
import { TextNode, Text } from '../Text/Text'
import classes from './Button.module.css'

export const ButtonVariant = {
  normal: 0,
  primary: 1,
  cancel: 2,
  destructive: 3
} as const

export const ButtonStyle = {
  filled: 0,
  tinted: 1,
  plain: 3
} as const

export const ButtonSize = {
  sm: 0,
  md: 1,
  lg: 3
} as const

export type TButtonVariant = (typeof ButtonVariant)[keyof typeof ButtonVariant]
export type TButtonStyle = (typeof ButtonStyle)[keyof typeof ButtonStyle]
export type TButtonSize = (typeof ButtonSize)[keyof typeof ButtonSize]

const ButtonSizeCssMap = {
  [ButtonSize.sm]: classes.sm,
  [ButtonSize.md]: classes.md,
  [ButtonSize.lg]: classes.lg
}

const ButtonVariantCssMap = {
  [ButtonVariant.normal]: classes.normal,
  [ButtonVariant.primary]: classes.primary,
  [ButtonVariant.cancel]: '',
  [ButtonVariant.destructive]: ''
}

const ButtonStyleCssMap = {
  [ButtonStyle.plain]: classes.plain,
  [ButtonStyle.filled]: classes.filled,
  [ButtonStyle.tinted]: classes.tinted
}

export class ButtonNode extends ElementNode<'button'> {
  private _variant: TButtonVariant = ButtonVariant.primary
  private _size: TButtonSize = ButtonSize.md
  private _style: TButtonStyle = ButtonStyle.filled

  constructor(
    label: TextNode | string,
    onClick?: (event: HTMLElementEventMap['click']) => void
  ) {
    super('button')

    this.child(typeof label === 'string' ? Text(label) : label)
    this.buildClassName()

    if (onClick) {
      this.onClick(onClick)
    }
  }

  variant(variant: TButtonVariant) {
    this._variant = variant
    this.buildClassName()
    return this
  }

  size(size: TButtonSize) {
    this._size = size
    this.buildClassName()
    return this
  }

  style(style: TButtonStyle) {
    this._style = style
    this.buildClassName()
    return this
  }

  onClick(onClick: (event: HTMLElementEventMap['click']) => void) {
    this.listen('click', onClick)
    return this
  }

  submit() {
    this.attribute('type', 'submit')
    return this
  }

  private buildClassName() {
    this.resetClassName().className(
      classes.root,
      ButtonVariantCssMap[this._variant],
      ButtonStyleCssMap[this._style],
      ButtonSizeCssMap[this._size]
    )
  }
}

export const Button = createNodeFunction<typeof ButtonNode, ButtonNode>(
  // @ts-ignore
  ButtonNode
)
