import { FileSyncOutlined } from '@ant-design/icons'
import { Card, Row, Skeleton } from 'antd'

const { Meta } = Card

function SkeletonFile() {
  return (
    <Skeleton.Node active className="skeleton-file-media">
      <Card
        size="small"
        hoverable
        className="card-file-item"
        cover={
          <Row align="middle" justify="center" className="card-cover-dox">
            <FileSyncOutlined />
          </Row>
        }
      >
        <Meta description={<Skeleton.Input active block style={{ height: 22 }} />} />
      </Card>
    </Skeleton.Node>
  )
}

export default SkeletonFile
