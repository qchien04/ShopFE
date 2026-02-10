import { MIME_TYPES } from '@src/utils/mime-type'
import { message } from 'antd'
import { RcFile } from 'antd/lib/upload'

export const beforeUpload = (file: RcFile) => {
  const isAccess = [
    MIME_TYPES.jpg,
    MIME_TYPES.jpeg,
    MIME_TYPES.png,
    MIME_TYPES.gif,
    MIME_TYPES.mp4,
    MIME_TYPES.movie,
    MIME_TYPES.avi,
    MIME_TYPES.flv,
    MIME_TYPES.webm,
    MIME_TYPES.mts,
    MIME_TYPES.mpeg,
    MIME_TYPES.csv,
    MIME_TYPES.pdf,
    MIME_TYPES.doc,
    MIME_TYPES.docx,
    MIME_TYPES.xls,
    MIME_TYPES.xlsx,
    MIME_TYPES.ppt,
    MIME_TYPES.pptx,
    MIME_TYPES.txt,
    MIME_TYPES.xml,
    MIME_TYPES.odt,
    MIME_TYPES.ods,
    MIME_TYPES.mp3,
    MIME_TYPES.wav,
    MIME_TYPES.wma,
    MIME_TYPES.acc,
  ].includes(file.type)

  if (!isAccess) {
    message.error('File format not allowed to upload')
  }

  const isLt2M = file.size / 1024 / 1024 < 2
  if (!isLt2M) {
    message.error('File must smaller than 2MB!')
  }

  return !!isLt2M && isAccess
}

export const beforeUploadImage = (file: RcFile) => {
  const isJpgOrPng = file.type === MIME_TYPES.jpeg || MIME_TYPES.jpg || file.type === MIME_TYPES.png
  if (!isJpgOrPng) {
    message.error('You can only upload JPG/PNG file!')
  }
  const isLt2M = file.size / 1024 / 1024 < 2
  if (!isLt2M) {
    message.error('Image must smaller than 2MB!')
  }

  return isJpgOrPng && isLt2M
}

export const getBase64 = (img: RcFile, callback: (url: string) => void) => {
  const reader = new FileReader()
  reader.addEventListener('load', () => callback(reader.result as string))
  reader.readAsDataURL(img)
}
