import { DeleteOutlined, EditOutlined, FolderFilled, FolderOpenOutlined } from '@ant-design/icons'
import { Card, Col, Dropdown, Row, Typography } from 'antd'
import type { MenuProps } from 'antd'
import { TFolder } from '@src/modules'
import { useMemo } from 'react'

const { Text } = Typography

export type TFolderItem = {
  folder: TFolder
  handleClick?: (id: string) => void
  handleEdit?: (folder: TFolder | undefined) => void
  handleDelete?: (id: string) => void
  handleMove?: (folder: TFolder | undefined) => void
}

function FolderItem({ folder, handleClick, handleEdit, handleDelete, handleMove }: TFolderItem) {
  const items: MenuProps['items'] = useMemo(
    () => [
      {
        label: 'Edit',
        key: '0',
        icon: <EditOutlined />,
        onClick: () => {
          if (handleEdit) void handleEdit(folder)
        },
      },
      {
        label: 'Remove',
        key: '1',
        icon: <DeleteOutlined />,
        onClick: () => {
          if (handleDelete) void handleDelete(folder._id)
        },
      },
      {
        label: 'Move to folder',
        key: '4',
        icon: <FolderOpenOutlined />,
        onClick: () => {
          if (handleMove) void handleMove(folder)
        },
      },
    ],
    [folder],
  )
  return (
    <Dropdown menu={{ items }} trigger={['contextMenu']}>
      <Card
        size="small"
        bordered={false}
        className="card-folder-item"
        onClick={() => {
          if (handleClick) handleClick(folder._id)
        }}
      >
        <Row wrap={false} className="folder-item-container" justify="space-between" align="middle">
          <Col className="folder-item-icon">
            <FolderFilled />
          </Col>
          <Col className="folder-item-name">
            <Text ellipsis>{folder.name}</Text>
          </Col>
        </Row>
      </Card>
    </Dropdown>
  )
}

export default FolderItem
