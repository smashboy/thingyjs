import { Page } from '../lib/Page'
import landingThumbnailUrl from '../assets/landing-thumbnail.jpg'
import {
  Box,
  Button,
  HStack,
  Image,
  Text,
  Title,
  VStack
} from '../lib/elements'
import classes from './landing.module.css'
import { NetflixLogo } from '../components/NetflixLogo'

export class HomePage extends Page {
  Body = VStack().child(
    VStack()
      .className(classes.container)
      .child(
        Box()
          .className('absoluteContainer')
          .styles({
            zIndex: -1
          })
          .child(
            Image(landingThumbnailUrl, 'background thumbnail').styles({
              width: '100%',
              height: '100%',
              objectFit: 'cover'
            })
          )
          .child(
            Box().className('absoluteContainer').styles({
              backgroundImage:
                'linear-gradient(to top, rgba(0, 0, 0, 0.8) 0, rgba(0, 0, 0, 0.6) 60%, rgba(0, 0, 0, 0.8) 100%)'
            })
          )
      )
      .child(
        HStack()
          .justify('space-around')
          .styles({
            paddingTop: '1.5rem',
            position: 'relative'
          })
          .child(NetflixLogo())
          .child(Button('Login'))
      )
      .child(
        VStack()
          .align('center')
          .justify('center')
          .styles({
            flex: 1,
            marginTop: '-5rem'
          })
          .child(Title('Unlimited movies, TV shows, and more'))
          .child(Text('Watch anywhere. Cancel anytime.'))
          .child(
            Title(
              'Ready to watch? Enter your email to create or restart your membership.',
              3
            )
          )
      )
  )

  constructor() {
    super('/')
  }
}
