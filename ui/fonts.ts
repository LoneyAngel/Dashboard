import { Oswald,Inter,Zen_Antique } from 'next/font/google'
import localFont from 'next/font/local'
// next对字体的更好的支持
// goodlefont有的就用goodlefont因为这个字体样式齐全，没有的就下载
export const oswald = Oswald({
    //subjects字符集
  subsets: ['latin'],
  display: 'swap',
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-oswald',
})

export const inter = Inter({
    //subjects字符集
  subsets: ['latin'],
  display: 'swap',
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-inter',
})
export const karrik = localFont({
  src: [
    {
      path: '../public/fonts/Karrik-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
  ],
  variable: '--font-karrik',
})
export const zenAntique = localFont({
  src: [
    {
      path: '../public/fonts/ZenAntique-Regular.ttf',
      weight: '400',
      style: 'normal',
    },
  ],
  variable: '--font-zenantique',
})