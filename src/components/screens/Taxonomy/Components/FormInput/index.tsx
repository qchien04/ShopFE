import { Form, Input, TreeSelect } from 'antd'
import { labelStyle } from '@configs/const.config'
import { SHOW_ALL } from 'rc-tree-select'
import { TTaxonomy, TTaxonomyMakeTree } from '@src/modules'

type TFormInput = {
  taxonomyMakeTree: TTaxonomyMakeTree[]
  data?: TTaxonomy
}

function FormInput({ taxonomyMakeTree, data }: TFormInput) {
  return (
    <>
      <Form.Item
        name="name"
        label="Name"
        {...labelStyle}
        initialValue={data?.name}
        rules={[
          {
            required: true,
            message: 'Name is required!',
          },
          {
            max: 151,
            message: 'Name cannot be longer than 151 characters',
          },
          {
            min: 3,
            message: 'Name must be at least 3 characters',
          },
        ]}
      >
        <Input placeholder="Please enter name" />
      </Form.Item>
      <Form.Item name="description" label="Description" {...labelStyle} initialValue={data?.description}>
        <Input.TextArea placeholder="Please enter description" rows={5} />
      </Form.Item>
      {!data && (
        <Form.Item name="parentId" label="Parent" {...labelStyle}>
          <TreeSelect
            treeData={taxonomyMakeTree}
            dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
            placeholder="Please select parent"
            fieldNames={{ label: 'name', value: '_id', children: 'children' }}
            bordered
            showCheckedStrategy={SHOW_ALL}
            treeLine
            treeDefaultExpandAll
            dropdownMatchSelectWidth={false}
            allowClear
          />
        </Form.Item>
      )}
    </>
  )
}

export default FormInput
