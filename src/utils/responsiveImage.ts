import type { ImgHTMLAttributes } from 'react'

type ImageVariant = Pick<ImgHTMLAttributes<HTMLImageElement>, 'src' | 'srcSet' | 'width' | 'height'>

export function createImageProps(variants: Record<string, ImageVariant>) {
  return (src: string, sizes: string) => ({ ...variants[src], sizes })
}
