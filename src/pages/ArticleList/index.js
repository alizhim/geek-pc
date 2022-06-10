import React, { Component } from 'react'
import {
  Card,
  Breadcrumb,
  Form,
  Radio,
  Button,
  DatePicker,
  Table,
  Tag,
  Space,
  Modal,
  message
} from 'antd'
import {EditOutlined, DeleteOutlined, ExclamationCircleOutlined} from '@ant-design/icons'
import { Link } from 'react-router-dom'


import { ArticleStatus } from 'api/constants'
import { getArticles, delArticles } from 'api/article';
import defaultImg from 'assets/defaultImage.png'
import Channel from 'components/Channel'

const { RangePicker } = DatePicker
const { confirm } = Modal;


export default class ArticleList extends Component {

  reqParams = {
    page: 1,
    per_page: 10
  }
  
  columns = [
    {
      title: '封面',
      render(data) {
        if (data.cover.type === 0) {
          return (
            <img
              src={defaultImg}
              alt=''
              style={{width: 200, height: 120, objectFix: 'cover'}}
            />
          )  
        }
        return (
          <img
          src={data.cover.images[0]}
          alt=''
          style={{width: 200, height: 120, objectFix: 'cover'}}
          />
        )
      }
    },
    {
      title: '标题',
      dataIndex: 'title',
    },
    {
      title: '状态',
      dataIndex: 'status',
      render(status) {
        const obj = ArticleStatus.find(item => item.id === status)
        return <Tag color={obj.color}>{obj.name}</Tag>
      }
    },
    {
      title: '发布时间',
      dataIndex: 'pubdate',
    },
    {
      title: '阅读数',
      dataIndex: 'read_count',
    },
    {
      title: '评论数',
      dataIndex: 'comment_count',
    },
    {
      title: '点赞数',
      dataIndex: 'like_count',
    },
    {
      title: '操作',
      render: (data) => {
        return <>
          <Space>
            <Button
              type="primary"
              shape="circle"
              icon={<EditOutlined />}
              onClick={() => this.handleEdit(data.id)}
            >
            </Button>
            <Button
              type="primary"
              shape="circle"
              danger
              icon={<DeleteOutlined />}
              onClick={() => this.handleDelete(data.id)}
            >
            </Button>
          </Space>
        </>
      }
    }
  ];

  state = {
    articles: {}
  }
  render() {
    const{total_count, results, page, per_page} = this.state.articles
    return (
      <div>
        <Card title={
          <Breadcrumb>
            <Breadcrumb.Item>
              <Link to={'/home'}>首页</Link>
            </Breadcrumb.Item>
          <Breadcrumb.Item>
            文章列表
          </Breadcrumb.Item>
        </Breadcrumb>
        }>
          <Form onFinish={this.onFinish} initialValues={{status: -1}}>
            <Form.Item label='状态' name={'status'}>
              <Radio.Group>
                {
                  ArticleStatus.map(item => <Radio value={item.id} key={item.id}>{item.name}</Radio>)
                }
              </Radio.Group>
            </Form.Item>
            <Form.Item label='频道' name={'channels_id'}>
              <Channel />
            </Form.Item>
            <Form.Item label='日期' name={'data'} >
              <RangePicker />
            </Form.Item>
            <Form.Item>
              <Button type='primary' htmlType='submit'>筛选</Button>
            </Form.Item>
          </Form>
        </Card>
        <Card title={`根据筛选条件共查询到 ${total_count}条数据`}>
          <Table
            dataSource={results}
            columns={this.columns}
            rowKey='id'
            pagination={{
              position: ['bottomCenter'],
              total: total_count,
              current: page,
              defaultPageSize: per_page,
              onChange: this.onChange
            }}
          />
        </Card>
      </div>
    )
  }
  handleEdit = (id) => {
    this.props.history.push(`/home/publish/:id`)
  }

  handleDelete = (id) => {
    console.log(id)
    confirm({
      title: '温馨提示?',
      icon: <ExclamationCircleOutlined />,
      content: '你确定要删除这篇文章？',
  
      onOk: async () => {
        await delArticles(id)
        this.getArticlesList()
        message.success('删除成功')
      },
    });
  }

  componentDidMount() {
    this.getArticlesList()
  }

  async getArticlesList() {
    const res = await getArticles(this.reqParams)
    this.setState({
      articles: res.data
    })
  }

  onFinish = ({status, channels_id, data}) => {
    if (status !== -1) {
      this.reqParams.status = status
    } else {
      delete this.reqParams.status
    }
    if (channels_id !== undefined) {
      this.reqParams.channels_id = channels_id
    } else {
      delete this.reqParams.channels_id
    }
    if (data) {
      this.reqParams.begin_pubdate = data[0].startOf('day').format('YYYY-MM-DD HH:mm:ss');
      this.reqParams.end_pubdate = data[1].endOf('day').format('YYYY-MM-DD HH:mm:ss');
    } else {
      delete this.reqParams.begin_pubdate
      delete this.reqParams.end_pubdate
    }
    this.reqParams.page = 1
    // console.log(this.reqParams)
    this.getArticlesList()
  }

  onChange = (page, pageSize) => {
    console.log(page, pageSize)
    this.reqParams.page = page
    this.reqParams.per_page = pageSize
    this.getArticlesList()
  }  
}

