import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Card, Breadcrumb, Form, Button, Space, Input, Radio, Upload, Modal, message } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import styles from './index.module.scss'

import Channel from 'components/Channel'
import { baseURL } from 'utils/request'
import { addArticle } from 'api/article'

export default class ArticlePublicsh extends Component {
  state = {
    type: 1,
    fileList: [],
    previewVisible: false,
    previewImage: '',
    id: !!this.props.match.params.id
  }
  formRef = React.createRef()

  render() {
    const { fileList, type, previewVisible, previewImage, id } = this.state
    console.log(this.props.match.params.id)
    return (
      <div className={styles.root}>
        <Card title={
          <Breadcrumb>
            <Breadcrumb.Item>
              <Link to={'/home'}>首页</Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>
              {id ? '编辑文章' : '发布文章'}
            </Breadcrumb.Item>
          </Breadcrumb>
        }>
          <Form
            ref={this.formRef}
            labelCol={{ span: 4 }}
            size='large'
            validateTrigger={['onChange', 'onBlur']}
            onFinish={this.onFinish}
            initialValues={{
              content: '',
              type: type
            }}
          >
            <Form.Item
              label='标题'
              rules={[
                {
                  required: true,
                  message: "文章的标题不能为空"
                }
              ]}
              name='title'
            >
              <Input
                style={{ width: 400 }}
                placeholder="请输入文章的标题"
              />
            </Form.Item>
            <Form.Item label='频道' name={'channels_id'} rules={[
              {
                required: true,
                message: "请选择频道"
              }
            ]}>
              <Channel />
            </Form.Item>
            <Form.Item label='封面' name='type'>
              <Radio.Group onChange={this.changeType}>
                <Radio value={1}>单图</Radio>
                <Radio value={3}>多图</Radio>
                <Radio value={0}>无图</Radio>
              </Radio.Group>
            </Form.Item>
            <Form.Item wrapperCol={{ offset: 4 }}>
              {
                type !== 0 && (
                  <Upload
                    listType="picture-card"
                    fileList={this.state.fileList}
                    action={`${baseURL}/upload`}
                    name='image'
                    onChange={this.uploadImage}
                    onPreview={this.handlePreview}
                    beforeUpload={this.beforeUpload}
                  >
                    {
                      fileList.length < type && (
                        <PlusOutlined />
                      )
                    }
                  </Upload>)
              }
            </Form.Item>
            <Form.Item label='内容' name={'content'} rules={[
              {
                required: true,
                message: "文章的内容不能为空"
              }
            ]}>
              <ReactQuill
                theme='snow'
                placeholder='请输入文章的内容'
                className='ql-editor'
              ></ReactQuill>
            </Form.Item>
            <Form.Item wrapperCol={{ offset: 4 }}>
              <Space>
                <Button type='primary' size='large' htmlType='submit'>{id ? '编辑文章' : '发布文章'}</Button>
                <Button size='large' onClick={this.addDraft}>存入草稿</Button>
              </Space>
            </Form.Item>
          </Form>
        </Card>
        <Modal visible={previewVisible} title={'图片预览'} footer={null} onCancel={this.handleCancel}>
          <img
            alt="example"
            style={{
              width: '100%',
            }}
            src={previewImage}
          />
        </Modal>
      </div>
    )
  }

  async componentDidMount() {

  }

  changeType = (e) => {
    this.setState({
      type: e.target.value,
      fileList: []
    })
  }

  handlePreview = (file) => {
    // console.log(file)
    const url = file.url || file.response.data.url
    this.setState({
      previewVisible: true,
      previewImage: url
    })
  }

  handleCancel = () => {
    this.setState({
      previewVisible: false,
      previewImage: ''
    })
  }

  beforeUpload = (file) => {
    if (file.size > 1024 * 500) {
      message.warning('上传的文件不能超过500K')
      return Upload.LIST_IGNORE
    }
    return true
  }

  uploadImage = ({ fileList }) => {
    this.setState({
      fileList
    })
  }

  async save(value, draft) {
    const { fileList, type } = this.state
    if (fileList.length !== type) {
      message.warning('上传的图片数量不正确')
    }
    const images = fileList.map(item => item.url || item.response.data.url)
    await addArticle({
      ...value,
      cover: {
        type,
        images
      }
    },
      draft)
    message.success('添加成功')
    this.props.history.push('/home/list')
  }

  onFinish = (value) => {
    this.save(value, false)
  }

  addDraft = async () => {
    const value = await this.formRef.current.validateFields()
    this.save(value, true)
  }

}
