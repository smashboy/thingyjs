import * as CSS from 'csstype'
import { SvgMask } from '../lib/elements'
import netflixLogoUrl from '../assets/netflix-logo.svg'

export const NetflixLogo = (
  width: CSS.Property.Width = '9.25rem',
  height: CSS.Property.Width = '2.5rem'
) => SvgMask(netflixLogoUrl, width, height, 'var(--brand-color)')
