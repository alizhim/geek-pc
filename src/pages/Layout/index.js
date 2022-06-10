import React, { Component } from 'react'
import { LogoutOutlined, HomeOutlined, DiffOutlined, EditOutlined  } from '@ant-design/icons';
import { Layout, Menu, message, Popconfirm } from 'antd';
import { Switch, Link, Route } from 'react-router-dom';

import styles from './index.module.scss'
import Home from 'pages/Home';
import ArticleList from 'pages/ArticleList';
import ArticlePublicsh from 'pages/ArticlePublish';
import { removeToken } from 'utils/storage';
import AuthRoute from 'components/AuthRoute';
import { getUserInfo } from 'api/user';

const { Header, Content, Sider } = Layout;

export default class LayoutComponent extends Component {
  state = {
    profile: [],
  }
  render() {
    return (
      <div className={styles.layout}>
        <Layout>
          <Header className="header">
            <div className="logo" />
            <div className='profile'>
              <span>{ this.state.profile.name }</span>
              <span>
                <Popconfirm
                  title={'确定退出本系统吗？'}
                  onConfirm={this.confirm}
                  okText="确定"
                  cancelText="取消"
                >
                  <LogoutOutlined /> 退出
                </Popconfirm>
              </span>
            </div>
          </Header>
          <Layout>
            <Sider width={200} >
              <Menu
                theme='dark'
                mode="inline"
                defaultSelectedKeys={[this.props.location.pathname]}
                style={{
                  height: '100%',
                  borderRight: 0,
                }}>
                <Menu.Item key={'/home'} icon={<HomeOutlined />}>
                  <Link to='/home'>数据概览</Link>
                </Menu.Item>
                <Menu.Item key={'/home/list'} icon={<DiffOutlined />}>
                  <Link to='/home/list'>内容管理</Link>
                </Menu.Item>
                <Menu.Item key={'/home/publish'} icon={<EditOutlined />}>
                  <Link to='/home/publish'>发布文章</Link>
                </Menu.Item>
              </Menu>
            </Sider>
            <Layout
              style={{
                padding: '24px',
                overflow: 'auto'
              }}
            >
              <Content
                className="site-layout-background"
              >
                <Switch>
                  <AuthRoute path={'/home'} component={Home} exact></AuthRoute>
                  <AuthRoute path={'/home/list'} component={ArticleList} />
                  <AuthRoute path={'/home/publish'} component={ArticlePublicsh} exact />
                  <AuthRoute path={'/home/publish/:id'} component={ArticlePublicsh} />
                </Switch>
              </Content>
            </Layout>
          </Layout>
        </Layout>
      </div>
    )
  }

  async componentDidMount() {
    const res = await getUserInfo()
    this.setState({
      profile: res.data
    })
  }


  confirm = () => {
    removeToken()
    this.props.history.push('/login')
    message.success('退出成功', 1)
  }
}
