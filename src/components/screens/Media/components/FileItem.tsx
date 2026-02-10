import { Card, Dropdown, message, Row, Typography } from 'antd'
import type { MenuProps } from 'antd'
import {
  DeleteOutlined,
  EditOutlined,
  FileExclamationOutlined,
  FileTextOutlined,
  FolderOpenOutlined,
  LinkOutlined,
  PlaySquareOutlined,
} from '@ant-design/icons'
import { LazyLoadImage } from 'react-lazy-load-image-component'
import placeholderImage from '@assets/placeholder-image.jpeg'
import { TFile } from '@src/modules'
import { useMemo } from 'react'
import { regexAudio, regexDocument, regexImage, regexVideo } from '@src/utils/regex'

const { Meta } = Card
const { Text } = Typography

type TFileItem = {
  file: TFile
  handleEdit?: (file: TFile | undefined) => void
  handleDelete?: (id: string) => void
  handleMove?: (file: TFile | undefined) => void
  handleClick?: (file: TFile | undefined) => void
}

function FileItem({ file, handleDelete, handleEdit, handleMove, handleClick }: TFileItem) {
  const fileType: 'docx' | 'image' | 'audio' | 'unknown' = useMemo(() => {
    if (file?.originalname?.match(regexImage)) {
      return 'image'
    }
    if (file?.originalname?.match(regexDocument)) {
      return 'docx'
    }
    if (file?.originalname?.match(regexVideo) || file?.originalname?.match(regexAudio)) {
      return 'audio'
    }
    return 'unknown'
  }, [file])

  const items: MenuProps['items'] = useMemo(
    () => [
      {
        label: 'Edit',
        key: '0',
        icon: <EditOutlined />,
        onClick: () => {
          if (handleEdit) void handleEdit(file)
        },
      },
      {
        label: 'Remove',
        key: '1',
        icon: <DeleteOutlined />,
        onClick: () => {
          if (handleDelete) void handleDelete(file?._id)
        },
      },
      {
        label: 'Get Url',
        key: '3',
        icon: <LinkOutlined />,
        onClick: () => {
          navigator.clipboard.writeText(file.location)
          message.success('Copy')
        },
      },
      {
        label: 'Move to folder',
        key: '4',
        icon: <FolderOpenOutlined />,
        onClick: () => {
          if (handleMove) void handleMove(file)
        },
      },
    ],
    [file],
  )
  return (
    <Dropdown menu={{ items }} trigger={['contextMenu']}>
      <Card
        size="small"
        hoverable
        className="card-file-item"
        onClick={() => {
          if (handleClick) void handleClick(file)
        }}
        cover={
          <>
            {fileType === 'image' && (
              <LazyLoadImage
                height={100}
                width="100%"
                src={file.location}
                className="card-cover"
                effect="blur"
                placeholderSrc={placeholderImage}
                loading="lazy"
                alt={file.name}
              />
            )}
            {fileType === 'docx' && (
              <Row align="middle" justify="center" className="card-cover-dox">
                <FileTextOutlined />
              </Row>
            )}
            {fileType === 'audio' && (
              <Row align="middle" justify="center" className="card-cover-dox">
                <PlaySquareOutlined />
              </Row>
            )}
            {fileType === 'unknown' && (
              <Row align="middle" justify="center" className="card-cover-dox">
                <FileExclamationOutlined />
              </Row>
            )}
          </>
        }
      >
        <Meta
          description={
            <Text ellipsis style={{ fontSize: 12 }}>
              {file.name}
            </Text>
          }
        />
      </Card>
    </Dropdown>
  )
}

export default FileItem
